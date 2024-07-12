const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// create course

exports.createCourse = async (req, res) => {
    try {

        let { courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body

        const thumbnail = req.files.thumbnailImage;
        console.log("THUMBNAIL : ", thumbnail);

        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        console.log("tag", tag);
        console.log("instructions", instructions);

        // if (!courseName ||
        //     !courseDescription ||
        //     !whatYouWillLearn ||
        //     !price ||
        //     !category ||
        //     !tag.length ||
        //     !instructions.length ||
        //     !thumbnail
        // ) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All the feilds are required in create course"
        //     })
        // };

        if (!status || status === undefined) {
            status = "Draft";
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });

        console.log("Instructor Details : ", instructorDetails);

        if (!instructorDetails) {
            return res.staus(404).json({
                success: false,
                message: "Instructor not found"
            });
        };

        // check givan category is vaild or not
        console.log("mY Category id - ", category);

        const categoryDetails = await Category.findById(category);

        console.log("Category Details.....", categoryDetails);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            });
        };

        //Upload image to cloudanary 

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            status: status,
            instructions,
            thumbnail: thumbnailImage.secure_url
        });

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate({ _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true });

        // add new course to the category schema
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "course created successfully",
            data: newCourse
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in creating the course",
            error: error.message
        })
    }
}

//get all courses

exports.getAllCourses = async (req, res) => {
    try {

        const allCourses = await Course.find({}, {
            courseNmae: true,
            price: true,
            instructor: true,
            ratingAndReviews: true,
            studentEndrolled: true
        }).populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "get all courses successfully",
            data: allCourses
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            mesage: "error in get all course"
        })
    }
}


//get course details

exports.getCourseDetails = async (req, res) => {
    try {

        //get id
        const { courseId } = req.body;

        console.log("HELLO",req.body);
        //find course details
        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }).exec();

        //validation

        console.log("COURSE DETAILS................",courseDetails);

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `could not find the course with ${courseId}`,
            })
        };

        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
            courseDetails: courseDetails
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.mesage
        });
    };
}


exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.getInstructorCourses = async (req, res) => {
    try {
        const InstructorId = req.user.id;

        const instructorCourses = await Course.find({
            instructor: InstructorId
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: instructorCourses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrive instructor courses",
            error: error.message
        })
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not Found"
            })
        }

        const studentsEndrolled = course.studentEndrolled
        for (const studentId of studentsEndrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { course: courseId }
            })
        }

        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            const section = await Section.findById(sectionId);
            if (section) {
                const subSection = section.subSection
                for (const subSectionId of subSection) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }
        }

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {

    try {
        const { courseId } = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({
          _id: courseId,
        })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        let courseProgressCount = await CourseProgress.findOne({
          courseID: courseId,
          userId: userId,
        })
    
        console.log("courseProgressCount : ", courseProgressCount)
    
        if (!courseDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
          })
        }
    
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }
    
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        console.log("Total Duration....",totalDuration);
    
        return res.status(200).json({
          success: true,
          data: {
            courseDetails,
            totalDuration,
            completedVideos: courseProgressCount?.completedVideos
              ? courseProgressCount?.completedVideos
              : [],
          },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}