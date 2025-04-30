
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Api from '../../service/Api';
import { Helmet } from 'react-helmet';

// const VITE_APP_API_BASE_URL=import.meta.env.VITE_APP_API_BASE_URL

const Subblog = () => {
    const { link } = useParams();
    const [blogDetails, setBlogDetails] = useState([])
    const [blogAd, setBlogAd] = useState([]);
  const [seo, setSeo] = useState([]);


    useEffect(() => {
        run();
    }, [link])

    async function run() {
        try {
            const response = await Api.get(`blogs/get/${link}`);
            console.log(response.data);
            setBlogDetails(response.data);

            const ad = await Api.get(`blog-Ad/getbypage/${link}`);
            setBlogAd(ad.data);

            const response3 = await Api.get(`/get-Specific-page/${link}`);
            setSeo(response3.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        };
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
       
        <div className='flex'>
            {blogDetails.map((blogDetails) => (
                <>
                    <div className='container w-full md:w-4/5'>
                        <div className='mt-4'>
                            <h2
                                className="text-3xl font-semibold text-green-700  m-1"
                                dangerouslySetInnerHTML={{ __html: blogDetails.title }}
                            />

                            <div className="flex items-center space-x-2 m-2">
                                <span className="text-gray-500 text-sm"> <i className="bi bi-bell-fill"></i> {new Date(blogDetails.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        {blogDetails.photo && <img src={blogDetails.photo} alt="no photo found" className='max-h-60' />}

                        <p
                            className="text-md font-semibold text-gray-800 m-2"
                            dangerouslySetInnerHTML={{ __html: blogDetails.description }}
                        />
                        <div className='m-3'>

                            {blogDetails.subtitles && blogDetails.subtitles.length > 0 ? (
                                blogDetails.subtitles.map((item, index) => (
                                    <div key={item._id || index}>
                                        <h2
                                            className=""
                                            dangerouslySetInnerHTML={{ __html: item.subtitle }}
                                        />
                                        <p
                                            className=""
                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No subtitles available</p>
                            )}

                        </div>
                    </div>

                    {blogAd.length > 0 &&
                        <div className="w-1/5 hidden md:block">
                            <div>

                                {blogAd.map((item) => (
                                    <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'>
                                        <Link to={item.link_name}>
                                            <img src={item.photo} alt="Not Found" className='rounded-md' /></Link >
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </>
            ))}
        </div>
        </>
    )
}

export default Subblog
