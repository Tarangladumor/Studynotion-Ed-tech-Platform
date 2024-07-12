import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"
import { markLectureAsCompleted } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import Iconbtn from "../../common/Iconbtn"


const VideoDetails = () => {

    const { courseId, sectionId, subSectionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const playerRef = useRef(null)
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.ViewCourse)

    const [videoData, setVideoData] = useState([])
    const [previewSource, setPreviewSource] = useState("")
    const [videoEnded, setVideoEnded] = useState(false)
    const [loading, setLoading] = useState(false)

    // useEffect(() => {

    //     const setVideoSpecificDetails = async () => {
    //         if (!courseSectionData.length) {
    //             return;
    //         }
    //         if (!courseId && !sectionId && !subSectionId) {
    //             navigate("/dashboard/enrolled-courses");
    //         }
    //         else {

    //             console.log("COURSE SECTION DATA............", courseSectionData);

    //             const filteredData = courseSectionData.filter(
    //                 (course) => course._id === sectionId
    //             )

    //             console.log("FILTERED DATA................", filteredData);

    //             const filteredVideoData = filteredData?.[0].subSection.filter(
    //                 (data) => data._id === subSectionId
    //             )

    //             console.log("FILTERED VIDEO DATA..............",filteredVideoData);

    //             setVideoData(filteredVideoData[0]);
    //             setVideoEnded(false);
    //         }
    //     }

    //     setVideoSpecificDetails();

    // }, [courseSectionData, courseEntireData, location.pathname]);

    // useEffect(() => {
    //     ; (async () => {
    //         if (!courseSectionData.length) return
    //         if (!courseId && !sectionId && !subSectionId) {
    //             navigate("/dashboard/enrolled-courses");
    //         } else {

    //             console.log("COURSE SECTION DATA....",courseSectionData);
    //             const filteredData = courseSectionData?.filter(
    //                 (course) => course._id === sectionId,
    //             )
    //             console.log("course", filteredData)

    //             const filteredVideoData = filteredData?.[0]?.subSection.filter(
    //                 (data) => data._id === subSectionId,
    //                 console.log("SUB SECTION FILTERED DTAT.......",filteredData?.[0]?.subSection)
    //             )
    //             console.log("video", filteredVideoData)
    //             setVideoData(filteredVideoData[0])
    //             console.log("videoData", videoData)
    //             setPreviewSource(courseEntireData.thumbnail)
    //             console.log("preview", previewSource)
    //             setVideoEnded(false)
    //         }
    //     })()
    // }, [courseSectionData, courseEntireData, location.pathname])

    useEffect(() => {
        (async () => {
            if (!courseSectionData.length) return
            if (!courseId || !sectionId || !subSectionId) {
                navigate("/dashboard/enrolled-courses")
            } else {
                console.log("SECTIONID:    ",sectionId);
                const filteredSection = courseSectionData.find(section => section._id === sectionId)
                if (filteredSection) {
                    const filteredVideoData = filteredSection.subSection.find(subSection => subSection._id === subSectionId)
                    if (filteredVideoData) {
                        setVideoData(filteredVideoData)
                        setPreviewSource(courseEntireData.thumbnail)
                        setVideoEnded(false)
                    }

                    console.log("FILTERED VIDEO DATA..........",filteredSection);
                }
            }
        })()
    }, [courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true;
        } else {
            return false;
        }
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if (currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSection - 1) {
            return true;
        } else {
            return false;
        }
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if (currentSubSectionIndex !== noOfSubSection - 1) {
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        } else {
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if (currentSubSectionIndex != 0) {
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        } else {
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;

            const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;

            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handlelectureCompletion = async () => {

        setLoading(true);

        const res = await markLectureAsCompleted({ courseId: courseId, subSectionId: subSectionId }, token);

        //update the state
        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }


        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-5 text-white">
            {!videoData ? (
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
            ) : (
                <Player
                    ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                >
                    <BigPlayButton position="center" />
                    {/* Render When Video Ends */}
                    {videoEnded && (
                        <div
                            style={{
                                backgroundImage:
                                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                            }}
                            className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                        >
                            {!completedLectures.includes(subSectionId) && (
                                <Iconbtn
                                    disabled={loading}
                                    onclick={() => handlelectureCompletion()}
                                    text={!loading ? "Mark As Completed" : "Loading..."}
                                    customClasses="text-xl max-w-max px-4 mx-auto"
                                />
                            )}
                            <Iconbtn
                                disabled={loading}
                                onclick={() => {
                                    if (playerRef?.current) {
                                        // set the current time of the video to 0
                                        playerRef?.current?.seek(0)
                                        setVideoEnded(false)
                                    }
                                }}
                                text="Rewatch"
                                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                            />
                            <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                {!isFirstVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToPrevVideo}
                                        className="blackButton"
                                    >
                                        Prev
                                    </button>
                                )}
                                {!isLastVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToNextVideo}
                                        className="blackButton"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </Player>
            )}

            <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
            <p className="pt-2 pb-6">{videoData?.description}</p>
        </div>
    )
}

export default VideoDetails
