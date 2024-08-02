const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send otp

exports.sendOTP = async (req, res) => {

    try {
        const { email } = req.body;

        //ckeck user exist or not

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //generate otp

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log("OTP generated: ", otp);

        //check unique otp or not

        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            const result = await OTP.findOne({ otp: otp });
        };

        const otpPayload = { email:email, otp:otp };

        // create and entry in DB for otp

        const otpBody = await OTP.create(otpPayload);
        console.log("otpbody : ",otpBody);

        const emailVerification = require("../mails/templates/emailVerification");
        const emailbody = emailVerification(otp);
        mailSender(email,"your otp", emailbody);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}

// signUp

exports.signUp = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            password,
            confirmPassword,
            accountType,
            otp,
            contactNumber,
            email
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All the feilds are required"
            })
        };

        //maths password ans confirm password
        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirmpassword are not match"
            })
        };

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        };

        //find most recent otp from db for that user
        const response = await OTP.find({ email }).sort({createdAt : -1}).limit(1);
        console.log(response);

        // validate OTP

        if (response.length === 0) {
            return res.status(400).json({
                success: false,
                message: "otp not found"
            })
        } else if (otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp"
            });
        }

        //hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        //create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        // entry create in DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,   
            contactNumber,
            accountType,
            approved:approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            data:user,
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User not registerd, please try again"
        });
    }
}

// Login

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "fill all the feilds"
            });
        };

        const user = await User.findOne({ email }).populate("additionalDetails")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not exists"
            })
        };

        // password match

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType

            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            user.token = token;
            user.password = undefined;


            //crate cookie and response 

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token, user,
                message: "Logged in successfully"
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Passowrd is incorrect"
            })
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failed please try again"
        });
    }

};

// change password

exports.changepassword = async (req,res) => {

}
