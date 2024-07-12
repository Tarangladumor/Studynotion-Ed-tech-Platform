const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async(req, res) => {
    try {

        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"missing Properties in Section"
            });
        };

        const newSection = await Section.create({sectionName});

        const sectionId = newSection._id;

        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:newSection._id,
                },
            },{new:true})
            .populate({
                path:"courseContent",
                populate: {
                    path: "subSection"
                }
            }).exec();

            return res.status(200).json({
                success:true,
                message:"Section created successfully",
                updatedCourse,
                sectionId
            })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in creating Section",
            error:error.message,
        });
    }
}

exports.updateSection = async (req,res) => {
    try {

        const {sectionName, sectionId, courseId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Misiing proerties while updating the section"
            });
        };

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        }).exec()

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:course
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in updating a section",
            error:error.message
        })
    }
}

exports.deleteSection = async(req,res) => {
    try{

        // const {sectionId} = req.params;
        const {sectionId, courseId} = req.body;

        await Course.findByIdAndUpdate(courseId, {
            $pull:{
                courseContent: sectionId,
            }
        })

        const section = await Section.findById(sectionId)

        if(!section) {
            return res.status(404).json({
                success:false,
                message:"Section not found",
            })
        }

        await SubSection.deleteMany({_id: {$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId);

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        return res.status(200).json({
            success:true,
            message:"Sction deleted successfully",
            data:course
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error while deleting the Section",
            error:error.message
        })
    }
}