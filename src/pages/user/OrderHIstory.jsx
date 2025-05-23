import React, { useContext, useEffect, useState } from "react";
import DashBoard from "./DashBoard";
import Api from '../../service/Api';
import { UserContext } from "../../context/UserProvider";
import { 
  ArrowPathIcon,
  ReceiptRefundIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const OrderHistory = () => {
  const [open, setOpen] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContext(UserContext);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const fetchPendingPayments = async () => {
    try {
      setRefreshing(true);
      const res = await Api.get(`orders/pending-payments/${user?._id}`);
      setPendingPayments(res.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPendingPayments();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchPendingPayments();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
          <ClockIcon className="h-4 w-4 mr-1" />
          {status}
        </span>
      );
    }
    if (statusLower === 'completed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckBadgeIcon className="h-4 w-4 mr-1" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <ReceiptRefundIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Pending Order History</h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors
                ${refreshing ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-400'}`}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="border-b border-gray-200 mb-6"></div>

          {loading && !refreshing ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <XCircleIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClockIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Orders</h3>
              <p className="text-gray-500">You don't have any pending payments at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPayments.map((payment) => (
              <div key={payment._id} className="border-1 border-red-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
                    {payment.courseName?.join(", ") || "Unnamed Course"}
                  </h3>
                  {getStatusBadge(payment.status)}
                </div>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <div className="grid grid-cols-1 gap-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900 break-all">{payment.orderId}</p>
                  </div>
          
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium text-gray-900">₹{payment.amount?.toLocaleString('en-IN') || '0'}</p>
                  </div>
          
                  <div>
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p className="font-medium text-gray-900">{formatDate(payment.purchaseDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;