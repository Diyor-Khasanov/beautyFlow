const express = require("express");
const {
  createBooking,
  getMasterBookingsByDate,
  updateBookingStatus,
} = require("../controllers/booking.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/master/:masterId", protect, getMasterBookingsByDate);
router.put(
  "/:bookingId/status",
  protect,
  authorize(["master", "owner"]),
  updateBookingStatus
);

module.exports = router;
