import React, { useState } from 'react';
import DashBoard from './DashBoard';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: 'test',
    email: 'test@gmail.com',
    mobile: 1234567893,
    gender: 'female',
    DOB: "YYYY-xx-yy",
    Address: {
      district: 'XXXX',
      state: 'YYYYYY',
      city: 'XXXXX',
      pin: 123456,
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
      {/* Main content */}
      <div className="p-6 md:ml-3 w-full transition-all duration-300">
        {/* App Bar for small screens */}

        {/* Main content */}
        <div className="mt-2 w-full">
          <h1 className="text-2xl mb-4 font-bold">User Details</h1>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                User Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                placeholder="Enter User Name"
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
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
                Mobile:
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={userDetails.mobile}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                required
                disabled={!isEditing}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={userDetails.gender}
                onChange={handleInputChange}
                required
                disabled={!isEditing}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label htmlFor="DOB" className="block text-sm font-medium text-gray-600">
                Date of Birth:
              </label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={userDetails.DOB}
                onChange={handleInputChange}
                placeholder="Enter Date of Birth"
                required
                disabled={!isEditing}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <h1 className='font-semibold text-black col-span-2 text-xl mt-2'>Address</h1>
            {/* Address Fields */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="district" className="block text-sm font-medium text-gray-600">
                District:
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={userDetails.Address.district}
                onChange={handleInputChange}
                placeholder="Enter District"
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
                value={userDetails.Address.state}
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
                value={userDetails.Address.city}
                onChange={handleInputChange}
                placeholder="Enter City"
                required
                disabled={!isEditing}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-600">
                PIN:
              </label>
              <input
                type="text"
                id="pin"
                name="pin"
                value={userDetails.Address.pin}
                onChange={handleInputChange}
                placeholder="Enter PIN"
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
