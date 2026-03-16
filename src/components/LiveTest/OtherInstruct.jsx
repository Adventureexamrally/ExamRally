import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../service/Api";
import { UserContext } from "../../context/UserProvider";
import { FaSpinner } from "react-icons/fa6";

const OtherInstruct = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Default language
    const [examData, setExamData] = useState(null);
    const {id} = useParams()
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true); // Set loading when starting
    Api.get(`exams/getExam/${id}`)
      .then((res) => {
        if (res.data) {
          setExamData(res.data);
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setIsLoading(false)); // Always stop loading
  }, [id]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
const handleNextClick = () => {
  if (!selectedLanguage) {
    alert("Please select a language to proceed.");
    return;
  }
  if (!isChecked) {
    alert("Please accept the declaration to proceed.");
    return;
  }
    // Transform selectedLanguage if bilingual
    const finalLanguage = examData?.bilingual_status && 
    (selectedLanguage === "Hindi" || selectedLanguage === "English")
    ? "English"
    : selectedLanguage;

  navigate(`/mocklivetest/${id}/${user?._id}`, { state: { language: finalLanguage } });
};

  const handlePreviousClick = () => {
    navigate(`/instruct/${id}/${user?._id}`);
  };

  // Show loading spinner while data is loading
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
           <FaSpinner className="animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* Instruction Header */}
      <div className="bg-blue-300 p-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Other Important Instructions</h2>
      </div>


      {/* Language Selection */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 p-4">
  <p className="bg-blue-200 p-2 rounded mb-2">
    Choose your default language: 
    <select
      className="ml-2 p-1 border rounded"
      value={selectedLanguage}
      onChange={handleLanguageChange}
    >
      <option value="">Select Language</option>
      {examData?.bilingual_status ? (
    <>
      {examData?.english_status && <option value="English">English</option>}
      {examData?.hindi_status && <option value="Hindi">Hindi</option>}
    </>
  ) : (
    <>
      {examData?.english_status && <option value="English">English</option>}
      {examData?.hindi_status && <option value="Hindi">Hindi</option>}
      {examData?.tamil_status && <option value="Tamil">Tamil</option>}
    </>
  )}
    </select>
  </p>

  <p className="mt-2 text-red-500 font-bold">
    Please note all questions will appear in your default language. This language can be changed for a particular question later on.
  </p>

  {/* Declaration Checkbox */}
  <label className="flex items-start gap-2 mt-2 mb-4">
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
  <div className="text-center">
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
  </div>
</div>
    </div>
  );
};

export default OtherInstruct;
