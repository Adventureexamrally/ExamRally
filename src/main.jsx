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

// Get Clerk Publishable Key
const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
if (!clerkFrontendApi) {
  throw new Error("Missing Clerk Publishable Key in environment variables.");
}
console.log("Clerk Key:", clerkFrontendApi);


const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
if (!clerkKey) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ClerkProvider publishableKey={clerkKey} frontendApi="clerk.examrally.in">
      <UserProvider>
        <App />
      </UserProvider>
    </ClerkProvider>
  </Provider>
);

