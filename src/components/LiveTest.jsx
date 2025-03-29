import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../service/Api";
import Banner from "./Banner";
import AOS from "aos";
import "aos/dist/aos.css";

const LiveTest = () => {
  const [alldata, setAlldata] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Color patterns for each topic
  const topicColors = {
    "Topic Test": ["bg-yellow-100", "bg-blue-100", "bg-purple-100", "bg-green-100", "bg-red-100"],
    "Special Mock Test": ["bg-orange-100", "bg-teal-100", "bg-pink-100", "bg-indigo-100", "bg-yellow-100"],
    "Others": ["bg-green-100", "bg-purple-100", "bg-red-100", "bg-blue-100", "bg-orange-100"],
    // Add more topics and their color patterns as needed
  };
 
  useEffect(() => {
    async function run() {
      try {
        const response = await Api.get(`topic-test/livetest/getall`);
        console.log("livetest", response.data);
        setAlldata(response.data);
        // Filter data based on subscriptionType
        setTopics([...new Set(response.data.map((item) => item.testTypes))]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetching (success or error)
      }
    }

    run();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 2000});
    AOS.refresh();
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-full">
          <Banner />
        </div>
        {loading ? (
          // Loading placeholders
          topics.map((title, titleIndex) => (
            <div className="bg-white p-4 rounded-2xl shadow-lg" key={title}>
              <h3 className="font-bold text-lg mb-3">
                <p className="placeholder-glow">
                  <span className="placeholder col-6 mx-auto bg-gray-200 rounded-md"></span>
                </p>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 items-center">
                {[1, 2, 3].map((index) => (
                  <div
                    key={`${titleIndex}-${index}`}
                    className="min-h-32 p-3 gap-2 flex flex-col justify-center items-center rounded-2xl text-center"
                  >
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 square-full rounded-md w-20 h-20 mb-2"></span>
                      <span className="placeholder col-8 bg-gray-200 rounded-md"></span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Actual data
          topics.map((title) => {
            const colors = topicColors[title] || ["bg-gray-100"]; // Fallback to gray if no specific colors are defined

            return (
              <div className="bg-white p-4 rounded-2xl shadow-lg" data-aos="fade-right" key={title}>
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
          })
        )}
      </div>
    </>
  );
};

export default LiveTest;