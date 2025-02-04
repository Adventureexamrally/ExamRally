import { createSlice } from "@reduxjs/toolkit";
import questions from "../data/questions"; // Assuming questions are in a local file
import { fetchQuestions } from "../slice/questionSlice";
const initialState = {
    currentQuestionIndex: 0,
    selectedOptions: {},
    visitedQuestions: [],
    isSubmitted: false,
    timeLeft: 3600, // 1 hour in seconds
};

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        nextQuestion: (state) => {
            if (state.currentQuestionIndex < questions.length - 1) {
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
            if (!state.visitedQuestions.includes(action.payload)) {
                state.visitedQuestions.push(action.payload);
                state.currentQuestionIndex=action.payload
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

export const {
    nextQuestion,
    prevQuestion,
    selectOption,
    markVisited,
    submitTest,
    updateTime,
} = testSlice.actions;

export default testSlice.reducer;
