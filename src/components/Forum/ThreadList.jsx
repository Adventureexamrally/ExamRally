import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchThreadsByCategory, createThread, likeThread, selectCategories, selectThreads, selectForumLoading } from '../../slice/forumSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Plus, ArrowLeft, Clock, ChevronRight, X,
    Heart, Share2, Camera, Send, Filter, BookOpen, Layers,
    CheckCircle2, Pin, TrendingUp, Users2, PenSquare, Flag, AlertTriangle
} from 'lucide-react';
import { UserContext } from '../../context/UserProvider';
import Api from '../../service/Api';

const ThreadList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const dispatch = useDispatch();
    const threads = useSelector(selectThreads);
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectForumLoading);
    const [category, setCategory] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '' });
    const [selectedImages, setSelectedImages] = useState([]);
    const [filterRole, setFilterRole] = useState('All');
    const [shareToast, setShareToast] = useState(false);

    // Report state
    const [reportTarget, setReportTarget] = useState(null); // { id, title }
    const [reportReason, setReportReason] = useState('');
    const [reportNote, setReportNote] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    const REPORT_REASONS = [
        'Spam or self-promotion',
        'Misleading or false information',
        'Inappropriate or offensive content',
        'Harassment or bullying',
        'Off-topic / irrelevant',
        'Other',
    ];

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchThreadsByCategory(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (categories.length > 0) {
            setCategory(categories.find(c => c._id === id));
        }
    }, [categories, id]);

    const handleImageChange = (e) => {
        if (e.target.files) setSelectedImages(Array.from(e.target.files));
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!user) { alert('Please sign in to create a thread'); return; }
        const formData = new FormData();
        formData.append('title', newThread.title || 'Discussion');
        formData.append('content', newThread.content);
        formData.append('categoryId', id);
        selectedImages.forEach((image) => formData.append('images', image));
        try {
            await dispatch(createThread(formData)).unwrap();
            setShowCreateForm(false);
            setNewThread({ title: '', content: '' });
            setSelectedImages([]);
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const handleLike = (threadId) => {
        if (!user) { alert('Please sign in to like'); return; }
        try {
            dispatch(likeThread({ threadId, userId: user.id || user._id }));
        } catch (error) {
            console.error('Error liking thread:', error);
        }
    };

    const handleShare = (threadId) => {
        const url = `${window.location.origin}/forum/thread/${threadId}`;
        navigator.clipboard.writeText(url).then(() => {
            setShareToast(true);
            setTimeout(() => setShareToast(false), 2500);
        });
    };

    const handleReport = async (e) => {
        e.preventDefault();
        if (!reportReason) return;
        setReportSubmitting(true);
        try {
            await Api.post('/forum/report', {
                targetId: reportTarget.id,
                targetType: 'thread',
                reason: reportReason,
                description: reportNote,
                reporterName: user ? `${user.firstName} ${user.lastName}` : 'anonymous',
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

    const filteredThreads = threads.filter(thread => {
        if (filterRole === 'All') return true;
        const role = (thread.author?.role || '').toLowerCase();
        if (filterRole === 'Student') {
            return ['user', 'student', ''].includes(role);
        }
        if (filterRole === 'Mentor') {
            return ['admin', 'instructor', 'moderator', 'mentor'].includes(role);
        }
        return true;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F2F5] gap-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-semibold">Loading threads…</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-inter">

            {/* Share Toast */}
            <AnimatePresence>
                {shareToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} className="text-green-400" /> Link copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Sticky Header ── */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/forum')}
                            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 hover:text-green-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-px h-5 bg-gray-100" />
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">Forum</p>
                            <h2 className="text-base font-black text-[#0f2942] leading-none">
                                {category?.name || 'Threads'}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 shadow-md shadow-green-200"
                    >
                        <PenSquare size={15} />
                        <span className="hidden sm:inline">New Post</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ── Left Sidebar ── */}
                    <div className="lg:w-60 xl:w-64 shrink-0 space-y-4 hidden lg:block">

                        {/* Post Type Filter */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter size={13} className="text-green-600" />
                                <h3 className="text-[11px] font-black text-[#0f2942] uppercase tracking-widest">Filter Posts</h3>
                            </div>
                            <div className="space-y-1">
                                {['All', 'Student', 'Mentor'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterRole(type)}
                                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${filterRole === type
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${filterRole === type ? 'bg-green-600' : 'bg-gray-200'}`} />
                                        {type}
                                        {filterRole === type && <CheckCircle2 size={13} className="ml-auto text-green-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen size={13} className="text-green-600" />
                                <h3 className="text-[11px] font-black text-[#0f2942] uppercase tracking-widest">Categories</h3>
                            </div>
                            <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
                                {categories.map(cat => (
                                    <Link
                                        key={cat._id}
                                        to={`/forum/category/${cat._id}`}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${cat._id === id
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                            }`}
                                    >
                                        {cat._id === id
                                            ? <div className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
                                            : <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
                                        }
                                        <span className="truncate">{cat.name}</span>
                                        {cat._id === id && <ChevronRight size={12} className="ml-auto text-green-500 shrink-0" />}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Main Feed ── */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Write a Post Banner */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-50 shadow-sm">
                            <div className="flex items-center gap-4">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                        {user?.firstName?.charAt(0) || '?'}
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="flex-1 text-left bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-green-200 rounded-xl py-3 px-4 text-sm text-gray-400 font-semibold transition-all"
                                >
                                    Share a doubt or insight, {user?.firstName || 'Aspirant'}…
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-black hover:bg-green-700 transition-all shrink-0 shadow-md shadow-green-100"
                                >
                                    <Plus size={15} /> Post
                                </button>
                            </div>
                        </div>

                        {/* Thread count bar */}
                        <div className="flex items-center justify-between px-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {filteredThreads.length} thread{filteredThreads.length !== 1 ? 's' : ''}
                            </p>
                            {/* Mobile filter pills */}
                            <div className="flex gap-2 lg:hidden">
                                {['All', 'Student', 'Mentor'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterRole(type)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${filterRole === type
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-500 border border-gray-100'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Thread List */}
                        {filteredThreads.length === 0 ? (
                            <div className="bg-white rounded-2xl py-20 px-8 text-center border border-gray-50 shadow-sm">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-lg font-black text-[#0f2942] mb-2">No threads yet</h3>
                                <p className="text-gray-400 font-semibold text-sm max-w-xs mx-auto mb-6">Be the first to start a discussion in this category!</p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-700 transition-all"
                                >
                                    Start a thread
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredThreads.map((thread, index) => {
                                    const isLiked = thread.likes?.includes(user?.id || user?._id);
                                    return (
                                        <motion.div
                                            key={thread._id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04, type: 'spring', stiffness: 180 }}
                                            className="bg-white rounded-2xl border border-gray-50 hover:border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                                        >
                                            {/* Pinned bar */}
                                            {thread.isPinned && (
                                                <div className="bg-amber-50 border-b border-amber-100 px-5 py-2 flex items-center gap-2">
                                                    <Pin size={12} className="text-amber-600 fill-amber-600" />
                                                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Pinned by moderator</span>
                                                </div>
                                            )}

                                            {/* Card body */}
                                            <div className="p-5">
                                                {/* Author row */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    {thread.author?.profilePicture ? (
                                                        <img
                                                            src={thread.author.profilePicture}
                                                            alt={thread.author.firstName}
                                                            className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                            {thread.author?.firstName?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-black text-[#0f2942] leading-none">
                                                                {thread.author?.firstName} {thread.author?.lastName}
                                                            </span>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${['admin', 'instructor', 'moderator', 'mentor'].includes((thread.author?.role || '').toLowerCase())
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-gray-50 text-gray-400'
                                                                }`}>
                                                                {['admin', 'instructor', 'moderator', 'mentor'].includes((thread.author?.role || '').toLowerCase())
                                                                    ? 'Mentor'
                                                                    : (['user', 'student', ''].includes((thread.author?.role || '').toLowerCase()) ? 'Student' : thread.author?.role)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1 text-[10px] font-semibold text-gray-400">
                                                            <Clock size={9} />
                                                            {new Date(thread.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            <span>·</span>
                                                            {new Date(thread.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    {/* Report button */}
                                                    <button
                                                        onClick={() => setReportTarget({ id: thread._id, title: thread.title })}
                                                        title="Report this thread"
                                                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                                                    >
                                                        <Flag size={13} />
                                                    </button>
                                                </div>

                                                {/* Thread Content */}
                                                <Link to={`/forum/thread/${thread._id}`} className="block group/link">
                                                    <h3 className="text-base font-black text-[#0f2942] mb-2 group-hover/link:text-green-700 transition-colors leading-snug line-clamp-2">
                                                        {thread.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 mb-4">
                                                        {thread.content}
                                                    </p>

                                                    {/* Image */}
                                                    {thread.images && thread.images.length > 0 && (
                                                        <div className="rounded-xl overflow-hidden border border-gray-100 mb-4">
                                                            <img src={thread.images[0]} alt="Post" className="w-full h-auto object-contain" />
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Stats row */}
                                                <div className="flex items-center gap-4 py-3 border-t border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0">
                                                    <span className="flex items-center gap-1.5">
                                                        <Heart size={11} className={isLiked ? 'fill-green-600 text-green-600' : ''} />
                                                        {thread.likes?.length || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MessageSquare size={11} />
                                                        {thread.repliesCount || 0}
                                                    </span>
                                                </div>

                                                {/* Actions row */}
                                                <div className="flex items-center gap-1 pt-3 border-t border-gray-50">
                                                    <button
                                                        onClick={() => handleLike(thread._id)}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs transition-all ${isLiked
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                                                            }`}
                                                    >
                                                        <Heart size={15} className={isLiked ? 'fill-green-600' : ''} />
                                                        {isLiked ? 'Liked' : 'Like'}
                                                    </button>
                                                    <Link
                                                        to={`/forum/thread/${thread._id}`}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-all"
                                                    >
                                                        <MessageSquare size={15} />
                                                        Comment
                                                    </Link>
                                                    <button
                                                        onClick={() => handleShare(thread._id)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-all"
                                                    >
                                                        <Share2 size={15} />
                                                        Share
                                                    </button>
                                                    <Link
                                                        to={`/forum/thread/${thread._id}`}
                                                        className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-black text-gray-400 hover:text-green-600 transition-all"
                                                    >
                                                        View Thread <ChevronRight size={13} />
                                                    </Link>
                                                </div>

                                                {/* Comment bar - click to navigate */}
                                                <div
                                                    onClick={() => navigate(`/forum/thread/${thread._id}`)}
                                                    className="mt-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2.5 border border-gray-100 hover:border-green-200 cursor-pointer transition-all"
                                                >
                                                    {user?.profilePicture ? (
                                                        <img src={user.profilePicture} alt="" className="w-6 h-6 rounded-lg object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-[10px] text-white font-black shrink-0">
                                                            {user?.firstName?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                    <span className="flex-1 text-xs font-semibold text-gray-400">Add a comment…</span>
                                                    <Send size={13} className="text-green-600 shrink-0" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Create Thread Modal ── */}
            <AnimatePresence>
                {showCreateForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowCreateForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-[#0f2942] to-[#163d5e] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                                        <PenSquare size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white leading-none">New Discussion</h3>
                                        <p className="text-[11px] text-blue-300/70 font-semibold mt-0.5">Post in {category?.name || 'Forum'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-xl transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleCreateThread} className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Discussion Topic</label>
                                    <input
                                        type="text"
                                        placeholder="Summarize your main question…"
                                        className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500 rounded-2xl p-4 text-gray-900 font-bold focus:ring-4 focus:ring-green-50 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={newThread.title}
                                        onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Details</label>
                                    <textarea
                                        placeholder="Describe your doubt or share insights so others can help…"
                                        className="w-full min-h-[140px] bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500 rounded-2xl p-4 text-gray-900 text-sm font-medium focus:ring-4 focus:ring-green-50 outline-none transition-all resize-none placeholder:text-gray-300"
                                        value={newThread.content}
                                        onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Attachments */}
                                <div className="flex items-center gap-3">
                                    <label htmlFor="thread-images" className="flex items-center gap-2 bg-green-50 border border-dashed border-green-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-green-100 transition-all font-black text-xs text-green-700">
                                        <Camera size={15} /> Add Images
                                        <input type="file" id="thread-images" accept="image/*" multiple hidden onChange={handleImageChange} />
                                    </label>
                                    {selectedImages.length > 0 && (
                                        <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2">
                                            <Layers size={13} className="text-green-600" />
                                            <span className="text-xs font-black text-green-700">{selectedImages.length} file{selectedImages.length > 1 ? 's' : ''} selected</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-none px-5 py-3 rounded-xl font-black text-sm text-gray-500 hover:bg-gray-50 border border-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-700 shadow-lg shadow-green-200 active:scale-95 transition-all"
                                    >
                                        Post Now
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Report Modal ── */}
            <AnimatePresence>
                {reportTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setReportTarget(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-red-600 to-red-700 p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                                        <AlertTriangle size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white">Report Thread</h3>
                                        <p className="text-[11px] text-red-200 font-semibold truncate max-w-[220px]">{reportTarget.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setReportTarget(null)} className="p-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl transition">
                                    <X size={16} />
                                </button>
                            </div>
                            {reportSuccess ? (
                                <div className="p-8 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                                        <CheckCircle2 size={28} className="text-green-600" />
                                    </div>
                                    <h4 className="text-base font-black text-[#0f2942] mb-2">Report Submitted</h4>
                                    <p className="text-sm text-gray-500 font-medium">Our moderators will review it shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleReport} className="p-5 space-y-4">
                                    <div>
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Reason *</label>
                                        <div className="space-y-1">
                                            {REPORT_REASONS.map(reason => (
                                                <label key={reason} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${reportReason === reason ? 'border-red-500 bg-red-500' : 'border-gray-200'}`}>
                                                        {reportReason === reason && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <span className={`text-sm font-semibold ${reportReason === reason ? 'text-gray-900' : 'text-gray-500'}`}>{reason}</span>
                                                    <input type="radio" hidden value={reason} checked={reportReason === reason} onChange={() => setReportReason(reason)} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Notes <span className="normal-case font-semibold">(optional)</span></label>
                                        <textarea
                                            value={reportNote}
                                            onChange={(e) => setReportNote(e.target.value)}
                                            placeholder="Provide additional context…"
                                            rows={2}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 resize-none placeholder:text-gray-300 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setReportTarget(null)} className="px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!reportReason || reportSubmitting}
                                            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-black hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            {reportSubmitting
                                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                : <Flag size={14} />}
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

export default ThreadList;
