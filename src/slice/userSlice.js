import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch user data
export const fetchUser = createAsyncThunk("user/fetchUser", async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {}, // You can add synchronous actions here
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;
