import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { UserContext } from '../context/UserProvider';

const Free_pdf = () => {
  const [seo, setSeo] = useState([]);
  const [ad, setAD] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { user } = useContext(UserContext);
  const [responseId, setResponseId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  const topics = useMemo(() => [
    "Quantitative Aptitude",
    "Reasoning Ability",
    "English Language",
    "Insurance Awareness",
    "Banking Awareness",
    "Static GK",
    "Current Affairs",
    "Computer Awareness"
  ], []);

  useEffect(() => {
    fetchPageData();
    fetchPdfs();
    AOS.init({ duration: 1000 });
  }, []);

  const fetchPageData = async () => {
    const response2 = await Api.get('/get-Specific-page/free-pdf');
    setSeo(response2.data);

    const response3 = await Api.get('/blog-Ad/getbypage/free-pdf');
    setAD(response3.data);
  };

  const fetchPdfs = async () => {
    try {
      const response = await Api.get('/FreePdf/getallpdf');
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  useEffect(() => {
    const enrolled = user?.enrolledPdfs?.some(pdf =>
      pdf?.pdfId?.includes(pdfs?._id)
    );
    setIsEnrolled(enrolled);
  }, [user, pdfs]);

  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const paymentmeth = async (pdf) => {
    try {
      const res = await Api.post("/orders/orders", {
        amount: pdf.amount * 100,
        currency: "INR",
        receipt: `${user?.email}`,
        payment_capture: 1
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your connection.");
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
        notes: {
          user_id: user?._id,
          pdf_id: pdf._id,
          pdfTitle: pdf.Title,
        },
        theme: {
          color: "#F4C430",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed", response.error);
        alert("Payment failed. Please try again.");
      });
    } catch (error) {
      console.error("Error during payment:", error);
      alert(error.message);
    }
  };

  const filteredPdfs = selectedTopic
    ? pdfs.filter(pdf => pdf.Topic === selectedTopic)
    : pdfs;

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

      <h2 className="text-2xl m-4 font-bold text-center text-green-600">FREE PDF</h2>

      <div className="container mx-auto px-4 flex flex-col md:flex-row">
        {/* Topics Sidebar for md+ screens */}
        <div className="md:w-1/4 mb-4 md:mb-0 md:pr-4">
          <div className="hidden md:block bg-white shadow-md rounded-lg sticky top-10">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left px-4 py-2 hover:bg-[#7382CC] ${selectedTopic === topic ? 'bg-[#131656] text-white' : ''}`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown for topics */}
          <div className="md:hidden mb-4">
            <select
              className="w-full border rounded-md p-2"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="">All Topics</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PDF Grid */}
        <div className="md:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPdfs.map((pdf, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{pdf.Title}</h3>
              <img
                src={pdf.PdfThubnail}
                alt={pdf.Title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              {(isEnrolled || pdf.type === "free" || responseId) ? (
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
