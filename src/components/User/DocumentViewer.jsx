import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../AppContext";

const DocumentViewer = ({ documentId, onClose }) => {
  const { token } = useContext(AppContext);
  const [documentContent, setDocumentContent] = useState("");
  const [documentMetadata, setDocumentMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [directDownloadAttempted, setDirectDownloadAttempted] = useState(false);

  useEffect(() => {
    // Use form-based approach to bypass CORS when viewing documents
    if (token && documentId) {
      directDownloadDocument(token, documentId);
    } else {
      setError("Authentication required to view this document");
      setShowLoginForm(true);
      setLoading(false);
    }

    // Add body class to prevent scrolling when modal is open
    document.body.classList.add("overflow-hidden");

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [documentId, token]);

  // Direct download using form submission to bypass CORS
  const directDownloadDocument = (authToken, docId) => {
    try {
      setDirectDownloadAttempted(true);

      // Create a hidden iframe to handle the response
      const iframeId = "download-frame-" + Date.now();
      const iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Create a form for the POST request
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `http://localhost:8080/api/v1/documents/download/${docId}`;
      form.target = iframeId;

      // Add token as a hidden field
      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token";
      tokenInput.value = authToken;
      form.appendChild(tokenInput);

      // Add form to document and submit
      document.body.appendChild(form);
      form.submit();

      // Try to fetch document metadata for display
      fetchDocumentMetadata(authToken, docId);

      // Clean up the form
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 1000);

      // Set loading to false after a timeout
      setTimeout(() => {
        if (loading) {
          setLoading(false);
          setDocumentContent({
            type: "external",
            message: "Document opened in a new tab or frame",
          });
        }
      }, 2000);
    } catch (err) {
      console.error("Error opening document:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchDocumentMetadata = async (authToken, docId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/documents/${docId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocumentMetadata(data);
        console.log("Document metadata:", data);
      }
    } catch (err) {
      console.error("Error fetching document metadata:", err);
      // Not critical, so don't set error state
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token in localStorage
      localStorage.setItem("userToken", data.token);

      // Reset state
      setShowLoginForm(false);
      setError(null);
      setLoading(true);

      // Try the direct download approach again
      directDownloadDocument(data.token, documentId);

      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Failed to login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle download button click
  const handleDownload = () => {
    if (!token) {
      toast.error("You must be logged in to download this document");
      setShowLoginForm(true);
      return;
    }

    directDownloadDocument(token, documentId);
  };

  const formatDate = (dateStr, timeStr) => {
    if (!dateStr) return "Unknown date";
    return `${dateStr} ${timeStr || ""}`;
  };

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return "Unknown size";

    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const renderLoginForm = () => {
    return (
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Authentication Required
        </h3>
        <div className="w-16 h-1 bg-blue-500 mb-6"></div>
        <p className="text-gray-600 mb-8">
          Please enter your credentials to view this document
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderMetadataPanel = () => {
    if (!documentMetadata) return null;

    return (
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex flex-wrap justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-700">
              {documentMetadata.fileName}
            </h3>
            <div className="flex text-xs text-gray-500 space-x-4">
              <span>{documentMetadata.fileType}</span>
              <span>{formatFileSize(documentMetadata.fileSize)}</span>
              <span>
                Created:{" "}
                {formatDate(
                  documentMetadata.createdDate,
                  documentMetadata.createdTime
                )}
              </span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {documentMetadata.documentType === "CV"
              ? "Download CV"
              : "Download Document"}
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (typeof documentContent === "object") {
      if (documentContent.type === "external") {
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-blue-50 rounded-full p-8 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Document Opened
            </h3>
            <p className="text-gray-600 mb-8">
              The document should be opening in a new tab or downloading
            </p>
            {documentMetadata && (
              <div className="bg-gray-100 p-4 rounded-lg max-w-lg mx-auto">
                <h4 className="font-medium text-gray-800 mb-2">
                  Document Information
                </h4>
                <p className="text-sm text-gray-600">
                  {documentMetadata.fileName} •{" "}
                  {formatFileSize(documentMetadata.fileSize)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Created:{" "}
                  {formatDate(
                    documentMetadata.createdDate,
                    documentMetadata.createdTime
                  )}
                </p>
              </div>
            )}
            <button
              onClick={handleDownload}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Again
            </button>
          </div>
        );
      }
    }

    // Default message when no specific content to show
    return (
      <div className="text-center text-gray-500 p-10">
        <div className="bg-gray-100 rounded-full p-8 inline-block mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-lg">Document has been opened outside the viewer</p>
        <p className="text-sm text-gray-400 mt-2">
          If nothing happened, please click the download button below
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {documentMetadata?.documentType === "CV"
              ? "CV Document"
              : "Document Viewer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Metadata panel - shown when document metadata is available */}
        {!loading && !showLoginForm && !error && renderMetadataPanel()}

        <div className="flex-1 overflow-auto bg-gray-50">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full p-10">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          ) : showLoginForm ? (
            renderLoginForm()
          ) : error && !showLoginForm ? (
            <div className="text-center p-10">
              <div className="bg-red-50 rounded-full p-6 inline-block mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Authentication Required
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => setShowLoginForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-colors"
              >
                Log in to Continue
              </button>
            </div>
          ) : (
            <div className="h-full p-4">{renderContent()}</div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white flex justify-between">
          {documentMetadata?.documentType === "CV" ? (
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download CV
            </button>
          ) : (
            <div></div> // Empty div for spacing when not a CV
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add CSS animation
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default DocumentViewer;
