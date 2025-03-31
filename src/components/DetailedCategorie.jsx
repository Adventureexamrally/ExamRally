import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../service/Api';

const DetailedCategorie = () => {
  const [data, setData] = useState({});
  const { id } = useParams();            

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(null);
  const [catDetail, setCatDetails] = useState(null);
  const [subMenuData, setSubMenuData] = useState(["prelims", "mains", "pyq"]);
  const { link } = useParams();
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState('');

  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
  const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
  const [timer, setTimer] = useState(600); // Timer (10 min)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
  const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
  const [showDifficulty, setShowDifficulty] = useState({});

  const handleTopicSelect = (section, testType) => {
    setSelectedTopic(section.name);
    setModalType(testType);
    setModalQuestions(section.questions); // Set questions for the selected section
    setIsTimerRunning(true);
    setTimer(600); // Reset Timer on topic change
  };

  useEffect(() => {
    async function run() {
      try {
        const response = await Api.get(`topic-test/test/${link}`);
        console.log('livetest', response.data);
        setSub(response.data.categorys);
        setCatDetails(response.data.test_content);
        setData(response.data);
        setLoading(false);
        getSubMenus(sub);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    run();
  }, [link, sub]);

  const getSubMenus = async (subLink) => {
    setActiveSection(subLink);
    setLoading(true);
    if (sub !== '') {
      try {
        const response = await Api.get(`topic-test/test-sub/${sub}`);
        console.log('subMenu data', response.data);
        setSubMenuData(response.data[0].submenus);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sub-menu data:', error);
        setLoading(false);
        setSubMenuData([]);
      }
    }
  };

  useEffect(() => {
    if (!isTimerRunning || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0)); // Prevent negative timer
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  console.log(data);
  // Show difficulty level for the specific test
  const handleShowLevelClick = (testId) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [testId]: true, // Mark the test's difficulty as shown
    }));
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <>
      {loading ? (
        <div className="container">
          <div className="row mt-3">
            <div className="col-md-9">
              <p className="placeholder-glow">
                <span className="placeholder col-12 mb-2 p-5 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
              </p>
            </div>
            <div className="col-md-3">
              <div className="relative flex flex-col p-4 w-full bg-gray-200 rounded-xl">
                <p className="placeholder-glow">
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-6 mx-auto rounded-md"></span>
                </p>
              </div>
            </div>
          </div>
          <div className="row p-3 bg-gray-100 rounded-lg mt-2">
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row mt-3">
            <div className="col-md-9">
              <div className="staticheader">
                <p className="font mt-2 h5 leading-8">
                  <h1
                    className="text-green-500 font font-bold "
                    dangerouslySetInnerHTML={{ __html: catDetail?.title }}
                  ></h1>
                  <br />
                  <p dangerouslySetInnerHTML={{ __html: catDetail?.description }}></p>
                </p>
              </div>
              {catDetail?.sub_titles?.length > 0 &&
                catDetail?.sub_titles?.map((sub) => (
                  <div key={sub._id} className="staticheader">
                    <p className="font mt-2 h5 leading-8">
                      <h1
                        className="text-green-500 font font-bold "
                        dangerouslySetInnerHTML={{ __html: sub.title }}
                      ></h1>
                      <br />
                      <p dangerouslySetInnerHTML={{ __html: sub.description }}></p>
                    </p>
                  </div>
                ))}
            </div>

            <div className="col-md-3">
              <div
                className="relative flex flex-col p-4 w-full bg-cover rounded-xl "
                style={{
                  backgroundImage: `
                    radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
                    radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                    radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                    radial-gradient(at 0% 64%, rgb(11, 153, 41) 0px, transparent 85%),
                    radial-gradient(at 41% 94%, rgb(34, 214, 109) 0px, transparent 85%),
                    radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)
                  `,
                }}
              >
                <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
                <div className="text-white flex justify-between">
                  <span className="text-xl font-semibold font mb-3">Features</span>
                </div>
                <hr className="border-t border-gray-600" />
                <ul className="space-y-2">
                  {[
                    'Exact Exam Level Questions',
                    'New Pattern Questions',
                    'Detailed Solution',
                    'Covered All Models',
                    'Clerk to RBI Grade B level Questions',
                    'Real Exam Interface',
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

                <div className="text-center">
                  <p>
                    <del className="text-red-400 font">Original Price:</del>
                  </p>
                  <del className="bg-red-500 text-white rounded p-1 mb-2">Rs.299</del>
                  <p className="text-white font h5">Discounted Price:</p>
                  <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                    Rs.89
                  </button>
                  <p className="text-white font-bold">You Save Money: 210</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`grid gap-1 p-3 bg-gray-100 rounded-lg mt-2 ${
              subMenuData.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-4"
            }`}
          >
            {subMenuData.map((submenu, index) => (
              <div key={index} className="w-full">
                <button
                  className={`btn w-full mb-2 text-white ${
                    activeSection === submenu ? "bg-[#131656] hover:bg-[#131656]" : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={() => setActiveSection(submenu)}
                >
                  {submenu}
                </button>
              </div>
            ))}
          </div>
          {activeSection === "prelims" && (
            <div className="mt-3">
              <div className="row">
                {data?.exams?.filter(test => test.topic_test?.sub_menu === "Prelims").map(
                  (test, idx) => (
                    <div key={idx} className="col-md-3 mb-3">
                      <div
                        className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1 flex flex-col justify-between h-full min-h-[320px]"
                      >
                        <div className="card-body text-center flex flex-col justify-between h-full">
                          <h5 className="card-title font-bold text-lg">
                            {test.exam_name}

                          </h5>

                          {!showDifficulty[test._id] ? (
                            <button
                              onClick={() => handleShowLevelClick(test._id)}
                              className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                            >
                              Show Level
                            </button>
                          ) : (
                            <div className="mt-4 text-sm px-2 py-2 text-center text-white bg-[#131656]">
                              <p>
                                <strong>{test.q_level}</strong>
                              </p>
                            </div>
                          )}

                          <div className="flex justify-center items-center gap-4 mt-2">
                            <div className="flex flex-col items-center">
                              <p className="font-medium">Questions</p>
                              <p>{test.section?.[0]?.t_question}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="font-medium">Cut off</p>
                              <p>{test.section?.[0]?.t_cutoff}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="font-medium">Duration</p>
                              <p>{test.section?.[0]?.duration}</p>
                            </div>
                          </div>

                          <button
                            className={`mt-3 py-2 px-4 rounded w-full transition ${
                              test.status === "true"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() => {
                              if (test.status === "true") {
                                navigate(`/instruction/${test._id}`);
                              } else {
                                handleTopicSelect(test.section?.[0], "prelims");
                              }
                            }}
                          >
                            {test.status === "true" ? "Take Test" : "Lock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {activeSection === "mains" && (
            <div className="mt-3">
              <div className="row">
                {data?.exams?.filter(test => test.topic_test?.sub_menu === "Mains").map(
                  (test, idx) => (
                    <div key={idx} className="col-md-3 mb-3">
                      <div
                        className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1 flex flex-col justify-between h-full min-h-[320px]"
                      >
                        <div className="card-body text-center">
                          <h5
                            className="card-title 	fw-bold"
                            style={{
                              fontFamily: "helvetica, Arial, sans-serif",
                            }}
                          >
                            {test.exam_name}
                          </h5>
                          <div className="text-center">
                            {!showDifficulty[test._id] && (
                              <button
                                onClick={() => handleShowLevelClick(test._id)}
                                className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
                                style={{ backgroundColor: "#131656" }}
                              >
                                Show Level
                              </button>
                            )}

                            {showDifficulty[test._id] && (
                              <div
                                className="mt-4 text-sm px-2 py-2 text-center text-white"
                                style={{ backgroundColor: "#131656" }}
                              >
                                <p>
                                  <strong>{test.q_level}</strong>
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-center items-center gap-4">
                            <div className="flex flex-col items-center">
                              <p>Ques</p>
                              <p>{test.section?.[0]?.t_question}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p>CutOff</p>
                              <p>{test.section?.[0]?.t_cutoff}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p>Duration</p>
                              <p>{test.section?.[0]?.duration}</p>
                            </div>
                          </div>

                          <button
                            className={`mt-2 py-2 px-4 rounded ${
                              test.status === "true"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() =>
                              handleTopicSelect(test.section?.[0], "mains")
                            }
                          >
                            {test.status === "true" ? "Take Test" : "Lock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {activeSection === "pyq" && (
            <div className="mt-3">
              <div className="row">
                {data?.exams?.filter(test => test.topic_test?.sub_menu === "PYQ").map(
                  (test, idx) => (
                    <div key={idx} className="col-md-3 mb-3">
                      <div
                        className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1 flex flex-col justify-between h-full min-h-[320px]"
                      >
                        <div className="card-body text-center">
                          <h5 className="card-title font fw-bold">
                            {test.exam_name}
                          </h5>
                          <div className="text-center">
                            {!showDifficulty[test.id] && (
                              <button
                                onClick={() => handleShowLevelClick(test.id)}
                                className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
                                style={{ backgroundColor: "#131656" }}
                              >
                                Show Level
                              </button>
                            )}

                            {showDifficulty[test.id] && (
                              <div
                                className="mt-4 text-sm px-2 py-2 text-center text-white"
                                style={{ backgroundColor: "#131656" }}
                              >
                                <p>
                                  <strong>{test.q_level}</strong>
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-center items-center gap-4">
                            <div className="flex flex-col items-center">
                              <p>Ques</p>
                              <p>{test.section?.[0]?.t_question}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p>Cutoff</p>
                              <p>{test.section?.[0]?.t_cutoff}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p>Duration</p>
                              <p>{test.section?.[0]?.duration}</p>
                            </div>
                          </div>

                          <button
                            className={`mt-2 py-2 px-4 rounded ${
                              test.status === "true"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() =>
                              handleTopicSelect(test.section?.[0], "mains")
                            }
                          >
                            {test.result_type === " " ? "Take Test" : "Lock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DetailedCategorie;