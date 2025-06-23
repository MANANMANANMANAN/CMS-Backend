const express = require("express");
const router = express.Router();
const profCourseReqController = require("../controllers/profCourseReqController");

router.post("/request-course", profCourseReqController.requestCourse);
router.delete("/cancel-course", profCourseReqController.cancelCourse);
router.post("/accept-reject",profCourseReqController.AcceptRejectCourse);
router.get(
  "/prof-requests/:profId",
  profCourseReqController.getCoursesByProfessor
);
router.get(
  "/course-requests/:courseId",
  profCourseReqController.getProfessorsByCourse
);

module.exports = router;
