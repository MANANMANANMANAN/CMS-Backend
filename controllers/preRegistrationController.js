const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPreRegistration = async (req, res) => {
  const { student_id, course_id, pre_reg_course_type, accept_reject } = req.body;
  try {
    const result = await prisma.student_pre_registered.create({
      data: {
        uid: Date.now().toString(),
        student_id,
        course_id,
        pre_reg_course_type,
        accept_reject,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// const express = require("express");
// const router = express.Router();


// GET Pre-Registrations for faculty with optional filters
exports.getPreRegistrations =  async (req, res) => {
  try {
    const { branch, program, rollno, status } = req.query;

    const filters = {};

    if (branch) filters.branch = branch;
    if (program) filters.program = program;
    if (rollno) filters.student_id = rollno;

    const data = await prisma.student_pre_registered.findMany({
      where: {
        accept_reject: status === "accepted" ? true : status === "rejected" ? false : undefined,
        student: {
          ...filters,
        },
      },
      include: {
        student: true,
        course: true,
      },
    });

    const result = data.map((entry) => ({
      student_id: entry.student.student_id,
      student_name: entry.student.student_name,
      branch: entry.student.branch,
      program: entry.student.program,
      course_code: entry.course.course_code,
      course_name: entry.course.course_name,
      status: entry.accept_reject ? "Accepted" : "Pending",
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching preregistration data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// GET all pre-registrations for a course
// router.get('/faculty/courses/:courseId/pre-registrations', async (req, res) => {
//   const { courseId } = req.params;

//   try {
//     const preRegs = await prisma.student_pre_registered.findMany({
//       where: { course_id: courseId },
//       include: { student: true },
//     });

//     const formatted = preRegs.map((entry) => ({
//       student_id: entry.student_id,
//       name: entry.student.student_name,
//       branch: entry.student.branch,
//       program: entry.student.program,
//       status: entry.accept_reject === null
//         ? 'Pending'
//         : entry.accept_reject
//         ? 'Accepted'
//         : 'Rejected',
//     }));

//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch pre-registrations.' });
//   }
// });


// PATCH: Update pre-registration acceptance
// router.patch('/courses/:courseId/students/:studentId/pre-registration', async (req, res) => {
exports.preRegistrationStatus =  async (req, res) => {
  const { courseId, studentId } = req.params;
  const { accept_reject } = req.body;

  try {
    const updated = await prisma.student_pre_registered.updateMany({
      where: {
        course_id: courseId,
        student_id: studentId,
      },
      data: {
        accept_reject,
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: 'Pre-registration entry not found.' });
    }

    res.json({ message: `Student ${accept_reject ? 'accepted' : 'rejected'} successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status.' });
  }
};

