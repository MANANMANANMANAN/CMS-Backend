const courseService = require("../services/courseServices");

const getCoursesBySchool = async (req, res) => {
  const { school } = req.params;

  try {
    const courses = await courseService.getCoursesBySchool(school);

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this school" });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "Internal Server Error from controller" });
  }
};

module.exports = { getCoursesBySchool };
