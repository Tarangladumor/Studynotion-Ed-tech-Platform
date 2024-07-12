import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Iconbtn from '../../../../common/Iconbtn'
import {MdAddCircleOutline} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { MdNavigateNext } from 'react-icons/md'
import {setCourse, setEditCourse, setStep} from '../../../../../slices/courseSlice';
import {createSection, updateSection} from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView'

const CourseBuilderForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors}
  } = useForm()

  const [editSectionName, setEditSectionName] = useState(null);
  const {course} = useSelector((state) => state.course);
  const {token} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if(editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId : editSectionName,
          courseId : course._id,
        },token
      )
    } else {
      result = await createSection({
        sectionName : data.sectionName,
        courseId : course._id
      },token)
    }

    if(result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }


    setLoading(false);
  }

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "")
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please add atleast one Section")
    }

    if(course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add at least one lecture in each section");
      return;
    }
    dispatch(setStep(3))
    console.log("hello");
  }

  const handleChangeEditSectionName = (sectionId,sectionName) => {
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName" , sectionName)
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className=' space-y-4'>
        <div className='flex flex-col space-y-2'>
        <label htmlFor='sectionName' className=' text-sm text-richblack-5'>
          Section Name<sup className='text-pink-200'>*</sup>
        </label>
        <input
          id='sectionName'
          placeholder='Add Section Name'
          {...register("sectionName",{required:true})}
          className='w-full form-style'/>
          {
            errors.sectionName && (
              <span className=' ml-2 text-xs tracking-wide text-pink-200'>Section Name is Required</span>
            )
          }
        </div>

        <div className=' flex items-end gap-x-4'>
          <Iconbtn 
            type='submit'
            text={editSectionName ? "Edit Section name" : "Create Section"}
            outline={true}
            customClasses={"text-yellow-50"}> 
              <MdAddCircleOutline className=' text-yellow-50'/>
            </Iconbtn>

            {
                editSectionName && (
                  <button
                    type='button'
                    onClick={cancelEdit}
                    className='text-sm text-richblack-300 underline ml-10'>
                    Cancel Edit
                  </button>
                )
            }
        </div>
      </form>
      {console.log(course.courseContent.length)}
      {
        course.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      }

      <div className='flex justify-end gap-x-3 mt-5'>
        <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblue-900`}>Back</button>

        <Iconbtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </Iconbtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm
