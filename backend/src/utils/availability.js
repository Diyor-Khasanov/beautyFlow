const MasterSchedule = require("../models/MasterSchedule.model");
const Booking = require("../models/Booking.model");

const checkMasterAvailability = async (
  masterId,
  dateString,
  startTime,
  durationMinutes
) => {
  const bookingDate = new Date(dateString);
  const dayOfWeek = bookingDate.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const schedule = await MasterSchedule.findOne({ master: masterId });
  if (!schedule) return false;

  const exception = schedule.exceptions.find(
    (exc) => new Date(exc.date).toDateString() === bookingDate.toDateString()
  );
  if (
    exception &&
    (exception.status === "off" || exception.status === "busy")
  ) {
    return false;
  }

  const dailySchedule = schedule.weeklySchedule.find(
    (sch) => sch.dayOfWeek === dayOfWeek
  );
  if (!dailySchedule || dailySchedule.status !== "available") {
    return false;
  }
  return true;
};

module.exports = { checkMasterAvailability };
