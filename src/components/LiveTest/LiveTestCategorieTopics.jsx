import React, { useEffect, useState } from 'react';
import { IoMdLock } from 'react-icons/io';

const LiveTestCategorieTopics = ({ data, activeSection, setCurrentTopic }) => {
  const [uniqueTopics, setUniqueTopics] = useState([]);  // State to store unique topics

  // Filter and set unique topics when data or activeSection changes
  useEffect(() => {
    if (data?.exams?.length > 0 && activeSection) {
      const allTopics = [];

      // Step 1: Filter exams based on the active section
      const filteredExams = data.exams.filter((test) => test.topic_test?.sub_menu === activeSection);

      // Step 2: Extract topics from filtered exams
      filteredExams.forEach((test) => {
        const topic = test.topic_test?.topic;
        // Add topic only if it's not already in the uniqueTopics array
        if (topic && !allTopics.includes(topic)) {
          allTopics.push(topic);
        }
      });

      // Step 3: Set the unique topics in the state
      setUniqueTopics(allTopics);
    }
  }, [data, activeSection]);  // Re-run whenever `data` or `activeSection` changes

  console.log(uniqueTopics);
  
  return (
    <div>
      {activeSection && (
        <div className="mt-3 bg-slate-50 py-2 px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {/* Render unique topics */}
            {uniqueTopics.map((topic, idx) => {
              // Step 4: Filter exams for the current unique topic
              const relatedTests = data?.exams?.filter((test) => test.topic_test?.topic === topic);

              return (
                <div key={`${idx}`} className="">
                  <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full">
                    <div className="card-body text-center flex flex-col justify-evenly">
                      <h5 className="card-title font-semibold">{topic}</h5>

                      {/* Take Test / Lock Button */}
                      <button
                        className={`mt-3 py-2 px-4 rounded w-full transition 
                        
                             bg-green-500 text-white hover:bg-green-600
                        }`}
                        data-bs-toggle="modal"
                        data-bs-target="#questionsModal"
                        onClick={() => setCurrentTopic(topic)}
                      >
                        {/* {test.status === 'true' ? ( */}
                          View Question
                        {/* ) : (
                          <div className="flex items-center justify-center font-semibold gap-1">
                            <IoMdLock />
                            Lock
                          </div>
                        )} */}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTestCategorieTopics;
