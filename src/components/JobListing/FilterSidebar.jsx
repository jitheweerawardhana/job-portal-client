import React from "react";

const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  employmentType,
  setEmploymentType,
  salaryRange,
  setSalaryRange,
  datePosted,
  setDatePosted,
  experienceLevel,
  handleExperienceLevelChange,
  resetFilters,
}) => {
  const handleApplyFilters = (e) => {
    e.preventDefault();

    console.log("Applying filters");
  };

  return (
    <div className="bg-white border-gray-50 border-1 p-5 h-full top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
        >
          Reset all
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-5"></div>

      {/* Filter Form */}
      <form onSubmit={handleApplyFilters} className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Keywords
            </label>
          </div>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Job title, skills, or company"
              className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
          </div>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="City, state, or remote"
              className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4"></div>

        {/* Employment Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Job Type</label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Salary Range
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            >
              <option value="">All Salaries</option>
              <option value="below100k">Below $100K</option>
              <option value="100kTo130k">$100K - $130K</option>
              <option value="above130k">Above $130K</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date Posted
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
            >
              <option value="">Any time</option>
              <option value="today">Today</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="entry"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={experienceLevel.entry}
                onChange={() => handleExperienceLevelChange("entry")}
              />
              <label htmlFor="entry" className="ml-2 text-sm text-gray-700">
                Entry Level
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mid"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={experienceLevel.mid}
                onChange={() => handleExperienceLevelChange("mid")}
              />
              <label htmlFor="mid" className="ml-2 text-sm text-gray-700">
                Mid Level
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="senior"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={experienceLevel.senior}
                onChange={() => handleExperienceLevelChange("senior")}
              />
              <label htmlFor="senior" className="ml-2 text-sm text-gray-700">
                Senior Level
              </label>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4"></div>

        {/* Apply Filters Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default FilterSidebar;
