import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const EditLiabilities = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [liability, setLiability] = useState({
        liabilityID: '',
        name: '',
        type: '',
        amount: '',
        dueDate: '',
        address: {
            number: '',
            street: '',
            city: '',
            country: '',
            postalCode: '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch existing liability data
    useEffect(() => {
        const fetchLiability = async () => {
            try {
                const response = await axios.get(`http://localhost:5559/liability/${id}`);
                setLiability(response.data);
            } catch (error) {
                setError('Failed to fetch liability data.');
                console.error('Error fetching liability:', error);
            }
        };
        fetchLiability();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setLiability((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setLiability((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(`http://localhost:5559/liability/${id}`, liability);
            navigate('/liabilities');
        } catch (error) {
            setError('Failed to update liability.');
            console.error('Error updating liability:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Liability</h2>
                    {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <input type="text" name="liabilityID" placeholder="Liability ID" className="p-3 border border-gray-300 rounded" value={liability.liabilityID} onChange={handleChange} required />
                            <input type="text" name="name" placeholder="Name" className="p-3 border border-gray-300 rounded" value={liability.name} onChange={handleChange} required />
                            <input type="text" name="type" placeholder="Type" className="p-3 border border-gray-300 rounded" value={liability.type} onChange={handleChange} required />
                            <input type="number" name="amount" placeholder="Amount" className="p-3 border border-gray-300 rounded" value={liability.amount} onChange={handleChange} required />
                            <input type="date" name="dueDate" placeholder="Due Date" className="p-3 border border-gray-300 rounded" value={liability.dueDate} onChange={handleChange} required />

                            {/* Address Fields */}
                            {Object.keys(liability.address).map((field) => (
                                <input key={field} type="text" name={`address.${field}`} placeholder={field} className="p-3 border border-gray-300 rounded" value={liability.address[field]} onChange={handleChange} required />
                            ))}
                        </div>

                        <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Liability'}
                        </button>
                    </form>
                </div>
            </div>
        </Dashboard>
    );
};

export default EditLiabilities;