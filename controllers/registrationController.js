const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Only show accepted students (registered)
exports.getRegistrations = async (req, res) => {
  const { courseId } = req.params;

  try {
    const registrations = await prisma.student_registered.findMany({
      where: {
        course_id: courseId,
      },
      include: {
        student: true,
      },
    });

    const formatted = registrations.map((entry) => ({
      student_id: entry.student_id,
      name: entry.student.student_name,
      branch: entry.student.branch,
      program: entry.student.program,
      status: entry.status === 'I' ? 'Pending' : entry.status, // grade status
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registered students.' });
  }
};




// exports.getRegistrations =  async (req, res) => {
//   const { courseId } = req.params;

//   try {
//     const registered = await prisma.student_pre_registered.findMany({
//       where: {
//         course_id: courseId,
//         accept_reject: true,
//       },
//       include: { student: true },
//     });

//     const formatted = registered.map((entry) => ({
//       student_id: entry.student_id,
//       name: entry.student.student_name,
//       branch: entry.student.branch,
//       program: entry.student.program,
//       status: 'Accepted',
//     }));

//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch registered students.' });
//   }
// };



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

// exports.getRegistrations =  async (req, res) => {
//   try {
//     const { branch, program, rollno, status } = req.query;

//     const filters = {};

//     if (branch) filters.branch = branch;
//     if (program) filters.program = program;
//     if (rollno) filters.student_id = rollno;

//     const data = await prisma.student_pre_registered.findMany({
//       where: {
//         accept_reject: true,
//         student: {
//           ...filters,
//         },
//       },
//       include: {
//         student: true,
//         course: true,
//       },
//     });

//     const result = data.map((entry) => ({
//       student_id: entry.student.student_id,
//       student_name: entry.student.student_name,
//       branch: entry.student.branch,
//       program: entry.student.program,
//       course_code: entry.course.course_code,
//       course_name: entry.course.course_name,
//       status: entry.accept_reject ? "Accepted" : "Pending",
//     }));

//     res.json(result);
//   } catch (err) {
//     console.error("Error fetching preregistration data", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.RegisteredStudentsDetails = async (req, res) => {
//   try {
//     const result = await prisma.student_registered.findMany({
//       where:{
//         status: "I"  // students with grade "I"
//       },
//       include: { student: true, course: true }
//     });
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

