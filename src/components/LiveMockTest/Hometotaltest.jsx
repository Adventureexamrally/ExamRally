import React, { useEffect, useState } from 'react';
import { fetchUtcNow } from '../../service/timeApi';
import Api from '../../service/Api';
import { Link, useNavigate } from 'react-router-dom';

const HomeTotalTest = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [utcNow, setUtcNow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);

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

  const openModal = (test) => {
    setSelectedTest(test);
   console.log(test?._id);
   useNavigate(`/livemocktest/${test?._id}`);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Live Tests Overview</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          {liveTests.length === 0 ? (
            <div className="col-12 text-center py-4">
              <p className="text-muted">No live tests available at the moment.</p>
            </div>
          ) : (
            liveTests.map((test) => (
              <div className="col-md-4 mb-4" key={test._id}>
                <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{test.show_name}</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="text-muted">Test Window</h6>
                      <p className="mb-1">
                        <i className="bi bi-calendar-event me-2"></i>
                        {formatDate(test.livetestStartDate)} - {formatDate(test.livetestEndDate)}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h6 className="text-muted">Results Available</h6>
                      <p>
                        <i className="bi bi-clock-history me-2"></i>
                        {test.liveResult ? formatDate(test.liveResult) : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <Link
                      to={`/homeliveresult/${test._id}`}
                      className="btn btn-primary w-100"
                    >
                      <i className="bi bi-eye me-2"></i>View Details
                    </Link>
                   
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

   
    </div>
  );
};

export default HomeTotalTest;