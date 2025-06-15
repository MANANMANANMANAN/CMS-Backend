const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// exports.createRegistration = async (req, res) => {
//   const { student_id, course_id, reg_course_type } = req.body;
//   try {
//     const result = await prisma.student_registered.create({
//       data: {
//         uid: Date.now().toString(),
//         student_id,
//         course_id,
//         reg_course_type,
//       },
//     });
//     res.status(201).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getRegistrations = async (req, res) => {
//   try {
//     const result = await prisma.student_registered.findMany({
//       include: { student: true, course: true }
//     });
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Only show accepted students (registered)
// router.get('/faculty/courses/:courseId/registrations', async (req, res) => {
exports.getRegistrations =  async (req, res) => {
  const { courseId } = req.params;

  try {
    const registered = await prisma.student_pre_registered.findMany({
      where: {
        course_id: courseId,
        accept_reject: true,
      },
      include: { student: true },
    });

    const formatted = registered.map((entry) => ({
      student_id: entry.student_id,
      name: entry.student.student_name,
      branch: entry.student.branch,
      program: entry.student.program,
      status: 'Accepted',
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registered students.' });
  }
};
