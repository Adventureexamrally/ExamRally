import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "../slice/userSlice";
import questionReducer from "../slice/questionSlice";
import testReducer from '../slice/testSlice';
import forumReducer from '../slice/forumSlice';

const persistConfig = {
    key: 'test',
    version: 1,
    storage,
};

const persistedTestReducer = persistReducer(persistConfig, testReducer);

export const store = configureStore({
    reducer: {
        user: userReducer,
        questions: questionReducer,
        test: persistedTestReducer,
        forum: forumReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
