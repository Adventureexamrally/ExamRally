import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Subblog = () => {
    const { id } = useParams();
    const [blogDetails, setBlogDetails] = useState({})

    useEffect(() => {
        run();
    }, [id])

    async function run() {
        try {
            const response = await axios.get(`http://localhost:3000/api/blogs/get/${id}`);
            console.log(response.data);
            setBlogDetails(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        };
    }
    return (
        <div className='container '>
            <div>
                <h2
                    className="text-3xl font-extrabold  text-green-700  m-1"
                    dangerouslySetInnerHTML={{ __html: blogDetails.title }}
                />
                <p
                    className="text-sm font-semibold text-gray-800 m-1"
                    dangerouslySetInnerHTML={{ __html: blogDetails.description }}
                />
                <div className="flex items-center space-x-2 m-2">
                    <span className="text-gray-500 text-sm"> <i className="bi bi-bell-fill"></i> {new Date(blogDetails.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className='mt-10'>
            {blogDetails.subtitles && blogDetails.subtitles.length > 0 ? (
                    blogDetails.subtitles.map((item, index) => (
                        <div key={item._id || index}>
                            <h2
                                className="text-xl font-extrabold text-gray-800 m-1"
                                dangerouslySetInnerHTML={{ __html: item.subtitle }}
                            />
                            <p
                                className="text-sm font-semibold text-gray-800 m-1"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No subtitles available</p>
                )}

            </div>
        </div>
    )
}

export default Subblog
