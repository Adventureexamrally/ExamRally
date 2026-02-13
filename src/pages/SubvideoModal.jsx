import React, { useEffect, useState, useRef, useContext } from "react";
import Videojs from './Videojs';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { FaPlay, FaLock, FaCheckCircle, FaTimes, FaList, FaDownload } from "react-icons/fa";

const SubvideoModal = ({ videos = [], onClose, isOpen, data }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const playerRef = useRef(null);
  const { user, utcNow } = useContext(UserContext);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [expireDate, setExpireDate] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true); // Toggle playlist on mobile

  // Auto-select first unlockable video if none selected
  useEffect(() => {
    if (isOpen && !selectedVideo && videos.length > 0) {
      // Find first unlocked video or just the first one
      if (videos.length === 1) setSelectedVideo(videos[0]);
    }
  }, [isOpen, videos]);


  useEffect(() => {
    if (!isSignedIn && selectedVideo) {
      // navigate('/sign-in'); // Optional: redirect if trying to watch without sign-in
    }
  }, [isSignedIn, selectedVideo, navigate]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, isOpen]);

  useEffect(() => {
    if (!utcNow || (!user?.enrolledCourses && !user?.subscriptions)) return;
    const checkExpiry = (course) => {
      const expireDate = new Date(course?.expiryDate);
      const timeDiff = expireDate.getTime() - utcNow.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (!isNaN(daysLeft) && daysLeft >= 0 && course?.courseId?.includes(data._id)) {
        setExpireDate(daysLeft);
        return true;
      }
      return false;
    };
    const enrolledFromCourses = user?.enrolledCourses?.some(checkExpiry);
    const enrolledFromSubscriptions = user?.subscriptions?.some(checkExpiry);
    setIsEnrolled(enrolledFromCourses || enrolledFromSubscriptions);
  }, [user, data, utcNow]);


  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on('waiting', () => console.log('player is waiting'));
    player.on('dispose', () => console.log('player will dispose'));
  };

  const handleVideoSelect = (video, isLocked) => {
    if (isLocked) return;
    setSelectedVideo(video);
    // On mobile, maybe close playlist after selection?
    if (window.innerWidth < 1024) setShowPlaylist(false);
  };

  const handleDownloadClick = (e, pdfLink) => {
    e.stopPropagation();
    if (isSignedIn) {
      window.open(pdfLink, '_blank');
    } else {
      navigate('/sign-in');
    }
  };

  if (!isOpen) return null;

  // Active Video (or first one if none selected for display in player area)
  const activeVideo = selectedVideo || videos[0];
  const isVideoSelected = !!selectedVideo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-0 sm:p-4 md:p-6 transition-all duration-300">
      <div className="bg-white w-full h-full sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-[1600px] relative">

        {/* Close Button (Mobile/Desktop) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors md:hidden"
        >
          <FaTimes />
        </button>

        {/* --- LEFT SIDE: VIDEO PLAYER --- */}
        <div className={`flex-1 flex flex-col bg-black relative ${showPlaylist ? 'hidden md:flex' : 'flex'}`}>
          {/* Header (Desktop) */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-emerald-400"><FaPlay /></span>
              {data?.title || "Course Player"}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-black relative">
            {isVideoSelected ? (
              <div className="w-full h-full">
                <Videojs
                  options={{
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    sources: [{
                      src: selectedVideo.video_url,
                      type: 'application/x-mpegURL'
                    }],
                    html5: { hls: { overrideNative: true } }
                  }}
                  onReady={handlePlayerReady}
                />
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <div className="text-6xl mb-4 opacity-20"><FaPlay /></div>
                <p className="text-lg">Select a video from the playlist to start watching</p>
              </div>
            )}
          </div>

          {/* Video Info Footer */}
          {isVideoSelected && (
            <div className="p-6 bg-slate-900 text-white border-t border-slate-800">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold mb-2">{selectedVideo.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                    <span>Topic: <span className="text-slate-200">{selectedVideo.topic}</span></span>
                    {selectedVideo.sub_topic && <span>Sub-topic: <span className="text-slate-200">{selectedVideo.sub_topic}</span></span>}
                  </div>
                </div>

                {selectedVideo.pdf_link && (
                  <button
                    onClick={(e) => handleDownloadClick(e, selectedVideo.pdf_link)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20 whitespace-nowrap"
                  >
                    <FaDownload /> Download PDF
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: PLAYLIST --- */}
        <div className={`w-full md:w-96 bg-slate-50 border-l border-slate-200 flex flex-col ${!showPlaylist ? 'hidden md:flex' : 'flex'} h-full`}>
          <div className="p-5 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">Course Content</h3>
              <p className="text-xs text-slate-500 font-medium">{videos.length} Lectures</p>
            </div>
            {/* Mobile Toggle Back to Video */}
            <button
              className="md:hidden text-slate-500"
              onClick={() => setShowPlaylist(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {videos.map((video, idx) => {
              const isLocked = !isEnrolled && video.type === 'paid';
              const isActive = selectedVideo?._id === video._id;
              const showDownload = (video.type === 'free' || isEnrolled) && video.pdf_link;

              return (
                <div
                  key={video._id}
                  onClick={() => handleVideoSelect(video, isLocked)}
                  className={`group flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border relative ${isActive
                      ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                      : isLocked
                        ? 'bg-slate-100 border-transparent opacity-70 cursor-not-allowed'
                        : 'bg-white border-slate-100 hover:border-emerald-100 hover:shadow-md'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${isActive ? 'bg-emerald-500 text-white' : isLocked ? 'bg-slate-300 text-slate-500' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                    }`}>
                    {isLocked ? <FaLock /> : isActive ? <FaPlay className="ml-1" /> : (idx + 1)}
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className={`text-sm font-bold mb-1 leading-tight ${isActive ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${video.type === 'free' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                        {video.type === 'free' ? 'Free Preview' : 'Premium'}
                      </span>
                      <span className="text-slate-400 truncate">{video.topic}</span>
                    </div>
                  </div>

                  {/* Download Icon Button inside playlist item */}
                  {showDownload && (
                    <button
                      onClick={(e) => handleDownloadClick(e, video.pdf_link)}
                      className="absolute right-4 top-4 p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                      title="Download PDF"
                    >
                      <FaDownload size={14} />
                    </button>
                  )}
                </div>
              );
            })}

            {videos.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                No videos available in this module.
              </div>
            )}
          </div>

          {/* Mobile Floating Button to show playlist when in video mode */}
          {!showPlaylist && (
            <button
              onClick={() => setShowPlaylist(true)}
              className="md:hidden fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-xl z-50 hover:bg-slate-800 transition-colors"
            >
              <FaList />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubvideoModal;
