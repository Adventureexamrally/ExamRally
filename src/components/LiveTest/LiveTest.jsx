import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../service/Api";
import Banner from "../Banner";
import PdfCourseAd from "../PdfCourseAd";



const LiveTest = () => {
  const [alldata, setAlldata] = useState([]);
  const [topics, setTopics] = useState([]);

  // Color patterns for each topic
  const topicColors = {
    "Topic Test": [
      "bg-yellow-100 text-yellow-800",
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-red-100 text-red-800",
      "bg-pink-100 text-pink-800",
      "bg-lime-100 text-lime-800",
      "bg-cyan-100 text-cyan-800",
      "bg-fuchsia-100 text-fuchsia-800",
      "bg-rose-100 text-rose-800",
      "bg-orange-200 text-orange-900",
      "bg-teal-200 text-teal-900",
      "bg-indigo-200 text-indigo-900",
      "bg-yellow-200 text-yellow-900",
      "bg-violet-200 text-violet-900",
      "bg-sky-200 text-sky-900",
      "bg-amber-200 text-amber-900",
      "bg-emerald-200 text-emerald-900",
      "bg-slate-200 text-slate-800",
      "bg-gray-200 text-gray-800",
    ],
    "Special Mock Test": [
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-yellow-100 text-yellow-800",
      "bg-violet-100 text-violet-800",
      "bg-sky-100 text-sky-800",
      "bg-amber-100 text-amber-800",
      "bg-emerald-100 text-emerald-800",
      "bg-slate-100 text-slate-800",
      "bg-red-200 text-red-900",
      "bg-blue-200 text-blue-900",
      "bg-green-200 text-green-900",
      "bg-purple-200 text-purple-900",
      "bg-lime-200 text-lime-900",
      "bg-cyan-200 text-cyan-900",
      "bg-fuchsia-200 text-fuchsia-900",
      "bg-rose-200 text-rose-900",
      "bg-stone-200 text-stone-800",
      "bg-zinc-200 text-zinc-800",
    ],
    "Others": [
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-orange-100 text-orange-800",
      "bg-lime-100 text-lime-800",
      "bg-cyan-100 text-cyan-800",
      "bg-fuchsia-100 text-fuchsia-800",
      "bg-rose-100 text-rose-800",
      "bg-teal-100 text-teal-800",
      "bg-yellow-300 text-yellow-900",
      "bg-indigo-300 text-indigo-900",
      "bg-pink-300 text-pink-900",
      "bg-violet-300 text-violet-900",
      "bg-sky-300 text-sky-900",
      "bg-amber-300 text-amber-900",
      "bg-emerald-300 text-emerald-900",
      "bg-slate-300 text-slate-900",
      "bg-gray-300 text-gray-900",
      "bg-stone-300 text-stone-900",
    ],
    
  };

  useEffect(() => {
    run();
  }, []);

  async function run() {
    try {
      const response = await Api.get(`topic-test/livetest/getall/active`);
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
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-full">
          <Banner />
          <PdfCourseAd />
        </div>
        {/* <PdfCourseAd /> */}
        {/* Topic Test */}
        {topics.map((title) => {
          const colors = topicColors[title] || ["bg-gray-100"]; // Fallback to gray if no specific colors are defined

          return (
            <div className="bg-white p-4 rounded-2xl shadow-lg" key={title} id="live-tests">
              <h3 className="font-bold text-lg mb-3">{title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 items-center">
                {alldata
                  .filter((cat) => cat.testTypes === title) // Only show categories for the current topic
                  .map((cat, index) => (
                    <Link to={`/livetest/${cat.link_name}`} key={cat.link_name}>
                      <div
                        className={`${
                          colors[index % colors.length]
                        } min-h-28 p-1  flex flex-col justify-center items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap`}
                      >
                        <img
                          src={cat.photo}
                          alt="not found"
                          className="w-8 h-8"
                        />
                        <h1 className="text-sm font-medium text-gray-700">
                          {" "}
                          {cat.categorys}
                        </h1>
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
