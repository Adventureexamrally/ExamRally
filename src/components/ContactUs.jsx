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
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          We'd love to hear from you
        </p>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Contact Information */}
          <div className=" p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {contactInfo.address && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Address</h3>
                    <p className="mt-1 text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <EnvelopeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Email</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="mt-1 text-gray-600 hover:text-green-700 hover:underline transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <PhoneIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                      className="mt-1 text-gray-600 hover:text-green-700 hover:underline transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {contactInfo.whatsapp && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-gray-600 hover:text-green-700 hover:underline transition-colors"
                    >
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default ContactUs;