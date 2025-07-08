import React, { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../AppContext";
import DocumentViewer from "./DocumentViewer";

const CVManagementTab = () => {
  const { token, userProfileData } = useContext(AppContext);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewingDocument, setViewingDocument] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF or DOC(X)
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadProgress(0);
      } else {
        toast.error("Please select a PDF or Word document (.pdf, .doc, .docx)");
        e.target.value = null;
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle CV upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file to upload");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to upload a CV");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("cv", selectedFile);

    // If updating an existing CV, add that info to the form data
    if (hasCV) {
      formData.append("documentId", userProfileData.cvDocumentId);
      formData.append("updateExisting", "true");
    }

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      // Log for debugging
      console.log("Using token:", token);
      console.log("Has existing CV:", hasCV);
      if (hasCV) console.log("CV document ID:", userProfileData.cvDocumentId);

      // The endpoint might be different for updates
      const endpoint = hasCV
        ? "http://localhost:8080/api/v1/profile/update-cv" // Use update endpoint if it exists
        : "http://localhost:8080/api/v1/profile/upload-cv";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      clearInterval(progressInterval);

      // Log the response details for debugging
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries([...response.headers.entries()])
      );

      // Clone the response before checking it
      const responseClone = response.clone();

      if (response.ok) {
        setUploadProgress(100);
        toast.success(
          hasCV ? "CV updated successfully!" : "CV uploaded successfully!"
        );
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        const responseText = await responseClone.text();
        console.log("Error response body:", responseText);

        let errorMessage = `${response.status} - ${response.statusText}`;

        // Try to parse JSON if possible
        if (responseText && responseText.trim()) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Not JSON or empty
          }
        }

        toast.error(`Error: ${errorMessage}`);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error with CV:", error);
      toast.error(hasCV ? "Failed to update CV" : "Failed to upload CV");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle download of current CV
  const handleDownload = async () => {
    if (!token) {
      toast.error("You must be logged in to download your CV");
      return;
    }

    if (!userProfileData?.cvDocumentId) {
      toast.error("No CV found to download");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/documents/download/${userProfileData.cvDocumentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "cv-document.pdf"; // Default filename

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast.error("Failed to download CV");
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Failed to download CV. Please try again later.");
    }
  };

  // Handle CV preview
  const handlePreview = () => {
    if (!token) {
      toast.error("You must be logged in to view your CV");
      return;
    }

    if (!userProfileData?.cvDocumentId) {
      toast.error("No CV found to view");
      return;
    }

    // Open the document in the document viewer component
    setViewingDocument(true);
  };

  // Delete CV
  const handleDelete = async () => {
    if (!token) {
      toast.error("You must be logged in to delete your CV");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your CV? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/profile/delete-cv",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("CV deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Failed to delete CV"}`);
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("Failed to delete CV. Please try again later.");
    }
  };

  // Function to check if user has a CV
  const hasCV = userProfileData && userProfileData.cvDocumentId;

  return (
    <div className="w-full max-w-7xl mx-auto">
      {viewingDocument && userProfileData?.cvDocumentId && (
        <DocumentViewer
          documentId={userProfileData.cvDocumentId}
          onClose={() => setViewingDocument(false)}
        />
      )}

      <div className="mb-8">
        <p className="text-gray-600">
          Upload, view, and manage your CV/resume. Having an updated CV
          increases your chances of getting noticed by employers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current CV Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              Current CV Status
            </h3>
          </div>

          <div className="p-6">
            {hasCV ? (
              <div>
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      CV Uploaded
                    </h4>
                    <p className="text-sm text-gray-500">
                      {userProfileData.cvUpdatedAt
                        ? `Last updated: ${new Date(
                            userProfileData.cvUpdatedAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}`
                        : "Your CV is ready for job applications"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePreview}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View CV
                  </button>

                  <button
                    onClick={triggerFileInput}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Update CV
                  </button>

                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete CV
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-600"
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
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      No CV Uploaded
                    </h4>
                    <p className="text-sm text-gray-500">
                      Upload your CV to improve your job application chances
                    </p>
                  </div>
                </div>

                <button
                  onClick={triggerFileInput}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                  Upload CV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload CV Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              {hasCV ? "Update CV" : "Upload CV"}
            </h3>
          </div>

          <div className="p-6">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      ref={fileInputRef}
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>

                {selectedFile && (
                  <div className="text-sm font-medium text-gray-900 mt-2">
                    Selected: {selectedFile.name}
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="w-full mt-2">
                    <div className="bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress < 100
                        ? `Uploading: ${uploadProgress}%`
                        : "Upload complete!"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                  ${
                    isUploading || !selectedFile
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } 
                  focus:outline-none`}
              >
                {isUploading ? (
                  <>
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
                    Uploading...
                  </>
                ) : (
                  `${hasCV ? "Update" : "Upload"} CV`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">CV Tips</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Keep it Concise
                </h4>
                <p className="text-sm text-blue-700">
                  Limit your CV to 1-2 pages. Focus on relevant experience and
                  achievements rather than listing every job duty.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  Tailor for Each Job
                </h4>
                <p className="text-sm text-green-700">
                  Customize your CV for each application. Highlight skills and
                  experience that match the job description.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">
                  Use Action Verbs
                </h4>
                <p className="text-sm text-purple-700">
                  Start bullet points with strong action verbs like "achieved,"
                  "implemented," "created," or "managed."
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Include Quantifiable Results
                </h4>
                <p className="text-sm text-yellow-700">
                  Use numbers and percentages to demonstrate your impact. For
                  example: "Increased sales by 20% in 6 months."
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">
                  Proofread Carefully
                </h4>
                <p className="text-sm text-red-700">
                  Spelling and grammar errors can instantly disqualify you. Have
                  someone else review your CV before submitting.
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">
                  Modern Format
                </h4>
                <p className="text-sm text-indigo-700">
                  Use a clean, professional design with consistent formatting.
                  Make sure it's easy to scan quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVManagementTab;
