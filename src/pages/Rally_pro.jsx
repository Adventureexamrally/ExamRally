import React, { useEffect, useState } from "react";
import Api from "../service/Api";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Rally_pro from "../components/subscription/Rally_pro";


const Rally_bro = () => {
  const [seo, setSeo] = useState([])
  const [ad, setAD] = useState([])

  useEffect(() => {
    run();
  }, []);


  async function run() {
    try {

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
        <div className={` m-2 w-full ${ad.length > 0 ? "md:w-4/5" : "md:full "}`}>
         <Rally_pro/>
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
