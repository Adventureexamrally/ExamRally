import PdfCourses from "../components/PdfCourses";

function BankExam() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Bank Exam Preparation</h1>
      <p className="text-gray-600 text-center mb-8">
        Prepare for your upcoming bank exams with our tailored PDF courses and mock tests.
      </p>
      <PdfCourses />
    </div>
  );
}
export default BankExam;
