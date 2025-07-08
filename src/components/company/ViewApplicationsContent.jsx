import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewApplicationsContent = ({ companyData }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  // Track which dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // Ref for detecting clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Use the correct enum values from your backend
  const statusOptions = [
    "PENDING",
    "REVIEWING",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
  ];

  // Update status colors to match new enum values
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWING":
        return "bg-blue-100 text-blue-800";
      case "INTERVIEW":
        return "bg-purple-100 text-purple-800";
      case "OFFER":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [companyData]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("companyToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/jobs/company",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);

      // Fetch applications for each job
      const allApplications = [];

      for (const job of data) {
        try {
          const appResponse = await fetch(
            `http://localhost:8080/api/v1/applications/job/${job.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (appResponse.ok) {
            const appData = await appResponse.json();
            // Add job title to each application
            const enhancedAppData = appData.map((app) => ({
              ...app,
              jobTitle: job.title,
            }));
            allApplications.push(...enhancedAppData);
          }
        } catch (appError) {
          console.error(
            `Error fetching applications for job ${job.id}:`,
            appError
          );
        }
      }

      setApplications(allApplications);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    // Display application details
    alert(`
      Application Details:
      
      Applicant: ${application.username}
      Job: ${application.jobTitle || "Unknown"}
      Status: ${application.status || "PENDING"}
      Applied Date: ${new Date(application.appliedDate).toLocaleDateString()}
      Cover Letter: ${
        application.coverLetter
          ? application.coverLetter.substring(0, 100) + "..."
          : "No cover letter"
      }
    `);
    // In a real app, you would show this in a modal instead of an alert
  };

  const handleDownloadResume = async (resumeUrl) => {
    try {
      const token = localStorage.getItem("companyToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Make a request to download the file
      const response = await fetch(
        `http://localhost:8080/api/v1/documents/files/${resumeUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Get the file from the response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = resumeUrl.split("_").pop() || "resume.pdf"; // Extract original filename if possible
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error(`Download failed: ${error.message}`);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("companyToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Trim any whitespace from the status
      const trimmedStatus = newStatus.trim();

      // Debug information
      console.log("Updating application status:");
      console.log("Application ID:", applicationId);
      console.log("New Status:", trimmedStatus);

      // Make the API request
      const response = await fetch(
        `http://localhost:8080/api/v1/applications/${applicationId}/status?status=${encodeURIComponent(
          trimmedStatus
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed with status: ${response.status}`);
      }

      const updatedApplication = await response.json();

      // Update the applications list with the new status
      setApplications(
        applications.map((app) =>
          app.id === applicationId
            ? { ...app, status: updatedApplication.status }
            : app
        )
      );

      toast.success(`Application status updated to ${trimmedStatus}`);
      // Close the dropdown after successful update
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Status update failed: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const toggleDropdown = (applicationId) => {
    if (openDropdownId === applicationId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(applicationId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Job Applications Details</h2>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-medium mb-4">No Jobs Posted Yet</h3>
          <p className="text-gray-600 mb-6">
            You need to post jobs before you can receive applications.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Post a Job
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-medium mb-4">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            You have {jobs.length} job posting{jobs.length > 1 ? "s" : ""}, but
            no applications have been received yet.
          </p>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Your posted jobs:</p>
            <ul className="space-y-1">
              {jobs.map((job) => (
                <li key={job.id} className="text-gray-600">
                  {job.title} - {job.location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-600">
            Showing {applications.length} application
            {applications.length > 1 ? "s" : ""} for {jobs.length} job
            {jobs.length > 1 ? "s" : ""}
          </p>

          <div className="overflow-x-auto h-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {application.jobTitle || "Unknown Job"}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {application.username}
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="relative inline-block text-left"
                        ref={dropdownRef}
                      >
                        {/* Status Button */}
                        <button
                          onClick={() => toggleDropdown(application.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center space-x-1 ${getStatusColor(
                            application.status
                          )}`}
                        >
                          <span>{application.status || "PENDING"}</span>
                          <svg
                            className="w-3 h-3 ml-1"
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
                        </button>

                        {/* Status Dropdown - Changed from dropup to dropdown */}
                        {openDropdownId === application.id && (
                          <div className="absolute z-50 top-full left-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm overflow-hidden">
                            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-100">
                              Change status
                            </div>
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                disabled={
                                  updatingStatus ||
                                  status === application.status
                                }
                                onClick={() =>
                                  handleUpdateStatus(application.id, status)
                                }
                                className={`block w-full text-left px-3 py-1.5 text-sm transition-colors ${
                                  status === application.status
                                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                    : `hover:bg-gray-50 text-gray-700 hover:text-gray-900`
                                }`}
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(
                                      status
                                    )}`}
                                  ></span>
                                  {status}
                                  {status === application.status && (
                                    <svg
                                      className="w-4 h-4 ml-auto"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Arrow that points to the button - Now at the top of dropdown instead of bottom */}
                        {openDropdownId === application.id && (
                          <div className="absolute top-full left-5 mt-1 transform translate-x-0 -rotate-45 w-2 h-2 bg-white border-t border-l border-gray-200"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {application.resumeUrl ? (
                        <button
                          onClick={() =>
                            handleDownloadResume(application.resumeUrl)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-400">No Resume</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ViewApplicationsContent;
