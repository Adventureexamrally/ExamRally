import { useState, useEffect } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxSize, setBoxSize] = useState(400); // Default size for medium screens

  // Custom size state
  const [customWidth, setCustomWidth] = useState(450); // Default custom width
  const [customHeight, setCustomHeight] = useState(250); // Default custom height

  // Responsive box size handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBoxSize(250); // Small screens (mobile)
      } else if (window.innerWidth < 1024) {
        setBoxSize(350); // Medium screens (tablet)
      } else {
        setBoxSize(450); // Large screens (desktop)
      }
    };

    handleResize(); // Set size on load
    window.addEventListener("resize", handleResize); // Listen for window resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to go to the previous video
  const prevVideo = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? youtubeVideos.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next video
  const nextVideo = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === youtubeVideos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the indexes of previous and next videos
  const prevIndex =
    currentIndex === 0 ? youtubeVideos.length - 1 : currentIndex - 1;
  const nextIndex =
    currentIndex === youtubeVideos.length - 1 ? 0 : currentIndex + 1;

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
    <div className="relative flex justify-center items-center w-full  py-4 rounded-lg">
      {/* Video Container */}
      <div className="relative flex items-center w-[90%] justify-center">
        {/* Show full screen video on mobile */}
        {boxSize === 250 ? (
          <div
            className="relative z-10 transition-transform duration-300 mx-2"
            style={{
              width: `${customWidth}px`,
              height: `${customHeight}px`,
            }}
          >
            <iframe
              className="w-full h-full rounded-lg shadow-xl"
              src={youtubeVideos[currentIndex].link.replace("watch?v=", "embed/")}
              title="Current Video"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {/* Previous Video (Left) */}
            <div
              className="relative opacity-70 scale-90 transition-transform duration-300 mx-2"
              style={{
                width: `${customWidth * 0.8}px`,
                height: `${customHeight * 0.8}px`,
              }}
            >
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={youtubeVideos[prevIndex].link.replace("watch?v=", "embed/")}
                title="Previous Video"
                allowFullScreen
              />
            </div>

            {/* Current Video (Center) */}
            <div
              className="relative z-10 transition-transform duration-300 mx-2"
              style={{
                width: `${customWidth}px`,
                height: `${customHeight}px`,
              }}
            >
              <iframe
                className="w-full h-full rounded-lg shadow-xl"
                src={youtubeVideos[currentIndex].link.replace(
                  "watch?v=",
                  "embed/"
                )}
                title="Current Video"
                allowFullScreen
              />
            </div>

            {/* Next Video (Right) */}
            <div
              className="relative opacity-70 scale-90 transition-transform duration-300 mx-2"
              style={{
                width: `${customWidth * 0.8}px`,
                height: `${customHeight * 0.8}px`,
              }}
            >
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={youtubeVideos[nextIndex].link.replace("watch?v=", "embed/")}
                title="Next Video"
                allowFullScreen
              />
            </div>
          </>
        )}
      </div>

      {/* Left Navigation Button */}
      <button
  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white 
  bg-black opacity-50 hover:opacity-100 p-3 rounded-full transition 
  duration-300 ease-in-out hover:scale-110 z-50 md:z-10"
  onClick={prevVideo}
>
  <i className="bi bi-caret-left-fill text-white"></i>
</button>

{/* Right Navigation Button */}
<button
  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white 
  bg-black opacity-50 hover:opacity-100 p-3 rounded-full transition 
  duration-300 ease-in-out hover:scale-110 z-50 md:z-10"
  onClick={nextVideo}
>
  <i className="bi bi-caret-right-fill"></i>
</button>

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
