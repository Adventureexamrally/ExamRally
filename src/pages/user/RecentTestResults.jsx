import React, { useState, useContext, useEffect } from 'react';
import DashBoard from './DashBoard';
import { useUser } from "@clerk/clerk-react";
import { UserContext } from '../../context/UserProvider';
import Api from '../../service/Api';

const RecentTestResults = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const { user } = useContext(UserContext); // Get user from context
  console.warn(user._id); // Logging the userId for debugging

  // Fetching recent test results when the component mounts
  useEffect(() => {
    if (user._id) {
      Api.get(`/results/${user._id}`) // Make sure your API endpoint is correct
        .then((res) => {
          console.warn(res.data); // Handle the response
        })
        .catch((err) => {
          console.error('Error fetching results:', err);
        });
    }
  }, [user]); // Only run this effect when the user changes

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
      <div>
        Recent Test Results
      </div>
    </div>
  );
};

export default RecentTestResults;
