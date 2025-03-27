import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OtherInstruction = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default language
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
const {id} = useParams()
  const handleNextClick = () => {
    if (isChecked) {
      navigate(`/mocktest/${id}`, { state: { language: selectedLanguage } }); // Pass language as state
    } else {
      alert("Please accept the declaration to proceed.");
    }
  };

  const handlePreviousClick = () => {
    navigate("/instruction");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">New Test Create That</h1>

      {/* Instruction Header */}
      <div className="bg-blue-300 p-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Other Important Instructions</h2>
        <label>
          <select
            className="p-2 border rounded"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
          </select>
        </label>
      </div>

      {/* Instruction Content */}
      <div className="border-4 border-green-400 p-4 mt-4">
        <p>
          This is a Mock test. The Question Paper displayed is for practice
          purposes only. Under no circumstances should this be presumed as a
          sample paper.
        </p>
      </div>

      {/* Language Selection */}
      <div className="mt-4">
        <p className="bg-blue-200 p-2 rounded">
          Choose your default language:{" "}
          <select
            className="p-1 border rounded"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
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
        <label className="flex items-start gap-2 mt-2">
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
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousClick}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Previous
          </button>
          <button
            onClick={handleNextClick}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherInstruction;
