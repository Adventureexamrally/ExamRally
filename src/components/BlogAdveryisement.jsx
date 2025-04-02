import React, { useEffect, useState } from 'react'
import Api from '../service/Api';
import { Link } from 'react-router-dom';

const BlogAdveryisement = () => {
    const [blogAd,setBlogAd]=useState([]);
    useEffect(() => {
        run()
    }, []);

    async function run() {
        try {
            const topics = await Api.get(`blog-Ad`);
            setBlogAd(topics.data)
            console.log(topics.data);
            
         
        } catch (error) {
            console.error("Error fetching data:", error);
        };
    }
    return (
        <div>
            {blogAd.length > 0 && 
            blogAd.map((item)=>(
                <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'>
                <Link to={item.link_name}>
                <img src={item.photo} alt="Not Found" className='rounded-md'/></Link >
                </div>
            ))}
        </div>
    )
}

export default BlogAdveryisement
