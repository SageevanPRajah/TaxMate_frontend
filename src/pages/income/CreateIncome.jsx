import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard.jsx";

const CreateIncome = () => {
    const navigate = useNavigate();
    const [income, setIncome] = useState({
        incomeID: '',
        incomeName: '',
        incomeType: '',
        date: '',
        amount: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validate = () => {
        const errors = {};

        if (!/^[a-zA-Z0-9]{3,}$/.test(income.incomeID)) {
            errors.incomeID = "Income ID must be alphanumeric and at least 3 characters.";
        }

        if (!income.incomeName || income.incomeName.length < 3) {
            errors.incomeName = "Income Name must be at least 3 characters.";
        } else if (/^\d+$/.test(income.incomeName)) {
            errors.incomeName = "Income Name cannot be only numbers.";
        }

        if (!income.incomeType) {
            errors.incomeType = "Please select an income type.";
        }

        if (!income.date) {
            errors.date = "Please select a date.";
        } else if (new Date(income.date) > new Date()) {
            errors.date = "Date cannot be in the future.";
        }

        if (!income.amount || income.amount <= 0) {
            errors.amount = "Amount must be a positive number.";
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncome((prev) => ({ ...prev, [name]: value }));
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
            await axios.post("http://localhost:5559/income", income);
            navigate("/income");
        } catch (error) {
            setError("Failed to create income. Please try again.");
            console.error("Error creating income:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Create Income
                    </h2>
                    {error && (
                        <p className="text-red-500 text-center mb-3">{error}</p>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">

                            {/* Income ID */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">User ID</label>
                                <input
                                    type="text"
                                    name="incomeID"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    required
                                />
                                {validationErrors.incomeID && (
                                    <p className="text-red-500 text-sm">{validationErrors.incomeID}</p>
                                )}
                            </div>

                            {/* Income Name */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Income Name</label>
                                <input
                                    type="text"
                                    name="incomeName"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    required
                                />
                                {validationErrors.incomeName && (
                                    <p className="text-red-500 text-sm">{validationErrors.incomeName}</p>
                                )}
                            </div>

                            {/* Income Type */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Income Type</label>
                                <select
                                    name="incomeType"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    value={income.incomeType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Income Type</option>
                                    <option value="Employment">Employment Income</option>
                                    <option value="Business">Business Income</option>
                                    <option value="Investment">Investment Income</option>
                                    <option value="Others">Others</option>
                                </select>
                                {validationErrors.incomeType && (
                                    <p className="text-red-500 text-sm">{validationErrors.incomeType}</p>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    required
                                />
                                {validationErrors.date && (
                                    <p className="text-red-500 text-sm">{validationErrors.date}</p>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
                                <div className="flex items-center border border-gray-300 rounded px-3">
                                    <span className="text-gray-500 mr-1">Rs.</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Amount"
                                        className="w-full py-2 outline-none"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {validationErrors.amount && (
                                    <p className="text-red-500 text-sm">{validationErrors.amount}</p>
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
