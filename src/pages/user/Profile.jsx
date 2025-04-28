import React, { useContext, useEffect, useState } from 'react';
import DashBoard from './DashBoard';
import { FaEdit } from 'react-icons/fa';
import { useUser } from '@clerk/clerk-react';
import Api from '../../service/Api';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const { isSignedIn, user: clerkUser, isLoaded } = useUser(); // get Clerk user

  useEffect(() => {
    // Only run once Clerk has loaded and user is signed in
    if (!isLoaded || !isSignedIn) return;

    const fetchUserDetails = async () => {
      try {
        const clerkId = clerkUser.id;

        // Fetch user details from backend using Clerk's user ID
        const res = await Api.get(`/auth/getUserDetails/${clerkId}`);
        console.log('Fetched user from backend:', res.data);

        setUserDetails(res.data); // Set fetched user details to state
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    fetchUserDetails();
  }, [isLoaded, isSignedIn, clerkUser]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value
    });
  };

  const handleEditClick = async () => {
    if (isEditing) {
      // Save changes if editing, use POST to call /auth/login endpoint
      try {
        const clerkId = clerkUser.id;
        const res = await Api.put(`/auth/update-user/${clerkId}`, {
          email: userDetails.email,  // Send updated email, or other user data
          userId: clerkId,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phoneNumber: userDetails.phoneNumber,
          dateOfBirth: userDetails.dateOfBirth,
          address: userDetails.address,
          country: userDetails.country,
          state: userDetails.state,
          city: userDetails.city,
          postalCode: userDetails.postalCode,
        });

        console.log('User details updated and logged in:', res.data);
        setIsEditing(false); // Exit edit mode
      } catch (err) {
        console.error('Error updating user details:', err);
      }
    } else {
      setIsEditing(true); // Start editing
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
      {/* Main content */}
      <div className="p-6 md:ml-3 w-full transition-all duration-300">
        <div className="mt-2 w-full">
          <h1 className="text-2xl mb-4 font-bold">User Details</h1>

          {/* Conditional rendering if no user details exist */}
          {!userDetails.firstName && !isEditing ? (
            <div className="text-gray-500">
              No user details found. Click 'Edit Details' to add information.
            </div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userDetails.firstName}
                  placeholder="Enter First Name"
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userDetails.lastName}
                  placeholder="Enter Last Name"
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email id"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
                Phone Number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userDetails.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile Number"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={
                    userDetails.dateOfBirth
                      ? new Date(userDetails.dateOfBirth).toISOString().split('T')[0]
                      : ''
                  }                 
                   onChange={handleInputChange}
                  placeholder="Enter Date of Birth"
                  required
                  disabled={!isEditing}
                  max={new Date().toISOString().split('T')[0]} // 🔒 restrict to today or earlier
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <h1 className="font-semibold text-black col-span-2 text-xl mt-2">Address</h1>

              {/* Address Fields */}
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  placeholder="Enter Address"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-600">
                Country:
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={userDetails.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="state" className="block text-sm font-medium text-gray-600">
                  State:
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={userDetails.state}
                  onChange={handleInputChange}
                  placeholder="Enter State"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-600">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={userDetails.city}
                  onChange={handleInputChange}
                  placeholder="Enter City"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-600">
                Postal Code:
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={userDetails.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postalCode"
                  required
                  disabled={!isEditing}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Edit/Save Button */}
              <button
                type="button"
                onClick={handleEditClick}
                className="w-56 mt-4 py-2 px-4 border-1 border-indigo-600 text-indigo-600 hover:text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isEditing ? 'Save' : <><FaEdit className="inline-block mr-2" /> Edit Details</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
