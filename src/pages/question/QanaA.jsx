import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from '../../components/AdminDashboard.jsx';
import { AiOutlineInfoCircle, AiOutlineDelete } from 'react-icons/ai';
import { useAuth } from '../../hooks/useAuth';

const QanaA = () => {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [savedStatus, setSavedStatus] = useState({}); // track which answers are saved
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // state for showing the delete confirmation modal
  const [deleteQuestionId, setDeleteQuestionId] = useState(null); // store question id for deletion
  const [successMessage, setSuccessMessage] = useState(''); // state to store success message after deletion

  useEffect(() => {
    // only proceed if admin is logged in
    if (!isAuthenticated || user.role !== 'admin') {
      setLoading(false);
      return;
    }

    const fetchQA = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        // 1. fetch all questions
        const qRes = await axios.get('http://localhost:5559/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const qData = qRes.data;
        setQuestions(qData);

        // 2. for each question, fetch its answer (if any)
        const ansObj = {};
        const savedObj = {};
        await Promise.all(qData.map(async (q) => {
          const aRes = await axios.get(`http://localhost:5559/answers/${q._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const arr = aRes.data;
          ansObj[q._id] = arr[0]?.answer || '';
          savedObj[q._id] = arr.length > 0;
        }));
        setAnswers(ansObj);
        setSavedStatus(savedObj);
      } catch (err) {
        console.error('Error fetching Q&A:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQA();
  }, [isAuthenticated, user]);

  // Show a loading state until we've attempted to fetch
  if (loading) {
    return (
      <Dashboard>
        <p className="p-6 text-gray-500 text-center">Loading Q&amp;A…</p>
      </Dashboard>
    );
  }

  // Deny non-admins
  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <Dashboard>
        <p className="p-6 font-semibold text-center text-red-600">
          Access denied.
        </p>
      </Dashboard>
    );
  }

  const handleChange = (qid, text) => {
    setAnswers((prev) => ({ ...prev, [qid]: text }));
  };

  const handleSave = async (qid) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const aRes = await axios.get(`http://localhost:5559/answers/${qid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (aRes.data.length > 0) {
        // update existing
        const ansId = aRes.data[0]._id;
        await axios.put(
          `http://localhost:5559/answers/${ansId}`,
          { answer: answers[qid] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // create new
        await axios.post(
          `http://localhost:5559/answers/${qid}`,
          { answer: answers[qid] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSavedStatus((prev) => ({ ...prev, [qid]: true }));
      alert('Answer saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save answer.');
    }
  };

  const handleSendEmail = async (qid) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post(
        `http://localhost:5559/answers/${qid}/send-email`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Email sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send email.');
    }
  };

  // Function to handle delete action
  const handleDelete = () => {
    setAnswers((prev) => ({ ...prev, [deleteQuestionId]: '' })); // Clear the text area
    setShowDeleteModal(false); // Close the modal
    setSuccessMessage('Answer deleted successfully!'); // Set success message
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3 mb-4">
          <AiOutlineInfoCircle className="text-blue-600 w-8 h-8" />
          Questions & Answers
        </h1>
        <p className="text-gray-600 mb-6">
          Manage user questions, provide answers, and notify users via email.
        </p>

        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-500"
            >
              <p className="font-semibold">
                {q.name}{' '}
                <span className="text-gray-500">({q.email})</span>
              </p>
              <p className="mt-1 mb-3">❓ {q.question}</p>
              <div className="relative">
                <textarea
                  rows={3}
                  value={answers[q._id] || ''}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  placeholder="Type your answer here…"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                  className="absolute top-2 right-2 text-red-600"
                  onClick={() => {
                    setDeleteQuestionId(q._id); // Store the question ID to delete
                    setShowDeleteModal(true); // Show the delete confirmation modal
                  }}
                >
                  <AiOutlineDelete />
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleSave(q._id)}
                  disabled={!answers[q._id]?.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                  Save Answer & Send Email
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to delete the answer?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
            {/* Success Message */}
            {successMessage && (
              <div className="mt-4 text-green-600 text-center">
                <p>{successMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Dashboard>
  );
};

export default QanaA;
