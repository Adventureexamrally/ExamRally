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

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation(); // Now using useLocation inside a Router context

  // Check if the current route is "/mock-test"
  const isMockTestRoute = location.pathname === "/mocktest";

  return (
    <>
      {/* Conditionally render Header and NavBar for routes other than "/mock-test" */}
      {!isMockTestRoute && (
        <>
          <Header />
          <NavBar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bankexam" element={<BankExam />} />
        <Route path="/reasoningability" element={<ReasoningAbility />} />
        <Route path="/englishlang" element={<Englishlang />} />
        <Route path="/sigin" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
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
        {/* <Route path="/ibps-po" element={<Ibps_Po />} /> */}
        {/* <Route path="/sbi-clerk" element={<Sbi_clerk />} /> */}
        {/* <Route path="/sbi-po" element={<Sbi_po />} /> */}
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/otherinstruct" element={<Otherinstruction />} />
        <Route path="/hardlevelreasoning" element={<HardlevelReasoning />} />
        <Route path="/privacy-policy" element={<Privacy_Policy />} />
        <Route path="/terms-condition" element={<Terms_Condition />} />
        
        {/* Only render Test component without Header and Footer */}
        <Route path="/mocktest" element={<Test />} />
        
        {/* Catch-all route for non-existent pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Conditionally render Footer for routes other than "/mock-test" */}
      {!isMockTestRoute && <Footer />}
    </>
  );
}

export default App;
