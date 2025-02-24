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
    <div className="container">
      <div className="text-center mt-2">
        <h1 className="font text-3xl bg-green-500 my-3 text-white">
          Rally Super Pro
        </h1>
      </div>

      <div className="row">
        <div className="col-md-9">
          <div className="row">
            {array.map((item, index) => (
              <div key={index} className="col-sm-12 col-md-3 col-lg-2">
                <div className=" rounded px-4 py-5">
                  <div className="card-body">
                    <h5 className="card-title text-center font">
                      <i className="bi bi-caret-right-fill text-green-500"></i>
                      {item}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-3">
          <Test_seriesFeature package={packagePrice} discountprize={discountPrice} text_1={text_1} text_2={text_2}/>
        </div>
      </div>
    </div>
  );
};

export default Rallysuper_Pro;
