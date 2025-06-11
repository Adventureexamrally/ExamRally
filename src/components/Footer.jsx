import React, { useEffect, useState } from "react";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo/bg-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaTelegramPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Api from "../service/Api";
import { Telegram, YouTube } from "@mui/icons-material";
function Footer() {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    telegram: "",
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await Api.get("site-documents");
        setContactInfo(res.data.contact || {});
       
      } catch (error) {
        console.error("Failed to load contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  const navigate = useNavigate(); // Hook to navigate programmatically
  const location = useLocation(); // Hook to get the current location (path + hash)

  return (
    <>
      <div>
        <footer className="bg-white text-gray-700 border-t py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Logo and About */}
            <div className="space-y-4">
              <div className="flex items-center">
                <img src={logo} alt="ExamRally Logo" className="h-10 mr-3" />
              </div>
              <p className="text-sm">
                ExamRally is a premier online assessment platform providing
                high-quality mock tests and practice exams for competitive test
                preparation.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
            <div className="flex space-x-4 mt-6">
  {/* Telegram (has a fallback) */}
  <a
    href={contactInfo.telegram || "https://t.me/examrally"}
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaTelegramPlane size={20} />
  </a>

  {/* Instagram */}
  {contactInfo.instagram && (
    <a
      href={contactInfo.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 hover:text-green-600 transition"
    >
      <FaInstagram size={20} />
    </a>
  )}

  {/* YouTube (has a fallback) */}
  <a
    href={contactInfo.youtube || "https://www.youtube.com/@examrally_banking"}
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaYoutube size={20} />
  </a>

  {/* Facebook */}
  {contactInfo.facebook && (
    <a
      href={contactInfo.facebook}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 hover:text-green-600 transition"
    >
      <FaFacebookF size={20} />
    </a>
  )}

  {/* Twitter */}
  {contactInfo.twitter && (
    <a
      href={contactInfo.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 hover:text-green-600 transition"
    >
      <FaXTwitter size={20} />
    </a>
  )}

  {/* LinkedIn */}
  {contactInfo.linkedin && (
    <a
      href={contactInfo.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 hover:text-green-600 transition"
    >
      <FaLinkedinIn size={20} />
    </a>
  )}
</div>

              </div>
            </div>

            {/* Column 2: Company Links */}
            <div>
              <h3 className="text-green font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { text: "Home", path: "/" },
                  { text: "All in One Subscription", path: "rally-super-pro" },
                  { text: "Blog", path: "/blog" },
                  { text: "Refund Policy", path: "/refund-policy" },
                  { text: "Privacy Policy", path: "/privacy-policy" },
                  { text: "Terms and Conditions", path: "/TermsConditions" },
                  {text: 'Contact Us', path: '/contactus'}
                ].map((item) => (
                  <li key={item.text}>
                    <Link
                      to={item.path}
                      className="hover:text-green-600 transition"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Useful Links */}
            <div>
              <h3 className="text-green font-semibold text-lg mb-4">
                Useful Links
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { text: "Test Series", path: "/subscriptions" },
                  // {text: 'PDF Courses', path: '/pdf-course'},
                  { text: "Free PDFs", path: "/free-pdf" },
                  { text: "Combo Packages", path: "/All-Packages" },
                ].map((item) => (
                  <li key={item.text}>
                    <Link
                      to={item.path}
                      className="hover:text-green-600 transition"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
                {[
                  // { text: "Live Tests", path: "/#live-tests" },
                  // { text: "Top Trending Exams", path: "/#TopTrendingExams" },
                  { text: "Trending Packages", path: "/All-Packages" },
                ].map((item) => (
                  <li key={item.text}>
                    {/* <a href={item.path} className="hover:text-green-600 transition">
  {item.text}
</a> */}
                    <button
                      onClick={() => navigate(`${item.path}`)}
                      className="hover:text-green-600 transition"
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <h3 className="text-green font-semibold text-lg mb-4">
                Connect with Us
              </h3>
              <address className="not-italic text-sm space-y-3">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 text-green-600" />
                  <span>{contactInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-green-600" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-700 hover:underline"
                  >
                    {contactInfo.email}
                  </a>{" "}
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-green-600" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-gray-700 hover:underline"
                  >
                    {contactInfo.phone}
                  </a>{" "}
                </div>
                <div className="flex items-center">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-green-600" />
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline"
                  >
                    {contactInfo.whatsapp}
                  </a>{" "}
                </div>
              </address>
            </div>
          </div>
        </footer>
      </div>
      <footer className=" bg-green-600 text-center text-white p-4 mt-8 fw-bold">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Examrally. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
export default Footer;
