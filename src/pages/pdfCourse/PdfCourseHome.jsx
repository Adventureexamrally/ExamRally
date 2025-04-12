import React from 'react';
import ComputerIcon from '@mui/icons-material/Computer';
import { FaDesktop } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PdfCourseHome = () => {
    return (
        <div>
            <h2 className="text-2xl m-2 font-bold text-center text-green-600">365 Days Rally PDF Course</h2>

            <div className='flex justify-center flex-col md:flex-row items-center m-5'>

                <Link to={'/pdf-course/Prelims'} className="flex flex-col items-center p-4 cursor-pointer">

                    <div className="bg-red-100 text-red-600 p-4 rounded-full">
                        <FaDesktop className="text-5xl" />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-800 mb-2 text-center w-44">
                        365 Days Rally PDF Course Prelims
                    </h1>
                </Link>
                <Link to={'/pdf-course/Mains'}  className="flex flex-col items-center p-4 cursor-pointer">
                    <div className="bg-red-100 text-red-600 p-4 rounded-full">
                        <FaDesktop className="text-5xl" />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-800 mb-2 text-center w-44">
                        365 Days Rally PDF Course Mains
                    </h1>
                </Link>
            </div>
        </div>
    )
}

export default PdfCourseHome
