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

const JobPortalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your job search assistant. I can help you find jobs, provide career advice, or answer questions about applications. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Find software engineer jobs",
        "Show remote opportunities",
        "Help with my resume",
        "Interview tips",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample job data for demonstration
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $140k",
      type: "Full-time",
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studios",
      location: "New York, NY",
      salary: "$80k - $110k",
      type: "Contract",
    },
  ];

  const predefinedResponses = {
    greeting: [
      "Hello! How can I assist you with your job search today?",
      "Hi there! I'm here to help you find your dream job. What are you looking for?",
      "Welcome! I can help you search for jobs, get career advice, or answer application questions.",
    ],
    jobs: {
      "software engineer": sampleJobs.filter((job) =>
        job.title.toLowerCase().includes("software")
      ),
      "product manager": sampleJobs.filter((job) =>
        job.title.toLowerCase().includes("product")
      ),
      designer: sampleJobs.filter((job) =>
        job.title.toLowerCase().includes("designer")
      ),
      remote: sampleJobs.filter((job) =>
        job.location.toLowerCase().includes("remote")
      ),
    },
    tips: {
      resume:
        "Here are some resume tips:\n\n• Keep it concise (1-2 pages)\n• Use action verbs and quantify achievements\n• Tailor it to each job application\n• Include relevant keywords from job descriptions\n• Proofread carefully for errors",
      interview:
        "Interview preparation tips:\n\n• Research the company thoroughly\n• Practice common interview questions\n• Prepare specific examples using the STAR method\n• Dress appropriately for the company culture\n• Prepare thoughtful questions to ask the interviewer\n• Follow up with a thank-you email",
    },
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse = generateBotResponse(message.toLowerCase());
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (message) => {
    let responseText = "";
    let jobResults = [];
    let suggestions = [];

    // Job search responses
    if (
      message.includes("software") ||
      message.includes("engineer") ||
      message.includes("developer")
    ) {
      jobResults = predefinedResponses.jobs["software engineer"];
      responseText = `I found ${jobResults.length} software engineering positions for you:`;
      suggestions = [
        "Show more details",
        "Filter by location",
        "Set job alerts",
      ];
    } else if (message.includes("product manager") || message.includes("pm")) {
      jobResults = predefinedResponses.jobs["product manager"];
      responseText = `Here are product manager opportunities:`;
      suggestions = ["Show requirements", "Similar roles", "Salary insights"];
    } else if (message.includes("designer") || message.includes("design")) {
      jobResults = predefinedResponses.jobs["designer"];
      responseText = `I found these design positions:`;
      suggestions = ["Portfolio tips", "Design trends", "Freelance options"];
    } else if (
      message.includes("remote") ||
      message.includes("work from home")
    ) {
      jobResults = predefinedResponses.jobs["remote"];
      responseText = `Here are remote job opportunities:`;
      suggestions = ["Remote work tips", "Time zones", "Communication tools"];
    }
    // Career advice responses
    else if (message.includes("resume") || message.includes("cv")) {
      responseText = predefinedResponses.tips.resume;
      suggestions = [
        "Review my resume",
        "Resume templates",
        "ATS optimization",
      ];
    } else if (message.includes("interview")) {
      responseText = predefinedResponses.tips.interview;
      suggestions = [
        "Mock interview",
        "Common questions",
        "Salary negotiation",
      ];
    }
    // Greeting responses
    else if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      responseText =
        predefinedResponses.greeting[
          Math.floor(Math.random() * predefinedResponses.greeting.length)
        ];
      suggestions = [
        "Find jobs",
        "Career advice",
        "Application help",
        "Salary insights",
      ];
    }
    // Default response
    else {
      responseText =
        "I can help you with job searches, career advice, resume tips, and interview preparation. What would you like to know more about?";
      suggestions = [
        "Search jobs",
        "Resume help",
        "Interview tips",
        "Career guidance",
      ];
    }

    return {
      id: messages.length + 2,
      text: responseText,
      sender: "bot",
      timestamp: new Date(),
      jobResults: jobResults,
      suggestions: suggestions,
    };
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
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {job.type}
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
            : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Job Search Assistant</h3>
                <p className="text-xs text-blue-100">Online • Ready to help</p>
              </div>
            </div>
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
                      <Bot size={16} className="text-blue-600" />
                      <span className="text-xs text-gray-500">Assistant</span>
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
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
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
                placeholder="Ask about jobs, get career advice..."
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobPortalChatbot;
