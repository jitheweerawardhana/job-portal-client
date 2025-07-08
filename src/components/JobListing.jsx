import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import FilterSidebar from "./JobListing/FilterSidebar";
import JobGrid from "./JobListing/JobGrid";
import JobsHeader from "./JobListing/JobsHeader";
import NoJobsFound from "./JobListing/NoJobsFound";
import Pagination from "./JobListing/Pagination";

const JobListing = () => {
  const { jobs: contextJobs } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");

  const [datePosted, setDatePosted] = useState("");
  const [experienceLevel, setExperienceLevel] = useState({
    entry: false,
    mid: false,
    senior: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (contextJobs && contextJobs.length > 0) {
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      setError("No jobs available. Please try again later.");
    }
  }, [contextJobs]);

  useEffect(() => {
    if (loading) return;

    console.log("Filtering jobs with:", {
      searchTerm,
      locationFilter,
      employmentType,
      salaryRange,
      datePosted,
      experienceLevel,
    });

    let result = contextJobs || [];

    if (searchTerm) {
      result = result.filter((job) => {
        const title = job.title || "";
        const company = job.companyName || "";
        const description = job.description || "";
        const tags = job.tags || [];
        const normalizedSearch = searchTerm.toLowerCase();

        return (
          title.toLowerCase().includes(normalizedSearch) ||
          company.toLowerCase().includes(normalizedSearch) ||
          description.toLowerCase().includes(normalizedSearch) ||
          tags.some(
            (tag) =>
              typeof tag === "string" &&
              tag.toLowerCase().includes(normalizedSearch)
          )
        );
      });
    }

    if (locationFilter) {
      result = result.filter((job) => {
        const location = job.location || "";
        return location.toLowerCase().includes(locationFilter.toLowerCase());
      });
    }

    if (employmentType) {
      result = result.filter((job) => {
        const jobType = job.jobType || "";
        return jobType.toLowerCase() === employmentType.toLowerCase();
      });
    }

    if (salaryRange) {
      result = result.filter(({ salary = 0 }) => {
        const salaryNum =
          typeof salary === "number"
            ? salary
            : parseInt(salary.toString().replace(/\D/g, ""), 10) || 0;
        return (
          (salaryRange === "below100k" && salaryNum < 100000) ||
          (salaryRange === "100kTo130k" &&
            salaryNum >= 100000 &&
            salaryNum <= 130000) ||
          (salaryRange === "above130k" && salaryNum > 130000)
        );
      });
    }

    if (datePosted) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter((job) => {
        const postDate = job.postedDate ? new Date(job.postedDate) : null;
        if (!postDate) return true;

        const daysDifference = Math.floor(
          (today - postDate) / (1000 * 60 * 60 * 24)
        );

        switch (datePosted) {
          case "today":
            return daysDifference === 0;
          case "week":
            return daysDifference <= 7;
          case "month":
            return daysDifference <= 30;
          default:
            return true;
        }
      });
    }

    if (
      experienceLevel.entry ||
      experienceLevel.mid ||
      experienceLevel.senior
    ) {
      result = result.filter((job) => {
        const level = (job.experienceLevel || "").toLowerCase();

        return (
          (experienceLevel.entry && level.includes("entry")) ||
          (experienceLevel.mid && level.includes("mid")) ||
          (experienceLevel.senior && level.includes("senior"))
        );
      });
    }

    if (sortBy !== "relevance") {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
          case "salaryHighToLow": {
            const salaryA =
              typeof a.salary === "number"
                ? a.salary
                : parseInt((a.salary || "").replace(/[^0-9]/g, ""), 10) || 0;
            const salaryB =
              typeof b.salary === "number"
                ? b.salary
                : parseInt((b.salary || "").replace(/[^0-9]/g, ""), 10) || 0;
            return salaryB - salaryA;
          }
          case "salaryLowToHigh": {
            const salaryA =
              typeof a.salary === "number"
                ? a.salary
                : parseInt((a.salary || "").replace(/[^0-9]/g, ""), 10) || 0;
            const salaryB =
              typeof b.salary === "number"
                ? b.salary
                : parseInt((b.salary || "").replace(/[^0-9]/g, ""), 10) || 0;
            return salaryA - salaryB;
          }
          default:
            return 0;
        }
      });
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [
    contextJobs,
    searchTerm,
    locationFilter,
    employmentType,
    salaryRange,
    datePosted,
    experienceLevel.entry,
    experienceLevel.mid,
    experienceLevel.senior,
    sortBy,
    loading,
  ]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleExperienceLevelChange = (level) => {
    setExperienceLevel((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setEmploymentType("");
    setSalaryRange("");
    setDatePosted("");
    setExperienceLevel({
      entry: false,
      mid: false,
      senior: false,
    });
    setSortBy("relevance");
  };

  const handleSearch = () => {
    console.log("Search button clicked with term:", searchTerm);
  };

  const handleApplyNow = (job) => {
    navigate(`/job-details/${job.id}`, {
      state: {
        job,
        relatedJobs: contextJobs.filter(
          (item) => item.companyName === job.companyName && item.id !== job.id
        ),
      },
    });
  };

  const filterProps = {
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
  };

  const headerProps = {
    total: filteredJobs.length,
    start: indexOfFirstJob + 1,
    end: Math.min(indexOfLastJob, filteredJobs.length),
    sortBy,
    setSortBy,
  };

  const paginationProps = {
    currentPage,
    totalPages,
    paginate,
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-4 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Find Your Dream Job
              </h2>
              <p className="text-gray-600">
                Browse our latest job opportunities
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-3xl">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="block w-full pl-10 pr-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="block w-full pl-10 pr-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <button
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            {totalPages > 1 && (
              <div className="mb-8 flex justify-center">
                <Pagination {...paginationProps} />
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <FilterSidebar {...filterProps} />
              </div>

              <div className="lg:w-3/4">
                {filteredJobs.length === 0 ? (
                  <NoJobsFound resetFilters={resetFilters} />
                ) : (
                  <>
                    <JobsHeader {...headerProps} />
                    <JobGrid jobs={currentJobs} onApplyNow={handleApplyNow} />
                  </>
                )}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination {...paginationProps} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default JobListing;
