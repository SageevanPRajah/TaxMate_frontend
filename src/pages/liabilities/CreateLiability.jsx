// src/pages/liability/CreateLiability.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const CreateLiability = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [liability, setLiability] = useState({
    userID: '',
    liabilityID: '',
    liabilityName: '',
    type: '',
    amount: '',
    dueDate: '',
    status: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // auto-populate userID (or dev fallback)
  useEffect(() => {
    const id = user && (user._id || user.id || user.userID)
      ? (user._id || user.id || user.userID)
      : 'dev-user-id-123';
    setLiability(prev => ({ ...prev, userID: id }));
  }, [user]);

  // fetch next liabilityID
  useEffect(() => {
    const fetchLatestLiabilityID = async () => {
      try {
        const response = await axios.get('http://localhost:5559/liability');
        const list = response.data.data || response.data;
        if (list.length === 0) {
          setLiability(prev => ({ ...prev, liabilityID: 'LIABILITY001' }));
        } else {
          const latest = list.reduce((a, b) => {
            const na = parseInt(a.liabilityID.replace('LIABILITY',''))||0;
            const nb = parseInt(b.liabilityID.replace('LIABILITY',''))||0;
            return nb > na ? b : a;
          });
          const num = parseInt(latest.liabilityID.replace('LIABILITY','')) || 0;
          const next = `LIABILITY${String(num+1).padStart(3,'0')}`;
          setLiability(prev => ({ ...prev, liabilityID: next }));
        }
      } catch {
        const ts = Date.now().toString().slice(-3);
        setLiability(prev => ({ ...prev, liabilityID: `LIABILITY${ts}` }));
      }
    };
    fetchLatestLiabilityID();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!liability.liabilityName.trim()) newErrors.liabilityName = 'Name is required';
    if (!liability.type)                  newErrors.type = 'Type is required';
    if (!liability.amount || liability.amount <= 0)
      newErrors.amount = 'Amount must be > 0';
    if (!liability.dueDate)               newErrors.dueDate = 'Due date is required';
    if (!liability.status)                newErrors.status = 'Status is required';
    if (!liability.description.trim())    newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'liabilityID' || name === 'userID') return; // read-only
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLiability(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5559/liability', liability);
      navigate('/liabilities');
    } catch {
      setError('Failed to create liability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem]">
          <h2 className="text-3xl font-bold text-center mb-6">Create Liability</h2>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* hidden userID */}
            <input type="hidden" name="userID" value={liability.userID} />

            {/* Liability ID */}
            <div>
              <label className="block mb-1 text-sm font-medium">Liability ID</label>
              <input
                type="text"
                name="liabilityID"
                value={liability.liabilityID}
                readOnly
                className="p-3 border border-gray-300 rounded w-full bg-gray-50"
              />
            </div>

            {/* Liability Name */}
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                type="text"
                name="liabilityName"
                value={liability.liabilityName}
                onChange={handleChange}
                className={`p-3 border ${errors.liabilityName ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.liabilityName && (
                <p className="text-red-500 text-xs mt-1">{errors.liabilityName}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block mb-1 text-sm font-medium">Type</label>
              <select
                name="type"
                value={liability.type}
                onChange={handleChange}
                className={`p-3 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              >
                <option value="">Select Type</option>
                <option value="Mortgage">Mortgage</option>
                <option value="Loan">Loan</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Amount */}
            <div>
              <label className="block mb-1 text-sm font-medium">Amount</label>
              <div className={`flex items-center border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded`}>
                <span className="px-3 bg-gray-100 text-gray-500">Rs.</span>
                <input
                  type="number"
                  name="amount"
                  value={liability.amount}
                  onChange={handleChange}
                  className="p-3 w-full outline-none"
                  onKeyDown={e => ['e','E','-','.'].includes(e.key) && e.preventDefault()}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-1 text-sm font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={liability.dueDate}
                onChange={handleChange}
                className={`p-3 border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                name="status"
                value={liability.status}
                onChange={handleChange}
                className={`p-3 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={liability.description}
                onChange={handleChange}
                className={`p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full h-24`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mt-4"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default CreateLiability;
