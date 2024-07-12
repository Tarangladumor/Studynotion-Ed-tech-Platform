// import { respond } from "../utils/response";
const {respond} = require("../utils/response");
const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { paymentSuccessEmail } = require("../mails/templates/paymentSuccessEmail");
const crypto = require("crypto")
const {courseEnrollmentEmail} = require("../mails/templates/courseEnrollmentEmail");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;
    if (courses.length === 0) {
      return respond(res, "Please Provide Course ID", 404, false);
    }
  
    let total_amount = 0;
  
    for (const course_id of courses) {
      let course;
      try {
        course = await Course.findById(course_id);
  
        if (!course) {
          return respond(res, "Could not find the Course", 404, false);
        }
  
        console.log("hellooooeee",userId)
  
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentEndrolled.includes(uid)) {
          return respond(res, "Student is already Enrolled", 400, false);
        }
  
        console.log("hellooooeee",uid)
  
        total_amount += course.price;
        console.log("amount.....",total_amount)
      } catch (error) {
        console.log(error);
        return respond(
          res,
          "something went wrong while capturing the payment",
          500,
          false
        );
      }
    }
  
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };
  
    try {
      // Initiate the payment using Razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      return respond(
        res,
        "payment initilization is done",
        200,
        true,
        paymentResponse
      );
    } catch (error) {
      console.log(error);
      return respond(res, "Could not initiate order.", 500, false);
    }
  };

// exports.capturePayment = async(req,res) => {
    
//     const {courses} = req.body;
//     const userId = req.user.id;

//     console.log("courses.............",userId);   

//     if(courses.length === 0){
//         return res.json({
//             success:false,
//             message : " Please provide course Id"
//         });
//     }

//     let toatlAmount = 0;

//     for(const course_id of courses){
//         let course;
//         try{
//             course = await Course.findById(course_id);
//             if(!course){
//                 return res.status(200).json({
//                     success:false,
//                     message:"Could not find the course"
//                 })
//             }

//             console.log("COOURSE.............",course);

//             const uid = new mongoose.Types.ObjectId(userId);

//             console.log("UID..........",uid);

//             if(course.studentEndrolled.includes(uid)){
//                 return res.status(200).json({
//                     sucess:false,
//                     message:"Student is already Endrolled."
//                 })
//             }

//             toatlAmount += course.price;

//             console.log("TOTAL AMOUNT..........",toatlAmount);

//         } catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success :false,
//                 message:error.message
//             })
//         }
   
//     }

//     const currency = "INR";

//     const options = {
//         amount : toatlAmount * 100,
//         currency,
//         reciept: Math.random(Date.now()).toString(),
//     }

//     console.log("OPTIONS.....",options);

//     try{
//         console.log("object");
//         const paymentResponse = await instance.orders.create(options);

//         console.log("PAYMENT RESPONSE................",paymentResponse);

//         res.json({
//             sucess:true,
//             message : paymentResponse,
//         })
//     } catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Could not initiate order"
//         })
//     }

// }

exports.verifyPayment = async(req,res) => {

    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    console.log(req.body);

    console.log(razorpay_order_id);
    console.log(razorpay_signature);


    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({
            success:false,
            message:"Payemt Failed"
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    // const expectedSignature = crypto.createHmac("sha256", "87oRoAc5U1ijYYVtzzFpedLD")
    // .update(body.toString)
    // .digest("hex");

    const expectedSignature = crypto
    .createHmac("sha256", "87oRoAc5U1ijYYVtzzFpedLD")
    .update(body.toString())
    .digest("hex");

    console.log("expectedSignature : ",expectedSignature);
    console.log("razorpay_signature : ",razorpay_signature);

    if(expectedSignature === razorpay_signature) {
        await enrollStudents(courses,userId,res);
        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        });
    }

    return res.status(500).json({
        success:false,
        message:"Payment Failed"
    })
}

