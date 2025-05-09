import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard.jsx";
import { useAuth } from '../../hooks/useAuth.js';

const CreateIncome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [income, setIncome] = useState({
    userID: '',
    incomeName: '',
    incomeType: '',
    date: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // auto-populate userID (or use dev fallback)
  useEffect(() => {
    const id = user && (user._id || user.id || user.userID)
      ? (user._id || user.id || user.userID)
      : 'dev-user-id-123';
    setIncome(prev => ({ ...prev, userID: id }));
  }, [user]);

  const validate = () => {
    const errs = {};

    if (!income.incomeName || income.incomeName.length < 3) {
      errs.incomeName = "Income Name must be at least 3 characters.";
    } else if (/^\d+$/.test(income.incomeName)) {
      errs.incomeName = "Income Name cannot be only numbers.";
    }

    if (!income.incomeType) {
      errs.incomeType = "Please select an income type.";
    }

    if (!income.date) {
      errs.date = "Please select a date.";
    } else if (new Date(income.date) > new Date()) {
      errs.date = "Date cannot be in the future.";
    }

    if (!income.amount || Number(income.amount) <= 0) {
      errs.amount = "Amount must be a positive number.";
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

    const errs = validate();
    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5559/income", income);
      navigate("/income");
    } catch {
      setError("Failed to create income. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem]">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create Income
          </h2>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">

              {/* Income Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Income Name
                </label>
                <input
                  type="text"
                  name="incomeName"
                  className="p-3 border border-gray-300 rounded w-full"
                  value={income.incomeName}
                  onChange={handleChange}
                  required
                />
                {validationErrors.incomeName && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.incomeName}
                  </p>
                )}
              </div>

              {/* Income Type */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Income Type
                </label>
                <select
                  name="incomeType"
                  className="p-3 border border-gray-300 rounded w-full"
                  value={income.incomeType}
                  onChange={handleChange}
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
                  <p className="text-red-500 text-sm">
                    {validationErrors.incomeType}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="p-3 border border-gray-300 rounded w-full"
                  value={income.date}
                  onChange={handleChange}
                  required
                />
                {validationErrors.date && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.date}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="flex items-center border border-gray-300 rounded px-3">
                  <span className="text-gray-500 mr-1">Rs.</span>
                  <input
                    type="number"
                    name="amount"
                    className="w-full py-2 outline-none"
                    value={income.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                {validationErrors.amount && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.amount}
                  </p>
                )}
              </div>

            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default CreateIncome;
