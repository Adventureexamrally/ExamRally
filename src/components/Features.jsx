import { Link } from "react-router-dom";
import exam from "../assets/images/Exams-bro.svg";
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  PuzzlePieceIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    Src: AcademicCapIcon,
    title: "Real Exam Interface with Smart Questioning",
    description:
      "Experience the real exam environment with our cutting-edge interface. Our tests include a balanced mix of Easy, Moderate, and Hard level questions, ensuring you develop the confidence and skills needed to excel in actual bank exams.",
  },
  {
    Src: PuzzlePieceIcon,
    title: "Topic-Wise Mastery",
    description:
      "Sharpen your expertise with dedicated Topic Tests for Quantitative Aptitude, Reasoning, English, Computer Awareness, Banking Awareness, Static GK, and Insurance Awareness. Each test is designed to enhance conceptual clarity and depth, preparing you to tackle any question with ease.",
  },
  {
    Src: ClipboardDocumentCheckIcon,
    title: "Prelims & Mains Mock Tests",
    description:
      "Go beyond basic practice with Prelims and Mains Mock Tests that are carefully structured to match and slightly exceed the real exam difficulty. With our well-researched and exam-focused questions, you’ll be one step ahead in the competition.",
  },
  {
    Src: DocumentDuplicateIcon,
    title: "High-Level & New Pattern Questions",
    description:
      "Stay updated with the latest exam trends—our high-level questions mirror the most recent bank exams (2018–2025), including SBI Clerk 2025. We cover all major question models asked so far, ensuring you’re prepared for both expected and surprise patterns.",
  },
  {
    Src: CurrencyDollarIcon,
    title: "Budget-Friendly for Every Aspirant",
    description:
      "Quality preparation shouldn’t be expensive. At Examrally, we offer top-notch mock tests at a reasonable price, ensuring that every student gets access to the best resources without overspending.",
  },
  {
    Src: ChartBarIcon,
    title: "All India Performance Ranking",
    description:
      "Know where you stand among thousands of aspirants across India. Our detailed ranking system helps you assess your strengths, identify areas for improvement, and stay ahead in the competition.",
  },
];

const youtubeVideos = [
  { link: "https://www.youtube.com/watch?v=oCNw9WTGAfA" },
  { link: "https://www.youtube.com/watch?v=04oQstVfAIg" },
  { link: "https://www.youtube.com/watch?v=IjQH2BXKubc" },
  { link: "https://www.youtube.com/watch?v=Co5bY9JQc1o" },
  { link: "https://www.youtube.com/watch?v=cqmRUzETcoU" },
  { link: "https://www.youtube.com/watch?v=rmkBnnL3Lpw" },
  { link: "https://www.youtube.com/watch?v=OSN5VRD84EE" },


];

export default function Features() {
  return (
    <>
      <div className="p-6 mx-auto bg-gray-50 shadow-lg rounded-lg border text-center border-gray-300 bg-gradient-to-tr from-green-100 to-white">
        <h2 className="text-3xl font-bold text-blue-600">
          Why Choose Examrally?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              title={feature.title}
              description={feature.description}
              Src={feature.Src}
            />
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-lg font-semibold text-gray-700">
            🚀 Practice Smarter. Score Higher. Succeed Faster. 🚀
          </p>
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="mt-10 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Our Videos</h2>
          <a
            href="https://www.youtube.com/@examrally_banking"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {youtubeVideos.map((video, index) => (
            <iframe
              key={index}
              className="w-full rounded-lg shadow-lg"
              height="200"
              src={video.link.replace("watch?v=", "embed/")}
              title={`YouTube Video ${index + 1}`}
              allowFullScreen
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Feature({ title, description, Src }) {
  return (
    <div className="p-4 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center text-center bg-gradient-to-br from-green-200 to-blue-200 hover:scale-105 hover:shadow-lg transition-transform duration-300">
      {Src && <Src className="w-16 h-16 text-green-600" />}
      <h3 className="text-xl font-semibold text-gray-600 mt-4">{title}</h3>
      <p className="text-black mt-2">{description}</p>
    </div>
  );
}
