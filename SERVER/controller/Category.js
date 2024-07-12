const { FOCUSABLE_SELECTOR } = require("@testing-library/user-event/dist/utils");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create category

exports.createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "all fields are require in category"
            })
        };

        // create Category in db

        const categoryDetails = await Category.create(
            {
                name: name,
                description: description
            }
        );

        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: "category created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// get all categories function

exports.showAllCategories = async (req, res) => {
    try {

        const allCategories = await Category.find({});
        console.log(allCategories)

        return res.status(200).json({
            success: true,
            message: "get all categories successfully",
            data: allCategories
        });
    } catch (error) {
        return res.status(500).json({
            success: FOCUSABLE_SELECTOR,
            message: "something went wrong in show all categories",
            error: error.message
        })
    }
};

exports.categoryPageDetails = async(req,res) => {
    try{

        console.log("body.......",req.body);
        const {categoryId} = req.body;

        //get courses for the specified catrgory
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path:"courses",
            populate:"ratingAndReviews",
            populate:"category"
        })
        .exec();
        console.log(selectedCategory);

        // when category is not found
        if(!selectedCategory){
            console.log("category not found");
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        } 

        //when there are no courses
        if(selectedCategory.courses.length === 0){
            console.log("No courses found for this category.");
            return res.status(404).json({
                success:false,
                message:"No courses found for this category",
            });
        };

        // const selectedCourses = selectedCategory.courses;

        //get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id:{ $ne: categoryId},
        }).populate("courses");
        // let differentCourses = [];
        // for (const category of categoriesExceptSelected) {
        //     differentCourses.push(...category.courses);
        // }

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        ).populate({
            path : "courses",
            match : { status:"Published"}
        }).exec();

        //Get top-selling courses across all categories
        const allCategories = await Category.find().populate({
            path : "courses",
            match : {status:"Published"},
            populate: {
                path: "instructor"
            }

        }).exec();
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
        .sort((a,b) => b.sold - a.sold)
        .slice(0,10);

        res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
                mostSellingCourses,
                allCategories
            }
            // selectedCourses:selectedCourses,
            // differentCourses:differentCourses,
            // mostSellingCourses:mostSellingCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message,
        });
    }
};

// exports.categoryPageDetails = async (req, res) => {
//     try {
//         //get categooryID
//         const { categoryId } = req.body;
//         //get courses for specified category
//         const selectedCategory = await Category.findById(categoryId)
//             .populate("courses")
//             .exec();

//         if (!selectedCategory) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Data not found',
//             });
//         }

//         //get courses for different categories
//         const differentCategories = await Category.find({
//             _id: { $ne: categoryId },
//         }).populate("courses").exec();

//         //get top selling courses
//         //return response
//         return res.status(200).json({
//             success: true,
//             data: {
//                 selectedCategory,
//                 differentCategories,
//             },

//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// } 