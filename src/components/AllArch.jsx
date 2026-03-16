import React, { useEffect, useState } from 'react';
import Api from '../service/Api';
import { Link } from 'react-router-dom';

const AllArch = () => {
  const [arch, setArch] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Api.get("/archivements/get/active")
      .then((response) => {
        setArch(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching slides:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div

    className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-100 to-white">
      <style>
        {`
          @keyframes swing {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
          }
                      @keyframes swing2 {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(20deg); }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className='flex justify-center items-center'>
          <img src="/cup.png" alt="cup" height={100} width={100}   className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] animate-[swing_2s_ease-in-out_infinite]"/>
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-900  sm:tracking-tight lg:text-6xl">
          Our <span className="text-green-600">Achievers'</span> Wall
          </h1>
          <img src="/cup2.png" alt="cup" height={100} width={100}   className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] animate-[swing2_2s_ease-in-out_infinite]"/>

          </div>
          <p className="mt-4 text-lg text-gray-500 italic">
            “Celebrating excellence and remarkable accomplishments”
          </p>
         
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : arch.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No achievements found</h3>
            <p className="mt-1 text-gray-500">We'll be adding more achievements soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {arch.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.photo}
                    alt={item.title || 'Achievement'}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArch;
