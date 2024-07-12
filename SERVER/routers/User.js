const express = require("express")

const router = express.Router();

const {login,signUp,sendOTP, changepassword,} = require("../controller/Auth");

const {reseatPasswordToken, resetPassword} = require("../controller/ReseatPassword");

const {auth} = require("../middlewares/auth");

/// Routes For Login, signup, And Authantication


//Route for user login
router.post("/login", login);

//Router for sign up
router.post("/signup", signUp);

//Router for sending OTP to the user model
router.post("/sendotp", sendOTP);

//Route for changing password
router.post("/changepassword", changepassword); 


/// Reset password

//Route for generating a reset password token
router.post("/reset-password-token", reseatPasswordToken);

//Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


module.exports = router;