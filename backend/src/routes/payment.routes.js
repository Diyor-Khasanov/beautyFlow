const express = require("express");
const {
  handlePaymeWebhook,
  handleClickWebhook,
  initiatePayment,
} = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/payme-webhook", handlePaymeWebhook);
router.post("/click-webhook", handleClickWebhook);

router.post("/initiate", protect, initiatePayment);

module.exports = router;
