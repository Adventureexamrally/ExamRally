import React from "react";

const Test_seriesFeature = ({ package: packagePrice, discountprize, text_1, text_2 }) => {
  return (
    <div>
      {/* Features List */}
      <div className="col-lg-12 my-3">
  <span className="text-black bg-white px-5 py-2 ml-2 rounded font fw-bold">Features</span>
</div>
     


      {/* Text Section */}
      <div className="text-center text-white fw-bold font mt-2">
  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
    {text_1 && (
      <li className="flex items-center gap-2">
        <span className="text-white text-lg font fw-bold">
        ✔ {text_1}
        </span>
      </li>
    )}
    {text_2 && (
      <li className="flex items-center gap-2">
        <span className="text-white text-lg font fw-bold">
        ✔ {text_2}
        </span>
      </li>
    )}

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
      <li key={index} className="flex items-center gap-2">
        <span className="text-white text-lg font fw-bold">✔ {item}</span>
      </li>
    ))}
  </ul>
</div>


      {/* Price Section */}
      <div className="text-center mb-3">
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
  );
};

export default Test_seriesFeature;
