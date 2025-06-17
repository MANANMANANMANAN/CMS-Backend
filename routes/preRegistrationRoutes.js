const express = require('express');
const router = express.Router();
const {
  getPreRegistrations,
  preRegistrationStatus
} = require('../controllers/preRegistrationController');

router.get('/courses/:courseId/pre-registrations', getPreRegistrations);
router.patch('/courses/:courseId/pre-registrations/:studentId',preRegistrationStatus);
// router.patch('/faculty/courses/:courseId/students/:studentId/pre-registration',preRegistrationStatus);

module.exports = router;