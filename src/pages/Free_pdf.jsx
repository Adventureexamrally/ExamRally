import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import AOS from "aos";
import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import Coupon from './Coupon';

const Free_pdf = () => {
  const [seo, setSeo] = useState([]);
  const [ad, setAD] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { user } = useContext(UserContext);
  const [responseId, setResponseId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedpdf, setSelectedPackage] = useState(null);
  const [enrolledPdfs, setEnrolledPdfs] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    run();
    fetchPdfs();
  }, []);

  const { isSignedIn } = useUser();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.get("/FreePdf/PdfTopics");
        console.error(";'",response)
        if (response.data) {
          const extracted = response.data?.map(item => item.name || item.categorys);
          setCategories(extracted);

        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  async function run() {
    const response2 = await Api.get(`/get-Specific-page/free-pdf`);
    setSeo(response2.data);
    const response3 = await Api.get(`/blog-Ad/getbypage/free-pdf`);
    setAD(response3.data);
  }

  async function fetchPdfs() {
    try {
      const response = await Api.get('/FreePdf/getallpdf');
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  }

  const filteredPdfs = selectedTopic
    ? pdfs.filter(pdf => pdf.Topic === selectedTopic)
    : pdfs;

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
    AOS.refresh();
  }, []);

  // Check enrollment status for each PDF
  useEffect(() => {
    if (user?.enrolledCourses && pdfs.length > 0) {
      const newEnrolledPdfs = {};
      
      pdfs.forEach(pdf => {
        const enrolledCourse = user.enrolledCourses.find(course => {
          if (!course?.courseId?.includes(pdf._id)) return false;
          
          // Check expiry date
          if (course.expiryDate) {
            const expireDate = new Date(course.expiryDate);
            const today = new Date();
            return expireDate >= today;
          }
          return true;
        });

        newEnrolledPdfs[pdf._id] = !!enrolledCourse;
      });

      setEnrolledPdfs(newEnrolledPdfs);
    }
  }, [user, pdfs]);

  const handlePackageSelect = (pdf) => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      setSelectedPackage(pdf);
      setShowModal(true);
    }
  };

  const getDaysLeft = (pdfId) => {
    if (!user?.enrolledCourses) return null;
    
    const course = user.enrolledCourses.find(c => c.courseId?.includes(pdfId));
    if (!course || !course.expiryDate) return null;
    
    const expireDate = new Date(course.expiryDate);
    const today = new Date();
    const timeDiff = expireDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
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
      
      <h2 className="text-2xl m-2 font-bold text-center text-green-600">FREE PDF</h2>
      <div className="flex container mx-auto p-4 gap-4">
        {/* Main Content Area */}
        <div className="flex flex-1 gap-4">
          {/* Topics Sidebar - 1/4 width */}
          <div className="w-1/4 pr-6">
            <div className="bg-white border border-gray-200 rounded-lg sticky top-10 overflow-y-auto h-[430px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <button
                onClick={() => setSelectedTopic('')}
                className={`w-full text-left px-5 py-3.5 hover:bg-[#131656] hover:text-white transition-colors border-b ${
                  selectedTopic === '' ? 'font-medium text-[#131656] border-l-4 border-l-[#131656]' : 'text-gray-600'
                }`}
              >
                All Topics
              </button>
              {categories.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left px-5 py-3.5 hover:bg-[#131656] hover:text-white transition-colors border-b ${
                    selectedTopic === topic ? 'font-medium text-[#131656] border-l-4 border-l-[#131656]' : 'text-gray-600'
                  } ${index === categories.length - 1 ? 'border-b-0' : ''}`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          
          {/* PDF Grid - 3/4 width */}
          <div className="w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPdfs.map((pdf, index) => {
                const isEnrolled = enrolledPdfs[pdf._id] || pdf.type === "free";
                const daysLeft = getDaysLeft(pdf._id);
                
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-2">{pdf.Title}</h3>
                      <div className="aspect-w-3 aspect-h-4 mb-3">
                        <img
                          src={pdf.PdfThubnail}
                          alt={pdf.Title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      
                      {isEnrolled ? (
                        <div className="space-y-2">
                          {daysLeft !== null && (
                            <div className="text-sm text-center text-gray-600">
                              Expires in: {daysLeft} days
                            </div>
                          )}
                          <Link
                            to={pdf.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Download PDF
                          </Link>
                        </div>
                      ) : responseId ? (
                        <Link
                          to={pdf.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Download PDF
                        </Link>
                      ) : (
                        <button
                          onClick={() => handlePackageSelect(pdf)}
                          className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Buy Now ₹{pdf.amount}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ads Sidebar - Only show if ads exist */}
        {ad.length > 0 && (
          <div className="hidden lg:block w-1/5">
            <div className="sticky top-10 space-y-4">
              {ad.map((item, index) => (
                <div 
                  key={index}
                  className="hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                >
                  <Link to={item.link_name}>
                    <img 
                      src={item.photo} 
                      alt="Advertisement" 
                      className="rounded-md w-full object-cover"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedpdf && (
          <Coupon
            data={selectedpdf}
            setshowmodel={setShowModal}
          />
        )}
      </div>
    </>
  );
};

export default Free_pdf;