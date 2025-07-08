import React from "react";
import Button from "../Button/Button.jsx";

const JobCard = ({ job, onApplyNow }) => {
  // Default job data in case no job prop is passed
  const defaultJob = {
    id: 1,
    title: "Frontend Developer",
    companyName: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: 90000,
    jobType: "Full-time",
    description:
      "We're looking for a talented Frontend Developer to join our growing team.",
    postedDate: "2025-02-15T00:00:00",
    requirements: "React, JavaScript, CSS",
  };

  // Use provided job data or default if not provided
  const jobData = job || defaultJob;

  // Convert requirements to tags
  const getTags = () => {
    if (!jobData.requirements) return [];
    return jobData.requirements.split(",").map((tag) => tag.trim());
  };

  // Calculate days since posting
  const getDaysSincePosted = (dateString) => {
    if (!dateString) return 0;

    try {
      const posted = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today - posted);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error("Error calculating days since posted:", error);
      return 0;
    }
  };

  // Format salary
  const formatSalary = (salary) => {
    if (salary === undefined || salary === null) return "Salary not specified";

    try {
      return salary.toLocaleString("en-US", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 0,
      });
    } catch (error) {
      return `${salary}`;
    }
  };

  const tags = getTags();

  const handleApplyNow = () => {
    if (onApplyNow) {
      onApplyNow();
    }
  };

  return (
    <div className="bg-white shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg h-full flex flex-col">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {jobData.title || "Job Title"}
            </h3>
            <p className="text-gray-600 font-medium mt-1">
              {jobData.companyName || "Company"}
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
            {jobData.jobType || "Job Type"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow">
        {/* Job Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
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
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span>{jobData.location || "Location not specified"}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{formatSalary(jobData.salary)}</span>
          </div>
        </div>

        {/* Job Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {jobData.description || "No description available"}
        </p>

        {/* Tags (from requirements) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
              No requirements
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
        <span className="text-gray-500 text-sm">
          {jobData.postedDate
            ? `Posted ${getDaysSincePosted(jobData.postedDate)} days ago`
            : "Recently posted"}
        </span>
        <Button variant="primary" onClick={handleApplyNow}>
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
