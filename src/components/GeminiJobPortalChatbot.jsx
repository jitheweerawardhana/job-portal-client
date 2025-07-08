import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Bot,
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const GeminiJobPortalChatbot = ({ jobListings = [], currentUser = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi${
        currentUser ? ` ${currentUser.name}` : ""
      }! I'm your free AI job search assistant powered by Google Gemini. I can help you find jobs, provide career advice, review resumes, or answer questions about applications. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Show me latest jobs",
        "Resume writing tips",
        "Interview preparation",
        "Career advice",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug: Check if API key is loaded
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    console.log("API Key status:", apiKey ? "Loaded" : "Missing");
    if (!apiKey) {
      setApiError("API key not found. Please check your .env file.");
    }
  }, []);

  // Function to search jobs based on user query
  const searchJobs = (query) => {
    if (!jobListings || jobListings.length === 0) {
      return [];
    }

    const searchTerms = query.toLowerCase().split(" ");

    return jobListings
      .filter((job) => {
        const jobText = `${job.title} ${job.company} ${job.location} ${
          job.description || ""
        } ${job.skills ? job.skills.join(" ") : ""}`.toLowerCase();

        return searchTerms.some(
          (term) =>
            jobText.includes(term) ||
            job.category?.toLowerCase().includes(term) ||
            job.type?.toLowerCase().includes(term)
        );
      })
      .slice(0, 3);
  };

  const getGeminiResponse = async (message) => {
    console.log("🤖 Getting Gemini response for:", message);

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    // Check if API key exists
    if (!apiKey) {
      console.error("❌ No API key found");
      setApiError("API key not configured");
      return {
        text: "Sorry, the AI service is not configured properly. Please check the API key.",
        jobResults: [],
        suggestions: ["Contact support", "Try again later"],
      };
    }

    try {
      console.log("🔑 API Key found, initializing Gemini...");

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      console.log("📝 Sending prompt to Gemini...");

      // Enhanced prompt
      const prompt = `You are a helpful job search assistant for a job portal website. 
                     Help users with job searching, career advice, resume tips, and interview preparation.
                     Keep responses concise, professional, and actionable. Use bullet points when helpful.
                     
                     Context: This is a job portal with ${
                       jobListings.length
                     } current job listings.
                     ${
                       currentUser
                         ? `The user's name is ${currentUser.name}.`
                         : ""
                     }
                     
                     Always respond naturally and conversationally. If someone greets you, greet them back.
                     If they ask "how are you", respond appropriately.
                     If they ask about jobs, help them search.
                     If they need career advice, provide specific tips.
                     
                     User message: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(
        "✅ Gemini response received:",
        text.substring(0, 100) + "..."
      );

      // Smart job search based on query
      const lowerMessage = message.toLowerCase();
      let jobResults = [];
      let suggestions = [];

      // Search for relevant jobs
      if (
        lowerMessage.includes("job") ||
        lowerMessage.includes("work") ||
        lowerMessage.includes("position") ||
        lowerMessage.includes("browse")
      ) {
        jobResults = searchJobs(message);

        if (jobResults.length > 0) {
          suggestions = [
            "Show more details",
            "Apply to these jobs",
            "Set job alerts",
          ];
        } else {
          suggestions = [
            "Browse all jobs",
            "Different search terms",
            "Contact recruiter",
          ];
        }
      }
      // Specific searches
      else if (
        lowerMessage.includes("software") ||
        lowerMessage.includes("developer") ||
        lowerMessage.includes("engineer")
      ) {
        jobResults = searchJobs("software developer engineer programming");
        suggestions = [
          "Technical interview tips",
          "Coding prep",
          "Tech resume advice",
        ];
      } else if (lowerMessage.includes("remote")) {
        jobResults = jobListings
          .filter((job) => job.location?.toLowerCase().includes("remote"))
          .slice(0, 3);
        suggestions = ["Remote work tips", "Virtual interviews", "Home office"];
      }
      // Career advice
      else if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
        suggestions = ["Resume templates", "ATS optimization", "Cover letters"];
      } else if (lowerMessage.includes("interview")) {
        suggestions = ["Common questions", "STAR method", "Salary negotiation"];
      } else if (lowerMessage.includes("career")) {
        suggestions = ["Career paths", "Skill development", "Industry trends"];
      } else {
        suggestions = [
          "Browse jobs",
          "Career advice",
          "Resume help",
          "Interview prep",
        ];
      }

      setApiError(null); // Clear any previous errors

      return {
        text: text,
        jobResults: jobResults,
        suggestions: suggestions,
      };
    } catch (error) {
      console.error("❌ Gemini API error:", error);
      setApiError(`API Error: ${error.message}`);

      // Provide helpful fallback response
      let fallbackText =
        "I'm having trouble connecting to my AI service right now. ";
      let jobResults = [];

      // Still try to help with basic responses
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("hi") ||
        lowerMessage.includes("hello") ||
        lowerMessage.includes("how are you")
      ) {
        fallbackText =
          "Hello! I'm doing well, thank you for asking! While my AI is having a moment, I can still help you browse jobs and provide basic assistance. What are you looking for?";
      } else if (
        lowerMessage.includes("job") ||
        lowerMessage.includes("work")
      ) {
        jobResults = searchJobs(message);
        if (jobResults.length > 0) {
          fallbackText = `I found ${jobResults.length} job(s) that might interest you:`;
        } else {
          fallbackText =
            "Let me help you find jobs! Try searching for specific roles like 'developer', 'manager', or 'designer'.";
        }
      } else if (lowerMessage.includes("resume")) {
        fallbackText =
          "Here are quick resume tips: Keep it 1-2 pages, use action verbs, quantify achievements, and tailor it to each job. Need more specific help?";
      } else if (lowerMessage.includes("interview")) {
        fallbackText =
          "Interview prep tips: Research the company, practice common questions, prepare STAR examples, and have thoughtful questions ready. What type of interview?";
      } else {
        fallbackText +=
          "But I can still help you browse jobs, get basic career advice, or answer simple questions. What would you like to know?";
      }

      return {
        text: fallbackText,
        jobResults: jobResults,
        suggestions: [
          "Browse jobs",
          "Resume tips",
          "Interview help",
          "Try again",
        ],
      };
    }
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    console.log("💬 User message:", message);

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await getGeminiResponse(message);

      const botMessage = {
        id: messages.length + 2,
        text: aiResponse.text,
        sender: "bot",
        timestamp: new Date(),
        jobResults: aiResponse.jobResults || [],
        suggestions: aiResponse.suggestions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error in handleSendMessage:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an unexpected error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        suggestions: ["Try again", "Refresh page", "Contact support"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2 hover:bg-blue-100 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{job.title}</h4>
          <p className="text-gray-600 text-sm">{job.company}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {job.location}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                {job.salary}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {job.type || "Full-time"}
            </span>
          </div>
        </div>
        <Briefcase size={16} className="text-blue-600 mt-1" />
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : apiError
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
        {/* Status badge */}
        <div
          className={`absolute -top-2 -right-2 text-white text-xs px-1.5 py-0.5 rounded-full font-bold ${
            apiError ? "bg-orange-500" : "bg-green-500"
          }`}
        >
          {apiError ? "BASIC" : "FREE"}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div
            className={`text-white p-4 rounded-t-lg ${
              apiError
                ? "bg-gradient-to-r from-orange-500 to-orange-600"
                : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Job Assistant</h3>
                <p className="text-xs opacity-90">
                  {apiError
                    ? "Basic Mode • Limited Features"
                    : "Powered by Google Gemini • Free"}
                </p>
              </div>
            </div>
            {apiError && (
              <div className="mt-2 text-xs bg-white/20 rounded p-2">
                ⚠️ AI temporarily unavailable. Basic features active.
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.sender === "user" ? "order-2" : "order-1"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot
                        size={16}
                        className={
                          apiError ? "text-orange-600" : "text-blue-600"
                        }
                      />
                      <span className="text-xs text-gray-500">
                        {apiError ? "Basic Assistant" : "Gemini AI"}
                      </span>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>

                  {/* Job Results */}
                  {message.jobResults && message.jobResults.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.jobResults.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}

                  {/* Quick Reply Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            apiError
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  apiError
                    ? "Type your message... (basic mode)"
                    : "Ask about jobs, career advice..."
                }
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className={`text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  apiError
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {apiError
                ? "⚠️ Basic mode - Limited AI features"
                : "✨ Free AI Assistant"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiJobPortalChatbot;
