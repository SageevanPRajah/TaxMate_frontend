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
        creditor: ''
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
                            <input 
                                type='text' 
                                name='liabilityID' 
                                placeholder='Liability ID' 
                                value={liability.liabilityID}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type='text' 
                                name='liabilityName' 
                                placeholder='Liability Name' 
                                value={liability.liabilityName}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            
                            {/* Type Dropdown */}
                            <select
                                name="type"
                                className="p-3 border border-gray-300 rounded"
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

                            <input 
                                type='text' 
                                name='amount' 
                                placeholder='Amount' 
                                value={liability.amount}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            
                            <input 
                                type='date' 
                                name='dueDate' 
                                placeholder='Due Date' 
                                value={liability.dueDate}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            
                            {/* Status Dropdown */}
                            <select
                                name="status"
                                className="p-3 border border-gray-300 rounded"
                                onChange={handleChange}
                                value={liability.status}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                            </select>

                            <input 
                                type='text' 
                                name='creditor' 
                                placeholder='Creditor Name' 
                                value={liability.creditor}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <button 
                            type='submit' 
                            className='mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all' 
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </form>
                </div>
            </div>
        </Dashboard>
    );
};

export default EditLiabilities;
