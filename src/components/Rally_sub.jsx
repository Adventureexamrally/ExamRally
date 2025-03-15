import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RallySub = () => {
  const data = {
    title: "IBPS RRB Clerk Mock Test Series",
    description:
      "Cracking the IBPS RRB Clerk Exam requires consistent practice and strategic preparation. Our IBPS RRB Clerk Mock Test Series 2025 for Prelims and Mains is designed to match the latest exam pattern, offering full-length tests that simulate real exam conditions. These IBPS RRB Office Assistant Mock Tests 2025 help candidates improve accuracy, speed, and time management while providing valuable insights into their strengths and weaknesses.",
    
    prelims: {
      title: "IBPS RRB Clerk Prelims Mock Test",
      description:
        "The IBPS RRB Office Assistant Prelims Mock Test is an essential resource for candidates preparing for the IBPS RRB Clerk Prelims Exam. The prelims exam consists of 2 sections: quantitative aptitude and reasoning ability. Our mock tests are designed as per the latest exam pattern, providing a real exam-like experience and helping aspirants improve accuracy, speed, and time management."
    },
    
    mains: {
      title: "IBPS RRB Clerk Mains Mock Test",
      description:
        "The IBPS RRB Office Assistant Mains Mock Test is a crucial tool for candidates aiming to clear the IBPS RRB Clerk Mains Exam. The main exam consists of 5 sections: quantitative aptitude, reasoning ability, English/Hindi language, general/financial awareness, and computer knowledge. These mock tests follow the latest exam pattern, providing a real exam-like experience to help aspirants improve their accuracy, speed, and problem-solving skills."
    },
    
    significance: {
      subtitle: "Significance of Practicing IBPS RRB Office Assistant Mock Test",
      description:
        "Practicing the IBPS RRB Office Assistant Mock Test is a smart way to enhance exam preparation. It helps candidates familiarize themselves with the exam pattern, improve speed and accuracy, and identify weak areas. Regular practice boosts confidence, enhances problem-solving skills, and increases the chances of success in the IBPS RRB Clerk Exam."
    },

    advantages: {
      title: "Advantages of IBPS RRB Clerk Mock Test Series",
      points: [
        {
          subtitle: "Updated Syllabus & Exam Format",
          description:
            "Our IBPS RRB Clerk Mock Tests follow the latest exam pattern, ensuring candidates are well-prepared for all sections."
        },
        {
          subtitle: "Anytime, Anywhere Access",
          description:
            "With 24/7 availability, candidates can take the IBPS RRB Clerk Online Mock Tests on mobile or desktop at their convenience."
        },
        {
          subtitle: "Comprehensive Performance Review",
          description:
            "Each mock test includes a detailed analysis, helping candidates evaluate their strengths and weaknesses through reports and insights."
        },
        {
          subtitle: "Authentic Exam Experience",
          description:
            "The IBPS RRB Clerk Mock Test mirrors the actual exam environment, allowing aspirants to get accustomed to the test format and exam pressure."
        }
      ]
    },
    
    faqs: [
      {
        question: "How essential is the mock test series for IBPS RRB exam preparation?",
        answer: "It helps understand the exam pattern, improve speed and accuracy, and boost confidence."
      },
      {
        question: "Where can I get the IBPS RRB Clerk Free Mock Test?",
        answer: "The free mock test is available in Hindi and English."
      },
      {
        question: "Can I attempt the mock test in any order?",
        answer: "Yes, you can attempt the mock tests in any order as per your convenience."
      }
    ]
  };

  // Accordion state to track the open/closed FAQ items
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close the currently open accordion item
    } else {
      setOpenIndex(index); // Open the clicked accordion item
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-primary text-center">{data.title}</h1>
      <p className="text-muted text-center">{data.description}</p>

      <div className="mt-4">
        <h2 className="text-success">{data.prelims.title}</h2>
        <p>{data.prelims.description}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-danger">{data.mains.title}</h2>
        <p>{data.mains.description}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-info">{data.significance.subtitle}</h2>
        <p>{data.significance.description}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-warning">{data.advantages.title}</h2>
        {data.advantages.points.map((point, index) => (
          <div key={index} className="mb-3">
            <h4 className="text-secondary">{point.subtitle}</h4>
            <p>{point.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-dark">Frequently Asked Questions</h2>
        <div className="accordion" id="faqAccordion">
          {data.faqs.map((faq, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openIndex === index ? 'true' : 'false'}
                  aria-controls={`collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RallySub;
