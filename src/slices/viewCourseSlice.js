import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    courseSectionData : [],
    courseEntireData : [],
    completedLectures : [],
    totalNoOfLectures : [],
}

const viewCourseSlice = createSlice({
    name:"ViewCourse",
    initialState,
    reducers: {
        setCourseSectionData: (state, action) => {
            state.courseSectionData = action.payload
        },
        setEntireCourseData : (state, action) => {
            state.courseEntireData = action.payload
        },
        setTotalNoOfLectures : (state, action) => {
            state.totalNoOfLectures = action.payload
        },
        setCompltetdLectures : (state,action) => {
            state.completedLectures = action.payload
        },
        updateCompletedLectures : (state,action) => {
            state.completedLectures = [...state.completedLectures, action.payload]
        }
    }
})

export const {setCompltetdLectures,setCourseSectionData,setEntireCourseData,setTotalNoOfLectures,updateCompletedLectures} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;