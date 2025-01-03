import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="flex justify-between">
        <h1 className="text-2xl font-bold">Examrally</h1>
        <ul className="flex gap-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/bankexam">Bank Exam</Link></li>
          <li><Link to="/mocktest">Mock Test</Link></li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;

import React from "react";

// function Header() {
//   return (
//     <header className="bg-purple-600 text-white py-4 shadow-md">
//       <div className="container mx-auto flex justify-between items-center px-4">
//         <h1 className="text-2xl font-bold">guidely</h1>
//         <nav className="hidden md:flex space-x-6">
//           <a href="#exams" className="hover:underline">Exams</a>
//           <a href="#pdf-courses" className="hover:underline">PDF Courses</a>
//           <a href="#mock-tests" className="hover:underline">Mock Tests</a>
//           <a href="#plans" className="hover:underline">Plans</a>
//           <a href="#latest-packages" className="hover:underline">Packages</a>
//         </nav>
//         <button className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-200">
//           Get App
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Header;
