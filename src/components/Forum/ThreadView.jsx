import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Heart, ArrowLeft, Send, Trash2,
    ShieldCheck, Clock, Camera, Share2, CheckCircle2,
    Tag, Eye, Users2, CornerDownRight, Flag, AlertTriangle, X
} from 'lucide-react';
import { UserContext } from '../../context/UserProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreadDetails, createPost, likeThread, likePost, deletePost, selectCurrentThread, selectPosts, selectThreadStatus, clearCurrentThread, fetchForumStats, selectForumStats } from '../../slice/forumSlice';
import Api from '../../service/Api';

const REPORT_REASONS = [
    'Spam or self-promotion',
    'Misleading or false information',
    'Inappropriate or offensive content',
    'Harassment or bullying',
    'Off-topic / irrelevant',
    'Other',
];

const ThreadView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const dispatch = useDispatch();
    const thread = useSelector(selectCurrentThread);
    const posts = useSelector(selectPosts);
    const threadStatus = useSelector(selectThreadStatus);
    const stats = useSelector(selectForumStats);
    const [replyContent, setReplyContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shareToast, setShareToast] = useState(false);

    // Report modal state
    const [reportTarget, setReportTarget] = useState(null); // { id, type, label }
    const [reportReason, setReportReason] = useState('');
    const [reportNote, setReportNote] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchThreadDetails(id));
        dispatch(fetchForumStats());

        return () => {
            dispatch(clearCurrentThread());
        };
    }, [id, dispatch]);

    const handleImageChange = (e) => {
        if (e.target.files) setSelectedImages(Array.from(e.target.files));
    };

    const handlePostReply = async (e) => {
        e.preventDefault();
        if (!user) { alert('Please sign in to reply'); return; }
        if (!replyContent.trim() && selectedImages.length === 0) return;
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', replyContent);
        selectedImages.forEach((image) => formData.append('images', image));
        try {
            await dispatch(createPost({ threadId: id, formData })).unwrap();
            setReplyContent('');
            setSelectedImages([]);
        } catch (error) {
            console.error('Error posting reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleThreadLike = () => {
        if (!user) { alert('Please sign in to like'); return; }
        try {
            dispatch(likeThread({ threadId: id, userId: user.id || user._id }));
        } catch (error) {
            console.error('Error liking thread:', error);
        }
    };

    const handleLike = (postId) => {
        if (!user) { alert('Please sign in to like'); return; }
        try {
            dispatch(likePost({ postId, userId: user.id || user._id }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Delete this response?')) return;
        try {
            await dispatch(deletePost(postId)).unwrap();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setShareToast(true);
            setTimeout(() => setShareToast(false), 2500);
        });
    };

    const handleReport = async (e) => {
        e.preventDefault();
        if (!reportReason || !reportTarget) return;
        setReportSubmitting(true);
        try {
            await Api.post('/forum/report', {
                targetId: reportTarget.id,
                targetType: reportTarget.type,
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

    if (threadStatus === 'loading' || threadStatus === 'idle') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F2F5] gap-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-semibold">Loading discussion…</p>
        </div>
    );

    if (!thread || threadStatus === 'failed') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F2F5] gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <MessageSquare size={32} className="text-gray-300" />
            </div>
            <p className="text-lg font-black text-gray-500">Discussion not found</p>
            <button onClick={() => navigate(-1)} className="text-green-600 font-bold text-sm underline">Go back</button>
        </div>
    );

    const threadLiked = thread.likes?.includes(user?.id || user?._id);

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-inter pb-20">

            {/* Share Toast */}
            <AnimatePresence>
                {shareToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} className="text-green-400" /> Link copied!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Sticky Header ── */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 hover:text-green-600 shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-px h-5 bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                            {thread.category?.name || 'Forum'}
                        </p>
                        <h2 className="text-sm font-black text-[#0f2942] leading-tight truncate">
                            {thread.title}
                        </h2>
                    </div>
                    <button
                        onClick={handleShare}
                        className="shrink-0 p-2 hover:bg-green-50 hover:text-green-600 text-gray-400 rounded-xl transition-all"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ── Main Content Column ── */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Thread Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden"
                        >
                            {/* Thread Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-start gap-4">
                                    {thread.author?.profilePicture ? (
                                        <img
                                            src={thread.author.profilePicture}
                                            alt={thread.author.firstName}
                                            className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-700 rounded-2xl flex items-center justify-center text-white text-lg font-black shrink-0">
                                            {thread.author?.firstName?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-sm font-black text-[#0f2942] leading-none">
                                                {thread.author?.firstName} {thread.author?.lastName}
                                            </h3>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${['admin', 'instructor', 'moderator', 'mentor'].includes((thread.author?.role || '').toLowerCase())
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                {['admin', 'instructor', 'moderator', 'mentor'].includes((thread.author?.role || '').toLowerCase())
                                                    ? 'Mentor'
                                                    : (['user', 'student', ''].includes((thread.author?.role || '').toLowerCase()) ? 'Student' : thread.author?.role)}
                                            </span>
                                            {thread.category?.name && (
                                                <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 uppercase tracking-wider">
                                                    <Tag size={8} />{thread.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-semibold text-gray-400">
                                            <Clock size={9} />
                                            {new Date(thread.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            <span>·</span>
                                            {new Date(thread.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thread Body */}
                            <div className="px-6 pb-5">
                                <h1 className="text-xl font-black text-[#0f2942] mb-4 leading-snug">
                                    {thread.title}
                                </h1>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                                    {thread.content}
                                </p>
                                {thread.images && thread.images.length > 0 && (
                                    <div className={`mt-5 grid gap-3 ${thread.images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                                        {thread.images.map((img, idx) => (
                                            <div key={idx} className="rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in" onClick={() => window.open(img, '_blank')}>
                                                <img src={img} alt="Attachment" className="w-full h-auto object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Stats bar */}
                            <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5">
                                    <Heart size={11} className={threadLiked ? 'fill-green-600 text-green-600' : ''} />
                                    {thread.likes?.length || 0}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MessageSquare size={11} />
                                    {posts.length} replies
                                </span>
                                {thread.viewsCount > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <Eye size={11} />
                                        {thread.viewsCount} views
                                    </span>
                                )}
                            </div>

                            {/* Actions bar */}
                            <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-1">
                                <button
                                    onClick={handleThreadLike}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-black text-xs transition-all ${threadLiked
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                                        }`}
                                >
                                    <Heart size={15} className={threadLiked ? 'fill-green-600' : ''} />
                                    {threadLiked ? 'Liked' : 'Like'}
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-all">
                                    <MessageSquare size={15} />
                                    Reply
                                </button>
                                <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-all">
                                    <Share2 size={15} />
                                    Share
                                </button>
                                {/* Report thread */}
                                <button
                                    onClick={() => setReportTarget({ id: thread._id, type: 'thread', label: thread.title })}
                                    className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <Flag size={13} /> Report
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Replies ── */}
                        {posts.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <CornerDownRight size={14} className="text-green-600" />
                                    <h3 className="text-sm font-black text-[#0f2942] uppercase tracking-wider">
                                        {posts.length} Repl{posts.length === 1 ? 'y' : 'ies'}
                                    </h3>
                                </div>

                                {posts.map((post, index) => {
                                    const postLiked = post.likes?.includes(user?.id || user?._id);
                                    const canDelete = user?.id === post.author?._id || user?._id === post.author?._id || user?.role === 'admin';
                                    return (
                                        <motion.div
                                            key={post._id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04, type: 'spring', stiffness: 200 }}
                                            className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden"
                                        >
                                            <div className="p-5">
                                                {/* Reply author */}
                                                <div className="flex items-start gap-3 mb-4">
                                                    {post.author?.profilePicture ? (
                                                        <img src={post.author.profilePicture} alt={post.author.firstName} className="w-9 h-9 rounded-xl object-cover border border-gray-100 shrink-0" />
                                                    ) : (
                                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                            {post.author?.firstName?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="text-sm font-black text-[#0f2942] leading-none">
                                                                {post.author?.firstName} {post.author?.lastName}
                                                            </h4>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${['admin', 'instructor', 'moderator', 'mentor'].includes((post.author?.role || '').toLowerCase())
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-gray-50 text-gray-400'
                                                                }`}>
                                                                {['admin', 'instructor', 'moderator', 'mentor'].includes((post.author?.role || '').toLowerCase())
                                                                    ? 'Mentor'
                                                                    : (['user', 'student', ''].includes((post.author?.role || '').toLowerCase()) ? 'Student' : post.author?.role)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] font-semibold text-gray-400 mt-1">
                                                            {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </p>
                                                    </div>
                                                    {/* Delete + Report */}
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {canDelete && (
                                                            <button onClick={() => handleDelete(post._id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setReportTarget({ id: post._id, type: 'post', label: `Reply by ${post.author?.firstName || 'User'}` })}
                                                            title="Report this reply"
                                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Flag size={13} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap mb-4">
                                                    {post.content}
                                                </p>

                                                {post.images && post.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.images.map((img, idx) => (
                                                            <div key={idx} className="rounded-xl overflow-hidden border border-gray-100 cursor-zoom-in" onClick={() => window.open(img, '_blank')}>
                                                                <img src={img} alt="Reply" className="w-full h-auto max-h-72 object-contain" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center pt-3 border-t border-gray-50">
                                                    <button
                                                        onClick={() => handleLike(post._id)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs transition-all ${postLiked
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'text-gray-400 hover:bg-gray-50 hover:text-green-600'
                                                            }`}
                                                    >
                                                        <Heart size={13} className={postLiked ? 'fill-green-600' : ''} />
                                                        {post.likes?.length || 0}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── Reply Box ── */}
                        <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-[#0f2942] to-[#163d5e] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CornerDownRight size={14} className="text-green-400" />
                                    <h3 className="text-sm font-black text-white">Write a Reply</h3>
                                </div>
                                <span className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">
                                    {posts.length} repl{posts.length === 1 ? 'y' : 'ies'}
                                </span>
                            </div>

                            {user ? (
                                <form onSubmit={handlePostReply} className="p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                                        ) : (
                                            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                {user?.firstName?.charAt(0) || '?'}
                                            </div>
                                        )}
                                        <p className="text-sm font-black text-[#0f2942]">{user.firstName} {user.lastName}</p>
                                    </div>

                                    <textarea
                                        className="w-full min-h-[130px] bg-gray-50 border border-gray-100 focus:bg-white focus:border-green-500 rounded-2xl p-4 text-sm text-gray-700 font-medium focus:ring-4 focus:ring-green-50 outline-none transition-all resize-none placeholder:text-gray-300"
                                        placeholder="Share your answer, explanation, or thoughts…"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        required={selectedImages.length === 0}
                                    />

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <label htmlFor="reply-images" className="flex items-center gap-2 bg-green-50 border border-dashed border-green-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-green-100 transition-all font-black text-xs text-green-700">
                                                <Camera size={14} /> Media
                                                <input type="file" id="reply-images" accept="image/*" multiple hidden onChange={handleImageChange} />
                                            </label>
                                            {selectedImages.length > 0 && (
                                                <span className="text-xs font-black text-green-700 bg-green-50 px-3 py-2 rounded-xl">
                                                    {selectedImages.length} file{selectedImages.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || (!replyContent.trim() && selectedImages.length === 0)}
                                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-green-700 shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : <Send size={15} />}
                                            {isSubmitting ? 'Posting…' : 'Post Reply'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <MessageSquare size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-bold mb-4 text-sm">Sign in to join the discussion</p>
                                    <Link to="/signin" className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-green-700 shadow-lg transition-all">
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right Sidebar ── */}
                    <div className="lg:w-64 xl:w-72 shrink-0 space-y-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Thread Info</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><Heart size={13} className="text-green-600" /> Likes</span>
                                    <span className="text-sm font-black text-[#0f2942]">{thread.likes?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><MessageSquare size={13} className="text-green-600" /> Replies</span>
                                    <span className="text-sm font-black text-[#0f2942]">{posts.length}</span>
                                </div>
                                {thread.viewsCount > 0 && (
                                    <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                                        <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><Eye size={13} className="text-green-600" /> Views</span>
                                        <span className="text-sm font-black text-[#0f2942]">{thread.viewsCount}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><Users2 size={13} className="text-green-600" /> Online</span>
                                    <span className="text-sm font-black text-green-600">{stats.activeNow || 1}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-gradient-to-br from-[#0f2942] via-[#163d5e] to-[#0f2942] rounded-2xl p-5 text-white overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-400/10 rounded-full blur-xl" />
                            <ShieldCheck size={28} className="mb-3 text-green-400 opacity-90 relative z-10" />
                            <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-white relative z-10">Community Guidelines</h4>
                            <p className="text-xs font-medium text-blue-200/70 leading-relaxed relative z-10">
                                Keep discussions respectful and constructive. Quality answers help the entire community succeed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                                        <h3 className="text-sm font-black text-white">
                                            Report {reportTarget.type === 'thread' ? 'Thread' : 'Reply'}
                                        </h3>
                                        <p className="text-[11px] text-red-200 font-semibold truncate max-w-[220px]">{reportTarget.label}</p>
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

export default ThreadView;
