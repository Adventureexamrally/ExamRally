import React, { useState, useEffect, useContext, useCallback, useMemo, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
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

// Import frequently used components directly
import Home from "./pages/Home";
import NotFound from "./pages/404/NotFound";
import Test from "./pages/Test";
import Instruction from "./components/Instruction";
import Otherinstruction from "./components/Otherinstruction";
import Mocksolution from "./components/Mocksolution";
import ResultPage from "./components/ResultPage";
import Resultanalysis from "./components/Resultanalysis";

// Lazy load less frequently used components
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

const LOCAL_STORAGE_KEYS = {
  MODAL_SHOWN_DATE: "modalShownDate",
  MODAL_FIRST_TIME: "abcmodal123",
  USER_DATA_SUBMITTED: "userDataSubmitted",
};

// OneSignal initialization


// Modal Component
const DailyModal = ({ imageUrl, isLoading, onClose, onImageLoad }) => (
  <div
    className="modal fade show d-flex align-items-center justify-content-center"
    tabIndex="-1"
    role="dialog"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      zIndex: 9999,
    }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header border-0">
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          />
        </div>
        <div className="modal-body p-4">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="Daily Offer"
              className="img-fluid w-100 rounded shadow"
              onLoad={onImageLoad}
              style={{ maxHeight: "70vh", objectFit: "contain" }}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <MainApp />
      </Suspense>
    </Router>
  );
}

