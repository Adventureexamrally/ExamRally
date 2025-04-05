
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Api from '../service/Api';
import BlogAdveryisement from './BlogAdveryisement';

// const VITE_APP_API_BASE_URL=import.meta.env.VITE_APP_API_BASE_URL

const Subblog = () => {
    const { link } = useParams();
    const [blogDetails, setBlogDetails] = useState([])

    useEffect(() => {
        run();
    }, [link])

    async function run() {
        try {
            const response = await Api.get(`blogs/get/${link}`);
            console.log(response.data);
            setBlogDetails(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        };
    }
    return (
        <div className='flex'>
            {blogDetails.map((blogDetails)=>(
                <>
            <div className='container w-full md:w-4/5'>
                <div className='mt-4'>
                    <h2
                        className="text-3xl font-semibold text-green-700  m-1"
                        dangerouslySetInnerHTML={{ __html: blogDetails.title }}
                    />

                    <div className="flex items-center space-x-2 m-2">
                        <span className="text-gray-500 text-sm"> <i className="bi bi-bell-fill"></i> {new Date(blogDetails.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                {blogDetails.photo && <img src={blogDetails.photo} alt="no photo found" className='max-h-60' />}

                <p
                    className="text-md font-semibold text-gray-800 m-2"
                    dangerouslySetInnerHTML={{ __html: blogDetails.description }}
                />
                <div className='m-3'>

                    {blogDetails.subtitles && blogDetails.subtitles.length > 0 ? (
                        blogDetails.subtitles.map((item, index) => (
                            <div key={item._id || index}>
                                <h2
                                    className=""
                                    dangerouslySetInnerHTML={{ __html: item.subtitle }}
                                />
                                <p
                                    className=""
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No subtitles available</p>
                    )}

                </div>
            </div>
           
            <div  className='w-1/5 hidden md:block'>
                <BlogAdveryisement />
            </div>
            </>
             ))}
        </div>
    )
}

export default Subblog
