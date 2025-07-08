import React, { useRef } from "react";

const CourseHero = ({ setSearchFilter, setIsSearched }) => {
  const courseNameRef = useRef(null);
  const categoryRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      courseName: courseNameRef.current.value,
      category: categoryRef.current.value,
    });
    setIsSearched(true);
  };

  return (
    <>
      {/* Hero Section with Black Background */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-900 text-white border-b border-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Discover <span className="text-blue-400">Courses</span> That
                Transform Your Skills
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Explore our wide range of courses designed to help you master
                new skills and advance your knowledge in your field of interest.
              </p>
            </div>

            {/* Search Box */}
            <div className="w-full max-w-3xl mt-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    ref={courseNameRef}
                    type="text"
                    placeholder="Search courses..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <select
                    ref={categoryRef}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="data-science">Data Science</option>
                  </select>
                </div>
                <button
                  onClick={onSearch}
                  className="px-8 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseHero;
