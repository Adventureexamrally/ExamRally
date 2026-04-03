import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../service/Api";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RallySuper_pro from "../components/subscription/RallySuper_pro";

const Rallysuper_Pro = () => {
  const [seo, setSeo] = useState([])
  const [ad, setAD] = useState([])


  useEffect(() => {
    run();
  }, []);



  async function run() {
    try {


      const response2 = await Api.get(`/get-Specific-page/rally-super-pro`);
      setSeo(response2.data);
      console.log(response2.data);

      const response3 = await Api.get(`/blog-Ad/getbypage/rally-super-pro`);
      setAD(response3.data)
      console.log(response3.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }




  return (
    <>
      <Helmet>
        <title>{seo[0]?.seoData?.title || "Rally Super Pro – Ultimate Bank Exam Package | ExamRally"}</title>
        <meta name="description" content={seo[0]?.seoData?.description || "Get ExamRally Rally Super Pro for unlimited mock tests, PDF courses, video courses and complete exam preparation for SBI, IBPS & RBI."} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords || "rally super pro, bank exam package, unlimited mock tests, SBI IBPS combo"} />
        <link rel="canonical" href={seo[0]?.seoData?.canonical || "https://examrally.in/rally-super-pro"} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ExamRally" />
        <meta property="og:url" content={seo[0]?.seoData?.canonical || "https://examrally.in/rally-super-pro"} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle || seo[0]?.seoData?.title || "Rally Super Pro"} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription || seo[0]?.seoData?.description || "Ultimate bank exam preparation package."} />
        <meta property="og:image" content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo[0]?.seoData?.ogTitle || seo[0]?.seoData?.title || "Rally Super Pro"} />
        <meta name="twitter:description" content={seo[0]?.seoData?.ogDescription || seo[0]?.seoData?.description || "Ultimate bank exam preparation package."} />
        <meta name="twitter:image" content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"} />
      </Helmet>
      <div className="flex">

        <div className={`container w-full ${ad.length > 0 ? "md:w-4/5" : "md:full "}`}>
<RallySuper_pro/>
         
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

  );
};

export default Rallysuper_Pro;
