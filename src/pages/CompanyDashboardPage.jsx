import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProfileContent from "../components/company/EditProfileContent";
import HomeContent from "../components/company/HomeContent";
import PostJobContent from "../components/company/PostJobContent";
import ViewApplicationsContent from "../components/company/ViewApplicationsContent";

const CompanyDashboard = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch company data on component mount
    const fetchCompanyData = async () => {
      const token = localStorage.getItem("companyToken");
      const companyName = localStorage.getItem("companyName");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);

        // First, check if we have cached company data
        const cachedData = localStorage.getItem("companyData");
        if (cachedData) {
          setCompanyData(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }

        // If companyName is available, fetch from name-specific endpoint
        if (companyName) {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/v1/company/${companyName}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setCompanyData(response.data);
            localStorage.setItem("companyData", JSON.stringify(response.data));
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error fetching by name:", error);
            // Fall back to profile endpoint
          }
        }

        // Fallback to profile endpoint if name-based request fails or name isn't available
        const response = await axios.get(
          "http://localhost:8080/api/v1/company/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompanyData(response.data);
        localStorage.setItem("companyData", JSON.stringify(response.data));

        // Also store the company name if it wasn't stored before
        if (!companyName && response.data.name) {
          localStorage.setItem("companyName", response.data.name);
        }
      } catch (error) {
        console.error("Failed to fetch company data:", error);

        if (error.response && error.response.status === 401) {
          // Unauthorized - token expired or invalid
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("companyToken");
          localStorage.removeItem("companyName");
          localStorage.removeItem("companyData");
          navigate("/");
        } else {
          toast.error("Failed to load company data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyName");
    localStorage.removeItem("companyData");
    toast.info("Logged out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Content components for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent companyData={companyData} />;
      case "editProfile":
        return <EditProfileContent companyData={companyData} />;
      case "postJob":
        return <PostJobContent />;
      case "viewApplications":
        return <ViewApplicationsContent />;
      default:
        return <HomeContent companyData={companyData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <JwtTokenTester /> */}
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        {/* Company Logo/Name Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {companyData?.name?.charAt(0)}
              </span>
            </div>
            <div className="font-semibold text-gray-800 truncate">
              {companyData?.name}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("home")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "home"
                    ? "text-blue-700 bg-blue-50 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("editProfile")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "editProfile"
                    ? "text-blue-700 bg-blue-50 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("postJob")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "postJob"
                    ? "text-blue-700 bg-blue-50 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Post New Job
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("viewApplications")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "viewApplications"
                    ? "text-blue-700 bg-blue-50 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Applications
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button at bottom */}
        <div className="absolute bottom-0 w-64 border-t p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {activeTab === "home" && "Dashboard"}
              {activeTab === "editProfile" && "Edit Company Profile"}
              {activeTab === "postJob" && "Post a New Job"}
              {activeTab === "viewApplications" && "Job Applications"}
            </h1>

            {/* Render the content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CompanyDashboard;
