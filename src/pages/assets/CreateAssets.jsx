// src/pages/asset/CreateAsset.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const CreateAsset = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [asset, setAsset] = useState({
    userID: '',
    assetID: '',
    assetName: '',
    assetValue: '',
    category: '',
    changeType: '',
    percentage: '',
    amount: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // auto-populate userID (or dev fallback)
  useEffect(() => {
    const id = user && (user._id || user.id || user.userID)
      ? (user._id || user.id || user.userID)
      : 'dev-user-id-123';
    setAsset(prev => ({ ...prev, userID: id }));
  }, [user]);

  // fetch next AssetID as before...
  useEffect(() => {
    const fetchLatestAssetID = async () => {
      try {
        const res = await axios.get('http://localhost:5559/asset');
        const assets = res.data.data || res.data;
        if (assets.length === 0) {
          setAsset(prev => ({ ...prev, assetID: 'ASSET001' }));
        } else {
          const latest = assets.reduce((a, b) => {
            const na = parseInt(a.assetID.replace('ASSET',''))||0;
            const nb = parseInt(b.assetID.replace('ASSET',''))||0;
            return nb > na ? b : a;
          });
          const num = parseInt(latest.assetID.replace('ASSET','')) || 0;
          const next = num + 1;
          setAsset(prev => ({ 
            ...prev, 
            assetID: `ASSET${String(next).padStart(3,'0')}` 
          }));
        }
      } catch {
        const ts = new Date().getTime();
        setAsset(prev => ({ 
          ...prev, 
          assetID: `ASSET${String(ts).slice(-3)}` 
        }));
      }
    };
    fetchLatestAssetID();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'userID':
        return value ? '' : 'User ID is required.';
      case 'assetName':
        return value.trim() ? '' : 'Asset name is required.';
      case 'assetValue':
        if (!value) return 'Asset value is required.';
        if (parseFloat(value) <= 0) return 'Asset value must be positive.';
        return '';
      case 'category':
        return value ? '' : 'Category is required.';
      case 'changeType':
        return value ? '' : 'Change type is required.';
      case 'percentage':
        if (!value) return 'Percentage is required.';
        if (parseFloat(value) < 0 || parseFloat(value) > 100) return 'Must be 0–100.';
        return '';
      case 'date':
        return value ? '' : 'Date is required.';
      default:
        return '';
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'assetID' || name === 'amount') return;
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  // recalc amount when value/percentage change
  useEffect(() => {
    const v = parseFloat(asset.assetValue);
    const p = parseFloat(asset.percentage);
    if (!isNaN(v) && !isNaN(p)) {
      setAsset(prev => ({ 
        ...prev, 
        amount: ((v * p) / 100).toFixed(2) 
      }));
    }
  }, [asset.assetValue, asset.percentage]);

  const validateForm = () => {
    const newErrs = {};
    Object.entries(asset).forEach(([k, v]) => {
      if (k === 'assetID' || k === 'amount') return;
      const err = validateField(k, v);
      if (err) newErrs[k] = err;
    });
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5559/asset', asset);
      navigate('/assets');
    } catch {
      setError('Failed to create asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem]">
          <h2 className="text-3xl font-bold text-center mb-6">Create Asset</h2>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* hidden userID */}
            <input type="hidden" name="userID" value={asset.userID} />

            {/* Asset ID (read-only) */}
            <div>
              <label className="block mb-1">Asset ID</label>
              <input
                type="text"
                name="assetID"
                value={asset.assetID}
                readOnly
                className="p-3 border border-gray-300 rounded w-full bg-gray-50"
              />
            </div>

            {/* Asset Name */}
            <div>
              <label className="block mb-1">Asset Name</label>
              <input
                type="text"
                name="assetName"
                placeholder="Enter Asset Name"
                value={asset.assetName}
                onChange={handleChange}
                className={`p-3 border ${errors.assetName ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.assetName && <p className="text-red-500 text-sm mt-1">{errors.assetName}</p>}
            </div>

            {/* Asset Value */}
            <div>
              <label className="block mb-1">Asset Value (Rs.)</label>
              <input
                type="number"
                name="assetValue"
                placeholder="Enter Asset Value"
                value={asset.assetValue}
                onChange={handleChange}
                className={`p-3 border ${errors.assetValue ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.assetValue && <p className="text-red-500 text-sm mt-1">{errors.assetValue}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="category"
                value={asset.category}
                onChange={handleChange}
                className={`p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              >
                <option value="">Select Category</option>
                <option value="Current">Current</option>
                <option value="Non-Current">Non-Current</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Change Type */}
            <div>
              <label className="block mb-1">Change Type</label>
              <select
                name="changeType"
                value={asset.changeType}
                onChange={handleChange}
                className={`p-3 border ${errors.changeType ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              >
                <option value="">Select Change Type</option>
                <option value="Increase">Increase</option>
                <option value="Decrease">Decrease</option>
              </select>
              {errors.changeType && <p className="text-red-500 text-sm mt-1">{errors.changeType}</p>}
            </div>

            {/* Percentage */}
            <div>
              <label className="block mb-1">Percentage (%)</label>
              <input
                type="number"
                name="percentage"
                placeholder="Enter Percentage"
                value={asset.percentage}
                onChange={handleChange}
                className={`p-3 border ${errors.percentage ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>}
            </div>

            {/* Calculated Amount */}
            <div>
              <label className="block mb-1">Amount (Rs.)</label>
              <input
                type="number"
                name="amount"
                value={asset.amount}
                readOnly
                className="p-3 border border-gray-300 rounded w-full bg-gray-50"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={asset.date}
                onChange={handleChange}
                className={`p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 mt-4"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default CreateAsset;
