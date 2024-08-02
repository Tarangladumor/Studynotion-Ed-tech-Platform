import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'

function Setting() {
  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 ml-16 md:ml-0">
            Edit Profile
        </h1>

        <ChangeProfilePicture/>

        <EditProfile/>

        <UpdatePassword/>

        <DeleteAccount/>
    </div>
  )
}

export default Setting
