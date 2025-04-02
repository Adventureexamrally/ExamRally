import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BankExam from "./pages/BankExam";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import TestSeries from "./components/TestSeries";
import Dashboard from "./components/Dashboard";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Test from "./pages/Test";
import QuantiativeApti from "./components/QuantitativeApti";
import ReasoningAbility from "./components/ReasoningAbility";
import Englishlang from "./components/Englishlang";
import ComputerAwarness from "./components/ComputerAwarness";
import Staticgk from "./components/Staticgk";
import BankingAwarness from "./components/BankingAwarness";
import InsuranceAwarness from "./components/InsuranceAwarness";
import CurrentAffairs from "./components/CurrentAffairs";
import PrviousPaper from "./components/PrviousPaper";
import HardlevQuants from "./components/HardlevQuants";
import HardlevEng from "./components/HardlevEng";
import Despcriptive from "./components/Descriptive";
import CriticalReason from "./components/CriticalReason";
import HinduEdu from "./components/HinduEdu";
import Rrb_Po from "./components/Rrb_Po";
import Rrb_Clerk from "./components/Rrb_Clerk";
import Ibps_Clerk from "./components/Ibps_Clerk";
import Ibps_Po from "./components/Ibps_Po";
import Instruction from "./components/Instruction";
import Otherinstruction from "./components/Otherinstruction";
import HardlevelReasoning from "./components/HardlevelReasoning";
import Privacy_Policy from "./components/Privacy_Policy";
import Terms_Condition from "./components/Terms_Condition";
import Sbi_clerk from "./components/Sbi_clerk";
import Rally_pro from "./components/Rally_pro";
import Rallysuper_Pro from "./components/Rallysuper_Pro";
import Sbi_po from "./components/Sbi_po";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Packagename from "./components/Packagename";
import Free_pdf from "./components/Free_pdf";
import ResultPage from "./components/ResultPage";
import jaiib from '../src/assets/logo/offer.jpg'
import { useState,useEffect } from "react";
import Resultanalysis from "./components/Resultanalysis";
import Mocksolution from "./components/Mocksolution";
import Blog from "./components/Blog";
import Subblog from "./components/Subblog";
import DetailedCategorie from "./components/DetailedCategorie";

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
  const isMockTestRoute = ["/mocktest", "/instruction", "/otherinstruct"].some((path) =>
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bankexam" element={<BankExam />} />
        <Route path="/reasoningability" element={<ReasoningAbility />} />
        <Route path="/englishlang" element={<Englishlang />} />
        <Route path="/sigin" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/free-pdf" element={<Free_pdf/>} />
        <Route path="/subscriptions" element={<TestSeries />} />
        <Route path="/rally-pro" element={<Rally_pro />} />
        <Route path="/rally-super-pro" element={<Rallysuper_Pro />} />
        <Route path="/quantitativeapti" element={<QuantiativeApti />} />
        <Route path="/computerawarness" element={<ComputerAwarness />} />
        <Route path="/bankingawarness" element={<BankingAwarness />} />
        <Route path="/staticgk" element={<Staticgk />} />
        <Route path="/insuranceawarness" element={<InsuranceAwarness />} />
        <Route path="/currentaffairs" element={<CurrentAffairs />} />
        <Route path="/previouspaper" element={<PrviousPaper />} />
        <Route path="/hardlevelquants" element={<HardlevQuants />} />
        <Route path="/hardleveng" element={<HardlevEng />} />
        <Route path="/descriptive" element={<Despcriptive />} />
        <Route path="/criticalreason" element={<CriticalReason />} />
        <Route path="/hinduedutorial" element={<HinduEdu />} />
        {/* <Route path="/rrb-po" element={<Rrb_Po />} /> */}
        {/* <Route path="/rrb-clerk" element={<Rrb_Clerk />} /> */}
        {/* <Route path="/ibps-clerk" element={<Ibps_Clerk />} /> */}
        <Route path="/top-trending-exams/:id" element={<Packagename />} />
        <Route path="/mocktest/:id" element={<Test />} />
        {/* <Route path="/ibps-po" element={<Ibps_Po />} /> */}
        {/* <Route path="/sbi-clerk" element={<Sbi_clerk />} /> */}
        {/* <Route path="/sbi-po" element={<Sbi_po />} /> */}
        <Route path="/instruction/:id" element={<Instruction />} />
        <Route path="/otherinstruct/:id" element={<Otherinstruction />} />
        <Route path="/hardlevelreasoning" element={<HardlevelReasoning />} />
        <Route path="/privacy-policy" element={<Privacy_Policy />} />
        <Route path="/terms-condition" element={<Terms_Condition />} />
        
        {/* Only render Test component without Header and Footer */}
        <Route path="/result/:id" element={<ResultPage />} />
        {/* Catch-all route for non-existent pages */}
        <Route path="/resultanalysis" element={<Resultanalysis />} />

        <Route path='/mocksolution' element={<Mocksolution/>} />

        <Route path="/livebatch" element={<Blog/>}/>
        <Route path="/blogdetails/:id" element={<Subblog/>}/>

        <Route path="/livetest/:link" element={<DetailedCategorie/>}/>


        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Conditionally render Footer for routes other than "/mock-test" */}
      {!isMockTestRoute && <Footer />}
    </>
  );
}

export default App;
