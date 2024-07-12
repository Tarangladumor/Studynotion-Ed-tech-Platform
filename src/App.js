import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Navbar from './components/common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OpenRoute from './components/cor/Auth/OpenRoute';
import UpdatePasssword from './pages/UpdatePasssword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './components/cor/Dashboard/MyProfile';
import PrivateRoute from './components/cor/Auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error'
import EndrolledCourses from './components/cor/Dashboard/EndrolledCourses';
import Cart from './components/cor/Dashboard/Cart/index';
import { ACCOUNT_TYPE } from './utils/constants';
import { useSelector } from 'react-redux';
import Setting from '../src/components/cor/Dashboard/Settings/lndex'
import AddCourse from './components/cor/Dashboard/AddCourse';
import Catelog from './pages/Catelog';
import MyCourses from './components/cor/Dashboard/MyCourses';
import EditCourse from './components/cor/Dashboard/EditCourse';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/cor/View Course/VideoDetails';
import Instructor from './components/cor/Dashboard/InstructorDashboard/Instructor';



function App() {

  const { user } = useSelector((state) => state.profile);

  return (
    <div className=' w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>

        <Route
          path='signup'
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          } />

        <Route
          path='login'
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          } />

        <Route
          path='forgot-password'
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          } />

        <Route
          path='update-password/:id'
          element={
            <OpenRoute>
              <UpdatePasssword />
            </OpenRoute>
          } />

        <Route
          path='verify-email'
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          } />

        <Route
          path='/about'
          element={
            <About />
          } />

        <Route
          path='contact'
          element={
            <Contact />
          } />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }>

          <Route path='dashboard/my-profile' element={<MyProfile />} />
          <Route path='dashboard/cart' element={<Cart />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='dashboard/enrolled-courses' element={<EndrolledCourses />} />
                <Route path='dashboard/cart' element={<Cart />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='dashboard/instructor' element={<Instructor />} />
                <Route path='dashboard/add-course' element={<AddCourse />} />
                <Route path='dashboard/my-courses' element={<MyCourses />} />
                <Route path='dashboard/edit-course/:courseId' element={<EditCourse />} />

              </>
            )
          }

          <Route
            path='dashboard/settings'
            element={
              <PrivateRoute>
                <Setting />
              </PrivateRoute>
            } />

        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
                  element={<VideoDetails />} />
              </>
            )
          }

        </Route>



        <Route
          path='*'
          element={
            <Error />
          } />

        <Route path='catalog/:catelogName' element={<Catelog />} />

        <Route path='courses/:courseId' element={<CourseDetails />} />
      </Routes>

    </div>
  );
}

export default App;
