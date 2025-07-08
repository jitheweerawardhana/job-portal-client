import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = ({ userType, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Create refs for each form input
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const userRoleRef = useRef(null);
  const adminRoleRef = useRef(null);

  // Default role
  const [selectedRole, setSelectedRole] = useState("USER");

  // Handle role change
  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Get values directly from refs
    const formData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      role: selectedRole,
    };

    try {
      if (isSignup) {
        // Registration API call
        const response = await axios.post(
          "http://localhost:8080/api/v1/user/register",
          formData
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("User registration successful!");

          // Switch to login form after successful registration
          setTimeout(() => {
            setIsSignup(false);
            // Keep username, clear password
            passwordRef.current.value = "";
            setTimeout(() => {
              passwordRef.current?.focus();
            }, 100);
          }, 1500);
        }
      } else {
        // Login API call
        const response = await axios.post(
          "http://localhost:8080/api/v1/user/login",
          formData
        );

        if (response.status === 200) {
          toast.success("Login successful!");

          // Store token and username
          // Handle case where token is directly in the response data (JWT format)
          const token = response.data.token || response.data;
          localStorage.setItem("userToken", token);
          localStorage.setItem("username", formData.username);

          // Extract role from JWT if possible
          try {
            // JWT tokens are in format: header.payload.signature
            // We need the payload (middle part)
            const tokenParts = token.split(".");
            if (tokenParts.length === 3) {
              // Decode the Base64 payload
              const payload = JSON.parse(atob(tokenParts[1]));
              localStorage.setItem("userRole", payload.role || selectedRole);
            } else {
              localStorage.setItem("userRole", selectedRole);
            }
          } catch (error) {
            console.error("Error parsing JWT token:", error);
            localStorage.setItem("userRole", selectedRole);
          }

          // Close modal and update UI after successful login
          setTimeout(() => {
            onClose();
            // Force navbar to refresh by triggering a custom event
            window.dispatchEvent(new Event("userLogin"));
            navigate("/"); // Navigate to home or user dashboard
          }, 1500);
        }
      }
    } catch (error) {
      console.error("API Error:", error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with an error status
        toast.error(
          error.response.data.message ||
            `${isSignup ? "Registration" : "Login"} failed. Please try again.`
        );
      } else if (error.request) {
        // Request made but no response received
        toast.error("Server not responding. Please try again later.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setIsSignup(!isSignup);

    // Clear form fields
    if (usernameRef.current && passwordRef.current) {
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    }

    // Reset role to USER
    setSelectedRole("USER");

    // Focus username field after mode switch
    setTimeout(() => {
      usernameRef.current?.focus();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-gray-600/30 backdrop-blur-sm transition-all"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isSignup ? "Create User Account" : "User Login"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
              disabled={isLoading}
              type="button"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field - Uncontrolled */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                ref={usernameRef}
                autoComplete="off"
                required
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
                file:border-0 file:bg-transparent file:text-sm file:font-medium 
                placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                border-gray-200 focus-visible:ring-gray-950"
              />
            </div>

            {/* Password Field - Uncontrolled */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                ref={passwordRef}
                autoComplete="new-password"
                required
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
                file:border-0 file:bg-transparent file:text-sm file:font-medium 
                placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                border-gray-200 focus-visible:ring-gray-950"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
                Select Role
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    ref={userRoleRef}
                    checked={selectedRole === "USER"}
                    onChange={() => handleRoleChange("USER")}
                    disabled={isLoading}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">User</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    ref={adminRoleRef}
                    checked={selectedRole === "ADMIN"}
                    onChange={() => handleRoleChange("ADMIN")}
                    disabled={isLoading}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">Admin</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white 
                transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                dark:hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {isSignup ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>{isSignup ? "Create Account" : "Login"}</>
                )}
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-500">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="font-medium text-gray-900 underline-offset-4 hover:underline focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSignup ? "Login instead" : "Sign up"}
                </button>
              </p>
            </div>
          </form>
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

export default UserLogin;
