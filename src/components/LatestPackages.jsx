function LatestPackages() {
    const packages = [
      { title: "PDF Course Subscription", description: "All PDF courses for 2024" },
      { title: "Smart Quiz", description: "800 Weekly Questions" },
      { title: "Platinum Mock Tests", description: "Real Bank Exam Practice" },
    ];
  
    return (
      <section className="container mx-auto px-4 my-8">
        <h2 className="text-2xl font-bold mb-4">Latest Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
              <p className="text-gray-600">{pkg.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default LatestPackages;
  