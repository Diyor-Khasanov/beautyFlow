const mongoose = require("mongoose");

const ScheduleEntrySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "busy", "off"],
    default: "available",
  },
});

const MasterScheduleSchema = new mongoose.Schema(
  {
    master: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },
    weeklySchedule: [ScheduleEntrySchema],

    exceptions: [
      {
        date: Date,
        status: { type: String, enum: ["off", "busy"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MasterSchedule", MasterScheduleSchema);
