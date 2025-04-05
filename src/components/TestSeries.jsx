import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Rally_bro from "./Rally_pro";
import Rallysuper_Pro from "./Rallysuper_Pro";
import Examimglist from "./Examimglist";
import { ThreeDots } from "react-loader-spinner";
import Api from "../service/Api";
import { Helmet } from "react-helmet";

const data = {
  name: "Moct test Start Now!!",
  topic: "",
  questions: [
    { id: 1, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
    { id: 2, difficulty: "Moderate", ques: "10", marks: 5, time: "30 sec" },
    { id: 3, difficulty: "Difficult", ques: "10", marks: 5, time: "30 sec" },
    { id: 4, difficulty: "Moderate", ques: "10", marks: 5, time: "30 sec" },
    { id: 5, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
    { id: 6, difficulty: "Difficult", ques: "10", marks: 5, time: "30 sec" },
    { id: 7, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
    { id: 8, difficulty: "Moderate", ques: "10", marks: 5, time: "30 sec" },
    { id: 9, difficulty: "Difficult", ques: "10", marks: 5, time: "30 sec" },
    { id: 10, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
  ],
};

function TestSeries() {
  // State to track the visibility of difficulty for each question
  const [showDifficulty, setShowDifficulty] = useState(
    data.questions.reduce((acc, question) => {
      acc[question.id] = false; // initially difficulty is hidden
      return acc;
    }, {})
  );

  const [ad, setAD] = useState([])

  const [seo, setSeo] = useState([])


  useEffect(() => {
    run()
  }, []);
  async function run() {
    const response2 = await Api.get(`/get-Specific-page/subscriptions`);
    setSeo(response2.data);
    console.log(response2.data);

    const response3 = await Api.get(`/blog-Ad/getbypage/subscriptions`);
    setAD(response3.data)
    console.log(response3.data);
  }

  console.log(seo);
  // Toggle function to show/hide difficulty
  const toggleDifficulty = (questionId) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId], // toggle the visibility
    }));
  };


  const openNewWindow = (url) => {
    const width = screen.width;
    const height = screen.height;
    window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height}`);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);


  return (
    <>
      <Helmet>
        {/* { seo.length > 0 && seo.map((seo)=>(
                    <> */}
        <title>{seo[0]?.seoData?.title}</title>
        <meta name="description" content={seo[0]?.seoData?.description} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
        {/* </>
                ))} */}

      </Helmet>
      <div className="flex">
        <div className={`container mt-4 w-full ${ad.length> 0 ? "md:w-4/5" : "md:full "}`}>

          {loading ? (
            <div className="container">
              <p className="placeholder-glow bg-gray-200">
                <span className="placeholder col-12 text-center text-2xl font-bold mt-2 font text-white"></span>
              </p>
              <div className="row">
                <div className="col-md-6">
                  <div className="p-4 border rounded shadow bg-gray-200">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-6 mx-auto"></span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 border rounded shadow bg-gray-200">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-6 mx-auto"></span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-lg shadow-lg">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="bg-gray-200 border-1 shadow-xl rounded-lg p-4 flex flex-col justify-between relative mt-4 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105"
                  >
                    <p className="placeholder-glow">
                      <span className="placeholder col-8 mb-2 mx-auto"></span>
                      <span className="placeholder col-6 mb-2 mx-auto"></span>
                      <span className="placeholder col-6 mb-2 mx-auto"></span>
                      <span className="placeholder col-12 mb-2"></span>
                      <span className="placeholder col-12"></span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 border rounded shadow mt-4 bg-gray-200">
                <p className="placeholder-glow">
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-6 mx-auto"></span>
                </p>
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="text-center text-2xl font-bold mt-2 font bg-green-500 text-white">
                Most Accurate & Best Online Test Series for Bank Exams – Full-Length &amp;
                Topic-Wise Mock Tests
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Rally_bro />

                </div>
                <div className="col-md-6">

                  <Rallysuper_Pro />
                </div>
              </div>
              {/* <div className="from-indigo-300 to-teal-400">
      <div className="bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-lg shadow-lg">
        {data.questions.map((question) => (
          <div
            key={question.id}
            className={`bg-white border-1 shadow-xl rounded-lg p-4 flex flex-col justify-between relative mt-4 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105`}
          >
            <p className="mt-1 text-center text-gray-700">{data.topic}</p>

            <h3 className="text-2xl font-bold text-center text-gray-900 mt-1">
              Question {question.id}
            </h3>

            <div className="text-center">
{!showDifficulty[question.id] && (
  <button
    onClick={() => toggleDifficulty(question.id)}
    className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
    style={{backgroundColor:"#131656"}}
  >
    Show Level
  </button>
)}

{showDifficulty[question.id] && (
  <div
    className='mt-4 text-sm px-2 py-2 text-center text-white'
    style={{backgroundColor:"#131656"}}

  >
    <p>
      <strong>{question.difficulty}</strong>
    </p>
  </div>
)}
</div>
            <div className="flex justify-center items-center gap-4">
              <div className="flex flex-col items-center">
                <p>Quez</p>
                <p>{question.ques}</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Marks</p>
                <p>{question.marks}</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Time</p>
                <p>{question.time}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
{question.id === 1 ? (
  <Link>
    <button
      className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white"
      onClick={() => openNewWindow("/instruction")}
    >
      Start Now
    </button>
  </Link>
) : (
  <button
    className="py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white"
   
  >
   <i className="bi bi-lock-fill"></i> Buy Now
  </button>
)}
</div>


          </div>
        ))}
      </div>
    </div> */}

              <Examimglist />
            </div>
          )}

        </div>

        {/* Ad Section */}
        {ad.length > 0 && (
          <div className="w-1/5 hidden md:block">
           
              <>
                {ad.map((ad) => (
                  <div className="m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300" key={ad.id}>
                    <Link to={ad.link_name}>
                      <img src={ad.photo} alt="Ad" className="rounded-md" />
                    </Link>
                  </div>
                ))}
              </>
           
          </div>
        )}
      </div>
    </>
  );
}

export default TestSeries;
