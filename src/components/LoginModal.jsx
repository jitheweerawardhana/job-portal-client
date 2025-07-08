import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LoginModal = ({ userType, onClose }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});

  // Set default role based on userType
  useEffect(() => {
    if (userType === "company") {
      setFormData((prev) => ({ ...prev, role: "COMPANY" }));
    } else if (userType === "trainer") {
      setFormData((prev) => ({ ...prev, role: "TRAINER" }));
    } else if (userType === "user") {
      setFormData((prev) => ({ ...prev, role: "USER" }));
    }
  }, [userType]);

  const roles = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getEndpoint = () => {
    if (isLogin) {
      // Login endpoints
      switch (formData.role) {
        case "COMPANY":
          return "/api/v1/company/login";
        case "TRAINER":
          return "/api/v1/trainer/login";
        default:
          return "/api/v1/user/login";
      }
    } else {
      // Register endpoints
      switch (formData.role) {
        case "COMPANY":
          return "/api/v1/company/register";
        case "TRAINER":
          return "/api/v1/trainer/register";
        default:
          return "/api/v1/user/register";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = getEndpoint();

      const payload = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };

      // For simplicity, logging the data that would be sent
      console.log(
        `Sending ${isLogin ? "login" : "signup"} request to: ${endpoint}`
      );
      console.log("Payload:", payload);

      // TODO: Uncomment to actually send the request
      // const response = await axios.post(endpoint, payload);
      // const data = response.data;

      // Mock successful response
      const data = {
        success: true,
        message: `${isLogin ? "Login" : "Registration"} successful!`,
      };

      toast.success(data.message);

      // Close the modal
      onClose();

      // Store token, redirect, etc. would go here
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  // Get modal title based on user type and auth mode
  const getModalTitle = () => {
    let typeText = "User";
    if (userType === "company") typeText = "Company";
    if (userType === "trainer") typeText = "Trainer";

    return `${typeText} ${isLogin ? "Login" : "Sign Up"}`;
  };

  // Only show role selection for "user" type (both in login and signup)
  const showRoleSelection = userType === "user";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg transform transition-all">
        {/* Header with gradient */}
        <div className="relative py-6 px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h2 className="text-2xl font-bold text-white">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/90 hover:text-white focus:outline-none transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
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

        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`pl-10 block w-full rounded-md py-2 px-3 ${
                    errors.username
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 block w-full rounded-md py-2 px-3 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {showRoleSelection && (
              <div className="space-y-1">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.862-.171-1.684-.49-2.433A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
