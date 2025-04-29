import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const CreateLiability = () => {
    const navigate = useNavigate();
    const [liability, setLiability] = useState({
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

    useEffect(() => {
        const fetchLatestLiabilityID = async () => {
            try {
                const response = await axios.get('http://localhost:5559/liability');
                const liabilities = response.data.data || response.data;

                if (liabilities.length === 0) {
                    setLiability(prev => ({ ...prev, liabilityID: 'LIABILITY001' }));
                } else {
                    const latestLiability = liabilities.reduce((latest, current) => {
                        const latestNum = parseInt(latest.liabilityID.replace('LIABILITY', ''));
                        const currentNum = parseInt(current.liabilityID.replace('LIABILITY', ''));
                        return currentNum > latestNum ? current : latest;
                    });

                    const latestNum = parseInt(latestLiability.liabilityID.replace('LIABILITY', ''));
                    const nextNum = latestNum + 1;
                    const nextLiabilityID = `LIABILITY${String(nextNum).padStart(3, '0')}`;

                    setLiability(prev => ({ ...prev, liabilityID: nextLiabilityID }));
                }
            } catch (error) {
                console.error('Error fetching latest Liability ID:', error);
                const timestamp = new Date().getTime();
                const fallbackID = `LIABILITY${String(timestamp).slice(-3)}`;
                setLiability(prev => ({ ...prev, liabilityID: fallbackID }));
            }
        };

        fetchLatestLiabilityID();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        if (!liability.liabilityName.trim()) {
            newErrors.liabilityName = 'Liability name is required';
        }

        if (!liability.type) {
            newErrors.type = 'Type is required';
        }

        if (!liability.amount || liability.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!liability.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        if (!liability.status) {
            newErrors.status = 'Status is required';
        }

        if (!liability.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'liabilityID') return;
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        setLiability((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:5559/liability', liability, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate('/liabilities');
        } catch (error) {
            setError('Failed to create liability. Please try again.');
            console.error('Error creating liability:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
                    <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Create Liability</h2>
                    {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Liability ID</label>
                                <input 
                                    type='text' 
                                    name='liabilityID' 
                                    value={liability.liabilityID}
                                    className='p-3 border border-gray-300 rounded w-full bg-gray-50' 
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Liability Name</label>
                                <input 
                                    type='text' 
                                    name='liabilityName' 
                                    placeholder='Enter Liability Name' 
                                    className={`p-3 border ${errors.liabilityName ? 'border-red-500' : 'border-gray-300'} rounded w-full`} 
                                    onChange={handleChange} 
                                    value={liability.liabilityName}
                                />
                                {errors.liabilityName && <p className="text-red-500 text-xs mt-1">{errors.liabilityName}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Type</label>
                                <select
                                    name="type"
                                    className={`p-3 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={liability.type}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Mortgage">Mortgage</option>
                                    <option value="Loan">Loan</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Amount</label>
                                <div className={`flex items-center border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded w-full overflow-hidden`}>
                                    <span className="px-3 text-gray-500 bg-gray-100">Rs.</span>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        placeholder="Enter Amount" 
                                        className="p-3 w-full outline-none" 
                                        onChange={handleChange} 
                                        value={liability.amount}
                                        onKeyDown={(e) => {
                                            if (['e', 'E', '-', '.'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                                <input 
                                    type='date' 
                                    name='dueDate' 
                                    placeholder='Select Due Date' 
                                    className={`p-3 border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded w-full`} 
                                    onChange={handleChange} 
                                    value={liability.dueDate}
                                />
                                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                                <select
                                    name="status"
                                    className={`p-3 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={liability.status}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Paid">Paid</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                            <textarea 
                                name='description' 
                                placeholder='Enter Liability Description' 
                                className={`p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full h-24 resize-none`} 
                                onChange={handleChange} 
                                value={liability.description}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <button 
                            type='submit' 
                            className='mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all' 
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

export default CreateLiability;
