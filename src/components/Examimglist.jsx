import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../service/Api";

const Examimglist = () => {



  const [LiveTest,setLiveTest]=useState([]);
  const [Data,setData]=useState([])

    useEffect(() => {
      run();
    }, []);
  
    async function run() {
      try {
        const response = await Api.get(`topic-test/livetest/getall`);
        console.log("livetest", response.data);
        setLiveTest(response.data);

        const response2 = await Api.get("/packages/get/active");
        console.log("ji", response2.data)
        setData(response2.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  return (
    <div className="container mt-4">
      <div className="row">
        {LiveTest.map((item, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 shadow-lg">
            <Link
              to={`/livetest/${item.link_name}`}
              className="d-flex flex-column align-items-center text-green-500 justify-content-center p-3 rounded text-decoration-none"
              style={{
                height: "120px",
                transition: "0.3s",
                textAlign: "center",
              }}
            >  
            <img
            src={item.photo}
            alt="not found"
            className="w-8 h-8"
          />
              <span className="text-sm font-weight-bold mt-2 text-gray-800">{item.categorys}</span>
            </Link>
          </div>
        ))}

        {Data.map((exam, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 shadow-lg text-center">
            <Link
              to={`/top-trending-exams/${exam.link_name}`}
              className="d-flex flex-column align-items-center justify-content-center  p-3 rounded text-decoration-none"
              style={{
                height: "120px",
                transition: "0.3s",
                textAlign: "center",
              }}
            >
              <img
                src={exam.photo}
                alt={exam.name}
                className="img-fluid"
                style={{ width: "80px", height: "80px" }}
              />
              <span className="d-block mt-2 font-weight-bold text-gray-800">{exam.name}</span>
            </Link>
          </div>
        ))}
      </div>

   


<section className="max-w-6xl mx-auto px-4 py-12">
  {/* Hero Section */}
  <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-8 mb-12 text-black shadow-xl">
  If you are preparing for <span className="text-green-600 font-semibold">IBPS PO</span>, <span className="text-green-600 font-semibold">IBPS Clerk</span>, <span className="text-green-600 font-semibold">RRB PO</span>, <span className="text-green-600 font-semibold">RRB Clerk</span>, <span className="text-green-600 font-semibold">SBI PO</span>, <span className="text-green-600 font-semibold">SBI Clerk</span>, and other <span className="text-green-600 font-semibold">bank</span> and <span className="text-green-600 font-semibold">insurance exams</span>, practicing with high-quality mock tests is essential to improve your speed, accuracy, and exam strategy. Our <span className="text-green-600 font-semibold">Bank Exam Online Test Series</span> is designed as per the latest exam pattern and evolving difficulty levels, ensuring that you get the most realistic and exam-oriented practice experience.
<br />
<p>We provide <span className="text-green-600 font-semibold">full-length Prelims and Mains mock tests </span>for all major IBPS, SBI, and RRB bank exams, allowing candidates to simulate real exam conditions. These tests include:</p>
  </div>

  {/* Exam Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {['IBPS PO', 'IBPS Clerk', 'RRB PO', 'RRB Clerk', 'SBI PO', 'SBI Clerk', 'Insurance', 'Other Banks'].map((exam) => (
      <div key={exam} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{exam}</h3>
        <p className="text-gray-600">Prelims & Mains Mock Tests</p>
      </div>
    ))}
  </div>

  {/* Features Section */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
    <div className="bg-green-700 text-white px-8 py-4">
      <h2 className="text-2xl font-bold">Why Our Test Series Stands Out</h2>
    </div>
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Comprehensive Coverage</h3>
          <ul className="space-y-3">
            {[
              "Latest exam pattern & difficulty levels",
              "Full-length Prelims & Mains tests",
              "Topic-wise sectional tests",
              "Previous year question papers",
              "Current Affairs & Banking Awareness"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Advanced Features</h3>
          <ul className="space-y-3">
            {[
              "Real exam-like interface",
              "Detailed solutions & explanations",
              "All India ranking system",
              "Performance analytics dashboard",
              "Mobile-friendly platform"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>

  {/* Subject Cards */}
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Topic-Wise & Sectional Tests for Targeted Practice</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: "Quantitative Aptitude", topics: "(All topics: Arithmetic, DI, Number Series, etc" },
        { title: "Reasoning Ability", topics: "Puzzles, Seating Arrangement, Syllogism, etc." },
        { title: "English Language", topics: "Reading Comprehension, Grammar, Vocabulary, etc." },
        { title: "Current Affairs", topics: "Daily & Monthly CA for Bank Exams" },
        { title: "Banking Awareness", topics: "Latest Banking & Financial News" },
        { title: "Computer Awareness", topics: "Fundamentals, MS Office, Networking, etc." },
        { title: "Static GK", topics: "Important Facts, Capitals, National Parks, etc." },
        { title: "Hard-Level Quants, Reasoning & English for High-Scorers", topics: "" },

      ].map((subject, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:transform hover:-translate-y-2 transition-transform">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <span className="font-bold text-xl">{index + 1}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">{subject.title}</h3>
          <p className="text-gray-600">{subject.topics}</p>
        </div>
      ))}
    </div>
  </div>
    {/* Strengthen Weak Areas Section */}
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border">
      <p className="text-gray-700 mb-6">
        These tests are structured to strengthen weak areas, improve time management, and enhance overall performance in the actual exam.
      </p>
      
      <h2 className="text-xl font-bold text-blue-800 mb-4">Previous Year Papers & Exam-Pattern Based Questions</h2>
      <ul className="space-y-3">
        <li className="flex items-start">
          <span className="bg-green-500 text-white rounded-full p-1 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-gray-700">Familiarize you with the types of questions asked in past exams</span>
        </li>
        <li className="flex items-start">
          <span className="bg-green-500 text-white rounded-full p-1 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-gray-700">Help you analyze difficulty levels</span>
        </li>
        <li className="flex items-start">
          <span className="bg-green-500 text-white rounded-full p-1 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-gray-700">Improve your problem-solving skills by revising real exam questions</span>
        </li>
      </ul>
    </div>

    {/* Interview Preparation Section */}
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-t-4">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Interview, Group Discussion & Critical Reasoning Preparation</h2>
      <p className="text-gray-700">
        Cracking the written exam is just the first step; our Bank Exam Test Series also provides exclusive study materials for <span className="text-green-600 font-semibold">interviews</span>, <span className="text-green-600 font-semibold">group discussions (GD)</span>, and <span className="text-green-600 font-semibold">critical reasoning</span> to help you clear the final selection process with confidence.
      </p>
    </div>
  {/* Interview Prep */}
  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Free Mock Interview Program</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-start mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Real Interview Experience</h3>
            <p className="text-gray-600">Simulates actual bank interview scenarios</p>
          </div>
        </div>
        <div className="flex items-start mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Expert Evaluation</h3>
            <p className="text-gray-600">Conducted by banking professionals</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-start mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Detailed Feedback</h3>
            <p className="text-gray-600">Personalized improvement suggestions</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Free for Subscribers</h3>
            <p className="text-gray-600">Included with test series purchase</p>
          </div>
        </div>
      </div>
    </div>
  </div>

    {/* Competitive Edge Section */}
    <div className="bg-green-50  border-l-4 border-green-500 p-6 rounded-xl shadow-md mb-8">
      <p className="text-gray-700 font-medium">
        This mock interview program ensures that students who clear Mains have a competitive edge in the final selection process, helping them crack the real bank interview with confidence.
      </p>
    </div>

   {/* Features Section */}
   <div className=" p-8 rounded-xl mb-8">
      <h2 className="text-2xl font-bold mb-6">Key Features of Our Bank Exam Test Series</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <div className="bg-green-500 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Real Exam Interface</h3>
            <p className="text-blue-500">Our tests provide an interface similar to the actual IBPS, SBI & RRB exams for a hassle-free experience.</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-green-500 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Detailed Explanations</h3>
            <p className="text-blue-500">Every question comes with a step-by-step solution to help you understand concepts better.</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-green-500 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Performance Analysis</h3>
            <p className="text-blue-500">Get detailed reports on accuracy, speed, and time management to track your progress.</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-green-500 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">All India Ranking</h3>
            <p className="text-blue-500">Compare your performance with thousands of aspirants across India.</p>
          </div>

        </div>
        <div className="flex items-start">
          <div className="bg-green-500 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Accessible Anytime, Anywhere</h3>
            <p className="text-blue-500">Practice online at your convenience.</p>
          </div>
        </div>
      </div>
    </div>
    {/* Why Choose Us Section */}
    <div className="bg-white p-8 rounded-xl shadow-md border-t-4  mb-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Why Choose Examrally Bank Exam Test Series?</h2>
      <ul className="grid md:grid-cols-2 gap-4">
        <li className="flex items-start">
          <span className="text-green-500 mr-2">•</span>
          <span className="text-gray-700">Designed by experts based on the latest exam trends</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">•</span>
          <span className="text-gray-700">Covers all question types and difficulty levels</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">•</span>
          <span className="text-gray-700">Helps develop the right exam strategy</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">•</span>
          <span className="text-gray-700">Boosts confidence through real exam-like practice</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">•</span>
          <span className="text-gray-700">Ensures comprehensive coverage of all subjects</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">•</span>
          <span className="text-gray-700"><span className="text-green-600 font-semibold">Free Online Mock Interview</span></span>
        </li>
      </ul>
    </div>
    {/* CTA Section */}
    <div className="text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Start Practicing Today!</h2>
      <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
        With structured mock tests, topic-wise quizzes, and expert-designed study materials, our <span className="text-green-600 font-semibold">Bank Exam Online Test Series</span> will help you maximize your score and crack the exam on your first attempt. Take the next step in your preparation and start practicing today!
      </p>

    </div>
</section>

    </div>
  );
};

export default Examimglist;
