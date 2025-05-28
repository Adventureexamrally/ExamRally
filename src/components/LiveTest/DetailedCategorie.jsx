import React, { useContext, useEffect, useState } from "react";

import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import CAmonth from "../CAmonth";
import { Helmet } from "react-helmet";
import { ImCheckmark2 } from "react-icons/im";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsQuestionSquare } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import LiveTestcategorieModel from "./LiveTestcategorieModel";
import LiveTestCategorieTopics from "./LiveTestCategorieTopics";
import Api from "../../service/Api";
import axios from "axios";

import { useUser } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";
import Coupon from "../../pages/Coupon";

const DetailedCategorie = () => {
  const [catDetail, setCatDetails] = useState([]);
  const { link } = useParams();
  const [amount, setAmount] = useState("");
  const [discountedAmount, setdiscountedAmount] = useState("");
  const [subMenuData, setSubMenuData] = useState([""]);
  const [sub, setSub] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [seo, setSeo] = useState([]);
  const [ad, setAD] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [payment, setPayment] = useState("");
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [showmodel,setshowmodel]=useState(false)
  
  console.log(link);

  useEffect(() => {
    run();
  }, [link, sub]);
  // console.log(subMenuData);
  useEffect(() => {
    if (subMenuData.length > 0 && activeSection === "") {
      setActiveSection(subMenuData[0]);
    }
  });
  const { user } = useContext(UserContext);
  console.log("iyhuj", user);
  async function run() {
    try {
      const response = await Api.get(`topic-test/test/${link}`);
      console.log("livetest", response.data);
      setFaqs(response.data.faqs)
      setData(response.data);
      setCatDetails(response.data.test_content);
      setSub(response.data.categorys);
      setAmount(response.data.amount);
      fetchSubMenus(response.data.categorys);
      setdiscountedAmount(response.data.discountedAmount);

      const response2 = await Api.get(`/get-Specific-page/${link}`);
      setSeo(response2.data);
      console.log(response2.data);

      const response3 = await Api.get(`/blog-Ad/getbypage/${link}`);
      setAD(response3.data);
      console.log(response3.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  console.log(activeSection);

  const fetchSubMenus = async (subLink) => {
    // setActiveSection(subLink);
    // setLoading(true);
    if (sub !== "") {
      try {
        const response = await Api.get(`topic-test/test-sub/${sub}`);
        console.log("subMenu data", response.data);
        setSubMenuData(response.data[0].submenus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sub-menu data:", error);
        setLoading(false);
        setSubMenuData([]);
      }
    }
  };

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       console.log(script.src);
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const paymentmeth = async (discountedAmount) => {
//     console.log("Join Payment");
//     try {
//       console.log("Join Payment Inner");
//       const res = await Api.post("/orders/orders", {
//         amount: discountedAmount * 100,
//         currency: "INR",
//         receipt: `${user?.email}`, 
//       payment_capture: 1
//       });
//       console.log("data show that ", res.data);
//       console.log("Order response:", res.data);

//       // Load Razorpay script
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         alert(
//           "Failed to load Razorpay SDK. Please check your internet connection."
//         );
//         return;
//       }
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: discountedAmount * 100,
//         currency: "INR",
//         name: sub,
//         description: "Test Payment",
//         handler: function (response) {
//           setResponseId(response.razorpay_payment_id);
//         },
//         prefill: {
//           name: user?.firstName,
//           email: user?.email,
//         },
//         theme: {
//           color: "#F4C430",
//         },
//         notes: {
//           user_id: user?._id,
//           course_id: data?._id,
//           courseName: data?.categorys,
//         },
//       };
// console.log("ji".options)
//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//       const rzp = new window.Razorpay(options);
//       rzp.open();

//       rzp.on("payment.failed", function (response) {
//         console.error("Payment failed", response.error);
//         alert("Payment failed. Please try again.");
//       });
//       console.log("ji".options)
//     } catch (error) {
//       console.error("Error during payment:", error);
//       alert(error.message);
//     }
//   };

  const navigate = useNavigate();
  const { isSignedIn } = useUser();
    const [activeIndex, setActiveIndex] = useState(null); // Track active index for opening and closing
    const handleAccordionToggle = (index) => {
      // Toggle the active index (open/close the panel)
      if (activeIndex === index) {
        setActiveIndex(null); // Close the panel if it's already open
      } else {
        setActiveIndex(index); // Open the panel if it's not open
      }
    };


   const [isEnrolled, setIsEnrolled] = useState(false);
    const status = true;
  useEffect(() => {
    const enrolled = user?.enrolledCourses?.some(course => {
      // Ensure expiryDate is a valid Date object
      const expireDate = new Date(course?.expiryDate);
  
      // Check if expiryDate is valid and in the future
      const isNotExpired = !isNaN(expireDate) && expireDate > new Date();
  
      // Check if user is enrolled in the course and if it's not expired
      return course?.courseId?.includes(data?._id) && isNotExpired;
    });
  
    setIsEnrolled(enrolled);
  }, [user, data]);
    
    console.log("check", user?.enrolledCourses);
    
    if (isEnrolled) {
      console.log("Hii");
    } else if (status) {
      console.log("bye");
    }


  return (
    <>
      {loading ? (
        <div className="container">
          <div className="row mt-3">
            <div className="col-md-9">
              <p className="placeholder-glow">
                <span className="placeholder col-12 mb-2 p-5 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
              </p>
            </div>
            <div className="col-md-3">
              <div className="relative flex flex-col p-4 w-full bg-gray-200 rounded-xl">
                <p className="placeholder-glow">
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-6 mx-auto rounded-md"></span>
                </p>
              </div>
            </div>
          </div>
          <div className="row p-3 bg-gray-100 rounded-lg mt-2">
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          {/* <h1 className="text-center fw-bold text-green-600">
                         {/* <PsychologyIcon fontSize="large" className="text-green-600 me-2" /> 
                            Reasoning Abilit
                                            y
                         </h1> */}

          <Helmet>
            <title>{seo[0]?.seoData?.title}</title>
            <meta name="description" content={seo[0]?.seoData?.description} />
            <meta name="keywords" content={seo[0]?.seoData?.keywords} />
            <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
            <meta
              property="og:description"
              content={seo[0]?.seoData?.ogDescription}
            />
            <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
          </Helmet>
          <div className="flex flex-col md:flex-row">
            <div className="container w-full md:w-4/5">
              <div className="row mt-3">
                <div className="staticheader">
                  <p className="font mt-2 h5 leading-8">
                    <h1
                      className="font font-bold "
                      dangerouslySetInnerHTML={{ __html: catDetail.title }}
                    ></h1>
                    <br />
                    <p
                      dangerouslySetInnerHTML={{
                        __html: catDetail.description,
                      }}
                    ></p>
                  </p>
                </div>
                {/* {catDetail?.sub_titles?.length > 0 && catDetail?.sub_titles?.map((sub) => (
                                    <div className=" staticheader">
                                        <p className="font mt-2 h5 leading-8">
                                            <h1 className="text-green-500 font font-bold " dangerouslySetInnerHTML={{ __html: sub.title }}></h1>
                                            <br />
                                            <p dangerouslySetInnerHTML={{ __html: sub.description }}></p>
                                        </p>
                                    </div>
                                ))} */}

                {/* Sidebar Buttons */}

                {link === "currentaffairs" ? (
                  <div>
                    <CAmonth />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-3">
                      {/* {subMenuData.length > 0 &&
                        subMenuData.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setActiveSection(sub)}
                            className={`btn w-100 mb-2 text-white ${activeSection === sub
                              ? "bg-[#131656] hover:bg-[#131656]"
                              : "bg-green-500 hover:bg-green-600"
                              }`}
                          >
                            {sub}
                          </button>
                        ))}
                    </div>
                    <div>
                      {activeSection && (
                        <div className="mt-3 bg-slate-50 py-2 px-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                            {data?.exams?.map((test, idx) => {
                              // If activeSection is "All" or matches the test's sub_menu, render the test
                              if (
                                test.topic_test?.sub_menu === activeSection
                              ) {
                                
                                return (
                                  <>
                                    {
                                         submenuTopics
                                          .filter((topic) => topic.name === test.topic_test?.topic) // Only show matching topics
                                          .map((topic) => (
                                          <div key={idx} className="">
                                            <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                                              <div className="card-body text-center flex flex-col justify-evenly">
                                                <h5 className="card-title font-semibold text-">
                                                  {topic.name}
                                                </h5>
                                                {/* Take Test / Lock Button 
                                                <button
                                                  className={`mt-3 py-2 px-4 rounded w-full transition ${test.status === "true"
                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                    : "border-1 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                                    }`}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#questionsModal"
                                                  onClick={() => setCurrentTopic(topic.name)}
                                                >
                                                  {test.status === "true" ? (
                                                    "view Question"
                                                  ) : (
                                                    <div className="flex items-center justify-center font-semibold gap-1">
                                                      <IoMdLock />
                                                      Lock
                                                    </div>
                                                  )}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                    }
                                  </>
                                );
                              }
                              return null; // Don't render if activeSection doesn't match
                            })}
                          </div>
                        </div>
                      )} */}

                      {subMenuData.length > 0 &&
                        subMenuData.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setActiveSection(sub)}
                            className={`btn w-100 mb-2 text-white ${
                              activeSection === sub
                                ? "bg-[#131656] hover:bg-[#131656]"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                    </div>
             
                    <LiveTestCategorieTopics
                      data={data}
                      activeSection={activeSection}
                      setCurrentTopic={setCurrentTopic}
                    />
                  </>
                )}

                {catDetail?.sub_titles?.length > 0 &&
                  catDetail?.sub_titles?.map((sub,index) => (
                    <div key={index} className="flex flex-col gap-3 flex-wrap py-2 bg-gray-50 px-2 my-3 shadow-lg">
                      <h1
               
                        className="my-2 p-3"
                        dangerouslySetInnerHTML={{ __html: sub.title }}
                      ></h1>

                      <p
                        className="my-2 p-3"
                        dangerouslySetInnerHTML={{ __html: sub.description }}
                      ></p>
                    </div>
                  ))}
              </div>
                            <h1 className="text-center fw-bold text-green-800 h4 font py-4 bg-green-200 my-4 rounded-sm">
                              Frequently Asked Question
                            </h1>
              
                            <div className="space-y-4 mb-4">
                              {faqs.length > 0 ? (
                                faqs.map((faq, index) => (
                                  <div
                                    key={faq.id}
                                    className="border rounded-lg overflow-hidden shadow-sm "
                                  >
                                    <button
                                      className={`flex items-center justify-between w-full p-4 text-left transition-colors duration-200 ${activeIndex === index
                                          ? "bg-green-100 text-green-700"
                                          : "hover:bg-gray-50"
                                        }`}
                                      onClick={() => handleAccordionToggle(index)}
                                    >
                                      <span
                                        className="font-medium flex items-center "
                                        dangerouslySetInnerHTML={{ __html: faq.question }}
                                      />
                                      <span className="text-lg">
                                        {activeIndex === index ? (
                                          <FaChevronUp />
                                        ) : (
                                          <FaChevronDown />
                                        )}
                                      </span>
                                    </button>
                                    <div
                                      className={`transition-max-h duration-300 ease-in-out overflow-hidden ${activeIndex === index ? "max-h-96 p-4" : "max-h-0 p-0"
                                        }`}
                                    >
                                      <p
                                        className="text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                      />
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6 text-gray-400">
                                  Loading FAQs...
                                </div>
                              )}
                            </div>
              <LiveTestcategorieModel
                data={data}
                topic={currentTopic}
                activeSection={activeSection}
              />
            </div>

            {/* advertiswment part */}
            <div className="md:m-3 w-full md:w-1/5 ">
              <div
                className="relative flex flex-col w-full bg-cover rounded-xl shadow-md border-2"
              
              >
                <div className="absolute inset-0 z-[-10] border-2 rounded-xl "></div>
                <div className=" flex justify-center">
                  <span className="text-xl font-semibold font  p-2">
                    Features
                  </span>
                </div>
                {/* <hr className="border-t border-gray-600" /> */}
              {/* Recommended Upload Size: 400 x 600 px (portrait ratio, high enough resolution for most use cases) 
    Aspect Ratio: 2:3 (portrait) */}
                  <img 
  src={data.featurePhoto}
  alt="ad" 
  style={{
    width: '100%',
    maxWidth: '400px',
    aspectRatio: '2 / 3',
    objectFit: 'contain'
  }} />
                {/* <img src={data.featurePhoto} alt="" /> */}
                <div className="text-center mt-1 p-2">
                <del className=" rounded px-2 py-1 mb-2 drop-shadow">
  Rs.{amount}
</del>

            <button
  className={`px-3 py-1 font-bold rounded-full ${
    isEnrolled 
      ? "bg-[#000080] text-white cursor-not-allowed" // disabled style
      : "bg-green-500 text-gray-50 hover:bg-green-400"
  }`}
  onClick={() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else if (isEnrolled) {
      // Do nothing or show a message if needed, since already purchased
      console.log("Already enrolled");
    } else {
      setshowmodel(true);
    }
  }}
  disabled={isEnrolled} // disables button if enrolled
>
  {isEnrolled ? "Purchased" : `Rs.${discountedAmount}`}
</button>

            
                  <p className="font-bold">
                    You Save Money: Rs. {amount - discountedAmount}
                  </p>
                  {showmodel && <Coupon data={data} setshowmodel={setshowmodel}/>}

                </div>
              </div>

              {ad.length > 0 && (
                <div>
                  {ad.map((item) => (
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailedCategorie;