const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId){
        return res.status(400).josn({
            success:false,
            message:"Please provide the data for Courses and userID"
        });
    }

    for(const courseId of courses){
       try {
        const endrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentEndrolled:userId}},
            {new:true},
        )
    

    if(!endrolledCourse){
        return res.status(500).json({
            success:false,
            message:"Course not found"
        })
    }

    const courseProgress = await CourseProgress.create({
      courseId:courseId,
      userId:userId,
      completedVideos : [],
    })

    const endrolledStudent = await User.findByIdAndUpdate(userId,
        {
            $push:{
                courses: courseId,
                courseProgress : courseProgress._id,
            } 
        },
        {new:true}
    )

    console.log("ENDROLLENT STUDENT",endrolledStudent);
    

    // const emailResponse = await mailSender(
    //     enrollStudents.email,
    //     `Successfully Endrolled into ${endrolledCourse.courseName}`,
    //     courseEnrollmentEmail(endrolledCourse.courseName, `${endrolledStudent.firstName}`)
    //     )

    //     console.log("Email sent successfy=ully", emailResponse.response)
       } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.mwssage
        })
       }
    }
}

 exports.sendPayemtSuccessEmail = async(req,res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            sucess:false,
            message:"Please Provide all the fields"
        })
    }

    try{

        const endrolledStudent = await User.findById(userId);
        await mailSender(
            endrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${endrolledStudent.firstName}`,
                amount/100,orderId,paymentId
            )
        )
    } catch(error) {
        console.log("Error in sending mail",error);
        return res.status(500).json({
            success:false,
            message:"Could no send email"
        })
    }
 }

// exports.capturePayment = async(req,res) => {
//     //get CourseID and UserId
//     const {course_id} = req.id;
//     const userId = req.user.id;

//     //validation
//     //valid courseID
//     if(!course_id){
//         return res.status(401).json({
//             success:false,
//             message:"Please provie course id while capturing the payment"
//         });
//     };
//     //valid courseDetails
//     let course ;
//     try{
//         course = await Course.findById(course_id);

//         if(!course){
//             return res.status(401).json({
//                 success:false,
//                 message:"could not find course"
//             });
//         };

//         //user already pay for same course
//         const uid = new mongoose.Types.Objectid(userId);
//         if(course.studentEndrolled.includes(uid)){
//             return res.status(200).json({
//                 success:true,
//                 message:"student is also endrooled"
//             });
//         };


//     } catch (error) {

//         console.log(error);
//         return res.status(400).json({
//             success:false,
//             message:error.message,
//         })
//     }
//     //order create 
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount:amount*100,
//         currency,
//         reciept: Maath.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         // initiate the payment using razorpay
//         const paymentResonpse = await instance.orders.create(options);
//         console.log(paymentResonpse);
//         //return response
//         return res.satus(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId : paymentResonpse.id,
//             currency:paymentResonpse.currency,
//             amount:paymentResonpse.amount
//         })

//     } catch(error){
//         console.log(error);
//         res.json({
//             success:false,
//             message:"could not initiate order"
//         });
//     }
    
// };

// //verify signature of razor pay and server

// exports.verifySignature = async(req,res) => {
//     const webhhookSecret = "12345678";

//     const signature =req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//             //fulfill action
//             //find the course and endrooll the student in that course

//             const endrolledCourse = await Course.findOneAndUpdate({_id:courseId},
//                 {$push:{
//                     studentEndrolled:userId
//                 }},{new:true});

//                 if(!endrolledCourse) {
//                     return res.satus(500).json({
//                         success:false,
//                         message:"course not found",
//                     });
//                 };

//                 console.log(endrolledCourse);

//                 //find the student and add course in list of endrolled courses

//                 const endrolledStudent = await User.findOneAndUpdate({_id:userId},
//                     {
//                         $push:{
//                             courses:courseId
//                         }
//                     },{new:true});

//                     console.log(endrolledStudent);

//                     //mail send confirmation

//                     const emailResponse = await mailSender(
//                                                             endrolledStudent.email,
//                                                             "congratulatio from me",
//                                                             "congratulation you are on on boarded",

//                     );

//                     cosole.log(emailResponse);

//                     return res.status(200).json({
//                         success:true,
//                         message:"Signature varified and course added"
//                     })
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:"Invalid request in signature"
//         })
//     }

// };

