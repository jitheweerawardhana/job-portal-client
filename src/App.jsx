import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import JobDetails from "./pages/JobDetails";
import JobListing from "./components/JobListing";
import CompanyDashboard from "./pages/CompanyDashboardPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";
import TrainerDashboardPage from "./pages/TrainerDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";

// Protected route component to handle user authentication
const ProtectedUserRoute = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected route component to handle company authentication
const ProtectedCompanyRoute = ({ children }) => {
  const companyToken = localStorage.getItem("companyToken");
  if (!companyToken) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected route component to handle trainer authentication
const ProtectedTrainerRoute = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");

  if (!userToken || userRole !== "TRAINER") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />

        {/* Job Listing routes */}
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/job-details/:id" element={<JobDetails />} />

        {/* Protected company routes */}
        <Route
          path="/company-dashboard"
          element={
            <ProtectedCompanyRoute>
              <CompanyDashboard />
            </ProtectedCompanyRoute>
          }
        />

        {/* Protected user routes */}
        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <UserDashboardPage />
            </ProtectedUserRoute>
          }
        />

        {/* Protected trainer routes */}
        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedTrainerRoute>
              <TrainerDashboardPage />
            </ProtectedTrainerRoute>
          }
        />

        {/* Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
}

export default App;
