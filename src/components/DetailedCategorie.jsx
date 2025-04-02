import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../service/Api";
import CAmonth from "./CAmonth";
import { ImCheckmark2 } from "react-icons/im";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsQuestionSquare } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const DetailedCategorie = () => {
  const [catDetail, setCatDetails] = useState([]);
  const { link } = useParams();
  const [amount, setAmount] = useState("");
  const [discountedAmount, setdiscountedAmount] = useState("");
  const [subMenuData, setSubMenuData] = useState([""]);
  const [sub, setSub] = useState("");
  const [data, setData] = useState({});
  const [showDifficulty, setShowDifficulty] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  console.log(link);

  useEffect(() => {
    run();
  }, [link, sub]);
// console.log(subMenuData);
useEffect(() => {
  if (subMenuData.length > 0 && activeSection === "") {
    setActiveSection(subMenuData[0]);
  }
})
const handleShowLevelClick = (testId) => {
  setShowDifficulty((prevState) => ({
    ...prevState,
    [testId]: true, // Mark the test's difficulty as shown
  }));
};


  async function run() {
    try {
      const response = await Api.get(`topic-test/test/${link}`);
      console.log("livetest", response.data);
      setData(response.data);
      setCatDetails(response.data.test_content);
      setSub(response.data.categorys);
      setAmount(response.data.amount);
      fetchSubMenus(response.data.categorys);
      setdiscountedAmount(response.data.discountedAmount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  console.log(activeSection);

  const fetchSubMenus = async (subLink) => {
    // setActiveSection(subLink);
    // setLoading(true);
    if (sub !== "") {
      try {
        const response = await Api.get(`topic-test/test-sub/${sub}`);
        console.log("subMenu data", response.data);
        setSubMenuData(response.data[0].submenus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sub-menu data:", error);
        setLoading(false);
        setSubMenuData([]);
      }
    }
  };

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
      ) :(
    <div className="container">
      {/* <h1 className="text-center fw-bold text-green-600">
                {/* <PsychologyIcon fontSize="large" className="text-green-600 me-2" /> 
                Reasoning Ability
            </h1> */}
      <div className="row mt-3">
        <div className="col-md-9">
          <div className="staticheader">
            <p className="font mt-2 h5 leading-8">
              <h1
                className="font font-bold "
                dangerouslySetInnerHTML={{ __html: catDetail.title }}
              ></h1>
              <br />
              <p
                dangerouslySetInnerHTML={{ __html: catDetail.description }}
              ></p>
            </p>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner "
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
            {/* <hr className="border-t border-gray-600" /> */}

            <img src={data.featurePhoto} alt="" />
            <div className="text-center">
              <p>
                <del className="text-red-400 font">Original Price:</del>
              </p>
              <del className="bg-red-500 text-white rounded p-1 mb-2">
                Rs.{amount}
              </del>
              <p className="text-white font h5">Discounted Price:</p>
              <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                Rs.{discountedAmount}
              </button>
              <p className="text-white font-bold">
                You Save Money: {amount - discountedAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar Buttons */}

      {link === "currentaffairs" ? (
        ""
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-3">
            {/* <button
              onClick={() => setActiveSection("All")}
              className={`btn w-100 mb-2 text-white ${
                activeSection === "All"
                  ? "bg-[#131656] hover:bg-[#131656]"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              All
            </button> */}

            {subMenuData.length > 0 &&
              subMenuData.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSection(sub)}
                  className={`btn w-100 mb-2 text-white ${
                    activeSection === sub
                      ? "bg-[#131656] hover:bg-[#131656]"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {sub}
                </button>
              ))}
          </div>
          <div>
            {activeSection && (
              <div className="mt-3 bg-slate-50 py-2 px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                  {data?.exams?.map((test, idx) => {
                    // If activeSection is "All" or matches the test's sub_menu, render the test
                    if (
                      activeSection === "All" ||
                      test.topic_test?.sub_menu === activeSection
                    ) {
                      return (
                        <div key={idx} className="">
                          <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                            <div className="card-body text-center flex flex-col justify-evenly">
                              <h5 className="card-title font-bold text-">
                                {test.exam_name}
                              </h5>
                              <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                              {/* Show Level Button */}
                              {!showDifficulty[test._id] ? (
                                <button
                                  onClick={() => handleShowLevelClick(test._id)}
                                  className="text-white text-base py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                                >
                                  Show Level
                                </button>
                              ) : (
                                <div className="mt-2 rounded text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                  <p>
                                    <strong>{test.q_level.toUpperCase()}</strong>
                                  </p>
                                </div>
                              )}

                              {/* Test Info Section */}
                              <div className="flex justify-center items-center gap-4 mt-2">
                                <div className="flex flex-col items-center">
                                  <p className="font-medium">Questions</p>
                                  <p className="flex items-center gap-1">
                                    <BsQuestionSquare
                                      size={20}
                                      color="orange"
                                    />
                                    {test.section[0].t_question}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center">
                                  <p className="font-medium">Marks</p>
                                  <p className="flex items-center gap-1">
                                    <ImCheckmark2 size={20} color="green" />
                                    {test.section[0].t_mark}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center">
                                  <p className="font-medium">Time</p>
                                  <p className="flex items-center gap-1">
                                    <MdOutlineAccessTime
                                      size={20}
                                      color="red"
                                    />
                                    {test.section[0].t_time}
                                  </p>
                                </div>
                              </div>
                              <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
                              {/* Take Test / Lock Button */}
                              <button
                                className={`mt-3 py-2 px-4 rounded w-full transition ${
                                  test.status === "true"
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "border-1 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                }`}
                                onClick={() => {
                                  if (test.status === "true") {
                                    navigate(`/instruction/${test._id}`);
                                  } else {
                                    handleTopicSelect(test.section[0], "PYQ");
                                  }
                                }}
                              >
                                {test.status === "true" ? (
                                  "Take Test"
                                ) : (
                                  <div className="flex items-center justify-center font-semibold gap-1">
                                    <IoMdLock />
                                    Lock
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null; // Don't render if activeSection doesn't match
                  })}
                </div>
              </div>
            )}
          </div>
         
        </>
      )}

      {/* Conditionally render CAmonth only if the link is 'currentaffairs' */}
      {link === "currentaffairs" && (
        <div>
          <CAmonth />
        </div>
      )}

      {catDetail?.sub_titles?.length > 0 &&
        catDetail?.sub_titles?.map((sub) => (
          <div className="flex flex-col gap-3 flex-wrap py-2 bg-gray-50 px-2 my-3 shadow-lg">
            <h1
              className="my-2 p-3"
              dangerouslySetInnerHTML={{ __html: sub.title }}
            ></h1>

            <p
              className="my-2 p-3"
              dangerouslySetInnerHTML={{ __html: sub.description }}
            ></p>
          </div>
        ))}
    </div>
     )}
    </>
  );
};

export default DetailedCategorie;
