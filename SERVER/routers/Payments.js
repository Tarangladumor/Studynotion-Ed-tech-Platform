const express = require("express")

const router = express.Router();

const { capturePayment, verifyPayment, sendPayemtSuccessEmail} = require("../controller/Payments");
const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/auth");

router.post("/capturePayment", auth,isStudent,capturePayment);
router.post("/verifyPayment", auth,isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail",auth,isStudent,sendPayemtSuccessEmail);

module.exports = router; 