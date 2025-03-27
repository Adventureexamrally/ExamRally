import { useState } from 'react';

// Helper function to get the weeks of a month
const getWeeksOfMonth = (year, month) => {
  const weeks = [];
  let startDate = new Date(year, month, 1);
  let endDate = new Date(year, month + 1, 0);

  // Adjust start date to the start of the week (Sunday)
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let currentWeekStart = new Date(startDate);
  let currentWeekEnd = new Date(startDate);

  // Generate weeks
  while (currentWeekEnd <= endDate) {
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    // Limit end date to the end of the month
    if (currentWeekEnd > endDate) {
      currentWeekEnd = endDate;
    }

    weeks.push({
      start: currentWeekStart.toDateString(),
      end: currentWeekEnd.toDateString(),
    });

    // Move to the next week
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);
  }

  return weeks;
};

// Month-wise questions mapping
const monthWiseQuestions = {
  1: [ // February
    { id: 1, text: "What is the simplified value of 15 + 30?" },
    { id: 2, text: "Simplify the expression: 5 * 6 - 10" },
  ],
  2: [ // January
    { id: 3, text: "What is the capital of France?" },
    { id: 4, text: "Who is the president of the United States?" },
  ],
  // Add more months here as needed (2 for March, 3 for April, etc.)
};
const weeks = [
  {
    start: "2025-01-01",
    end: "2025-01-07",
    questions: [
      "1. How can you tell if a cake is fully baked without cutting into it?",
      "2. What does it mean to fold ingredients, and why is this technique important in certain recipes?"
    ]
  },
  {
    start: "2025-01-08",
    end: "2025-01-14",
    questions: [
      "3. What's the difference between baking and roasting?",
      "4. How does the type of pan affect baking?"
    ]
  },
  // More weeks...
];

const CurrentAffairs = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeWeek, setActiveWeek] = useState(0); // Set the default active week to 0 (first week)
  const weeks = getWeeksOfMonth(year, month);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const toggleWeek = (index) => {
    if (activeWeek === index) {
      setActiveWeek(null); // Close the active week
    } else {
      setActiveWeek(index); // Open the selected week
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="row">
        <div className="col-md-9 staticheader h6 leading-10">
          <div>
            <h1 className="h2 font text-green-500">Current Affairs</h1>
            <br />
            <h1 className="leading-8">
              Stay updated with all the important events and news with our Current Affairs Free Test, designed specifically for banking exams like <span className="text-green-500 font-bold">IBPS PO, IBPS Clerk, RRB PO, SBI PO, and more.</span> This package covers key topics like Banking And Economy News, Government Schemes, National, International, Appointments, Awards, Sports, Defence, Science &amp; Technology, and more. With regular updates, exam-focused quizzes, and easy-to-understand explanations, you can strengthen your General Awareness and boost your exam score. Stay informed and stay ahead in your preparation!
            </h1>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner hoverstyle"
            style={{
              backgroundImage: `radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
                                radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                                radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                                radial-gradient(at 0% 64%, rgb(11, 153, 41) 0px, transparent 85%),
                                radial-gradient(at 41% 94%, rgb(34, 214, 109) 0px, transparent 85%),
                                radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)`
            }}
          >
            <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
            <div className="text-white flex justify-between">
              <span className="text-xl font-semibold mb-3 font">Features</span>
            </div>
            <hr className="border-t border-gray-600" />
            <ul className="space-y-2">
              {[
                "Covers All Topics",
                "Detailed Explanations",
                "Exam-Level Questions Based on the Latest Pattern",
                "Previous Year Questions",
                "Unlimited Reattempts",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 font">
                  <span className="flex justify-center items-center w-4 h-4 bg-green-500 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3 h-3 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-white text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-center mt-2">
              <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                Free
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="my-4">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="p-2 border rounded w-full shadow-lg"
        >
          {monthNames.map((monthName, index) => (
            <option key={index} value={index}>
              {monthName}
            </option>
          ))}
        </select>
      </div>

      {/* Accordion for Weeks */}
      <div className="row">
        <div className="col-md-6">
          {weeks.map((week, index) => (
            <div key={index} className="mb-2 border-b">
              <button
                onClick={() => toggleWeek(index)}
                className="w-full px-4 py-2 text-left bg-gray-200 font-semibold rounded-md flex justify-between items-center"
              >
                <span>
                  Week {index + 1}: {week.start} - {week.end}
                </span>
                <span className="text-xl">
                  {activeWeek === index ? (
                    <i className="bi bi-dash-circle"></i> // Minus icon (collapse)
                  ) : (
                    <i className="bi bi-plus-circle"></i> // Plus icon (expand)
                  )}
                </span>
              </button>

              {activeWeek === index && (
                <div className="px-4 py-2 border-t bg-gray-100">
                  <p>1. How can you tell if a cake is fully baked without cutting into it?</p>
                  <p>2. What does it mean to fold ingredients, and why is this technique important in certain recipes?</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Card Design for Questions */}
        <div className="col-md-6">
          <h1>Questions for {monthNames[month]}</h1>
          {monthWiseQuestions[month]?.map((question) => (
            <div key={question.id} className="card mb-3">
              <div className="card-body">
                <p className="card-text">{question.text}</p>
                <button className='bg-green-500 text-white hover:bg-green-400 px-3'>Take Test</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairs;
