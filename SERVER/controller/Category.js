const Category = require("../models/Category");
const mongoose = require("mongoose");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        console.log(req.body);

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required in category",
            });
        }

        // Create Category in the database
        const categoryDetails = await Category.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
        });

        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all categories function
exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({});
        console.log(allCategories);

        return res.status(200).json({
            success: true,
            message: "Retrieved all categories successfully",
            data: allCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong in showing all categories",
            error: error.message,
        });
    }
};

// Category page details function
exports.categoryPageDetails = async (req, res) => {
    try {
        console.log("body.......", req.body);
        const { categoryId } = req.body;

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                populate: {
                    path: "ratingAndReviews",
                    populate: "category",
                },
            })
            .exec();

        console.log(selectedCategory);

        // When category is not found
        if (!selectedCategory) {
            console.log("Category not found");
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // When there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for this category.");
            return res.status(404).json({
                success: false,
                message: "No courses found for this category",
            });
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        }).populate("courses");

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec();

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec();

        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
                allCategories,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
