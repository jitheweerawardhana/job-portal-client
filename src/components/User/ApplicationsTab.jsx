import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../AppContext";

const ApplicationsTab = () => {
  const { jobs, token } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [applicationWithJobs, setApplicationWithJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState(null);

  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/applications/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error("Failed to fetch applications:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Open confirmation modal
  const confirmWithdraw = (application) => {
    setApplicationToWithdraw(application);
    setShowConfirmModal(true);
  };

  // Function to withdraw an application
  const handleWithdrawApplication = async () => {
    if (!applicationToWithdraw) return;

    const applicationId = applicationToWithdraw.id;
    setWithdrawingId(applicationId);
    setShowConfirmModal(false);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove the application from state
        const updatedApplications = applicationWithJobs.filter(
          (app) => app.id !== applicationId
        );
        setApplicationWithJobs(updatedApplications);
        // Also update the applications list
        setApplications(applications.filter((app) => app.id !== applicationId));

        // Show success notification
        toast.success("Application successfully withdrawn", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorData = await response.json();
        toast.error(
          `Error: ${errorData.message || "Failed to withdraw application"}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error(
        "An error occurred while trying to withdraw your application. Please try again later.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setWithdrawingId(null);
      setApplicationToWithdraw(null);
    }
  };

  // Check if applications data already includes job details
  useEffect(() => {
    if (applications.length > 0) {
      // Check if the first application already has jobDetails
      if (applications[0].jobDetails) {
        // Applications already have job details
        setApplicationWithJobs(applications);
        console.log("Applications already contain job details:", applications);
      } else if (jobs && jobs.length > 0) {
        // Need to combine applications with job details
        const combined = applications.map((application) => {
          const relatedJob =
            jobs.find((job) => job.id === application.jobId) || {};
          return {
            ...application,
            jobDetails: relatedJob,
          };
        });
        setApplicationWithJobs(combined);
        console.log("Combined applications with job details:", combined);
      } else {
        // No job details available, use applications as is
        setApplicationWithJobs(applications);
      }
    }
  }, [applications, jobs]);

  // Function to format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: "bg-amber-100 text-amber-800 border-amber-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      INTERVIEW: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return `inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
      statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
    }`;
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Confirm Withdrawal
            </h3>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={() => setShowConfirmModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Are you sure you want to withdraw your application for
              <span className="font-medium text-gray-700">
                {" "}
                {applicationToWithdraw?.jobDetails?.title}
              </span>{" "}
              at
              <span className="font-medium text-gray-700">
                {" "}
                {applicationToWithdraw?.jobDetails?.companyName}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
              onClick={handleWithdrawApplication}
            >
              Withdraw Application
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">
          <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading applications...
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="text-gray-500 text-lg font-medium">
          No applications found
        </div>
        <p className="text-gray-400 text-sm">
          Apply for jobs to see your applications here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Container for notifications */}
      <ToastContainer />

      {/* Confirmation Modal */}
      <ConfirmationModal />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Applications</h2>
        <div className="text-sm text-gray-500">
          {applicationWithJobs.length}{" "}
          {applicationWithJobs.length === 1 ? "application" : "applications"}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid divide-y divide-gray-200">
          {applicationWithJobs.map((application) => (
            <div
              key={application.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Left section - Job details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {application.jobDetails?.title || "Unknown Position"}
                    </h3>
                    <span className={getStatusBadge(application.status)}>
                      {application.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>
                          {application.jobDetails?.companyName ||
                            "Unknown Company"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>
                          {application.jobDetails?.location || "Remote"}
                        </span>
                      </div>

                      {application.jobDetails?.jobType && (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{application.jobDetails.jobType}</span>
                        </div>
                      )}

                      {application.jobDetails?.salary && (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {typeof application.jobDetails.salary === "number"
                              ? `Rs. ${application.jobDetails.salary.toLocaleString()}`
                              : application.jobDetails.salary}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right section - Application details */}
                <div className="sm:text-right">
                  <div className="text-sm text-gray-500 mb-1">Applied on</div>
                  <div className="text-sm font-medium text-gray-700">
                    {formatDate(application.appliedDate)}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                  View Job
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  View Resume
                </button>
                {application.status === "PENDING" && (
                  <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => confirmWithdraw(application)}
                    disabled={withdrawingId === application.id}
                  >
                    {withdrawingId === application.id ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
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
                        Withdrawing...
                      </>
                    ) : (
                      "Withdraw"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTab;
