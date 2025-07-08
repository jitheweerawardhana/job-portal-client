import React, { useEffect, useState } from "react";

const TrainerDashboardPage = () => {
  const [trainerInfo, setTrainerInfo] = useState({
    username: "",
    fullName: "",
    specialization: "",
    experience: "",
    bio: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Fetch trainer data from API in a real application
    // For now, we'll simulate with some mock data and localStorage values
    const fetchTrainerData = () => {
      setIsLoading(true);

      // In a real app, you would fetch this data from your API
      // using the token stored in localStorage

      try {
        // Simulate API call with timeout
        setTimeout(() => {
          const username = localStorage.getItem("username") || "Trainer";

          // Mock data - in a real app, this would come from your API
          setTrainerInfo({
            username: username,
            fullName: "John Doe",
            specialization: "Java Programming",
            experience: "10 years",
            bio: "Experienced Java trainer with 10 years of industry experience. Specialized in enterprise Java applications and modern frameworks like Spring Boot.",
            email: "trainer@example.com",
          });

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching trainer data:", error);
        setIsLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  // Stats for the trainer dashboard
  const stats = [
    { name: "Total Courses", value: "12" },
    { name: "Active Students", value: "48" },
    { name: "Completion Rate", value: "94%" },
    { name: "Average Rating", value: "4.8/5" },
  ];

  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    // Show toast notification
    setShowToast(true);

    // Hide toast after 3 seconds and redirect
    setTimeout(() => {
      setShowToast(false);
      // Redirect to initial URL (root path)
      window.location.href = "/";
    }, 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
          Logged out successfully
        </div>
      )}

      {/* Logout button in header area */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Trainer Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {trainerInfo.username}!
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "courses"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Courses
                </button>
                <button
                  onClick={() => setActiveTab("students")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "students"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Profile
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow rounded-lg">
              {activeTab === "overview" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Dashboard Overview
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Trainer Profile
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Name
                            </p>
                            <p className="mt-1">{trainerInfo.fullName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Specialization
                            </p>
                            <p className="mt-1">{trainerInfo.specialization}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Experience
                            </p>
                            <p className="mt-1">{trainerInfo.experience}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Bio
                            </p>
                            <p className="mt-1">{trainerInfo.bio}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Recent Activity
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ul className="divide-y divide-gray-200">
                          <li className="py-3">
                            <div className="flex items-start">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  New student enrolled
                                </p>
                                <p className="text-sm text-gray-500">
                                  Jane Doe enrolled in "Advanced Java
                                  Programming"
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <span className="text-xs text-gray-500">
                                  2h ago
                                </span>
                              </div>
                            </div>
                          </li>
                          <li className="py-3">
                            <div className="flex items-start">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Course completed
                                </p>
                                <p className="text-sm text-gray-500">
                                  Mike Smith completed "Java Basics"
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <span className="text-xs text-gray-500">
                                  1d ago
                                </span>
                              </div>
                            </div>
                          </li>
                          <li className="py-3">
                            <div className="flex items-start">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  New review
                                </p>
                                <p className="text-sm text-gray-500">
                                  You received a 5-star review from Alex Johnson
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <span className="text-xs text-gray-500">
                                  2d ago
                                </span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">My Courses</h2>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      Add New Course
                    </button>
                  </div>

                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Course Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Students
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Rating
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Java Fundamentals
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            12
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            4.8/5
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Advanced Java Programming
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            8
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            4.9/5
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Spring Boot Mastery
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            15
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            4.7/5
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "students" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Students</h2>

                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Course
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Progress
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Enrolled On
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Jane Doe
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Advanced Java Programming
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            32%
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Mar 12, 2023
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Mike Smith
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Java Fundamentals
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            100%
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Feb 3, 2023
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Alex Johnson
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Spring Boot Mastery
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            78%
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Jan 15, 2023
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile</h2>

                  <div className="max-w-3xl">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Username
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="username"
                              id="username"
                              defaultValue={trainerInfo.username}
                              disabled
                              className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              defaultValue={trainerInfo.email}
                              className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="fullName"
                              id="fullName"
                              defaultValue={trainerInfo.fullName}
                              className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="specialization"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Specialization
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="specialization"
                              id="specialization"
                              defaultValue={trainerInfo.specialization}
                              className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="experience"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Years of Experience
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="experience"
                              id="experience"
                              defaultValue={trainerInfo.experience}
                              className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bio
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="bio"
                              name="bio"
                              rows={4}
                              defaultValue={trainerInfo.bio}
                              className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Brief description about your teaching experience and
                            expertise.
                          </p>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboardPage;
