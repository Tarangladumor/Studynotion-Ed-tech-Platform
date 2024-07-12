import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import RequirementField from './RequirementField'
import Iconbtn from '../../../../common/Iconbtn'
import { setCourse, setStep } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'
import { COURSE_STATUS } from '../../../../../utils/constants'
import Upload from '../Upload'
import { MdNavigateNext } from 'react-icons/md'
import ChipInput from './ChipInput'

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    }

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, [])

  // console.log("Category id ...... ",course.category._id);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) return true;
    else {
      return false
    }
  }

  //handle next button click
  const onSubmit = async (data) => {

    console.log("submit data = ", data);
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }

        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }

        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }

        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }

        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }

        if (currentValues.courseRequirements.toString() !== course.instructions.toString()) {
          formData.append("instructions", JSON.stringify(data.courseRequirements));
        }

        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        setLoading(true);

        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("NO cahnges made to the form");
      }
      return;
    }

    //create new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage)

    setLoading(true);
    console.log("FORM DATA .....", formData)
    const result = await addCourseDetails(formData, token);
    console.log(result);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className=' space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
      <div className=' flex flex-col space-y-2'>
        <label htmlFor='courseTitle' className=' text-sm text-richblack-5'>Course Title<sup>*</sup></label>
        <input
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle", { required: true })}
          className='w-full form-style' />
        {
          errors.courseTitle && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Title Required</span>
          )
        }
      </div>

      <div className=' flex flex-col space-y-2'>
        <label htmlFor='courseShortDesc' className=' text-sm text-richblack-5'>Course Short Description<sup className='text-pink-200'>*</sup></label>
        <textarea
          id='courseShortDesc'
          placeholder='Enter Description'
          {...register("courseShortDesc", { required: true })}
          className='min-h-[130px] w-full form-style resize-x-none' />
        {
          errors.courseShortDesc && (
            <span className=' ml-2 text-xs tracking-wide text-pink-200'>Course Description is required</span>
          )
        }
      </div>

      <div className=' flex flex-col space-y-2'>
        <label htmlFor='coursePrice' className=' text-sm text-richblack-5'>Course Price<sup className=' text-pink-200'>*</sup></label>
        <div className='relative'>
          <input
            id='coursePrice'
            placeholder='Enter Course price'
            {...register("coursePrice", { required: true, valueAsNumber: true, pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/, } })}
            className='w-full form-style !pl-12' />
          <HiOutlineCurrencyRupee className=' absolute left-3 inline-block translate-y-1/2 text-2xl text-richblack-400' />
        </div>
        {
          errors.coursePrice && (
            <span className=' ml-2 text-xs tracking-wide text-pink-200'>Course Price is Required</span>
          )
        }
        {/* </div> */}
      </div>

      <div className=' flex flex-col space-y-2'>
        <label htmlFor='courseCategory' className=' text-sm text-richblack-5'>Course Category
          <sup className='text-pink-200'>*</sup></label>
        <select
          id='courseCategory'
          defaultValue=""
          {...register("courseCategory", { required: true })}
          className='form-style w-full'>
          <option value="" disabled>Choose a Category</option>
          {
            !loading && courseCategories?.map((category, index) => (
              <option key={index} value={category?._id}>
                {
                  category?.name
                }
              </option>
            ))
          }
        </select>
        {
          errors.courseCategories && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Category is Required</span>
          )
        }
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter tags and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues} />


      <Upload
        name='courseImage'
        label='Course Thumbnail'
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null} />


      <div className=' flex flex-col space-y-2'>
        <label className=' text-sm text-richblack-5' htmlFor='courseBenifits'>benefits of the course<sup className='text-pink-200'>*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Benefits of the course'
          {...register("courseBenefits", { required: true })}
          className='min-h-[130px] w-full form-style resize-x-none' />
        {
          errors.courseBenefits && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>benefits of the course are required</span>
          )
        }
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues} />

      <div className='flex justify-end gap-x-2'>
        {
          editCourse && (
            <button onClick={() => dispatch(setStep(2))} disabled={loading}
              className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
              Continue Without Saving
            </button>
          )
        }

        <Iconbtn disabled={loading} type='submit' text={!editCourse ? "Next" : "Save Change"}>
          <MdNavigateNext />
        </Iconbtn>
      </div>

    </form>
  )
}

export default CourseInformationForm
