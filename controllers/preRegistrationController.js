const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all pre-registrations for a course
exports.getPreRegistrations =  async (req, res) => {
  const { courseId } = req.params;

  try {
    const preRegs = await prisma.student_pre_registered.findMany({
      where: { course_id: courseId },
      include: { student: true },
    });

    const formatted = preRegs.map((entry) => ({
      student_id: entry.student_id,
      name: entry.student.student_name,
      branch: entry.student.branch,
      program: entry.student.program,
      status: entry.accept_reject === null
        ? 'Pending'
        : entry.accept_reject
        ? 'Accepted'
        : 'Rejected',
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pre-registrations.' });
  }
};


// PATCH: Update pre-registration acceptance
exports.preRegistrationStatus =  async (req, res) => {
  const { courseId, studentId } = req.params;
  const { accept_reject } = req.body;

  try {
    const updated = await prisma.student_pre_registered.updateMany({
      where: {
        course_id: courseId,
        student_id: studentId,
      },
      data: { accept_reject },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: 'No pre-registration found.' });
    }

    // 2. If accepted, add to student_registered
    if (accept_reject === true) {
      // Fetch course type from pre-registration to keep consistency
      const preRegEntry = await prisma.student_pre_registered.findFirst({
        where: {
          course_id: courseId,
          student_id: studentId,
        },
      });

      if (!preRegEntry) {
        return res.status(404).json({ message: 'Pre-registration data not found.' });
      }

      // Check if already registered
      const alreadyRegistered = await prisma.student_registered.findFirst({
        where: {
          course_id: courseId,
          student_id: studentId,
        },
      });

      if (!alreadyRegistered) {
        await prisma.student_registered.create({
          data: {
            uid: `reg_${studentId}_${courseId}`,
            student_id: studentId,
            course_id: courseId,
            reg_course_type: preRegEntry.pre_reg_course_type,
            status: 'I',  // grades status
          },
        });
      }
    }

    res.json({
      message: `Student ${accept_reject ? 'accepted and registered' : 'rejected'} successfully.`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pre-registration status.', 
                            message:err });
  }
};




// exports.getPreRegistrations = async (req, res) => {
//   try {
//     const result = await prisma.student_pre_registered.findMany({
//       include: { student: true, course: true }
//     });
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// GET Pre-Registrations for faculty with optional filters
// exports.getPreRegistrations =  async (req, res) => {
//   try {
//     const { branch, program, rollno, status } = req.query;

//     const filters = {};

//     if (branch) filters.branch = branch;
//     if (program) filters.program = program;
//     if (rollno) filters.student_id = rollno;

//     const data = await prisma.student_pre_registered.findMany({
//       where: {
//         accept_reject: status === "accepted" ? true : status === "rejected" ? false : undefined,
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





