import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/2.png";

const CourseNavbar = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const navigateToJobs = () => {
    navigate("/jobs");
  };

  const navigateToCourses = () => {
    navigate("/courses");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 mx-auto">
        {/* Professional Logo on left */}
        <img src={Logo} width={100} alt="HireLink Logo" />
        {/* Navigation Links in center */}
        <div className="flex-1 flex justify-center">
          <nav className="flex space-x-8">
            <button
              onClick={navigateToJobs}
              className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Jobs
            </button>
            <button
              onClick={navigateToCourses}
              className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Courses Explore
            </button>
          </nav>
        </div>
        {/* Right side - empty now that login is removed */}
        <div className="w-24"></div>{" "}
        {/* Empty div to maintain spacing balance */}
      </div>
    </header>
  );
};

export default CourseNavbar;
