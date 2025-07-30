import React, { useCallback, useContext, useEffect, useState } from 'react';
import Api from '../../service/Api';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider';
import { useUser } from '@clerk/clerk-react';

const HomeTotalTest = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [resultLiveTests, setResultLiveTests] = useState({});

  const [loading, setLoading] = useState(true);

  const { user, utcNow } = useContext(UserContext);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const hasRallyPro = user?.subscriptions?.some(
    (sub) =>
      sub.courseName === 'Rally Super pro' && sub.status === 'Active'
  );

  useEffect(() => {
    const handleMessage = (event) => {
      if (event?.data?.action === 'redirect') {
        window.location.reload(); // or navigate('/homelivetest') if using react-router
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [testsRes] = await Promise.all([
          Api.get('exams/live-test'),

        ]);
        const testsData = testsRes.data;
        setLiveTests(Array.isArray(testsData.result) ? testsData.result : []);
        // setUtcNow(currentTime);
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

  const fetchTestStatuses = useCallback(async () => {
    console.log("Fetching test statuses...");
    const statusUpdates = {};

    for (const test of liveTests) {
      try {
        const res = await Api.get(`/results/${user._id}/${test._id}`);
        const statusData = res?.data;
        console.log("Status data for", test._id, statusData);

        if (statusData && ['completed', 'paused'].includes(statusData?.status)) {
          statusUpdates[test._id] = {
            status: statusData.status,
            lastQuestionIndex: statusData.lastVisitedQuestionIndex,
            selectedOptions: statusData.selectedOptions,
          };
          storeTestStatus(test._id, statusUpdates[test._id]);
        }
      } catch (err) {
        console.error(`Error fetching status for test ${test._id}:`, err);
        const stored = getTestStatusFromStorage(test._id);
        if (stored) {
          statusUpdates[test._id] = stored;
        }
      }
    }

    console.log("Updating resultLiveTests with:", statusUpdates);
    setResultLiveTests(prev => {
      const newState = { ...prev, ...statusUpdates };
      console.log("New resultLiveTests state:", newState);
      return newState;
    });
  }, [liveTests, user?._id]); // Add dependencies here

  useEffect(() => {
    if (!user?._id || !utcNow || liveTests.length === 0) return;
    fetchTestStatuses();
  }, [liveTests, user?._id, utcNow]);

  const getTestStatusFromStorage = (id) => {
    try {
      const raw = localStorage.getItem('testResults');
      const all = raw ? JSON.parse(raw) : {};
      return all[id] || null;
    } catch {
      return null;
    }
  };

  // Add this useEffect to handle focus
  useEffect(() => {
    window.addEventListener("focus", fetchTestStatuses);
    return () => {
      window.removeEventListener("focus", fetchTestStatuses);
    };
  }, [fetchTestStatuses]);

  const storeTestStatus = (id, { status, lastQuestionIndex, selectedOptions }) => {
    try {
      const raw = localStorage.getItem('testResults') || '{}';
      const all = JSON.parse(raw);
      all[id] = {
        status,
        lastQuestionIndex,
        selectedOptions,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('testResults', JSON.stringify(all));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };
  // And in your main component add this effect:
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Received message from parent window:", event.data);
      console.log("Event origin:", event.origin, "Current origin:", window.location.origin);


      if (event.origin !== window.location.origin) return;

      if (event.data === 'test-status-updated') {
        console.log("Test status updated, refreshing data...");

        fetchTestStatuses(); // Refresh test statuses
      }
    };


    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


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

  const openNewWindow = (url) => {
    window.open(
      url,
      '_blank',
      `width=${screen.width},height=${screen.height}`
    );
  };

  const handleActionClick = (path, openInNewWindow = false) => {
    if (!isSignedIn) {
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
      navigate("/sign-in");
      return;
    }

    if (openInNewWindow) {
      openNewWindow(path);
    } else {
      navigate(path);
    }
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
              const testStatus = resultLiveTests[test._id]?.status;
              const isPaused = testStatus === 'paused';
              const attempted = testStatus === 'completed' || isPaused;
              const showTakeTest = hasRallyPro && !attempted;
              const showViewResult = attempted;
              const hideActions = !hasRallyPro && !attempted;

              return (
                <div key={test._id} className="group">
                  <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-100">
                    <div className="bg-gradient-to-r from-[#131656] to-[#4f46e5] p-4 text-white animate-gradient-x">
                      <h3 className="text-md font-bold flex items-center justify-center text-center">
                        <span className="animate-pulse mr-2"><i className="bi bi-claude"></i></span>
                        {test.show_name}
                        <span className="animate-pulse ml-2"><i className="bi bi-claude"></i></span>

                      </h3>
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
                      {/* Take Test (New Window) */}
                      {!hideActions && showTakeTest && hasRallyPro && (
                        <button
                          onClick={() =>
                            handleActionClick(
                              `/homeliveinstruct/${test._id}/${user._id}`,
                              true
                            )
                          }
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                        >
                          <span className="mr-2">📝</span> Take Test
                        </button>
                      )}

                      {/* Resume Test (New Window - Paused Status) */}
                      {!hideActions && isPaused && hasRallyPro && (
                        <button
                          onClick={() =>
                            handleActionClick(
                              `/homelivemocktest/${test._id}/${user._id}`,
                              true
                            )
                          }
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
                        >
                          <span className="mr-2">⏱</span> Resume Test
                        </button>
                      )}

                      {utcNow && test.liveResult && attempted && hasRallyPro && (
                        !hideActions && showViewResult && !isPaused ? (
                          new Date(utcNow) > new Date(test.liveResult) ? (
                            <div className='flex flex-col  gap-2 sm:gap-4'>
                              <button
                                onClick={() => handleActionClick(`/homeliveresult/${test._id}`, false)}
                                className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg shadow-sm text-white bg-indigo-800 hover:bg-indigo-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                {/* <span className="mr-2 text-lg">📊</span>
                                <span className="font-medium">Result</span> */}
                                     <span className="mr-2">🏆</span> Leader Board

                              </button>
                              <button
                                // onClick={() => handleActionClick(`/homeSolution/${test._id}/${user._id}`, true)}
                                 onClick={() => handleActionClick(`/HomeliveresultPage/${test._id}/${user._id}`, true)}
                                className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                {/* <span className="mr-2 text-lg">🔍</span>
                                <span className="font-medium">Solution</span> */}
                                <span className="mr-2 text-lg">📊</span>
                                <span className="font-medium">view Result</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="text-center text-sm text-gray-500 py-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div className="flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Results on {formatDate(test.liveResult)}
                                </div>
                              </div>
                            </>
                          )
                        ) : null
                      )}
                      <div className='flex flex-col gap-2 sm:gap-4'>
                        {!isSignedIn && (
                          <button
                            onClick={() => navigate('/sign-in')}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
                          >
                            {/* <span className="mr-2">📊</span>View Results */}
                             <span className="mr-2">🏆</span> Leader Board

                          </button>
                        )}

                        {/* Non-Pro View Result (New Window) */}
                        {utcNow && test.liveResult && !hasRallyPro && (
                          <>
                            {new Date(utcNow) > new Date(test.liveResult) ? (
                              !hasRallyPro && (
                                <div>
                                  <button
                                    onClick={() =>
                                      handleActionClick(
                                        `/homeliveresult/${test._id}`,
                                        false
                                      )
                                    }
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
                                  >
                                    {/* <span className="mr-2">📊</span> Result */}
                                    <span className="mr-2">🏆</span> Leader Board

                                  </button>
                                </div>
                              )
                            ) : (
                              <div className="text-center text-sm text-gray-500 py-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div className="flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Results on {formatDate(test.liveResult)}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Non-Pro View Solution (New Window) */}
                        {utcNow &&
                          test.liveResult &&
                          new Date(utcNow) > new Date(test.liveResult) && // Added check
                          new Date(utcNow) < new Date(test.liveSolutionEndDate) &&
                          !hasRallyPro  && attempted && (
                            <div>
                              <button
                                 onClick={() => handleActionClick(`/HomeliveresultPage/${test._id}/${user._id}`, true)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"

                              // className="w-full flex items-center justify-center px-4 py-2 mt-2 border border-transparent rounded-lg shadow-sm text-white bg-[#131656] hover:bg-[#0e1142] transition-colors duration-200"
                              >
                                {/* <span className="mr-2">🔍</span>Solution */}
                                 <span className="mr-2">📊</span>View Result

                              </button>
                            </div>
                          )}
                      </div>
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
