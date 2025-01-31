import MockTest from "../components/MockTest";

function MockTestPage() {
  const tests = [
    { id: 1, title: "Quantitative Aptitude Test", duration: "30 minutes", questions: 25 },
    { id: 2, title: "Reasoning Ability Test", duration: "45 minutes", questions: 40 },
    { id: 3, title: "English Language Test", duration: "20 minutes", questions: 20 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Mock Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <MockTest key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}
export default MockTestPage;