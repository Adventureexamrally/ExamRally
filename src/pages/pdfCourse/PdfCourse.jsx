import React, { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Api from '../../service/Api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdLock } from 'react-icons/io';
import { UserContext } from '../../context/UserProvider';
import { useUser } from '@clerk/clerk-react';

const PdfCourse = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [isfree] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [ad, setAD] = useState([])
    const [seo, setSeo] = useState([])
    const [alldata, setAlldata] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [resultData, setResultData] = useState(null);

    const { user } = useContext(UserContext);
    console.log(user)
    const { level } = useParams();
    useEffect(() => {
        run()
    }, []);
    const { isSignedIn } = useUser();
    const pdfRefs = useRef({});
    const navigate = useNavigate();

    async function run() {

        const response = await Api.get(`pdf-Course/courses`);
        const filteredData = response.data.filter(item => item.exam_level?.toLowerCase() === level.toLowerCase());
        console.log(response.data);

        setAlldata(filteredData);

        const response2 = await Api.get(`/get-Specific-page/pdf-course`);
        setSeo(response2.data);
        console.log(response2.data);

        const response3 = await Api.get(`/blog-Ad/getbypage/pdf-course`);
        setAD(response3.data);

        // Fetch test result for each test
        alldata?.exams?.forEach((test) => {
            Api.get(`/results/${user?._id}/${test._id}`)
                .then((res) => {
                    if (res.data?.status === "completed") {
                        setResultData((prev) => ({
                            ...prev,
                            [test._id]: res.data
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching result:", err);
                });
        });
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

    const formatDateToYMD = (dateString) => {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
        };
    };

    const filteredPdfs = alldata.filter((pdf) => {
        if (!pdf.date) return false;

        const { year: pdfYear, month: pdfMonth } = formatDateToYMD(pdf.date);

        const isMatchingYear = pdfYear === year;
        const isMatchingMonth = pdfMonth === month;
        const matchesSearch = pdf.examName?.toLowerCase().includes(searchTerm);

        // 📌 Logic:
        // If there's a search term, show all from the year that match it
        // Else, show all from selected month
        if (searchTerm.trim() !== "") {
            return isMatchingYear && matchesSearch;
        } else {
            return isMatchingYear && isMatchingMonth;
        }
    });

    useEffect(() => {
        if (selectedDate) {
            const key = formatKey(year, month, selectedDate);
            setTimeout(() => {
                const target = pdfRefs.current[key];
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); // slight delay to ensure DOM is rendered
        }
    }, [selectedDate, year, month]);

    // Group filtered PDFs by day
    const groupedPdfs = filteredPdfs.reduce((acc, pdf) => {
        const date = new Date(pdf.date);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(pdf);
        return acc;
    }, {});

    const formatPrettyDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatKey = (year, month, day) => `${year}-${month}-${day}`;

    const openNewWindow = (url) => {
        const width = screen.width;
        const height = screen.height;
        window.open(
            url,
            "_blank",
            `noopener,noreferrer,width=${width},height=${height}`
        );
    };

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
            <div className="flex overflow-hidden">
                <div className={` m-2 w-full bg-gradient-to-br from-green-50 to-gray-50 rounded-xl shadow-lg ${ad.length > 0 ? "md:w-4/5" : "md:full "}`}>
                    <div className="p-4 md:p-8">
                        <style>
                            {`
                    @keyframes blinkScaleTranslateColor {
                     0% {
                transform: scale(1) translate(0, 0);
                background-color: rgba(144, 238, 144, 0.8);
                }   
                 50% {
                transform: scale(1.05) translate(0, -2px);
                background-color: rgba(34, 193, 34, 0.9);
                    }
                     100% {
                transform: scale(1) translate(0, 0);
                background-color: rgba(144, 238, 144, 0.8);
                    }
                }
        
                .animate-blink {
            animation: blinkScaleTranslateColor 1.5s infinite ease-in-out;
            box-shadow: 0 4px 6px -1px rgba(34, 193, 34, 0.3);
             }
        
             .month-btn {
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
        
                .month-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
                }
        
                .calendar-day {
                         transition: all 0.2s ease;
                }
        
                 .empty-day {
            background-color: transparent !important;
            pointer-events: none;
                }
             `}
                        </style>

                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                365 Days Rally PDF Course Challenge - {level}
                            </h2>

                            <div className="flex flex-col md:flex-row items-center justify-center mb-8 p-4 bg-white rounded-xl shadow-md">
                                <label htmlFor="year" className="text-lg font-medium text-gray-700 mb-2 md:mb-0 md:mr-4">
                                    Select Year:
                                </label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    min="2000"
                                    max="2100"
                                    className="border-2 border-green-200 p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center w-32"
                                    placeholder='YYYY'
                                    value={year}
                                    onChange={handleYearChange}
                                />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Month Selection Panel */}
                                <div className="w-full lg:w-1/4 bg-white p-4 rounded-xl shadow-md">
                                    <h3 className="text-xl font-semibold mb-4 text-center text-green-800 border-b-2 border-green-100 pb-2">
                                        Select Month
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {months.map((monthName, index) => (
                                            <button
                                                key={index}
                                                className={`month-btn p-3 text-center rounded-lg transition-all ${month === index
                                                    ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg'
                                                    : 'bg-gray-50 hover:bg-green-50 text-gray-800'
                                                    }`}
                                                onClick={() => handleMonthClick(index)}
                                            >
                                                {monthName}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendar Panel */}
                                <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
                                    <div className="text-xl md:text-2xl font-bold text-center mb-4 p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 text-green-800">
                                        Each Month's First Day is Free!
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-fixed text-center border-collapse">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-green-800 to-green-600 text-white">
                                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                                        <th
                                                            key={index}
                                                            className="p-3 md:p-4 border border-green-700 font-medium text-sm md:text-base"
                                                        >
                                                            {day}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                                {weeks.map((week, weekIndex) => (
                                                    <tr key={weekIndex}>
                                                        {week.map((day, dayIndex) => (
                                                            day == 1 || isfree ? (
                                                                <td
                                                                    key={dayIndex}
                                                                    className={`p-2 md:p-3 border border-gray-100 calendar-day ${day === selectedDate
                                                                        ? 'selected-day bg-green-600 text-white rounded-full scale-105'
                                                                        : 'animate-blink bg-green-100 text-green-800 font-medium rounded-lg'
                                                                        }`}
                                                                    onClick={() => day && handleDateClick(day)}
                                                                >
                                                                    <div className="flex flex-col items-center justify-center h-full">
                                                                        <span className="text-xs md:text-sm">FREE</span>
                                                                    </div>
                                                                </td>
                                                            ) : (
                                                                <td
                                                                    key={dayIndex}
                                                                    className={`p-2 md:p-3 border border-gray-100 calendar-day ${!day ? 'empty-day' : ''} ${day === selectedDate
                                                                        ? 'selected-day bg-green-600 text-white rounded-full scale-105'
                                                                        : day
                                                                            ? 'hover:bg-green-100 cursor-pointer text-gray-700'
                                                                            : 'bg-gray-50'
                                                                        }`}
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
                                    </div>

                                    {selectedDate && (
                                        <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-center text-green-800 font-medium">
                                                Selected: {`${year} ${months[month]} ${selectedDate}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>



                        <div className=" p-4 ">
                            <div className="flex justify-end mb-6">
                                <input
                                    type="search"
                                    placeholder="🔍 Filter Exams..."
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                />
                            </div>
                            <div >
                                {filteredPdfs.length === 0 ? (
                                    <div className="text-center col-span-full text-red-500 text-xl font-semibold">
                                        No PDFs found for this date.
                                    </div>
                                ) : (
                                    Object.entries(groupedPdfs).map(([dateKey, pdfs]) => {
                                        const [y, m, d] = dateKey.split('-');
                                        const dateStr = new Date(y, m, d).toISOString(); // for formatting

                                        return (
                                            <div key={dateKey} className="mb-6 mt-6">
                                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                                    {formatPrettyDate(dateStr)}
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ">
                                                    {pdfs.map((pdf, index) => {
                                                        const { year: pdfYear, month: pdfMonth, day: pdfDay } = formatDateToYMD(pdf.date);
                                                        const key = formatKey(pdfYear, pdfMonth, pdfDay);

                                                        return (
                                                            <div
                                                                key={index}
                                                                ref={(el) => (pdfRefs.current[key] = el)}
                                                                className={`border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white ${selectedDate === pdfDay ? 'ring-2 ring-blue-500' : ''
                                                                    }`}
                                                            >
                                                                {/* Subject Header */}
                                                                <h2 className="text-lg font-bold mb-3 text-center py-1 bg-green-100 rounded-md">
                                                                    {pdf.subject}
                                                                </h2>

                                                                {/* Exam Details */}
                                                                <div className="flex justify-between text-sm text-gray-600 mb-3">
                                                                    <span>📝 {pdf.questions} Qs</span>
                                                                    <span>⏱️ {pdf.time} min</span>
                                                                    <span>🏆 {pdf.marks} pts</span>
                                                                </div>

                                                                {/* Schedule */}
                                                                <div className="text-center text-sm text-gray-700 mb-4 px-2">
                                                                    <p dangerouslySetInnerHTML={{ __html: pdf.schedule }} />
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex justify-between space-x-2">
                                                                    <a
                                                                        href={pdf.pdfLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex-1 text-center text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                                                                    >
                                                                        View PDF
                                                                    </a>
                                                                    {/* <button
                                                                        onClick={() => openNewWindow(`/instruction/${pdf.exams[0]}`)}
                                                                        className="flex-1 text-center text-white bg-green-600 hover:bg-green-700 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                                                                    >
                                                                        Take Test
                                                                    </button> */}
                                                                    {/* Check if the current date is greater than or equal to live_date */}
                                                                    {new Date(pdf.exams[0]?.live_date) > new Date() ? (
                                                                        // Display "Coming Soon" if the current date is earlier than live_date
                                                                        <div className=" text-red-500 font-semibold py-2 px-4 border-1 border-red-500 rounded">
                                                                            Coming Soon
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            className={` flex-1 text-center text-white bg-green-600 hover:bg-green-700 py-2 px-3 rounded-md text-sm font-medium transition-colors ${resultData?.[test._id]?.status === "completed"
                                                                                ? "bg-green-500 text-white hover:bg-green-600"
                                                                                : pdf.exams[0]?.status === "true"
                                                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                                                    : "border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                                                                }`}
                                                                            onClick={() => {
                                                                                if (!isSignedIn) {
                                                                                    navigate('/sign-in')
                                                                                }
                                                                                else if (resultData?.[test._id]?.status === "completed") {
                                                                                    openNewWindow(`/result/${pdf.exams[0]?._id}`);
                                                                                } else if (pdf.exams[0].status === "true") {
                                                                                    openNewWindow(`/instruction/${pdf.exams[0]?._id}`);
                                                                                }
                                                                            }}
                                                                        >
                                                                            {resultData?.[test._id]?.status === "completed" ? (
                                                                                "View Result"
                                                                            ) : pdf.exams[0]?.status === "true" ? (
                                                                                "Take Test"
                                                                            ) : (
                                                                                <span className="flex items-center justify-center font-semibold">
                                                                                    <IoMdLock />
                                                                                    Lock
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                  )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
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
