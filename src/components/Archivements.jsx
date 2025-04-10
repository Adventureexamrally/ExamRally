import React, { useEffect, useState } from 'react';
import Api from '../service/Api';
import { Link } from 'react-router-dom';

const Archivements = () => {
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
    <div className="mx-auto my-7 p-6 rounded-3xl shadow-xl bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">Celebrating Success</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our <span className="text-green-600">Achievers'</span> Wall
          </h1>
          <p className="mt-2 text-gray-600">Recognizing excellence and dedication</p>
        </div>
        <Link
          to="/All-Archivers"
          className="text-green-600 font-medium hover:text-green-800 transition-colors duration-200"
        >
          View All →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : arch.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No achievements yet</h3>
          <p className="mt-1 text-gray-500">Check back later to see our achievers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {arch.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={item.photo}
                  alt={item.title}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archivements;
