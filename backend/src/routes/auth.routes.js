const express = require("express");
const {
  registerUser,
  authUser,
  sendOTP,
  verifyOTP,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
