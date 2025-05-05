import { Link } from "react-router-dom";
import React from 'react';
import Lottie from 'react-lottie';
import animationData from './animation.json';  // File should be in the public folder
  // Path to your Lottie animation file

function NotFound() {

  
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
          {/* Heading */}
          {/* <h1 className="text-6xl font-bold text-red-500">404</h1> */}
          
          {/* Lottie Animation */}
          <div className="flex justify-center">
            <Lottie options={defaultOptions} height={150} width={150} />
          </div>
  
          {/* Message */}
          <p className="text-lg text-gray-700">
            Oops! The content you're looking for is not available.
          </p>
  
          {/* Go Home Button */}
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  };
  
  

export default NotFound;