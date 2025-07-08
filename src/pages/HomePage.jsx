import Footer from "../components/Footer";
import GeminiJobPortalChatbot from "../components/GeminiJobPortalChatbot";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import Navbar from "../components/NavBar";

const HomePage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <Hero />
      <JobListing />
      <Footer />

      {/* Chatbot - will appear in bottom right */}
      <GeminiJobPortalChatbot />
    </div>
  );
};

export default HomePage;
