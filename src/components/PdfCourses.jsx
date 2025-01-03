function PdfCourses() {
    const pdfCourses = [
      { id: 1, name: "Quantitative Aptitude Course", link: "#" },
      { id: 2, name: "Reasoning Ability Course", link: "#" },
      { id: 3, name: "English Language Course", link: "#" },
    ];
  
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">PDF Courses</h1>
        <ul className="space-y-4">
          {pdfCourses.map((course) => (
            <li key={course.id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <a
                href={course.link}
                className="text-blue-500 font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {course.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  export default PdfCourses;
  