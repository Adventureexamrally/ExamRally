function MockTest({ test }) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center">
        <h2 className="text-2xl font-semibold text-blue-500">{test.title}</h2>
        <p className="mt-2 text-gray-600">Duration: {test.duration}</p>
        <p className="mt-1 text-gray-600">Questions: {test.questions}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Start Test
        </button>
      </div>
    );
  }
  export default MockTest;