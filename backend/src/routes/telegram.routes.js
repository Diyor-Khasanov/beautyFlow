const express = require("express");
const {
  handleWebhook,
  generateLink,
} = require("../controllers/telegram.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/webhook/:token", handleWebhook);
router.post("/generate-link", protect, generateLink);

module.exports = router;
