const asyncHandler = require("express-async-handler");
const MasterSchedule = require("../models/MasterSchedule.model");
const Salon = require("../models/Salon.model");
const User = require("../models/User.model");

const checkMasterAccess = async (masterId, userId, role) => {
  const master = await User.findById(masterId);
  if (!master || !master.salon) {
    throw new Error("Master not found or not linked to a salon");
  }

  if (role === "admin") return true;

  const userSalon = await Salon.findOne({
    $or: [{ owner: userId }, { masters: userId }],
  });

  if (
    !userSalon ||
    !userSalon.masters.map((m) => m.toString()).includes(masterId.toString())
  ) {
    throw new Error("Access denied. Master does not belong to your salon.");
  }
  return userSalon;
};

const setMasterSchedule = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { weeklySchedule } = req.body;
  const { _id: userId, role } = req.user;

  if (role === "master" && masterId.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("A Master can only set the schedule for themselves.");
  }

  const salon = await checkMasterAccess(masterId, userId, role).catch((err) => {
    res.status(403);
    throw new Error(err.message);
  });

  const scheduleData = {
    master: masterId,
    salon: salon._id,
    weeklySchedule,
  };

  const schedule = await MasterSchedule.findOneAndUpdate(
    { master: masterId },
    scheduleData,
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Schedule successfully updated.",
    schedule,
  });
});

const getMasterSchedule = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const schedule = await MasterSchedule.findOne({ master: masterId }).select(
    "-__v -createdAt -updatedAt"
  );

  if (!schedule) {
    return res.status(200).json({
      master: masterId,
      weeklySchedule: [],
      message: "Schedule has not been configured yet.",
    });
  }

  res.status(200).json({
    success: true,
    schedule,
  });
});

const addScheduleException = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { date, status, notes } = req.body;

  if (
    req.user.role === "master" &&
    masterId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("No permission to change another master's schedule.");
  }

  await checkMasterAccess(masterId, req.user._id, req.user.role).catch(
    (err) => {
      res.status(403);
      throw new Error(err.message);
    }
  );

  const schedule = await MasterSchedule.findOne({ master: masterId });

  if (!schedule) {
    res.status(404);
    throw new Error(
      "Master's schedule not found. Configure the weekly schedule first."
    );
  }

  schedule.exceptions = schedule.exceptions.filter(
    (exc) => new Date(exc.date).toDateString() !== new Date(date).toDateString()
  );

  schedule.exceptions.push({ date: new Date(date), status, notes });

  await schedule.save();

  res.status(200).json({
    success: true,
    message: `Exception for date ${date} updated.`,
    schedule,
  });
});

const getMastersSortedByRating = asyncHandler(async (req, res) => {
  const masters = await User.find({ role: "master", isVerified: true })
    .select(
      "-password -otpCode -otpExpires -llcName -individualEntrepreneurCertificate"
    )
    .sort({ rating: -1, ratingCount: -1 })
    .limit(50);

  res.status(200).json(masters);
});

const getSalonMastersAndLocation = asyncHandler(async (req, res) => {
  const { salonId } = req.params;

  const salon = await Salon.findById(salonId).select(
    "name addressString location masters"
  );

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found.");
  }

  const masters = await User.find({
    _id: { $in: salon.masters },
    isVerified: true,
  }).select("phone email rating");

  res.status(200).json({
    salonName: salon.name,
    address: salon.addressString,
    location: salon.location.coordinates,
    masters: masters,
  });
});

module.exports = {
  setMasterSchedule,
  getMasterSchedule,
  addScheduleException,
  getMastersSortedByRating,
  getSalonMastersAndLocation,
};
