import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import questionReducer from "../slice/questionSlice";
import testReducer from '../slice/testSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        questions: questionReducer,
        test: testReducer,
    },
});
