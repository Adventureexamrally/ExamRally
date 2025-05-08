import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Helmet } from 'react-helmet';

import { Link, useParams, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import AOS from "aos";
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import Coupon from './Coupon';

const Free_pdf = () => {
  const [seo, setSeo] = useState([])
  const [ad, setAD] = useState([])

  const [pdfs, setPdfs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { user } = useContext(UserContext);
  const [responseId, setResponseId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedpdf, setSelectedPackage] = useState(null);

  const navigate = useNavigate();
  const topics = [

    "Quantitative Aptitude",
    "Reasoning Ability",
    "English Language",
    "Insurance Awareness",
    "Banking Awareness",
    "Static GK",
    "Current Affairs",
    "Computer Awareness"

  ];
  useEffect(() => {
    run();
    fetchPdfs();
  }, []);
  const { isSignedIn } = useUser();

  async function run() {
    const response2 = await Api.get(`/get-Specific-page/free-pdf`);
    setSeo(response2.data);
    console.log(response2.data);

    const response3 = await Api.get(`/blog-Ad/getbypage/free-pdf`);
    setAD(response3.data)
  }
  async function fetchPdfs() {
    try {
      const response = await Api.get('/FreePdf/getallpdf');
      setPdfs(response.data);
      console.log("ll", response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  }

  const filteredPdfs = selectedTopic
    ? pdfs.filter(pdf => pdf.Topic === selectedTopic)
    : pdfs;
  console.log(seo);



  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
    AOS.refresh();
  }, []);
  // console.log(data);
  const status = true;

  useEffect(() => {
    console.warn("Effect triggered. User:", user);
    console.warn("PDFs array:", pdfs);
  
    const enrolled = user?.enrolledCourses?.some(course => {
      console.warn("Checking course:", course);
  
      // Convert expiryDate to Date and validate
      const expireDate = new Date(course?.expiryDate);
      const isNotExpired = !isNaN(expireDate) && expireDate > new Date();
      console.warn("  Expiry check:", expireDate, "Is not expired?", isNotExpired);
  
      // Check for matching courseId and that it's not expired
      const matched = pdfs?.some(pdf => {
        console.warn("  Comparing courseId:", course?.courseId, "with pdf._id:", pdf?._id);
        return course?.courseId?.includes(pdf?._id);
      });
  
      console.warn("  --> Match found for this course?", matched);
      return matched && isNotExpired;
    });
  
    console.warn("Final enrolled result:", enrolled);
    setIsEnrolled(enrolled);
  }, [user, pdfs]);
  


  console.log("pdfs", pdfs);
  console.log("Hjk", isEnrolled);
  console.log("check", user?.enrolledCourses);

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
  // console.log("user data",user)
  // const paymentmeth = async (pdf) => {
  //   try {
  //     const res = await Api.post('/orders/orders', {
  //       amount: Math.round([pdf.amount]* 100), // must be integer in paise
  //       currency: 'INR',
  //       receipt: `${user?.email}`,
  //       payment_capture: 1,
  //     });

  //     const scriptLoaded = await loadRazorpayScript();
  //     if (!scriptLoaded) {
  //       alert('Failed to load Razorpay SDK. Check your connection.');
  //       return;
  //     }

  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: Math.round(pdf.amount * 100),
  //       currency: 'INR',
  //       name: pdf?.Title,
  //       description: 'Course Payment',
  //       handler: function (response) {
  //         console.log('Payment Success:', response);
  //         alert('Payment Successful! ID: ' + response.razorpay_payment_id);

  //       },
  //       prefill: {
  //         name: user?.firstName,
  //         email: user?.email,
  //       },
  //       notes: {
  //         user_id: user?._id,
  //         course_id: pdf?._id,
  //         courseName: pdf?.Title,
  //       },
  //       theme: {
  //         color: '#2E7D32',
  //       },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();

  //     rzp.on('payment.failed', function (response) {
  //       console.error('Payment failed', response.error);
  //       alert('Payment failed. Please try again.');
  //     });
  //   } catch (error) {
  //     console.error('Error during payment:', error);
  //     alert(error.message || 'Payment failed');
  //   } 
  // };

  // console.log(paymentmeth)

  // const isPaidTest = (test) => {
  //   return test?.result_type?.toLowerCase() === "paid";
  // };
  const handlePackageSelect = (pdf) => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      setSelectedPackage(pdf);
      setShowModal(true);
    }
  };
  return (
    <>
      <Helmet>
        <title>{seo[0]?.seoData?.title}</title>
        <meta name="description" content={seo[0]?.seoData?.description} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
      </Helmet>


      <div className="flex container mx-auto p-4">
        {/* Topics Sidebar */}
        <div className="w-1/4 pr-4">
          <div className="bg-white shadow-md rounded-lg  sticky top-10">

            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(topic)}

                className={` w-full text-left px-4 py-2 hover:bg-[#7382CC] ${selectedTopic === topic ? 'bg-[#131656] text-white' : ''
                  }`}

              >
                {topic}
              </button>
            ))}
          </div>
        </div>


        {/* PDF Grid */}
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPdfs.map((pdf, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="aspect-w-3 aspect-h-1 mb-2">
                <h3 className="text-lg font-semibold mb-2">{pdf.Title}</h3>
                <img
                  src={pdf.PdfThubnail}
                  alt={pdf.Title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              {(isEnrolled || pdf.type === "free") ? (
                <Link
                  to={pdf.pdf}
                  className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Download PDF
                </Link>
              ) : responseId ? (
                <Link
                  to={pdf.pdf}
                  className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Download PDF
                </Link>
              ) : (
                <button
                  onClick={() => handlePackageSelect(pdf)}

                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Buy Now ₹{pdf.amount}
                </button>
              )}
            </div>

          ))}
        </div>

        {showModal && selectedpdf && (
          <Coupon
            data={selectedpdf}
            setshowmodel={setShowModal}
          />
        )}
        {ad.length > 0 &&
          <div className="w-1/5 hidden md:block">
            <div>

              {ad.map((item, index) => (
                <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'
                  key={index}
                >
                  <Link to={item.link_name}>
                    <img src={item.photo} alt="Not Found" className='rounded-md' /></Link >
                </div>
              ))}

            </div>
          ))}
        </div>

        {/* Ads */}
        {ad.length > 0 && (
          <div className="hidden lg:block w-1/5 ml-4">
            {ad.map((item, index) => (
              <div key={index} className='m-4 hover:scale-105 transition-transform duration-300'>
                <Link to={item.link_name}>
                  <img src={item.photo} alt="Ad" className='rounded-md' />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};


export default Free_pdf;

