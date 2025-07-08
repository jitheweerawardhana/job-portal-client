import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  // Create array of page numbers to display
  const getPageNumbers = () => {
    // If 7 or fewer pages, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Show first, last, and pages around current
    if (currentPage <= 3) {
      // Near start - show 1,2,3,4,5,...,last
      return [1, 2, 3, 4, 5, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      // Near end - show 1,...,last-4,last-3,last-2,last-1,last
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      // Middle - show 1,...,current-1,current,current+1,...,last
      return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="inline-flex -space-x-px" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md ${
          currentPage === 1
            ? "text-gray-300 bg-white cursor-not-allowed"
            : "text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
        } border border-gray-300`}
        aria-label="Previous page"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((number, idx) =>
        number === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
          >
            ...
          </span>
        ) : (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
              currentPage === number
                ? "z-10 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-100"
            } border`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md ${
          currentPage === totalPages
            ? "text-gray-300 bg-white cursor-not-allowed"
            : "text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
        } border border-gray-300`}
        aria-label="Next page"
      >
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
