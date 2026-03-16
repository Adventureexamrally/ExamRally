import React, { useState, useEffect } from 'react';
import Api from '../service/Api';
import { FaPlus, FaTimes, FaCheck, FaBookmark } from 'react-icons/fa';

const VideoNotes = ({ user, courseId, videoUrl, player }) => {
    const [noteText, setNoteText] = useState('');
    const [savedNotes, setSavedNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false); // Track completion status locally for now or sync if needed

    // Helper to format time
    const formatTime = (secs) => {
        if (!secs && secs !== 0) return "00:00:00";
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = Math.floor(secs % 60);
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    };

    // Helper to get local notes key
    const getLocalKey = () => `video_notes_${user?._id || 'guest'}_${videoUrl}`;

    // Fetch notes when user or videoUrl changes
    useEffect(() => {
        if (user?._id && videoUrl) {
            loadNotes();
        }
    }, [user, courseId, videoUrl]);

    const loadNotes = async () => {
        setIsLoading(true);
        try {
            // 1. Try Local Storage first for immediate feedback
            const localData = localStorage.getItem(getLocalKey());
            if (localData) {
                const parsed = JSON.parse(localData);
                setSavedNotes(parsed);
            }

            // 2. Sync with Backend
            const res = await Api.get(`video-courses/users/${user._id}/watched-videos`);
            const videos = res.data?.watchedVideos || [];
            const record = videos.find(v => v.videoUrl === videoUrl);
            const serverNotes = record?.notes || [];

            // Merge logic (optional: server wins, or union)
            // For now, let's prefer server if available, but fallback to local
            if (serverNotes.length > 0) {
                setSavedNotes(serverNotes);
                localStorage.setItem(getLocalKey(), JSON.stringify(serverNotes)); // Update local
                setIsCompleted(record?.completed || false);
            } else if (!localData) {
                // If no local and no server, empty
                setSavedNotes([]);
            }
        } catch (err) {
            console.error('Fetch notes error:', err);
            // Fallback to local if server fails
            const localData = localStorage.getItem(getLocalKey());
            if (localData) {
                setSavedNotes(JSON.parse(localData));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const saveNote = async (note) => {
        // Optimistic Update
        const newNotes = [...savedNotes, note].sort((a, b) => a.timestamp - b.timestamp);
        setSavedNotes(newNotes);

        // Save to Local Storage immediately
        localStorage.setItem(getLocalKey(), JSON.stringify(newNotes));
        setNoteText('');
        setShowModal(false);

        // Sync with Backend (Background)
        try {
            const currentTime = player ? player.currentTime() : 0;
            const duration = player ? player.duration() : 0;

            await Api.post(`video-courses/users/${user._id}/watched-videos`, {
                courseId,
                video_url: videoUrl,
                duration,
                completed: isCompleted,
                notes: newNotes,
                currentTime
            });
        } catch (e) {
            console.error('Backend save failed, saved locally:', e);
        }
    };


    const handleNoteClick = (timestamp) => {
        if (player) {
            player.currentTime(timestamp);
            player.play();
        }
    };

    const handleDeleteNote = async (noteIdToDelete) => {
        const updatedNotes = savedNotes.filter(n => n._id !== noteIdToDelete);
        setSavedNotes(updatedNotes); // optimistic
        localStorage.setItem(getLocalKey(), JSON.stringify(updatedNotes)); // Update local

        // Sync
        try {
            const currentTime = player ? player.currentTime() : 0;
            const duration = player ? player.duration() : 0;

            await Api.post(`video-courses/users/${user._id}/watched-videos`, {
                courseId,
                video_url: videoUrl,
                duration,
                completed: isCompleted,
                notes: updatedNotes,
                currentTime
            });
        } catch (e) { console.error(e); }
    };


    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <FaBookmark className="text-blue-600" /> My Notes
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
                    title="Add Note"
                >
                    <FaPlus size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isLoading && savedNotes.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : savedNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
                        <FaBookmark className="text-3xl mb-2 opacity-20" />
                        <p className="text-sm">No notes yet.</p>
                        <p className="text-xs mt-1">Click + to add a timestamped note.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {savedNotes.map((note, index) => (
                            <div
                                key={index}
                                onClick={() => handleNoteClick(note.timestamp)}
                                className="group p-3 bg-gray-50 border border-gray-100 rounded hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer relative"
                            >
                                <p className="text-sm text-gray-800 pr-6">{note.content}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                                        {note.time}
                                    </span>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        title="Delete note"
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes />
                        </button>

                        <h3 className="text-lg font-bold text-gray-800 mb-4">Add Note at {player ? formatTime(player.currentTime()) : '00:00'}</h3>

                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full h-32 border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            placeholder="Type your note here..."
                            autoFocus
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => saveNote({ content: noteText.trim(), time: formatTime(player?.currentTime() || 0), timestamp: player?.currentTime() || 0 })}
                                disabled={!noteText.trim() || isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoNotes;
