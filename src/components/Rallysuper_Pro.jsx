import React from "react";
import Test_seriesFeature from "./Test_seriesFeature";

const Rallysuper_Pro = () => {
  const array = [
    "RRB PO",
    "RRB CLERK",
    "IBPS PO",
    "IBPS Clerk",
    "SBI PO",
    "SBI Clerk",
    "Topic wise Test",
    "Sectional Wise Test",
    "Hard Level Quants",
    "Hard Level Reasoning",
    "Hard Level English Tests",
    "Previous Year Papers",
    "Critical Reasoning Questions",
    "Full Access to Rally Speed Test",
    "Full Access to Descriptive Test",
    "Full Access to Computer Awareness",
    "Full Access to Banking Awareness",
    "Full Access to Static GK",
  ];

  const packagePrice = 1990; // Your package price
  const discountPrice = 299; // Your discounted price
const text_1="Free Online Mock Interview"
const text_2="Upcoming All Mock Test till May 2027"

  return (
    <div className="container border border-black mt-2 rounded-lg">
    <div className="text-center mt-2">
          <h1 className="font text-3xl  my-3 text-black fw-bold">
            Rally Super Pro
          </h1>
          <hr className="text-black-500 "/>
        </div>

        <div className="row bg-gradient-to-b from-green-500  to-green-900">
        <div className="col-lg-12 my-3">
            <span className="text-black bg-white px-5 py-2 ml-2 rounded font fw-bold">
              Exams Covered
            </span>
          </div>
          <div className="col-lg-12 my-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {array.map((item, index) => (
                <div key={index} className="rounded">
                  {/* Optional Image or Icon */}
                  <h5 className="text-center font">
                    <p className="text-white">✔ &nbsp; {item}</p>
                  </h5>
                </div>
              ))}
            </div>
            
          </div>

          <Test_seriesFeature package={packagePrice} discountprize={discountPrice} text_1={text_1} text_2={text_2}/>
  
      </div>
    </div>
  );
};

export default Rallysuper_Pro;
