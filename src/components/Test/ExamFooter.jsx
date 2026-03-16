import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

const ExamFooter = ({
    handlePreviousClick,
    clickedQuestionIndex,
    startingIndex,
    handleMarkForReview,
    handleClearResponse,
    examData,
    currentSectionIndex,
    selectedLanguage,
    handleNextClick,
    handleSubmitSection
}) => {
    const currentSection = examData?.section?.[currentSectionIndex];
    const questions = currentSection?.questions?.[selectedLanguage?.toLowerCase()] || [];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-2 border-t border-gray-200 z-50">
            <div className="flex justify-between flex-col md:flex-row w-full">
                <div className="flex justify-between md:w-3/4 m-1">
                    {/* Left side - Previous, Mark for Review, Clear Response */}
                    <div className="flex gap-1 items-center">
                        <button
                            onClick={handlePreviousClick}
                            disabled={clickedQuestionIndex <= startingIndex}
                            className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm md:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center gap-1">
                                <FaChevronLeft className="w-3 h-3" />
                                <span className="hidden md:inline">Previous</span>
                            </span>
                        </button>
                        &nbsp;
                        <button
                            onClick={handleMarkForReview}
                            className="btn bg-blue-300 hover:bg-blue-400 text-sm md:text-sm"
                        >
                            <span className="block md:hidden">Mark &amp; Next</span>
                            <span className="hidden md:block">Mark for Review</span>
                        </button>
                        &nbsp;
                        <button
                            onClick={handleClearResponse}
                            className="btn bg-blue-300 hover:bg-blue-400 text-sm md:text-sm"
                        >
                            <span className="block md:hidden">Clear</span>
                            <span className="hidden md:block">Clear Response</span>
                        </button>
                    </div>

                    {questions.length > 0 && (
                        <button
                            onClick={handleNextClick}
                            className="btn bg-blue-500 text-white hover:bg-blue-700 text-sm md:text-sm"
                        >
                            <span className="block md:hidden">Save</span>
                            <span className="hidden md:block">Save &amp; Next</span>
                        </button>
                    )}
                </div>

                {/* Right side - Submit Section / Test */}
                <div className="flex justify-center md:w-[20%]">
                    <center>
                        <button
                            className="btn bg-blue-500 text-white hover:bg-blue-700 mt-2 md:mt-0 px-7 text-sm md:text-sm"
                            onClick={handleSubmitSection}
                            // These data-bs attributes are for Bootstrap modal trigger
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                        >
                            {currentSectionIndex === (examData?.section?.length - 1)
                                ? "Submit Test"
                                : "Submit Section"}
                        </button>
                    </center>
                </div>
            </div>
        </div>
    );
};

export default ExamFooter;
