import { useState } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/cor/Dashboard/Sidebar';

const Dashboard = () => {

  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
}


  if (profileLoading || authLoading) {
    return (
      <div className=' spinner'></div>
    )
  }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-richblack-800 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}>
        <Sidebar />
      </div>

      {/* Overlay for mobile view */}
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black opacity-50 md:hidden" onClick={closeSidebar}></div>}

      {/* Content area */}
      <div className={`flex-1 h-[calc(100vh-3.5rem)] overflow-auto transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        {/* Toggle Button for Mobile */}
        <button
          className="absolute top-4 left-4 z-50 p-2 md:hidden"
          onClick={toggleSidebar}
        >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>

        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

{/* <div className=' relative flex min-h-[calc(100vh-3.5rem)]'>
      <Sidebar/>
      <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <Outlet/>
        </div>
      </div>
    </div> */}
