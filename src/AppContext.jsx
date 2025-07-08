import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create a default context
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";

  // Remove direct Clerk dependency temporarily
  // Instead of using useUser and useAuth directly
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Add missing loading state

  // Jobs-related states
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
    category: "",
  });
  const [isSearched, setIsSearched] = useState(false);

  // User type states
  const [userType, setUserType] = useState(null);

  // Company-related states
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // Jobseeker-related states
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Trainer-related states
  const [trainerToken, setTrainerToken] = useState(null);
  const [trainerData, setTrainerData] = useState(null);
  const [trainingPrograms, setTrainingPrograms] = useState([]);

  //User Profile Data
  const [userProfileData, setUserProfileData] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/jobs`);
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
        setJobs(response.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  // Fixed fetchUserProfileData function
  const fetchUserProfileData = async () => {
    setLoading(true);
    try {
      // Use token from state if available, otherwise from localStorage
      const userToken = token || localStorage.getItem("userToken");
      const username = localStorage.getItem("username");

      if (!userToken || !username) {
        console.error("No authentication token or username found");
        return;
      }

      // Set token to state
      setToken(userToken);

      // Fetch user profile data

      const response = await axios.get(
        "http://localhost:8080/api/v1/profile/me",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setUserProfileData(response.data || null);
    } catch (error) {
      console.error("FETCH PROFILE - Error details:", error.response || error);
      console.error(
        "FETCH PROFILE - Failed to fetch user profile data:",
        error.message
      );
      // You might want to use a toast notification here
      // toast.error("Failed to load user profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Define the fetchUserData function properly

  // Load initial jobs data
  useEffect(() => {
    fetchJobs();

    // Check for stored tokens
    const storedCompanyToken = localStorage.getItem("companyToken");
    const storedTrainerToken = localStorage.getItem("trainerToken");
    const storedUserToken = localStorage.getItem("userToken");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }

    if (storedTrainerToken) {
      setTrainerToken(storedTrainerToken);
    }

    if (storedUserToken) {
      setToken(storedUserToken); // Set token state which will trigger profile fetch
      // This will trigger user data fetch using the token
    }
  }, []);

  // Separate useEffect for fetchUserProfileData
  useEffect(() => {
    if (token) {
      fetchUserProfileData();
    } else {
    }
  }, [token]);

  const value = {
    // Jobs data
    jobs,
    setJobs,
    featuredJobs,
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    fetchJobs,

    // User profile data
    userProfileData,
    fetchUserProfileData,
    loading,

    // Auth/user type
    userType,
    setUserType,
    user,
    setUser,
    token,
    setToken,

    // Company related
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    companyJobs,

    // Continue with all your other context values...
    // Common
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
