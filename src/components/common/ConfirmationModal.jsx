import React from 'react'
import Iconbtn from './Iconbtn'

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className='fixed !mt-0 inset-0 grid overflow-auto place-items-center bg-white bg-opacity-10 backdrop-blur-sm z-10' >
      <div className='bg-richblack-800 w-11/12 max-w-[350px] rounded-lg border border-richblack-400 p-6 '>
        <h2 className='text-richblack-5 font-semibold text-2xl' >{modalData.text1}</h2>
        <p className='text-richblack-200 mt-3 mb-5' >{modalData.text2}</p>
        <div className="flex items-center gap-x-4">
          <Iconbtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className=' bg-richblack-200 text-richblack-900 py-2 px-5 font-semibold rounded-md' 
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
