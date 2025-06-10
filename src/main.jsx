//if you want to show the console logs you need to comment the below 3 lines
  // console.log = () => {};
  // console.warn = () => {};
  // console.error = () => {};

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from './store/store.js';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import your Publishable Key
const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// const clerkFrontendApi = "pk_test_Y29oZXJlbnQtam9leS03My5jbGVyay5hY2NvdW50cy5kZXYk";
// import 'bootstrap/dist/css/bootstrap.min.css';
if (!clerkFrontendApi) {
  throw new Error("Missing Clerk Publishable Key in environment variables.");
}

// Use ReactDOM.createRoot (React 18+)
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
    <Provider store={store}>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <UserProvider>
      <App />
      </UserProvider>
    </ClerkProvider>
    </Provider>
  // </React.StrictMode>
);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { UserProvider } from "./context/UserProvider.jsx";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNi3ydDzBwpdTg_4HhWtmlfbS6BPMECqw",
  authDomain: "examrally-4da8d.firebaseapp.com",
  projectId: "examrally-4da8d",
  storageBucket: "examrally-4da8d.firebasestorage.app",
  messagingSenderId: "408810859681",
  appId: "1:408810859681:web:4273d62e2e014926d094e0",
  measurementId: "G-D8P0SVR9TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);