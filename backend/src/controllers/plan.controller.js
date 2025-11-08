const asyncHandler = require("express-async-handler");
const SubscriptionPlan = require("../models/SubscriptionPlan.model");

const initializePlans = asyncHandler(async (req, res) => {
  const existingPlans = await SubscriptionPlan.countDocuments();
  if (existingPlans > 0) {
    return res.status(200).json({
      message: "Планы уже инициализированы.",
      plans: await SubscriptionPlan.find({}).sort({ priority: 1 }),
    });
  }

  const plans = [
    {
      name: "Free",
      priceUZS: 0,
      clientLimit: 50,
      employeeLimit: 1,
      features: ["Базовое расписание", "50 клиентов"],
      priority: 1,
    },
    {
      name: "Basic",
      priceUZS: 49000,
      clientLimit: 99999,
      employeeLimit: 99999,
      features: [
        "Неограниченное бронирование",
        "Неограниченные клиенты",
        "До 5 мастеров",
      ],
      priority: 2,
    },
    {
      name: "Premium",
      priceUZS: 99000,
      clientLimit: 99999,
      employeeLimit: 99999,
      features: [
        "Все возможности Basic",
        "Аналитика",
        "CRM",
        "Массовые сообщения",
      ],
      priority: 3,
    },
  ];

  const result = await SubscriptionPlan.insertMany(plans);

  res.status(201).json({
    success: true,
    message: "Планы подписки успешно инициализированы.",
    plans: result,
  });
});

const getPlans = asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find({}).sort({ priority: 1 });
  res.status(200).json({ success: true, plans });
});

module.exports = {
  initializePlans,
  getPlans,
};
