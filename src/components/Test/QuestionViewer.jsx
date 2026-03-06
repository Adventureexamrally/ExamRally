import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import QuestionInfoBar from './QuestionInfoBar';

const QuestionViewer = ({
    examData,
    currentSectionIndex,
    clickedQuestionIndex,
    startingIndex,
    selectedLanguage,
    displayLanguage,
    isFullscreen,
    closeSideBar,
    toggleMenu2,
    selectedOptions,
    handleOptionChange,
    isSubmitted,
    questionTime,
    formatTime,
    t_questions
}) => {
    if (isSubmitted) {
        return (
            <div className="text-center p-10">
                <h1 className="display-6 text-success">Test Completed!</h1>
            </div>
        );
    }

    const currentSection = examData?.section?.[currentSectionIndex];

    if (!currentSection) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const activeLang = (displayLanguage || selectedLanguage)?.toLowerCase();
    const currentQuestion = currentSection.questions?.[activeLang]?.[clickedQuestionIndex - startingIndex];

    return (
        <>
            <QuestionInfoBar
                clickedQuestionIndex={clickedQuestionIndex}
                examData={examData}
                displayLanguage={displayLanguage}
                selectedLanguage={selectedLanguage}
                t_questions={t_questions}
                questionTime={questionTime}
                formatTime={formatTime}
                currentSectionIndex={currentSectionIndex}
                startingIndex={startingIndex}
            />

            <div className="flex flex-col md:flex-row p-0">
                {/* Left side for Common Data */}
                {currentQuestion?.common_data && (
                    <div
                        className={`md:w-[50%] p-3 pb-5 md:border-r border-gray-300 ${isFullscreen ? 'h-[80vh]' : 'sm:h-[70vh] md:h-[75vh] lg:h-[73vh] xl:h-[75vh] 2xl:h-[80vh]'
                            }`}
                        style={{ height: 'calc(100vh - 150px)', overflowY: 'auto' }}
                    >
                        <div
                            className="text-wrap"
                            style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                            dangerouslySetInnerHTML={{ __html: currentQuestion.common_data }}
                        />
                    </div>
                )}

                {/* Right side for Question */}
                <div
                    className={`${isFullscreen ? 'h-[80vh]' : 'sm:h-[70vh] md:h-[75vh] lg:h-[73vh] xl:h-[75vh] 2xl:h-[80vh]'} 
            mb-24 md:mb-2 p-3 pb-5 flex flex-col md:flex-row justify-between ${currentQuestion?.common_data ? "md:w-[50%]" : "md:w-full"
                        }`}
                    style={{ height: 'calc(100vh - 150px)', overflowY: 'auto' }}
                >
                    <div className="flex-grow">
                        <div
                            className="text-wrap mb-2"
                            style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                            dangerouslySetInnerHTML={{ __html: currentQuestion?.question || "No question available" }}
                        />

                        {currentQuestion?.options ? (
                            <div className="mt-4">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="p-1 rounded-lg m-2">
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="radio"
                                                id={`option-${index}`}
                                                name="exam-option"
                                                value={index}
                                                checked={selectedOptions[clickedQuestionIndex] === index}
                                                onChange={() => handleOptionChange(index)}
                                                style={{
                                                    accentColor: "#3B82F6",
                                                    width: "1.2rem",
                                                    height: "1.2rem",
                                                    marginRight: "8px"
                                                }}
                                            />
                                            <label
                                                htmlFor={`option-${index}`}
                                                className="cursor-pointer"
                                                dangerouslySetInnerHTML={{ __html: option || "No option available" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No options available</p>
                        )}
                    </div>

                    <div className="md:flex hidden items-center">
                        <div
                            className={`fixed top-1/2 ${closeSideBar ? "right-0" : ""} bg-gray-600 h-14 w-5 rounded-s-md flex justify-center items-center cursor-pointer`}
                            onClick={toggleMenu2}
                        >
                            <FaChevronRight
                                className={`w-2 h-5 text-white transition-transform duration-300 ${closeSideBar ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionViewer;
