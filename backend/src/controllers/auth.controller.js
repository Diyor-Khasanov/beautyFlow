const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");
const { generateAuthTokens } = require("../utils/jwt");
const { generateOTP } = require("../utils/otp");

const registerUser = asyncHandler(async (req, res) => {
  const {
    phone,
    password,
    role = "client",
    email,
    llcName,
    individualEntrepreneurCertificate,
  } = req.body;

  if (!phone || !password) {
    res.status(400);
    throw new Error("Пожалуйста, введите номер телефона и пароль.");
  }

  const userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400);
    throw new Error("Пользователь с этим номером уже существует.");
  }

  const userData = { phone, password, role, email };

  if (role === "owner") {
    if (!llcName || typeof llcName !== "string" || llcName.trim() === "") {
      res.status(400);
      throw new Error(
        "Для регистрации владельца необходимо указать наименование ООО (llcName)."
      );
    }
    userData.llcName = llcName.trim();
  }

  if (role === "master") {
    if (
      !individualEntrepreneurCertificate ||
      typeof individualEntrepreneurCertificate !== "string" ||
      individualEntrepreneurCertificate.trim() === ""
    ) {
      res.status(400);
      throw new Error(
        "Для регистрации мастера требуется номер сертификата ИП (individualEntrepreneurCertificate)."
      );
    }
    userData.individualEntrepreneurCertificate =
      individualEntrepreneurCertificate.trim();
  }

  const user = await User.create(userData);

  if (user) {
    const { code, expires } = generateOTP();
    user.otpCode = code;
    user.otpExpires = expires;
    await user.save();

    console.log(`[OTP] Сгенерирован код ${code} для ${phone}`);

    res.status(201).json({
      id: user._id,
      role: user.role,
      isVerified: user.isVerified,
      message: `Пользователь создан. Код верификации (OTP) отправлен на номер ${phone}.`,
    });
  } else {
    res.status(400);
    throw new Error("Не удалось зарегистрировать пользователя");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error(
        "Аккаунт не верифицирован. Пожалуйста, подтвердите код (OTP)."
      );
    }

    const { accessToken, refreshToken } = generateAuthTokens(user._id);

    res.json({
      id: user._id,
      phone: user.phone,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401);
    throw new Error("Неверный номер телефона или пароль");
  }
});

const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  if (!user || user.isVerified) {
    res.status(400);
    throw new Error("Пользователь не найден или уже верифицирован.");
  }
  const { code, expires } = generateOTP();
  user.otpCode = code;
  user.otpExpires = expires;
  await user.save();

  console.log(`[OTP] Сгенерирован код ${code} для пользователя ${phone}`);

  res.status(200).json({
    success: true,
    message: `OTP успешно сгенерирован и отправлен на номер ${phone}.`,
    otpExpires: expires,
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (user.otpCode !== otp) {
    res.status(400);
    throw new Error("Неверный OTP.");
  }
  if (user.otpExpires < new Date()) {
    res.status(400);
    throw new Error("OTP истек. Пожалуйста, запросите новый.");
  }
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();
  const { accessToken, refreshToken } = generateAuthTokens(user._id);

  res.status(200).json({
    success: true,
    message: "Верификация прошла успешно!",
    accessToken,
    refreshToken,
    user: { id: user._id, role: user.role },
  });
});

module.exports = {
  registerUser,
  authUser,
  sendOTP,
  verifyOTP,
};
