const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req, res, next) => {
    try{

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"  
            }); 
        }

        // verify the token

        try{

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        } catch(error){
             
            return res.status(401).json({
                success:false,
                message:"token is invalid",
                error : error.message
            });
        }

        next();
    } catch(error) {

        return res.status(401).json({
            success:false,
            message:error.message
        })
    }
}

//isStudent

exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only"
            })
        }
        next();
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"use role can not verify"
        })
    }
}

//isInstructor

exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            })
        }
        next();
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"use role can not verify"
        })
    }
}

//isAdmin

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        next();
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"use role can not verify"
        })
    }
}
