import React, { useState, useContext } from 'react';
import DashBoard from './DashBoard';
import { useUser } from "@clerk/clerk-react";
import { UserContext } from '../../context/UserProvider';
import { FiMonitor, FiGlobe, FiClock, FiUser, FiHardDrive, FiKey, FiTrash2 } from 'react-icons/fi';

const ActiveDevicesBrowser = () => {
    const [open, setOpen] = useState(false);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const { user } = useContext(UserContext);
    const devices = user?.device || [];

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Function to extract device/browser name from userAgent
    const getDeviceName = (userAgent) => {
        if (!userAgent) return 'Unknown Device';

        // Browser detection
        if (userAgent.includes('Chrome')) return 'Chrome Browser';
        if (userAgent.includes('Firefox')) return 'Firefox Browser';
        if (userAgent.includes('Safari')) return 'Safari Browser';
        if (userAgent.includes('Edge')) return 'Edge Browser';
        if (userAgent.includes('Opera')) return 'Opera Browser';
        if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';

        // Device detection
        if (userAgent.includes('Android')) return 'Android Device';
        if (userAgent.includes('iPhone')) return 'iPhone';
        if (userAgent.includes('iPad')) return 'iPad';
        if (userAgent.includes('Windows')) return 'Windows PC';
        if (userAgent.includes('Macintosh')) return 'Mac';
        if (userAgent.includes('Linux')) return 'Linux Device';

        return 'Unknown Device';
    };

    // Function to extract operating system
    const getOperatingSystem = (userAgent) => {
        if (!userAgent) return 'Unknown OS';

        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac OS')) return 'Mac OS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';

        return 'Unknown OS';
    };

    return (
        <div className="flex flex-col md:flex-row">
            <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Active Devices</h1>
                
                {devices.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-600">No active devices found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {devices.map((device, index) => (
                            <div key={device._id || index} className="bg-white rounded-lg shadow overflow-hidden">
                                {/* Device Header */}
                                <div className={`p-4 flex items-center justify-between ${index === 0 ? 'bg-green-500' : 'bg-gray-600'}`}>
                                    <div className="flex items-center">
                                        <FiMonitor className="text-white text-2xl mr-3" />
                                        <div>
                                            <h2 className="text-white text-xl font-semibold">
                                                {index === 0 ? 'Current Device' : `Device ${index + 1}`}
                                            </h2>
                                            <p className="text-white text-opacity-80 text-sm">
                                                {getDeviceName(device.userAgent)}
                                            </p>
                                        </div>
                                    </div>
                                    {index !== 0 && (
                                        <button className="text-white hover:text-red-200 transition">
                                            <FiTrash2 className="text-xl" />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Device Details */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Last Login */}
                                        <div className="flex items-start">
                                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                                <FiClock className="text-purple-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-gray-500 text-sm font-medium">Last Login</h3>
                                                <p className="text-gray-800">
                                                    {formatDate(device.lastLogin)}
                                                </p>
                                            </div>
                                        </div>
                                
                                        {/* Browser/Device */}
                                        <div className="flex items-start">
                                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                                <FiHardDrive className="text-green-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-gray-500 text-sm font-medium">Browser/Device</h3>
                                                <p className="text-gray-800">{getDeviceName(device.userAgent)}</p>
                                            </div>
                                        </div>

                                        {/* Operating System */}
                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <FiMonitor className="text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-gray-500 text-sm font-medium">Operating System</h3>
                                                <p className="text-gray-800">{getOperatingSystem(device.userAgent)}</p>
                                            </div>
                                        </div>

                                       
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveDevicesBrowser;