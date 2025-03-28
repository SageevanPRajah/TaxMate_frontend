import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const EditAssets = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [asset, setAsset] = useState({
        assetID: '',
        assetName: '',
        assetValue: '',
        category: '',
        changeType: '',
        percentage: '',
        amount: '',
        date: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Format date to yyyy-MM-dd for HTML date input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Fetch existing asset data
    useEffect(() => {
        setLoading(true);
        const fetchAsset = async () => {
            try {
                const response = await axios.get(`http://localhost:5559/asset/${id}`);
                const assetData = response.data;
                // Format the date for the input
                setAsset({
                    ...assetData,
                    date: formatDateForInput(assetData.date)
                });
            } catch (error) {
                console.error('Error fetching asset:', error);
                setError('Failed to fetch asset details.');
            } finally {
                setLoading(false);
            }
        };
        fetchAsset();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsset((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(`http://localhost:5559/asset/${id}`, asset);
            navigate('/assets');
        } catch (error) {
            setError('Failed to update asset. Please try again.');
            console.error('Error updating asset:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
                    <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Edit Asset</h2>
                    {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 gap-4'>
                            <input 
                                type='text' 
                                name='assetID' 
                                placeholder='Asset ID' 
                                value={asset.assetID || ''}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type='text' 
                                name='assetName' 
                                placeholder='Asset Name' 
                                value={asset.assetName || ''}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type='text' 
                                name='assetValue' 
                                placeholder='Asset Value' 
                                value={asset.assetValue || ''}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            
                            {/* Category Dropdown */}
                            <select
                                name="category"
                                className="p-3 border border-gray-300 rounded"
                                onChange={handleChange}
                                value={asset.category || ''}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Current">Current</option>
                                <option value="Non-Current">Non-Current</option>
                            </select>

                            {/* Change Type Dropdown */}
                            <select
                                name="changeType"
                                className="p-3 border border-gray-300 rounded"
                                onChange={handleChange}
                                value={asset.changeType || ''}
                                required
                            >
                                <option value="">Select Change Type</option>
                                <option value="Increase">Increase</option>
                                <option value="Decrease">Decrease</option>
                            </select>

                            <input 
                                type='text' 
                                name='percentage' 
                                placeholder='Percentage' 
                                value={asset.percentage || ''}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type='text' 
                                name='amount' 
                                placeholder='Amount' 
                                value={asset.amount || ''}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type='date' 
                                name='date' 
                                placeholder='Date' 
                                value={asset.date || ''}
                                className='p-3 border border-gray-300 rounded' 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <button 
                            type='submit' 
                            className='mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all' 
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Asset'}
                        </button>
                    </form>
                </div>
            </div>
        </Dashboard>
    );
};

export default EditAssets;