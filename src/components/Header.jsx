import React from 'react';
import logo from "../assets/logo/logo.png";
import { Link } from 'react-router-dom';
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton, SignUp,useUser  } from "@clerk/clerk-react";
import CustomUserMenu from './CustomUserButton';



const Header = () => {

  const {isSignedIn, user, isLoaded } = useUser();

  // if (!user) {
  //   return <div>Loading user info...</div>;
  // }
  // console.log(user)
  return (
    <header className="bg-white shadow-md">
      {/* <p>{user.firstName}</p> */}
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Brand Logo" className="h-10" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-800 text-white px-4 py-1 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        {/* Login and Register Buttons */}
        <div className="hidden md:flex items-center space-x-4 flex-row">
          {/* <button
            type="button"
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            <Link to='/sigin'>Login</Link>
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Link to='/sign-up'>Register</Link>
          </button> */}
        

         
          
           <Link to='https://t.me/examrally'> <i className="bi bi-telegram text-2xl" style={{color:"	#24A1DE"}}> </i>Join Telegram
           </Link>
           {/* <p>{!user ? "":user.firstName}</p> */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            {/* <UserButton /> */}
            <CustomUserMenu />
          </SignedIn>
         
          </div>

        
         
  
      </div>
    </header>
  );
};

export default Header;
