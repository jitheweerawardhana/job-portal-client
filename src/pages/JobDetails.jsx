import {
  Award,
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  DollarSign,
  MapPin,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import ApplicationPopup from "../components/ApplicationPopup";
import Navbar from "../components/NavBar";

const JobDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { jobs: contextJobs } = React.useContext(AppContext);

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [isApplicationPopupOpen, setIsApplicationPopupOpen] = useState(false);

  useEffect(() => {
    // If job data was passed through location state, use it
    if (location.state?.job) {
      setJob(location.state.job);
      setRelatedJobs(location.state.relatedJobs || []);
      setLoading(false);
    } else {
      // Otherwise, fetch from context based on ID
      const foundJob = contextJobs.find((j) => j.id === id);
      if (foundJob) {
        setJob(foundJob);
        setRelatedJobs(
          contextJobs.filter(
            (item) =>
              item.companyName === foundJob.companyName &&
              item.id !== foundJob.id
          )
        );
      }
      setLoading(false);
    }
  }, [id, location.state, contextJobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleApplyNow = (selectedJob) => {
    // Instead of redirecting, open the application popup
    setIsApplicationPopupOpen(true);
  };

  const handleApplicationSubmit = (formData) => {
    console.log("Application submitted:", formData);
    // Here you would typically send the application data to your API
    // For now, we'll just show an alert
    alert(`Application for ${job.title} submitted successfully!`);
  };

  const handleViewRelatedJob = (relatedJob) => {
    navigate(`/job-details/${relatedJob.id}`, {
      state: {
        job: relatedJob,
        relatedJobs: contextJobs.filter(
          (item) =>
            item.companyName === relatedJob.companyName &&
            item.id !== relatedJob.id
        ),
      },
    });
  };

  return (
    <>
      <Navbar />
      {job && (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Job Header Card */}
          <div className="mb-8 border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-50 pb-4 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-base text-gray-600">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">{job.companyName}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => handleApplyNow(job)}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2 rounded-md font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {job.jobType && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> Job Type
                    </span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> Salary
                    </span>
                    <span className="font-medium">
                      ${job.salary.toLocaleString()}
                    </span>
                  </div>
                )}
                {job.experienceLevel && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Award className="h-4 w-4" /> Experience
                    </span>
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>
                )}
                {job.postedDate && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Posted
                    </span>
                    <span className="font-medium">
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-500 mb-2 block">
                    Skills & Technologies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs py-1 px-2 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content with Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="w-full">
                <div className="grid w-full grid-cols-3 border-b">
                  <button
                    className={`py-2 text-center ${
                      activeTab === "description"
                        ? "border-b-2 border-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`py-2 text-center ${
                      activeTab === "requirements"
                        ? "border-b-2 border-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("requirements")}
                  >
                    Requirements
                  </button>
                  <button
                    className={`py-2 text-center ${
                      activeTab === "benefits"
                        ? "border-b-2 border-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("benefits")}
                  >
                    Benefits
                  </button>
                </div>

                {activeTab === "description" && (
                  <div className="mt-6 border rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold">Job Description</h2>
                    </div>
                    <div className="p-6 prose max-w-none">
                      {job.description ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                      ) : (
                        <p>
                          No detailed description available for this position.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div className="mt-6 border rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold">Requirements</h2>
                    </div>
                    <div className="p-6 prose max-w-none">
                      {job.requirements ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: job.requirements }}
                        />
                      ) : (
                        <p>Requirements not specified.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div className="mt-6 border rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold">Benefits</h2>
                    </div>
                    <div className="p-6 prose max-w-none">
                      {job.benefits ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: job.benefits }}
                        />
                      ) : (
                        <p>Benefits not specified.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="border rounded-lg shadow-sm mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">
                    About {job.companyName}
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    {job.companyDescription ||
                      `${job.companyName} is a leading company in its industry.`}
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <button className="border border-gray-300 rounded-md py-2 px-4 w-full hover:bg-gray-50">
                    View Company Profile
                  </button>
                </div>
              </div>

              <div className="border rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">How to Apply</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-600 text-xs text-blue-600">
                        1
                      </div>
                      <p>Click the Apply Now button above</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-600 text-xs text-blue-600">
                        2
                      </div>
                      <p>
                        Complete the application form on the company website
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-600 text-xs text-blue-600">
                        3
                      </div>
                      <p>Submit your resume and cover letter</p>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleApplyNow(job)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Jobs Section */}
          {relatedJobs.length > 0 && (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  More Jobs at {job.companyName}
                </h2>
                {relatedJobs.length > 3 && (
                  <button
                    onClick={() =>
                      navigate("/jobs", {
                        state: { companyFilter: job.companyName },
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    See all jobs
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedJobs.slice(0, 3).map((relatedJob) => (
                  <div
                    key={relatedJob.id}
                    className="border rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6 pb-2">
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {relatedJob.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="h-3 w-3" /> {relatedJob.location}
                      </div>
                    </div>
                    <div className="px-6 pb-2">
                      <div className="flex items-center text-gray-600 mb-3">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{relatedJob.jobType || "Not specified"}</span>
                      </div>

                      {relatedJob.tags && relatedJob.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {relatedJob.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="border text-xs px-2 py-1 rounded-full text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                          {relatedJob.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">
                              +{relatedJob.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-3 flex justify-between border-t">
                      <button
                        onClick={() => handleViewRelatedJob(relatedJob)}
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleApplyNow(relatedJob)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Application Popup */}
      {job && (
        <ApplicationPopup
          isOpen={isApplicationPopupOpen}
          onClose={() => setIsApplicationPopupOpen(false)}
          job={job}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </>
  );
};

export default JobDetails;
