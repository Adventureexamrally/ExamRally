import React, { useState, useEffect } from "react";

const Hinduedu = () => {
  const [activeSection, setActiveSection] = useState(""); // Active section state
  const [selectedTopic, setSelectedTopic] = useState(""); // Selected topic state
  const [timer, setTimer] = useState(600); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer running state
  const [month, setMonth] = useState(new Date().getMonth()); // State for selected month

  // List of months
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Topics list
  const topics = [
    "Reading Comprehension Test 1",
    "Close Test 1",
    "Error Spotting Test 1",
    "Single/Double Filler Test 1",
    "Parajumble Test 1",
    "Reading Comprehension Test 2",
    "Close Test 2",
    "Error Spotting Test 2",
    "Single/Double Filler Test 2",
    "Parajumble Test 2",
    "Reading Comprehension Test 3",
    "Close Test 3",
    "Error Spotting Test 3",
    "Single/Double Filler Test 3",
    "Parajumble Test 3",
    "Reading Comprehension Test 4",
    "Close Test 4",
    "Error Spotting Test 4",
    "Single/Double Filler Test 4",
    "Parajumble Test 4",
    "Reading Comprehension Test 5",
    "Close Test 5",
    "Error Spotting Test 5",
    "Single/Double Filler Test 5",
    "Parajumble Test 5",
  ];

  // Countdown Timer Effect
  useEffect(() => {
    if (timer === 0 || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  // Format timer (MM:SS)
  const formatTimer = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle month change
  useEffect(() => {
    if (month === 1) {
      setActiveSection("topics"); // February → Show Topics
    } else {
      setActiveSection(""); // Reset for other months
    }
  }, [month]);

  return (
    <div className="container">
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

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 bg-light p-3">
            <h5 className="text-center mb-2">{monthNames[month]}</h5>
          </div>

          {/* Main Content Area */}
          <div className="col-md-6 p-3">
            {/* Display Topics when February is selected */}
            {activeSection === "topics" && (
              <div>
              <h3>Topics:</h3>
              <ul className="flex flex-wrap gap-2">
                {topics.length > 0 ? (
                  topics.map((topic, index) => (
                    <li key={index}>
                      <button
                        className="px-4 py-2 bg-green-300 rounded mb-2 hover:bg-green-400 hover:text-white transition"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="nodata">No topics available</li>
                )}
              </ul>
            </div>
            
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hinduedu;
