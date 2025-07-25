import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../service/Api';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Box,
  Grid,
  CircularProgress,
  Stack,
} from '@mui/material';

  import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

import { AccessTime, EmojiEvents } from '@mui/icons-material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoMdLock } from 'react-icons/io';
import { UserContext } from '../../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import Hometotaltest from './Hometotaltest';
import { Helmet } from 'react-helmet';

const HomeLivetest = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [resultLiveTests, setResultLiveTests] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { user, utcNow } = useContext(UserContext);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [testsRes, currentTime] = await Promise.all([
          Api.get('exams/live-test'),
      
        ]);
        
        // Extract liveTest array from response
        const testsData = testsRes.data;
        setLiveTests(Array.isArray(testsData.liveTest) ? testsData.liveTest : []);

        setUtcNow(currentTime);
        console.warn('Server UTC Time:', currentTime.toISOString());
      } catch (err) {
        console.error('Error fetching data:', err);
        setLiveTests([]);
      } finally {
        setLoading(false);
        AOS.init({ duration: 2000 });
        AOS.refresh();
      }
    };

    fetchInitialData();
  }, []);



const fetchTestStatuses = useCallback(async () => {
  console.log("Fetching test statuses...");
  const statusUpdates = {};
  
  for (const test of liveTests) {
    try {
      const res = await Api.get(`/results/${user._id}/${test._id}`);
      const statusData = res?.data;
      console.log("Status data for", test._id, statusData);
      
      if (statusData && ['completed', 'paused'].includes(statusData?.status)) {
        statusUpdates[test._id] = {
          status: statusData.status,
          lastQuestionIndex: statusData.lastVisitedQuestionIndex,
          selectedOptions: statusData.selectedOptions,
        };
        storeTestStatus(test._id, statusUpdates[test._id]);
      }
    } catch (err) {
      console.error(`Error fetching status for test ${test._id}:`, err);
      const stored = getTestStatusFromStorage(test._id);
      if (stored) {
        statusUpdates[test._id] = stored;
      }
    }
  }
  
  console.log("Updating resultLiveTests with:", statusUpdates);
  setResultLiveTests(prev => {
    const newState = {...prev, ...statusUpdates};
    console.log("New resultLiveTests state:", newState);
    return newState;
  });
}, [liveTests, user?._id]); // Add dependencies here

  useEffect(() => {
    if (!user?._id || !utcNow || liveTests.length === 0) return;
    fetchTestStatuses();
  }, [liveTests, user?._id, utcNow]);

  const getTestStatusFromStorage = (id) => {
    try {
      const raw = localStorage.getItem('testResults');
      const all = raw ? JSON.parse(raw) : {};
      return all[id] || null;
    } catch {
      return null;
    }
  };

