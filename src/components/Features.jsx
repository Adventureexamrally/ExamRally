import { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  PuzzlePieceIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import Api from "../service/Api";
import axios from "axios";

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

export default function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxSize, setBoxSize] = useState(400); // Default size for medium screens

  const [customWidth, setCustomWidth] = useState(450); // Default custom width
  const [customHeight, setCustomHeight] = useState(250); // Default custom height

  const [youtubeVideos, setYoutubeVideos] = useState([]); // To store the fetched videos

  // Fetch YouTube videos on component mount
  useEffect(() => {
   Api.get("uploads/videos")
      .then((response) => {
        setYoutubeVideos(response.data);
        console.log("Videos fetched:", response.data) // Assuming the API returns an array of video objects
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

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

  // Get the indexes of previous and next videos
  const prevIndex = currentIndex === 0 ? youtubeVideos.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === youtubeVideos.length - 1 ? 0 : currentIndex + 1;

  // Functions to navigate between videos
  const prevVideo = () => {
    setCurrentIndex(prevIndex);
  };

  const nextVideo = () => {
    setCurrentIndex(nextIndex);
  };

  // Helper function to safely get the video URL for embedding
  const getEmbedUrl = (video) => {
    if (video?.youtubeUrl && typeof video.youtubeUrl === 'string') {
      // If the URL is in the shortened form (youtu.be)
      if (video.youtubeUrl.includes('youtu.be')) {
        const videoId = video.youtubeUrl.split('/').pop().split('?')[0]; // Extract video ID
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // If the URL is the regular watch?v= form
      return video.youtubeUrl.replace("watch?v=", "embed/");
    }
    return ''; // Return an empty string if the link is not available or invalid
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    },500);
  }, []);
  

  return (
    <>
     {loading ? (
  <div className="p-6 mx-auto bg-gray-50 shadow-lg rounded-lg border text-center border-gray-300 bg-gradient-to-tr from-green-100 to-white">
    <h2 className="text-3xl font-bold text-blue-600">
      <span className="placeholder-glow">
        <span className="placeholder col-6 mx-auto"></span>
      </span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3].map((index) => (
        <div key={index} className="p-4 border rounded shadow bg-gray-200">
          <p className="placeholder-glow">
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-6 mx-auto"></span>
          </p>
        </div>
      ))}
    </div>

    <div className="text-center mt-6">
      <p className="text-lg font-semibold text-gray-700">
        <span className="placeholder-glow">
          <span className="placeholder col-8 mx-auto"></span>
        </span>
      </p>
    </div>
  </div>
) : (
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
)}

{loading ? (
  <div className="relative flex justify-center items-center w-full py-4 rounded-lg mb-36">
    <div className="relative flex items-center w-[90%] justify-center">
      <div className="text-center text-gray-500">
        <p className="placeholder-glow">
          <span className="placeholder col-6 mx-auto"></span>
        </p>
      </div>
    </div>
    <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black opacity-50 hover:opacity-100 p-3 rounded-full transition duration-300 ease-in-out hover:scale-110 z-50 md:z-10">
      <i className="bi bi-chevron-left"></i>
    </button>
    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black opacity-50 hover:opacity-100 p-3 rounded-full transition duration-300 ease-in-out hover:scale-110 z-50 md:z-10">
      <i className="bi bi-chevron-right"></i>
    </button>
  </div>
) : (
  <div className="relative flex justify-center items-center w-full py-4 rounded-lg mb-36">
    <div className="relative flex items-center w-[90%] justify-center">
      {youtubeVideos.length === 0 ? (
        <div className="text-center text-gray-500">Loading videos...</div>
      ) : (
        <>
          {boxSize === 250 ? (
            <div
              className="relative z-10 transition-transform duration-300 mx-2"
              style={{
                width: `${customWidth}px`,
                height: `${customHeight}px`,
              }}
            >
              <h1 className="h5 font">{youtubeVideos[currentIndex]?.title}</h1>
              <iframe
                className="w-full h-full rounded-lg shadow-xl"
                src={getEmbedUrl(youtubeVideos[currentIndex])}
                title="Current Video"
                allowFullScreen
              />
              <h1 className="p font p-3">{youtubeVideos[prevIndex]?.description}</h1>
            </div>
          ) : (
            <>
              <div
                className="relative opacity-70 scale-90 transition-transform duration-300 mx-2"
                style={{
                  width: `${customWidth * 0.8}px`,
                  height: `${customHeight * 0.8}px`,
                }}
              >
                <h1 className="h5 font">{youtubeVideos[prevIndex]?.title}</h1>
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src={getEmbedUrl(youtubeVideos[prevIndex])}
                  title="Previous Video"
                  allowFullScreen
                />
                <h1 className="p font p-3">{youtubeVideos[prevIndex]?.description}</h1>
              </div>

              <div
                className="relative z-10 transition-transform duration-300 mx-2"
                style={{
                  width: `${customWidth}px`,
                  height: `${customHeight}px`,
                }}
              >
                <h1 className="h5 font">{youtubeVideos[currentIndex]?.title}</h1>
                <iframe
                  className="w-full h-full rounded-lg shadow-xl"
                  src={getEmbedUrl(youtubeVideos[currentIndex])}
                  title="Current Video"
                  allowFullScreen
                />
                <h1 className="p font p-3">{youtubeVideos[prevIndex]?.description}</h1>
              </div>

              <div
                className="relative opacity-70 scale-90 transition-transform duration-300 mx-2"
                style={{
                  width: `${customWidth * 0.8}px`,
                  height: `${customHeight * 0.8}px`,
                }}
              >
                <h1 className="h5 font">{youtubeVideos[nextIndex]?.title}</h1>
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src={getEmbedUrl(youtubeVideos[nextIndex])}
                  title="Next Video"
                  allowFullScreen
                />
                <h1 className="p font p-3">{youtubeVideos[prevIndex]?.description}</h1>
              </div>
            </>
          )}
        </>
      )}
    </div>

    <button
      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black opacity-50 hover:opacity-100 p-3 rounded-full transition duration-300 ease-in-out hover:scale-110 z-50 md:z-10"
      onClick={prevVideo}
    >
      <i className="bi bi-chevron-left"></i>
    </button>

    <button
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black opacity-50 hover:opacity-100 p-3 rounded-full transition duration-300 ease-in-out hover:scale-110 z-50 md:z-10"
      onClick={nextVideo}
    >
      <i className="bi bi-chevron-right"></i>
    </button>
  </div>
)}
 

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
