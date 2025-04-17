import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OtherInstruction = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Default language
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
const {id} = useParams()
const handleNextClick = () => {
  if (!selectedLanguage) {
    alert("Please select a language to proceed.");
    return;
  }
  if (!isChecked) {
    alert("Please accept the declaration to proceed.");
    return;
  }
  navigate(`/mocktest/${id}`, { state: { language: selectedLanguage } });
};

  const handlePreviousClick = () => {
    navigate(`/instruction/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">New Test Create That</h1>

      {/* Instruction Header */}
      <div className="bg-blue-300 p-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Other Important Instructions</h2>
        {/* <label>
          <select
            className="p-2 border rounded"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
             <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
          </select>
        </label> */}
      </div>

      {/* Instruction Content */}
      {/* <div className="border-4 border-green-400 p-4 mt-4">
        <p>
          This is a Mock test. The Question Paper displayed is for practice
          purposes only. Under no circumstances should this be presumed as a
          sample paper.
        </p>
      </div> */}

      {/* Language Selection */}
      <div className="mt-4">
        <p className="bg-blue-200 p-2 rounded">
          Choose your default language:{"Select Language"}
          <select
            className="p-1 border rounded"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
             <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
          </select>
        </p>
        <p className="mt-2 text-red-500 font-bold">
          Please note all questions will appear in your default language. This
          language can be changed for a particular question later on.
        </p>

        {/* Declaration Checkbox */}
        <label className="flex items-start gap-2 mt-2 mb-7">
          <input
            type="checkbox"
            className="mt-1"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span>
            I have read and understood the instructions. All computer hardware
            allotted to me is in proper working condition. I declare that I am
            not in possession of / not wearing / not carrying any prohibited
            gadget like a mobile phone, Bluetooth devices, etc. / any prohibited
            material with me into the Examination Hall. I agree that in case of
            not adhering to the instructions, I shall be liable to be debarred
            from this Test and/or subject to disciplinary action, which may
            include a ban from future Tests / Examinations.
          </span>
        </label>

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50">  
          <center>       
          <button
            onClick={handlePreviousClick}
            className="p-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Previous
          </button>
          <button
            onClick={handleNextClick}
            className="p-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            I'm Ready to Begin
          </button>
          </center> 
        </div>
      </div>
    </div>
  );
};

export default OtherInstruction;