// Add this useEffect to handle focus
useEffect(() => {
  window.addEventListener("focus", fetchTestStatuses);
  return () => {
    window.removeEventListener("focus", fetchTestStatuses);
  };
}, [fetchTestStatuses]);

  const storeTestStatus = (id, { status, lastQuestionIndex, selectedOptions }) => {
    try {
      const raw = localStorage.getItem('testResults') || '{}';
      const all = JSON.parse(raw);
      all[id] = {
        status,
        lastQuestionIndex,
        selectedOptions,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('testResults', JSON.stringify(all));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };
// And in your main component add this effect:
useEffect(() => {
  const handleMessage = (event) => {
    console.log("Received message from parent window:", event.data);
    console.log("Event origin:", event.origin, "Current origin:", window.location.origin);
    
    
    if (event.origin !== window.location.origin) return;
    
    if (event.data === 'test-status-updated') {
      console.log("Test status updated, refreshing data...");
      
      fetchTestStatuses(); // Refresh test statuses
    }
  };

  
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);

// Add localStorage event listener
// useEffect(() => {
//   const handleStorageChange = (e) => {
//     if (e.key === 'testResults') {
//       fetchTestStatuses();
//     }
//   };

//   window.addEventListener('storage', handleStorageChange);
//   return () => window.removeEventListener('storage', handleStorageChange);
// }, []);

  const formatCustomDate = (ds) => {
    if (!ds) return '';
    const d = new Date(ds);
    const day = d.getDate();
    const suffix =
      day > 3 && day < 21
        ? 'th'
        : day % 10 === 1
        ? 'st'
        : day % 10 === 2
        ? 'nd'
        : day % 10 === 3
        ? 'rd'
        : 'th';
    const month = d.toLocaleString('default', { month: 'long' });
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}${suffix} ${month} ${hours}:${minutes} ${ampm}`;
  };

  window.addEventListener("message", (event) => {
  if (event.data.redirect) {
    // Perform redirect in the original tab
    window.location.href = "/homelivetest";
  }
});

const openNewWindow = (url) => {
  window.open(
    url,
    '_blank',
    `width=${screen.width},height=${screen.height}`
  );
};
 const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedExam, setExpandedExam] = useState(null);

  const toggleExam = (exam) => {
    setExpandedExam(expandedExam === exam ? null : exam);
  };


   const [expandedId, setExpandedId] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const faqs = [
    {
      question: "How can I attempt a live test?",
      answer: "Simply register on our platform, go to the 'Live Test' section, and select the test you want to attempt on the specified date."
    },
    {
      question: "Are these live tests free of cost?",
      answer: "Yes, all our live tests are completely free to attempt on the scheduled dates."
    },
    {
      question: "Will I get my rank after the test?",
      answer: "Yes, you will receive your All-India Rank and a detailed performance analysis after the test window closes."
    },
    {
      question: "What happens if I miss a live test?",
      answer: "After the live test is over, it is moved to our 'Previous Tests' library. Our Super Pro users can access these tests anytime."
    },
    {
      question: "Are the tests available in both Hindi and English?",
      answer: "Yes, all our live tests are available in both English and Hindi."
    },
    {
      question: "How do the sectional and topic-wise live tests work?",
      answer: "These are shorter, focused tests that are also conducted live. They help you build expertise in specific areas of the syllabus."
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
    <Helmet>
  <title>Free Bank Exam Live Tests 2025: IBPS PO, SBI Clerk, RRB, LIC - Attempt Now!</title>
  <meta name="description" content="Participate in our free, all-India live tests for IBPS PO, SBI PO & Clerk, RRB PO & Clerk, LIC AAO & Assistant, and all major bank and insurance exams. Analyze your performance, get your All-India Rank, and access previous tests with our 
  rally Super Pro plan. New tests are held on specific dates - check the schedule and enroll now!" />
  
  <meta name="keywords" content="bank exam live test, free live test for bank exams,
   IBPS PO prelims live test, SBI PO prelims live test, SBI Clerk live test, RRB PO live test,
    RRB Clerk live test, LIC AAO live test, LIC Assistant live test, sectional live test for bank exams, 
    topic-wise live test for bank exams, all bank and insurance exams live test, bank exam online test series, 
    free mock test for bank exams, latest pattern bank exam tests" />

</Helmet>
<header className=" text-green-500 py-6 shadow-lg">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Bank & Insurance Exam Prep 2025
      </h1>
      <p className="mt-3 text-green-400 text-lg opacity-95">
        Free Live Tests - Compete, Analyze, and Succeed
      </p>
    </div>
  </div>
</header>

{/* Hero Section */}
<section className="relative bg-gradient-to-r from-[#0a192f] to-[#172a45] text-white py-20">
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
    <div className="absolute top-20 left-10 w-32 h-32 bg-[#64ffda] rounded-full"></div>
    <div className="absolute bottom-10 right-20 w-40 h-40 bg-[#64ffda] rounded-full"></div>
    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#64ffda] rounded-full"></div>
  </div>
  
  <div className="container mx-auto px-4 text-center relative z-10">
    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
      Real-Time Exam Experience with <span className="text-green-400 drop-shadow-[0_0_8px_rgba(100,255,218,0.6)]">All-India Ranking</span>
    </h2>
    <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed text-[#ccd6f6]">
      Participate in our all-India live mock tests, assess your performance against thousands of aspirants,
      and identify your strengths and weaknesses. Our live tests 
      are meticulously crafted by subject matter experts to align 
      with the latest exam patterns and difficulty
       levels for all major bank and insurance examinations.
    </p>
  </div>
</section>
<Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={4} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1"
        className='mt-3'
        sx={{ 
          fontWeight: 'bold', 
          color: 'success.main', 
          textAlign: 'center',
          fontSize: { xs: '1.75rem', sm: '2rem' },
        
        }}>
          Live Tests
        </Typography>
        
        <Divider sx={{ 
          bgcolor: 'success.main', 
          height: 2,
          width: '100%',
          mx: 'auto'
        }} />
      </Stack>

    <Grid container spacing={3} justifyContent="center">
  {utcNow && liveTests.length > 0 ? (
    liveTests.map((test) => {
      const res = resultLiveTests[test._id] || getTestStatusFromStorage(test._id);
      const status = res?.status;

      const start = new Date(test.livetestStartDate);
      const end = new Date(test.livetestEndDate);
      const resultTime = test.liveResult ? new Date(test.liveResult) : null;
      const utcNow = new Date(); // Current UTC time

      console.log("resultTime", resultTime, start, end, utcNow);

      let buttonText = '';
      let isButtonDisabled = false;
      let buttonColor = '';

      if (start > utcNow) {
        // Test has not started yet
        buttonText = 'Coming Soon';
        isButtonDisabled = true;
        buttonColor = 'secondary';
      } else {
        // Test has started or is ongoing
        buttonText = 'Take Test';
        isButtonDisabled = false;
        buttonColor = 'warning';
      }

      // Check test status first (regardless of time)
      if (status === 'completed') {
        buttonText = `${formatCustomDate(test.liveResult)}`;
        buttonColor = 'success';
      } else if (status === 'paused') {
        buttonText = 'Resume';
        buttonColor = 'warning';
      } 

      const handleClick = () => {
        if (!isSignedIn) {
          navigate('/sign-in');
          return;
        }

        if (buttonText === 'Resume') {
          openNewWindow(`/homelivemocktest/${test._id}/${user._id}`);
        } else if (buttonText === 'Take Test') {
          openNewWindow(`/homeliveinstruct/${test._id}/${user._id}`);
        }
      };

      return (
        <Grid item key={test._id} xs={12} sm={6} md={4} lg={3}>
          <Card
            data-aos="fade-up"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 3,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 2
              }}>
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: 'success.dark',
                    fontSize: '1.1rem'
                  }}>
                    {test.show_name}
                  </Typography>
                </Box>
                <Chip 
                  label="Free" 
                  size="small" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }} 
                />
              </Box>

              <Box className="text-[#81346b] bg-[#fedfe7]"
              sx={{ 
                borderRadius: 2, 
                p: 2, 
                mb: 3,
                flexGrow: 1
              }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Test Window:</Box> {formatCustomDate(test.livetestStartDate)} – {formatCustomDate(test.livetestEndDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents fontSize="small" sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Results:</Box> {test.liveResult ? formatCustomDate(test.liveResult) : 'Not specified'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Button
                fullWidth
                variant={isButtonDisabled ? 'outlined' : 'contained'}
                color={buttonColor}
                disabled={isButtonDisabled}
                onClick={handleClick}
                startIcon={isButtonDisabled && <IoMdLock />}
                size="medium"
                sx={{
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.9rem'
                }}
              >
                {buttonText}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      );
    })
  ) : (
    <Grid item xs={12}>
      <Box sx={{ 
        textAlign: 'center', 
        p: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" color="text.secondary">
          No live tests available at the moment
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Check back later for upcoming tests
        </Typography>
      </Box>
    </Grid>
  )}
</Grid>

      <Box sx={{ width: '100%', mt: 6 }}>
        <Hometotaltest/>
      </Box>
    </Box>
           {/* Super Pro Section */}
      <section className="py-12 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Exclusive Access for Our Super Pro Users</h2>
            <p className="text-xl mb-8">Missed a Live Test? Don't Worry! Super Pro users get access to all past live tests with unlimited attempts.</p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {[
                "Access to All Past Live Tests",
                "Unlimited Re-attempts",
                "Detailed Solutions and Analysis",
                "Priority Support"
              ].map((benefit, i) => (
                <div key={i} className="bg-green-700 p-4 rounded-lg flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <Link to="/rally-super-pro">
            <button className="bg-white text-green-800 font-bold py-3 px-8 rounded-full hover:bg-green-100 transition duration-300">
              Become a Super Pro Member
            </button>
            </Link>
          </div>
        </div>
      </section>

   {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Why Our Live Tests Are a Game-Changer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real Exam Pressure",
                desc: "Attempting our time-bound live tests helps you get accustomed to the pressure of the actual exam, improving your time management and decision-making skills under stress.",
                icon: "⏱️"
              },
              {
                title: "All-India Rank",
                desc: "Know where you stand in the competition. After each live test, receive a detailed performance analysis and your All-India Rank to gauge your preparation level.",
                icon: "🏆"
              },
              {
                title: "Identify Weak Areas",
                desc: "Our in-depth analysis highlights the topics and sections where you need to focus more, allowing you to create a targeted study plan.",
                icon: "🔍"
              },
              {
                title: "Latest Exam Pattern",
                desc: "We constantly update our test series to reflect any changes in the exam pattern and syllabus, ensuring you are always one step ahead.",
                icon: "🔄"
              },
              {
                title: "Expert-Curated Questions",
                desc: "Our question bank is prepared by experienced faculty and ex-bankers, ensuring the quality and relevance of the questions you practice.",
                icon: "🧠"
              },
              {
                title: "Comprehensive Coverage",
                desc: "Tests for all major bank and insurance exams in one platform.",
                icon: "📚"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   

         <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#131656] mb-4">
          Comprehensive Coverage of All Major Bank & Insurance Exams
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We cater to the preparation needs of every banking and insurance aspirant by providing dedicated live tests for a wide array of examinations.
        </p>
      </header>

      <div className="space-y-12">
        {/* PO Exams Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#131656] mb-6 pb-2 border-b border-[#131656]">
            Probationary Officer (PO) Exams
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ExamCard 
              title="IBPS PO Prelims Live Test" 
              description="Sharpen your skills for the much-awaited IBPS PO exam. Our prelims live tests focus on speed and accuracy in Reasoning, Quantitative Aptitude, and English Language."
            />
            <ExamCard 
              title="SBI PO Prelims Live Test" 
              description="The SBI PO exam demands a high level of preparation. Our live tests for SBI PO Prelims are designed to match the 'surprising' nature of the exam."
            />
            <ExamCard 
              title="RRB PO (Officer Scale I) Live Test" 
              description="Prepare for the unique pattern of the RRB PO exam with our specialized live mock tests."
            />
          </div>
        </section>

        {/* Clerical Cadre Exams Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#131656] mb-6 pb-2 border-b border-[#131656]">
            Clerical Cadre Exams
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ExamCard 
              title="SBI Clerk Live Test" 
              description="With a high number of vacancies, the SBI Clerk exam is a great opportunity. Our live tests will help you master the prelims syllabus."
            />
            <ExamCard 
              title="RRB Clerk (Office Assistant) Live Test" 
              description="Ace the RRB Clerk exam with our live tests that focus on building speed and accuracy in the reasoning and numerical ability sections."
            />
            <ExamCard 
              title="IBPS CSA(Clerk) Live Test" 
              description="Boost your performance in the IBPS CSA (Clerk) exam with our live tests designed to sharpen your speed and accuracy."
            />
          </div>
        </section>

        {/* Insurance Exams Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#131656] mb-6 pb-2 border-b border-[#131656]">
            Insurance Exams
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ExamCard 
              title="LIC AAO (Assistant Administrative Officer) Live Test" 
              description="Our live tests for the LIC AAO exam cover all the sections, including the qualifying English section, as per the latest pattern."
            />
            <ExamCard 
              title="LIC Assistant Live Test" 
              description="Get ready for the LIC Assistant exam with our comprehensive live mock tests that will give you the confidence to excel."
            />
          </div>
        </section>

        {/* Other Banking Exams Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#131656] mb-6 pb-2 border-b border-[#131656]">
            Other Banking Exams
          </h2>
          <div className="grid md:grid-cols-1 gap-6">
            <ExamCard 
              title="LBO (Local/Language Based Officer) Exams" 
              description="We also provide specialized live tests for various LBO exams as and when they are announced."
            />
          </div>
        </section>
      </div>
    </div>

    <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Sectional & Topic-Wise Live Tests
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Sectional Live Tests</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Reasoning Ability", "Quantitative Aptitude", "English Language", "General Awareness", "Computer Knowledge"].map((section, i) => (
                  <div key={i} className="bg-green-50 p-3 rounded flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Topic-Wise Live Tests</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Puzzles", "Seating Arrangement", "Data Interpretation", "Syllogism", "Number Series", "Reading Comprehension"].map((topic, i) => (
                  <div key={i} className="bg-green-50 p-3 rounded flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* FAQ Section */}
 <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-green-200 rounded-lg overflow-hidden transition-all duration-200">
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full flex justify-between items-center p-4 bg-green-50 hover:bg-green-100 transition-colors duration-200 text-left"
              >
                <h3 className="font-medium text-green-800">{faq.question}</h3>
                <span className="text-green-700 ml-4">
                  {expandedId === i ? (
                    <FaChevronUp className="transition-transform duration-200" />
                  ) : (
                    <FaChevronDown className="transition-transform duration-200" />
                  )}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedId === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .transition-all {
          transition-property: all;
        }
        .transition-colors {
          transition-property: background-color, border-color, color, fill, stroke;
        }
        .duration-200 {
          transition-duration: 200ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .ease-in-out {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  
    </>
  );
};
const ExamCard = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#131656] mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
     
      </div>
    </div>
  );
};
export default HomeLivetest;