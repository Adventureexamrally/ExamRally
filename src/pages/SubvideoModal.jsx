import React, { useEffect, useState, useRef, useContext } from "react";
import Videojs from './Videojs';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";

const SubvideoModal = ({ videos = [], onClose, isOpen,data }) => {
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
{videos.map((video) => {
  const liveDate = new Date(video.live_date);
  const showDate = video.live_date ? new Date(video.live_date) : null;
  const isFree = video.type === 'free';
  const isPaid = video.type === 'paid';
  const isUserEnrolled = isEnrolled;
  const utcNow = new Date(); // Current time

  let isLocked = false;
  let showDateText = 'Coming Soon';

if (isFree) {
  isLocked = utcNow < liveDate;
  if (video.show_date) {
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
    isLocked = utcNow < liveDate;
    if (video.show_date) {
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


  return (
    <div
      key={video._id}
      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {isLocked && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10 text-white">
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md mx-auto mb-3">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium">Play: {video.topic}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
          {video.title}
        </h3>
        <div className="mb-4 space-y-2 text-gray-600">
          <p><strong>Subject:</strong> {video.subject}</p>
          <p><strong>Topic:</strong> {video.topic}</p>
          {video.sub_topic && <p><strong>Sub-topic:</strong> {video.sub_topic}</p>}
        </div>

        {video.pdf_link ? (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => isFree ? handleDownloadClick(video.pdf_link) : null}
              disabled={!isFree}
              className={`inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                isFree ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              Download PDF
            </button>
          </div>
        ) : (<button
  disabled
  className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed text-sm mx-auto block"
>
  PDF - Coming Soon...
</button>
 )}
      </div>
    </div>
  );
})}




            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubvideoModal;
