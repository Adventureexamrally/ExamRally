import React from 'react';

const QuestionInfoBar = ({
    clickedQuestionIndex,
    examData,
    displayLanguage,
    selectedLanguage,
    t_questions,
    questionTime,
    formatTime,
    currentSectionIndex,
    startingIndex
}) => {
    const currentSection = examData?.section?.[currentSectionIndex];
    const currentQuestion = currentSection?.questions?.[
        (displayLanguage || selectedLanguage)?.toLowerCase()
    ]?.[clickedQuestionIndex - startingIndex];

    const totalQuestionsInExam = examData?.section?.reduce(
        (sum, s) => sum + (s.questions?.[(displayLanguage || selectedLanguage)?.toLowerCase()]?.length || 0),
        0
    ) || t_questions;

    const plusMark = currentQuestion?.plus_mark ?? currentSection?.plus_mark ?? '—';
    const minusMark = currentQuestion?.minus_mark ?? currentSection?.minus_mark ?? '—';

    return (
        <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm">
            <span className="font-medium text-gray-700">
                Q: {clickedQuestionIndex + 1} / {totalQuestionsInExam}
            </span>

            <div className="flex items-center gap-3 ml-auto">
                <span className="flex items-center gap-1 text-gray-600">
                    <span>Qn. Time :</span>
                    <span className="font-medium">{formatTime(questionTime)}</span>
                </span>

                <span className="flex items-center gap-1 font-medium">
                    <span className="text-gray-600">Marks :</span>
                    <span className="text-green-600">+{plusMark}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-red-500">-{minusMark}</span>
                </span>
            </div>
        </div>
    );
};

export default QuestionInfoBar;
