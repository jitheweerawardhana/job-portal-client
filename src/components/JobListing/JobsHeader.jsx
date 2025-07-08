import React from "react";

const JobsHeader = ({ total, start, end }) => {
  return (
    <div className="flex mb-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <p className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {start}-{end}
        </span>{" "}
        of <span className="font-medium text-gray-900">{total}</span> jobs
      </p>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <label className="text-sm text-gray-600 mr-2 whitespace-nowrap">
            Sort by:
          </label>
          <div className="relative inline-block">
            <select className="appearance-none bg-white border border-gray-300 rounded-md text-sm pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Relevance</option>
              <option>Newest</option>
              <option>Salary (high to low)</option>
              <option>Salary (low to high)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label className="text-sm text-gray-600 mr-2 whitespace-nowrap">
            View:
          </label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button className="p-1.5 bg-blue-50 text-blue-600 border-r border-gray-300">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <button className="p-1.5 bg-white text-gray-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsHeader;
