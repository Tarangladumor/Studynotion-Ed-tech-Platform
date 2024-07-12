const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async(req,res) => {
    const {courseId, subSectionId} = req.body
    const userId = req.user.id;

    try{

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Invalid sub-section"
            })
        }

        console.log("COURSEID",courseId);
        console.log("USerID",userId);

        //check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseId:courseId,
            userId:userId
        });

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course Progress does not exist"
            })
        }else{
            //check for re-completing video
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success:false,
                    message:"SubSection already completed"
                })
            }

            //push into completed video's
            courseProgress.completedVideos.push(subSectionId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success:true,
            message:"Course Progress updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
}