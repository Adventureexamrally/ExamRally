import React, { useEffect } from 'react'
import { createContext, useState } from 'react';
import Api from '../service/Api';
import { useUser } from '@clerk/clerk-react';

export  const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isSignedIn, user: clerkUser, isLoaded } = useUser(); // get Clerk user

  useEffect(() => {
    // Only run once Clerk has loaded and user is signed in
    if (!isLoaded || !isSignedIn) return;

    const fetchUserDetails = async () => {
      try {
        const clerkId = clerkUser.id;

        const res = await Api.get(`/auth/getUserDetails/${clerkId}`);
        setUser(res.data);
        console.log("Fetched user from backend:", res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [isLoaded, isSignedIn, clerkUser]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

