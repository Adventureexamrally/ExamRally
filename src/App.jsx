import React, { useState, useEffect, useContext, useCallback, useMemo, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { UserContext } from "./context/UserProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import PopupModal from "./components/PopupModal";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./ScrollToTopButton";
import LoadingSpinner from "./components/LoadingSpinner";
import Api from "./service/Api";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Non-lazy components (frequently used)
import Home from "./pages/Home";
import NotFound from "./pages/404/NotFound";
import Test from "./pages/Test";
import Instruction from "./components/Instruction";
import Otherinstruction from "./components/Otherinstruction";
import Mocksolution from "./components/Mocksolution";
import ResultPage from "./components/ResultPage";
import Resultanalysis from "./components/Resultanalysis";

// Lazy load heavy components
const SignIn = lazy(() => import("@clerk/clerk-react").then(module => ({ default: module.SignIn })));
const SignUp = lazy(() => import("@clerk/clerk-react").then(module => ({ default: module.SignUp })));
const Privacy_Policy = lazy(() => import("./components/Privacy_Policy"));
const Terms_Condition = lazy(() => import("./components/Terms_Condition"));
const Rally_pro = lazy(() => import("./pages/Rally_pro"));
const Rallysuper_Pro = lazy(() => import("./pages/Rallysuper_Pro"));
const Packagename = lazy(() => import("./components/Packagename"));
const Subblog = lazy(() => import("./pages/blog/Subblog"));
const DetailedCategorie = lazy(() => import("./components/LiveTest/DetailedCategorie"));
const Free_pdf = lazy(() => import("./pages/Free_pdf"));
const VideoCourse = lazy(() => import("./pages/VideoCourse"));
const Profile = lazy(() => import("./pages/user/Profile"));
const ActiveDevicesBrowser = lazy(() => import("./pages/user/ActiveDevicesBrowser"));
const OrderHIstory = lazy(() => import("./pages/user/OrderHIstory"));
const PurchaseHistory = lazy(() => import("./pages/user/PurchaseHistory"));
const RecentTestResults = lazy(() => import("./pages/user/RecentTestResults"));
const ReferAndEarn = lazy(() => import("./pages/user/ReferAndEarn"));
const Packages = lazy(() => import("./pages/Packages"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const TestSeries = lazy(() => import("./pages/TestSeries"));
const PdfCourse = lazy(() => import("./pages/pdfCourse/PdfCourse"));
const PdfCourseHome = lazy(() => import("./pages/pdfCourse/PdfCourseHome"));
const Instruct = lazy(() => import("./components/LiveTest/Instruct"));
const OtherInstruct = lazy(() => import("./components/LiveTest/OtherInstruct"));
const MockLiveTest = lazy(() => import("./components/LiveTest/MockLiveTest"));
const LiveResult = lazy(() => import("./components/LiveTest/LiveResult"));
const LiveSolution = lazy(() => import("./components/LiveTest/LiveSolution"));
const PdfInstruction = lazy(() => import("./pages/pdfCourseExam/PdfInstruction"));
const PdfTest = lazy(() => import("./pages/pdfCourseExam/PdfTest"));
const PdfOtherInstruction = lazy(() => import("./pages/pdfCourseExam/PdfOtherinstruction"));
const PdfExamSolution = lazy(() => import("./pages/pdfCourseExam/PdfExamSolution"));
const PdfExamResultPage = lazy(() => import("./pages/pdfCourseExam/PdfExamResultPage"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const ErrorReport = lazy(() => import("./pages/user/ErrorReport"));
const Refund_policy = lazy(() => import("./components/Refund_policy"));
const HomeLivetest = lazy(() => import("./components/LiveMockTest/HomeLivetest"));
const Livemockinstruction = lazy(() => import("./components/LiveMockTest/Livemockinstruction"));
const Livemockotherinstruct = lazy(() => import("./components/LiveMockTest/Livemockotherinstruct"));
const Livemocktest = lazy(() => import("./components/LiveMockTest/Livemocktest"));
const Homeliveresult = lazy(() => import("./components/LiveMockTest/Homeliveresult"));
const HomeLiveSolution = lazy(() => import("./components/LiveMockTest/HomeLiveSolution"));
const HomeLiveResultPage = lazy(() => import("./components/LiveMockTest/HomeLiveResult2"));

const Onesignal = (user) => {
  if (typeof window === "undefined") return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async function (OneSignal) {
    try {
      await OneSignal.init({
        appId: "d25c3e90-f22a-4283-afc2-02156b046e1f",
        notifyButton: {
          enable: true,
        },
      });

      const permission = await OneSignal.Notification.permission;
      if (permission !== "granted") {
        await OneSignal.showSlidedownPrompt();
      }

      if (user?.email) {
        await OneSignal.User.Email.set(user.email);
      }

      if (user?.phoneNumber) {
        await OneSignal.User.Tag.set("phone", user.phoneNumber);
      }
    } catch (error) {
      console.error("OneSignal initialization error:", error);
    }
  });
};

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

// Constants
const MOCK_TEST_ROUTES = [
  "/mocktest",
  "/mocklivetest",
  "/instruction",
  "/otherins",
  "/instruct",
  "/otherinstruct",
  "/mocksolution",
  "/livesolution",
  "/result",
  "/liveresult",
  "/pdf/instruction",
  "/pdf/otherinstruct",
  "/pdf/mocktest",
  "/pdf/result",
  "/pdf/mocksolution",
  "/homeliveinstruct",
  "/homeliveotherinstruct",
  "/homelivemocktest",
  "/homeSolution",
  "/HomeliveresultPage"
];

const CACHE_KEYS = {
  MODAL_SHOWN_DATE: "modalShownDate",
  MODAL_FIRST_TIME: "abcmodal123",
  USER_DATA_SUBMITTED: "userDataSubmitted",
  MODAL_DATA: "modalDataCache"
};

// Modal component
const Modal = ({ imageSrc, isLoading, onClose, onImageLoad }) => (
  <div className="modal fade show d-flex align-items-center justify-content-center"
    tabIndex="-1"
    role="dialog"
    style={{ 
      backgroundColor: "rgba(0,0,0,0.5)", 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body p-4">
          <div className="d-flex justify-content-center align-items-center">
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <img
                src={imageSrc}
                alt="Special Offer"
                className="img-fluid rounded"
                onLoad={onImageLoad}
                style={{ maxHeight: "70vh", objectFit: "contain" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

function MainApp() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Check if it's a mock test route
  const isMockTestRoute = useMemo(() => 
    MOCK_TEST_ROUTES.some((path) => location.pathname.startsWith(path)),
    [location.pathname]
  );

  // OneSignal initialization
  useEffect(() => {
    if (user) {
      Onesignal(user);
    }
  }, [user]);

  // Get today's date string
  const today = useMemo(() => new Date().toDateString(), []);

  // Fetch modal data
  const fetchModalData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await Api.get("/models");
      const data = response.data;
      
      let photoUrl = null;
      if (Array.isArray(data) && data.length > 0) {
        photoUrl = data[0].photo;
      } else if (data?.photo) {
        photoUrl = data.photo;
      }
      
      if (photoUrl) {
        setModalData(photoUrl);
        localStorage.setItem(CACHE_KEYS.MODAL_SHOWN_DATE, today);
      }
    } catch (error) {
      console.error("Error fetching modal data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [today]);

  // Handle modal display logic - FIXED
  useEffect(() => {
    // Only show modal on home page
    if (location.pathname !== "/") {
      return;
    }

    const modalShownDate = localStorage.getItem(CACHE_KEYS.MODAL_SHOWN_DATE);
    const isFirstTime = !localStorage.getItem(CACHE_KEYS.MODAL_FIRST_TIME);

    // Show modal if it's the first time OR if not shown today
    if (isFirstTime || modalShownDate !== today) {
      localStorage.setItem(CACHE_KEYS.MODAL_FIRST_TIME, "shown");
      fetchModalData();
      setShowModal(true);
    }
  }, [location.pathname, today, fetchModalData]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalData(null);
  }, []);

  // User data modal logic
  useEffect(() => {
    if (!user || localStorage.getItem(CACHE_KEYS.USER_DATA_SUBMITTED)) return;

    const isMissingData = !user.phoneNumber || !user.state;

    const timer = setTimeout(() => {
      if (isMissingData) {
        setShowUserModal(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  // Close user modal and set submitted flag
  const handleUserModalSuccess = useCallback(() => {
    setShowUserModal(false);
    localStorage.setItem(CACHE_KEYS.USER_DATA_SUBMITTED, "true");
  }, []);

  // Routes configuration
  const routes = useMemo(() => [
    // Protected routes
    { path: "/mocktest/:id/:userId", element: <Test />, protected: true },
    { path: "/instruction/:id/:userId", element: <Instruction />, protected: true },
    { path: "/otherinstruct/:id/:userId", element: <Otherinstruction />, protected: true },
    { path: "/mocksolution/:id/:userId", element: <Mocksolution />, protected: true },
    { path: "/result/:id/:userId", element: <ResultPage />, protected: true },
    { path: "/resultanalysis/:userId", element: <Resultanalysis />, protected: true },
    { path: "/mocklivetest/:id/:userId", element: <MockLiveTest />, protected: true },
    { path: "/instruct/:id/:userId", element: <Instruct />, protected: true },
    { path: "/otherins/:id/:userId", element: <OtherInstruct />, protected: true },
    { path: "/liveresult/:id/:userId", element: <LiveResult />, protected: true },
    { path: "/livesolution/:id/:userId", element: <LiveSolution />, protected: true },

    // PDF protected routes
    { path: "/pdf/instruction/:id/:userId", element: <PdfInstruction />, protected: true },
    { path: "/pdf/mocktest/:id/:userId", element: <PdfTest />, protected: true },
    { path: "/pdf/otherinstruct/:id/:userId", element: <PdfOtherInstruction />, protected: true },
    { path: "/pdf/result/:id/:userId", element: <PdfExamResultPage />, protected: true },
    { path: "/pdf/mocksolution/:id/:userId", element: <PdfExamSolution />, protected: true },

    // Home live test protected routes
    { path: "/homeliveinstruct/:id/:userId", element: <Livemockinstruction />, protected: true },
    { path: "/homeliveotherinstruct/:id/:userId", element: <Livemockotherinstruct />, protected: true },
    { path: "/homelivemocktest/:id/:userId", element: <Livemocktest />, protected: true },
    { path: "/homeliveresult/:id", element: <Homeliveresult />, protected: true },
    { path: "/homeSolution/:id/:userId", element: <HomeLiveSolution />, protected: true },
    { path: "/HomeliveresultPage/:id/:userId", element: <HomeLiveResultPage />, protected: true },

    // Public routes
    { path: "/", element: <Home /> },
    { path: "/sigin", element: <SignIn /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/free-pdf", element: <Free_pdf /> },
    { path: "/subscriptions", element: <TestSeries /> },
    { path: "/rally-pro", element: <Rally_pro /> },
    { path: "/rally-super-pro", element: <Rallysuper_Pro /> },
    { path: "/top-trending-exams/:id", element: <Packagename /> },
    { path: "/refund-policy", element: <Refund_policy /> },
    { path: "/privacy-policy", element: <Privacy_Policy /> },
    { path: "/TermsConditions", element: <Terms_Condition /> },
    { path: "/contactus", element: <ContactUs /> },
    { path: "/blog", element: <Blog /> },
    { path: "/blogdetails/:link", element: <Subblog /> },
    { path: "/livetest/:link", element: <DetailedCategorie /> },
    { path: "/pdf-course", element: <PdfCourseHome /> },
    { path: "/pdf-course/:level", element: <PdfCourse /> },
    { path: "/video-course", element: <VideoCourse /> },
    { path: "/All-Packages", element: <Packages /> },
    { path: "/homelivetest", element: <HomeLivetest /> },
    { path: "*", element: <NotFound /> },

    // Sign-in special route
    { 
      path: "/sign-in", 
      element: (
        <div className="d-flex align-items-center justify-content-center min-vh-90">
          <SignIn />
        </div>
      ) 
    },
  ], []);

  const profileRoutes = useMemo(() => [
    { path: "/profile", element: <Profile /> },
    { path: "/profile/recent-test-results", element: <RecentTestResults /> },
    { path: "/profile/purchase-history", element: <PurchaseHistory /> },
    { path: "/profile/order-history", element: <OrderHIstory /> },
    { path: "/profile/refer-and-earn", element: <ReferAndEarn /> },
    { path: "/profile/active-devices-browser", element: <ActiveDevicesBrowser /> },
    { path: "/profile/error-report", element: <ErrorReport /> },
  ], []);

  return (
    <>
      {/* Header and Navbar - hidden for mock test routes */}
      {!isMockTestRoute && (
        <>
          <Header />
          <NavBar />
        </>
      )}

      {/* Main Modal - FIXED: Now shows only when modalData exists */}
      {showModal && modalData && (
        <Modal
          imageSrc={modalData}
          isLoading={isLoading}
          onClose={handleCloseModal}
          onImageLoad={handleImageLoad}
        />
      )}

      <ScrollToTop />

      {/* Routes */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Profile routes */}
          {profileRoutes.map((route, idx) => (
            <Route
              key={`profile-${idx}`}
              path={route.path}
              element={
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}

          {/* Main routes */}
          {routes.map((route, idx) => (
            <Route
              key={`route-${idx}`}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute>
                    {route.element}
                  </ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Routes>
      </Suspense>

      {/* User Data Popup Modal */}
      {showUserModal && user && (
        <PopupModal
          showModal={showUserModal}
          setShowModal={setShowUserModal}
          onSuccess={handleUserModalSuccess}
        />
      )}

      {/* Footer - hidden for mock test routes */}
      {!isMockTestRoute && <Footer />}
      
      <ScrollToTopButton showButton={!isMockTestRoute} />
    </>
  );
}

export default App;