const express = require('express');
const router = express.Router();
const {
  getPreRegistrations,
  preRegistrationStatus
} = require('../controllers/preRegistrationController');

router.get('/faculty/courses/:courseId/pre-registrations', getPreRegistrations);
router.patch('/faculty/courses/:courseId/pre-registrations/:studentId',preRegistrationStatus);
// router.patch('/faculty/courses/:courseId/students/:studentId/pre-registration',preRegistrationStatus);

module.exports = router;