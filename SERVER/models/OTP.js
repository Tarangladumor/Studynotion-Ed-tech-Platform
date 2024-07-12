const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});

// function => for send email

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email From StudyNotion", otp);
        console.log("Email Sent Successfully: ",mailResponse);
    } catch(error) {
        console.log("error occured at sending mail; ", error)
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})




module.exports = mongoose.model("OTP", OTPSchema)