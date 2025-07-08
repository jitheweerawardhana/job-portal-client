import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyLogin = ({ userType, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState(
    isSignup
      ? {
          name: "",
          email: "",
          password: "",
          industry: "",
          description: "",
          location: "",
          website: "",
        }
      : {
          name: "",
          password: "",
        }
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        // Registration API call
        const response = await axios.post(
          "http://localhost:8080/api/v1/company/register",
          formData
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("Company registration successful!");

          // Switch to login form after successful registration
          setTimeout(() => {
            setIsSignup(false);
            setFormData({
              name: formData.name, // Keep the name for convenience
              password: "",
            });
          }, 1500);
        }
      } else {
        // Login API call
        const response = await axios.post(
          "http://localhost:8080/api/v1/company/login",
          formData
        );

        if (response.status === 200) {
          toast.success("Login successful!");

          // Store token and company name
          if (response.data.token) {
            localStorage.setItem("companyToken", response.data.token);
            localStorage.setItem("companyName", formData.name);

            // Fetch company data immediately
            try {
              const companyResponse = await axios.get(
                `http://localhost:8080/api/v1/company/${formData.name}`,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.token}`,
                  },
                }
              );

              // Store company data in localStorage
              if (companyResponse.status === 200) {
                localStorage.setItem(
                  "companyData",
                  JSON.stringify(companyResponse.data)
                );
              }
            } catch (error) {
              console.error("Error fetching company data:", error);
              // Don't show error to user, we'll fetch again in dashboard if needed
            }
          }

          // Redirect to CompanyPage after successful login
          setTimeout(() => {
            onClose();
            navigate("/company-dashboard");
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
    // Reset form data when switching modes
    setFormData(
      !isSignup
        ? {
            name: "",
            email: "",
            password: "",
            industry: "",
            description: "",
            location: "",
            website: "",
          }
        : {
            name: "",
            password: "",
          }
    );
  };

  // shadcn/ui styled input component
  const FormInput = ({
    id,
    name,
    type,
    value,
    onChange,
    label,
    required,
    disabled,
    className = "",
  }) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
        >
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
          file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
          border-gray-200 focus-visible:ring-gray-950 ${className}`}
        />
      </div>
    );
  };

  // shadcn/ui styled textarea component
  const FormTextarea = ({
    id,
    name,
    value,
    onChange,
    label,
    required,
    disabled,
    rows = 3,
  }) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
        >
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
          ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 focus-visible:ring-gray-950 resize-none"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto p-6 animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isSignup ? "Create Company Account" : "Company Login"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
              disabled={isLoading}
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
            {/* Login Fields */}
            {!isSignup && (
              <>
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  label="Company Name"
                  required
                  disabled={isLoading}
                />
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  label="Password"
                  required
                  disabled={isLoading}
                />
              </>
            )}

            {/* Signup Fields */}
            {isSignup && (
              <div className="space-y-4">
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  label="Company Name"
                  required
                  disabled={isLoading}
                />
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  required
                  disabled={isLoading}
                />
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  label="Password"
                  required
                  disabled={isLoading}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    id="industry"
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleChange}
                    label="Industry"
                    required
                    disabled={isLoading}
                  />
                  <FormInput
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    label="Location"
                    required
                    disabled={isLoading}
                  />
                </div>

                <FormInput
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  label="Website"
                  required
                  disabled={isLoading}
                />

                <FormTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  label="Description"
                  required
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            )}

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

export default CompanyLogin;
