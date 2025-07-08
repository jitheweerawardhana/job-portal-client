import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/2.png";
import CompanyLogin from "./CompanyLogin";
import TrainerLogin from "./TrainerLogin";
import UserLogin from "./UserLogin";

const Navbar = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const navigateToJobs = () => {
    navigate("/jobs");
  };

  const navigateToCourses = () => {
    navigate("/courses");
  };

  // State for different modals
  const [showCompanyLoginModal, setShowCompanyLoginModal] = useState(false);
  const [showTrainerLoginModal, setShowTrainerLoginModal] = useState(false);
  const [showUserLoginModal, setShowUserLoginModal] = useState(false);
  const [userType, setUserType] = useState(null);

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // State for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check login status on initial load and when login event occurs
  useEffect(() => {
    checkLoginStatus();

    // Listen for login event
    window.addEventListener("userLogin", checkLoginStatus);

    return () => {
      window.removeEventListener("userLogin", checkLoginStatus);
    };
  }, []);

  // Function to check if user is logged in
  const checkLoginStatus = () => {
    const token = localStorage.getItem("userToken");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      // Check if token is valid (not expired)
      try {
        // For JWT tokens, we can check expiration
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          // Decode the payload
          const payload = JSON.parse(atob(tokenParts[1]));
          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp > currentTime) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
            return;
          }
        } else {
          // Not a JWT token, just check if it exists
          setIsLoggedIn(true);
          setUsername(storedUsername);
          return;
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        // If there's an error parsing, we'll assume token is valid
        setIsLoggedIn(true);
        setUsername(storedUsername);
        return;
      }

      // If we get here with a JWT that's expired, clear storage and show logged out
      localStorage.removeItem("userToken");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");
    }

    setIsLoggedIn(false);
    setUsername("");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUsername("");
    setIsDropdownOpen(false);
    navigate("/");
  };

  // Handle profile click
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/profile"); // Navigate to profile page
  };

  const handleOpenCompanyLoginModal = (type) => {
    setUserType(type);
    setShowCompanyLoginModal(true);
    setIsDropdownOpen(false);
  };

  const handleOpenTrainerLoginModal = (type) => {
    setUserType(type);
    setShowTrainerLoginModal(true);
    setIsDropdownOpen(false);
  };

  const handleOpenUserLoginModal = (type) => {
    setUserType(type);
    setShowUserLoginModal(true);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 mx-auto">
          {/* Professional Logo on left */}
          <img src={Logo} width={100} alt="HireLink Logo" />

          {/* Navigation Links in center - replaced toggle with links */}
          <div className="flex-1 flex justify-center">
            <nav className="flex space-x-8">
              <button
                onClick={navigateToJobs}
                className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Jobs
              </button>
              <button
                onClick={navigateToCourses}
                className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Courses Explore
              </button>
            </nav>
          </div>

          {/* Login dropdown or User info in right corner */}
          <div className="relative ml-auto" ref={dropdownRef}>
            {isLoggedIn ? (
              // Logged in: show username and dropdown
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 h-10 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                >
                  <span>Welcome, {username}</span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white border border-gray-200">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
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
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
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
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Not logged in: show login dropdown
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 h-10 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>Login</span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white border border-gray-200">
                    <button
                      onClick={() => handleOpenUserLoginModal("user")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
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
                      <span>User Login</span>
                    </button>

                    <button
                      onClick={() => handleOpenCompanyLoginModal("company")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>Company Login</span>
                    </button>

                    <button
                      onClick={() => handleOpenTrainerLoginModal("trainer")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>Trainer Login</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Company Login Modal */}
      {showCompanyLoginModal && (
        <CompanyLogin
          userType="company"
          onClose={() => setShowCompanyLoginModal(false)}
        />
      )}

      {/* Trainer Login Modal */}
      {showTrainerLoginModal && (
        <TrainerLogin
          userType="trainer"
          onClose={() => setShowTrainerLoginModal(false)}
        />
      )}

      {/* User Login Modal */}
      {showUserLoginModal && (
        <UserLogin
          userType="user"
          onClose={() => setShowUserLoginModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
