import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCourseModal = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    level: "Beginner",
  });
  const [errors, setErrors] = useState({});

  const levelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.price.toString().trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.level) {
      newErrors.level = "Level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ? (value === "" ? "" : parseFloat(value)) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/courses/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }

      const data = await response.json();

      toast.success("Course created successfully!");

      // If there's a success callback, call it with the new course data
      if (onSuccess) {
        onSuccess(data);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input field component with shadcn/ui styling
  const InputField = ({
    label,
    name,
    type = "text",
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
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleInputChange}
          className={`flex h-10 w-full rounded-md border ${
            error ? "border-red-500" : "border-input border-gray-200"
          } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
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
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              Add New Course
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
            Fill in the details to create a new course
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Title"
                name="title"
                value={formData.title}
                error={errors.title}
                placeholder="e.g., Java for Beginners"
              />

              <InputField
                label="Category"
                name="category"
                value={formData.category}
                error={errors.category}
                placeholder="e.g., Programming"
              />

              <InputField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                error={errors.price}
                placeholder="e.g., 49.99"
              />

              <InputField
                label="Duration"
                name="duration"
                value={formData.duration}
                error={errors.duration}
                placeholder="e.g., 6 weeks"
              />

              <div className="space-y-2">
                <label
                  htmlFor="level"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Level
                </label>
                <div className="relative">
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.level
                        ? "border-red-500"
                        : "border-input border-gray-200"
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      errors.level
                        ? "focus-visible:ring-red-400"
                        : "focus-visible:ring-gray-400"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {levelOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.level && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.level}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`flex min-h-[80px] w-full rounded-md border ${
                    errors.description
                      ? "border-red-500"
                      : "border-input border-gray-200"
                  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    errors.description
                      ? "focus-visible:ring-red-400"
                      : "focus-visible:ring-gray-400"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  placeholder="Provide a detailed description of your course"
                ></textarea>
              </div>
              {errors.description && (
                <p className="text-sm font-medium text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-300 text-gray-700 hover:bg-gray-100 h-10 py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 bg-black text-white hover:bg-gray-900"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
