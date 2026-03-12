import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "../slice/userSlice";
import questionReducer from "../slice/questionSlice";
import testReducer from '../slice/testSlice';
import forumReducer from '../slice/forumSlice';

const userPersistConfig = {
    key: 'user',
    version: 1,
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        questions: questionReducer,
        test: testReducer,
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
