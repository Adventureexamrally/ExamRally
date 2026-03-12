import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../service/Api";

const initialState = {
    user: null,
    results: {}, // Store exam results keyed by examId
    pdfResults: {}, // Store PDF exam results keyed by examId
    loading: false,
    error: null,
};

// Async thunk to fetch user results globally
export const fetchUserResults = createAsyncThunk(
    "user/fetchUserResults",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await Api.get(`/results/${userId}`);
            // Transform array of results into a keyed object by ExamId
            const resultsMap = {};
            if (Array.isArray(response.data)) {
                response.data.forEach((result) => {
                    const examId = result.ExamId?._id || result.ExamId;
                    if (examId) {
                        resultsMap[examId] = {
                            status: result.status,
                            lastQuestionIndex: result.lastVisitedQuestionIndex,
                            selectedOptions: result.selectedOptions,
                            timeTakenInSeconds: result.timeTakenInSeconds,
                        };
                    }
                });
            }
            return resultsMap;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch results.");
        }
    }
);

// Async thunk to fetch user PDF results globally
export const fetchUserPDFResults = createAsyncThunk(
    "user/fetchUserPDFResults",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await Api.get(`/PDFresults/${userId}`);
            // Transform array of results into a keyed object by ExamId
            const resultsMap = {};
            if (Array.isArray(response.data)) {
                response.data.forEach((result) => {
                    const examId = result.ExamId?._id || result.ExamId;
                    if (examId) {
                        resultsMap[examId] = {
                            status: result.status,
                            sectionIndex: result.sectionIndex,
                            currentSectionIndex: result.currentSectionIndex,
                            currentQuestionIndex: result.currentQuestionIndex,
                            timeTakenInSeconds: result.timeTakenInSeconds,
                        };
                    }
                });
            }
            return resultsMap;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch PDF results.");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setResults: (state, action) => {
            // Merging results if needed, or replacing
            state.results = { ...state.results, ...action.payload };
        },
        setPDFResults: (state, action) => {
            state.pdfResults = { ...state.pdfResults, ...action.payload };
        },
        clearUser: (state) => {
            state.user = null;
            state.results = {};
            state.pdfResults = {};
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserResults.fulfilled, (state, action) => {
                state.loading = false;
                // Merge the remotely fetched results with any existing state.results
                state.results = { ...state.results, ...action.payload };
            })
            .addCase(fetchUserResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserPDFResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPDFResults.fulfilled, (state, action) => {
                state.loading = false;
                state.pdfResults = { ...state.pdfResults, ...action.payload };
            })
            .addCase(fetchUserPDFResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setUser, setResults, setPDFResults, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
