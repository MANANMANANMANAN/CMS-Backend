const express = require('express');
const router = express.Router();
const {
  createPreRegistration,
  getPreRegistrations,
  preRegistrationStatus
} = require('../controllers/preRegistrationController');

router.post('/create-registration', createPreRegistration);
router.get('/pre-registrations', getPreRegistrations);
router.patch('/registration-status',preRegistrationStatus);

module.exports = router;