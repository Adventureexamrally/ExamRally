import React from 'react';
import { Avatar } from '@mui/material';

const QuestionPalette = ({
    isMobileMenuOpen,
    closeSideBar,
    isFullscreen,
    toggleMenu,
    user,
    timeminus,
    formatTime,
    handlePauseResume,
    isPaused,
    answeredCount,
    notAnsweredCount,
    notVisitedCount,
    markedForReviewCount,
    answeredAndMarkedCount,
    examData,
    currentSectionIndex,
    selectedLanguage,
    startingIndex,
    selectedOptions,
    markedForReview,
    visitedQuestions,
    setClickedQuestionIndex
}) => {
    return (
        <div
            className={`mb-14 pb-7 bg-light transform transition-transform duration-300 border
        ${isMobileMenuOpen ? 'translate-x-0 w-3/4' : 'translate-x-full'}
        ${closeSideBar ? 'md:translate-x-full md:w-0 border-0' : 'md:translate-x-0 md:w-1/4'}
        ${isFullscreen ? 'h-[87vh] md:h-[87vh]' : 'h-[80vh] sm:h-[82vh] md:h-[85vh] lg:h-[85vh] xl:h-[85vh]'}
        fixed top-14 right-0 z-40 md:static shadow-sm md:block h-[79vh]`}
            style={{
                height: 'calc(100vh - 150px)',
                overflowY: 'auto'
            }}
        >
            {isMobileMenuOpen && (
                <button onClick={toggleMenu} className="md:hidden text-black p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}

            <div className="container">
                <div className="w-full flex items-center justify-center space-x-4 p-2 bg-[#3476bb]">
                    <div>
                        <Avatar
                            alt={user?.firstName}
                            src={user?.profilePicture}
                            sx={{ width: 30, height: 30 }}
                        />
                    </div>
                    <div>
                        <h1 className="text-white text-wrap break-words">
                            {user?.firstName + " " + (user?.lastName || "")}
                        </h1>
                    </div>
                </div>

                <h1 className="text-center text-black bg-gray-100 p-2">
                    Time Left: {formatTime(timeminus)}
                </h1>

                <center>
                    <button
                        onClick={handlePauseResume}
                        className={`px-4 py-2 rounded-lg font-semibold transition duration-300 mt-2 ${isPaused ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                    >
                        {isPaused ? "Resume" : "Pause"}
                    </button>
                </center>

                <div className="container mt-3">
                    <div className="row align-items-center">
                        <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                            <div className="smanswerImg text-white fw-bold flex align-items-center justify-content-center">
                                {answeredCount}
                            </div>
                            <p className="ml-2 text-start text-lg-center mb-0">Answered</p>
                        </div>
                        <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                            <div className="smnotansImg text-white fw-bold flex align-items-center justify-content-center">
                                {notAnsweredCount}
                            </div>
                            <p className="ml-2 text-start text-lg-center mb-0">Not Answered</p>
                        </div>
                    </div>
                </div>

                <div className="container mb-3">
                    <div className="row">
                        <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                            <div className="smnotVisitImg fw-bold flex align-items-center justify-content-center">
                                {notVisitedCount}
                            </div>
                            <p className="ml-2 text-start text-lg-center mb-0">Not Visited</p>
                        </div>
                        <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                            <div className="smmarkedImg text-white fw-bold flex align-items-center justify-content-center">
                                {markedForReviewCount}
                            </div>
                            <p className="ml-2 text-start text-lg-center">Marked for Review</p>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                        <div className="smansmarkedImg text-white fw-bold flex align-items-center justify-content-center">
                            {answeredAndMarkedCount}
                        </div>
                        <p className="ml-3 text-start text-lg-center mb-0">Answered & Marked for Review</p>
                    </div>
                </div>

                <h1 className="mt-1 mb-1 text-sm text-white bg-blue-500 p-1">
                    Section: {examData?.section[currentSectionIndex]?.name}
                </h1>

                <div className="d-flex flex-wrap gap-2 px-1 py-2 text-center justify-center">
                    {examData?.section[currentSectionIndex]?.questions?.[
                        selectedLanguage?.toLowerCase()
                    ]?.map((_, index) => {
                        const fullIndex = startingIndex + index;

                        let className = "";
                        if (selectedOptions[fullIndex] !== null) {
                            className = "answerImg";
                            if (markedForReview.includes(fullIndex)) {
                                className += " mdansmarkedImg";
                            }
                        } else if (visitedQuestions.includes(fullIndex)) {
                            className = "notansImg";
                        } else {
                            className = "notVisitImg";
                        }

                        if (markedForReview.includes(fullIndex)) {
                            className += " reviewed mdmarkedImg";
                        }

                        return (
                            <div key={fullIndex}>
                                <span
                                    onClick={() => setClickedQuestionIndex(fullIndex)}
                                    className={`fw-bold flex align-items-center justify-content-center cursor-pointer ${className}`}
                                >
                                    {fullIndex + 1}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuestionPalette;
