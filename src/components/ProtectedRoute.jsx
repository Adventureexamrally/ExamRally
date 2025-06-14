import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";


const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useContext(UserContext); // Get current user from context
  const { userId,id } = useParams(); // Get userId from route param
// console.log("userId", userId,id);

  if (!isLoaded) {
    return (
        <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }} // Full viewport height
              >
                <div
                  className="spinner-border text-green-500 fw-bold "
                  role="status"
                  style={{ width: '3rem', height: '3rem' }}
                >
                 
                </div>
              </div>
    )
  }

  // Not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
// console.log("user from context:", user?._id, "from route:", userId);

// Don't navigate until both values are present
if (userId && user?._id && user?._id !== userId) {
  return <Navigate to="/" replace />;
}

  return <Outlet />;
};

export default ProtectedRoute;
