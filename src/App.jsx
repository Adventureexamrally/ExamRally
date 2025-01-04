import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BankExam from "./pages/BankExam";
import MockTestPage from "./pages/MockTestPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Header />
      <NavBar />
      <Dashboard />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bankexam" element={<BankExam />} />
        <Route path="/mocktest" element={<MockTestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
