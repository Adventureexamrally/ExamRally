import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../service/Api";

const Rallysuper_Pro = () => {
  const [sub, setSub] = useState(null); // Set initial state to null to avoid undefined errors

  useEffect(() => {
    run();
  }, []);

  

  async function run() {
    try {
      const response = await Api.get(`subscription/getall/sub`);
      console.log(response.data);

      // Filter data based on subscriptionType
      const filtered = response.data.filter(sub => sub.subscriptionType.toLowerCase() === "rally super pro".toLowerCase());
      console.log(filtered);

      setSub(filtered.length > 0 ? filtered[0] : null); // If there are results, use the first one
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="container border border-black mt-2 rounded-lg">
      <div className="mt-3">
        <div className="text-center mt-2">
          <h1 className="font text-3xl my-3 text-black fw-bold">
            Rally Super Pro
          </h1>
          <hr className="text-black-500" />
        </div>
        <div className="row bg-gradient-to-b from-green-500 to-green-900">
          {sub ? ( // Check if sub is not null
            <>
              <img
                src={sub.photo}
                alt="Rally pro"
                className="w-full h-full object-cover mt-2"
              />
              <div className="text-center mb-3">
                <p>
                  <del className="text-red-400 font">Package Price:</del>
                </p>
                <del className="bg-red-500 text-white rounded p-1 mb-2">
                  ₹{sub.amount}
                </del>
                <p className="text-white font-bold h5 font">Discounted Price:</p>
                <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                  ₹{sub.discountedAmount}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-white">
              No subscription found for Rally super Pro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rallysuper_Pro;
