// Uncomment these to see console logs during debugging
// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserProvider } from "./context/UserProvider.jsx";

// Initialize Firebase first
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNi3ydDzBwpdTg_4HhWtmlfbS6BPMECqw",
  authDomain: "examrally-4da8d.firebaseapp.com",
  projectId: "examrally-4da8d",
  storageBucket: "examrally-4da8d.firebasestorage.app",
  messagingSenderId: "408810859681",
  appId: "1:408810859681:web:4273d62e2e014926d094e0",
  measurementId: "G-D8P0SVR9TF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get Clerk Publishable Key
const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
if (!clerkFrontendApi) {
  throw new Error("Missing Clerk Publishable Key in environment variables.");
}
console.log("Clerk Key:", clerkFrontendApi);

const root = ReactDOM.createRoot(document.getElementById("root"));
const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  domain: "examrally.in",
  isSatellite: false, // Set true if using cross-origin auth
  signInUrl: "/" // Customize as needed
};

root.render(
  // <React.StrictMode>
  <Provider store={store}>
     <ClerkProvider {...clerkConfig}>
      <UserProvider>
        <App />
      </UserProvider>
    </ClerkProvider>
  </Provider>
  // </React.StrictMode>
);
