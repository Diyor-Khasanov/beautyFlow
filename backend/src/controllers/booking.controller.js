const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking.model");
const { checkMasterAvailability } = require("../utils/availability"); 
const createBooking = asyncHandler(async (req, res) => {
  const {
    masterId,
    date,
    startTime,
    durationMinutes,
    service,
    price,
    clientName,
    clientPhone,
  } = req.body;

  const isAvailable = await checkMasterAvailability(
    masterId,
    date,
    startTime,
    durationMinutes
  );

  if (!isAvailable) {
    res.status(400);
    throw new Error("Мастер занят или недоступен в это время.");
  }

  const booking = await Booking.create({
    master: masterId,
    date: new Date(date),
    startTime,
    durationMinutes,
    service,
    price,
    clientName,
    clientPhone,
    salon: req.user.salon,
  });

  res.status(201).json({
    message: "Бронирование успешно создано",
    booking,
  });
});

const getMasterBookingsByDate = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { date } = req.query;
  const bookings = await Booking.find({
    master: masterId,
    date: new Date(date),
  }).sort("startTime");

  res.status(200).json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Бронирование не найдено");
  }

  booking.status = status;
  await booking.save();

  res.json({ message: "Статус обновлен", booking });
});

module.exports = {
  createBooking,
  getMasterBookingsByDate,
  updateBookingStatus,
};
