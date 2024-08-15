import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import axios from "axios";

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,LECTURE_COMPLETION_API
} = courseEndpoints

export const getAllCourse = async() => {
    const toastId = toast.loading("Loaidng....")
    let result = []
    try{
        const response = await apiConnector("GET",GET_ALL_COURSE_API)
        if(!response?.data?.success){
            throw new Error("Could not fetch get all course")
        }
        result = response?.data?.data
    } catch (error) {
        console.log("GET_ALL_COURSE_API API ERROR.....",error)
        toast.error(error.message);
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseDetails = async(courseId) => {
    const tosatId = toast.loading("Loading....");
    // setLoading(true);
    let result = null;
    try {
        console.log(courseId);
        const response = await apiConnector("POST",COURSE_DETAILS_API, {
            courseId
        })

        // const response = await axios({
        //     method: 'get',
        //     url: COURSE_DETAILS_API,
        // })
        console.log("COURSE_DETAILS_API RESPONSE.....",response);

        if(!response?.data?.success){
            throw new Error(response.data.message);
        }
        result = response.data
    } catch (error) {
        console.profile("COURSE_DETAILS_API Error.....",error)
        result = error.response.data
    }
    toast.dismiss(tosatId);
    return result
}

export const fetchCourseCategories = async() => {
    let result = []
    try{
        const response = await apiConnector("GET",COURSE_CATEGORIES_API)
        console.log("COURSE_CATEGORIES_API API RESPONSE....",response);

        if(!response?.data?.success){
            throw new Error("Could not fetch course categories")
        }

        result = response?.data?.data
    } catch (error) {
        console.log("COURSE_CATEGORIES_API ERROR......",error)
        toast.error(error.message);
    }
    return result
}

// export const addCourseDetails = async(data,token) => {
//     let result = null;
//     const toastId = toast.loading("loading....");
//     try {
//         const response = await apiConnector("POST",CREATE_COURSE_API,data, {
//             "Contect-Type":"multipart/form-data",
//             Authorization:`Bearer${token}`,
//         })
//         console.log("CREATE_COURSE_API API RESPONSE.....",response)

//         if(!response?.data?.success) {
//             throw new Error("could not add course details")
//         }

//         toast.success("course Details added succesfully")
//         result = response?.data?.data
//     } catch (error) {
//         console.log("CREATE_COURSE_API API ERROR.....",error)
//         toast.error(error.message)
//     }
//     toast.dismiss(toastId)
//     return result
// }

export const addCourseDetails = async(data,token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
    console.log("tOKEN.....",data)
    try {
        const response = await apiConnector("POST",CREATE_COURSE_API,data, {
            "Contect-Type":"multipart/form-data",
            Authorization:`Bearer ${token}`,
        })
        console.log("CREATE_COURSE_API RESPONSE.....",response)
        if(!response?.data?.success) {
            throw new Error("Could not Add Course Details")
        }
        toast.success("Course added successfully")
        result = response?.data?.data
    } catch(error) {
        console.log("CREATE_COURSE_API ERROR.....",error);
        toast.error(error.message)
    }
    toast.dismiss(toastId);
    return result
}

export const editCourseDetails = async(data, token) => {
    let result = null;
    const toastId = toast.loading("Loading....")
    try {
        const response = await apiConnector("POST",EDIT_COURSE_API,data, {
            "Contect-Type":"multipart/form-data",
            Authorization:`Bearer ${token}`,
        })
        console.log("EDIT_COURSE_API RESPONSE....",response)

        if(!response?.data?.success) {
            throw new Error("count not edit course details")
        }

        toast.success("couse Details updated Successfully")
        result = response?.data?.updatedSection
    } catch (error) {
        console.log("EDIT_COURSE_API ERROR....",error);
        toast.error(error.message)
    }
    toast.dismiss(toastId);
    return result
}

export const createSubSection = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
            "Contect-Type":"multipart/form-data",
            Authorization:`Bearer ${token}`,
        })

        console.log("CREATE_SUBSECTION_API RESPONSE.....",response);

        if(!response?.data?.success) {
            throw new Error("could not create subsection")
        }

        toast.success("Course Section section")
        result = response?.data?.data
    } catch (error) {
        console.log("CREATE_SUBSECTION_API ERROR.....",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async(data,token) => {
    let result = null
    const toastId = toast.loading("Loading....")
    try {
        const response = await apiConnector("POST",CREATE_SECTION_API,data,{
            Authorization:`Bearer ${token}`,
        })
        console.log("CREATE_SECTION_API RESPONSE.....",response)

        if(!response?.data?.success){
            throw new Error("could not create section")
        }
        toast.success("course section created")
        result = response?.data?.updatedCourse;
        console.log(result);
    } catch (error) {
        console.log("CREATE_SECTION_API Error.....",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading....")
    try {
        const response = await apiConnector("POST",UPDATE_SECTION_API,data, {
            Authorization:`Bearer ${token}`,  
        })
        console.log("UPDATE_SECTION_API API RESPONSE....",response);
        if(!response?.data?.success){
            throw new Error("Could not update Section")
        }
        toast.success("Section updated successfully")
        result = response?.data?.data
    } catch (error) {
        console.log("UPDATE_SECTION_API API ERROR.....",error);
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSubSection = async(data,token) => {
    let result = null
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST",UPDATE_SUBSECTION_API,data,{
            Authorization:`Bearer ${token}`
        })
        console.log("UPDATE_SUBSECTION_API RESPONSE....",response);
        if(!response?.data?.success) {
            throw new Error("Could not update Sub Section")
        }
        toast.success("SubSection UPdated Successfully")
        result = response?.data?.data;
    } catch (error) {
        console.log("UPDATE_SUBSECTION_API ERROR......",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId);
    return result
}

export const deleteSection = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading.....");
    try {
        const response = await apiConnector("POST",DELETE_SECTION_API,data,{
            Authorization:`Bearer ${token}`
        })
        console.log("DELETE_SECTION_API RWSPONSE......",response)
        if(!response?.data?.success){
            throw new Error("Could not delete Section")
        }
        toast.success("Course Section Deleted")
        result = response?.data?.data
    } catch (error) {
        console.log("DELETE_SECTION_API ERROR.....",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSubSection = async(data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST",DELETE_SUBSECTION_API,data,{
            Authorization:`Bearer ${token}`
        })
        console.log("DELETE_SUBSECTION_API RESPONSE....",response)
        if(!response?.data?.success) {
            throw new Error("Could not deleted Subsection")
        }
        toast.success("SubSection deleted")
        result = response?.data?.data
    } catch (error) {
        console.log("DELETE_SUBSECTION_API ERROR....",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result;
}

export const fetchInstructorCourses = async(token) => {
    let result = []
    const toastId = toast.loading("Loading....")
    try {
        const response = await apiConnector("GET",GET_ALL_INSTRUCTOR_COURSES_API,null,{
            Authorization:`Bearer ${token}`
        })
        console.log("GET_ALL_INSTRUCTOR_COURSES_API RESPONSE",response)
        if(!response?.data?.success) {
            throw new Error("Could not fetch instructor Courses")
        }
        toast.success("InstructorCourse fetched successfully")
        result = response?.data?.data
    } catch (error) {
        console.log("GET_ALL_INSTRUCTOR_COURSES_API ERROR.....",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteCourse = async(data,token) => {
    const toastId = toast.loading("Loading....")
    console.log("Data....",data);
    try {
        const response = await apiConnector("DELETE",DELETE_COURSE_API,data,{
            Authorization:`Bearer ${token}`
        })
        console.log("DELETE_COURSE_API RESPONSE....",response)
        if(!response?.data?.success) {
            throw new Error("Could Not Delete Course")
        }
        toast.success("Course Deleted")
    } catch (error) {
        console.log("DELETE_COURSE_API ERROR.....",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
}

export const getFullDetailsOfCourse = async(courseId,token) => {
    const toastId = toast.loading("Loading...")
    console.log("COURSE ID.......",courseId);
    let result = null
    try {
        const response = await apiConnector("POST",GET_FULL_COURSE_DETAILS_AUTHENTICATED,{
            courseId
        },
        {Authorization:`Bearer ${token}`})
        console.log("GET_FULL_COURSE_DETAILS_AUTHENTICATED RESPONSE....",response)

        if(!response?.data?.success){
            throw new Error(response.data.message)
        }
        result = response?.data?.data
    } catch (error) {
        console.log("GET_FULL_COURSE_DETAILS_AUTHENTICATED ERROR",error);
        result = error.response.data
    }
    toast.dismiss(toastId)
    return result
}

export const markLectureAsCompleted = async(data,token) => {
    let result = null 
    console.log("mark complete data",data)
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST",LECTURE_COMPLETION_API,data, {
            Authorization:`Bearer ${token}`
        })
        console.log("MARK_LECTURE_AS_COMPLETION_API API RESPONSE....",response)
        if(!response?.data?.message){
            throw new Error(response.data.error)
        }
        toast.success("Lecture Completed")
        result = true
    } catch (error) {
        console.log("MARK_LECTURE_AS_COMPLETION_API API ERROR......",error)
        toast.error(error.message)
        result = false
    }
    toast.dismiss(toastId)
    return result
}

export const createRating = async(data, token) => {
    const toastId = toast.loading("Loading....")
    let success=false
    try {
        const response = await apiConnector("POST",CREATE_RATING_API,data,{
            Authorization:`Bearer ${token}`
        })
        console.log("CREATE_RATING_API PI RESPONSE....",response)
        if(!response?.data?.success){
            throw new Error("Could Not Create Rating")
        }
        toast.success("Rating Created")
        success = true
    } catch (error) {
        success = false
        console.log("CREATE_RATING_API ERROR.....",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return success
}