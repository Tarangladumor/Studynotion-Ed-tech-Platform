const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");

//createRating

exports.createRating = async(req,res) => {
    try{
        //get user id 
        const userId = req.user.id;
        //fetch data from req body
        const {rating,review,courseId} = req.body;
        //check user is endrolled or not
        const courseDetails = await Course.findOne({_id:courseId,studentEndrolled:{$elemMatch: {$eq:userId}}});

        if(!courseDetails){
            return res.satus(404).json({
                success:false,
                message:"Student is not endrolled in course"
            });
        };

        //check if user already reviewd course
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        });

        if(alreadyReviewed){
            return res.satus(403).json({
                success:false,
                message:"Course is already reviewed by the user"
            });
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            user:userId,
            rating,
            review,
            course:courseId
        });

        //update course with rating and review 
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews:ratingReview._id,
                }
            },{new:true});
        console.log(updatedCourseDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            ratingReview
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    };
}

//getAverage rating

exports.getAverageRating = async(req,res) => {
    try{
        //get courseid
        const courseId = req.body.courseId;
    
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating"}
                }
            }
        ])
        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        // if no rating and reviews
        return res.status(200).json({
            success:true,
            message:"Average rating is zero no rating given till now",
            averageRating:0,
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


//get all rating and reviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}