import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/404/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Test from "./pages/Test";
import Instruction from "./components/Instruction";
import Otherinstruction from "./components/Otherinstruction";
import Privacy_Policy from "./components/Privacy_Policy";
import Terms_Condition from "./components/Terms_Condition";
import Rally_pro from "./pages/Rally_pro";
import Rallysuper_Pro from "./pages/Rallysuper_Pro";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Packagename from "./components/Packagename";
import ResultPage from "./components/ResultPage";
import jaiib from "../src/assets/logo/offer.jpg";
import { useState, useEffect, useContext } from "react";
import Resultanalysis from "./components/Resultanalysis";
import Mocksolution from "./components/Mocksolution";
import Subblog from "./pages/blog/Subblog";
import DetailedCategorie from "./components/LiveTest/DetailedCategorie";
import Free_pdf from "./pages/Free_pdf";
import VideoCourse from "./pages/VideoCourse";
import Profile from "./pages/user/Profile";
import ActiveDevicesBrowser from "./pages/user/ActiveDevicesBrowser";
import OrderHIstory from "./pages/user/OrderHIstory";
import PurchaseHistory from "./pages/user/PurchaseHistory";
import RecentTestResults from "./pages/user/RecentTestResults";
import ReferAndEarn from "./pages/user/ReferAndEarn";
import Packages from "./pages/Packages";
import Blog from "./pages/blog/Blog";
import TestSeries from "./pages/TestSeries";
import AllArch from "./components/AllArch";
import PdfCourse from "./pages/pdfCourse/PdfCourse";
import PdfCourseHome from "./pages/pdfCourse/PdfCourseHome";
import Instruct from "./components/LiveTest/Instruct";
import OtherInstruct from "./components/LiveTest/OtherInstruct";
import MockLiveTest from "./components/LiveTest/MockLiveTest";
import LiveResult from "./components/LiveTest/LiveResult";
import LiveSolution from "./components/LiveTest/LiveSolution";
import PdfInstruction from "./pages/pdfCourseExam/PdfInstruction";
import PdfTest from "./pages/pdfCourseExam/PdfTest";
import PdfOtherInstruction from "./pages/pdfCourseExam/PdfOtherinstruction";
import PdfExamSolution from "./pages/pdfCourseExam/PdfExamSolution";
import PdfExamResultPage from "./pages/pdfCourseExam/PdfExamResultPage";
import ScrollToTop from "./components/ScrollToTop";
import ContactUs from "./components/ContactUs";
import Coupon from "./pages/Coupon";
import ErrorReport from "./pages/user/ErrorReport";
import ProtectedRoute from "./components/ProtectedRoute";
import Refund_policy from "./components/Refund_policy";
import ScrollToTopButton from "./ScrollToTopButton";
import PopupModal from "./components/PopupModal";
import { useUser } from "@clerk/clerk-react";
import { UserContext } from "./context/UserProvider";
import Api from "./service/Api";
import { fetchUtcNow } from "./service/timeApi";
import HomeLivetest from "./components/LiveMockTest/HomeLivetest";
import Livemockinstruction from "./components/LiveMockTest/Livemockinstruction";
import Livemockotherinstruct from "./components/LiveMockTest/Livemockotherinstruct";
import Livemocktest from "./components/LiveMockTest/Livemocktest";
import Homeliveresult from "./components/LiveMockTest/Homeliveresult";
import HomeLiveSolution from "./components/LiveMockTest/HomeLiveSolution";

