import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Api from '../../service/Api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdLock } from 'react-icons/io';
import { FaClock, FaAward, FaClipboardList } from 'react-icons/fa';
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
    const [selectedLanguage, setSelectedLanguage] = useState({}); // Language selection per examId (english/tamil/hindi)

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

        const pdfExams = await Api.get("/pdf-Course/Exams");
        setAllExamsName(pdfExams.data);
        console.log(pdfExams.data);

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


    const handleViewPdf = async (pdf, lang = null) => {
        const examId = pdf.exams?.[0]?._id;
        if (!examId) return;

        // Use selected language or default to 'english'
        const language = lang || selectedLanguage[examId] || 'english';

        setGeneratingPdf(prev => ({ ...prev, [examId]: true }));

        try {
            // 1. Fetch complete exam details to get the questions
            const response = await Api.get(`pdf-exams/getExam/${examId}`);
            const exam = response.data;

            if (!exam || !exam.section) {
                throw new Error("Exam data not found or incomplete");
            }

            // 2. Extract and flatten all questions from sections based on selected language
            const questions = exam.section.flatMap(sec =>
                (sec.questions?.[language] || sec.questions?.english || []).map(q => ({
                    ...q,
                    sectionName: sec.name
                }))
            );

            if (questions.length === 0) {
                alert(`No questions found in ${language} for this exam. Please try another language.`);
                return;
            }

            // 3. Generate the PDF with user email as watermark and selected language
            await generateImageEnabledPDF(questions, {
                title: exam.show_name || exam.exam_name || "Exam PDF",
                watermarkText: user?.email || "ExamRally",
                sectionTitle: "Full Exam Questions",
                explanationTitle: "Answer & Explanations",
                language: language // Pass language to PDF generator
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
    console.log(alldata)
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
                            {/* Modern Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 leading-tight">
                                    365 Days Rally <span className="text-green-600 italic font-serif">PDF Course</span>
                                </h2>
                                <p className="text-slate-500 text-lg font-medium">
                                    {level.charAt(0).toUpperCase() + level.slice(1)} Level Challenge
                                </p>
                            </div>

                            {/* Year Selector */}
                            <div className="flex items-center justify-center mb-8 p-6 bg-white rounded-2xl shadow-sm border border-green-100">
                                <label htmlFor="year" className="text-lg font-bold text-slate-700 mr-4">
                                    Select Year:
                                </label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    min="2000"
                                    max="2100"
                                    className="border-2 border-green-200 px-6 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center w-32 font-bold text-slate-800 shadow-sm"
                                    placeholder='YYYY'
                                    value={year}
                                    onChange={handleYearChange}
                                />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Month Selection Panel */}
                                <div className="w-full lg:w-1/4 bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                                    <h3 className="text-xl font-black mb-6 text-center text-slate-800 pb-3 border-b-2 border-green-100">
                                        Select Month
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {months.map((monthName, index) => (
                                            <button
                                                key={index}
                                                className={`month-btn p-3 text-center rounded-xl transition-all font-medium ${month === index
                                                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                                    : 'bg-slate-50 hover:bg-green-50 text-slate-700 hover:text-green-700'
                                                    }`}
                                                onClick={() => handleMonthClick(index)}
                                            >
                                                {monthName}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendar Panel */}
                                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                                    <div className="text-xl md:text-2xl font-black text-center mb-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white shadow-md">
                                        🎁 Each Month's First Day is Free!
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-fixed text-center border-collapse">
                                            <thead>
                                                <tr className="bg-slate-800">
                                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                                        <th
                                                            key={index}
                                                            className="p-4 border border-slate-700 font-bold text-sm md:text-base text-white"
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
                                                                    className={`p-3 md:p-4 border border-slate-100 calendar-day cursor-pointer ${day === selectedDate
                                                                        ? 'selected-day bg-green-600 text-white rounded-xl scale-105 shadow-lg'
                                                                        : 'animate-blink bg-green-100 text-green-800 font-bold rounded-lg hover:scale-105'
                                                                        }`}
                                                                    onClick={() => day && handleDateClick(day)}
                                                                >
                                                                    <div className="flex flex-col items-center justify-center h-full">
                                                                        <span className="text-sm md:text-base font-black">{day}</span>
                                                                        <span className="text-xs font-bold mt-1">FREE</span>
                                                                    </div>
                                                                </td>
                                                            ) : (
                                                                <td
                                                                    key={dayIndex}
                                                                    className={`p-3 md:p-4 border border-slate-100 calendar-day ${!day ? 'empty-day' : ''} ${day === selectedDate
                                                                        ? 'selected-day bg-green-600 text-white rounded-xl scale-105 shadow-lg font-bold'
                                                                        : day
                                                                            ? 'hover:bg-green-50 cursor-pointer text-slate-700 font-medium hover:scale-105 transition-transform'
                                                                            : 'bg-slate-50'
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
                                        <div className="mt-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                                            <p className="text-center text-green-800 font-bold text-lg">
                                                📅 Selected: {`${year} ${months[month]} ${selectedDate}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>



                        <div className="p-4">

                            <div className="flex justify-end mb-8">
                                <div className="relative w-full max-w-md">
                                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                                        📚 Filter by Exam
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="examName"
                                            value={selectedExam}
                                            onChange={(e) => setSelectedExam(e.target.value)}
                                            className="appearance-none w-full pl-4 pr-10 py-3 text-base font-medium border-2 border-green-100 rounded-xl bg-white shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                        >
                                            <option value="">All Exams</option>
                                            {AllExamsName?.map((Exname) => (
                                                <option key={Exname._id} value={Exname.Exam}>
                                                    {Exname.Exam}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-green-600">
                                            <svg
                                                className="w-5 h-5 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {filteredPdfs.length === 0 ? (
                                    <div className="text-center py-20 col-span-full">
                                        <div className="text-6xl mb-4">📭</div>
                                        <p className="text-slate-400 text-xl font-bold">No PDFs found for this selection</p>
                                        <p className="text-slate-300 text-sm mt-2">Try selecting a different month or exam</p>
                                    </div>
                                ) : (
                                    Object.entries(groupedPdfs).map(([dateKey, pdfs]) => {
                                        const [y, m, d] = dateKey.split('-');
                                        const dateStr = new Date(y, m, d).toISOString();

                                        return (
                                            <div key={dateKey} className="mb-10">
                                                <h3 className="text-2xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-3">
                                                    <span className="text-green-600">📅</span>
                                                    {formatPrettyDate(dateStr)}
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
                                                    {pdfs.map((pdf, index) => {
                                                        const { year: pdfYear, month: pdfMonth, day: pdfDay } = formatDateToYMD(pdf.date);
                                                        const key = formatKey(pdfYear, pdfMonth, pdfDay);

                                                        return (
                                                            <div
                                                                key={index}
                                                                ref={(el) => (pdfRefs.current[key] = el)}
                                                                className={`border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-300 bg-white ${selectedDate === pdfDay ? 'ring-2 ring-green-500 border-green-400' : ''
                                                                    }`}
                                                            >
                                                                {/* Exam Name at Top */}
                                                                {/* Exam Name Chip */}
                                                                <div className="flex justify-end mb-2">
                                                                    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-300 rounded-full px-3 py-1">
                                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                                                                            {pdf.examName}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Subject Header */}
                                                                <h2 className="text-sm font-bold mb-3 text-center py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg">
                                                                    {pdf.subject === "Quants" ? "Quantitative Aptitude" : pdf.subject === "Reasoning" ? "Reasoning Ability" : pdf.subject === "English" ? "English Language" : pdf.subject}
                                                                </h2>

                                                                {/* Exam Details */}
                                                                <div className="flex justify-around text-xs text-slate-600 mb-3 bg-slate-50 rounded-lg py-2">
                                                                    <div className="text-center flex flex-col items-center gap-1">
                                                                        <FaClipboardList className="text-green-600 text-xs" />
                                                                        <div className="font-bold text-sm text-slate-600">{pdf.questions}Q</div>
                                                                    </div>
                                                                    <div className="text-center flex flex-col items-center gap-1">
                                                                        <FaClock className="text-blue-600 text-xs" />
                                                                        <div className="font-bold text-sm text-slate-600">{pdf.time}Min</div>
                                                                    </div>
                                                                    <div className="text-center flex flex-col items-center gap-1">
                                                                        <FaAward className="text-amber-600 text-xs" />
                                                                        <div className="font-bold text-sm text-slate-600">{pdf.marks}Mrk</div>
                                                                    </div>
                                                                </div>

                                                                {/* Schedule */}
                                                                {openScheduleId !== pdf._id && (
                                                                    <div className="text-center mb-3">
                                                                        <button
                                                                            onClick={() => toggleSchedule(pdf._id)}
                                                                            className="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-all border border-green-200"
                                                                        >
                                                                            📋 Schedule
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {openScheduleId === pdf._id && (
                                                                    <div className="text-xs text-slate-700 mb-3">
                                                                        <div className="bg-green-50 p-3 rounded-lg shadow-inner border border-green-200">
                                                                            <p dangerouslySetInnerHTML={{ __html: pdf.schedule }} />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => toggleSchedule(pdf._id)}
                                                                            className="w-full mt-2 px-3 py-1.5 text-green-700 font-bold hover:underline text-xs"
                                                                        >
                                                                            Hide
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {/* Language Selector - Show only if content is available */}
                                                                {(() => {
                                                                    const examId = pdf.exams[0]?._id;
                                                                    const exam = pdf.exams[0];

                                                                    // Only show language selector if exam is accessible
                                                                    if (exam?.result_type === "paid" && !hasActiveSubscription()) return null;
                                                                    if (!hasActiveSubscription() && exam?.live_date && new Date(exam.live_date) > utcNow) return null;
                                                                    if (hasActiveSubscription() && exam?.live_date && new Date(exam.live_date) > utcNow) return null;

                                                                    // Check which languages are available
                                                                    const hasEnglish = exam?.english_status;
                                                                    const hasTamil = exam?.tamil_status;
                                                                    const hasHindi = exam?.hindi_status;

                                                                    // Count available languages
                                                                    const availableLanguages = [hasEnglish, hasTamil, hasHindi].filter(Boolean).length;

                                                                    // Only show selector if more than one language is available
                                                                    if (availableLanguages <= 1) return null;

                                                                    const currentLang = selectedLanguage[examId] || 'english';

                                                                    return (
                                                                        <div className="mb-3 pb-3 border-b border-gray-200">
                                                                            <p className="text-xs text-gray-600 mb-2 text-center font-medium">PDF Language:</p>
                                                                            <div className="flex gap-2 justify-center">
                                                                                {hasEnglish && (
                                                                                    <button
                                                                                        onClick={() => setSelectedLanguage(prev => ({ ...prev, [examId]: 'english' }))}
                                                                                        className={`text-xs px-3 py-1 rounded-full transition-all ${currentLang === 'english'
                                                                                            ? 'bg-blue-600 text-white'
                                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                                            }`}
                                                                                    >
                                                                                        English
                                                                                    </button>
                                                                                )}
                                                                                {hasTamil && (
                                                                                    <button
                                                                                        onClick={() => setSelectedLanguage(prev => ({ ...prev, [examId]: 'tamil' }))}
                                                                                        className={`text-xs px-3 py-1 rounded-full transition-all ${currentLang === 'tamil'
                                                                                            ? 'bg-blue-600 text-white'
                                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                                            }`}
                                                                                    >
                                                                                        தமிழ்
                                                                                    </button>
                                                                                )}
                                                                                {hasHindi && (
                                                                                    <button
                                                                                        onClick={() => setSelectedLanguage(prev => ({ ...prev, [examId]: 'hindi' }))}
                                                                                        className={`text-xs px-3 py-1 rounded-full transition-all ${currentLang === 'hindi'
                                                                                            ? 'bg-blue-600 text-white'
                                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                                            }`}
                                                                                    >
                                                                                        हिंदी
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}

                                                                {/* Action Buttons */}
                                                                <div className="flex justify-between space-x-2">
                                                                    {(() => {
                                                                        const examId = pdf.exams[0]?._id;
                                                                        const id = pdf.exams[0]?._id;

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
                                                                                            openNewWindow(`/pdf/result/${id}/${user._id}`);
                                                                                        } else if (results?.status === "paused") {
                                                                                            openNewWindow(`/pdf/mocktest/${id}/${user._id}`);
                                                                                        } else {
                                                                                            openNewWindow(`/pdf/instruction/${id}/${user._id}`);
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
