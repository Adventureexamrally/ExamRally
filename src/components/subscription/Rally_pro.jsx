import React, { useEffect, useState,useContext } from "react";
import Api from "../../service/Api";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from './../../context/UserProvider';
const Rally_pro = () => {
      const [sub, setSub] = useState(null); // Set initial state to null to avoid undefined errors
      const [responseId, setResponseId] = useState("");
    
      useEffect(() => {
        run();
      }, []);
    

      const { user } = useContext(UserContext);
    
      async function run() {
        try {
            const response = await Api.get(`subscription/getall/sub`);
            console.log(response.data);
      
            // Filter data based on subscriptionType
            const filtered = response.data.filter(sub => sub.subscriptionType.toLowerCase() === "rally pro".toLowerCase());
            console.log(filtered);
      
            setSub(filtered.length > 0 ? filtered[0] : null); // If there are results, use the first one
      
    
        
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        // Simulate data fetching
        setTimeout(() => {
            setLoading(false);
          }, 500);
      }, []);



  const navigate = useNavigate();
  // Extracting the package content and exams information


  const { isSignedIn } = useUser();
      
       const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            console.log(script.src);
            script.onload = () => {
              resolve(true);
            };
            script.onerror = () => {
              resolve(false);
            };
            document.body.appendChild(script);
          });
        };
      
        const paymentmeth = async (discountedAmount) => {
          console.log("Join Payment");
          try {
            console.log("Join Payment Inner");
            const res = await Api.post("/orders/orders", {
              amount: discountedAmount * 100,
              currency: "INR",
              receipt: `${user?.email}`, 
            payment_capture: 1
            });
            console.log("data show that ", res.data);
            console.log("Order response:", res.data);
      
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
              alert(
                "Failed to load Razorpay SDK. Please check your internet connection."
              );
              return;
            }
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: discountedAmount * 100,
              currency: "INR",
              name: sub?.subscriptionType,
              description: "Test Payment",
              handler: function (response) {
                setResponseId(response.razorpay_payment_id);
              },
              prefill: {
                name: user?.firstName,
                email: user?.email,
              },
              theme: {
                color: "#F4C430",
              },
              notes: {
                user_id: user?._id,
                course_id: sub?._id,
                courseName: sub?.subscriptionType,
              },
            };
      console.log("ji".options)
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            const rzp = new window.Razorpay(options);
            rzp.open();
      
            rzp.on("payment.failed", function (response) {
              console.error("Payment failed", response.error);
              alert("Payment failed. Please try again.");
            });
            console.log("ji".options)
          } catch (error) {
            console.error("Error during payment:", error);
            alert(error.message);
          }
        };
      
  return (
    <div className="container border border-black mt-2 rounded-lg">
    {loading ? (
      <div className="mt-3 bg-gray-100 p-4 rounded-lg"> {/* Added light gray background and padding */}
        <div className="text-center mt-2">
          <h1 className="font text-3xl my-3 text-gray-400 fw-bold placeholder-glow">
            <span className="placeholder col-6 mx-auto bg-gray-200"></span> {/* Added light gray to placeholder */}
          </h1>
          <hr className="text-gray-300" />
        </div>
        <div className="row bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg p-2"> {/* Modified gradient and added padding and rounded corners */}
          <div className="w-full h-64 bg-gray-200 mt-2 placeholder-glow">
            <span className="placeholder col-12"></span>
          </div>
          <div className="text-center mb-3">
            <p className="placeholder-glow">
              <span className="placeholder col-8 mx-auto bg-gray-200"></span> {/* Added light gray to placeholder */}
            </p>
            <div className="bg-gray-300 text-white rounded p-1 mb-2 placeholder-glow"> {/* Changed to lighter gray */}
              <span className="placeholder col-4 mx-auto"></span>
            </div>
            <p className="text-gray-400 font-bold h5 font placeholder-glow"> {/* Changed text color to lighter gray */}
              <span className="placeholder col-6 mx-auto bg-gray-200"></span> {/* Added light gray to placeholder */}
            </p>
            <div className="bg-gray-300 text-white px-3 py-1 font-bold rounded-full placeholder-glow"> {/* Changed to lighter gray */}
              <span className="placeholder col-4 mx-auto"></span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="mt-3">
        <div className="text-center mt-2">
          <h1 className="font text-3xl my-3 text-black fw-bold">Rally Pro</h1>
          <hr className="text-black-500" />
        </div>
        <div className="row bg-gradient-to-b from-green-500 to-green-900">
          {sub ? (
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
                <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full"  
                onClick={() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      paymentmeth(sub.discountedAmount);
    }
  }}>
                  ₹{sub.discountedAmount}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-white">
              No subscription found for Rally Pro.
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  )
}

export default Rally_pro
