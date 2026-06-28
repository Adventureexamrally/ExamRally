import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Api from '../../service/Api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdLock } from 'react-icons/io';
import { FaClock, FaAward, FaClipboardList } from 'react-icons/fa';
import { UserContext } from '../../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { fetchUtcNow } from '../../service/timeApi';
import { generateImageEnabledPDF } from '../../utils/pdfGenerator';
import { FaFilePdf, FaCalendar } from 'react-icons/fa';
import './button.css';

const PdfCourse = () => {

    const [ad, setAD] = useState([])
    const [seo, setSeo] = useState([])
    const [alldata, setAlldata] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(false);
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
    const [pdfProducts, setPdfProducts] = useState([]); // Store valid PDF Course Products

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

    const { user, isFetchingUser } = useContext(UserContext);
    const { level } = useParams();

    const { isSignedIn } = useUser();
    const pdfRefs = useRef({});
    const navigate = useNavigate();

    // Fetch pdfResults from Redux store
    const pdfResults = useSelector((state) => state.user.pdfResults);

    useEffect(() => {
        runMeta(); // Fetch exams list, SEO, ads (once)
    }, [level]);

    // Re-fetch PDF courses whenever year/month/exam changes (backend-driven)
    useEffect(() => {
        if (year === null || month === null) return;
        fetchCourses();
    }, [year, month, selectedExam, level]);

    const runMeta = async () => {
        try {
            const [examsRes, seoRes, adRes] = await Promise.all([
                Api.get("/pdf-Course/Exams").catch(() => ({ data: [] })),
                Api.get(`/get-Specific-page/pdf-course`).catch(() => ({ data: [] })),
                Api.get(`/blog-Ad/getbypage/pdf-course`).catch(() => ({ data: [] }))
            ]);
            setAllExamsName(examsRes?.data || []);
            setSeo(seoRes?.data || []);
            setAD(adRes?.data || []);
        } catch (error) {
            console.error("Error fetching meta data:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            setIsFetchingData(true);
            const params = new URLSearchParams();
            if (year) params.append('year', year);
            if (month !== null && month !== undefined) params.append('month', month);
            if (selectedExam) params.append('examName', selectedExam);
            const coursesRes = await Api.get(`pdf-Course/courses/filter?${params.toString()}`);
            if (coursesRes?.data) {
                const filtered = coursesRes.data.filter(item =>
                    item.exam_level?.toLowerCase() === level.toLowerCase()
                );
                setAlldata(filtered);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsFetchingData(false);
        }
    };

    // Separate effect to fetch products, ensuring it runs independently of 'run'
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Using the standard endpoint that works in PdfCourseHome
                const response = await Api.get('pdfcourseDetails/pdf-products');
                if (Array.isArray(response.data)) {
                    setPdfProducts(response.data);
                } else {
                    // console.log("PDF DEBUG - Products response is not array:", response.data); // Removed debug log
                }
            } catch (error) {
                console.error("Failed to fetch PDF products:", error); // Changed to console.error
            }
        };
        fetchProducts();
    }, []);

    // Removed local fetch logic for results since it's now handled by Redux.

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

    // FREE day = day 1, unless the 1st is a Sunday (no releases on Sunday) → day 2
    const freeDay = useMemo(() => {
        if (year === null || month === null) return 1;
        const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
        return firstDayOfWeek === 0 ? 2 : 1;
    }, [year, month]);

    // Memoized date formatter
    const formatDateToYMD = useCallback((dateString) => {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
        };
    }, []);

    // filteredPdfs: alldata is already filtered by backend, just sort
    const filteredPdfs = useMemo(() => {
        return [...alldata].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [alldata]);


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

            // 4. Track the PDF View in the backend
            if (user?._id) {
                try {
                    await Api.post('/pdf-views/track', {
                        examId: examId,
                        scheduleId: pdf._id,
                        userId: user._id
                    });
                } catch (trackError) {
                    console.error("Error tracking PDF view:", trackError);
                }
            }

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again later.");
        } finally {
            setGeneratingPdf(prev => ({ ...prev, [examId]: false }));
        }
    };

    // Check if user has ANY active PDF subscription or enrollment (using context)
    const hasActiveSubscription = () => {
        if ((!user?.subscriptions && !user?.enrolledCourses) || !utcNow) return false;

        // Helper to check expiry
        const isActive = (expiryDate) => new Date(expiryDate) > utcNow;

        // 1. Check Subscriptions (Standard PDF Subscription)
        const activePdfSubscription = user?.subscriptions?.find(sub =>
            sub.status === 'Active' &&
            (Array.isArray(sub.courseName)
                ? sub.courseName.some(name => name?.toLowerCase().includes('pdf course'))
                : sub.courseName?.toLowerCase().includes('pdf course')
            ) && isActive(sub.expiryDate)
        );
        if (activePdfSubscription) return true;

        // 2. Check Enrolled Courses (Name Match - Backup)
        const activeEnrolledCourseByName = user?.enrolledCourses?.find(course =>
            course.status === 'Active' &&
            (Array.isArray(course.courseName)
                ? course.courseName.some(name => name?.toLowerCase().includes('pdf course'))
                : course.courseName?.toLowerCase().includes('pdf course')
            ) && isActive(course.expiryDate)
        );
        if (activeEnrolledCourseByName) return true;

        // 3. Check Enrolled Courses (ID Match - For Combo Packages & Direct Buys)
        if (pdfProducts.length > 0) {
            const productIds = pdfProducts.map(item => item._id);
            const activeEnrolledCourseByID = user?.enrolledCourses?.find(course =>
                course.status === 'Active' &&
                course.courseId?.some(id => productIds.includes(id)) &&
                isActive(course.expiryDate)
            );
            if (activeEnrolledCourseByID) return true;
        }

        return false;
    };

    return (
        <>
            <Helmet>
                <title>{seo[0]?.seoData?.title || `365 Days Rally PDF Course ${level} – ExamRally`}</title>
                <meta name="description" content={seo[0]?.seoData?.description || `Access daily PDF mock tests for ${level} level bank exams. Covering SBI, IBPS & RBI with Prelims and Mains pattern questions.`} />
                <meta name="keywords" content={seo[0]?.seoData?.keywords || "PDF course, bank exam PDF, daily mock test, SBI prelims, IBPS mains"} />
                <link rel="canonical" href={seo[0]?.seoData?.canonical || `https://examrally.in/pdf-course/${level}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="ExamRally" />
                <meta property="og:url" content={seo[0]?.seoData?.canonical || `https://examrally.in/pdf-course/${level}`} />
                <meta property="og:title" content={seo[0]?.seoData?.ogTitle || seo[0]?.seoData?.title || "PDF Course – ExamRally"} />
                <meta property="og:description" content={seo[0]?.seoData?.ogDescription || seo[0]?.seoData?.description || "Daily PDF mock tests for bank exams."} />
                <meta property="og:image" content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seo[0]?.seoData?.ogTitle || seo[0]?.seoData?.title || "PDF Course"} />
                <meta name="twitter:description" content={seo[0]?.seoData?.ogDescription || seo[0]?.seoData?.description || "Daily PDF mock tests for bank exams."} />
                <meta name="twitter:image" content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"} />
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
                            <div className="text-center mb-4">
                                <h2 className="text-3xl md:text-3xl font-bold text-slate-800 mb-3 leading-tight">
                                    365 Days Rally <span className="">PDF Course</span>
                                </h2>
                                <p className="text-slate-500 text-lg font-medium mb-4">
                                    {level ? level.charAt(0).toUpperCase() + level.slice(1) : ''} Level Challenge
                                </p>

                                {/* Level Switch Toggle */}
                                <div className="flex justify-center items-center gap-1 bg-slate-100 p-1.5 rounded-full w-max mx-auto border border-slate-200 shadow-sm">
                                    <button 
                                        onClick={() => navigate('/pdf-course/prelims')} 
                                        className={`px-8 py-2 rounded-full font-bold text-sm transition-all duration-300 ${level?.toLowerCase() === 'prelims' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:text-green-700 hover:bg-slate-200'}`}
                                    >
                                        Prelims
                                    </button>
                                    <button 
                                        onClick={() => navigate('/pdf-course/mains')} 
                                        className={`px-8 py-2 rounded-full font-bold text-sm transition-all duration-300 ${level?.toLowerCase() === 'mains' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:text-green-700 hover:bg-slate-200'}`}
                                    >
                                        Mains
                                    </button>
                                </div>
                            </div>

                            {/* ── Full-Width Stacked Layout: Calendar Top | PDFs Below ── */}
                            <div className="flex flex-col gap-6">

                                {/* TOP: Full-Width Calendar */}
                                <div className="w-full">
                                    {/* Year + Month selector — centered */}
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-slate-600 whitespace-nowrap">Select Year</span>
                                            <div className="flex items-center gap-1.5 bg-white border-2 border-green-200 rounded-xl px-3 py-1.5 shadow-sm">
                                                <button
                                                    onClick={() => setYear(y => y - 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-600 hover:text-white text-green-700 font-black transition-all"
                                                >‹</button>
                                                <span className="font-black text-slate-800 text-sm w-12 text-center">{year}</span>
                                                <button
                                                    onClick={() => setYear(y => y + 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-600 hover:text-white text-green-700 font-black transition-all"
                                                >›</button>
                                            </div>
                                        </div>
                                        {/* Month pills — full width row */}
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {months.map((monthName, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleMonthClick(index)}
                                                    className={`month-btn px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                        month === index
                                                            ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                                            : 'bg-white text-slate-600 hover:bg-green-50 hover:text-green-700 border border-slate-100'
                                                    }`}
                                                >
                                                    {monthName.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Calendar card — centered, max-width */}
                                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500">
                                            <div className="flex items-center gap-2 text-white">
                                                <FaCalendar className="text-sm" />
                                                <span className="font-black text-sm">{months[month]} {year}</span>
                                            </div>
                                            <span className="text-green-100 text-[9px] font-bold uppercase tracking-wide">
                                                <FaFilePdf className="inline mr-0.5" /> 1st FREE
                                            </span>
                                        </div>

                                        {/* Weekday headers */}
                                        <div className="grid grid-cols-7 bg-slate-800">
                                            {['S','M','T','W','T','F','S'].map((d, i) => (
                                                <div key={i} className="py-1.5 text-center text-[9px] font-black text-white">{d}</div>
                                            ))}
                                        </div>

                                        {/* Calendar grid */}
                                        <div className="p-1.5">
                                            {weeks.map((week, wIdx) => (
                                                <div key={wIdx} className="grid grid-cols-7 gap-0.5 mb-0.5">
                                                    {week.map((day, dIdx) => {
                                                        const isToday = utcNow && day === utcNow.getDate() && month === utcNow.getMonth() && year === utcNow.getFullYear();
                                                        const isSelected = day === selectedDate;
                                                        const isFreeDay = day === freeDay || isfree;
                                                        if (!day) return <div key={dIdx} className="h-8" />;
                                                        return (
                                                            <button
                                                                key={dIdx}
                                                                onClick={() => handleDateClick(day)}
                                                                className={`relative h-8 w-full flex flex-col items-center justify-center rounded-lg text-[11px] font-bold transition-all calendar-day
                                                                    ${isSelected ? 'bg-green-600 text-white shadow-md scale-105'
                                                                      : isFreeDay ? 'animate-blink bg-green-100 text-green-800 hover:scale-105'
                                                                      : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                                                                    }`}
                                                            >
                                                                <span className="leading-none">{day}</span>
                                                                {isFreeDay && !isSelected && (
                                                                    <span className="text-[6px] font-black leading-none text-green-700">FREE</span>
                                                                )}
                                                                {isToday && !isSelected && (
                                                                    <span className="absolute inset-0 rounded-lg ring-2 ring-offset-1 ring-green-500 pointer-events-none" />
                                                                )}
                                                                {isToday && isSelected && (
                                                                    <span className="absolute inset-0 rounded-lg ring-2 ring-offset-1 ring-white pointer-events-none" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Selected date chip */}
                                        {selectedDate && (
                                            <div className="mx-3 mb-3 px-3 py-2 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between">
                                                <span className="text-green-800 font-bold text-xs">
                                                    <FaCalendar className="inline mr-1.5 text-green-600" />
                                                    {months[month]} {selectedDate}
                                                </span>
                                                <button onClick={() => setSelectedDate(null)} className="text-[10px] text-green-600 font-black hover:text-green-800">✕</button>
                                            </div>
                                        )}
                                    </div> {/* end calendar card */}
                                </div> {/* end TOP calendar */}

                                {/* BOTTOM: PDF Content — full width */}
                                <div className="w-full">
                                    {/* Filter by Exam */}
                                    <div className="mb-3">
                                        <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                                            <FaFilePdf className="inline-block mr-1" /> Filter by Exam
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
                                                <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PDF list */}
                                    <div>
                                        {isFetchingData ? (
                                            <div className="flex items-center justify-center py-20 gap-3">
                                                <svg className="animate-spin h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                </svg>
                                                <span className="text-slate-500 font-semibold text-sm">Loading exams…</span>
                                            </div>
                                        ) : filteredPdfs.length === 0 ? (
                                            <div className="text-center flex flex-col items-center justify-center  py-20 col-span-full">
                                                <div className="text-6xl mb-4"><FaFilePdf /></div>
                                                <p className="text-slate-400 text-xl font-bold">No PDFs found for this selection</p>
                                                <p className="text-slate-300 text-sm mt-2">Try selecting a different year, month or exam</p>
                                            </div>
                                        ) : (
                                    Object.entries(groupedPdfs).map(([dateKey, pdfs]) => {
                                        const [y, m, d] = dateKey.split('-');
                                        const dateStr = new Date(y, m, d).toISOString();

                                        return (
                                            <div key={dateKey} className="mb-10">
                                                <h3 className=" font-semibold text-lg text-slate-800 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-3">
                                                    <span className="text-green-600"><FaCalendar /></span>
                                                    {formatPrettyDate(dateStr)}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
                                                    {pdfs.map((pdf, index) => {
                                                        const { year: pdfYear, month: pdfMonth, day: pdfDay } = formatDateToYMD(pdf.date);
                                                        const key = formatKey(pdfYear, pdfMonth, pdfDay);
                                                        return (<div
                                                                key={index}
                                                                ref={(el) => (pdfRefs.current[key] = el)}
                                                                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-green-200 ${selectedDate === pdfDay ? 'ring-2 ring-green-500' : ''}`}
                                                            >
                                                                {/* Top accent bar */}
                                                                <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500" />

                                                                <div className="p-4">
                                                                    {/* Exam name chip */}
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                                                                            {pdf.examName}
                                                                        </span>
                                                                    </div>

                                                                    {/* Subject */}
                                                                    <h2 className="text-sm font-black text-slate-800 mb-3 leading-tight">
                                                                        {pdf.subject === "Quants" ? "Quantitative Aptitude"
                                                                            : pdf.subject === "Reasoning" ? "Reasoning Ability"
                                                                            : pdf.subject === "English" ? "English Language"
                                                                            : pdf.subject}
                                                                    </h2>

                                                                    {/* Stats row */}
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <span className="flex items-center gap-1 bg-green-50 text-green-700 rounded-lg px-2 py-1 text-xs font-bold flex-1 justify-center">
                                                                            <FaClipboardList className="text-[10px]" />{pdf.questions}Q
                                                                        </span>
                                                                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded-lg px-2 py-1 text-xs font-bold flex-1 justify-center">
                                                                            <FaClock className="text-[10px]" />{pdf.time}M
                                                                        </span>
                                                                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 rounded-lg px-2 py-1 text-xs font-bold flex-1 justify-center">
                                                                            <FaAward className="text-[10px]" />{pdf.marks}
                                                                        </span>
                                                                    </div>

                                                                    {/* Assessment Topics */}
                                                                    {openScheduleId !== pdf._id && (
                                                                        <button
                                                                            onClick={() => toggleSchedule(pdf._id)}
                                                                            className="w-full px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all border border-green-100 mb-3 flex items-center justify-center gap-1.5"
                                                                        >
                                                                            <FaClipboardList className="text-[10px]" /> Assessment Topics
                                                                        </button>
                                                                    )}
                                                                    {openScheduleId === pdf._id && (
                                                                        <div className="mb-3">
                                                                            <div className="text-xs text-slate-700 bg-green-50 p-2.5 rounded-xl border border-green-100 mb-1.5">
                                                                                <p dangerouslySetInnerHTML={{ __html: pdf.schedule }} />
                                                                            </div>
                                                                            <button onClick={() => toggleSchedule(pdf._id)} className="w-full text-xs text-green-700 font-bold hover:underline">Hide ↑</button>
                                                                        </div>
                                                                    )}

                                                                    {/* Language selector */}
                                                                    {(() => {
                                                                        const examId = pdf.exams[0]?._id;
                                                                        const exam = pdf.exams[0];
                                                                        if (exam?.result_type === "paid" && !hasActiveSubscription()) return null;
                                                                        if (!hasActiveSubscription() && exam?.live_date && new Date(exam.live_date) > utcNow) return null;
                                                                        if (hasActiveSubscription() && exam?.live_date && new Date(exam.live_date) > utcNow) return null;
                                                                        const hasEnglish = exam?.english_status;
                                                                        const hasTamil = exam?.tamil_status;
                                                                        const hasHindi = exam?.hindi_status;
                                                                        const availableLanguages = [hasEnglish, hasTamil, hasHindi].filter(Boolean).length;
                                                                        if (availableLanguages <= 1) return null;
                                                                        const currentLang = selectedLanguage[examId] || 'english';
                                                                        return (
                                                                            <div className="flex gap-1.5 justify-center mb-3">
                                                                                {hasEnglish && <button onClick={() => setSelectedLanguage(prev => ({ ...prev, [examId]: 'english' }))} className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${currentLang === 'english' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>EN</button>}
                                                                                {hasTamil && <button onClick={() => setSelectedLanguage(prev => ({ ...prev, [examId]: 'tamil' }))} className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${currentLang === 'tamil' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>தமிழ்</button>}
                                                                                {hasHindi && <button onClick={() => setSelectedLanguage(prev => ({ ...prev, [examId]: 'hindi' }))} className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${currentLang === 'hindi' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>हिंदी</button>}
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {/* Action Buttons — always side by side */}
                                                                    {(() => {
                                                                        const examId = pdf.exams[0]?._id;
                                                                        const id = pdf.exams[0]?._id;

                                                                        if (isFetchingUser) {
                                                                            return <div className="w-full py-2 text-center text-xs text-slate-400 animate-pulse font-medium">Checking Access…</div>;
                                                                        }
                                                                        if (pdf.exams[0]?.result_type === "paid" && !hasActiveSubscription()) {
                                                                            return (
                                                                                <div onClick={() => navigate('/pdf-course#pdf-plan')} className="w-full flex items-center justify-center gap-1.5 text-red-500 border border-red-300 rounded-xl py-2 text-xs font-bold cursor-pointer hover:bg-red-50 transition-colors">
                                                                                    <IoMdLock /> Locked — Subscribe
                                                                                </div>
                                                                            );
                                                                        }
                                                                        if (!hasActiveSubscription() && pdf.exams[0]?.live_date && new Date(pdf.exams[0].live_date) > utcNow) {
                                                                            return (
                                                                                <div onClick={() => navigate('/pdf-course#pdf-plan')} className="w-full flex items-center justify-center gap-1.5 text-red-500 border border-red-300 rounded-xl py-2 text-xs font-bold cursor-pointer hover:bg-red-50 transition-colors">
                                                                                    <IoMdLock /> Locked
                                                                                </div>
                                                                            );
                                                                        }
                                                                        if (hasActiveSubscription() && pdf.exams[0]?.live_date && new Date(pdf.exams[0].live_date) > utcNow) {
                                                                            return <div className="w-full py-2 text-center text-xs font-bold text-orange-500 border border-orange-200 rounded-xl bg-orange-50 flex items-center justify-center gap-1.5"><FaClock className="text-orange-400" /> Coming Soon</div>;
                                                                        }

                                                                        const status = pdfResults?.[examId]?.status;
                                                                        return (
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    disabled={generatingPdf[examId]}
                                                                                    onClick={() => handleViewPdf(pdf)}
                                                                                    className={`flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white rounded-xl py-2 text-xs font-bold transition-all ${generatingPdf[examId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                >
                                                                                    {generatingPdf[examId]
                                                                                        ? <><svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> PDF</>
                                                                                        : <><FaFilePdf className="text-[10px]" /> PDF</>
                                                                                    }
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (status === "completed") openNewWindow(`/pdf/result/${id}/${user._id}`);
                                                                                        else if (status === "paused" || status === "started") openNewWindow(`/pdf/mocktest/${id}/${user._id}`);
                                                                                        else openNewWindow(`/pdf/instruction/${id}/${user._id}`);
                                                                                    }}
                                                                                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                                                                                        status === "completed" ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white'
                                                                                        : (status === "paused" || status === "started") ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white'
                                                                                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white'
                                                                                    }`}
                                                                                >
                                                                                    {status === "completed" ? "Result" : (status === "paused" || status === "started") ? "Resume" : "Take Test"}
                                                                                </button>
                                                                            </div>
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
                            </div> {/* end PDF list */}
                                </div> {/* end BOTTOM section */}
                            </div> {/* end flex-col stacked */}
                        </div> {/* end max-w-6xl */}
                    </div> {/* end p-8 */}
                </div> {/* end main card */}
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
