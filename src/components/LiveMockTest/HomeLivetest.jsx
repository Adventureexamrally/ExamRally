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
  Box,
  Grid,
  CircularProgress,
  Stack,
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

useEffect(() => {
  window.addEventListener("focus", fetchTestStatuses);
  return () => {
    window.removeEventListener("focus", fetchTestStatuses);
  };
}, []);

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
    if (event.data === 'refresh-needed') {
      fetchTestStatuses();
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
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

  window.addEventListener("message", (event) => {
  if (event.data.redirect) {
    // Perform redirect in the original tab
    window.location.href = "/homelivetest";
  }
});

  const openNewWindow = (url) => {
    window.open(
      url,
      '_blank',
      `noopener,noreferrer,width=${screen.width},height=${screen.height}`
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={4} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1"
        className='mt-3'
        sx={{ 
          fontWeight: 'bold', 
          color: 'success.main', 
          textAlign: 'center',
          fontSize: { xs: '1.75rem', sm: '2rem' },
        
        }}>
          Live Tests
        </Typography>
        
        <Divider sx={{ 
          bgcolor: 'success.main', 
          height: 2,
          width: '100%',
          mx: 'auto'
        }} />
      </Stack>

      <Grid container spacing={3} justifyContent="center">
      {utcNow && liveTests.map((test) => {
  const res = resultLiveTests[test._id] || getTestStatusFromStorage(test._id);
  const status = res?.status;


       const start = new Date(test.livetestStartDate);
const end = new Date(test.livetestEndDate);
const resultTime = test.liveResult ? new Date(test.liveResult) : null;
const utcNow = new Date(); // Current UTC time

console.log("resultTime", resultTime, start, end, utcNow);

let buttonText = '';
let isButtonDisabled = false;
let buttonColor = '';

if (start > utcNow) {
    // Test has not started yet
    buttonText = 'Coming Soon';
    isButtonDisabled = true;
    buttonColor = 'secondary'; // You can change this to your preferred style
} else {
    // Test has started or is ongoing
    buttonText = 'Take Test';
    isButtonDisabled = false;
    buttonColor = 'warning';
}

          
          // Check test status first (regardless of time)
          if (status === 'completed') {
            buttonText = `${formatCustomDate(test.liveResult)}`;
            buttonColor = 'success';
          } else if (status === 'paused') {
            buttonText = 'Resume';
            buttonColor = 'warning';
          } 

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
            <Grid item key={test._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                data-aos="fade-up"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold', 
                        color: 'success.dark',
                        fontSize: '1.1rem'
                      }}>
                        {test.show_name}
                      </Typography>
                     
                    </Box>
                    <Chip 
                    
                      label="Free" 
                      size="small" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }} 
                    
                    />
                  </Box>

                  <Box className="text-[#81346b] bg-[#fedfe7]"
                  sx={{ 
                    // bgcolor: 'primary.light', 
                    borderRadius: 2, 
                    p: 2, 
                    mb: 3,
                    flexGrow: 1
                  }}>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>Test Window:</Box> {formatCustomDate(test.livetestStartDate)} – {formatCustomDate(test.livetestEndDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEvents fontSize="small" sx={{ color: 'warning.main', mr: 1 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>Results:</Box> {test.liveResult ? formatCustomDate(test.liveResult) : 'Not specified'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    fullWidth
                    variant={isButtonDisabled ? 'outlined' : 'contained'}
                    color={buttonColor}
                    disabled={isButtonDisabled}
                    onClick={handleClick}
                    startIcon={isButtonDisabled && <IoMdLock />}
                    size="medium"
                    sx={{
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    {buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ width: '100%', mt: 6 }}>
        <Hometotaltest/>
      </Box>
    </Box>
  );
};

export default HomeLivetest;