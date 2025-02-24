import React from "react";
import { Link } from "react-router-dom";
import sbi from "../assets/logo/sbi.png";
import ibps from "../assets/logo/ibps.png";
import {
  Calculate as CalculateIcon,
  Psychology as PsychologyIcon,
  MenuBook as MenuBookIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  AccountBalance as AccountBalanceIcon,
  LibraryBooks as LibraryBooksIcon,
  Speed as SpeedIcon,
  HelpOutline as HelpOutlineIcon,
  Quiz as QuizIcon,
  PictureAsPdf as PictureAsPdfIcon,
  EventNote as EventNoteIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Celebration as CelebrationIcon,
  EmojiEvents as EmojiEventsIcon,
  Forum as ForumIcon,
  MailOutline as MailOutlineIcon,
} from "@mui/icons-material";

const Examimglist = () => {
  const exams = [
    { name: "RRB PO", image: ibps, link: "/rrb-po" },
    { name: "RRB Clerk", image: ibps, link: "/rrb-clerk" },
    { name: "IBPS Clerk", image: ibps, link: "/ibps-clerk" },
    { name: "IBPS PO", image: ibps, link: "/ibps-po" },
    { name: "SBI Clerk", image: sbi, link: "/sbi-clerk" },
    { name: "SBI PO", image: sbi, link: "/sbi-po" },
  ];

  const topics = [
    { name: "Quantitative Aptitude", icon: <CalculateIcon />, link: "/quantitativeapti" },
    { name: "Reasoning Ability", icon: <PsychologyIcon />, link: "/reasoningability" },
    { name: "English Language", icon: <MenuBookIcon />, link: "/englishlang" },
    { name: "Current Affairs", icon: <PublicIcon />, link: "/currentaffairs" },
    { name: "Computer Awareness", icon: <ComputerIcon />, link: "/computerawareness" },
    { name: "Banking Awareness", icon: <AccountBalanceIcon />, link: "/bankingawareness" },
    { name: "Static GK", icon: <LibraryBooksIcon />, link: "/staticgk" },
    { name: "Insurance Awareness", icon: <QuizIcon />, link: "/insuranceawareness" },
  ];

  const mockTests = [
    { name: "Previous Year Papers", icon: <SpeedIcon />, link: "/previouspaper" },
    { name: "Hard Level Reasoning", icon: <HelpOutlineIcon />, link: "/hardlevelreasoning" },
    { name: "Hard Level Quants", icon: <HelpOutlineIcon />, link: "/hardlevelquants" },
    { name: "Hard Level English", icon: <EventNoteIcon />, link: "/hardlevelenglish" },
    { name: "Descriptive", icon: <PictureAsPdfIcon />, link: "/descriptive" },
    { name: "Critical Reasoning", icon: <LibraryBooksIcon />, link: "/criticalreasoning" },
  ];

  const extras = [
    { name: "Hindu Editorial", icon: <StarIcon />, link: "/hindueditorial" },
    { name: "Interview Prep", icon: <DiamondIcon />, link: "#" },
    { name: "Success Stories", icon: <CelebrationIcon />, link: "#" },
    { name: "Special Mocks", icon: <EmojiEventsIcon />, link: "#" },
    { name: "GD", icon: <ForumIcon />, link: "#" },
    { name: "Email & Precis Writing", icon: <MailOutlineIcon />, link: "#" },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        {[...topics, ...mockTests, ...extras].map((item, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 shadow-lg">
            <Link
              to={item.link}
              className="d-flex flex-column align-items-center text-green-500 justify-content-center p-3 rounded text-decoration-none"
              style={{
                height: "120px",
                transition: "0.3s",
                textAlign: "center",
              }}
            >
              {React.cloneElement(item.icon, { fontSize: "large" })}
              <span className="text-sm font-weight-bold mt-2 text-gray-800">{item.name}</span>
            </Link>
          </div>
        ))}

        {exams.map((exam, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 shadow-lg text-center">
            <Link
              to={exam.link}
              className="d-flex flex-column align-items-center justify-content-center  p-3 rounded text-decoration-none"
              style={{
                height: "120px",
                transition: "0.3s",
                textAlign: "center",
              }}
            >
              <img
                src={exam.image}
                alt={exam.name}
                className="img-fluid"
                style={{ width: "80px", height: "80px" }}
              />
              <span className="d-block mt-2 font-weight-bold text-gray-800">{exam.name}</span>
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-5 font">
    <p>
        If you are preparing for <span className="text-green-500 font fw-bold">IBPS PO</span>, <span className="text-green-500 font fw-bold">IBPS Clerk</span>, <span className="text-green-500 font fw-bold">RRB PO</span>, <span className="text-green-500 font fw-bold">RRB Clerk</span>, <span className="text-green-500 font fw-bold">SBI PO</span>, <span className="text-green-500 font fw-bold">SBI Clerk</span>, and other <span className="text-green-500 font fw-bold">bank</span> and <span className="text-green-500 font fw-bold">insurance exams</span>, practicing with high-quality mock tests is essential to improve your speed, accuracy, and exam strategy. Our <span className="text-green-500 font fw-bold">Bank Exam Online Test Series</span> is designed as per the latest exam pattern and evolving difficulty levels, ensuring that you get the most realistic and exam-oriented practice experience.
    </p>
    <br />
    <p>
        We provide full-length <span className="text-green-500 font fw-bold">Prelims</span> and <span className="text-green-500 font fw-bold">Mains</span> mock tests for all major <span className="text-green-500 font fw-bold">IBPS</span>, <span className="text-green-500 font fw-bold">SBI</span>, and <span className="text-green-500 font fw-bold">RRB</span> bank exams, allowing candidates to simulate real exam conditions. These tests include:
    </p>
    <br />
    <ul>
        <li><span className="text-green-500 font fw-bold">IBPS PO Prelims & Mains Mock Tests</span></li>
        <li><span className="text-green-500 font fw-bold">IBPS Clerk Prelims & Mains Mock Tests</span></li>
        <li><span className="text-green-500 font fw-bold">RRB PO Prelims & Mains Mock Tests</span></li>
        <li><span className="text-green-500 font fw-bold">RRB Clerk Prelims & Mains Mock Tests</span></li>
        <li><span className="text-green-500 font fw-bold">SBI PO Prelims & Mains Mock Tests</span></li>
        <li><span className="text-green-500 font fw-bold">SBI Clerk Prelims & Mains Mock Tests</span></li>
        <li><span className="text-green-500 font fw-bold">Other Bank & Insurance Exam Test Series</span></li>
    </ul>
    <br />
    <p>
        Each Question is carefully prepared to match the latest pattern and question trends, helping you get familiar with new question types, difficulty levels, and time constraints.
    </p>
    <br />
    <h1 className="text-2xl font-semibold">Topic-Wise & Sectional Tests for Targeted Practice</h1>
    <br />
    <p>
        Apart from full-length tests, we offer topic-wise and sectional tests for focused preparation in specific areas. These include:
    </p>
    <ul>
        <li><span className="text-green-500 font fw-bold">Quantitative Aptitude</span> (All topics: Arithmetic, DI, Number Series, etc.)</li>
        <li><span className="text-green-500 font fw-bold">Reasoning Ability</span> (Puzzles, Seating Arrangement, Syllogism, etc.)</li>
        <li><span className="text-green-500 font fw-bold">English Language</span> (Reading Comprehension, Grammar, Vocabulary, etc.)</li>
        <li><span className="text-green-500 font fw-bold">Current Affairs</span> (Daily & Monthly CA for Bank Exams)</li>
        <li><span className="text-green-500 font fw-bold">Banking Awareness</span> (Latest Banking & Financial News)</li>
        <li><span className="text-green-500 font fw-bold">Computer Awareness</span> (Fundamentals, MS Office, Networking, etc.)</li>
        <li><span className="text-green-500 font fw-bold">Static GK</span> (Important Facts, Capitals, National Parks, etc.)</li>
        <li><span className="text-green-500 font fw-bold">Hard-Level Quants, Reasoning & English for High-Scorers</span></li>
    </ul>
    <br />
    <h1 className="text-2xl font-semibold">These tests are structured to strengthen weak areas, improve time management, and enhance overall performance in the actual exam.</h1>
    <h2 className="text-xl font-semibold">Previous Year Papers & Exam-Pattern Based Questions</h2>
    <br />
    <ul>
        <li>✔️ Familiarize you with the types of questions asked in past exams</li>
        <li>✔️ Help you analyze difficulty levels</li>
        <li>✔️ Improve your problem-solving skills by revising real exam questions</li>
    </ul>
    <br />
    <h2 className="text-xl font-semibold">Interview, Group Discussion & Critical Reasoning Preparation</h2>
    <p>
        Cracking the written exam is just the first step; our Bank Exam Test Series also provides exclusive study materials for <span className="text-green-500 font fw-bold">interviews</span>, <span className="text-green-500 font fw-bold">group discussions (GD)</span>, and <span className="text-green-500 font fw-bold">critical reasoning</span> to help you clear the final selection process with confidence.
    </p><br />

    <h2 className="text-xl font-semibold">Free Online Mock Interview for Candidates Who Clear Mains</h2>
    <ul>
        <li>✔️ <span className="text-green-500 font fw-bold">Real Bank Interview Experience</span> – Get a one-on-one interview experience that simulates actual bank interviews.</li>
        <li>✔️ <span className="text-green-500 font fw-bold">Expert Panel Evaluation</span> – Your interview will be conducted by banking professionals and experts.</li>
        <li>✔️ <span className="text-green-500 font fw-bold">Personalized Feedback</span> – Receive detailed insights and suggestions to improve your answers, communication, and confidence.</li>
        <li>✔️ <span className="text-green-500 font fw-bold">Exclusive for Test Series Subscribers</span> – If you purchase our Bank Exam Test Series, you get this mock interview at no extra cost.</li>
    </ul>
    <br />
    <h2 className="text-xl font-semibold">
        This mock interview program ensures that students who clear Mains have a competitive edge in the final selection process, helping them crack the real bank interview with confidence.
    </h2>
    <br />
    <p className="font-semibold">Key Features of Our Bank Exam Test Series</p>
    <ul>
        <li><span className="text-green-500 font fw-bold">Real Exam Interface</span>: Our tests provide an interface similar to the actual IBPS, SBI & RRB exams for a hassle-free experience.</li>
        <li><span className="text-green-500 font fw-bold">Detailed Explanations</span>: Every question comes with a step-by-step solution to help you understand concepts better.</li>
        <li><span className="text-green-500 font fw-bold">Performance Analysis</span>: Get detailed reports on accuracy, speed, and time management to track your progress.</li>
        <li><span className="text-green-500 font fw-bold">All India Ranking</span>: Compare your performance with thousands of aspirants across India.</li>
        <li><span className="text-green-500 font fw-bold">Accessible Anytime, Anywhere</span>: Practice online at your convenience.</li>
    </ul>
    <br />
    <h1 className="text-2xl font-semibold">Why Choose Examrally Bank Exam Test Series?</h1>
    <ul>
        <li>• Designed by experts based on the latest exam trends</li>
        <li>• Covers all question types and difficulty levels</li>
        <li>• Helps develop the right exam strategy</li>
        <li>• Boosts confidence through real exam-like practice</li>
        <li>• Ensures comprehensive coverage of all subjects</li>
        <li>• <span className="text-green-500 font fw-bold">Free Online Mock Interview</span></li>
    </ul>
    <br />
    <h2 className="text-xl font-semibold">Start Practicing Today!</h2>
    <p>
        With structured mock tests, topic-wise quizzes, and expert-designed study materials, our <span className="text-green-500 font fw-bold">Bank Exam Online Test Series</span> will help you maximize your score and crack the exam on your first attempt. Take the next step in your preparation and start practicing today!
    </p>
</section>

    </div>
  );
};

export default Examimglist;
