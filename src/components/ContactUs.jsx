import { useState, useEffect } from "react";
import Api from "../service/Api";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

function ContactUs() {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    phone: "",
    whatsapp: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const res = await Api.get("site-documents");
        setContactInfo(res.data.contact || {});
        setError(null);
      } catch (error) {
        console.error("Failed to load contact info:", error);
        setError("Failed to load contact information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Get in Touch
        </h1>
        <div className="mt-4 max-w-2xl mx-auto">
          <div className="h-1 w-20 bg-green-500 mx-auto"></div>
        </div>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
          We're here to help and answer any questions you might have.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Contact Information */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              {contactInfo.address && (
                <div className="flex">
                  <div className="bg-white p-3 rounded-lg shadow-sm mr-6 flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Our Location</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex">
                  <div className="bg-white p-3 rounded-lg shadow-sm mr-6 flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="mt-2 text-gray-600 hover:text-green-700 transition-colors block"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className="flex">
                  <div className="bg-white p-3 rounded-lg shadow-sm mr-6 flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                      className="mt-2 text-gray-600 hover:text-green-700 transition-colors block"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {contactInfo.whatsapp && (
                <div className="flex">
                  <div className="bg-white p-3 rounded-lg shadow-sm mr-6 flex-shrink-0">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-gray-600 hover:text-green-700 transition-colors block"
                    >
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                </div>
              )}
            </div>

          
          </div>

          {/* Contact Form - You can add this later if needed */}
          <div className="bg-white p-12">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Want to send us a message?</h3>
                <p className="text-gray-600 mb-6">We'll get back to you as soon as possible.</p>
                 <a
                      href={`mailto:${contactInfo.email}`}
                      className="mt-2 text-white hover:text-green-700 transition-colors block"
                    >
                <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">

                      {contactInfo.email}
                         </button>
                    </a>
             
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;