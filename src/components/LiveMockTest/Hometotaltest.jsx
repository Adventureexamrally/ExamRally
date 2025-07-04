import React, { useContext, useEffect, useState } from 'react';
import { fetchUtcNow } from '../../service/timeApi';
import Api from '../../service/Api';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider';

const HomeTotalTest = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [resultLiveTests, setResultLiveTests] = useState({});
  const [utcNow, setUtcNow] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const hasRallyPro = user?.subscriptions?.some(
    (sub) =>
      sub.courseName === 'Rally Super pro' && sub.status === 'Active'
  );

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
        console.error('Error fetching live tests:', err);
        setLiveTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  console.log('Live Tests:', liveTests);
  useEffect(() => {
    const fetchTestStatuses = async () => {
      const statusUpdates = {};

      for (const test of liveTests) {
        try {
          const res = await Api.get(`/results/${user._id}/${test._id}`);
          const statusData = res?.data;

          if (statusData && ['completed', 'paused'].includes(statusData?.status)) {
            statusUpdates[test._id] = {
              status: statusData.status,
              lastQuestionIndex: statusData.lastVisitedQuestionIndex,
              selectedOptions: statusData.selectedOptions,
            };
          }
        } catch (err) {
          console.warn(`No result or error for test ${test._id}`);
        }
      }

      setResultLiveTests((prev) => ({ ...prev, ...statusUpdates }));
    };

    if (liveTests.length > 0 && user?._id) {
      fetchTestStatuses();
    }
  }, [liveTests, user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-[#131656] text-4xl mb-3">Your Test Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View or attempt tests based on your subscription.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#131656] to-[#4f46e5] mx-auto mt-4 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#131656] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#131656] rounded-full opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your test access...</p>
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Tests Found</h3>
                  <p className="text-gray-500 mb-4">Check back later or upgrade to Rally Super Pro.</p>
                </div>
              </div>
            </div>
          ) : (
            liveTests.map((test) => {
              const attempted =
                resultLiveTests[test._id]?.status === 'completed' ||
                resultLiveTests[test._id]?.status === 'paused';

              const showTakeTest = hasRallyPro && !attempted;
              const showViewResult = attempted;
              const hideActions = !hasRallyPro && !attempted;

              return (
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
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Test Ended On</h4>
                          <p className="text-gray-800 font-medium">{formatDate(test.livetestEndDate)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-5 space-y-2">
  {/* ✅ Show Take Test only for Rally Super Pro users */}
  {!hideActions && showTakeTest && hasRallyPro && (
    <Link
      to={`/homelivemocktest/${test._id}/${user._id}`}
      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
    >
      <span className="mr-2">📝</span> Take Test
    </Link>
  )}

  {/* ✅ Show View Result only for non-Rally Super Pro users */}
  {!hideActions && showViewResult && hasRallyPro && (
    <Link
      to={`/homeliveresult/${test._id}`}
      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
    >
      <span className="mr-2">📊</span> View Result
    </Link>
  )}
{!hideActions && showViewResult && hasRallyPro && (
    <Link
      to={`/homeliveresult/${test._id}`}
      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
    >
      <span className="mr-2">📊</span> View Solution
    </Link>
  )}
  {/* ✅ Bottom View Result link — show only for non-Rally Super Pro users */}
  {!hasRallyPro && (
    <div className="text-center text-sm text-gray-400 pt-2">
      <Link
        to={`/homeliveresult/${test._id}`}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
      >
        <span className="mr-2">📊</span> View Result
      </Link>
    </div>
  )}
{utcNow && new Date(utcNow) < new Date(formatDate(test.liveSolutionEndDate)) &&  !hasRallyPro && (
  <div>
    <h1>
      Test Solutions are now available! {formatDate(test.liveSolutionEndDate)}
    </h1>
    <Link
      to={`/homeSolution/${test._id}`}
      className="w-full flex items-center justify-center px-4 py-2 mt-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
    >
      <span className="mr-2">📊</span> View Solution
    </Link>
  </div>
)}



</div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default HomeTotalTest;
