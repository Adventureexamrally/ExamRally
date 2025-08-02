import React, { useEffect, useState, useRef, useContext } from "react";
import Videojs from './Videojs';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";

const SubvideoModal = ({ videos = [], onClose, isOpen }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const playerRef = useRef(null);
  const { user } = useContext(UserContext);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

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

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  const backtolist = () => {
    setSelectedVideo(null);
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
                backtolist={backtolist}
              />
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const isFree = video.type === 'free';

                return (
                  <div
                    key={video._id}
                    className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
                  >
                    {!isFree && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <span className="text-white text-lg font-semibold">🔒 Locked</span>
                      </div>
                    )}

                    {/* THUMBNAIL: Only this is clickable */}
                    <div
                      className="relative pt-[56.25%] bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (isFree) handleVideoSelect(video);
                      }}
                      tabIndex={isFree ? 0 : -1}
                      role="button"
                      aria-label={`Play video: ${video.title}`}
                      onKeyDown={(e) => isFree && e.key === 'Enter' && handleVideoSelect(video)}
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

                    {/* TEXT CONTENT */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="mb-4 space-y-2 text-gray-600">
                        <p className="flex items-start">
                          <strong className="w-20 flex-shrink-0">Subject:</strong>
                          <span className="flex-grow">{video.subject}</span>
                        </p>
                        <p className="flex items-start">
                          <strong className="w-20 flex-shrink-0">Topic:</strong>
                          <span className="flex-grow">{video.topic}</span>
                        </p>
                        {video.sub_topic && (
                          <p className="flex items-start">
                            <strong className="w-20 flex-shrink-0">Sub-topic:</strong>
                            <span className="flex-grow">{video.sub_topic}</span>
                          </p>
                        )}
                      </div>


                      {video.pdf_link ? (
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => isFree ? handleDownloadClick(video.pdf_link) : null}
                            disabled={!isFree}
                            className={`inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                              isFree
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-400 text-white cursor-not-allowed'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {isFree ? 'Download PDF' : 'PDF Locked'}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 flex justify-center">
                          <span className="text-gray-600 btn disabled border-2 border-green-600">
                            Pdf - Coming Soon...
                          </span>
                        </div>
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
