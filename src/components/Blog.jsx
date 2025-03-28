import React, { useEffect, useState } from "react";
// import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Api from "../service/Api";
import BlogAdveryisement from "./BlogAdveryisement";

// const VITE_APP_API_BASE_URL=import.meta.env.VITE_APP_API_BASE_URL

const Blog = () => {
  const [trendingblog, setTrendingBlog] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(""); // Track selected topic

  useEffect(() => {
    run();
  }, []);

  const navigate = useNavigate();
  async function run() {
    try {
      const topics = await Api.get(`blogs/topics`);
      setTopics(topics.data);

      const response = await Api.get(`blogs/all?trending=true`);
      console.log(response.data);
      setTrendingBlog(response.data);

      const response2 = await Api.get(`blogs/all`);
      setBlogData(response2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleTopicSelect = async (topicId) => {
    setSelectedTopic(topicId);

    // Fetch blogs by topic
    try {
      const response = await Api.get(`blogs/all?topic=${topicId}`);
      setBlogData(response.data);
    } catch (error) {
      console.error("Error fetching blogs by topic:", error);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex">
      <div className="w-full md:w-4/5">
        <div className=" flex justify-center items-center bg-blue-100">
          <span
            className="m-2 py-2 px-4 cursor-pointer rounded-sm bg-blue-950 text-white"
            onClick={() => handleTopicSelect("")} // Show all blogs if "All" is clicked
          >
            All
          </span>

          {topics.map((title) => (
            <span
              key={title._id} // Add unique key to each topic
              className="m-2 py-2 px-4 cursor-pointer rounded-sm bg-blue-950 text-white"
              onClick={() => handleTopicSelect(title.topic)} // Fetch blogs based on the topic
            >
              {title.topic}
            </span>
          ))}
        </div>
        <div className=" h4 bg-green-200  p-1 m-1 ">Trending Articles</div>
        {/* <div class="border-b-2 border-gray-300 w-[200px] mt-2 mx-20"></div> */}
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-10 mb-10">
          {trendingblog &&
            trendingblog.map((blog, index) => (
              <div
                onClick={() => navigate(`/blogdetails/${blog._id}`)}
                className="cursor-pointer flex  px-4 py-8 text-green-700  p-3 mb-8 transition-transform transform hover:scale-105 w-full  md:w-[100%] mx-2"
              >
                <div
                  className={`grid ${
                    blog.photo
                      ? "grid-cols-1 md:grid-cols-[150px,2fr] lg:grid-cols-[150px,2fr]"
                      : "grid-cols-1"
                  } gap-4 items-center`}
                >
                  <div>
                    {/* <h1 className='text-4xl text-gray-200  font-sans font-bold m-2'>0{index + 1}</h1> */}
                    {blog.photo && (
                      <img
                        src={blog.photo}
                        alt="no photo"
                        className="w-full object-cover"
                      />
                    )}
                  </div>
                  <div key={blog.id} className="ml-11">
                    <h2
                      className="text-xl font-semibold mb-4"
                      dangerouslySetInnerHTML={{ __html: blog.title }}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">
                        {" "}
                        <i className="bi bi-bell-fill"></i>{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div>
          <div className=" h4 bg-green-200  p-1 m-1 ">Recent Articles</div>
          {/* <div class="border-b-2 border-gray-300 w-[200px] mt-2 mx-20"></div> */}

          <div className="container rounded-lg mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {blogData &&
              blogData.map((blog, index) => (
                <div
                  onClick={() => navigate(`/blogdetails/${blog._id}`)}
                  key={blog.id}
                  className="ml-1 p-3 cursor-pointer "
                >
                  <div
                    className={`grid ${
                      blog.photo
                        ? "grid-cols-1 md:grid-cols-[150px,2fr] lg:grid-cols-[150px,2fr]"
                        : "grid-cols-1"
                    } gap-4 items-center`}
                  >
                    <div>
                      {/* <h1 className='text-4xl text-gray-200  font-sans font-bold m-2'>0{index + 1}</h1> */}
                      {blog.photo && (
                        <img
                          src={blog.photo}
                          alt="no photo"
                          className="w-full object-cover max-h-48"
                        />
                      )}
                    </div>
                    {/* <Link to={blog.link}> */}
                    <div>
                      <h2
                        className="text-xl font-semibold my-1 text-green-700  m-1"
                        dangerouslySetInnerHTML={{ __html: blog.title }}
                      />
                      <p
                        className="text-xs font-semibold text-gray-700 m-2"
                        dangerouslySetInnerHTML={{
                          __html: blog.shortDescription,
                        }}
                      />
                      <div className="flex items-center space-x-2 m-2">
                        <span className="text-gray-500 text-sm">
                          {" "}
                          <i className="bi bi-bell-fill"></i>{" "}
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* </Link> */}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-1/5 hidden md:block">
        <BlogAdveryisement />
      </div>
    </div>
  );
};

export default Blog;
