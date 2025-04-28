import React from 'react';
import { 
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon 
} from '@heroicons/react/24/outline';
import logo from "../assets/logo/bg-logo.png";
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaTelegramPlane,
} from "react-icons/fa";
function Footer() {
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
            ExamRally is a premier online assessment platform providing high-quality mock tests 
            and practice exams for competitive test preparation.
          </p>
          <div className="flex space-x-4">
            {/* Social media icons would go here */}
            <div className="flex space-x-4 mt-6">
  <a
    href="https://facebook.com/yourpage"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaFacebookF size={20} />
  </a>
  <a
    href="https://instagram.com/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaInstagram size={20} />
  </a>
  <a
    href="https://twitter.com/yourhandle"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaTwitter size={20} />
  </a>
  <a
    href="https://youtube.com/yourchannel"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaYoutube size={20} />
  </a>
  <a
    href="https://linkedin.com/in/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaLinkedinIn size={20} />
  </a>
  <a
    href="https://t.me/yourchannel"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-500 hover:text-green-600 transition"
  >
    <FaTelegramPlane size={20} />
  </a>
</div>

          </div>
        </div>

        {/* Column 2: Company Links */}
        <div>
          <h3 className="text-gray-900 font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {[
              {text: 'All in One Subscription', path: '/subscriptions'},
              {text: 'Blog', path: '/blog'},
              {text: 'Privacy Policy', path: '/privacy-policy'},
              {text: 'Payment FAQs', path: '/payment-faqs'},
              {text: 'Contact Us', path: '/contact'}
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
          <h3 className="text-gray-900 font-semibold text-lg mb-4">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              {text: 'Live Tests', path: '/live-tests'},
              {text: 'Test Series', path: '/subscriptions'},
              {text: 'PDF Courses', path: '/pdf-course'},
              {text: 'Free PDFs', path: '/free-pdf'},
              {text: 'Combo Packages', path: '/combo-packages'}
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

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-gray-900 font-semibold text-lg mb-4">Get in Touch</h3>
          <address className="not-italic text-sm space-y-3">
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 text-green-600" />
              <span>123 Exam Street, Knowledge City, India - 560001</span>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-green-600" />
              <a href="mailto:support@examrally.com" className="hover:text-green-600 transition">support@examrally.com</a>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 mr-2 text-green-600" />
              <a href="tel:+918588835848" className="hover:text-green-600 transition">+91 12345 12345</a>
            </div>
            <div className="flex items-center">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-green-600" />
              <span>WhatsApp: 12345 12345</span>
            </div>
          </address>
        </div>
      </div>
    </footer>
      </div>
      <footer className=" bg-green-600 text-center text-white p-4 mt-8 fw-bold">
        <p className="text-sm">&copy; {new Date().getFullYear()} Examrally. All Rights Reserved.</p>
      </footer>
      </>
    );
  }
  export default Footer;