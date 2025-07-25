// src/context/UserContext.js
import React, { useEffect, useState, createContext } from 'react';
import Api from '../service/Api'
import { useUser } from '@clerk/clerk-react';
import { fetchUtcNow } from '../service/timeApi'; // 👈 your existing time fetcher

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [utcNow, setUtcNow] = useState(null); // 👈 Add UTC state

  const { isSignedIn, user: clerkUser, isLoaded } = useUser();

  // 🔁 Fetch user details from backend
  const fetchUserDetails = async () => {
    try {
      const clerkId = clerkUser.id;
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      const res = await Api.get(`/auth/getUserDetails/${clerkId}/${email}`);
      setUser(res.data);
      console.log("Fetched user from backend:", res.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  // 🕒 Fetch UTC time once when signed in
  const fetchUtcTimeOnce = async () => {
    try {
      const time = await fetchUtcNow("UserProvider");
      setUtcNow(time);
      console.log("Fetched UTC time:", time.toISOString());
    } catch (err) {
      console.error("Failed to fetch UTC time:", err);
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetchUserDetails();
    fetchUtcTimeOnce(); // 👈 Fetch once only when user is loaded
  }, [isLoaded, isSignedIn, clerkUser]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: fetchUserDetails, utcNow }}>
      {children}
    </UserContext.Provider>
  );
};
