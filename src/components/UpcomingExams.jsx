function UpcomingExams() {
    const exams = [
      { id: 1, name: "SBI JA" },
      { id: 2, name: "SBI PO" },
      { id: 3, name: "IBPS Clerk" },
      { id: 4, name: "IBPS PO" },
    ];
  
    return (
      <section className="container mx-auto px-4 my-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Exams</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-blue-500 text-white p-6 rounded-lg text-center font-semibold shadow"
            >
              {exam.name}
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default UpcomingExams;
  