const Onesignal = (user) => {
  if (typeof window === "undefined" || !window.OneSignalDeferred) return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async function (OneSignal) {
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
      await OneSignal.setEmail(user.email);
    }

    if (user?.phoneNumber) {
      await OneSignal.sendTags({ phone: user.phoneNumber });
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

function MainApp() {
  const { user } = useContext(UserContext);

  const location = useLocation();
  const [showModalji, setShowModalji] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasUserSubmittedData = localStorage.getItem("userDataSubmitted");
  const [utcNow, setUtcNow] = useState(null);
  const [Today, setToday] = useState(null);
    useEffect(() => {
    if (user) {
      Onesignal(user);
    }
  }, [user]); 
  // Fetch UTC time from server
  useEffect(() => {
    fetchUtcNow()
      .then((globalDate) => {
        setUtcNow(globalDate);
        const serverDateStr = globalDate.toISOString().split("T")[0];
        setToday(serverDateStr);
        console.warn("Server UTC Date:", serverDateStr);
      })
      .catch((error) => {
        console.error("Failed to fetch UTC time:", error);
      });
  }, [Today]);

  // Show modal logic - runs only when 'Today' is set
  useEffect(() => {
    if (!Today) return; // Wait for Today to be initialized

    const modalInfo = localStorage.getItem("modalShownDate");

    // If it's not shown today
    if (modalInfo !== Today) {
      Api.get("/models")
        .then((response) => {
          const data = response.data;
          console.warn(data);

          if (Array.isArray(data) && data.length > 0) {
            console.warn(data[0].photo);
            setShowModalji(data[0].photo);
            localStorage.setItem("modalShownDate", Today);
          } else if (data && data.photo) {
            setShowModalji(data.photo);
            localStorage.setItem("modalShownDate", Today);
          }
        })
        .catch(() => {
          console.log("Error fetching photo");
        });
    }
  }, [Today]); // Dependency is 'Today' from server

  useEffect(() => {
    if (location.pathname === "/") {
      setShowModalji(true);
    } else {
      setShowModalji(false);
    }
  }, [location.pathname]);

  const isMockTestRoute = [
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
  ].some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    const hasModalBeenShown = localStorage.getItem("abcmodal123");
    if (!hasModalBeenShown && location.pathname === "/") {
      setShowModalji(true);
      localStorage.setItem("abcmodal123", "pair");
    } else {
      setShowModalji(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (showModalji) {
      setIsLoading(true); // ✅ When modal opens, start loading
    }
  }, [showModalji]);

  useEffect(() => {
    if (user && !hasUserSubmittedData) {
      // Check if phoneNumber & state are missing
      const isMissingData = !user.phoneNumber || !user.state;

      const timer = setTimeout(() => {
        // Only show if data is missing AND not submitted before
        setShowModal(isMissingData);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, hasUserSubmittedData]);
  return (
    <>
      {/* Conditionally render Header and NavBar for routes other than "/mock-test" */}
      {!isMockTestRoute && (
        <>
          <Header />
          <NavBar />
        </>
      )}
      {/* Modal */}
      {showModalji && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close text-sm"
                  onClick={() => setShowModalji(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="flex items-center justify-center">
                  {isLoading && (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      // style={{ height: '100vh' }} // Full viewport height
                    >
                      <div
                        className="spinner-border text-green-500 fw-bold "
                        role="status"
                        style={{ width: "3rem", height: "3rem" }}
                      ></div>
                    </div>
                  )}

                  <img
                    src={showModalji}
                    alt="Mock Test"
                    className={`img-fluid ${isLoading ? "hidden" : ""}`}
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollToTop />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/mocktest/:id/:userId" element={<Test />} />
          <Route path="/instruction/:id/:userId" element={<Instruction />} />
          <Route
            path="/otherinstruct/:id/:userId"
            element={<Otherinstruction />}
          />
          <Route path="/mocksolution/:id/:userId" element={<Mocksolution />} />
          <Route path="/result/:id/:userId" element={<ResultPage />} />
          <Route path="/resultanalysis/:userId" element={<Resultanalysis />} />

          {/*  live test routes */}

          <Route path="/mocklivetest/:id/:userId" element={<MockLiveTest />} />
          <Route path="/instruct/:id/:userId" element={<Instruct />} />
          <Route path="/otherins/:id/:userId" element={<OtherInstruct />} />
          <Route path="/liveresult/:id/:userId" element={<LiveResult />} />
          <Route path="/livesolution/:id/:userId" element={<LiveSolution />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/sigin" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/free-pdf" element={<Free_pdf />} />
        <Route path="/subscriptions" element={<TestSeries />} />
        <Route path="/rally-pro" element={<Rally_pro />} />
        <Route path="/rally-super-pro" element={<Rallysuper_Pro />} />
        <Route path="/top-trending-exams/:id" element={<Packagename />} />
        <Route path="/refund-policy" element={<Refund_policy />} />
        <Route path="/privacy-policy" element={<Privacy_Policy />} />
        <Route path="/TermsConditions" element={<Terms_Condition />} />
        <Route path="/contactus" element={<ContactUs />} />

        {/* Only render Test component without Header and Footer */}

        {/* Catch-all route for non-existent pages */}

        <Route path="/blog" element={<Blog />} />
        <Route path="/blogdetails/:link" element={<Subblog />} />

        <Route path="/livetest/:link" element={<DetailedCategorie />} />
        <Route path="/pdf-course" element={<PdfCourseHome />} />
        <Route path="/pdf-course/:level" element={<PdfCourse />} />

        <Route path="/video-course" element={<VideoCourse />} />
        <Route path="/pdf" element={<ProtectedRoute />}>
          <Route path="instruction/:id/:userId" element={<PdfInstruction />} />
          <Route path="mocktest/:id/:userId" element={<PdfTest />} />
          <Route
            path="otherinstruct/:id/:userId"
            element={<PdfOtherInstruction />}
          />
          {/* Only render Test component without Header and Footer */}
          <Route path="result/:id/:userId" element={<PdfExamResultPage />} />
          {/* Catch-all route for non-existent pages */}
          {/* <Route path="/resultanalysis" element={<Resultanalysis />} /> */}

          <Route
            path="mocksolution/:id/:userId"
            element={<PdfExamSolution />}
          />
        </Route>

        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="recent-test-results" element={<RecentTestResults />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
          <Route path="order-history" element={<OrderHIstory />} />
          <Route path="refer-and-earn" element={<ReferAndEarn />} />
          <Route
            path="active-devices-browser"
            element={<ActiveDevicesBrowser />}
          />
          <Route path="error-report" element={<ErrorReport />} />
        </Route>

        <Route path="/All-Packages" element={<Packages />} />
        {/* <Route path="/All-Archivers" element={<AllArch />} /> */}

        <Route path="/homelivetest" element={<HomeLivetest />} />
        <Route
          path="/homeliveinstruct/:id/:userId"
          element={<Livemockinstruction />}
        />
        <Route
          path="/homeliveotherinstruct/:id/:userId"
          element={<Livemockotherinstruct />}
        />
        <Route
          path="/homelivemocktest/:id/:userId"
          element={<Livemocktest />}
        />
        <Route path="/homeliveresult/:id" element={<Homeliveresult />} />
        <Route
          path="/homeSolution/:id/:userId"
          element={<HomeLiveSolution />}
        />

        <Route path="*" element={<NotFound />} />
        <Route
          path="/sign-in"
          element={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "90vh", // Full screen height
              }}
            >
              <SignIn />
            </div>
          }
        />
      </Routes>
      {showModal && user && (
        <PopupModal
          showModal={showModal}
          setShowModal={setShowModal}
          onSuccess={() => localStorage.setItem("userDataSubmitted", "true")}
        />
      )}

      {/* Conditionally render Footer for routes other than "/mock-test" */}
      {!isMockTestRoute && <Footer />}
      <ScrollToTopButton showButton={!isMockTestRoute} />
    </>
  );
}

export default App;
