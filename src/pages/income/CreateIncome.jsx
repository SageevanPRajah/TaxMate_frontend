// src/pages/expense/CreateIncome.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';
import useVoiceInput from '../../hooks/useVoiceInput.js';
import { useAuth } from '../../hooks/useAuth.js';

const CreateIncome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listening, startListening } = useVoiceInput();

  const [income, setIncome] = useState({
    userID: '',
    incomeName: '',
    incomeType: '',
    date: '',
    amount: '',
  });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // auto-populate userID
  useEffect(() => {
    const id = user && (user._id || user.id || user.userID)
      ? (user._id || user.id || user.userID)
      : 'dev-user-id-123';
    setIncome(prev => ({ ...prev, userID: id }));
  }, [user]);

  // Combined “record both” handler
  const handleVoiceRecord = () => {
    setError(null);
    startListening(
      ({ amount, name }) => {
        setIncome(prev => ({
          ...prev,
          amount:     amount ?? prev.amount,
          incomeName: name   ?? prev.incomeName,
        }));
      },
      err => setError(`Voice input error: ${err}`)
    );
  };

  // Fallback: record only Income Name
  const handleRecordName = () => {
    setError(null);
    startListening(
      ({ name }) => setIncome(prev => ({ ...prev, incomeName: name ?? prev.incomeName })),
      err => setError(`Name input error: ${err}`)
    );
  };

  // Fallback: record only Amount
  const handleRecordAmount = () => {
    setError(null);
    startListening(
      ({ amount }) => setIncome(prev => ({ ...prev, amount: amount ?? prev.amount })),
      err => setError(`Amount input error: ${err}`)
    );
  };

  const validate = data => {
    const errs = {};
    if (!data.incomeName || data.incomeName.length < 3) {
      errs.incomeName = 'Income Name must be at least 3 characters.';
    } else if (/^\d+$/.test(data.incomeName)) {
      errs.incomeName = 'Income Name cannot be only numbers.';
    }
    if (!data.incomeType) {
      errs.incomeType = 'Please select an income type.';
    }
    if (!data.date) {
      errs.date = 'Please select a date.';
    } else if (new Date(data.date) > new Date()) {
      errs.date = 'Date cannot be in the future.';
    }
    if (!data.amount || Number(data.amount) <= 0) {
      errs.amount = 'Amount must be a positive number.';
    }
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setIncome(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = { ...income };
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5559/income', data);
      navigate('/income');
    } catch (err) {
      console.error(err);
      setError('Failed to create income. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Create Income</h2>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          {/* Combined Record Button */}
          <div className="flex flex-col items-center mb-6">
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`px-4 py-2 rounded text-white ${
                listening ? 'bg-red-500 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {listening ? 'Listening…' : '🎙️ Record Name & Amount'}
            </button>
            {listening && (
              <div className="flex space-x-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className={`block w-2 h-2 bg-blue-500 animate-pulse delay-${i * 200}`}
                  />
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Income Name */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Income Name
                </label>
                <input
                  type="text"
                  name="incomeName"
                  value={income.incomeName}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
                {validationErrors.incomeName && (
                  <p className="text-red-500 text-xs">{validationErrors.incomeName}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRecordName}
                className="mt-6 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                🎤 Name
              </button>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={income.amount}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
                {validationErrors.amount && (
                  <p className="text-red-500 text-xs">{validationErrors.amount}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRecordAmount}
                className="mt-6 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                🎤 Amt
              </button>
            </div>

            {/* Income Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Income Type
              </label>
              <select
                name="incomeType"
                value={income.incomeType}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              >
                <option value="" disabled>
                  Select Income Type
                </option>
                <option value="Employment">Employment Income</option>
                <option value="Business">Business Income</option>
                <option value="Investment">Investment Income</option>
                <option value="Others">Others</option>
              </select>
              {validationErrors.incomeType && (
                <p className="text-red-500 text-xs">{validationErrors.incomeType}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={income.date}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
              {validationErrors.date && (
                <p className="text-red-500 text-xs">{validationErrors.date}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 mt-4"
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default CreateIncome;
