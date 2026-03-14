import React, { useContext, useState, useCallback, useEffect } from "react";
import DashBoard from "./DashBoard";
import { UserContext } from "../../context/UserProvider";
import {
  FaGift, FaCopy, FaCheck, FaWhatsapp, FaTwitter,
  FaUsers, FaTrophy, FaShareAlt, FaStar, FaCoins, FaClipboardList
} from "react-icons/fa";
import Api from "../../service/Api";

const STEPS = [
  { icon: "📤", title: "Share Your Code", desc: "Share your unique referral code or link with friends." },
  { icon: "📝", title: "Friend Signs Up", desc: "Your friend signs up using your referral code." },
  { icon: "🎁", title: "Both Get Rewarded", desc: "You and your friend both earn exclusive rewards!" },
];

const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-3 bg-white rounded-xl border border-${color}-100 shadow-sm p-4`}>
    <div className={`p-2.5 rounded-xl bg-${color}-50`}>
      <Icon className={`text-${color}-500 text-lg`} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-xl font-extrabold text-${color}-600`}>{value}</p>
    </div>
  </div>
);

const ReferAndEarn = () => {
  const [open, setOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await Api.get("/referral/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching referral stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const referralCode = stats?.referralCode || user?.referralCode || "—";
  const referralCount = stats?.referralCount ?? user?.referralCount ?? 0;
  const coinBalance = stats?.coins ?? user?.coins ?? 0;
  const history = stats?.referralHistory || [];

  const referralLink = referralCode !== "—"
    ? `${window.location.origin}/sign-up?ref=${referralCode}`
    : "";

  const copyText = useCallback(async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, []);

  const shareViaWhatsApp = () => {
    const msg = encodeURIComponent(
      `🎓 Join me on ExamRally — the best exam prep platform!\nUse my referral code *${referralCode}* to sign up and get rewards.\n👉 ${referralLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const shareViaTwitter = () => {
    const msg = encodeURIComponent(
      `Join me on ExamRally! Use my referral code ${referralCode} to sign up 🎓 ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${msg}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Join ExamRally!", text: `Use my code ${referralCode}`, url: referralLink }); }
      catch { }
    } else {
      copyText(referralLink, "link");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={() => setOpen(!open)} open={open} setOpen={setOpen} />

      <div className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Hero banner */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-7 text-white mb-6 shadow-lg relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FaGift className="text-yellow-300 text-2xl" />
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Referral Program</span>
              </div>
              <h1 className="text-2xl font-extrabold mb-1">Refer &amp; Earn Rewards 🎉</h1>
              <p className="text-white/80 text-sm">
                Invite your friends and earn exclusive rewards when they join ExamRally!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatPill icon={FaUsers} label="Friends Referred" value={referralCount} color="indigo" />
            <StatPill icon={FaCoins} label="Coins Earned" value={coinBalance} color="yellow" />
          </div>

          {/* Your Code */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Your Referral Code</h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-gray-50 border-2 border-dashed border-indigo-200 rounded-xl px-5 py-3 text-center">
                <span className="text-2xl font-extrabold tracking-widest text-indigo-600">
                  {referralCode}
                </span>
              </div>
              <button
                onClick={() => copyText(referralCode, "code")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${copiedCode ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
              >
                {copiedCode ? <FaCheck /> : <FaCopy />}
                {copiedCode ? "Copied!" : "Copy"}
              </button>
            </div>

            {referralLink && (
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Or share your link:</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="flex-1 text-xs text-gray-600 truncate">{referralLink}</span>
                  <button
                    onClick={() => copyText(referralLink, "link")}
                    className="text-indigo-500 hover:text-indigo-700 text-sm flex-shrink-0"
                    title="Copy link"
                  >
                    {copiedLink ? <FaCheck className="text-green-500" /> : <FaCopy />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Share With Friends</h3>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={shareViaWhatsApp}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition">
                <FaWhatsapp className="text-green-500 text-xl" />
                <span className="text-xs font-semibold text-green-700">WhatsApp</span>
              </button>
              <button onClick={shareViaTwitter}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-sky-50 border border-sky-100 hover:bg-sky-100 transition">
                <FaTwitter className="text-sky-500 text-xl" />
                <span className="text-xs font-semibold text-sky-700">Twitter</span>
              </button>
              <button onClick={shareNative}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition">
                <FaShareAlt className="text-purple-500 text-xl" />
                <span className="text-xs font-semibold text-purple-700">More</span>
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> How It Works
            </h3>
            <div className="flex flex-col gap-5">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaClipboardList className="text-indigo-500" /> Referral History
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 font-medium border-b border-gray-50">
                    <tr>
                      <th className="py-3 px-2">Friend</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2 text-right">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((record, i) => (
                      <tr key={i} className="text-gray-700">
                        <td className="py-3 px-2 font-medium">{record.referredEmail || "Friend"}</td>
                        <td className="py-3 px-2 text-gray-500">{new Date(record.awardedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-green-600 font-bold">+{record.coinsEarned} <FaCoins className="inline text-xs mb-0.5" /></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-50 rounded-xl">
                <p className="text-gray-400 text-sm">No referrals yet. Start sharing!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
