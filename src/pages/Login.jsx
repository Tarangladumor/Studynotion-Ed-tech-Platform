import React from 'react'
import Template from '../components/cor/Auth/Template'
import loginimag from '../assets/Images/login.webp'

const Login = () => {
  return (
    <div>
      <Template title="Welcome back"
      description1="Build skills for today,tommorow, and beyond"
      description2="Education to future-proof your career"
      image={loginimag}
      formType="login"/>
    </div>
  )
}

export default Login
