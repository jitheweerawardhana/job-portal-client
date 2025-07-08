import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TrainerLogin = ({ userType, onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    specialization: "",
    bio: "",
    experience: "",
  });
  const [errors, setErrors] = useState({});

  const validateLoginForm = () => {
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

  const validateRegistrationForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
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
    return isLogin ? "/api/v1/trainer/login" : "/api/v1/trainer/register";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = isLogin ? validateLoginForm() : validateRegistrationForm();

    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = getEndpoint();

      // Create payload based on login or registration
      const payload = isLogin
        ? {
            username: formData.username,
            password: formData.password,
          }
        : {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            fullName: formData.fullName,
            specialization: formData.specialization,
            bio: formData.bio,
            experience: formData.experience,
          };

      console.log(
        `Sending ${isLogin ? "login" : "signup"} request to: ${endpoint}`
      );
      console.log("Payload:", payload);

      // Mock successful response for testing
      // In production, replace with actual API call
      const data = {
        success: true,
        message: `Trainer ${isLogin ? "Login" : "Registration"} successful!`,
        token: "sample-token-for-trainer",
        user: {
          username: formData.username,
          role: "TRAINER",
        },
      };

      // Store login info in localStorage
      if (data.success) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("userRole", "TRAINER");

        // Dispatch login event for navbar to detect
        window.dispatchEvent(new Event("userLogin"));

        toast.success(data.message);

        // Close the modal
        onClose();

        // Redirect to the trainer dashboard
        navigate("/trainer-dashboard");
      }
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

  // Input field component with shadcn/ui styling
  const InputField = ({
    label,
    name,
    type = "text",
    icon,
    placeholder,
    value,
    error,
  }) => (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleInputChange}
          className={`flex h-10 w-full rounded-md border ${
            error ? "border-red-500" : "border-input border-gray-200"
          } bg-background pl-10 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            error ? "focus-visible:ring-red-400" : "focus-visible:ring-gray-400"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full ${
          !isLogin ? "max-w-3xl" : "max-w-md"
        } bg-white rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - shadcn/ui style */}
        <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              {isLogin ? "Trainer Login" : "Trainer Registration"}
            </h3>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-gray-100 h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {isLogin
              ? "Sign in to your trainer account"
              : "Create a new trainer account"}
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              // Login form - single column
              <>
                <InputField
                  label="Username"
                  name="username"
                  value={formData.username}
                  error={errors.username}
                  placeholder="Enter your username"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  }
                />

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  error={errors.password}
                  placeholder="Enter your password"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        width="18"
                        height="11"
                        x="3"
                        y="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  }
                />
              </>
            ) : (
              // Registration form - two columns
              <>
                {/* Two column layout for inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Username"
                    name="username"
                    value={formData.username}
                    error={errors.username}
                    placeholder="Enter your username"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    }
                  />

                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    error={errors.password}
                    placeholder="Enter your password"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    }
                  />

                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    error={errors.email}
                    placeholder="Enter your email"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    }
                  />

                  <InputField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    }
                  />

                  <InputField
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    error={errors.specialization}
                    placeholder="Your area of expertise"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                    }
                  />

                  <InputField
                    label="Years of Experience"
                    name="experience"
                    value={formData.experience}
                    error={errors.experience}
                    placeholder="e.g. 5 years"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                      </svg>
                    }
                  />
                </div>

                {/* Bio field - full width */}
                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Bio
                  </label>
                  <div className="relative">
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className={`flex min-h-[80px] w-full rounded-md border ${
                        errors.bio
                          ? "border-red-500"
                          : "border-input border-gray-200"
                      } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        errors.bio
                          ? "focus-visible:ring-red-400"
                          : "focus-visible:ring-gray-400"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                      placeholder="Tell us about your experience and expertise"
                    ></textarea>
                  </div>
                  {errors.bio && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.bio}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit button - Black with shadcn/ui styling */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 w-full bg-black text-white hover:bg-gray-900"
            >
              {isSubmitting
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>

            {/* Divider - shadcn/ui style */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Toggle auth mode - shadcn/ui style */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-black hover:text-gray-900 hover:bg-gray-100 h-9 px-4 py-2"
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

export default TrainerLogin;
