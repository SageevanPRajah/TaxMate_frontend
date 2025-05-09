// src/pages/expense/CreateExpense.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';
import useVoiceInput from '../../hooks/useVoiceInput.js';
import { useAuth } from '../../hooks/useAuth.js';

const CreateExpense = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expense, setExpense] = useState({
    userID: '',
    expenseID: '',
    expenseName: '',
    expenseCategory: '',
    expenseAmount: '',
    date: '',
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { listening, startListening } = useVoiceInput();

  // auto-populate userID (or dev fallback)
  useEffect(() => {
    const id = user && (user._id || user.id || user.userID)
      ? (user._id || user.id || user.userID)
      : 'dev-user-id-123';
    setExpense(prev => ({ ...prev, userID: id }));
  }, [user]);

  // combined record (amount + name)
  const handleVoiceRecord = () => {
    setError(null);
    startListening(
      ({ amount, name }) => {
        setExpense(prev => ({
          ...prev,
          expenseAmount: amount ?? prev.expenseAmount,
          expenseName:   name   ?? prev.expenseName,
        }));
      },
      err => setError(`Voice input error: ${err}`)
    );
  };

  const handleRecordName = () => {
    setError(null);
    startListening(
      ({ name }) => setExpense(prev => ({ ...prev, expenseName: name ?? prev.expenseName })),
      err => setError(`Name input error: ${err}`)
    );
  };

  const handleRecordAmount = () => {
    setError(null);
    startListening(
      ({ amount }) => setExpense(prev => ({ ...prev, expenseAmount: amount ?? prev.expenseAmount })),
      err => setError(`Amount input error: ${err}`)
    );
  };

  const validate = data => {
    const errs = {};
    if (!data.userID) {
      errs.userID = 'User ID is required.';
    }
    if (!/^[a-zA-Z0-9]{3,}$/.test(data.expenseID)) {
      errs.expenseID = 'ID must be alphanumeric, ≥3 chars.';
    }
    if (!data.expenseName || data.expenseName.length < 3) {
      errs.expenseName = 'Name ≥3 chars.';
    }
    if (!data.expenseCategory) {
      errs.expenseCategory = 'Select a category.';
    }
    if (!data.expenseAmount || parseFloat(data.expenseAmount) <= 0) {
      errs.expenseAmount = 'Amount must be >0.';
    }
    if (!data.date) {
      errs.date = 'Select a date.';
    } else if (new Date(data.date) > new Date()) {
      errs.date = 'Date cannot be in the future.';
    }
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setExpense(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // default date/category if blank
    const today = new Date().toISOString().slice(0, 10);
    const data = {
      ...expense,
      date: expense.date || today,
      expenseCategory: expense.expenseCategory || 'Default',
    };

    const errs = validate(data);
    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5559/expense', data);
      navigate('/expense');
    } catch (err) {
      setError('Failed to create expense.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">

          <h2 className="text-3xl font-bold text-center mb-4">Create Expense</h2>
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
              {listening ? 'Listening…' : '🎙️ Record Amount & Name'}
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
            {/* Expense ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Expense ID</label>
              <input
                type="text"
                name="expenseID"
                value={expense.expenseID}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
              {validationErrors.expenseID && (
                <p className="text-red-500 text-xs">{validationErrors.expenseID}</p>
              )}
            </div>

            {/* Expense Name */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Expense Name</label>
                <input
                  type="text"
                  name="expenseName"
                  value={expense.expenseName}
                  onChange={handleChange}
                  placeholder="e.g., Foodcity"
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
                {validationErrors.expenseName && (
                  <p className="text-red-500 text-xs">{validationErrors.expenseName}</p>
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

            {/* Expense Amount */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Expense Amount (Rs.)</label>
                <input
                  type="number"
                  name="expenseAmount"
                  value={expense.expenseAmount}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
                {validationErrors.expenseAmount && (
                  <p className="text-red-500 text-xs">{validationErrors.expenseAmount}</p>
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

            {/* Expense Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Expense Category</label>
              <select
                name="expenseCategory"
                value={expense.expenseCategory}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">Default</option>
                <option value="Medical Expenses">Medical Expenses</option>
                <option value="Donation">Donation</option>
                <option value="Personal care">Personal care</option>
                <option value="Home appliances">Home appliances</option>
                <option value="Grocery">Grocery</option>
                <option value="Others">Others</option>
              </select>
              {validationErrors.expenseCategory && (
                <p className="text-red-500 text-xs">{validationErrors.expenseCategory}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
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

export default CreateExpense;
