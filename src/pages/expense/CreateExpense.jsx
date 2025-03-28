import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const CreateExpense = () => {
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    expenseID: '',
    expenseName: '',
    expenseCategory: '',
    expenseAmount: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!/^[a-zA-Z0-9]{3,}$/.test(expense.expenseID)) {
      errors.expenseID = "Expense ID must be alphanumeric and at least 3 characters.";
    }

    if (!expense.expenseName || expense.expenseName.length < 3) {
      errors.expenseName = "Expense Name must be at least 3 characters.";
    }

    if (!expense.expenseCategory) {
      errors.expenseCategory = "Please select an expense category.";
    }

    if (!expense.expenseAmount || parseFloat(expense.expenseAmount) <= 0) {
      errors.expenseAmount = "Amount must be a positive number.";
    }

    if (!expense.date) {
      errors.date = "Please select a date.";
    } else if (new Date(expense.date) > new Date()) {
      errors.date = "Date cannot be in the future.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5559/expense', expense);
      navigate('/expense');
    } catch (error) {
      setError('Failed to create expense. Please try again.');
      console.error('Error creating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
          <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Create Expense</h2>
          {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 gap-4'>

              {/* Expense ID */}
              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700'>Expense ID</label>
                <input
                  type='text'
                  name='expenseID'
                  className='p-3 border border-gray-300 rounded w-full'
                  onChange={handleChange}
                  required
                />
                {validationErrors.expenseID && (
                  <p className='text-red-500 text-sm'>{validationErrors.expenseID}</p>
                )}
              </div>

              {/* Expense Name */}
              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700'>Expense Name</label>
                <input
                  type='text'
                  name='expenseName'
                  className='p-3 border border-gray-300 rounded w-full'
                  onChange={handleChange}
                  required
                />
                {validationErrors.expenseName && (
                  <p className='text-red-500 text-sm'>{validationErrors.expenseName}</p>
                )}
              </div>

              {/* Expense Category */}
              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700'>Expense Category</label>
                <select
                  name='expenseCategory'
                  className='p-3 border border-gray-300 rounded w-full'
                  value={expense.expenseCategory}
                  onChange={handleChange}
                  required>
                  <option value='' disabled>Select Expense Category</option>
                  <option value='Others'>Default</option>
                  <option value='Medical Expenses'>Medical Expenses</option>
                  <option value='Donation'>Donation</option>
                  <option value='Personal care'>Personal care</option>
                  <option value='Home appliances'>Home appliances</option>
                  <option value='Grocery'>Grocery</option>
                  <option value='Others'>Others</option>
                </select>
                {validationErrors.expenseCategory && (
                  <p className='text-red-500 text-sm'>{validationErrors.expenseCategory}</p>
                )}
              </div>

              {/* Expense Amount */}
              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700'>Expense Amount</label>
                <div className="flex items-center border border-gray-300 rounded px-3">
                  <span className="text-gray-500 mr-1">Rs.</span>
                  <input
                    type="number"
                    name="expenseAmount"
                    placeholder="500"
                    className="w-full py-2 outline-none"
                    onChange={handleChange}
                    required
                  />
                </div>
                {validationErrors.expenseAmount && (
                  <p className='text-red-500 text-sm'>{validationErrors.expenseAmount}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className='block mb-1 text-sm font-medium text-gray-700'>Date</label>
                <input
                  type='date'
                  name='date'
                  className='p-3 border border-gray-300 rounded w-full'
                  onChange={handleChange}
                  required
                />
                {validationErrors.date && (
                  <p className='text-red-500 text-sm'>{validationErrors.date}</p>
                )}
              </div>

            </div>

            <button
              type='submit'
              className='mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all'
              disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default CreateExpense;
