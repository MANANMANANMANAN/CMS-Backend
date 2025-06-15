const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getRegistrations
} = require('../controllers/registrationController');

// router.post('/', createRegistration);
router.get('/get-registrations', getRegistrations);

module.exports = router;