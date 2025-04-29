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
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestAssetID = async () => {
            try {
                const response = await axios.get('http://localhost:5559/asset');
                const assets = response.data.data || response.data;

                if (assets.length === 0) {
                    setAsset(prev => ({ ...prev, assetID: 'ASSET001' }));
                } else {
                    const latestAsset = assets.reduce((latest, current) => {
                        const latestNum = parseInt(latest.assetID.replace('ASSET', '')) || 0;
                        const currentNum = parseInt(current.assetID.replace('ASSET', '')) || 0;
                        return currentNum > latestNum ? current : latest;
                    });

                    const latestNum = parseInt(latestAsset.assetID.replace('ASSET', '')) || 0;
                    const nextNum = latestNum + 1;
                    const nextAssetID = `ASSET${String(nextNum).padStart(3, '0')}`;

                    setAsset(prev => ({ ...prev, assetID: nextAssetID }));
                }
            } catch (error) {
                console.error('Error fetching latest Asset ID:', error);
                const timestamp = new Date().getTime();
                const fallbackID = `ASSET${String(timestamp).slice(-3)}`;
                setAsset(prev => ({ ...prev, assetID: fallbackID }));
            }
        };

        fetchLatestAssetID();
    }, []);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'assetName':
                if (!value.trim()) error = 'Asset name is required';
                break;
            case 'assetValue':
                if (!value) error = 'Asset value is required';
                else if (parseFloat(value) <= 0) error = 'Asset value must be positive';
                break;
            case 'category':
                if (!value) error = 'Category is required';
                break;
            case 'changeType':
                if (!value) error = 'Change type is required';
                break;
            case 'percentage':
                if (!value) error = 'Percentage is required';
                else if (parseFloat(value) < 0 || parseFloat(value) > 100) error = 'Percentage must be between 0-100';
                break;
            case 'date':
                if (!value) error = 'Date is required';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'assetID') return;
        
        // Validate field in real-time
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        
        setAsset(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (asset.assetValue && asset.percentage) {
            const value = parseFloat(asset.assetValue);
            const percentage = parseFloat(asset.percentage);

            if (!isNaN(value) && !isNaN(percentage)) {
                const calculatedAmount = (value * percentage) / 100;
                setAsset(prev => ({
                    ...prev,
                    amount: calculatedAmount.toFixed(2)
                }));
            }
        }
    }, [asset.assetValue, asset.percentage]);

    const validateForm = () => {
        const newErrors = {};
        Object.keys(asset).forEach(key => {
            if (key !== 'assetID' && key !== 'amount') {
                const error = validateField(key, asset[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:5559/asset', asset, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate('/assets');
        } catch (error) {
            console.error('Error creating asset:', error);
            setError('Failed to create asset. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem]'>
                    <h2 className='text-3xl font-bold text-center mb-6'>Create Asset</h2>
                    {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label className='block mb-1'>Asset ID</label>
                                <input 
                                    type='text'
                                    name='assetID'
                                    value={asset.assetID}
                                    className='p-3 border border-gray-300 rounded w-full bg-gray-50'
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className='block mb-1'>Asset Name</label>
                                <input 
                                    type='text'
                                    name='assetName'
                                    placeholder='Enter Asset Name'
                                    className={`p-3 border ${errors.assetName ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.assetName}
                                />
                                {errors.assetName && <p className="text-red-500 text-sm mt-1">{errors.assetName}</p>}
                            </div>

                            <div>
                                <label className='block mb-1'>Asset Value (Rs.)</label>
                                <input 
                                    type='number'
                                    name='assetValue'
                                    placeholder='Enter Asset Value'
                                    className={`p-3 border ${errors.assetValue ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.assetValue}
                                />
                                {errors.assetValue && <p className="text-red-500 text-sm mt-1">{errors.assetValue}</p>}
                            </div>

                            <div>
                                <label className='block mb-1'>Category</label>
                                <select
                                    name="category"
                                    className={`p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.category}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Current">Current</option>
                                    <option value="Non-Current">Non-Current</option>
                                </select>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className='block mb-1'>Change Type</label>
                                <select
                                    name="changeType"
                                    className={`p-3 border ${errors.changeType ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.changeType}
                                >
                                    <option value="">Select Change Type</option>
                                    <option value="Increase">Increase</option>
                                    <option value="Decrease">Decrease</option>
                                </select>
                                {errors.changeType && <p className="text-red-500 text-sm mt-1">{errors.changeType}</p>}
                            </div>

                            <div>
                                <label className='block mb-1'>Percentage (%)</label>
                                <input 
                                    type="number"
                                    name="percentage"
                                    placeholder="Enter Percentage"
                                    className={`p-3 border ${errors.percentage ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.percentage}
                                />
                                {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>}
                            </div>

                            <div>
                                <label className='block mb-1'>Amount (Rs.)</label>
                                <input 
                                    type="number"
                                    name="amount"
                                    value={asset.amount}
                                    className="p-3 border border-gray-300 rounded w-full bg-gray-50"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className='block mb-1'>Date</label>
                                <input 
                                    type='date'
                                    name='date'
                                    className={`p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.date}
                                />
                            </div>
                        </div>

                        <button 
                            type='submit'
                            className='mt-4 w-full bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700'
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
