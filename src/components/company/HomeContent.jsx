import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const HomeContent = ({ companyData }) => {
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyJobId, setCompanyJobId] = useState([]);
  useEffect(() => {
    console.log(companyData);

    const fetchCompanyJobs = async () => {
      try {
        const token = localStorage.getItem("companyToken");

        if (!token) {
          console.error("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/v1/jobs/company",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompanyJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch company jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, []);

  const handleActiveStatusChange = async (jobId, currentStatus) => {
    try {
      const token = localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Update job status
      const response = await axios.put(
        `http://localhost:8080/api/v1/jobs/${jobId}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCompanyJobId(response.data.job.id);
      console.log(companyJobId);

      // Update local state
      setCompanyJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, isActive: !currentStatus } : job
        )
      );

      toast.success(
        `Job status ${
          !currentStatus ? "activated" : "deactivated"
        } successfully!`
      );
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-700 mb-1">Active Jobs</h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-blue-200 rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">
              {companyJobs.filter((job) => job.isActive).length}
            </p>
          )}
        </div>
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
          <h3 className="font-semibold text-amber-700 mb-1">
            Total Job Postings
          </h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-amber-200 rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{companyJobs.length}</p>
          )}
        </div>
      </div>

      {/* Company Jobs Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
          Your Job Postings
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : companyJobs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Jobs Posted Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start creating job postings to attract talent to your company.
            </p>
          </div>
        ) : (
          <div>
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-t-lg text-sm font-medium text-gray-600">
              <div className="col-span-3">Job Title</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Posted Date</div>
              <div className="col-span-2">Expires</div>
              <div className="col-span-1 text-center">Status</div>
            </div>

            {/* Job Rows */}
            <div className="rounded-b-lg overflow-hidden">
              {companyJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 text-sm ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <div className="col-span-3 font-medium text-gray-800">
                    {job.title}
                  </div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {job.jobType}
                    </span>
                  </div>
                  <div className="col-span-2 truncate" title={job.location}>
                    {job.location}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {formatDate(job.postedDate)}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {formatDate(job.expiryDate)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={job.isActive}
                        onChange={() =>
                          handleActiveStatusChange(job.id, job.isActive)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Company Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Company Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Company Details
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p className="text-gray-800">
                {companyData?.name || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-gray-800">
                {companyData?.email || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Industry:
              </span>
              <p className="text-gray-800">
                {companyData?.industry || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Location:
              </span>
              <p className="text-gray-800">
                {companyData?.location || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Website:
              </span>
              <p className="text-gray-800">
                {companyData?.website ? (
                  <a
                    href={companyData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {companyData.website}
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Description
          </h2>
          <p className="text-gray-800">
            {companyData?.description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
