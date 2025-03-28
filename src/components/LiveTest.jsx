import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../service/Api";
import Banner from "./Banner";

const LiveTest = () => {
  const [alldata, setAlldata] = useState([]);
  const [topics, setTopics] = useState([]);

  // Color patterns for each topic
  const topicColors = {
    "Topic Test": ["bg-yellow-100", "bg-blue-100", "bg-purple-100", "bg-green-100", "bg-red-100"],
    "Special Mock Test": ["bg-orange-100", "bg-teal-100", "bg-pink-100", "bg-indigo-100", "bg-yellow-100"],
    "Others": ["bg-green-100", "bg-purple-100", "bg-red-100", "bg-blue-100", "bg-orange-100"],
    // Add more topics and their color patterns as needed
  };

  useEffect(() => {
    run();
  }, []);

  async function run() {
    try {
      const response = await Api.get(`topic-test/livetest/getall`);
      console.log("livetest", response.data);
      setAlldata(response.data);
      // Filter data based on subscriptionType
      setTopics([...new Set(response.data.map((item) => item.testTypes))]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-full">
          <Banner />
        </div>
        {/* Topic Test */}
        {topics.map((title) => {
          const colors = topicColors[title] || ["bg-gray-100"]; // Fallback to gray if no specific colors are defined

          return (
            <div className="bg-white p-4 rounded-2xl shadow-lg" key={title}>
              <h3 className="font-bold text-lg mb-3">{title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 items-center">
                {alldata
                  .filter((cat) => cat.testTypes === title) // Only show categories for the current topic
                  .map((cat, index) => (
                    <Link to={`/livetest/${cat.link_name}`} key={cat.link_name}>
                      <div
                        className={`${
                          colors[index % colors.length]
                        } min-h-32 p-3 gap-2 flex flex-col justify-center items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap`}
                      >
                        <img src={cat.photo} alt="not found" className="w-12 h-12" />
                        <h1 className="text-sm font-medium text-gray-700"> {cat.categorys}</h1>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LiveTest;
