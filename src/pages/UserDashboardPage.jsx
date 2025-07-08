import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../AppContext"; // Adjust path as needed
import ApplicationsTab from "../components/User/ApplicationsTab";
import CVManagementTab from "../components/User/CVManagementTab";
import ProfileTab from "../components/User/Profile/ProfileTab";

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const UserDashboardPage = () => {
  // Get context data
  const { userProfileData, loading } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // One-time refresh implementation
    const hasRefreshed = sessionStorage.getItem("dashboardRefreshed");
    if (!hasRefreshed) {
      // Set the flag in session storage
      sessionStorage.setItem("dashboardRefreshed", "true");
      // Refresh the page once
      window.location.reload();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    // Clear the refresh flag when logging out
    sessionStorage.removeItem("dashboardRefreshed");
    toast.info("Logged out successfully");
    navigate("/");
  };

  // Content components for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "applications":
        return <ApplicationsTab />;
      case "cv":
        return <CVManagementTab />;
      default:
        return <ProfileTab />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        {/* User Info Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {userProfileData?.fullName?.charAt(0) ||
                  userProfileData?.username?.charAt(0) ||
                  "U"}
              </span>
            </div>
            <div className="font-semibold text-gray-800 truncate">
              {userProfileData?.fullName || userProfileData?.username || "User"}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "profile"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("applications")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "applications"
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
                My Applications
              </button>
            </li>
            {/* CV Management Tab */}
            <li>
              <button
                onClick={() => setActiveTab("cv")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === "cv"
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
                CV Management
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
              {activeTab === "profile" && "My Profile"}
              {activeTab === "applications" && "My Applications"}
              {activeTab === "cv" && "CV Management"}
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

export default UserDashboardPage;
