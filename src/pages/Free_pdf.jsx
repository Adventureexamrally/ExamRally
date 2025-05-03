import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import AOS from "aos";
import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';

const Free_pdf = () => {
  const [seo, setSeo] = useState([])
  const [ad, setAD] = useState([])
  const [pdfs, setPdfs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { user } = useContext(UserContext);
  const [responseId, setResponseId] = useState(null);
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
    const [isEnrolled, setIsEnrolled] = useState(false);
    const status = true;
    
    useEffect(() => {
      const enrolled = user?.enrolledPdfs?.some(pdf =>
        pdf?.pdfId?.includes(pdfs?._id)
      );
      setIsEnrolled(enrolled);
    }, [user, pdfs]);
    
    console.log("check", user?.enrolledCourses);

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

  const paymentmeth = async (pdf) => {
    try {
      console.log("in")
      const res = await Api.post("/orders/orders", {
        amount: pdf.amount * 100,
        currency: "INR",
        receipt: `${user?.email}`,
        payment_capture: 1
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: pdf.amount * 100,
        currency: "INR",
        name: pdf.type,
        description: pdf.Title,
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
          pdf_id: pdf._id,
          pdfTitle: pdf.Title,
        },
      };

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

  const isPaidTest = (test) => {
    return test?.result_type?.toLowerCase() === "paid";
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
      <h2 className="text-2xl m-2 font-bold text-center text-green-600">FREE PDF</h2>

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
                  onClick={() => {
                    if (!user) {
                      navigate('/sign-in');
                    } else {
                      paymentmeth(pdf);
                    }
                  }}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Buy Now ₹{pdf.amount}
                </button>
              )}
            </div>
          ))}
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
      </div >
    </>
  );
};


export default Free_pdf;
