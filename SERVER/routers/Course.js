const express = require("express")

const router = express.Router();

//import the controllers
const {getCourseDetails, getAllCourses, createCourse, editCourse, getInstructorCourses, deleteCourse,getFullCourseDetails} = require("../controller/Course");

//categpry controller import 
const {showAllCategories, createCategory, categoryPageDetails} = require("../controller/Category");

//section controller import
const {createSection, updateSection, deleteSection} = require("../controller/Section");

//import subsection controller
const {createSubSection,updateSubsectio9n,deleteSubsection} = require("../controller/Subsection");

//Rating controller import
const {createRating,getAverageRating,getAllRating} = require("../controller/RatingAndReview");

//importing middlewares
const { auth, isInstructor, isStudent, isAdmin} = require("../middlewares/auth");

//import course progress
const { updateCourseProgress} = require("../controller/CourseProgress");

////// course routes

//course can only be created by the instructor
router.post("/createCourse", auth, isInstructor, createCourse);

//add a section in a course
router.post("/addSection", auth, isInstructor, createSection);
//update a section
router.post("/updateSection", auth, isInstructor, updateSection);
//delete section
router.post("/deleteSection", auth, isInstructor, deleteSection);

//edit sub section
router.post("/updateSubSection", auth, isInstructor, updateSubsectio9n);
//delete sub section
router.post("/deleteSunSection", auth, isInstructor, deleteSubsection);
//Add a subSectionin a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

//get all registered courses
router.get("/getAllCourses", getAllCourses);
//get details for a specific Courses
router.post("/getCourseDetails", getCourseDetails);

//Get full Detail of specific course
router.post("/getFullCourseDetails",auth,getFullCourseDetails);

//edit course
router.post("/editCourse",auth,isInstructor ,editCourse);
//delete course
router.delete("/deleteCourse",auth,isInstructor,deleteCourse);

//update course progresss
router.post("/updateCourseProgress",auth,isStudent, updateCourseProgress);


//get all courses Under a specific instructor
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses)

//// admin routes

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

/// students Route

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;