import React from 'react'
import ContactForm from './ContactForm'

const ContactUsForm = () => {
  return (
    <div className='border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col'>
        <h1 className='text-4xl leading-10 font-semibold text-richblack-5'>
            Got a idea? we've got the skills. Let's team up
        </h1>
        <p>Tell us more about yourself and what you're got in mind</p>

        <div className='mt-7'>
            <ContactForm/>
        </div>
    </div>
  )
}

export default ContactUsForm
