const User = require("../models/User");
const mailsendeer = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Reset password token

exports.reseatPasswordToken = async (req, res) => {

    try {

        const email = req.body.email;

        //validation of email

        const user = await User.findOne({ email:email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `This Email: ${email} is not registerd with us enter a valid email`
            })
        }

        //generate token

        const token = crypto.randomBytes(20).toString("hex");

        //update user by adding token and expiration time

        const updatedDetails = await User.findOneAndUpdate({ email: email },
            {
                token: token,
                resetPasswordTokenExpires: Date.now() + 3600000
            }, {
            new: true
        });
        console.log("DETAILS", updatedDetails);

        //create url

        const url = `http://localhost:3000/update-password/${token}`

        // send mail that contain the url 

        await mailsendeer(email, "Password Reset Link", `Your Link for email verification is ${url}. please Click tjis url to reset your password.`)

        return res.json({
            success: true,
            message: 'Email sent successfully, please check email to continue Further'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:error.message,
            success: false,
            message: "Something went wrong while something reset password mail"
        })
    }
}

// reseat password

exports.resetPassword = async (req, res) => {

    try {
        // dat fetch

        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: 'password and confirmPassword is not matched'
            });
        }

        const userDetails = await User.findOne({ token: token });

        if (!userDetails) {
            return res.json({
                success: false,
                message: "token invalid"
            })
        }

        //token time check 
        if (userDetails.reseatPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "token is expired, please regenerate your token"
            })
        }

        // hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        // update password

        await User.findOneAndUpdate({ token: token },
            {
                password: hashedPassword
            }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'password reset successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:error.message,
            success: false,
            message: "Something went wrong while reseatPassword"
        })
    }
}
