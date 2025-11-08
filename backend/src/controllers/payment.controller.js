const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Booking = require("../models/Booking.model");
const SubscriptionPlan = require("../models/SubscriptionPlan.model");
const User = require("../models/User.model");

const activateSubscription = async (userId, planName, durationDays = 30) => {

  const user = await User.findById(userId);
  const plan = await SubscriptionPlan.findOne({ name: planName });

  if (!user || !plan) {
    console.error(
      `Ошибка активации: Пользователь ${userId} или план ${planName} не найден.`
    );
    return;
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + durationDays);

  user.subscription.plan = planName;
  user.subscription.isActive = true;
  user.subscription.expiryDate = expiryDate;
  await user.save();

  console.log(
    `[SUBSCRIPTION] Пользователь ${userId} активировал план ${planName} до ${expiryDate.toLocaleDateString()}`
  );
};

const verifyPaymeAuth = (req) => {
  const authHeader = req.headers["x-auth"];
  if (!authHeader || authHeader !== process.env.PAYME_SECRET_KEY) {
    return { error: { code: -32504, message: "AUTH_FAILED" } };
  }
  return null;
};

const handlePaymeWebhook = asyncHandler(async (req, res) => {
  const authError = verifyPaymeAuth(req);
  if (authError) {
    return res.json(authError);
  }

  const { method, params } = req.body;

  console.log(`[PAYME WEBHOOK] Получен метод: ${method}`);
  switch (method) {
    case "CheckPerformTransaction":
      const { account, amount } = params;
      return res.json({ result: { allow: true } });

    case "CreateTransaction":
      
      return res.json({
        result: {
          create_time: Date.now(),
          transaction: "fake_payme_txn_id",
          state: 1,
        },
      });

    case "PerformTransaction":
      const { account: performAccount } = params;
      await activateSubscription(performAccount.user_id, performAccount.plan);

      return res.json({
        result: {
          state: 2,
          perform_time: Date.now(),
          transaction: "fake_payme_txn_id",
        },
      });

    case "CancelTransaction":
      return res.json({
        result: {
          state: -1,
          cancel_time: Date.now(),
          transaction: "fake_payme_txn_id",
        },
      });

    default:
      return res.json({ error: { code: -32601, message: "Method not found" } });
  }
});

const verifyClickSign = (body, secretKey) => {
  const stringToHash =
    body.click_trans_id +
    body.service_id +
    secretKey +
    body.merchant_trans_id +
    (body.action === 1 ? body.sign_time : body.amount);

  const signature = crypto.createHash("md5").update(stringToHash).digest("hex");

  return signature === body.sign;
};

const handleClickWebhook = asyncHandler(async (req, res) => {
  const { action, error, merchant_trans_id, amount, sign } = req.body;

  if (!verifyClickSign(req.body, process.env.CLICK_SECRET_KEY)) {
    console.log(
      `[CLICK WEBHOOK] Ошибка подписи для транзакции ${merchant_trans_id}`
    );
    return res.json({
      click_response: -1,
      click_response_message: "SIGN_CHECK_FAILED",
    });
  }

  const [userId, planName] = merchant_trans_id.split("_");

  if (error !== "0") {
    return res.json({
      click_response: -9,
      click_response_message: "PAYMENT_FAILED_BY_CLICK",
    });
  }

  if (action === "0") {
    return res.json({ click_response: 0, click_response_message: "Success" });
  }

  if (action === "1") {
    await activateSubscription(userId, planName);
    return res.json({ click_response: 0, click_response_message: "Success" });
  }
  return res.json({
    click_response: -3,
    click_response_message: "Action not allowed",
  });
});

const initiatePayment = asyncHandler(async (req, res) => {
  const { planName, durationMonths = 1 } = req.body;
  const userId = req.user._id;

  const plan = await SubscriptionPlan.findOne({ name: planName });
  if (!plan) {
    res.status(404);
    throw new Error("План подписки не найден.");
  }

  const finalPrice = plan.priceUZS * durationMonths;
  const transactionId = `${userId}_${planName}_${Date.now()}`;
  const paymeLink = `${
    process.env.PAYME_BASE_URL
  }?ac.user_id=${userId}&ac.plan=${planName}&amount=${finalPrice * 100}`;

  const clickRedirectUrl = `${process.env.CLICK_BASE_URL}?service_id=${process.env.CLICK_SERVICE_ID}&merchant_id=${process.env.CLICK_MERCHANT_ID}&amount=${finalPrice}&transaction_param=${transactionId}`;

  res.status(200).json({
    success: true,
    message: "Используйте ссылки для оплаты",
    finalPrice,
    paymeLink,
    clickRedirectUrl,
    transactionId,
  });
});

module.exports = {
  handlePaymeWebhook,
  handleClickWebhook,
  initiatePayment,
};
