import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Api from "../../service/Api";
import { Helmet } from "react-helmet";


// const VITE_APP_API_BASE_URL=import.meta.env.VITE_APP_API_BASE_URL

const Subblog = () => {
  const { link } = useParams();
  const [blogDetails, setBlogDetails] = useState([]);
  const [blogAd, setBlogAd] = useState([]);
  const [seo, setSeo] = useState([]);

  useEffect(() => {
    run();
  }, [link]);

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
        <meta
          property="og:description"
          content={seo[0]?.seoData?.ogDescription}
        />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
        {/* </>
                        ))} */}
      </Helmet>

      <div className="container flex">
        {blogDetails.map((blogDetails) => (
          <>
            <div className="container w-full md:w-4/5">
              <div className="mt-4">
                <h2
                  className="text-3xl font-semibold text-green-700  m-1"
                  dangerouslySetInnerHTML={{ __html: blogDetails.title }}
                />

                <div className="flex items-center space-x-2 m-2">
                  <span className="text-gray-500 text-sm">
                    {" "}
                    <i className="bi bi-bell-fill"></i>{" "}
                    {new Date(blogDetails.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {blogDetails.photo && (
                <img
                  src={blogDetails.photo}
                  alt="no photo found"
                  className="max-h-60"
                />
              )}

              <p
                className="text-md font-semibold text-gray-800 m-2"
                dangerouslySetInnerHTML={{ __html: blogDetails.description }}
              />
              <div className="m-3">
                {blogDetails.subtitles && blogDetails.subtitles.length > 0 ? (
                  blogDetails.subtitles.map((item, index) => (
                    <div key={item._id || index} className="mb-8">
                      {item.subtitle && (
                        <div
                          className="rich-table-wrapper"
                          dangerouslySetInnerHTML={{
                            __html: `
                   <style>
                     /* Table Structure */
                     .rich-table-wrapper table {
                       width: 100%;
                       border-collapse: collapse;
                       margin: 1.5rem 0;
                       border-radius: 8px;
                       overflow: hidden;
                       box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                     }

                     /* Header Styling (Bold + Blue) */
                     .rich-table-wrapper thead tr {
                       background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
                       color: white;
                       font-weight: 700; /* Bold */
                       text-transform: uppercase;
                       letter-spacing: 0.5px;
                     }

                     .rich-table-wrapper th {
                       padding: 14px 16px;
                       text-align: left;
                       border-right: 1px solid rgba(255,255,255,0.2);
                     }

                     .rich-table-wrapper th:last-child {
                       border-right: none;
                     }

                     /* Body Styling (Green Accents) */
                     .rich-table-wrapper tbody tr {
                       border-bottom: 1px solid #e2e8f0;
                       transition: all 0.2s ease;
                     }

                     .rich-table-wrapper tbody tr:nth-child(even) {
                       background-color: #f0fff4; /* Light green */
                     }

                     .rich-table-wrapper tbody tr:hover {
                       background-color: #ebf8ff; /* Light blue */
                     }

                     .rich-table-wrapper td {
                       padding: 12px 16px;
                       color: #2d3748;
                       border-right: 1px solid #e2e8f0;
                     }

                     .rich-table-wrapper td:last-child {
                       border-right: none;
                     }

                     /* Border Radius for First/Last Rows */
                     .rich-table-wrapper tr:first-child th:first-child {
                       border-top-left-radius: 8px;
                     }

                     .rich-table-wrapper tr:first-child th:last-child {
                       border-top-right-radius: 8px;
                     }

                     .rich-table-wrapper tr:last-child td:first-child {
                       border-bottom-left-radius: 8px;
                     }

                     .rich-table-wrapper tr:last-child td:last-child {
                       border-bottom-right-radius: 8px;
                     }
                   </style>
                   ${item.subtitle}
                 `,
                          }}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No subtitles available
                  </p>
                )}
              </div>
            </div>

            {blogAd.length > 0 && (
              <div className="w-1/5 hidden md:block">
                <div>
                  {blogAd.map((item) => (
                    <div className="m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300">
                      <Link to={item.link_name}>
                        <img
                          src={item.photo}
                          alt="Not Found"
                          className="rounded-md"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default Subblog;
