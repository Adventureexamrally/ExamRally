import React from "react";

const Test_seriesFeature = ({ package: packagePrice, discountprize,text_1,text_2 }) => {
  return (
    <div>
      <div
        className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner hoverstyle"
        style={{
          backgroundImage: `radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
          radial-gradient(at 49%  30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
          radial-gradient(at 14%  26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
          radial-gradient(at 0%   64%, rgb( 11, 153, 41) 0px, transparent 85%),
          radial-gradient(at 41%  94%, rgb(34, 214, 109) 0px, transparent 85%),
          radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)`,
        }}
      >
        <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
        <div className="text-white flex justify-between">
          <span className="text-xl font-semibold mb-3 font">Features</span>
        </div>
        <hr className="border-t border-gray-600" />
        <ul className="space-y-2">
          {[
            "Complete package for Entire Bank exam Selection",
            "Exact Exam Level Questions",
            "Covered All major bank Exams",
            "Covered Prelims and Mains Exams",
            "New Pattern Questions",
            "Most Expected Questions pattern",
            "Free Online Mock Interview",
            "24*7 Access from Anywhere",
            "Detailed Explanation",
            "All India Ranking",
            "Performance Analysis",
            "Real Exam Interface",
            
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-2 font">
              <span className="flex justify-center items-center w-4 h-4 bg-green-500 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3 h-3 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <span className="text-white text-sm">{item}</span>
            </li>
          ))}
        </ul>
        <div className='text-center text-white fw-bold font mt-2'>
        {text_1 && (
  <h2>
    <i className="bi bi-star-fill"></i> {text_1}
  </h2>
)}
{text_2 && (
  <h2>
    <i className="bi bi-star-fill"></i> {text_2}
  </h2>
)}

        </div>

        <div className="text-center">
          <p>
            <del className="text-red-400 font">Package Price:</del>
          </p>
          <del className="bg-red-500 text-white rounded p-1 mb-2">
            ₹{packagePrice}
          </del>
          <p className="text-white font-bold h5 font">Discounted Price:</p>
          <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
            ₹{discountprize}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test_seriesFeature;
