const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get(
  "/pre-final-courses/school/:school",
  courseController.getCoursesBySchool
);

module.exports = router;
