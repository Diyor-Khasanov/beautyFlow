const express = require("express");
const { handleWebhook } = require("../controllers/telegram.controller");

const router = express.Router();
router.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, handleWebhook);

module.exports = router;
