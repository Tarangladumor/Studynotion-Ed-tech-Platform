import React, { useState } from 'react'

import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables)

const InstructorChart = ({ courses }) => {

    const [currentChart, setCurrentChart] = useState("students");

    //generate random colors
    const getRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
            colors.push(color);
        }
        return colors;
    }

    //for students
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEndrolled),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }

    //for income
    const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }


    const options = {
        maintainAspectRatio: false,
    };


    return (
        <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
            <p className="text-lg font-bold text-richblack-5">Visualize</p>
            <div className="space-x-4 font-semibold">
                {/* Button to switch to the "students" chart */}
                <button
                    onClick={() => setCurrentChart("students")}
                    className={`rounded-sm p-1 px-3 transition-all duration-200 ${currentChart === "students"
                            ? "bg-richblack-700 text-yellow-50"
                            : "text-yellow-400"
                        }`}
                >
                    Students
                </button>
                {/* Button to switch to the "income" chart */}
                <button
                    onClick={() => setCurrentChart("income")}
                    className={`rounded-sm p-1 px-3 transition-all duration-200 ${currentChart === "income"
                            ? "bg-richblack-700 text-yellow-50"
                            : "text-yellow-400"
                        }`}
                >
                    Income
                </button>
            </div>
            <div className="relative mx-auto aspect-square h-full w-full">
                {/* Render the Pie chart based on the selected chart */}
                <Pie
                    data={currentChart === "students" ? chartDataForStudents : chartDataForIncome}
                    options={options}
                />
            </div>
        </div>
    )
}

export default InstructorChart
