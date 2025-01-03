function TrendingLinks() {
    const sections = [
      { name: "PDF Course", icon: "📄" },
      { name: "Mock Tests", icon: "📋" },
      { name: "GOAT", icon: "🐐" },
      { name: "Descriptive", icon: "✍️" },
    ];
  
    return (
      <section className="my-8 container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Trending Links:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 text-center"
            >
              <span className="text-3xl">{item.icon}</span>
              <p className="mt-2 font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default TrendingLinks;
  