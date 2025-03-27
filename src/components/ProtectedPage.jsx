import React from "react";
import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

const ProtectedPage = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <h1>Welcome to the Protected Page!</h1>;
};

export default ProtectedPage;
