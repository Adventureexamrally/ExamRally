import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const TrendingPackages = () => {
    const [trending, setTrending] = useState([
        {
            title: "RRB PO & RRB Clerk Combo",
            futures: [
                "Exact Exam Level Questions",
                "New pattern Questions",
                "Detailed Solutions",
                "24*7 Access",
                "All India Ranking"
            ]
        },
        {
            title: "RRB PO & RRB Clerk Combo",
            futures: [
                "Exact Exam Level Questions",
                "New pattern Questions",
                "Detailed Solutions",
                "24*7 Access",
                "All India Ranking"
            ]
        },
        {
            title: "RRB PO & RRB Clerk Combo",
            futures: [
                "Exact Exam Level Questions",
                "New pattern Questions",
                "Detailed Solutions",
                "24*7 Access",
                "All India Ranking"
            ]
        },
        {
            title: "RRB PO & RRB Clerk Combo",
            futures: [
                "Exact Exam Level Questions",
                "New pattern Questions",
                "Detailed Solutions",
                "24*7 Access",
                "All India Ranking"
            ]
        },
    ]);

    return (
        <div className='my-7 p-6 rounded-2xl shadow-xl bg-white'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-semibold text-gray-800'>Trending Packages</h1>
                <Link to='/All-Packages' className='text-blue-500 font-semibold hover:underline'>
                    View More
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
                {trending.map((pkg, index) => (
                    <div key={index} className="group">
                        <div className="bg-gray-100 border border-blue-500 p-6 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">{pkg.title}</h2>
                            <ul className="text-gray-600 space-y-2 mb-4">
                                {pkg.futures.map((fu, i) => (
                                    <li key={i} className="flex items-center text-sm">
                                        <span className="mr-2">✔️</span>{fu}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300">
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrendingPackages;
