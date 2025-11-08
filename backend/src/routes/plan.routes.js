const express = require("express");
const { getPlans, initializePlans } = require("../controllers/plan.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getPlans);
router.get("/init", protect, authorize("admin"), initializePlans);
module.exports = router;
