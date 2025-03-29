import React, { useState } from "react";
import Dashboard from "../../components/Dashboard";
import { AiOutlineSend, AiOutlineMessage } from "react-icons/ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I assist you with your taxes today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Placeholder response (you can later replace this with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Thank you for your message!" }
      ]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3 mb-4">
          <AiOutlineMessage className="text-blue-600 w-8 h-8" />
          TaxMate Chatbot
        </h1>
        <p className="text-gray-600 mb-6">Ask anything about taxes, income, expenses, or the platform.</p>

        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col h-[70vh] max-h-[70vh]">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                  msg.from === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 border-t pt-4">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition"
            >
              <AiOutlineSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Chatbot;
