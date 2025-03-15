import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentQuestionIndex: 0,
    selectedOptions: {},
    visitedQuestions: [],
    reviewedQuestions: [], // Added missing state for reviewed questions
    isSubmitted: false,
    timeLeft: 3600, // 1 hour in seconds
    markedForReview: [], // Defined markedForReview here
};

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        nextQuestion: (state) => {
            if (state.currentQuestionIndex < 100 - 1) {
                state.currentQuestionIndex += 1;
            }
        },
        prevQuestion: (state) => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex -= 1;
            }
        },
        selectOption: (state, action) => {
            const { questionIndex, optionIndex } = action.payload;
            state.selectedOptions[questionIndex] = optionIndex;
        },
        markVisited: (state, action) => {
            const questionIndex = action.payload;
            if (!state.visitedQuestions.includes(questionIndex)) {
                state.visitedQuestions.push(questionIndex);
            }
        },
        markForReview: (state, action) => {
            const questionIndex = action.payload;
            if (!state.markedForReview.includes(questionIndex)) {
                state.markedForReview.push(questionIndex);
            } else {
                state.markedForReview = state.markedForReview.filter((index) => index !== questionIndex);
            }
        },
        submitTest: (state) => {
            state.isSubmitted = true;
        },
        updateTime: (state) => {
            if (state.timeLeft > 0) {
                state.timeLeft -= 1;
            }
        },
    },
});

// Exporting the actions
export const {
    nextQuestion,
    prevQuestion,
    selectOption,
    markVisited,
    markForReview, // Ensure this is exported
    submitTest,
    updateTime,
} = testSlice.actions;

export default testSlice.reducer;
