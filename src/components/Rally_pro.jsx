import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../service/Api";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const VITE_APP_API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

const Rally_bro = () => {
  const [sub, setSub] = useState(null); // Set initial state to null to avoid undefined errors
  const [seo, setSeo] = useState([])
  const [ad, setAD] = useState([])

  useEffect(() => {
    run();
  }, []);


  async function run() {
    try {
      const response = await Api.get(`subscription/getall/sub`);
      console.log(response.data);

      // Filter data based on subscriptionType
      const filtered = response.data.filter(sub => sub.subscriptionType.toLowerCase() === "rally pro".toLowerCase());
      console.log(filtered);

      setSub(filtered.length > 0 ? filtered[0] : null); // If there are results, use the first one

      const response2 = await Api.get(`/get-Specific-page/rally-pro`);
      setSeo(response2.data);
      console.log(response2.data);

      const response3 = await Api.get(`/blog-Ad/getbypage/rally-pro`);
      setAD(response3.data)
      console.log(response3.data);
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
      <div className="flex container">
        <div  className={` m-2 w-full ${ad.length> 0 ? "md:w-4/5" : "md:full "}`}>
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
                    <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
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
      </div>
      {ad.length > 0 &&
          <div className="w-1/5 hidden md:block">
            <div>

              {ad.map((item) => (
                <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'>
                  <Link to={item.link_name}>
                    <img src={item.photo} alt="Not Found" className='rounded-md' /></Link >
                </div>
              ))}
            </div>
          </div>
        }
      </div>
      </>
    // <div className="container border border-black mt-2 rounded-lg">
    //   <div className="mt-3">
    //     <div className="text-center mt-2">
    //       <h1 className="font text-3xl my-3 text-black fw-bold">
    //         Rally Pro
    //       </h1>
    //       <hr className="text-black-500" />
    //     </div>
    //     <div className="row bg-gradient-to-b from-green-500 to-green-900">
    //       {sub ? ( // Check if sub is not null
    //         <>
    //           <img
    //             src={sub.photo}
    //             alt="Rally pro"
    //             className="w-full h-full object-cover mt-2"
    //           />
    //           <div className="text-center mb-3">
    //             <p>
    //               <del className="text-red-400 font">Package Price:</del>
    //             </p>
    //             <del className="bg-red-500 text-white rounded p-1 mb-2">
    //               ₹{sub.amount}
    //             </del>
    //             <p className="text-white font-bold h5 font">Discounted Price:</p>
    //             <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
    //               ₹{sub.discountedAmount}
    //             </button>
    //           </div>
    //         </>
    //       ) : (
    //         <div className="text-center text-white">
    //           No subscription found for Rally Pro.
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Rally_bro;
