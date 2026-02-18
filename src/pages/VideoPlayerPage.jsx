import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../service/Api";
import Videojs from './Videojs';
import VideoNotes from '../components/VideoNotes';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { FaPlay, FaLock, FaDownload } from "react-icons/fa";

const VideoPlayerPage = () => {
    const { courseId, topicName } = useParams();
    const navigate = useNavigate();
    const { user, utcNow } = useContext(UserContext);
    const { isSignedIn } = useUser();

    const [courseData, setCourseData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const playerRef = useRef(null);

    const [expireDate, setExpireDate] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('videos');

    // Fetch Course Data
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await Api.get(`video-courses/video-course/main-page/${courseId}`);
                const data = response.data;
                setCourseData(data);

                // Filter videos by topic
                if (data && data.video_courses) {
                    const topicVideos = data.video_courses.filter(v => v.topic === topicName);
                    // Flatten the videos array from each course entry
                    const allVideos = topicVideos.flatMap(entry => {
                        if (entry.videos && entry.videos.length > 0) {
                            return entry.videos.map(v => ({ ...v, parentEntry: entry }));
                        }
                        return [{ ...entry, parentEntry: entry }]; // For backward compatibility
                    });

                    setVideos(allVideos);
                }
            } catch (err) {
                console.error("Failed to fetch course data", err);
                setError("Failed to load video course.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourseData();
    }, [courseId, topicName]);

    // Check Enrollment
    useEffect(() => {
        if (!utcNow || (!user?.enrolledCourses && !user?.subscriptions) || !courseData) return;

        const checkExpiry = (course) => {
            const expireDate = new Date(course?.expiryDate);
            const timeDiff = expireDate.getTime() - utcNow.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 1 day in ms

            if (!isNaN(daysLeft) && daysLeft >= 0 && course?.courseId?.some(id => String(id) === String(courseData._id))) {
                setExpireDate(daysLeft);
                return true;
            }
            return false;
        };

        const enrolledFromCourses = user?.enrolledCourses?.some(checkExpiry);
        const enrolledFromSubscriptions = user?.subscriptions?.some(checkExpiry);

        setIsEnrolled(enrolledFromCourses || enrolledFromSubscriptions);
    }, [user, courseData, utcNow]);


    const handlePlayerReady = (player) => {
        playerRef.current = player;
        player.on('waiting', () => console.log('player is waiting'));
        player.on('dispose', () => console.log('player will dispose'));
    };

    const handleVideoSelect = (video) => {
        if (!isSignedIn) {
            navigate('/sign-in');
            return;
        }
        setSelectedVideo(video);
        // Scroll to top when video is selected
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownloadClick = (pdfLink) => {
        if (isSignedIn) {
            window.open(pdfLink, '_blank');
        } else {
            navigate('/sign-in');
        }
    };


    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ... (keep header) */}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-50">
                <h2 className="text-xl font-bold"> {courseData?.title}</h2>
            </div>

            <div className="max-w-[1600px] mx-auto w-full p-4 flex-grow flex flex-col lg:flex-row gap-6">

                {/* Main Video Player Area */}
                <div className="flex-1 min-w-0">
                    {selectedVideo ? (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="w-full relative" style={{ paddingBottom: '56.25%' }}>
                                <div className="absolute inset-0">
                                    <Videojs
                                        options={{
                                            embedded: true,
                                            autoplay: true,
                                            controls: true,
                                            responsive: true,
                                            fill: true,
                                            sources: [{
                                                src: selectedVideo.video_url,
                                                type: 'application/x-mpegURL'
                                            }],
                                            html5: { hls: { overrideNative: true } }
                                        }}
                                        onReady={handlePlayerReady}
                                    />
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                        {selectedVideo.type === 'free' ? 'Free' : 'Paid'}
                                    </span>
                                    {selectedVideo.isLive && (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-bold animate-pulse">
                                            Available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center h-96 flex flex-col justify-center items-center text-gray-500">
                            <FaPlay size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">Select a video from the list to start watching</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[400px] flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4 h-[calc(100vh-100px)] flex flex-col">

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('videos')}
                                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                {topicName}
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                My Notes
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-hidden relative">
                            {activeTab === 'videos' ? (
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                                        <h3 className="font-bold text-gray-700">{topicName}</h3>
                                        <p className="text-xs text-gray-500">{videos.length} Videos</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        {videos.map((video, index) => {
                                            const parentEntry = video.parentEntry;

                                            const liveDate = parentEntry?.live_date ? new Date(parentEntry.live_date) : null;
                                            const isFree = video.type === 'free';
                                            const isPaid = video.type === 'paid';

                                            // Use server time if available, otherwise local time
                                            const comparisonDate = utcNow || new Date();

                                            let isLocked = false;
                                            let showDateText = '';

                                            // If video is not live yet (admin control), lock it
                                            if (video.isLive === false) {
                                                isLocked = true;
                                                showDateText = 'Locked';
                                            } else if (isFree) {
                                                isLocked = liveDate && comparisonDate < liveDate;
                                                if (parentEntry?.show_date && liveDate && isLocked) {
                                                    showDateText = `Avail: ${liveDate.toLocaleDateString()}`;
                                                }
                                            } else if (isPaid) {
                                                if (!isEnrolled) {
                                                    isLocked = true;
                                                    showDateText = 'Purchase Required';
                                                } else {
                                                    isLocked = liveDate && comparisonDate < liveDate;
                                                    if (parentEntry?.show_date && liveDate && isLocked) {
                                                        showDateText = `Avail: ${liveDate.toLocaleDateString()}`;
                                                    }
                                                }
                                            }

                                            const isSelected = selectedVideo && selectedVideo._id === video._id;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                                    onClick={() => !isLocked && handleVideoSelect(video)}
                                                >
                                                    <div className="relative w-24 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden group">
                                                        {isLocked ? (
                                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
                                                                <FaLock size={12} />
                                                            </div>
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                                                                <FaPlay size={12} />
                                                            </div>
                                                        )}

                                                        {/* Thumbnail placeholder if no image */}
                                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                                                            <span className="text-xs text-gray-400">Video</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`text-sm font-medium line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                                                            {video.title}
                                                        </h4>

                                                        <div className="flex items-center gap-2 mt-1">
                                                            {video.isLive && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">Available</span>}
                                                            {isLocked && <span className="text-[10px] text-gray-500">{showDateText}</span>}
                                                        </div>

                                                        {/* PDF Download for this video's parent entry */}
                                                        {parentEntry?.pdf_link && (isFree || isEnrolled) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownloadClick(parentEntry.pdf_link);
                                                                }}
                                                                className="mt-2 text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                                            >
                                                                <FaDownload size={10} /> PDF
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col h-full">
                                    <VideoNotes
                                        user={user}
                                        courseId={courseId}
                                        videoUrl={selectedVideo?.video_url}
                                        player={playerRef.current}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;

