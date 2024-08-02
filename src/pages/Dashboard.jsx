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
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
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
