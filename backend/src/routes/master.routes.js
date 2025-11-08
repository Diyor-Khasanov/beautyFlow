const express = require("express");
const {
  setMasterSchedule,
  getMasterSchedule,
  addScheduleException,
  getMastersSortedByRating,
  getSalonMastersAndLocation,
} = require("../controllers/master.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/schedule/:masterId", getMasterSchedule);

router.get("/", getMastersSortedByRating);
router.get("/salon/:salonId", getSalonMastersAndLocation);

router.use(protect);

router.post(
  "/schedule/:masterId",
  authorize(["owner", "master"]),
  setMasterSchedule
);

router.put(
  "/exceptions/:masterId",
  authorize(["owner", "master"]),
  addScheduleException
);

module.exports = router;
