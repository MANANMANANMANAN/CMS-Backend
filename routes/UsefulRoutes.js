const express = require("express");
const router = express.Router();
const UsefulController = require("../controllers/UsefulController");
const {verifyToken} = require("../middleware/auth")

router.put("/request_course",UsefulController.requestCourse);
router.put("/pre_registration_accept_reject",UsefulController.accept_reject_students);
router.put("/professor/login",UsefulController.login);
router.get("/token_check", verifyToken, (req, res) => {
  res.status(200).json({ 
    message: 'Token verified successfully!', 
    user: req.user 
  });
});
router.get("/pre_final_courses",UsefulController.pre_final_courses);
router.get("/requested_courses/:iid",UsefulController.requested_courses);
router.get("/professor/logout",UsefulController.logout);
router.get("/pre_registered_data/:iid",UsefulController.pre_registered_data);
module.exports = router;