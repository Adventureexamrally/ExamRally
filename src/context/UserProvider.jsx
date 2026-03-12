import React, { useEffect, useState, createContext } from 'react';
import Api from '../service/Api';
import { useUser, useClerk } from '@clerk/clerk-react';
import { fetchUtcNow } from '../service/timeApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, fetchUserResults, fetchUserPDFResults } from '../slice/userSlice';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [utcNow, setUtcNow] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [lastSessionCheck, setLastSessionCheck] = useState(0);

  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(clearUser());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Token expired/Unauthorized. Logging out...");
      handleLogout();
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [signOut]);

  const fetchUserDetails = async () => {
    if (!clerkUser) return;
    setIsFetchingUser(true);
    try {
      const clerkId = clerkUser.id;
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      const res = await Api.get(`/auth/getUserDetails/${clerkId}/${email}`);
      dispatch(setUser(res.data));
      if (res.data?._id) {
          dispatch(fetchUserResults(res.data._id));
          dispatch(fetchUserPDFResults(res.data._id));
      }
      console.log("Synced user with Redux:", res.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    // 1. window.opener message listener (legacy/fallback)
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'test-status-updated' || event.data === 'refresh-needed') {
        console.log("Received status update signal via postMessage, refreshing...");
        if (user?._id) {
          dispatch(fetchUserResults(user._id));
          dispatch(fetchUserPDFResults(user._id));
        }
      }
    };

    // 2. BroadcastChannel for robust cross-tab sync
    const channel = new BroadcastChannel('exam-status-channel');
    channel.onmessage = (event) => {
      console.log("Received status update signal via BroadcastChannel:", event.data);
      if (event.data?.type === 'test-status-updated') {
        if (user?._id) {
          dispatch(fetchUserResults(user._id));
          dispatch(fetchUserPDFResults(user._id));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [user?._id, dispatch]);

  const fetchUtcTimeOnce = async () => {
    try {
      const time = await fetchUtcNow("UserProvider");
      setUtcNow(time);
    } catch (err) {
      console.error("Failed to fetch UTC time:", err);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      dispatch(clearUser());
      return;
    }

    fetchUserDetails();
    fetchUtcTimeOnce();
  }, [isLoaded, isSignedIn, clerkUser]);

  return (
    <UserContext.Provider value={{ user, setUser: (u) => dispatch(setUser(u)), refreshUser: fetchUserDetails, logout: handleLogout, utcNow, isFetchingUser }}>
      {children}
    </UserContext.Provider>
  );
};
