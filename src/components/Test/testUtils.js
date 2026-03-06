export const getSectionCounts = (
    section,
    selectedOptions,
    visitedQuestions,
    markedForReview,
    selectedLanguage,
    startingIndex
) => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredAndMarked = 0;

    const questions = section?.questions?.[selectedLanguage?.toLowerCase()];

    questions?.forEach((_, index) => {
        const fullIndex = startingIndex + index;

        if (selectedOptions[fullIndex] !== null) {
            answered++;
            if (markedForReview.includes(fullIndex)) {
                answeredAndMarked++;
            }
        } else if (visitedQuestions.includes(fullIndex)) {
            notAnswered++;
        } else {
            notVisited++;
        }

        if (markedForReview.includes(fullIndex)) {
            markedForReviewCount++;
        }
    });

    return {
        answered,
        notAnswered,
        notVisited,
        markedForReviewCount,
        answeredAndMarked,
    };
};

export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};
