import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/apis';
import CounrtCode from '../../data/countrycode.json'

const ContactForm = () => {

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm();

    const submitContactForm = async (data) => {
        console.log("Loging Data", data);
        try {
            setLoading(true);
            // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            const response = { status: "OK" };
            console.log("Logginf response", response);
            setLoading(false);
        } catch (error) {
            console.group("Error : ", error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
            });
        }
    }, [isSubmitSuccessful, reset]);


    return (
        <form onSubmit={handleSubmit(submitContactForm)}
            className='flex flex-col gap-7'>

            {/* <div className='flex flex-col gap-10'> */}

            <div className='flex flex-col gap-5 lg:flex-row'>
                {/* firstName */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor='firstname' className=' label-style'>
                        First Name
                    </label>
                    <input
                        type='text'
                        name='firstname'
                        id='firstname'
                        placeholder='Enter First Name'
                        {...register("firstname", { required: true })}
                        className='form-style' />
                    {
                        errors.firstname && (
                            <span className='-mt-1 text-[12px] text-yellow-100'>
                                Please enter your firstname
                            </span>
                        )
                    }
                </div>

                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor='lastname' className='label-style'>
                        Last Name
                    </label>
                    <input
                        type='text'
                        name='lastname'
                        id='lastname'
                        placeholder='Enter Last Name'
                        {...register("lastname")}
                        className='form-style' />
                </div>


            </div>

            <div className='flex flex-col gap-2'>
                <label htmlFor='email'>
                    Email
                </label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Enter Your Email'
                    {...register("email", { required: true })}
                    className='form-style' />
                {
                    errors.email && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>
                            Please enter your email
                        </span>
                    )
                }
            </div>

            <div className='flex flex-col gap-2'>
                <label htmlFor='phonenumber' className='label-style'>Phone No.</label>

                <div className='flex gap-5'>
                    <div className="flex w-[81px] flex-col gap-2">
                        <select
                            name='dropdown'
                            id='dropdown'
                            {...register("dropdown", { required: true })}
                            className='w-[81px] form-style'>
                            {
                                CounrtCode.map((ele, i) => {
                                    return (
                                        <option key={i} value={ele}>
                                            {ele.code} - {ele.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">

                        <input
                            type='number'
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='text-black w-[calc(100%-90px)] form-style'
                            {...register("PhoneNo", {
                                require: { value: true, message: "Please Enter a Phone Nu mber" },
                                maxLength: { value: 10, message: "Invalid Phone Number" },
                                minLength: { value: 8, message: "Invalid Phone Number" }
                            })} />

                    </div>
                </div>
                {
                    errors.phoneNo && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>
                            {errors.phoneNo.message}
                        </span>
                    )
                }
            </div>

            <div className='flex flex-col gap-2'>
                <label htmlFor='message' className='label-style'>
                    Message
                </label>
                <textarea
                    name='message'
                    id='message'
                    rows={7}
                    cols={30}
                    placeholder='Enter your message here'
                    {...register("message", { required: true })}
                    className='form-style' />
                {
                    errors.message && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>
                            Please Enter your message
                        </span>
                    )
                }
            </div>

            <button disabled={loading} type='submit' className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${!loading &&
                "transition-all duration-200 hover:scale-95 hover:shadow-none"
                }  disabled:bg-richblack-500 sm:text-[16px] `}>
                Send Message
            </button>
            {/* </div> */}
        </form>
    )
}

export default ContactForm
