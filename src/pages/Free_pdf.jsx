import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import Api from '../service/Api';

const Free_pdf = () => {
  const [seo, setSeo] = useState([])
  const [ad, setAD] = useState([])

  const [selectedTopic, setSelectedTopic] = useState(null);




  const data = [
    {
      "topic": "Quantitative Aptitude",
      "title": "Quantitative Aptitude for Beginners"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Advanced Quantitative Aptitude Techniques"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Mastering Time and Work Problems in Quantitative Aptitude"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Understanding Number Series in Quantitative Aptitude"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Speed and Distance Tricks for Quantitative Aptitude"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Profit and Loss: Quick Methods"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Algebra Simplified for Competitive Exams"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Percentage and Ratio Mastery"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Probability: Key Concepts and Formulas"
    },
    {
      "topic": "Quantitative Aptitude",
      "title": "Quantitative Aptitude for Bank Exams"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Basic Reasoning Ability Skills"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Logical Reasoning for Competitive Exams"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Syllogism Simplified for Competitive Exams"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Blood Relations and Direction Sense Tips"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Verbal Reasoning Puzzles"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Non-Verbal Reasoning: A Complete Guide"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Seating Arrangement and Puzzle Solving"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Analogy and Classification Techniques"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Critical Thinking for Reasoning Ability"
    },
    {
      "topic": "Reasoning Ability",
      "title": "Reasoning Ability for Government Exams"
    },
    {
      "topic": "English",
      "title": "Basic English Grammar for Competitive Exams"
    },
    {
      "topic": "English",
      "title": "Advanced Vocabulary for English Proficiency"
    },
    {
      "topic": "English",
      "title": "English Comprehension: Tips and Tricks"
    },
    {
      "topic": "English",
      "title": "Sentence Improvement for English Exams"
    },
    {
      "topic": "English",
      "title": "Common English Idioms and Phrases"
    },
    {
      "topic": "English",
      "title": "English Tenses Explained"
    },
    {
      "topic": "English",
      "title": "Cloze Test Preparation for English"
    },
    {
      "topic": "English",
      "title": "English for Bank Exams"
    },
    {
      "topic": "English",
      "title": "Antonyms and Synonyms Mastery"
    },
    {
      "topic": "English",
      "title": "English Language Skills for Competitive Exams"
    },
    {
      "topic": "Computer",
      "title": "Introduction to Computers for Competitive Exams"
    },
    {
      "topic": "Computer",
      "title": "Computer Basics for Beginners"
    },
    {
      "topic": "Computer",
      "title": "Understanding Operating Systems"
    },
    {
      "topic": "Computer",
      "title": "Microsoft Office: MS Word, Excel, PowerPoint"
    },
    {
      "topic": "Computer",
      "title": "Internet Basics and Networking"
    },
    {
      "topic": "Computer",
      "title": "Computer Security and Basics of Cyber Security"
    },
    {
      "topic": "Computer",
      "title": "Computer Memory and Storage Devices"
    },
    {
      "topic": "Computer",
      "title": "Basic Programming and Algorithms"
    },
    {
      "topic": "Computer",
      "title": "Computer Applications in Competitive Exams"
    },
    {
      "topic": "Computer",
      "title": "Computer Knowledge for Government Exams"
    },
    {
      "topic": "Static GK",
      "title": "Indian History: Key Events and Dates"
    },
    {
      "topic": "Static GK",
      "title": "Geography: Capitals, Rivers, and Mountains"
    },
    {
      "topic": "Static GK",
      "title": "Famous Landmarks of the World"
    },
    {
      "topic": "Static GK",
      "title": "Important Days and Events in India"
    },
    {
      "topic": "Static GK",
      "title": "Famous Personalities in Indian History"
    },
    {
      "topic": "Static GK",
      "title": "Culture and Heritage of India"
    },
    {
      "topic": "Static GK",
      "title": "Science and Technology for Static GK"
    },
    {
      "topic": "Static GK",
      "title": "Important Government Schemes and Policies"
    },
    {
      "topic": "Static GK",
      "title": "Awards and Honors in India"
    },
    {
      "topic": "Static GK",
      "title": "World Geography: Countries and Capitals"
    }
  ]


  // Extract unique topics from the data
  const uniqueTopics = [...new Set(data.map(pdf => pdf.topic))];

  // Function to handle topic click
  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null); // Toggle visibility
    } else {
      setSelectedTopic(topic);
    }
  };
  useEffect(() => {
    run()
  }, []);
  async function run() {
    const response2 = await Api.get(`/get-Specific-page/free-pdf`);
    setSeo(response2.data);
    console.log(response2.data);

    const response3 = await Api.get(`/blog-Ad/getbypage/free-pdf`);
    setAD(response3.data)
  }

  console.log(seo);

  return (
    <>
      <Helmet>
        {/* { seo.length > 0 && seo.map((seo)=>(
                    <> */}
        <title>{seo[0]?.seoData?.title}</title>
        <meta name="description" content={seo[0]?.seoData?.description} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
        {/* </>
                ))} */}

      </Helmet>
      <h2 className="text-2xl m-2 font-bold text-center text-green-600">FREE PDF</h2>

      <div className="flex container">
        <div className={`flex m-2 w-full ${ad.length > 0 ? "md:w-4/5" : "md:full "}`}>
          <div>
            {uniqueTopics.map((topic) => (
              <div
                key={topic}
                className="m-2 cursor-pointer text-xl font-bold p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                onClick={() => handleTopicClick(topic)}
              >
                <h1>{topic}</h1>
              </div>
            ))}
          </div>

          {/* Topic Titles */}
          <div className="flex flex-wrap justify-evenly w-full">
            {data
              .filter((pdf) => !selectedTopic||pdf.topic === selectedTopic)
              .map((pdf, index) => (
                <div key={index} className="m-2 shadow-md p-4 border rounded-lg bg-white w-full md:w-1/4">
                  <img src="" alt="not found" width={200} height={100} className="mx-auto mb-3" />
                  <h2 className="text-lg text-center">{pdf.title}</h2>
                </div>
              ))}
          </div>

        </div>

        {ad.length > 0 &&
          <div className="w-1/5 hidden md:block">
            <div>

              {ad.map((item) => (
                <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'>
                  <Link to={item.link_name}>
                    <img src={item.photo} alt="Not Found" className='rounded-md' /></Link >
                </div>
              ))}
            </div>
          </div>
        }
      </div >
    </>
  );
};


export default Free_pdf;
