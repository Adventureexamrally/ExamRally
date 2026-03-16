import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, TrendingUp, Search, ChevronRight,
    Flame, LayoutGrid, AlertTriangle, X, CheckCircle2,
    Flag, Users2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchForumStats, selectCategories, selectForumStats, selectForumLoading } from '../../slice/forumSlice';
import Api from '../../service/Api';

const REPORT_REASONS = [
    'Spam or self-promotion',
    'Misleading or false information',
    'Inappropriate content',
    'Harassment or bullying',
    'Off-topic / irrelevant',
    'Other',
];

const ForumMain = () => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const stats = useSelector(selectForumStats);
    const loading = useSelector(selectForumLoading);
    const [searchTerm, setSearchTerm] = useState('');

    // Report modal state
    const [reportTarget, setReportTarget] = useState(null); // { id, name }
    const [reportReason, setReportReason] = useState('');
    const [reportNote, setReportNote] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchForumStats());
    }, [dispatch]);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReport = async (e) => {
        e.preventDefault();
        if (!reportReason) return;
        setReportSubmitting(true);
        try {
            await Api.post('/forum/report', {
                targetId: reportTarget.id,
                targetType: 'category',
                reason: reportReason,
                description: reportNote,
            });
            setReportSuccess(true);
            setTimeout(() => {
                setReportTarget(null);
                setReportReason('');
                setReportNote('');
                setReportSuccess(false);
            }, 2200);
        } catch (err) {
            console.error('Report failed', err);
        } finally {
            setReportSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-inter pb-24">

            {/* ── Hero ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto px-6 py-10"
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-8">

                        {/* Left: Title + Search */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
                                    <MessageSquare size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-black text-[#0f2942] tracking-tight">
                                    ExamRally <span className="text-green-600">Forum</span>
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 font-medium mb-6 max-w-md">
                                Share doubts, discuss strategies and learn from peers &amp; mentors across all competitive exams.
                            </p>
                            {/* Search */}
                            <div className="relative max-w-md group">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search categories or topics…"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-800 font-semibold focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition-all placeholder:text-gray-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Stats cards */}
                        <div className="flex gap-4 shrink-0 flex-wrap">
                            {/* Total Threads (all including deleted) */}
                            <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                    <TrendingUp size={15} />
                                </div>
                                <p className="text-2xl font-black text-[#0f2942]">{stats.totalThreads?.toLocaleString() || 0}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discussions</p>
                            </div>
                            {/* Active threads */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                                    <MessageSquare size={15} />
                                </div>
                                <p className="text-2xl font-black text-[#0f2942]">{stats.activeThreads?.toLocaleString() || 0}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</p>
                            </div>
                            {/* Active Now */}
                            {/* <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                                <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                                    <Flame size={15} />
                                </div>
                                <p className="text-2xl font-black text-[#0f2942]">{stats.activeNow?.toLocaleString() || 1}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Online</p>
                            </div> */}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Categories Grid ── */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={16} className="text-green-600" />
                        <h2 className="text-base font-black text-[#0f2942] uppercase tracking-wider">Discussion Boards</h2>
                    </div>
                    <span className="bg-green-50 text-green-700 border border-green-100 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {filteredCategories.length} boards
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400 font-semibold">Loading boards…</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center py-24 text-gray-400">
                        <MessageSquare size={44} className="mb-3 text-gray-200" />
                        <p className="font-black text-gray-500">No categories found</p>
                        <p className="text-sm mt-1">Try a different search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                                className="group relative"
                            >
                                <Link
                                    to={`/forum/category/${category._id}`}
                                    className="block bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                                >
                                    {/* Subtle glow */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-400/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />

                                    {/* Icon */}
                                    <div className="w-11 h-11 bg-gray-50 group-hover:bg-green-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm">
                                        <MessageSquare size={20} className="text-green-600 group-hover:text-white transition-colors" />
                                    </div>

                                    <h3 className="text-base font-black text-[#0f2942] mb-1.5 group-hover:text-green-700 transition-colors leading-tight">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 mb-4">
                                        {category.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-green-600 transition-colors">
                                            Explore →
                                        </span>
                                        <ChevronRight size={15} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </Link>

                                {/* Report button — visible on hover */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setReportTarget({ id: category._id, name: category.name });
                                    }}
                                    title="Report this board"
                                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Flag size={13} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Report Modal ── */}
            <AnimatePresence>
                {reportTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setReportTarget(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal header */}
                            <div className="bg-gradient-to-r from-red-600 to-red-700 p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                                        <AlertTriangle size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white leading-none">Report Board</h3>
                                        <p className="text-[11px] text-red-200 mt-0.5 font-semibold truncate max-w-[200px]">{reportTarget.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setReportTarget(null)}
                                    className="p-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {reportSuccess ? (
                                <div className="p-8 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                                        <CheckCircle2 size={28} className="text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-black text-[#0f2942] mb-2">Report Submitted</h4>
                                    <p className="text-sm text-gray-500 font-medium">Our moderators will review it shortly. Thank you for helping keep the community safe.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleReport} className="p-5 space-y-4">
                                    <div>
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Reason *</label>
                                        <div className="space-y-1.5">
                                            {REPORT_REASONS.map(reason => (
                                                <label key={reason} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${reportReason === reason ? 'border-red-500 bg-red-500' : 'border-gray-200 hover:border-red-300'}`}>
                                                        {reportReason === reason && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <span className={`text-sm font-semibold ${reportReason === reason ? 'text-gray-900' : 'text-gray-500'}`}>{reason}</span>
                                                    <input type="radio" hidden value={reason} checked={reportReason === reason} onChange={() => setReportReason(reason)} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Additional notes <span className="normal-case font-semibold">(optional)</span></label>
                                        <textarea
                                            value={reportNote}
                                            onChange={(e) => setReportNote(e.target.value)}
                                            placeholder="Describe the issue in more detail…"
                                            rows={3}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all resize-none placeholder:text-gray-300"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setReportTarget(null)}
                                            className="flex-none px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!reportReason || reportSubmitting}
                                            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-black hover:bg-red-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {reportSubmitting ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Flag size={14} />
                                            )}
                                            Submit Report
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForumMain;
