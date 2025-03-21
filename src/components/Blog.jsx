import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Blog = () => {
    const [trendingblog, setTrendingBlog] = useState(null)
    const [blogData, setBlogData] = useState(null);

    useEffect(() => {
        run()
    }, []);


    const navigate = useNavigate()
    async function run() {
        try {
            const response = await axios.get("http://localhost:3000/api/blogs/all?trending=true");
            console.log(response.data);
            setTrendingBlog(response.data);

            const response2 = await axios.get("http://localhost:3000/api/blogs/all");
            setBlogData(response2.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        };
    }
    // Function to parse the HTML encoded content


    return (
        <div>
            <span className=' h4 text-green-500  p-1 font-sans mx-20 mt-20' >Trending</span>
            <div class="border-b-2 border-gray-300 w-[200px] mt-2 mx-20"></div>
            <div className='container flex flex-wrap mt-10 mb-10'>
                {trendingblog && trendingblog.map((blog, index) => (

                    <div
                        onClick={() => navigate(`/blogdetails/${blog._id}`)}
                        className="cursor-pointer flex  px-4 py-8 text-green-700 bg-gradient-to-br from-green-200 to-blue-200 shadow-lg rounded-lg p-6 mb-8 transition-transform transform hover:scale-105 w-full sm:w-[300px] md:w-[200px] lg:w-[500px] xl:w-[600px] mx-auto">
                        <div>
                            <h1 className='text-4xl text-gray-50  font-sans font-bold m-2'>0{index + 1}</h1>
                        </div>
                        <div
                            key={blog.id}
                            className="ml-11"
                        >
                            <h2
                                className="text-3xl font-extrabold   mb-4"
                                dangerouslySetInnerHTML={{ __html: blog.title }}
                            />
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 text-sm"> <i className="bi bi-bell-fill"></i> {new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            <div>
                <span className=' h4 text-green-500  p-1  font-serif mx-20 mt-48' >Recent Blogs</span>
                <div class="border-b-2 border-gray-300 w-[200px] mt-2 mx-20"></div>

                <div className='container bg-gradient-to-br from-green-200 to-blue-200 rounded-lg mt-2'>
                    {blogData && blogData.map((blog, index) => (

                        <div
                            onClick={() => navigate(`/blogdetails/${blog._id}`)}

                            key={blog.id}
                            className="ml-11 p-3 cursor-pointer"
                        >
                            {/* <Link to={blog.link}> */}
                            <h2
                                className="text-3xl font-extrabold  text-green-700  m-1"
                                dangerouslySetInnerHTML={{ __html: blog.title }}
                            />
                            <p
                                className="text-sm font-semibold text-gray-800 m-1"
                                dangerouslySetInnerHTML={{ __html: blog.shortDescription }}
                            />
                            <div className="flex items-center space-x-2 m-2">
                                <span className="text-gray-500 text-sm"> <i className="bi bi-bell-fill"></i> {new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                            {/* </Link> */}

                            <hr />

                        </div>

                    ))}
                </div>

            </div>
        </div>
    );
};

export default Blog;

