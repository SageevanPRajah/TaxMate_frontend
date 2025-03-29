import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "../../components/Dashboard.jsx";
import {
  AiOutlineBell,
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";

const iconMap = {
  info: <AiOutlineInfoCircle className="text-blue-600 w-6 h-6" />,
  reminder: <AiOutlineWarning className="text-orange-500 w-6 h-6" />,
  success: <AiOutlineCheckCircle className="text-green-600 w-6 h-6" />,
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this URL with your actual endpoint when ready
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5559/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);

      // Fallback demo data for now
      setNotifications([
        {
          id: 1,
          type: "info",
          title: "New Tax Update",
          message:
            "The Inland Revenue Department has updated the tax slab for 2025.",
        },
        {
          id: 2,
          type: "reminder",
          title: "Filing Due Soon",
          message:
            "Your tax filing deadline is approaching on April 15th.",
        },
        {
          id: 3,
          type: "success",
          title: "Submission Confirmed",
          message:
            "Your 2024 tax return was successfully submitted.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3 mb-4">
          <AiOutlineBell className="text-blue-600 w-8 h-8" />
          Notifications
        </h1>
        <p className="text-gray-600 mb-6">
          Stay updated with the latest tax updates, reminders, and system messages.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading notifications...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-500"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    {iconMap[note.type] || iconMap.info}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{note.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Notification;
