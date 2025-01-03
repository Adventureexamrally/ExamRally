import FeatureCard from "../components/FeaturedCard";
import HeroSection from "../components/HeroSection";

function Home() {
  return (
    <div className="text-center p-4">
      <HeroSection />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <FeatureCard
          title="Bank Exam Preparation"
          description="Access high-quality mock tests and PDFs to prepare for your bank exams."
        />
        <FeatureCard
          title="Mock Tests"
          description="Challenge yourself with our timed and topic-wise mock tests."
        />
        <FeatureCard
          title="PDF Courses"
          description="Download and study from our expert-curated PDF courses for exams."
        />
      </div>
    </div>
  );
}
export default Home;

// import React from "react";
// import Header from "../components/Header";
// import TrendingLinks from "../components/TrendingLinks";
// import UpcomingExams from "../components/UpcomingExams";
// import Banner from "../components/Banner";
// import LatestPackages from "../components/LatestPackages";

// function Home() {
//   return (
//     <div>
//       <Header />
//       <TrendingLinks />
//       <UpcomingExams />
//       <Banner />
//       <LatestPackages />
//     </div>
//   );
// }

// export default Home;
