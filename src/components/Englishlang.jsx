import engimg from '../assets/images/eng.png';
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Englishlang = () => {
  // Define the testTypes array correctly within the component
  const testTypes = [
    { name: "Reading Comprehension", icon: "bi-book" },
    { name: "Cloze Test", icon: "bi-file-earmark-text" },
    { name: "Single Filler", icon: "bi-pencil" },
    { name: "Double Filler", icon: "bi-arrow-right-circle" },
    { name: "Para Jumble", icon: "bi-gear" },
    { name: "Error Spotting", icon: "bi-pencil-square" },
    { name: "Match the Column", icon: "bi-file-lock" },
    { name: "Misspelt word", icon: "bi-spellcheck" },
    { name: "Word Usage", icon: "bi-map" },
    { name: "Starters", icon: "bi-tag" },
    { name: "Word Replacement", icon: "bi-check-circle" },
    { name: "Phrase replacement", icon: "bi-search" }
  ];

  return (
    <div className="container py-5">
    <h1 className="p-2 text-green-500 text-center fw-bold">
        {" "}
        <MenuBookIcon fontSize="large" className="text-green-500" />{" "}
       English Language
      </h1>

      <h2 className="mt-1">
        The <span className="text-green font-weight-bold"> English Language section </span>in <span className="text-green font-weight-bold"> IBPS, SBI, RBI, and other bank exams</span>
        tests your <span className="text-green font-weight-bold">comprehension skills, grammar accuracy, and vocabulary
        strength</span>. To help you master this section, <span className="text-green font-weight-bold">Examrally</span> presents <span className="text-green font-weight-bold">Topic-Wise
        Mock Tests</span>, designed as per the <span className="text-green font-weight-bold">latest exam trends</span>. These tests cover
        all question types,<span className="text-green font-weight-bold"> from Reading Comprehension to Error Spotting, Cloze
        Tests, Para Jumbles, Sentence Improvement, and Vocabulary-Based
        Questions, ensuring complete exam-level practice</span>.
      </h2>

      <div className="row mt-4">
        {/* Left Side: Image */}
        <div className="col-md-6 justify-content-center d-flex align-items-center" >
          <img src={engimg} alt="English Language" style={{height:'300px'}} className="img-fluid rounded shadow"  />
        </div>

        {/* Right Side: Content */}
        <div className="col-md-6">
          <h3>
          <span className="text-green font-weight-bold">  With structured topic-wise and sub-topic-wise tests, you get to practice
         </span>   questions across <span className="text-green font-weight-bold">different difficulty levels</span>—Easy, Moderate, and
            Difficult—helping you <span className="text-green font-weight-bold">gradually improve accuracy and time management</span>.<br />
            Each test follows a <span className="text-green font-weight-bold">real exam-like interface</span>, giving you hands-on
            experience before the actual exam.
          </h3>

          <h4 className="mt-3">
          <span className="text-green font-weight-bold">Step-by-step solutions </span>provide detailed explanations, ensuring you learn
            the <span className="text-green font-weight-bold">right strategies and grammar rules</span> to tackle even the trickiest
            questions.
          </h4>
          <p className="mt-4">
            A key highlight of <span className="text-green font-weight-bold">Examrally’s English Language Mock Tests</span> is the
            <span className="text-green font-weight-bold">   detailed performance tracking </span>
            after each test. This helps you <span className="text-green font-weight-bold">analyze
            weak areas, identify frequent mistakes, and refine your approach</span> to
            improve your score. Whether you struggle with <span className="text-green font-weight-bold">RC speed, tricky sentence
            formations, or vocabulary-based questions</span>, our topic-wise tests ensure
            you <span className="text-green font-weight-bold">gain confidence and command over every concept</span> before facing the
            actual exam.
          </p>
        </div>
      </div>

      <div className="mt-2">
        <div className="row">
          {testTypes.map((test, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className={`bi ${test.icon} display-4`} style={{ fontSize: '40px' }}></i>
                  </div>
                  <h5 className="card-title text-green-500 font fw-bold">{test.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Englishlang;
