const express = require("express");
const {
  getSalonStats,
  getForecasting,
} = require("../controllers/analytics.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(protect);

const analyticsAccess = authorize(["owner", "admin", "master"]);

router.get("/stats/:salonId", analyticsAccess, getSalonStats);
router.get("/forecast/:salonId", analyticsAccess, getForecasting);

module.exports = router;
