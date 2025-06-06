import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import jaiib from '../src/assets/logo/offer.jpg'
import { useState, useEffect } from "react";
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




function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal when navigating to "/mocktest"
    if (location.pathname === "/") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [location.pathname]);
  // Check if the current route is "/mock-test"

  const isMockTestRoute = ["/mocktest","/mocklivetest", "/instruction","/otherins","/instruct", "/otherinstruct", "/mocksolution","/livesolution",  "/result", "/liveresult", "/pdf/instruction", "/pdf/otherinstruct", "/pdf/mocktest","/pdf/result","/pdf/mocksolution"].some((path) =>

    location.pathname.startsWith(path)
  );
  useEffect(() => {
    // Check if the modal has been shown before by looking into localStorage
    const hasModalBeenShown = localStorage.getItem("abcmodal123");

    // If not shown before and the current route is "/"
    if (!hasModalBeenShown && location.pathname === "/") {
      setShowModal(true);
      // Set the flag in localStorage so the modal won't show again
      localStorage.setItem("abcmodal123", "pair");
    } else {
      setShowModal(false);
    }
  }, [location.pathname]);
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
      {showModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", minHeight: "100vh" }} // Full-screen overlay
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">

                <button
                  type="button"
                  className="btn-close text-sm"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img src={jaiib} alt="Mock Test" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      )}
<ScrollToTop/>
      <Routes>
        <Route element={<ProtectedRoute />}> 
              <Route path="/mocktest/:id/:userId" element={<Test />} />
              <Route path="/instruction/:id/:userId" element={<Instruction />} />
              <Route path="/otherinstruct/:id/:userId" element={<Otherinstruction />} />
             <Route path='/mocksolution/:id/:userId' element={<Mocksolution />} />
              <Route path="/result/:id/:userId" element={<ResultPage />} />
                <Route path="/resultanalysis/:userId" element={<Resultanalysis />} />

{/*  live test routes */}

              <Route path="/mocklivetest/:id/:userId" element={<MockLiveTest />} />
              <Route path="/instruct/:id/:userId" element={<Instruct/>} />
              <Route path="/otherins/:id/:userId" element={<OtherInstruct/>} />
              <Route path="/liveresult/:id/:userId" element={<LiveResult />} />
              <Route path='/livesolution/:id/:userId' element={<LiveSolution />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/sigin" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/free-pdf" element={<Free_pdf />} />
        <Route path="/subscriptions" element={<TestSeries />} />
        <Route path="/rally-pro" element={<Rally_pro />} />
        <Route path="/rally-super-pro" element={<Rallysuper_Pro />} />
        <Route path="/top-trending-exams/:id" element={<Packagename />} />
        <Route path='/refund-policy' element={<Refund_policy/>}/>
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
          <Route path="otherinstruct/:id/:userId" element={<PdfOtherInstruction />} />
          {/* Only render Test component without Header and Footer */}
          <Route path="result/:id/:userId" element={<PdfExamResultPage />} />
          {/* Catch-all route for non-existent pages */}
          {/* <Route path="/resultanalysis" element={<Resultanalysis />} /> */}

          <Route path='mocksolution/:id/:userId' element={<PdfExamSolution />} />
        </Route>

        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="recent-test-results" element={<RecentTestResults />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
          <Route path="order-history" element={<OrderHIstory />} />
          <Route path="refer-and-earn" element={<ReferAndEarn />} />
          <Route path="active-devices-browser" element={<ActiveDevicesBrowser />} />
          <Route path="error-report" element={<ErrorReport />} />
        </Route>

        <Route path="/All-Packages" element={<Packages />} />
        {/* <Route path="/All-Archivers" element={<AllArch />} /> */}





        <Route path="*" element={<NotFound />} />
        <Route
          path="/sign-in"
          element={
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90vh", // Full screen height
            }}>
              <SignIn />
            </div>
          }
        />
      </Routes>

      {/* Conditionally render Footer for routes other than "/mock-test" */}
      {!isMockTestRoute && <Footer />}
    </>
  );
}

export default App;
