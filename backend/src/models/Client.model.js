const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    notes: String,
    lastVisit: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", ClientSchema);
