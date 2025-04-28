import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const EditLiabilities = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [liability, setLiability] = useState({
        liabilityID: '',
        liabilityName: '',
        type: '',
        amount: '',
        dueDate: '',
        status: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5559/liability/${id}`)
            .then((response) => {
                setLiability(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Error fetching liability details');
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLiability((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(`http://localhost:5559/liability/${id}`, liability);
            navigate('/liabilities');
        } catch (error) {
            setError('Failed to update liability. Please try again.');
            console.error('Error updating liability:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
                    <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Edit Liability</h2>
                    {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Liability ID</label>
                                <input 
                                    type='text' 
                                    name='liabilityID' 
                                    placeholder='Enter Liability ID' 
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
                                    value={liability.liabilityName}
                                    className='p-3 border border-gray-300 rounded w-full' 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Type</label>
                                <select
                                    name="type"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    value={liability.type}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Mortgage">Mortgage</option>
                                    <option value="Loan">Loan</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Amount</label>
                                <div className="flex items-center border border-gray-300 rounded w-full overflow-hidden">
                                    <span className="px-3 text-gray-500 bg-gray-100">Rs.</span>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        placeholder="Enter Amount" 
                                        value={liability.amount}
                                        className="p-3 w-full outline-none" 
                                        onChange={handleChange} 
                                        required 
                                        min="0" 
                                        step="1"
                                        onKeyDown={(e) => {
                                            if (['e', 'E', '-', '.'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                                <input 
                                    type='date' 
                                    name='dueDate' 
                                    placeholder='Select Due Date' 
                                    value={liability.dueDate}
                                    className='p-3 border border-gray-300 rounded w-full' 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                                <select
                                    name="status"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    value={liability.status}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>
                        </div>

                        <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                <textarea 
                                    name='description' 
                                    placeholder='Enter Liability Description' 
                                    value={liability.description}
                                    className='p-3 border border-gray-300 rounded w-full h-24 resize-none' 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                        <div className='flex gap-4 mt-6'>
                            <button 
                                type='submit' 
                                className='flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all' 
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Liability'}
                            </button>
                            <button 
                                type='button'
                                onClick={() => navigate('/liabilities')}
                                className='flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dashboard>
    );
};

export default EditLiabilities;
