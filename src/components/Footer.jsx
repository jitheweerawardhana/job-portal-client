import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-xl font-bold">HireLink</h3>
            <p className="text-sm text-gray-400">
              Empowering job seekers to find their perfect career match.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                About Us
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Jobs
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Resources
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Contact
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                FAQ
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Privacy
              </a>
            </div>
          </div>

          {/* Social and Subscribe */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-lg font-semibold">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-twitter"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-github"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-gray-900 text-sm rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-r-md transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} HireLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
