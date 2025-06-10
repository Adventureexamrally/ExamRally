import React, { useContext, useState, useEffect } from "react";
import { BsQuestionSquare } from "react-icons/bs";
import { ImCheckmark2 } from "react-icons/im";
import { IoMdLock } from "react-icons/io";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaTachometerAlt } from "react-icons/fa"; // Import the correct icon
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";
import Api from "../../service/Api";

const LiveTestcategorieModel = ({ data, topic, activeSection }) => {
  console.log(data);

  const [showDifficulty, setShowDifficulty] = useState({});
  const [expiredate, setExpirydate] = useState();

  const handleShowLevelClick = (testId) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [testId]: true, // Mark the test's difficulty as shown
    }));
  };
  const openNewWindow = (url) => {
    const width = screen.width;
    const height = screen.height;
    window.open(
      url,
      "_blank",
      `noopener,noreferrer,width=${width},height=${height}`
    );
  };
  const [resultData, setResultData] = useState(null);

  console.warn("sf", expiredate);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  console.log(user);
  const { isSignedIn } = useUser();

  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      // Fetch test result for each test
      data?.exams?.forEach((test) => {
        Api.get(`/results/${user?._id}/${test._id}`)
          .then((res) => {
            if (
              res.data?.status === "completed" ||
              res.data?.status === "paused"
            ) {
              console.warn("reskuma", res.data.status);
              setResultData((prev) => ({
                ...prev,
                [test._id]: {
                  ...res.data,
                  lastQuestionIndex: res.data.lastVisitedQuestionIndex,
                  selectedOptions: res.data.selectedOptions,
                },
              }));
            }
          })
          .catch((err) => {
            console.error("Error fetching result:", err);
          });
      });
    }
  }, [data?.exams, user?._id]);

  useEffect(() => {
    console.log("ResultData updated:", resultData);
    // You can add other logic here to respond to resultData changes
  }, [JSON.stringify(resultData)]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        console.log("User returned to tab");
        if (user?._id) {
          try {
            data?.exams?.forEach((test) => {
              Api.get(`/results/${user?._id}/${test._id}`)
                .then((res) => {
                  if (
                    res.data?.status === "completed" ||
                    res.data?.status === "paused"
                  ) {
                    setResultData((prev) => ({
                      ...prev,
                      [test._id]: {
                        ...res.data,
                        lastQuestionIndex: res.data.lastVisitedQuestionIndex,
                        selectedOptions: res.data.selectedOptions,
                      },
                    }));
                  }
                })
                .catch((err) => {
                  console.error("Error fetching result:", err);
                });
            });

            // window.location.reload();
          } catch (err) {
            console.error("Error fetching result for tests:", err);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?._id, resultData]);

  //  useEffect(() => {
  //   const handleVisibilityChange = async () => {
  //     if (document.visibilityState !== "visible") return;

  //     console.log("User returned to tab");

  // const shouldReload=true;
  //     try {

  //       if (shouldReload) {
  //         // Give state update a moment before reloading
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 300);
  //       }
  //     } catch (err) {
  //       console.error("Error in visibility handler:", err);
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [user?._id, id, data]);

  console.log(resultData);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const status = true;
  useEffect(() => {
    const enrolled = user?.enrolledCourses?.some((course) => {
      // Parse expiry and purchase dates
      const expireDate = new Date(course?.expiryDate);
      const purchaseDate = new Date(course?.purchaseDate);

      // Format dates (optional, for display)
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formattedExpiry = formatDate(expireDate);
      const formattedPurchase = formatDate(purchaseDate);

      // Calculate remaining days
      const today = new Date();
      const timeDiff = expireDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 1 day in ms

      if (
        !isNaN(daysLeft) &&
        daysLeft >= 0 &&
        course?.courseId?.includes(data?._id)
      ) {
        setExpirydate(daysLeft); // 👈 Set number of days left
        return true;
      }

      return false;
    });

    setIsEnrolled(enrolled);
  }, [user, data]);

  console.log("check", user?.enrolledCourses);

  if (isEnrolled) {
    console.log("Hii");
  } else if (status) {
    console.log("bye");
  }

  const isPaidTest = (test) => {
    return test?.result_type?.toLowerCase() === "paid";
  };

  return (
    <div
      className="modal fade"
      id="questionsModal"
      tabIndex="-1"
      aria-labelledby="questionsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {topic} - {activeSection}{" "}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {/* <h6>Time Remaining: <strong>{formatTimer(timer)}</strong></h6> */}
            <div className="row">
              <div className="mt-3 bg-slate-50 py-2 px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                  {data?.exams?.map((test, idx) => {
                    // If activeSection is "All" or matches the test's sub_menu, render the test
                    console.log(test.topic_test?.sub_menu, activeSection);

                    if (
                      test.topic_test?.topic === topic &&
                      (activeSection === "All" ||
                        test.topic_test?.sub_menu === activeSection)
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
                                    <strong>
                                      {test.q_level.toUpperCase()}
                                    </strong>
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
                                    <FaTachometerAlt size={20} color="green" />
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
                              {(!isEnrolled &&
                                (isPaidTest(test) ||
                                  new Date(test.live_date) > new Date())) ||
                              (isEnrolled && expiredate < 0) ? (
                             
                              
                                <button
                                  className="mt-3 py-2 px-4 rounded w-full border-2 border-green-600 text-green-600 cursor-not-allowed"
                                  disabled
                                >
                                  <div className="flex items-center justify-center font-semibold gap-1">
                                    <IoMdLock />
                                    Locked
                                  </div>
                                </button>
                              ) : isEnrolled &&
                                new Date(test.live_date) > new Date() ? (
                                // 🚧 Coming Soon if enrolled but test not live yet
                             <div
  className={`mt-3 font-semibold py-2 px-4 border border-1 rounded text-center cursor-not-allowed 
    ${test.show_date ? 'text-[#131656] ' : 'text-red-500  border-red-500'}`}
>
  {test.show_date
    ? `Available from ${new Date(test.live_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`
    : 'Coming Soon'}
</div>

                              ) : (
                                // ✅ User is enrolled and test is live → show proper action
                                <button
                                  className={`mt-3 py-2 px-4 rounded w-full transition ${
                                    resultData?.[test._id]?.status ===
                                    "completed"
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : resultData?.[test._id]?.status ===
                                        "paused"
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "bg-green-500 text-white hover:bg-green-600"
                                  }`}
                                  onClick={() => {
                                    if (!isSignedIn) {
                                      const backdrop =
                                        document.querySelector(
                                          ".modal-backdrop"
                                        );
                                      if (backdrop) backdrop.remove();
                                      navigate("/sign-in");
                                      return;
                                    }

                                    if (
                                      resultData?.[test._id]?.status ===
                                      "completed"
                                    ) {
                                      openNewWindow(
                                        `/liveresult/${test._id}/${user?._id}`
                                      );
                                    } else if (
                                      resultData?.[test._id]?.status ===
                                      "paused"
                                    ) {
                                      openNewWindow(
                                        `/mocklivetest/${test._id}/${user?._id}`
                                      );
                                    } else {
                                      openNewWindow(
                                        `/instruct/${test._id}/${user?._id}`
                                      );
                                    }
                                  }}
                                >
                                  {resultData?.[test._id]?.status ===
                                  "completed"
                                    ? "View Result"
                                    : resultData?.[test._id]?.status ===
                                      "paused"
                                    ? "Resume"
                                    : "Take Test"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null; // Don't render if activeSection doesn't match
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTestcategorieModel;
