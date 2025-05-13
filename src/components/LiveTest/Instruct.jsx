import markerreview from "../../assets/images/markerReview.png";
import ans from "../../assets/images/ans.png";
import notvisit from "../../assets/images/notvisit.png";
import notans from "../../assets/images/notans.png";
import notandmaeked from "../../assets/images/notansMarked.png";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
// import Api from "../service/Api";
import { useState } from "react";
import Api from "../../service/Api";
import { UserContext } from "../../context/UserProvider";


// window.addEventListener('contextmenu', function (e) {
//   e.preventDefault();
// });

// Prevent F12, Ctrl+R, Ctrl+Shift+R, and Ctrl+Shift+I key presses
window.addEventListener('keydown', function (e) {
  if ((e.key === 'F12') || 
      (e.ctrlKey && e.key === 'r') || 
      (e.ctrlKey && e.shiftKey && e.key === 'R') || 
      (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();  // Prevent F12, Ctrl+R, Ctrl+Shift+R, or Ctrl+Shift+I
  }
});

const images = [
  { img: notvisit, para: "1. You have not visited the question yet." },
  { img: notans, para: "2. You have not answered the question." },
  { img: ans, para: "3. You have answered the  question." },
  {
    img: notandmaeked,
    para: "4. You have NOT answered the question, but have marked the question for review.",
  },
  {
    img: markerreview,
    para: '5. The question(s) "Answered and Marked for Review" will be considered for evaluation.',
  },
];

const Instruct = () => {
  const [examData, setExamData] = useState(null);
  const {id}=useParams()
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch exam data based on the id
    Api.get(`exams/getExam/${id}`)
      .then((res) => {
        if (res.data) {
          setExamData(res.data); // Update state with the fetched data
          console.log("Exam Data:", res.data); // Logs the fetched data
        }
      })
      .catch((err) => console.error("Error fetching data:", err)); // Logs any errors
  }, [id]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center bg-blue-400  p-2 rounded-md">
        <h1 className="text-lg font-semibold text-white">Instruction</h1>
        
   
      </div>
      <p className="text-red-500 fw-bold p-2">The Public Examinations (Prevention of Unfair Means) Act 2024 is in force. The provisions of the Act will be applicable to persons involved in use of unfair means. Accordingly, Candidates will be covered under the extent administrative provisions of the concerned Public Examination Authority. Candidates are advised to not take/give or attempt to take/give any unfair assistance or use or attempt to use any unfair means during the examinations.
      </p>
<div className="p-2">
  <h1> Section : <strong> {examData?.exam_name}</strong> </h1>
</div>





<table className="table table-bordered table-striped table-responsive mt-2">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Section Exam Name</th>
      <th>No. of Questions</th>
      <th>Mark</th>
      <th>Section Time (Minutes)</th>
    </tr>
  </thead>
  <tbody>
    {examData?.section?.map((section, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{section.name}</td>
        <td>{section.t_question}</td>
        <td>{section.t_mark}</td>
        <td>{section.t_time} Min </td>
      </tr>
    ))}
  </tbody>
</table>




      <div className="mt-4">
        <p className="font-semibold">General Instructions:</p>
        <ul className="list-decimal list-inside space-y-2 mt-2">
      {
  examData?.time?.toLowerCase() === "composite" ? (
    <li>
      Total duration of examination is <strong>{examData?.duration}</strong> Min.
    </li>
  ) : (
 <>
 </>
  )
}


          <li>
            The clock will be set at the server. The countdown timer in the top
            right corner of the screen will display the remaining time available
            for you to complete the examination. When the timer reaches zero,
            the examination will end by itself. You will not be required to end
            or submit your examination.
          </li>
          <li>
            The Question Palette displayed on the right side of the screen will
            show the status of each question using different symbols:
          </li>
          {/* Displaying Images with Descriptions */}
          <div className="mt-4">
            {images.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <img
                  src={item.img}
                  alt={`status-icon-${index}`}
                  className="w-8 h-8"
                />
                <p>{item.para}</p>
              </div>
            ))}
          </div>
          The Marked for Review status for a question simply indicates that you
          would like to look at that question again. If a question is answered
          and Marked for Review, your answer for that question will be
          considered in the evaluation.
          <li>
            You can click on the "▶" arrow which appears to the left of the
            question palette to collapse the question palette, thereby
            maximizing the question window. To view the question palette again,
            you can click on "◀" which appears on the right side of the question
            window.
          </li>
          <li>
            You can click on your "Profile" image in the top right corner of
            your screen to change the language during the exam for the entire
            question paper. On clicking the Profile image, you will get a
            drop-down to change the question content to the desired language.
          </li>
          <li>
            You can click on Scroll Down⬇ to navigate to the bottom and Scroll
            Up⬆ to navigate to the top of the question area, without scrolling.
          </li>
          <h1 className="h6 font fw-bold">Navigating to a Question</h1>
          <li>To answer a question, do the following</li>
          <div className="ml-4">
            <ol>
              <li>
                <span className="fw-bold font">a.</span> Click on the question
                number in the Question Palette at the right of your screen to go
                to that numbered question directly. Note that using this option
                does NOT save your answer to the current question
              </li>
              <li>
                <span className="fw-bold font">b.</span> Click on
                <span className="font fw-bold">Save &Next</span> to save your
                answer for the current question and then go to the next
                question.
              </li>
              <li>
                <span className="fw-bold font">c.</span> Click on
                <span className="font fw-bold"> Mark for Review & Next</span> to
                save your answer for the current question, mark it for review,
                and then go to the next question.
              </li>
            </ol>
          </div>
          <h1 className="h6  font fw-bold"> Answering a Question :</h1>
          <li>Procedure for answering a multiple choice type question</li>
          <div className="ml-4">
            <ul>
              <li>
                <span className="fw-bold font">a.</span> To select your answer,
                click on the button of one of the options
              </li>
              <li>
                <span className="fw-bold font">b.</span> To deselect your chosen
                answer, click on the button of the chosen option again or click
                on the <span className="fw-bold font">Clear Response</span>
                button
              </li>
              <li>
                <span className="fw-bold font">c.</span> To change your chosen
                answer, click on the button of another option
              </li>
              <li>
                <span className="fw-bold font">d.</span> To save your answer,
                you MUST click on the
                <span className="fw-bold font">Save & Next</span> button
              </li>
              <li>
                <span className="fw-bold font">e.</span> To mark the question
                for review, click on the
                <span className="fw-bold font">Mark for Review & Next</span>
                button. If an answer is selected for a question that is Marked
                for Review, that answer will be considered in the evaluation.
              </li>
            </ul>
          </div>
          <li>
            To change your answer to a question that has already been answered,
            first select that question for answering and then follow the
            procedure for answering that type of question.
          </li>
          <li>
            Note that ONLY Questions for which answers are saved or marked for
            review after answering will be considered for
            <span className="font fw-bold">evaluation.</span>
          </li>
          <h1 className="font fw-bold">Navigating through sections:</h1>
          <li>
            Sections in this question paper are displayed on the top bar of the
            screen. Questions in a section can be viewed by clicking on the
            section name. The section you are currently viewing is highlighted.
          </li>
          <li>
            After clicking the Save & Next button on the last question for a
            section, you will automatically be taken to the first question of
            the next section.
          </li>
          <li>
            You can shuffle between tests and questions anytime during the
            examination as per your convenience only during the time stipulated
          </li>
          <li>
            Candidate can view the corresponding section summary as part of the
            legend that appears in every section above the question palette.
          </li>
        </ul>
        <div className="fixed bottom-1 right-4">
        <Link to={`/otherins/${id}/${user?._id}`}>
  <button className="bg-blue-500 p-2 text-white hover:bg-blue-600 rounded-md">
    Next
  </button>
</Link>
        </div>
      </div>
    </div>
  );
};

export default Instruct;
