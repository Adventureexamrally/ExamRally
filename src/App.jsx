import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BankExam from "./pages/BankExam";
import MockTestPage from "./pages/MockTestPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";
import {SignIn, SignedIn, SignedOut, SignInButton, UserButton,SignUp } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <Header />
      <NavBar />
     
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bankexam" element={<BankExam />} />
        <Route path="/mocktest" element={<MockTestPage />} />
        <Route path="/sigin" element={<SignIn/>} />
        {/* <Route path="/sigup" element={<SignedIn/>} /> */}

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
