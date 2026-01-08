import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Api from '../../service/Api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdLock } from 'react-icons/io';
import { UserContext } from '../../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { fetchUtcNow } from '../../service/timeApi';
import { generateImageEnabledPDF } from '../../utils/pdfGenerator';

const PdfCourse = () => {

    const [ad, setAD] = useState([])
    const [seo, setSeo] = useState([])
    const [alldata, setAlldata] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [resultData, setResultData] = useState(null);
    const [AllExamsName, setAllExamsName] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [openScheduleId, setOpenScheduleId] = useState(null);
    const [utcNow, setUtcNow] = useState(null);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isfree] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [generatingPdf, setGeneratingPdf] = useState({}); // Tracking loading state per examId

    // 1. Fetch UTC time from server
    useEffect(() => {
        fetchUtcNow()
            .then(globalDate => {
                setUtcNow(globalDate);

                // Set year and month after fetching UTC date
                setYear(globalDate.getFullYear());
                setMonth(globalDate.getMonth());
            })
            .catch(error => {
                console.error("Failed to fetch UTC time:", error);
            });
    }, []);

    // Memoized toggle function
    const toggleSchedule = useCallback((id) => {
        setOpenScheduleId((prevId) => (prevId === id ? null : id));
    }, []);

    const { user } = useContext(UserContext);
    const { level } = useParams();

    const { isSignedIn } = useUser();
    const pdfRefs = useRef({});
    const navigate = useNavigate();

    useEffect(() => {
        run(); // Step 1: only fetch and set alldata here
    }, [level]);

    const run = async () => {
        const response = await Api.get(`pdf-Course/courses`);
        const filteredData = response.data.filter(item => item.exam_level?.toLowerCase() === level.toLowerCase());
        setAlldata(filteredData);

        const pdfExams = await Api.get("pdf-Course/Exams");
        setAllExamsName(pdfExams.data);

        const response2 = await Api.get(`/get-Specific-page/pdf-course`);
        setSeo(response2.data);

        const response3 = await Api.get(`/blog-Ad/getbypage/pdf-course`);
        setAD(response3.data);
    };

    // Step 2: Now that alldata is updated, fetch results
    useEffect(() => {
        if (!user?._id || !alldata.length) return;

        alldata.forEach((pdf) => {
            const examId = pdf.exams?.[0]?._id;
            if (!examId) return;

            Api.get(`/PDFresults/${user._id}/${examId}`)
                .then((res) => {
                    if (res.data?.status === "completed" || res.data?.status === "paused") {
                        setResultData((prev) => ({
                            ...prev,
                            [examId]: {
                                ...res.data,
                                lastQuestionIndex: res.data.lastVisitedQuestionIndex,
                                selectedOptions: res.data.selectedOptions,
                            },
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching result for", examId, ":", err);
                });
        });
    }, [alldata, user?._id, level, refetchTrigger]);

    // Listen for page visibility changes to refetch results when user returns
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Trigger refetch when page becomes visible again
                setRefetchTrigger(prev => prev + 1);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);


    // Memoized calendar generation
    const generateCalendar = useCallback((year, month) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        const firstDayOfWeek = firstDayOfMonth.getDay();
        const calendarDays = [];

        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDays.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }

        const weeks = [];
        while (calendarDays.length) {
            weeks.push(calendarDays.splice(0, 7));
        }

        return weeks;
    }, []);

    const handleDateClick = useCallback((day) => {
        setSelectedDate(day);
    }, []);

    const handleYearChange = useCallback((event) => {
        setYear(Number(event.target.value));
    }, []);

    const handleMonthClick = useCallback((index) => {
        setMonth(index);
    }, []);

    useEffect(() => {
        setSelectedDate(null); // Reset selected date when month/year changes
    }, [year, month]);

    // Memoized calendar weeks
    const weeks = useMemo(() => {
        if (year === null || month === null) return [];
        return generateCalendar(year, month);
    }, [year, month, generateCalendar]);

    // Static months array
    const months = useMemo(() => [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ], []);

    // Memoized date formatter
    const formatDateToYMD = useCallback((dateString) => {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
        };
    }, []);

    // Memoized filtered PDFs
    const filteredPdfs = useMemo(() => {
        return alldata.filter((pdf) => {
            if (!pdf.examName || !pdf.date) return false;

            const { year: pdfYear, month: pdfMonth } = formatDateToYMD(pdf.date);
            const matchesYear = pdfYear === year;
            const matchesMonth = pdfMonth === month;
            const matchesExam = selectedExam && pdf.examName.toLowerCase() === selectedExam.toLowerCase();

            if (selectedExam) {
                return matchesExam && matchesYear;
            }

            return matchesYear && matchesMonth;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [alldata, year, month, selectedExam, formatDateToYMD]);


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

    // Memoized grouped PDFs by day
    const groupedPdfs = useMemo(() => {
        return filteredPdfs.reduce((acc, pdf) => {
            const date = new Date(pdf.date);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(pdf);
            return acc;
        }, {});
    }, [filteredPdfs]);

    // Memoized helper functions
    const formatPrettyDate = useCallback((dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    }, []);

    const formatKey = useCallback((year, month, day) => `${year}-${month}-${day}`, []);

    const openNewWindow = useCallback((url) => {
        const width = screen.width;
        const height = screen.height;
        window.open(
            url,
            "_blank",
            `noopener,width=${width},height=${height}`
        );
    }, []);


    const handleViewPdf = async (pdf) => {
        const examId = pdf.exams?.[0]?._id;
        if (!examId) return;

        setGeneratingPdf(prev => ({ ...prev, [examId]: true }));

        try {
            // 1. Fetch complete exam details to get the questions
            const response = await Api.get(`pdf-exams/getExam/${examId}`);
            const exam = response.data;

            if (!exam || !exam.section) {
                throw new Error("Exam data not found or incomplete");
            }

            // 2. Extract and flatten all questions from sections
            // We'll prioritize English for the PDF generation
            const questions = exam.section.flatMap(sec =>
                (sec.questions?.english || []).map(q => ({
                    ...q,
                    sectionName: sec.name
                }))
            );

            if (questions.length === 0) {
                alert("No questions found in this exam to generate a PDF.");
                return;
            }

            // 3. Generate the PDF with user email as watermark
            await generateImageEnabledPDF(questions, {
                title: exam.show_name || exam.exam_name || "Exam PDF",
                watermarkText: user?.email || "ExamRally",
                sectionTitle: "Full Exam Questions",
                explanationTitle: "Answer & Explanations"
            });

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again later.");
        } finally {
            setGeneratingPdf(prev => ({ ...prev, [examId]: false }));
        }
    };

    // Check if user has ANY active PDF subscription (using context)
    const hasActiveSubscription = () => {
        if (!user?.subscriptions || !utcNow) return false;

        const activePdfSubscription = user.subscriptions.find(sub =>
            sub.status === 'Active' &&
            (Array.isArray(sub.courseName)
                ? sub.courseName.some(name => name?.includes('PDF Course') || name?.includes('Pdf Course'))
                : sub.courseName?.includes('PDF Course') || sub.courseName?.includes('Pdf Course')
            )
        );

        if (!activePdfSubscription) return false;

        const expiry = new Date(activePdfSubscription.expiryDate);
        return expiry > utcNow;
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
                                <div className="relative w-full max-w-xs">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                        FILTER BY EXAM
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="examName"
                                            value={selectedExam}
                                            onChange={(e) => setSelectedExam(e.target.value)}
                                            className="appearance-none w-full pl-4 pr-10 py-2 text-sm border-2 border-indigo-100 rounded-lg bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                        >
                                            <option value="">All Exams</option>
                                            {AllExamsName?.map((Exname) => (
                                                <option key={Exname._id} value={Exname.Exam}>
                                                    {Exname.Exam}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg
                                                className="w-4 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
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
                                                                {openScheduleId !== pdf._id && (
                                                                    <div className="text-center text-sm text-gray-700 mb-4 px-2">
                                                                        <button
                                                                            onClick={() => toggleSchedule(pdf._id)}
                                                                            className="mt-2 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                                                        >
                                                                            Show Schedule
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {openScheduleId === pdf._id && (
                                                                    <div className="text-sm text-gray-700 mb-4 px-2">
                                                                        <div className="mt-2 bg-purple-50 p-3 rounded shadow-inner border border-purple-200">
                                                                            <p dangerouslySetInnerHTML={{ __html: pdf.schedule }} />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {/* Action Buttons */}
                                                                <div className="flex justify-between space-x-2">
                                                                    {(() => {
                                                                        const examId = pdf.exams[0]?._id;

                                                                        // 🔒 LOCKED: If content is paid & user has no subscription
                                                                        if (pdf.exams[0]?.result_type === "paid" && !hasActiveSubscription()) {
                                                                            return (
                                                                                <div
                                                                                    onClick={() => navigate('/pdf-course#pdf-plan')}
                                                                                    className="flex-1 flex items-center justify-center font-semibold gap-1 text-red-500 border-1 border-red-500 px-4 py-2 rounded cursor-pointer hover:bg-red-50 transition-colors"
                                                                                >
                                                                                    <IoMdLock /> Locked
                                                                                </div>
                                                                            );
                                                                        }

                                                                        // 🔒 LOCKED: Even if content is free, if live date is in the future, show "Locked"
                                                                        if (!hasActiveSubscription() && pdf.exams[0]?.live_date && new Date(pdf.exams[0].live_date) > utcNow) {
                                                                            return (
                                                                                <div
                                                                                    onClick={() => navigate('/pdf-course#pdf-plan')}
                                                                                    className="flex-1 flex items-center justify-center font-semibold gap-1 text-red-500 border-1 border-red-500 px-4 py-2 rounded cursor-pointer hover:bg-red-50 transition-colors"
                                                                                >
                                                                                    <IoMdLock /> Locked
                                                                                </div>
                                                                            );
                                                                        }

                                                                        // ⏳ COMING SOON: Only if subscribed AND live date is in future
                                                                        if (hasActiveSubscription() && pdf.exams[0]?.live_date && new Date(pdf.exams[0].live_date) > utcNow) {
                                                                            return (
                                                                                <div className="flex-1 text-red-500 font-semibold py-2 px-4 border-1 border-red-500 rounded text-center">
                                                                                    Coming Soon
                                                                                </div>
                                                                            );
                                                                        }

                                                                        // ✅ AVAILABLE: Show both View PDF and action button
                                                                        return (
                                                                            <>
                                                                                <button
                                                                                    disabled={generatingPdf[examId]}
                                                                                    onClick={() => handleViewPdf(pdf)}
                                                                                    className={`flex-1 text-center text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-md text-sm font-medium transition-colors ${generatingPdf[examId] ? "opacity-50 cursor-not-allowed" : ""
                                                                                        }`}
                                                                                >
                                                                                    {generatingPdf[examId] ? "Generating..." : "View PDF"}
                                                                                </button>

                                                                                <button
                                                                                    className={`flex-1 text-center text-white py-2 px-3 rounded-md text-sm font-medium transition-colors ${resultData?.[examId]?.status === "completed"
                                                                                        ? "bg-green-600 hover:bg-green-700"
                                                                                        : resultData?.[examId]?.status === "paused"
                                                                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                                                                            : "bg-green-600 hover:bg-green-700"
                                                                                        }`}
                                                                                    onClick={() => {
                                                                                        const results = resultData?.[examId];
                                                                                        if (results?.status === "completed") {
                                                                                            openNewWindow(`/pdf/MockResult/${examId}`);
                                                                                        } else if (results?.status === "paused") {
                                                                                            openNewWindow(`/pdf/test/${examId}`);
                                                                                        } else {
                                                                                            openNewWindow(`/instruction/${examId}`);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    {resultData?.[examId]?.status === "completed"
                                                                                        ? "View Result"
                                                                                        : resultData?.[examId]?.status === "paused"
                                                                                            ? "Resume"
                                                                                            : "Take Test"}
                                                                                </button>
                                                                            </>
                                                                        );
                                                                    })()}
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
