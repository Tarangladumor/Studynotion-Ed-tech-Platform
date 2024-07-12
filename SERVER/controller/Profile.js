const User = require("../models/User");
const Profile = require("../models/Profile");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

exports.updateProfile = async (req, res) => {
    try {
        const { firstName="",lastName="",dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        const id = req.user.id;

        if (!contactNumber || !gender || !id || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "all feilds are require in profile update"
            });
        };

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        const user = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
        })
        await user.save()

        // update profile

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec()

        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            updatedUserDetails
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error while updating the user",
            error: error.message
        })
    }
}

exports.deleteAccount = async (req,res) => {
    try{
        //To Do : job schedule
        // const  job = schedule.scheduleJob("10 * * * *",finction() {
        //     console.log("the answer to life, the universe, and everything!");
        // });
        // console.log(job);
        const id = req.user.id;

        const user = await User.findById({_id:id});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found while deleting the Account"
            });
        };

        // delete profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails});

        //delete user
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"User account delete successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"error in deleting maccount",
            error:error.message
        })
    }
}

exports.getAllUserDetails = async(req,res) => {
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);

        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            data:userDetails
        });
      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error while get all users",
            error:error.message
        })
    }
}

exports.getEnrolledCourses = async(req,res) => {
    try{
        const userId = req.user.id;
        let userDetails = await User.findOne({_id:userId})
        .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
        .exec();


        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseId: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }
    
        if(!userDetails) {
            return res.status(400).json({
                success:fasle,
                message:`Cound not find the user with id: ${userDetails}`
            })
        }

        return res.status(200).json({
            success:true,
            data:userDetails.courses
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

exports.instructorDashboard = async(req,res) => {
    try{
        const courseDetails = await Course.find({
            instructor:req.user.id
        });

        const courseData = courseDetails.map((course) => {
            const totalStudentsEndrolled = course.studentEndrolled.length;
            const totalAmountGenerated = totalStudentsEndrolled * course.price;

            //create a new object with additinal fields
            const courseDataWithStats = {
                _id:course._id,
                courseName:course.courseName,
                courseDescription : course.courseDescription,
                totalStudentsEndrolled,
                totalAmountGenerated
            }

            return courseDataWithStats;
        })

        return res.status(200).json({
            courses:courseData
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}