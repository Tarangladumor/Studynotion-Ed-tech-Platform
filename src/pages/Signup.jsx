import React from 'react'
import Template from '../components/cor/Auth/Template'
import signupImg from '../assets/Images/signup.webp'

const Signup = () => {
  return (
    <Template
    title="Join the millions learning to code with StudyNotion for free"
    description1="Build skills for today,tomorrow,and beyond."
    description2="Edducation to future-proof your creer"
    image={signupImg}
    formType="signup"/>
  )
}

export default Signup
