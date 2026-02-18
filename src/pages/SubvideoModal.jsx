import React, { useEffect, useState, useRef, useContext } from "react";
import Videojs from './Videojs';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";

const SubvideoModal = ({ videos = [], onClose, isOpen, data }) => {
  console.log(data);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const playerRef = useRef(null);
  const { user, utcNow } = useContext(UserContext);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [expireDate, setExpireDate] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!isSignedIn && selectedVideo) {
      navigate('/sign-in');
    }
  }, [isSignedIn, selectedVideo, navigate]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
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
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 1 day in ms

      if (
        !isNaN(daysLeft) &&
        daysLeft >= 0 &&
        course?.courseId?.includes(data._id)
      ) {
        setExpireDate(daysLeft); // Set days left
        return true;
      }

      return false;
    };

    const enrolledFromCourses = user?.enrolledCourses?.some(checkExpiry);
    const enrolledFromSubscriptions = user?.subscriptions?.some(checkExpiry);

    setIsEnrolled(enrolledFromCourses || enrolledFromSubscriptions);
  }, [user, data, utcNow]);

  console.log(isEnrolled);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on('waiting', () => console.log('player is waiting'));
    player.on('dispose', () => console.log('player will dispose'));
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  const handleDownloadClick = (pdfLink) => {
    if (isSignedIn) {
      window.open(pdfLink, '_blank');
    } else {
      navigate('/sign-in');
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (!isOpen || !videos.length) return null;

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {!selectedVideo && (
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light focus:outline-none transition-colors z-10"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        )}

        {selectedVideo ? (
          <div className="p-6">
            <h2 id="modal-title" className="text-2xl font-bold mb-4">
              {selectedVideo.title}
            </h2>
            <div className="aspect-w-16 aspect-h-9 mb-4">
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
                  html5: {
                    hls: {
                      overrideNative: true
                    }
                  }
                }}
                onReady={handlePlayerReady}
                backtolist={selectedVideo => setSelectedVideo(null)}

              />
            </div>
            <button onClick={() => setSelectedVideo(null)} className="text-blue-600 hover:underline">← Back to list</button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((courseEntry) => {
                // Use the new videos array if available, otherwise fallback to single video properties for backward compatibility
                const videoList = courseEntry.videos && courseEntry.videos.length > 0
                  ? courseEntry.videos
                  : [{
                    title: courseEntry.title || "Video",
                    video_url: courseEntry.video_url,
                    type: courseEntry.type || "free",
                    isLive: courseEntry.isLive || false // Assuming old structure might imply live status differently or not at all
                  }];

                return videoList.map((video, vIndex) => {
                  // Determine properties based on whether it's from the new array or old structure
                  // Note: The 'video' object here is either an item from the 'videos' array OR the constructed object above.
                  // However, for locking logic, we need course-level dates (live_date, expiry) from 'courseEntry'

                  const liveDate = courseEntry.live_date ? new Date(courseEntry.live_date) : null;
                  const showDate = courseEntry.live_date ? new Date(courseEntry.live_date) : null;
                  const isFree = video.type === 'free'; // Check individual video type
                  const isPaid = video.type === 'paid';
                  const isUserEnrolled = isEnrolled;
                  const utcNow = new Date();

                  let isLocked = false;
                  let showDateText = 'Coming Soon';

                  if (isFree) {
                    // Free videos might still be date-restricted by the course entry's live_date
                    isLocked = liveDate && utcNow < liveDate;
                    if (courseEntry.show_date && liveDate) {
                      showDateText = isLocked
                        ? `Available from ${liveDate.toLocaleString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}`
                        : '';
                    } else {
                      showDateText = 'Coming Soon';
                    }
                  } else if (isPaid) {
                    if (!isUserEnrolled) {
                      isLocked = true;
                      showDateText = 'Purchase Required';
                    } else {
                      // Enrolled users might still wait for live date
                      isLocked = liveDate && utcNow < liveDate;
                      if (courseEntry.show_date && liveDate) {
                        showDateText = isLocked
                          ? `Available from ${liveDate.toLocaleString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}`
                          : '';
                      } else {
                        showDateText = 'Coming Soon';
                      }
                    }
                  }

                  const uniqueKey = `${courseEntry._id}-${vIndex}`;

                  return (
                    <div
                      key={uniqueKey}
                      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                      {isLocked && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10 text-white rounded-lg">
                          <span className="text-lg font-semibold">🔒 Locked</span>
                          <span className="text-sm mt-1">{showDateText}</span>
                        </div>
                      )}

                      <div
                        className="relative pt-[56.25%] bg-gray-100 cursor-pointer"
                        onClick={() => {
                          if (!isLocked) handleVideoSelect(video);
                        }}
                        tabIndex={!isLocked ? 0 : -1}
                        role="button"
                        aria-label={`Play video: ${video.title}`}
                        onKeyDown={(e) => !isLocked && e.key === 'Enter' && handleVideoSelect(video)}
                      >
                        {/* Live Badge */}
                        {video.isLive && (
                          <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                            Available
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md mx-auto mb-3 transition-transform transform hover:scale-110">
                              <svg
                                className="w-8 h-8 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                            <span className="text-gray-600 font-medium text-sm bg-white bg-opacity-90 px-2 py-1 rounded">
                              Play
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-tight" title={video.title}>
                            {video.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded border ${isFree ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {isFree ? 'Free' : 'Paid'}
                          </span>
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500 mb-2">
                            <span className="font-semibold text-gray-700">Topic:</span> {courseEntry.topic}
                          </div>

                          {courseEntry.pdf_link ? (
                            <button
                              onClick={() => isFree || isUserEnrolled ? handleDownloadClick(courseEntry.pdf_link) : null}
                              disabled={!isFree && !isUserEnrolled}
                              className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${isFree || isUserEnrolled
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                              {isFree || isUserEnrolled ? 'Download PDF' : 'PDF Locked'}
                            </button>
                          ) : (
                            <div className="text-center text-xs text-gray-400 italic py-2">
                              No PDF available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })}




            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubvideoModal;
