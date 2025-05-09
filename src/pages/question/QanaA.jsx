// src/pages/question/QanaA.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const QanaA = () => {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!isAuthenticated || user.role !== 'admin') return;

    const fetchQA = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        // 1. fetch all questions
        const qRes = await axios.get('http://localhost:5559/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(qRes.data);

        // 2. for each question, fetch its answer (if any)
        const ansObj = {};
        for (const q of qRes.data) {
          const aRes = await axios.get(`http://localhost:5559/answers/${q._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          ansObj[q._id] = aRes.data[0]?.answer || '';
        }
        setAnswers(ansObj);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQA();
  }, [isAuthenticated, user]);

  const handleChange = (qid, text) => {
    setAnswers((prev) => ({ ...prev, [qid]: text }));
  };

  const handleSave = async (qid) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      // check if an answer already exists
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

      alert('Answer saved and email sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to save answer.');
    }
  };

  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <p className="p-6 text-center text-red-600 font-semibold">
        Access denied.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Questions &amp; Answers</h1>
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q._id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">
              {q.name}{' '}
              <span className="text-gray-500">({q.email})</span>
            </p>
            <p className="mt-1 mb-3">❓ {q.question}</p>
            <textarea
              rows={3}
              value={answers[q._id] || ''}
              onChange={(e) => handleChange(q._id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full border border-gray-300 p-2 rounded"
            />
            <button
              onClick={() => handleSave(q._id)}
              disabled={!answers[q._id]?.trim()}
              className="mt-2 bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Save &amp; Send Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QanaA;
