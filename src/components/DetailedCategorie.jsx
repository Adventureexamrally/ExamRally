import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Api from '../service/Api';

const DetailedCategorie = () => {
    const [catDetail, setCatDetails] = useState([]);
    const { link } = useParams();
    const [amount,setAmount]=useState("")
    const [discountedAmount,setdiscountedAmount]=useState("");
    const [CA,setCA]=useState([])

    console.log(link);


    useEffect(() => {
        run();
    }, [])

    async function run() {
        try {
            const response = await Api.get(`topic-test/test/${link}`);
            console.log("livetest", response.data);
            setCatDetails(response.data.test_content);
            setAmount(response.data.amount);
            setdiscountedAmount(response.data.discountedAmount)
            
            const response2=await Api.get("topic-test/getAffairs/all");
            setCA(response2.data);
            console.log("CA",response2.data);
            

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    console.log(CA);
    
    return (
        <div className='container'>
            {/* <h1 className="text-center fw-bold text-green-600">
                {/* <PsychologyIcon fontSize="large" className="text-green-600 me-2" /> 
                Reasoning Ability
            </h1> */}
            <div className="row mt-3">
                <div className="col-md-9" >
                    <div className="staticheader">
                        <p className="font mt-2 h5 leading-8">
                            <h1 className="text-green-500 font font-bold " dangerouslySetInnerHTML={{ __html: catDetail.title }}></h1>
                            <br />
                            <p dangerouslySetInnerHTML={{ __html: catDetail.description }}></p>
                        </p>
                    </div>
                    {catDetail?.sub_titles?.length > 0 && catDetail?.sub_titles?.map((sub) => (
                        <div className=" staticheader">
                            <p className="font mt-2 h5 leading-8">
                                <h1 className="text-green-500 font font-bold " dangerouslySetInnerHTML={{ __html: sub.title }}></h1>
                                <br />
                                <p dangerouslySetInnerHTML={{ __html: sub.description }}></p>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="col-md-3">
                    <div
                        className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner hoverstyle"
                        style={{
                            backgroundImage: `
                    radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
                    radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                    radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                    radial-gradient(at 0% 64%, rgb(11, 153, 41) 0px, transparent 85%),
                    radial-gradient(at 41% 94%, rgb(34, 214, 109) 0px, transparent 85%),
                    radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)
                  `,
                        }}
                    >
                        <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
                        <div className="text-white flex justify-between">
                            <span className="text-xl font-semibold font mb-3">Features</span>
                        </div>
                        <hr className="border-t border-gray-600" />
                        <ul className="space-y-2">
                            {[
                                'Exact Exam Level Questions',
                                'New Pattern Questions',
                                'Detailed Solution',
                                'Covered All Models',
                                'Clerk to RBI Grade B level Questions',
                                "Real Exam Interface",
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2 font">
                                    <span className="flex justify-center items-center w-4 h-4 bg-green-500 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-white">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className="text-white text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="text-center">
                            <p>
                                <del className="text-red-400 font">Original Price:</del>
                            </p>
                            <del className="bg-red-500 text-white rounded p-1 mb-2">Rs.{amount}</del>
                            <p className="text-white font h5">Discounted Price:</p>
                            <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                                Rs.{discountedAmount}
                            </button>
                            <p className="text-white font-bold">You Save Money: 210</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sidebar Buttons */}
            <div className="row p-3 bg-light">
                <div className="col-md-4">
                    <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600"
                    //onClick={handlePrelimsClick}
                    >
                        Prelims
                    </button>
                </div>
                <div className="col-md-4">
                    <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600"
                    //onClick={handleMainsClick}
                    >
                        Mains
                    </button>
                </div>
                <div className="col-md-4">
                    <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600"
                    //   onClick={handleUpdatesClick}
                    >
                        Previous Year Questions
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetailedCategorie
