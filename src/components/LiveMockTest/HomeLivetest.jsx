import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../service/Api';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { AccessTime, EmojiEvents } from '@mui/icons-material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoMdLock } from 'react-icons/io';
import { UserContext } from '../../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { fetchUtcNow } from '../../service/timeApi';
import Hometotaltest from './Hometotaltest';

const HomeLivetest = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [resultLiveTests, setResultLiveTests] = useState({});
  const [loading, setLoading] = useState(true);
  const [utcNow, setUtcNow] = useState(null);

  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [testsRes, currentTime] = await Promise.all([
          Api.get('exams/live-test'),
          fetchUtcNow(),
        ]);
        
        // Extract liveTest array from response
        const testsData = testsRes.data;
        setLiveTests(Array.isArray(testsData.liveTest) ? testsData.liveTest : []);

        setUtcNow(currentTime);
        console.warn('Server UTC Time:', currentTime.toISOString());
      } catch (err) {
        console.error('Error fetching data:', err);
        setLiveTests([]);
      } finally {
        setLoading(false);
        AOS.init({ duration: 2000 });
        AOS.refresh();
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!user?._id || !utcNow || liveTests.length === 0) return;

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
            storeTestStatus(test._id, statusUpdates[test._id]);
          }
        } catch (err) {
          const stored = getTestStatusFromStorage(test._id);
          if (stored) {
            statusUpdates[test._id] = stored;
          }
        }
      }
      
      setResultLiveTests(prev => ({ ...prev, ...statusUpdates }));
    };

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

  const formatCustomDate = (ds) => {
    if (!ds) return '';
    const d = new Date(ds);
    const day = d.getDate();
    const suffix =
      day > 3 && day < 21
        ? 'th'
        : day % 10 === 1
        ? 'st'
        : day % 10 === 2
        ? 'nd'
        : day % 10 === 3
        ? 'rd'
        : 'th';
    const month = d.toLocaleString('default', { month: 'long' });
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}${suffix} ${month} ${hours}:${minutes} ${ampm}`;
  };

  const openNewWindow = (url) => {
    window.open(
      url,
      '_blank',
      `noopener,noreferrer,width=${screen.width},height=${screen.height}`
    );
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
<div className="flex flex-col items-center">
  <Typography variant="h4" className="font-bold text-blue-800 mb-4 text-center">
    Live Test
  </Typography>
  <Divider className="mb-6 bg-blue-200 w-full max-w-7xl" />

  <div className="w-full flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl px-4 w-full">
      {liveTests.map((test) => {
        const res = resultLiveTests[test._id] || getTestStatusFromStorage(test._id);
        const status = res?.status;

        const start = new Date(test.livetestStartDate);
        const end = new Date(test.livetestEndDate);
        const resultTime = test.liveResult ? new Date(test.liveResult) : null;

        let buttonText = 'Take Test';
        let isButtonDisabled = false;
        let buttonColor = 'warning';

        // Check test status first (regardless of time)
        if (status === 'completed') {
          buttonText = `${formatCustomDate(test.liveResult)}`;
          buttonColor = 'success';
        } else if (status === 'paused') {
          buttonText = 'Resume';
          buttonColor = 'warning';
        } 

        // Check test time
      

        const handleClick = () => {
          if (!isSignedIn) {
            navigate('/sign-in');
            return;
          }

          if (buttonText === 'Resume') {
            openNewWindow(`/homelivemocktest/${test._id}/${user._id}`);
          } else if (buttonText === 'Take Test') {
            openNewWindow(`/homeliveinstruct/${test._id}/${user._id}`);
          }
        };

        return (
          <Card
            key={test._id}
            data-aos="fade-up"
            className="h-full flex flex-col shadow-lg rounded-xl border hover:shadow-xl transition"
          >
            <CardContent className="p-4 flex-grow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Typography variant="h6" className="font-bold text-blue-900">
                    {test.show_name}
                  </Typography>
                  <Typography variant="subtitle2" className="text-blue-700">
                    {test.subtitle || 'Live Test'}
                  </Typography>
                </div>
                <Chip label="Free" color="success" size="small" />
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center mb-2 text-gray-700">
                  <AccessTime className="text-blue-500 mr-2" fontSize="small" />
                  <Typography variant="body2" className="text-sm">
                    <strong>Test Window:</strong> {formatCustomDate(test.livetestStartDate)} – {formatCustomDate(test.livetestEndDate)}
                  </Typography>
                </div>
                <div className="flex items-center text-gray-700">
                  <EmojiEvents className="text-yellow-600 mr-2" fontSize="small" />
                  <Typography variant="body2" className="text-sm">
                    <strong>Results:</strong> {test.liveResult ? formatCustomDate(test.liveResult) : 'Not specified'}
                  </Typography>
                </div>
              </div>

              <Button
                fullWidth
                variant={isButtonDisabled ? 'outlined' : 'contained'}
                color={buttonColor}
                disabled={isButtonDisabled}
                className="font-bold py-2"
                onClick={handleClick}
                startIcon={isButtonDisabled && <IoMdLock />}
                size="small"
              >
                {buttonText}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
  <div className="w-full max-w-7xl px-4">
    <Hometotaltest/>
  </div>
</div>
  );
};

export default HomeLivetest;