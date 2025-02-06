import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BankExam from "./pages/BankExam";
import MockTestPage from "./pages/MockTestPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import TestSeries from "./components/TestSeries";
import Dashboard from "./components/Dashboard";
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton, SignUp } from "@clerk/clerk-react";
import MockTest from "./components/MockTest";
import React from "react";
import Test from "./pages/Test";
import Mock from "./components/Mock";
import Exam from './pages/DemoExam'
import "./App.css"
import Test_redux from "./Test_redux";
import "bootstrap/dist/css/bootstrap.min.css";
import QuantiativeApti from "./components/QuantitativeApti";
import ReasoningAbility from "./components/ReasoningAbility";
import Englishlang from "./components/Englishlang";
import ComputerAwarness from "./components/ComputerAwarness";
import Staticgk from "./components/Staticgk";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}


function App() {
  return (
    <Router>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bankexam" element={<BankExam />} />
        <Route path="/mocktest" element={<Test />} />
        <Route path="/reasoningability" element={<ReasoningAbility/>}/>
        <Route path="/englishlang" element={<Englishlang/>}/>
        <Route path="/sigin" element={<SignIn />} />
        {/* <Route path="/sigup" element={<SignedIn/>} /> */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/subscriptions' element={<TestSeries/>}/>
        <Route path="/quantitativeapti" element={<QuantiativeApti/>}/>
        <Route path="/computerawarness" element={<ComputerAwarness/>}/>
        <Route path='/staticgk' element={<Staticgk/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <Exam /> */}
      <Footer />
      {/* <Test_redux /> */}
    </Router>
  );
}
export default App;
