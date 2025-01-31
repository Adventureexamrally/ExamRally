import exam from '../assets/images/Exams-bro.svg'
import { AcademicCapIcon, ClipboardDocumentCheckIcon, PuzzlePieceIcon, DocumentDuplicateIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const features = [
    {
        Src: AcademicCapIcon,
        title: "Real Exam Interface with Smart Questioning",
        description: "Experience the real exam environment with our cutting-edge interface. Our tests include a balanced mix of Easy, Moderate, and Hard level questions, ensuring you develop the confidence and skills needed to excel in actual bank exams."
    },
    {
        Src: PuzzlePieceIcon,
        title: "Topic-Wise Mastery",
        description: "Sharpen your expertise with dedicated Topic Tests for Quantitative Aptitude, Reasoning, English, Computer Awareness, Banking Awareness, Static GK, and Insurance Awareness. Each test is designed to enhance conceptual clarity and depth, preparing you to tackle any question with ease."
    },
    {
        Src: ClipboardDocumentCheckIcon,
        title: "Prelims & Mains Mock Tests",
        description: "Go beyond basic practice with Prelims and Mains Mock Tests that are carefully structured to match and slightly exceed the real exam difficulty. With our well-researched and exam-focused questions, you’ll be one step ahead in the competition."
    },
    {
        Src: DocumentDuplicateIcon,
        title: "High-Level & New Pattern Questions",
        description: "Stay updated with the latest exam trends—our high-level questions mirror the most recent bank exams (2018–2025), including SBI Clerk 2025. We cover all major question models asked so far, ensuring you’re prepared for both expected and surprise patterns."
    },
    {
        Src: CurrencyDollarIcon,
        title: "Budget-Friendly for Every Aspirant",
        description: "Quality preparation shouldn’t be expensive. At Examrally, we offer top-notch mock tests at a reasonable price, ensuring that every student gets access to the best resources without overspending."
    },
    {
        Src: ChartBarIcon,
        title: "All India Performance Ranking",
        description: "Know where you stand among thousands of aspirants across India. Our detailed ranking system helps you assess your strengths, identify areas for improvement, and stay ahead in the competition."
    }
];

export default function Features() {
    return (
        <div className="p-6 mx-auto bg-gray-50 shadow-lg rounded-lg border text-wrap text-center border-gray-300 bg-gradient-to-tr from-green-100 to-white">
            <h2 className="text-3xl font-bold text-center text-blue-600">Why Choose Examrally?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {features.map((feature, index) => (
                    <Feature key={index} title={feature.title} description={feature.description} Src={feature.Src} />
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
        <div className="p-4 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center text-center bg-gradient-to-br from-green-200 to-blue-200 hover:scale-105 hover:shadow-lg transition-transform duration-300">
           {Src && (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="url(#iconGradient)">
                    <Src />
                    <defs>
                        <linearGradient id="iconGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#22c55e" /> {/* Green-500 */}
                            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
                        </linearGradient>
                    </defs>
                </svg>
            )}
            <h3 className="text-xl font-semibold text-gray-600 mt-4">{title}</h3>
            <p className="text-black mt-2">{description}</p>
        </div>
    );
}

