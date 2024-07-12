import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData'
import CourseSlider from '../components/cor/Catelog/CourseSlider'
import Course_Card from '../components/cor/Catelog/Course_Card'
import { useSelector } from 'react-redux';
import Error from './Error';

const Catelog = () => {

    const { loading } = useSelector((state) => state.profile)

    const { catelogName } = useParams();
    const [catelogPageData, setCatelogPageData] = useState(null);
    const [categotyId, setCategoryId] = useState("");
    const [active, setActive] = useState(1)

    useEffect(() => {
        const getCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catelogName)[0]._id;
            console.log("Category Id.........", category_id);
            setCategoryId(category_id);
        }

        getCategories();
    }, [catelogName])

    useEffect(() => {
        const categoryDetails = async () => {
            try {
                const res = await getCatalogaPageData(categotyId);
                console.log("RES......", res);
                setCatelogPageData(res);
            } catch (error) {
                console.log(error)
            }
        }
        if (categotyId) {
            categoryDetails();
        }
    }, [categotyId])

    console.log("CATELOG PAGEDATA", catelogPageData?.data?.mostSellingCourses);

    if (loading || !catelogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catelogPageData.success) {
        return <Error />
      }
    // console.log(catelogPageData.selectedCourses[0].category.name)

    return (
        <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">{`Home / Catelog / `}
                    <span className="text-yellow-25">
                        {catelogPageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                <p className="text-3xl text-richblack-5">{catelogPageData?.data?.selectedCategory?.name}</p>
                <p className="max-w-[870px] text-richblack-200">{catelogPageData?.data?.selectedCategory?.description}</p>
            </div>

            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                {/* Section-1 */}
                <div>
                    <div className="section_heading text-3xl font-bold text-white">Courses to get you to started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                        <p className={`px-4 py-2 ${active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                            onClick={() => setActive(1)}>Most Popular</p>
                        <p className={`px-4 py-2 ${active === 2
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                            } cursor-pointer`}
                            onClick={() => setActive(2)}>New</p>
                    </div>
                </div>
                <div>
                    <CourseSlider Courses={catelogPageData?.data?.selectedCategory?.courses} />
                </div>

                {/* Section-2 */}
                <div  className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <p className="section_heading text-3xl font-bold text-white">Top Courses in {catelogPageData?.data?.selectedCategory?.name}</p>
                    <div className="py-8">
                        <CourseSlider Courses={catelogPageData?.data?.differentCategory?.courses} />
                    </div>
                </div>

                {/* Section-3 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading text-3xl font-bold text-white">Frequently Bought</div>
                    <div className='py-8'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                            {
                                catelogPageData?.data?.mostSellingCourses?.slice(0, 4)
                                    .map((course, index) => (
                                        <Course_Card course={course} key={index} Hight={"h-[400px]"} />
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Catelog
