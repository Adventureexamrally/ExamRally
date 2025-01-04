import React from "react";
import sbi from "../assets/logo/sbi.png";
import rrb from "../assets/logo/rrb.png";
import ibps from "../assets/logo/ibps.png";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Trending Links */}
      <div className="mb-4 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll text-sm text-blue-600 flex gap-8">
          <a href="#" className="hover:underline">Clerk Notification</a>
          <a href="#" className="hover:underline">SBI JA Previous Year Cut-off</a>
          <a href="#" className="hover:underline">Descriptive Writing Mock Test</a>
          <a href="#" className="hover:underline">Current Affairs</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Popular Products */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-3">Popular Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button className="bg-orange-100 p-2 rounded text-center">PDF Course</button>
            <button className="bg-purple-100 p-2 rounded text-center">Mock Tests</button>
            <button className="bg-pink-100 p-2 rounded text-center">GOAT</button>
            <button className="bg-teal-100 p-2 rounded text-center">Descriptive</button>
            <button className="bg-green-100 p-2 rounded text-center">Daily Current Affairs</button>
            <button className="bg-red-100 p-2 rounded text-center">Free PDF</button>
          </div>
        </div>

        {/* Free Materials */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-3">Free Materials</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button className="bg-indigo-100 p-2 rounded text-center">Speed Test</button>
            <button className="bg-gray-100 p-2 rounded text-center">Practice Quiz</button>
            <button className="bg-yellow-100 p-2 rounded text-center">Daily Current Affairs</button>
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-3">Plans</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-100 p-2 rounded text-center">Super Plan</button>
            <button className="bg-purple-100 p-2 rounded text-center">Platinum Mock</button>
            <button className="bg-pink-100 p-2 rounded text-center">PDF Course</button>
            <button className="bg-gray-100 p-2 rounded text-center">All Combo</button>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Upcoming Exams</h3>
          <a href="#" className="text-blue-600 hover:underline">View More</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Exam Card */}
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center">
            <img 
              src={sbi} 
              alt="SBI JA Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" 
            />
            <p className="font-medium">SBI JA</p>
          </div>
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center">
            <img 
              src={sbi} 
              alt="SBI PO Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" 
            />
            <p className="font-medium">SBI PO</p>
          </div>
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center">
            <img 
              src={ibps} 
              alt="IBPS Clerk Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" 
            />
            <p className="font-medium">IBPS Clerk</p>
          </div>
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center">
            <img 
              src={ibps} 
              alt="IBPS PO Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" 
            />
            <p className="font-medium">IBPS PO</p>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mt-4">
        <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 text-white p-6 rounded shadow text-center">
          <h2 className="text-3xl font-bold mb-3">New Year Special Offer</h2>
          <p className="text-lg">GA Hustle Batch by Aditya Sir</p>
          <p className="mt-1">Complete Banking Awareness & Current Affairs Batch</p>
          <p className="mt-3 text-yellow-300 font-bold text-2xl">
            ₹539 <span className="text-sm text-white">with code NEWYEAR</span>
          </p>
          <button className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
