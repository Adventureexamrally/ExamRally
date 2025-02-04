import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Fetch all questions
export const fetchQuestions = createAsyncThunk(
    "questions/fetchQuestions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:3000/questions/questions");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
// export const fetchQuestions = createAsyncThunk(
//     "questions/fetchQuestions",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get("http://localhost:3000/questions");
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// 🔹 Submit an answer
export const submitAnswer = createAsyncThunk(
    "questions/submitAnswer",
    async ({ userId, questionId, answer }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:3000/users/${userId}/questions/${questionId}`, { answer });
            return response.data;
            console.log(response.data);
            
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const questionSlice = createSlice({
    name: "questions",
    initialState: {
        questions: [],
        loading: false,
        error: null,
        submissionStatus: null,
    },
    reducers: {}, 
    extraReducers: (builder) => {
        builder
            // 🔹 Handle Fetch Questions
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Handle Submit Answer
            .addCase(submitAnswer.pending, (state) => {
                state.submissionStatus = "loading";
            })
            .addCase(submitAnswer.fulfilled, (state) => {
                state.submissionStatus = "success";
            })
            .addCase(submitAnswer.rejected, (state, action) => {
                state.submissionStatus = "error";
                state.error = action.payload;
            });
    },
});

export default questionSlice.reducer;
