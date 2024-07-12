const express = require("express")

const router = express.Router();

const {auth} = require("../middlewares/auth");
const{ deleteAccount, updateProfile, getAllUserDetails, updateDisplayPicture, getEnrolledCourses, instructorDashboard } = require("../controller/Profile");
/// PROFILE ROUTES


router.delete("/deleteProfile",auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
//get endrolled courese

router.get("/getEnrolledCourses", auth, getEnrolledCourses);
// router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth,instructorDashboard);

module.exports = router;