function MainApp() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  
  const [dailyModalData, setDailyModalData] = useState(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [isDailyModalLoading, setIsDailyModalLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);

  // Check if current route is a mock test route
  const isMockTestRoute = useMemo(() =>
    MOCK_TEST_ROUTES.some((path) => location.pathname.startsWith(path)),
    [location.pathname]
  );
  const initializeOneSignal = useCallback((user) => {
  if (typeof window === "undefined" || !window.OneSignalDeferred) return;

  window.OneSignalDeferred.push(async function (OneSignal) {
    try {
      await OneSignal.init({
        appId: "d25c3e90-f22a-4283-afc2-02156b046e1f",
        notifyButton: { enable: true },
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
}, []);

  // Initialize OneSignal
  useEffect(() => {
    if (user) {
      initializeOneSignal(user);
    }
  }, [user, initializeOneSignal]);

  // Get today's date for modal tracking
  const today = useMemo(() => new Date().toDateString(), []);

  // Fetch daily modal data
  const fetchDailyModalData = useCallback(async () => {
    try {
      setIsDailyModalLoading(true);
      const response = await Api.get("/models");
      const data = response.data;
      
      let photoUrl = null;
      if (Array.isArray(data) && data.length > 0) {
        photoUrl = data[0].photo;
      } else if (data?.photo) {
        photoUrl = data.photo;
      }
      
      if (photoUrl) {
        setDailyModalData(photoUrl);
      }
    } catch (error) {
      console.error("Error fetching daily modal data:", error);
      setDailyModalData(null);
    } finally {
      setIsDailyModalLoading(false);
    }
  }, []);

  // Handle daily modal logic - FIXED VERSION
  useEffect(() => {
    // Only show modal on home page
    if (location.pathname !== "/") {
      setShowDailyModal(false);
      return;
    }

    const modalShownDate = localStorage.getItem(LOCAL_STORAGE_KEYS.MODAL_SHOWN_DATE);
    const isFirstTime = !localStorage.getItem(LOCAL_STORAGE_KEYS.MODAL_FIRST_TIME);

    // Show modal if:
    // 1. It's the first time user visits OR
    // 2. Modal hasn't been shown today
    if (isFirstTime || modalShownDate !== today) {
      // Set flags first to prevent multiple calls
      if (isFirstTime) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.MODAL_FIRST_TIME, "shown");
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.MODAL_SHOWN_DATE, today);
      
      // Fetch and show modal
      fetchDailyModalData();
      setShowDailyModal(true);
    }
  }, [location.pathname, today, fetchDailyModalData]);

  // Handle user data modal
  useEffect(() => {
    if (!user || localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA_SUBMITTED)) {
      return;
    }

    const isMissingData = !user.phoneNumber || !user.state;
    if (!isMissingData) return;

    const timer = setTimeout(() => {
      setShowUserModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  // Event handlers
  const handleDailyModalClose = useCallback(() => {
    setShowDailyModal(false);
    setDailyModalData(null);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsDailyModalLoading(false);
  }, []);

  const handleUserModalSuccess = useCallback(() => {
    setShowUserModal(false);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA_SUBMITTED, "true");
  }, []);

  // Route configurations
  const protectedRoutes = useMemo(() => [
    { path: "/mocktest/:id/:userId", element: <Test /> },
    { path: "/instruction/:id/:userId", element: <Instruction /> },
    { path: "/otherinstruct/:id/:userId", element: <Otherinstruction /> },
    { path: "/mocksolution/:id/:userId", element: <Mocksolution /> },
    { path: "/result/:id/:userId", element: <ResultPage /> },
    { path: "/resultanalysis/:userId", element: <Resultanalysis /> },
    { path: "/mocklivetest/:id/:userId", element: <MockLiveTest /> },
    { path: "/instruct/:id/:userId", element: <Instruct /> },
    { path: "/otherins/:id/:userId", element: <OtherInstruct /> },
    { path: "/liveresult/:id/:userId", element: <LiveResult /> },
    { path: "/livesolution/:id/:userId", element: <LiveSolution /> },
    { path: "/pdf/instruction/:id/:userId", element: <PdfInstruction /> },
    { path: "/pdf/mocktest/:id/:userId", element: <PdfTest /> },
    { path: "/pdf/otherinstruct/:id/:userId", element: <PdfOtherInstruction /> },
    { path: "/pdf/result/:id/:userId", element: <PdfExamResultPage /> },
    { path: "/pdf/mocksolution/:id/:userId", element: <PdfExamSolution /> },
    { path: "/homeliveinstruct/:id/:userId", element: <Livemockinstruction /> },
    { path: "/homeliveotherinstruct/:id/:userId", element: <Livemockotherinstruct /> },
    { path: "/homelivemocktest/:id/:userId", element: <Livemocktest /> },
    { path: "/homeliveresult/:id", element: <Homeliveresult /> },
    { path: "/homeSolution/:id/:userId", element: <HomeLiveSolution /> },
    { path: "/HomeliveresultPage/:id/:userId", element: <HomeLiveResultPage /> },
  ], []);

  const publicRoutes = useMemo(() => [
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
      <Analytics />
      
      {/* Header and Navbar */}
      {!isMockTestRoute && (
        <>
          <Header />
          <NavBar />
        </>
      )}

      {/* Daily Offer Modal */}
      {showDailyModal && dailyModalData && (
        <DailyModal
          imageUrl={dailyModalData}
          isLoading={isDailyModalLoading}
          onClose={handleDailyModalClose}
          onImageLoad={handleImageLoad}
        />
      )}

      <ScrollToTop />

      {/* Routes */}
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((route, index) => (
            <Route key={`protected-${index}`} {...route} />
          ))}
        </Route>

        {/* Profile Routes */}
        <Route path="/profile">
          {profileRoutes.map((route, index) => (
            <Route key={`profile-${index}`} {...route} />
          ))}
        </Route>

        {/* Public Routes */}
        {publicRoutes.map((route, index) => (
          <Route key={`public-${index}`} {...route} />
        ))}

        {/* Special Sign-in Route */}
        <Route
          path="/sign-in"
          element={
            <div className="d-flex align-items-center justify-content-center min-vh-90">
              <SignIn />
            </div>
          }
        />
      </Routes>

      {/* User Data Popup Modal */}
      {showUserModal && user && (
        <PopupModal
          showModal={showUserModal}
          setShowModal={setShowUserModal}
          onSuccess={handleUserModalSuccess}
        />
      )}

      {/* Footer */}
      {!isMockTestRoute && <Footer />}
      
      <ScrollToTopButton showButton={!isMockTestRoute} />
    </>
  );
}

export default React.memo(App);