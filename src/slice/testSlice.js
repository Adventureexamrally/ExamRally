import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    examData: null,
    currentSectionIndex: 0,
    clickedQuestionIndex: 0,
    visitedQuestions: [],
    markedForReview: [],
    ansmarkforrev: [],
    selectedOptions: [],
    timeminus: null,
    questionTimes: {},
    sectionTimes: {},
    submittedSections: [], // Stored as array for serializability
    sectionSummaryData: [],
    isSubmitted: false,
    isPaused: false,
    examStartTime: null, // Track when exam started
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        setExamData: (state, action) => {
            state.examData = action.payload;
            state.status = "succeeded";
        },
        setLoading: (state) => {
            state.status = "loading";
        },
        setError: (state) => {
            state.status = "failed";
        },
        updateNavigation: (state, action) => {
            const { sectionIndex, questionIndex } = action.payload;
            if (sectionIndex !== undefined) state.currentSectionIndex = sectionIndex;
            if (questionIndex !== undefined) state.clickedQuestionIndex = questionIndex;
        },
        setSelectedOption: (state, action) => {
            const { index, option } = action.payload;
            state.selectedOptions[index] = option;
        },
        setAllSelectedOptions: (state, action) => {
            state.selectedOptions = action.payload;
        },
        markVisited: (state, action) => {
            const index = action.payload;
            if (!state.visitedQuestions.includes(index)) {
                state.visitedQuestions.push(index);
            }
        },
        toggleMarkForReview: (state, action) => {
            const index = action.payload;
            if (state.markedForReview.includes(index)) {
                state.markedForReview = state.markedForReview.filter(i => i !== index);
            } else {
                state.markedForReview.push(index);
            }
        },
        setTimeminus: (state, action) => {
            state.timeminus = action.payload;
        },
        tickTimeminus: (state) => {
            if (state.timeminus > 0) state.timeminus -= 1;
        },
        updateQuestionTime: (state, action) => {
            const { index, time } = action.payload;
            state.questionTimes[index] = (state.questionTimes[index] || 0) + time;
        },
        setAllQuestionTimes: (state, action) => {
            state.questionTimes = action.payload;
        },
        updateSectionTime: (state, action) => {
            const { index, time } = action.payload;
            state.sectionTimes[index] = (state.sectionTimes[index] || 0) + time;
        },
        markSectionSubmitted: (state, action) => {
            const index = action.payload;
            if (!state.submittedSections.includes(index)) {
                state.submittedSections.push(index);
            }
        },
        setSectionSummaryData: (state, action) => {
            state.sectionSummaryData = action.payload;
        },
        setSubmitted: (state, action) => {
            state.isSubmitted = action.payload;
        },
        setIsPaused: (state, action) => {
            state.isPaused = action.payload;
        },
        setExamStartTime: (state, action) => {
            state.examStartTime = action.payload;
        },
        tickQuestionTime: (state, action) => {
            const { index } = action.payload;
            state.questionTimes[index] = (state.questionTimes[index] || 0) + 1;
        },
        resetTestState: () => initialState,
    },
});

export const {
    setExamData,
    setLoading,
    setError,
    updateNavigation,
    setSelectedOption,
    setAllSelectedOptions,
    markVisited,
    toggleMarkForReview,
    setTimeminus,
    tickTimeminus,
    updateQuestionTime,
    setAllQuestionTimes,
    updateSectionTime,
    markSectionSubmitted,
    setSectionSummaryData,
    setSubmitted,
    setIsPaused,
    setExamStartTime,
    tickQuestionTime,
    resetTestState,
} = testSlice.actions;

export default testSlice.reducer;
