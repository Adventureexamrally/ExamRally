import React, { useState, useEffect } from "react";
import Api from "../service/Api";
import { useNavigate } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
const CAmonth = () => {
  const [CA, setCA] = useState([]);
  const navigate = useNavigate();
  const [expandedWeeks, setExpandedWeeks] = useState({}); // Track expanded weeks

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("topic-test/getAffairs/all");
        setCA(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleWeek = (weekTitle) => {
    setExpandedWeeks((prevExpanded) => ({
      ...prevExpanded,
      [weekTitle]: !prevExpanded[weekTitle],
    }));
  };

  console.log(CA);
  

  return (
    <div className="mt-5 p-4">
      {CA.map((ca) => (
        <div
          key={ca.currentAffair.month}
          className="mb-4 p-3 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">
            Month: {ca.currentAffair.month}
          </h2>
          {ca.currentAffair.week.map((week) => (
            <div key={week.title} className="mb-2 border rounded-md">
              <div
                className="p-3 cursor-pointer flex justify-between items-center"
                onClick={() => toggleWeek(week.title)}
              >
                <span className="font-medium text-gray-800">{week.title}</span>
                <span>
                  {expandedWeeks[week.title] ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>
              {expandedWeeks[week.title] && (
                <div className="p-3 bg-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {week.model.map((model) => (
                      <div
                        key={model.show_name}
                        className="p-3 rounded-md shadow-md hover:shadow-lg bg-white border-1"
                      >
                        <h3 className="font-semibold mb-2 text-center py-3">
                          {model.show_name}
                        </h3>
                        <div className="flex flex-row gap-4">
                          {model.pdfLink || model.pdf ? (
                            model.uploadType === "link" ? (
                              <a
                                href={model.pdfLink}
                                target="blank"
                                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 px-4 rounded-lg text-sm text-center font-semibold transition-colors duration-300"
                              >
                                Download PDF
                              </a>
                            ) : (
                              <a
                                href={model.pdfLink}
                                target="blank"
                                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 px-4  rounded-lg text-xs text-center font-semibold transition-colors duration-300"
                              >
                                Download PDF
                              </a>
                            )
                          ) : (
                            <button
                              disabled
                              className="bg-gray-200 text-gray-500 py-2 px-4  rounded-lg text-sm text-center font-semibold cursor-not-allowed"
                            >
                              Download PDF
                            </button>
                          )}
                          <button
                            onClick={() =>
                              navigate(`/instruction/${model.exams[0]}`)
                            }
                            className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-300"
                          >
                            Take Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CAmonth;
