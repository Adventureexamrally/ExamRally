import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import DashBoard from "./DashBoard";
import Api from "../../service/Api";
import { UserContext } from "../../context/UserProvider";
import {
  FaShoppingBag,
  FaFilePdf,
  FaCalendarAlt,
  FaRupeeSign,
  FaSync,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "N/A";

const isExpired = (dateStr) => dateStr && new Date(dateStr) < new Date();

// ─── Course card ──────────────────────────────────────────────────────────────
const CourseCard = ({ item }) => {
  const name = Array.isArray(item?.courseName)
    ? item.courseName.filter(Boolean).join(", ") || "Subscription Plan"
    : item?.courseName || item?.name || "Unknown Purchase";

  return (
    <div className="bg-white rounded-xl border border-l-4 border-l-green-500 border-gray-100 shadow-sm hover:shadow-md transition p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
            <FaShoppingBag className="text-green-500 text-sm" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm truncate">{name}</h3>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 flex-shrink-0">
          <FaCheckCircle className="text-xs" /> Purchased
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <FaCalendarAlt /> {fmt(item?.purchaseDate)}
        </span>
        {item?.amount != null && (
          <span className="flex items-center gap-1">
            <FaRupeeSign /> {item.amount}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Subscription card ────────────────────────────────────────────────────────
const SubscriptionCard = ({ sub }) => {
  const expired = isExpired(sub?.expiryDate);
  const statusColor = expired ? "red" : "blue";
  const StatusIcon = expired ? FaTimesCircle : FaClock;

  return (
    <div className={`bg-white rounded-xl border border-l-4 border-l-${statusColor}-500 border-gray-100 shadow-sm hover:shadow-md transition p-4`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`p-2 bg-${statusColor}-50 rounded-lg flex-shrink-0`}>
            <FaFilePdf className={`text-${statusColor}-500 text-sm`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm">
              PDF Subscription — {sub?.plan?.months}
              {sub?.plan?.months === 1 ? " Month" : " Months"}
            </h3>
            {sub?.isRenewal && (
              <span className="text-xs text-gray-400">Renewal</span>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-${statusColor}-50 text-${statusColor}-700 flex-shrink-0`}>
          <StatusIcon className="text-xs" />
          {expired ? "Expired" : "Active"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <FaCalendarAlt /> Purchased: {fmt(sub?.purchaseDate)}
        </span>
        <span className="flex items-center gap-1">
          <FaClock /> Expires: {fmt(sub?.expiryDate)}
        </span>
        {sub?.plan?.discountedPrice != null && (
          <span className="flex items-center gap-1">
            <FaRupeeSign /> {sub.plan.discountedPrice}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const PurchaseHistory = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all | courses | subscriptions

  const fetchSubscriptions = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await Api.get(`pdf-subscriptions/history/${user._id}`).catch(() => ({ data: [] }));
      setSubscriptions(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load subscription history.");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

  // merge + sort exactly like mobile app
  const courses = useMemo(() => user?.enrolledCourses || [], [user]);
  const userSubs = useMemo(() => user?.subscriptions || [], [user]);

  const allItems = useMemo(() => {
    const tagged = [
      ...courses.map((c) => ({ ...c, _type: "course" })),
      ...subscriptions.map((s) => ({ ...s, _type: "subscription" })),
      ...userSubs.map((s) => ({ ...s, _type: "subscription" })),
    ];
    // deduplicate subscriptions by _id
    const seen = new Set();
    return tagged
      .filter((item) => {
        if (!item._id) return true;
        if (seen.has(String(item._id))) return false;
        seen.add(String(item._id));
        return true;
      })
      .sort((a, b) => {
        const dA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0;
        const dB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0;
        return dB - dA;
      });
  }, [courses, subscriptions, userSubs]);

  const filtered = useMemo(() => {
    if (activeTab === "courses") return allItems.filter((i) => i._type === "course");
    if (activeTab === "subscriptions") return allItems.filter((i) => i._type === "subscription");
    return allItems;
  }, [allItems, activeTab]);

  const courseCount = allItems.filter((i) => i._type === "course").length;
  const subCount = allItems.filter((i) => i._type === "subscription").length;

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={() => setOpen(!open)} open={open} setOpen={setOpen} />

      <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Purchase History</h2>
            <p className="text-sm text-gray-500 mt-0.5">All your course purchases & subscriptions</p>
          </div>
          <button
            onClick={fetchSubscriptions}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:shadow transition"
          >
            <FaSync className={loading ? "animate-spin text-xs" : "text-xs"} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "all", label: `All (${allItems.length})` },
            { key: "courses", label: `Courses (${courseCount})`, Icon: FaShoppingBag },
            { key: "subscriptions", label: `Subscriptions (${subCount})`, Icon: FaFilePdf },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === key
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {Icon && <Icon className="text-xs" />}
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-52">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-52 gap-3">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={fetchSubscriptions}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700"
            >
              <FaSync /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 bg-white rounded-xl border border-gray-100 gap-3">
            <div className="text-4xl">🧾</div>
            <p className="text-gray-500 font-medium text-sm">No purchases found</p>
            <p className="text-gray-400 text-xs">
              {activeTab === "all"
                ? "You haven't made any purchases yet."
                : activeTab === "courses"
                  ? "No course purchases found."
                  : "No subscription history found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) =>
              item._type === "subscription" ? (
                <SubscriptionCard key={item._id || i} sub={item} />
              ) : (
                <CourseCard key={item._id || i} item={item} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
