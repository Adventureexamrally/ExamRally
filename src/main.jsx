
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};



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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
if (!clerkKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// Add user interaction restrictions


const Root = () => {
  useEffect(() => {
    // disableUserActions();
  }, []);
const queryClient = new QueryClient({
    defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 30, // 30 seconds
    },
  }
});
  return (
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ClerkProvider publishableKey={clerkKey} frontendApi="clerk.examrally.in">
        <UserProvider>
          <App />
        </UserProvider>
      </ClerkProvider>
    </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
