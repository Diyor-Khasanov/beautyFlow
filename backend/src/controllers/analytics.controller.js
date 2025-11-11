const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Salon = require("../models/Salon.model");

const getSalonStats = asyncHandler(async (req, res) => {
  const { salonId } = req.params;
  const { _id: userId, role } = req.user;

  const salon = await Salon.findById(salonId);
  if (!salon || (role !== "admin" && !salon.owner.equals(userId))) {
    res.status(403);
    throw new Error("Access denied. You are not the owner of this salon.");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const bookingsToday = await Booking.aggregate([
    {
      $match: {
        salon: salon._id,
        status: "completed",
        createdAt: { $gte: today },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingsWeekly = await Booking.aggregate([
    {
      $match: {
        salon: salon._id,
        status: "completed",
        createdAt: { $gte: weekAgo },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);
  const masterLoad = await Booking.aggregate([
    {
      $match: {
        salon: salon._id,
        status: "completed",
        createdAt: { $gte: weekAgo },
      },
    },
    { $group: { _id: "$master", totalDuration: { $sum: "$durationMinutes" } } },
    { $sort: { totalDuration: -1 } },
  ]);
  const masterIds = masterLoad.map((item) => item._id);
  const masters = await User.find({ _id: { $in: masterIds } }).select("phone");

  const masterPerformance = masterLoad.map((item) => {
    const master = masters.find((m) => m._id.equals(item._id));
    return {
      masterName: master ? master.phone : "Unknown", // Translated
      totalHours: (item.totalDuration / 60).toFixed(1),
    };
  });

  res.status(200).json({
    success: true,
    stats: {
      revenueToday:
        bookingsToday.length > 0 ? bookingsToday[0].totalRevenue : 0,
      bookingsToday: bookingsToday.length > 0 ? bookingsToday[0].count : 0,
      revenueWeekly:
        bookingsWeekly.length > 0 ? bookingsWeekly[0].totalRevenue : 0,
      totalClients: salon.clientCount,
      masterPerformance,
    },
  });
});
const getForecasting = asyncHandler(async (req, res) => {
  const bookingCount = await Booking.countDocuments({
    salon: req.params.salonId,
    status: "completed",
  });
  const forecastedRevenueNextMonth = bookingCount * 100000;
  const emptyHours = [
    { day: "Mon", time: "13:00-15:00", suggestion: "15% discount on haircuts" }, // Translated
    { day: "Wed", time: "09:00-11:00", suggestion: "Happy hour, free coffee" }, // Translated
  ];

  res.status(200).json({
    success: true,
    forecast: {
      message: "This is a forecast based on your historical data (Dummy AI).", // Translated
      revenueNextMonth: forecastedRevenueNextMonth,
      growthPercentage: (Math.random() * 10 + 5).toFixed(2),
      emptyHoursSuggestions: emptyHours,
    },
  });
});

module.exports = {
  getSalonStats,
  getForecasting,
};
