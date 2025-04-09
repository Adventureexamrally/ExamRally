import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Api from '../service/Api';
import { Link } from 'react-router-dom';

const PdfCourse = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [isfree] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [ad, setAD] = useState([])
    const [seo, setSeo] = useState([])

    useEffect(() => {
        run()
    }, []);
    async function run() {
        const response2 = await Api.get(`/get-Specific-page/pdf-course`);
        setSeo(response2.data);
        console.log(response2.data);

        const response3 = await Api.get(`/blog-Ad/getbypage/pdf-course`);
        setAD(response3.data)
    }


    // Function to generate the calendar dates for the selected month and year
    const generateCalendar = (year, month) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // Calculate the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // Create the calendar array with empty slots at the start for the first week
        const calendarDays = [];

        // Fill in the empty slots before the 1st day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDays.push(null);
        }

        // Fill the calendar with the actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }

        // Split the calendar into weeks (arrays of 7 days)
        const weeks = [];
        while (calendarDays.length) {
            weeks.push(calendarDays.splice(0, 7));
        }

        return weeks;
    };

    const handleDateClick = (day) => {
        setSelectedDate(day); // Save only the day to simplify comparison
    };

    const handleYearChange = (event) => {
        setYear(Number(event.target.value));
    };

    const handleMonthClick = (index) => {
        setMonth(index);
    };

    useEffect(() => {
        setSelectedDate(null); // Reset selected date when month/year changes
    }, [year, month]);

    const weeks = generateCalendar(year, month);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <>
            <Helmet>
                {/* { seo.length > 0 && seo.map((seo)=>(
                    <> */}
                <title>{seo[0]?.seoData?.title}</title>
                <meta name="description" content={seo[0]?.seoData?.description} />
                <meta name="keywords" content={seo[0]?.seoData?.keywords} />
                <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
                <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
                <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
                {/* </>
                ))} */}

            </Helmet>
            <div className="flex">
                <div className={` m-2 w-full ${ad.length > 0 ? "md:w-4/5" : "md:full "}`}>
                    <div className="p-8">
                        <style>
                            {`
          @keyframes blinkScaleTranslateColor {
            0% {
              transform: scale(1) translate(0, 0);
              background-color:yellow;
            }
            50% {
              transform: scale(1.1) translate(0, 0);
              background-color: #fbbf24; /* bg-yellow-300 */
            }
            100% {
              transform: scale(1) translate(0, 0);
             background-color:yellow;

            }
          }
          
          .animate-blink {
            animation: blinkScaleTranslateColor 1s infinite ease-in-out;
          }
        `}
                        </style>
                        <h2 className="text-2xl m-2 font-bold text-center text-green-600">365 Days Rally PDF Course Challenge</h2>

                        <div className="flex items-center m-4 space-x-4">
                            <label for="year">Enter Year:</label>
                            <input type="number" id="year" name="year" min="2000" max="2100" class="border p-2 rounded-md" placeholder='YYYY' value={year} onChange={handleYearChange} />
                        </div>
                        <div className="my-4  flex flex-col md:flex-row justify-center space-x-8">
                            {/* Left side: Month list */}
                            <div className="w-full md:w-1/3 ">
                                <h3 className="text-lg m-1 font-medium">Months</h3>
                                <div className="flex flex-wrap justify-around  border-1 border-blue-950 bg-blue-100">
                                    {months.map((monthName, index) => (
                                        <button
                                            key={index}
                                            className={`m-2 p-2 text-left text-xl border-1 border-blue-600 rounded-md ${month === index ? 'bg-blue-500 text-white' : ' bg-white hover:bg-gray-200'}`}
                                            onClick={() => handleMonthClick(index)}
                                        >
                                            {monthName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right side: Calendar Table */}
                            <div className="flex-1 max-w-3xl"> {/* Smaller table width */}
                                <div className='text-xl bg-yellow-100 text-center m-2 font-serif'>Each Month First Day is Free</div>
                                {/* Weekdays Header */}
                                <table className="w-full text-center border-collapse border border-white">
                                    <thead>
                                        <tr className="bg-blue-950 text-white">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                                <th key={index} className="m-1 p-2 border border-white">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-blue-950 text-white">
                                        {/* Calendar Grid */}
                                        {weeks.map((week, weekIndex) => (
                                            <tr key={weekIndex}>
                                                {week.map((day, dayIndex) => (
                                                    day == 1 || isfree ? (
                                                        <td
                                                            key={dayIndex}
                                                            className={`p-2  text-black cursor-pointer border border-white ${day === selectedDate ? 'bg-blue-500 text-white' : 'hover:bg-yellow-200 hover:text-black animate-blink'}`}
                                                            onClick={() => day && handleDateClick(day)}
                                                        >
                                                            FREE
                                                        </td>
                                                    ) : (
                                                        <td
                                                            key={dayIndex}
                                                            className={`p-2 cursor-pointer border border-white ${day === selectedDate ? 'bg-blue-500 text-white' : day ? 'hover:bg-gray-200 hover:text-black' : 'bg-blue-950'}`}
                                                            onClick={() => day && handleDateClick(day)}
                                                        >

                                                            {day || ''}
                                                        </td>
                                                    )
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Selected Date */}
                                {selectedDate && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Selected Date:</h3>
                                        <p className="text-xl">{`${year} ${new Date(year, month).toLocaleString('default', { month: 'short' })} ${selectedDate}`}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {ad.length > 0 &&
                    <div className="w-1/5 hidden md:block">
                        <div>

                            {ad.map((item) => (
                                <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'>
                                    <Link to={item.link_name}>
                                        <img src={item.photo} alt="Not Found" className='rounded-md' /></Link >
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default PdfCourse;
