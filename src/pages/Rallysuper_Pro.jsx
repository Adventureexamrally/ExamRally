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
