import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider';
import {
  FaUser, FaClipboardList, FaShoppingCart, FaRegBookmark,
  FaGift, FaLaptop, FaExclamationTriangle, FaTimes, FaBars,
} from 'react-icons/fa';

// ─── nav items config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'profile', label: 'My Profile', icon: FaUser, path: '/profile' },
  { key: 'recent-test', label: 'Recent Test Results', icon: FaClipboardList, path: '/profile/recent-test-results' },
  { key: 'purchase-history', label: 'Purchase History', icon: FaShoppingCart, path: '/profile/purchase-history' },
  { key: 'order-history', label: 'Order History', icon: FaRegBookmark, path: '/profile/order-history' },
  { key: 'refer-and-earn', label: 'Refer & Earn', icon: FaGift, path: '/profile/refer-and-earn' },
  { key: 'active-devices-browser', label: 'Active Devices', icon: FaLaptop, path: '/profile/active-devices-browser' },
  { key: 'error-report', label: 'Error Report', icon: FaExclamationTriangle, path: '/profile/error-report' },
];

const PATH_TO_KEY = {
  'recent-test-results': 'recent-test',
  'purchase-history': 'purchase-history',
  'order-history': 'order-history',
  'refer-and-earn': 'refer-and-earn',
  'active-devices-browser': 'active-devices-browser',
  'error-report': 'error-report',
};

export default function DashBoard({ handleDrawerToggle, open, setOpen }) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Derive active key directly from URL — no localStorage needed
  const getActiveKey = (pathname) => {
    const segment = pathname.split('/').find((p) => PATH_TO_KEY[p]);
    return segment ? PATH_TO_KEY[segment] : 'profile';
  };
  const [activeKey, setActiveKey] = useState(() => getActiveKey(location.pathname));

  useEffect(() => {
    setActiveKey(getActiveKey(location.pathname));
  }, [location.pathname]);

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';

  return (
    <>
      {/* ── Mobile backdrop ────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-72 bg-white shadow-xl
          flex flex-col transition-transform duration-300
          md:relative md:translate-x-0 md:z-auto md:shadow-none md:border-r md:border-gray-100
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header / close */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 md:hidden">
          <span className="font-bold text-gray-700 text-sm">My Account</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <FaTimes />
          </button>
        </div>

        {/* Avatar card */}
        <div className="mx-1 mt-4 mb-2 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 flex items-center gap-3">
          <Link to="/profile" onClick={() => setOpen(false)}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-bold shadow">
                {initials}
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">
              {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
              {user?.role || 'Student'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-gray-100 my-1" />

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => {
            const isActive = activeKey === key;
            return (
              <Link
                key={key}
                to={path}
                onClick={() => { setOpen(false); }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 group
                  ${isActive
                    ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                  }
                `}
              >
                <span className={`flex-shrink-0 text-[15px] transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-500'}`}>
                  <Icon />
                </span>
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center">ExamRally · Student Portal</p>
        </div>
      </aside>

      {/* ── Mobile hamburger (shown in page content, outside sidebar) ── */}
      <div className="fixed bottom-5 left-4 z-20 md:hidden">
        <button
          onClick={handleDrawerToggle}
          className="w-12 h-12 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition"
        >
          <FaBars className="text-lg" />
        </button>
      </div>
    </>
  );
}
