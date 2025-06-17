const express = require('express');
const router = express.Router();
const { getRegistrations } = require('../controllers/registrationController');


router.get('/faculty/courses/:courseId/registrations', getRegistrations);

module.exports = router;