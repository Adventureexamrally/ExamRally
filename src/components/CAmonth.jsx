import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import Api from '../service/Api';
import { useNavigate } from 'react-router-dom';
const CAmonth = () => {
    const [CA, setCA] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        run();
    }, [])

    async function run() {
        try {
            const response2 = await Api.get("topic-test/getAffairs/all");
            setCA(response2.data);
            console.log("CA", response2.data);


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    console.log(CA);
    return (
        <div className='mt-5'>
            {CA.map((ca) => (


                <div>
                    <h1 className='m-3 text-gray-900 font-bold'>Month : {ca.currentAffair.month}</h1>
                    {ca.currentAffair.week.map((week) => (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography component="span" className='font-semibold'>{week.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='flex p-2'>

                                    {week.model.map((model) => (
                                        <div className='border font-medium m-1 p-3 w-fit'>
                                            <h1>{model.show_name}</h1>
                                            <div className='flex'>
                                                {model.pdfLink || model.pdf ? (
                                                    model.uploadType=="link" ? (
                                                        <button onClick={() => navigate(`/${model.pdfLink}`)} className="btn bg-green-500 w-100 m-2 p-2 w-auto text-white hover:bg-green-600">View Pdf</button>
                                                    ) : (<a href={model.pdfLink} target='blank' download={model.pdf} className="btn bg-green-500 w-100 m-2 p-2 w-auto text-white hover:bg-green-600">Download PDF</a>
                                                    )
                                                ) : (<button 
                                                    style={{
                                                        opacity: 0.5,  // Make it semi-transparent
                                                        cursor: "not-allowed",  // Change cursor to show it’s not clickable
                                                        backgroundColor: "#ccc" // Change background color to indicate it's disabled
                                                      }}
                                                    disabled={true} className="btn bg-green-500 w-100 m-2 p-2 w-auto text-white hover:bg-green-600">view pdf</button>
                                                )}

                                                <button onClick={() => navigate(`/instruction/${model.exams[0]}`)} className="btn bg-green-500 w-100 m-2 p-2 w-auto text-white hover:bg-green-600">Take Test</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default CAmonth
