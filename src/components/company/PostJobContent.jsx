import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const PostJobContent = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    requirements: "",
    responsibilities: "",
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setJobData({
      ...jobData,
      expiryDate: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Format the data to match the required structure
      const formattedData = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        jobType: jobData.jobType,
        salary: jobData.salary ? parseInt(jobData.salary, 10) : null,
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        expiryDate: jobData.expiryDate.toISOString(),
      };

      // Remove null or undefined values
      Object.keys(formattedData).forEach((key) => {
        if (
          formattedData[key] === null ||
          formattedData[key] === undefined ||
          formattedData[key] === ""
        ) {
          delete formattedData[key];
        }
      });

      const response = await axios.post(
        "http://localhost:8080/api/v1/jobs",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Job posted successfully!");

      // Reset form
      setJobData({
        title: "",
        description: "",
        location: "",
        jobType: "Full-time",
        salary: "",
        requirements: "",
        responsibilities: "",
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      });
    } catch (error) {
      console.error("Error posting job:", error);

      if (error.response) {
        toast.error(
          `Failed to post job: ${
            error.response.data.error ||
            error.response.data.message ||
            "Server error"
          }`
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Job post form card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>
          <p className="text-sm text-gray-600">
            Fill in the details for your new job posting
          </p>
        </div>

        <form className="p-12" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. Software Developer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobType"
                    value={jobData.jobType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary (Annual)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="salary"
                      value={jobData.salary}
                      onChange={handleChange}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="e.g. 120000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={jobData.expiryDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Section */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-4 pb-2 border-b">
              Detailed Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={jobData.requirements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. 5+ years experience with Java, Spring Boot"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  List the key skills, qualifications, and experience required
                  for this position
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={jobData.responsibilities}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. Develop and maintain backend services"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Outline the primary duties and responsibilities for this role
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Provide a comprehensive description of the position, including
                  company overview and benefits
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors mr-3"
              onClick={() => {
                toast.info("Draft saved!");
              }}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobContent;
