const profCourseReqService = require("../services/profCourseReqService");

const requestCourse = async (req, res) => {
  const { profId, courseId } = req.body;
  try {
    const result = await profCourseReqService.createCourseRequest(
      profId,
      courseId
    );
    res
      .status(201)
      .json({ message: "Course requested successfully.", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const cancelCourse = async (req, res) => {
  const { profId, courseId } = req.body;
  try {
    const result = await profCourseReqService.cancelCourseRequest(
      profId,
      courseId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCoursesByProfessor = async (req, res) => {
  const { profId } = req.params;
  try {
    const courses = await profCourseReqService.getCoursesRequestedByProfessor(
      profId
    );
    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfessorsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const professors = await profCourseReqService.getProfessorsRequestedCourse(
      courseId
    );
    res.status(200).json({ data: professors });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const AcceptRejectCourse = async (req, res) => {
  const { acceptIds,rejectIds } = req.body;
  try {
      const message = await profCourseReqService.resolveRequest(
      acceptIds,rejectIds
    );
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  AcceptRejectCourse,
  requestCourse,
  cancelCourse,
  getCoursesByProfessor,
  getProfessorsByCourse,
};
