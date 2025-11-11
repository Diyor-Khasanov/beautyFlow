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
    throw new Error("Please enter a phone number and password.");
  }

  const userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this number already exists.");
  }

  const userData = { phone, password, role, email };

  if (role === "owner") {
    if (!llcName || typeof llcName !== "string" || llcName.trim() === "") {
      res.status(400);
      throw new Error("Owner registration requires the LLC name (llcName).");
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
        "Master registration requires the Individual Entrepreneur Certificate number (individualEntrepreneurCertificate)."
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

    console.log(`[OTP] Generated code ${code} for ${phone}`);

    res.status(201).json({
      id: user._id,
      role: user.role,
      isVerified: user.isVerified,
      message: `User created. Verification code (OTP) sent to ${phone}.`,
    });
  } else {
    res.status(400);
    throw new Error("Failed to register user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error("Account not verified. Please confirm the code (OTP).");
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
    throw new Error("Invalid phone number or password");
  }
});

const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  if (!user || user.isVerified) {
    res.status(400);
    throw new Error("User not found or already verified.");
  }
  const { code, expires } = generateOTP();
  user.otpCode = code;
  user.otpExpires = expires;
  await user.save();

  console.log(`[OTP] Generated code ${code} for user ${phone}`);

  res.status(200).json({
    success: true,
    message: `OTP successfully generated and sent to ${phone}.`,
    otpExpires: expires,
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (user.otpCode !== otp) {
    res.status(400);
    throw new Error("Invalid OTP.");
  }
  if (user.otpExpires < new Date()) {
    res.status(400);
    throw new Error("OTP expired. Please request a new one.");
  }
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();
  const { accessToken, refreshToken } = generateAuthTokens(user._id);

  res.status(200).json({
    success: true,
    message: "Verification successful!",
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
