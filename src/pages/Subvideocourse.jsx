import React, { useEffect, useState } from "react";
import Api from "../service/Api";
import { useParams } from "react-router-dom";
import VideoModal from "./SubvideoModal"; // Adjust path if needed
import SubvideoModal from "./SubvideoModal";

const Subvideocourse = () => {
  const { id, sub } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicRes, courseRes] = await Promise.all([
          Api.get(`topic-test/test-sub-topic/${sub}`),
          Api.get(`video-courses/video-course/main-page/${id}`),
        ]);
        setSubtopic(topicRes.data);
        setCourseData(courseRes.data);
        console.warn(courseRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id, sub]);




  if (!courseData) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading...</div>
    );
  }
// Then trigger with:

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-start justify-between">
        <div className="w-full md:w-2/3 pr-4">
          <h1 className="text-3xl font-bold mb-4 text-[#131656]">
            {courseData.title}
          </h1>
          <div className="mb-8">
            {courseData.author_data?.map((author) => (
              <div key={author._id} className="p-4 rounded mb-4">
                <p className="font-bold text-green">
                  <span className="text-[#131656]">Author:</span> {author.name}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {author.designation && (
                    <p className="font-medium text-sm bg-[#0000FF] rounded text-white px-2 py-1">
                      {author.designation}
                    </p>
                  )}
                  {author.description?.map((desc, i) => (
                    <p
                      key={desc.title + i}
                      className="font-medium text-sm bg-[#0000FF] rounded text-white px-2 py-1"
                    >
                      {desc.title}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <img
            src={courseData.logo}
            alt={courseData.title}
            className="w-48 h-auto mb-4 md:ml-auto"
          />
        </div>
      </div>

      {/* Course Highlights */}
      <h2 className="text-2xl font-semibold mb-4 bg-green-500 p-2 text-white rounded">
        Course Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {courseData.course_highlight?.map((highlight) => (
          <div key={highlight._id} className="bg-white rounded-lg shadow-md border p-4 text-center">
            <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
            <img
              src={highlight.logo}
              alt="Course Highlight"
              className="w-full h-20 object-contain rounded-md mb-4"
            />
            <p className="text-sm text-gray-800">{highlight.description}</p>
          </div>
        ))}
      </div>

      {/* Subtopics */}
      <h2 className="text-2xl font-semibold mb-4 bg-green-500 p-2 text-white rounded">
        {courseData.subject}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subtopic?.map((sub, idx) =>
          sub.topics?.map((topic, index) => (
            <div key={`${idx}-${index}`}>
              <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full">
                <div className="card-body text-center flex flex-col justify-evenly">
                  <h5 className="card-title font-semibold">{topic.name}</h5>
                  <button
                    className="mt-3 py-2 px-4 rounded w-full transition bg-green-500 text-white hover:bg-green-600"
                    onClick={() => {
                      const video = courseData.video_courses.filter(
                        v => v.topic === topic.name
                      );
                      setModalOpen(true);
                      if (video) setCurrentVideo(video);
                    }}
                  >
                    View Videos
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reusable Modal Component */}
      <SubvideoModal 
  videos={currentVideo} 
  isOpen={modalOpen} 
  onClose={() => setModalOpen(false)} 
/>
    </div>
  );
};

export default Subvideocourse;
