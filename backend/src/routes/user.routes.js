const express = require("express");
const {
  getUserProfile,
  updateUserProfile, 
} = require("../controllers/user.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
