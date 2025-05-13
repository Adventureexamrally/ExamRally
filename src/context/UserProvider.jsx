import React, { useEffect } from 'react'
import { createContext, useState } from 'react';
import Api from '../service/Api';
import { useUser } from '@clerk/clerk-react';

export  const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isSignedIn, user: clerkUser, isLoaded } = useUser(); // get Clerk user


    const fetchUserDetails = async () => {
      try {
        const clerkId = clerkUser.id;

        const res = await Api.get(`/auth/getUserDetails/${clerkId}`);
        console.log("res",res.data);
        
        setUser(res.data);
        console.log("Fetched user from backend:", res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
  useEffect(() => {
    // Only run once Clerk has loaded and user is signed in
    if (!isLoaded || !isSignedIn) return;
    fetchUserDetails();
  }, [isLoaded, isSignedIn, clerkUser]);
  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

