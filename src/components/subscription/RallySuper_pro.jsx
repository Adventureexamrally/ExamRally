import React, { useEffect, useState } from "react";
import Api from "../../service/Api";

const RallySuper_pro = () => {
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
    
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        // Simulate data fetching
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }, []);
    
  return (
    <div className="container border border-black mt-2 rounded-lg">
    {loading ? (
      <div className="mt-3 bg-gray-100 p-4 rounded-lg"> {/* Mild gray background and padding */}
        <div className="text-center mt-2">
          <h1 className="font text-3xl my-3 text-gray-500 fw-bold placeholder-glow"> {/* Slightly darker text */}
            <span className="placeholder col-6 mx-auto bg-gray-200 rounded-md"></span> {/* Mild gray placeholder */}
          </h1>
          <hr className="border-gray-300" /> {/* Mild gray border */}
        </div>
        <div className="row bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg p-2"> {/* Mild gray gradient */}
          <div className="w-full h-64 bg-gray-200 mt-2 placeholder-glow rounded-md"> {/* Mild gray image placeholder */}
            <span className="placeholder col-12"></span>
          </div>
          <div className="text-center mb-3">
            <p className="placeholder-glow">
              <span className="placeholder col-8 mx-auto bg-gray-200 rounded-md"></span> {/* Mild gray paragraph placeholder */}
            </p>
            <div className="bg-gray-300 text-gray-600 rounded p-1 mb-2 placeholder-glow"> {/* Mild gray button background */}
              <span className="placeholder col-4 mx-auto"></span>
            </div>
            <p className="text-gray-600 font-bold h5 font placeholder-glow"> {/* Mild gray text */}
              <span className="placeholder col-6 mx-auto bg-gray-200 rounded-md"></span> {/* Mild gray paragraph placeholder */}
            </p>
            <div className="bg-gray-300 text-gray-600 px-3 py-1 font-bold rounded-full placeholder-glow"> {/* Mild gray button background */}
              <span className="placeholder col-4 mx-auto"></span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      // <div className="container border border-black mt-2 rounded-lg">
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
      // </div>
    )}
  </div>
  )
}

export default RallySuper_pro
