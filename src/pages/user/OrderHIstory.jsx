import React, { useContext, useEffect, useState, useCallback } from "react";
import DashBoard from "./DashBoard";
import Api from "../../service/Api";
import { UserContext } from "../../context/UserProvider";
import {
  FaReceipt, FaSync, FaClock, FaCheckCircle, FaTimesCircle,
  FaRupeeSign, FaCalendarAlt, FaHashtag, FaBoxOpen,
} from "react-icons/fa";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
    : "N/A";

const STATUS_MAP = {
  pending: { label: "Pending", icon: FaClock, cls: "bg-amber-50  text-amber-700  border-amber-200" },
  completed: { label: "Completed", icon: FaCheckCircle, cls: "bg-green-50  text-green-700  border-green-200" },
  failed: { label: "Failed", icon: FaTimesCircle, cls: "bg-red-50    text-red-700    border-red-200" },
};

const StatusBadge = ({ status = "" }) => {
  const key = status.toLowerCase();
  const { label, icon: Icon, cls } = STATUS_MAP[key] || {
    label: status, icon: null, cls: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {Icon && <Icon className="text-xs" />}
      {label}
    </span>
  );
};

const OrderCard = ({ payment }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
    {/* Header */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
          <FaReceipt className="text-indigo-500 text-sm" />
        </div>
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {Array.isArray(payment.courseName)
            ? payment.courseName.filter(Boolean).join(", ")
            : payment.courseName || "Unnamed Course"}
        </h3>
      </div>
      <StatusBadge status={payment.status} />
    </div>

    <div className="border-t border-gray-100 my-3" />

    {/* Details grid */}
    <div className="grid grid-cols-1 gap-2">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaHashtag className="flex-shrink-0 text-gray-400" />
        <span className="font-medium text-gray-700 truncate">{payment.orderId || "N/A"}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaRupeeSign className="flex-shrink-0 text-gray-400" />
        <span className="font-medium text-gray-700">
          ₹{payment.amount?.toLocaleString("en-IN") || "0"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaCalendarAlt className="flex-shrink-0 text-gray-400" />
        <span className="font-medium text-gray-700">{fmt(payment.purchaseDate || payment.createdAt)}</span>
      </div>
    </div>
  </div>
);

const OrderHistory = () => {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(UserContext);

  const fetchPayments = useCallback(async () => {
    if (!user?._id) return;
    setRefreshing(true);
    setError("");
    try {
      const res = await Api.get(`orders/pending-payments/${user._id}`);
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // 404 just means no pending orders — treat as empty, not an error
      if (err?.response?.status === 404) {
        setPayments([]);
      } else {
        setError(err?.response?.data?.message || err.message || "Failed to load orders.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={() => setOpen(!open)} open={open} setOpen={setOpen} />

      <div className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
              <p className="text-sm text-gray-500 mt-0.5">Track your pending & recent payment orders</p>
            </div>
            <button
              onClick={fetchPayments}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:shadow transition"
            >
              <FaSync className={`text-xs ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {/* States */}
          {loading ? (
            <div className="flex justify-center items-center h-52">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-52 bg-white rounded-2xl border border-gray-100 gap-3">
              <FaTimesCircle className="text-red-400 text-4xl" />
              <p className="text-sm font-medium text-gray-700">{error}</p>
              <button
                onClick={fetchPayments}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700"
              >
                <FaSync /> Try Again
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 bg-white rounded-2xl border border-gray-100 gap-3">
              <FaBoxOpen className="text-gray-300 text-5xl" />
              <p className="text-gray-500 font-medium text-sm">No pending orders found</p>
              <p className="text-gray-400 text-xs">All your orders have been processed, or you haven't made any yet.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-4">{payments.length} order{payments.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {payments.map((p) => (
                  <OrderCard key={p._id} payment={p} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderHistory;