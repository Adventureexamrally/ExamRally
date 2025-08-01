import React, { useRef, useEffect, useState, useContext } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';
import 'videojs-http-source-selector/dist/videojs-http-source-selector.css';
import Api from '../service/Api';
import { UserContext } from '../context/UserProvider';
import { useUser } from '@clerk/clerk-react';
import { FaPlus, FaTimes, FaCheck, FaBookmark } from 'react-icons/fa';

const Videojs = ({ options, onReady, courseId, backtolist }) => {
  const { user } = useContext(UserContext);
  const { isSignedIn } = useUser();
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  useEffect(() => {
    const el = videoRef.current;
    if (el && !playerRef.current) {
      const player = videojs(el, options, () => onReady?.(player));
      player.on('timeupdate', () => {
        setCurrentTime(player.currentTime());
        setDuration(player.duration());
      });
      player.on('ended', () => {
        setIsCompleted(true);
        postWatchedVideo(true, []);
      });
      player.httpSourceSelector();
      playerRef.current = player;
    }
    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [options, onReady]);

  useEffect(() => {
    if (user?._id && options.sources?.[0]?.src) {
      fetchLatestNotes();
    }
  }, [user, courseId, options]);

  const fetchLatestNotes = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get(`video-courses/users/${user._id}/watched-videos`);
      const videos = res.data?.WatchedVideos?.WatchedVideos || [];
      const record = videos.find(v => v.video_url === options.sources?.[0]?.src);
      setSavedNotes(record?.notes || []);
      setIsCompleted(record?.completed || false);
      setIsFirstTime(!record);
    } catch (err) {
      console.error('Fetch notes error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!noteText.trim()) return;
    const newNote = {
      content: noteText.trim(),
      time: formatTime(currentTime),
      timestamp: currentTime
    };
    await postWatchedVideo(isCompleted, [newNote]);
    setNoteText('');
    setShowModal(false);
  };

  const postWatchedVideo = async (completed = false, newNotes = []) => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const res = await Api.get(`video-courses/users/${user._id}/watched-videos`);
      const videos = res.data?.WatchedVideos?.WatchedVideos || [];
      const record = videos.find(v => v.video_url === options.sources?.[0]?.src);
      const existingNotes = record?.notes || [];

      const mergedNotes = [...existingNotes];
      newNotes.forEach(n => {
        const exists = mergedNotes.some(m => m.content === n.content && m.time === n.time);
        if (!exists) mergedNotes.push(n);
      });

      mergedNotes.sort((a, b) => a.timestamp - b.timestamp);

      const alreadyCompleted = record?.completed || false;
      if (!isFirstTime && mergedNotes.length === existingNotes.length && completed === alreadyCompleted) {
        console.log('No changes detected. Skipping update.');
        return;
      }

      await Api.post(`video-courses/users/${user._id}/watched-videos`, {
        courseId,
        video_url: options.sources?.[0]?.src,
        duration: playerRef.current?.duration(),
        completed: completed || isCompleted,
        notes: mergedNotes,
        currentTime,
      });

      setSavedNotes(mergedNotes);
      setIsFirstTime(false);
      if (completed) setIsCompleted(true);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteClick = (timestamp) => {
    if (playerRef.current) {
      playerRef.current.currentTime(timestamp);
      playerRef.current.play();
    }
  };

const handleDeleteNote = async (noteIdToDelete) => {
  const updatedNotes = savedNotes.filter(note => note._id !== noteIdToDelete);
  setSavedNotes(updatedNotes);

  try {
    await Api.post(`video-courses/users/${user._id}/watched-videos`, {
      courseId,
      video_url: options.sources?.[0]?.src,
      duration: playerRef.current?.duration(),
      completed: isCompleted,
      notes: updatedNotes,
      currentTime,
    });
  } catch (err) {
    console.error("Error deleting note:", err);
  }
};


  const handleSkip = (seconds) => {
    if (playerRef.current) {
      const current = playerRef.current.currentTime();
      playerRef.current.currentTime(current + seconds);
    }
  };

  return (
    <div className="lg:fixed inset-0 flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      <div className="w-full lg:flex-1 flex flex-col items-center justify-center bg-black p-4 relative">
        <div data-vjs-player className="w-full max-w-5xl h-full">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered w-full h-full rounded-lg shadow-md"
            controls
            playsInline
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-white text-sm px-4 w-full max-w-5xl">
          <button onClick={() => handleSkip(-10)} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">
            ⏪ 10s
          </button>
          <div>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <button onClick={() => handleSkip(10)} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">
            10s ⏩
          </button>
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shadow-inner flex flex-col overflow-hidden">
       <div className="container mx-auto flex flex-col items-center justify-center">
      {/* Your other content here */}
      
      <button 
        onClick={backtolist} 
        className="mt-4 px-4 py-2 bg-green-500  fw-bold text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
      >
        <i className="bi fw-bold bi-chevron-double-left"></i>

        Back
      </button>
    </div>
        <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <FaBookmark className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">My Notes</h2>
            {isCompleted && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <FaCheck className="mr-1" size={10} /> Completed
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            title="Add Note"
            disabled={isLoading}
          >
            <FaPlus size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : savedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <FaBookmark className="text-gray-300 text-4xl mb-3" />
              <p className="text-gray-500 mb-2">No notes yet</p>
              <p className="text-sm text-gray-400">Add your first note by clicking the + button</p>
            </div>
          ) : (
        <div className="space-y-3">
  {savedNotes.map((note, index) => (
    <div
      key={index}
      className="p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer transition-colors duration-150"
      onClick={() => handleNoteClick(note.timestamp)}
    >
      <p className="text-sm text-gray-800 font-semibold">{note.content}</p>

      <div className="flex justify-between items-center mt-2">
        {/* Left side: Timer */}
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {note.time}
        </span>

        {/* Right side: Delete button */}
        <div className="flex items-center space-x-2">
          {index === savedNotes.length - 1 && isFirstTime && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              New
            </span>
          )}
          <button
  className="p-1 rounded-full hover:bg-red-100 text-green-500 hover:text-red-700 transition-colors duration-150"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteNote(note._id);
  }}
  title="Delete Note"
>
 <i className="bi bi-trash-fill"></i>
</button>


        </div>
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full p-6 relative shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              <FaTimes size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Add Note <i className="bi bi-vector-pen text-blue-600"></i>
              </h2>
            </div>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full h-[250px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Write your note here..."
              disabled={isLoading}
            />

            <div className="flex items-center justify-between mt-6">
           <button
  onClick={() => {}}
  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 bg-gray-200 text-gray-400 cursor-not-allowed"
  disabled
>
  <FaCheck size={14} />
  <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
</button>


              <button
                onClick={handleSaveNotes}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                disabled={isLoading || !noteText.trim()}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Note'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videojs;
