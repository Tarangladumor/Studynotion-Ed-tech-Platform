const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
    try {

        // Extract necessary information from the request body
        const { sectionId, title, description } = req.body
        const video = req.files.video

        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
            return res
                .status(404)
                .json({ success: false, message: "All Fields are Required" })
        }
        console.log(video)

        // Upload the video file to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )
        console.log(uploadDetails)
        // Create a new sub-section with the necessary information
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection")

        // Return the updated section in the response
        return res.status(200).json({ success: true, data: updatedSection })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error in creatin a Subsection",
            error: error.message
        })
    }
}

exports.updateSubsectio9n = async (req, res) => {
    try {

        const { sectionId, title, description } = req.body;
        const subSection = await SubSection.findById(sectionId);

        if (!subSection) {
            return res.satus(404).json({
                success: false,
                message: "SubSection not found"
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }

        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successdully"
        })

    } catch (error) {
        console.log(error);
        return res.satus(500).json({
            success: false,
            message: "error while updating the sub section",
            error: error.message
        });
    };
};

exports.deleteSubsection = async (req, res) => {
    try {
        const { sectionId, subsectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subsectionId,
                },
            }
        )

        const subSection = await SubSection.findByIdAndDelete({ _id: subsectionId })

        if (!subSection) {
            return res.status(404).json({
                success: false,
                messgae: "SubSection not found"
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            messgae: "SubSection deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "error while deleting the subsection"
        });
    };
};
