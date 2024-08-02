import React from 'react'
import Footer from '../components/common/Footer'
import ContactUsForm from '../components/contactPage/ContactUsForm'
import ContactUsDetails from '../components/contactPage/ContactUsDetails'
import ReviewSlider from '../components/common/ReviewSlider'

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactUsDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactUsForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default Contact
