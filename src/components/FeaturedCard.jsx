function FeatureCard({ title, description }) {
    return (
      <div className="bg-white p-6 shadow-md rounded-lg text-center border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-500">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    );
  }
  export default FeatureCard;
  