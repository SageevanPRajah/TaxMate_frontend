import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const CreateAsset = () => {
    const navigate = useNavigate();
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

    // Fetch the latest asset ID when component mounts
    useEffect(() => {
        const fetchLatestAssetID = async () => {
            try {
                const response = await axios.get('http://localhost:5559/asset');
                const assets = response.data.data || response.data;
                
                if (assets.length === 0) {
                    // If no assets exist, start with Asset001
                    setAsset(prev => ({ ...prev, assetID: 'ASSET001' }));
                } else {
                    // Find the highest asset ID number
                    const latestAsset = assets.reduce((latest, current) => {
                        const latestNum = parseInt(latest.assetID.replace('ASSET', ''));
                        const currentNum = parseInt(current.assetID.replace('ASSET', ''));
                        return currentNum > latestNum ? current : latest;
                    });

                    const latestNum = parseInt(latestAsset.assetID.replace('ASSET', ''));
                    const nextNum = latestNum + 1;
                    const nextAssetID = `Asset${String(nextNum).padStart(3, '0')}`;
                    
                    setAsset(prev => ({ ...prev, assetID: nextAssetID }));
                }
            } catch (error) {
                console.error('Error fetching latest ASSET ID:', error);
                // Fallback to a timestamp-based ID if server connection fails
                const timestamp = new Date().getTime();
                const fallbackID = `ASSET${String(timestamp).slice(-3)}`;
                setAsset(prev => ({ ...prev, assetID: fallbackID }));
                // Don't show error to user since we have a fallback
            }
        };

        fetchLatestAssetID();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Asset ID is read-only, so we don't need validation for it
        if (name === 'assetID') return;
        
        // Percentage validation
        if (name === 'percentage') {
            const numValue = parseFloat(value);
            if (numValue < 0 || numValue > 100) return;
            setAsset(prev => ({ ...prev, [name]: value }));
            return;
        }
        
        // Prevent negative numbers for specific fields
        if (name === 'assetValue') {
            if (value < 0) return;
        }

        setAsset((prev) => ({ ...prev, [name]: value }));
    };

    // Calculate amount when assetValue or percentage changes
    useEffect(() => {
        if (asset.assetValue && asset.percentage) {
            const value = parseFloat(asset.assetValue);
            const percentage = parseFloat(asset.percentage);
            
            if (!isNaN(value) && !isNaN(percentage) && value >= 0 && percentage >= 0) {
                const calculatedAmount = (value * percentage) / 100;
                setAsset(prev => ({
                    ...prev,
                    amount: calculatedAmount.toFixed(2)
                }));
            }
        }
    }, [asset.assetValue, asset.percentage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate all required fields
        if (!asset.assetID || !asset.assetName || !asset.assetValue || !asset.category || 
            !asset.changeType || !asset.percentage || !asset.date) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        // Validate numeric values
        const assetValue = parseFloat(asset.assetValue);
        const percentage = parseFloat(asset.percentage);
        
        if (isNaN(assetValue) || isNaN(percentage)) {
            setError('Asset Value and Percentage must be valid numbers.');
            setLoading(false);
            return;
        }

        if (assetValue < 0 || percentage < 0 || percentage > 100) {
            setError('Asset Value cannot be negative and Percentage must be between 0 and 100.');
            setLoading(false);
            return;
        }

        // Prepare the data to be sent
        const assetData = {
            ...asset,
            assetValue: assetValue.toString(),
            percentage: percentage.toString(),
            amount: (assetValue * percentage / 100).toFixed(2)
        };

        try {
            console.log('Sending data:', assetData); // Debug log
            const response = await axios.post('http://localhost:5559/asset', assetData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response:', response.data); // Debug log
            navigate('/assets');
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message); // Detailed error log
            if (error.code === 'ECONNREFUSED') {
                setError('Cannot connect to the server. Please check if the server is running.');
            } else {
                setError(error.response?.data?.message || 'Failed to create asset. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
                    <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Create Asset</h2>
                    {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asset ID</label>
                                <div className="relative">
                                    <input 
                                        type='text'
                                        name='assetID' 
                                        value={asset.assetID}
                                        className='p-3 border border-gray-300 rounded w-full bg-gray-50' 
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asset Name</label>
                                <input 
                                    type='text' 
                                    name='assetName' 
                                    placeholder='Enter Asset Name' 
                                    className='p-3 border border-gray-300 rounded w-full' 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asset Value</label>
                                <div className="flex items-center border border-gray-300 rounded w-full overflow-hidden">
                                    <span className="px-3 text-gray-500 bg-gray-100">Rs.</span>
                                    <input 
                                        type="number" 
                                        name="assetValue" 
                                        placeholder="Enter Asset Value" 
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
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                                <select
                                    name="category"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    value={asset.category}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Current">Current</option>
                                    <option value="Non-Current">Non-Current</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Change Type</label>
                                <select
                                    name="changeType"
                                    className="p-3 border border-gray-300 rounded w-full"
                                    onChange={handleChange}
                                    value={asset.changeType}
                                    required
                                >
                                    <option value="">Select Change Type</option>
                                    <option value="Increase">Increase</option>
                                    <option value="Decrease">Decrease</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Percentage</label>
                                <div className="flex items-center border border-gray-300 rounded w-full overflow-hidden">
                                    <input 
                                        type="number" 
                                        name="percentage" 
                                        placeholder="Enter percentage (0-100)" 
                                        className="p-3 w-full outline-none" 
                                        onChange={handleChange} 
                                        required 
                                        min="0" 
                                        max="100"
                                        step="1"
                                        value={asset.percentage}
                                        onKeyDown={(e) => {
                                            if (['-', 'e', '.', '+'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className="px-3 text-gray-500 bg-gray-100">%</span>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Amount</label>
                                <div className="flex items-center border border-gray-300 rounded w-full bg-gray-50 overflow-hidden">
                                    <span className="px-3 text-gray-500 bg-gray-100">Rs.</span>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        placeholder="Calculated Amount" 
                                        className="p-3 w-full bg-gray-50 outline-none" 
                                        value={asset.amount}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Date</label>
                                <input 
                                    type='date' 
                                    name='date' 
                                    placeholder='Select Date' 
                                    className='p-3 border border-gray-300 rounded w-full' 
                                    onChange={handleChange} 
                                    value={asset.date}
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type='submit' 
                            className='mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all' 
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

export default CreateAsset;
