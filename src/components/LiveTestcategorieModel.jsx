import React, { useState } from 'react'
import { BsQuestionSquare } from 'react-icons/bs';
import { ImCheckmark2 } from 'react-icons/im';
import { IoMdLock } from 'react-icons/io';
import { MdOutlineAccessTime } from 'react-icons/md';
import { FaTachometerAlt } from "react-icons/fa";  // Import the correct icon


const LiveTestcategorieModel = ({data,topic,activeSection}) => {
    console.log(data);

      const [showDifficulty, setShowDifficulty] = useState({});
    
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
    
    return (
        <div className="modal fade" id="questionsModal" tabIndex="-1" aria-labelledby="questionsModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{topic} - {activeSection} </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {/* <h6>Time Remaining: <strong>{formatTimer(timer)}</strong></h6> */}
                        <div className="row">

                            <div className="mt-3 bg-slate-50 py-2 px-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                                    {data?.exams?.map((test, idx) => {
                                        // If activeSection is "All" or matches the test's sub_menu, render the test
                                        if (
                                            test.topic_test?.topic === topic
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
                                                                    onClick={() =>
                                                                        handleShowLevelClick(test._id)
                                                                    }
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
                                                            {/* Take Test / Lock Button */}
                                                            <button
                                                                className={`mt-3 py-2 px-4 rounded w-full transition ${test.status === "true"
                                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                                    : "border-1 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                                                    }`}
                                                                onClick={() => {
                                                                    if (test.status === "true") {
                                                                        openNewWindow(`/instruction/${test._id}`);
                                                                    } else {
                                                                        handleTopicSelect(
                                                                            test.section[0],
                                                                            "PYQ"
                                                                        );
                                                                    }
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#questionsModal"
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

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveTestcategorieModel
