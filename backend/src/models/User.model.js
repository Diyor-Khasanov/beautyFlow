const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["client", "master", "owner", "admin"],
      default: "client",
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
    },
    llcName: {
      type: String,
      trim: true,
    },
    individualEntrepreneurCertificate: {
      type: String,
      trim: true,
    },
    telegramId: {
      type: String,
      unique: true,
      sparse: true,
    },
    telegramLinkToken: {
      type: String,
      sparse: true,
    },
    telegramLinkExpires: {
      type: Date,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    otpCode: String,
    otpExpires: Date,

    subscription: {
      plan: {
        type: String,
        default: "Free",
        enum: ["Free", "Basic", "Premium"],
      },
      isActive: { type: Boolean, default: false },
      expiryDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
