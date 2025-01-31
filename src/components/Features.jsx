import exam from '../assets/images/Exams-bro.svg'
import { AcademicCapIcon } from '@heroicons/react/24/solid';

const features = [
    {
        Src: AcademicCapIcon,
        title: "Real Exam Interface with Smart Questioning",
        description: "Experience the real exam environment with our cutting-edge interface. Our tests include a balanced mix of Easy, Moderate, and Hard level questions, ensuring you develop the confidence and skills needed to excel in actual bank exams."
    },
    {
        Src: AcademicCapIcon,
        title: "Topic-Wise Mastery",
        description: "Sharpen your expertise with dedicated Topic Tests for Quantitative Aptitude, Reasoning, English, Computer Awareness, Banking Awareness, Static GK, and Insurance Awareness. Each test is designed to enhance conceptual clarity and depth, preparing you to tackle any question with ease."
    },
    {
        Src: AcademicCapIcon,
        title: "Prelims & Mains Mock Tests",
        description: "Go beyond basic practice with Prelims and Mains Mock Tests that are carefully structured to match and slightly exceed the real exam difficulty. With our well-researched and exam-focused questions, you’ll be one step ahead in the competition."
    },
    {
        Src: AcademicCapIcon,
        title: "High-Level & New Pattern Questions",
        description: "Stay updated with the latest exam trends—our high-level questions mirror the most recent bank exams (2018–2025), including SBI Clerk 2025. We cover all major question models asked so far, ensuring you’re prepared for both expected and surprise patterns."
    },
    {
        Src: AcademicCapIcon,
        title: "Budget-Friendly for Every Aspirant",
        description: "Quality preparation shouldn’t be expensive. At Examrally, we offer top-notch mock tests at a reasonable price, ensuring that every student gets access to the best resources without overspending."
    },
    {
        Src: AcademicCapIcon,
        title: "All India Performance Ranking",
        description: "Know where you stand among thousands of aspirants across India. Our detailed ranking system helps you assess your strengths, identify areas for improvement, and stay ahead in the competition."
    }
];

export default function Features() {
    return (
        <div className="p-6 mx-auto bg-gray-50 shadow-lg rounded-lg border text-wrap text-center border-gray-300">
            <h2 className="text-3xl font-bold text-center text-blue-600">Why Choose Examrally?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {features.map((feature, index) => (
                    <Feature key={index} title={feature.title} description={feature.description} src={feature.src} />
                ))}
            </div>

            <div className="text-center mt-6">
                <p className="text-lg font-semibold text-gray-700">🚀 Practice Smarter. Score Higher. Succeed Faster. 🚀</p>
            </div>
        </div>
    );
}

function Feature({ title, description, Src }) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
            {/* <img src={src} alt="" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" /> */}
            {/* <Src className="w-16 h-16 text-blue-500" /> */}
            <h3 className="text-xl font-semibold text-blue-500 mt-4">{title}</h3>
            <p className="text-gray-700 mt-2">{description}</p>
        </div>
    );
}
