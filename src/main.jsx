
  // console.log = () => {};
  // console.warn = () => {};
  // console.error = () => {};



import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserProvider } from "./context/UserProvider.jsx";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
if (!clerkKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// Add user interaction restrictions
const disableUserActions = () => {
  // Disable right-click
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  // Disable keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey && ["a", "c", "x", "v", "s", "u", "p"].includes(e.key.toLowerCase())) || // Ctrl+A, C, X, V, S, U, P
      (e.key === "PrintScreen") ||
      (e.metaKey && ["a", "c", "x", "v", "s", "p"].includes(e.key.toLowerCase())) // Cmd+A, etc. for Mac
    ) {
      e.preventDefault();
      alert("This action is disabled.");
    }
  });

  // Try to block Print Screen (limited to detection only)
  window.addEventListener("keyup", (e) => {
    if (e.key === "PrintScreen") {
      navigator.clipboard.writeText("Screenshot blocked");
      alert("Screenshots are disabled.");
    }
  });

  // Disable drag/drop
  window.addEventListener("dragstart", (e) => e.preventDefault());
};


const Root = () => {
  useEffect(() => {
    disableUserActions();
  }, []);

  return (
    <Provider store={store}>
      <ClerkProvider publishableKey={clerkKey} frontendApi="clerk.examrally.in">
        <UserProvider>
          <App />
        </UserProvider>
      </ClerkProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
