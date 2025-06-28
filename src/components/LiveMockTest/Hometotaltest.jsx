import React, { useEffect, useState } from 'react';
import { fetchUtcNow } from '../../service/timeApi';
import Api from '../../service/Api';
import { Link } from 'react-router-dom';

const HomeTotalTest = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [utcNow, setUtcNow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [testsRes, currentTime] = await Promise.all([
          Api.get('exams/live-test'),
          fetchUtcNow(),
        ]);
        const testsData = testsRes.data;
        setLiveTests(Array.isArray(testsData.result) ? testsData.result : []);
        setUtcNow(currentTime);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLiveTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-[#131656] text-4xl  mb-3">Recent Test Results Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View and manage all your test results in one place. Track your progress and performance over time.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#131656] to-[#4f46e5] mx-auto mt-4 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#131656] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#131656] rounded-full opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your test results...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveTests.length === 0 ? (
            <div className="col-span-full">
              <div className="card bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                <div className="card-body flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Available</h3>
                  <p className="text-gray-500 mb-4">There are no test results to display at this time.</p>
                  <button className="px-4 py-2 bg-[#131656] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                    Check Back Later
                  </button>
                </div>
              </div>
            </div>
          ) : (
            liveTests.map((test) => (
              <div key={test._id} className="group">
                <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-100">
                  <div className="bg-gradient-to-r from-[#131656] to-[#4f46e5] p-4 text-white">
                    <h3 className="text-md font-bold">{test.show_name}</h3>
          
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#131656]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Test ended on</h4>
                        <p className="text-gray-800 font-medium">
                       {formatDate(test.livetestEndDate)}
                        </p>
                      </div>
                    </div>
                    
                 
                  </div>
                  
                  <div className="px-5 pb-5">
                    <Link
                      to={`/homeliveresult/${test._id}`}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Detailed Results
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Additional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-[#13165620] to-transparent -z-10"></div>
    </div>
  );
};

export default HomeTotalTest;