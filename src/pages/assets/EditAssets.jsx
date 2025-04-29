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
        date: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const validateField = (name, value) => {
        const errors = {...formErrors};
        
        switch(name) {
            case 'assetName':
                if (!value.trim()) errors.assetName = 'Asset name is required';
                else delete errors.assetName;
                break;
            case 'assetValue':
                if (!value) errors.assetValue = 'Asset value is required';
                else if (isNaN(value) || parseFloat(value) < 0) errors.assetValue = 'Must be a positive number';
                else delete errors.assetValue;
                break;
            case 'category':
                if (!value) errors.category = 'Category is required';
                else delete errors.category;
                break;
            case 'changeType':
                if (!value) errors.changeType = 'Change type is required';
                else delete errors.changeType;
                break;
            case 'percentage':
                if (!value) errors.percentage = 'Percentage is required';
                else if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) 
                    errors.percentage = 'Must be between 0-100';
                else delete errors.percentage;
                break;
            case 'date':
                if (!value) errors.date = 'Date is required';
                else delete errors.date;
                break;
            default:
                break;
        }

        setFormErrors(errors);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        setLoading(true);
        const fetchAsset = async () => {
            try {
                const response = await axios.get(`http://localhost:5559/asset/${id}`);
                const assetData = response.data;
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'percentage') {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0 || numValue > 100) return;
        }
        
        if (name === 'assetValue') {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) return;
        }

        setAsset((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateForm = () => {
        const errors = {};
        if (!asset.assetName.trim()) errors.assetName = 'Asset name is required';
        if (!asset.assetValue) errors.assetValue = 'Asset value is required';
        if (!asset.category) errors.category = 'Category is required';
        if (!asset.changeType) errors.changeType = 'Change type is required';
        if (!asset.percentage) errors.percentage = 'Percentage is required';
        if (!asset.date) errors.date = 'Date is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
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

                    <form onSubmit={handleSubmit} noValidate>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asset ID</label>
                                <div className="relative">
                                    <input 
                                        type='text'
                                        name='assetID' 
                                        value={asset.assetID || ''}
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
                                    value={asset.assetName || ''}
                                    className={`p-3 border ${formErrors.assetName ? 'border-red-500' : 'border-gray-300'} rounded w-full`} 
                                    onChange={handleChange}
                                />
                                {formErrors.assetName && <p className="text-red-500 text-xs mt-1">{formErrors.assetName}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asset Value</label>
                                <div className="flex items-center border border-gray-300 rounded w-full overflow-hidden">
                                    <span className="px-3 text-gray-500 bg-gray-100">Rs.</span>
                                    <input 
                                        type="number" 
                                        name="assetValue" 
                                        placeholder="Enter Asset Value" 
                                        value={asset.assetValue || ''}
                                        className={`p-3 w-full outline-none ${formErrors.assetValue ? 'border-red-500' : ''}`} 
                                        onChange={handleChange}
                                    />
                                </div>
                                {formErrors.assetValue && <p className="text-red-500 text-xs mt-1">{formErrors.assetValue}</p>}
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                                <select
                                    name="category"
                                    className={`p-3 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.category || ''}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Current">Current</option>
                                    <option value="Non-Current">Non-Current</option>
                                </select>
                                {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Change Type</label>
                                <select
                                    name="changeType"
                                    className={`p-3 border ${formErrors.changeType ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                                    onChange={handleChange}
                                    value={asset.changeType || ''}
                                >
                                    <option value="">Select Change Type</option>
                                    <option value="Increase">Increase</option>
                                    <option value="Decrease">Decrease</option>
                                </select>
                                {formErrors.changeType && <p className="text-red-500 text-xs mt-1">{formErrors.changeType}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Percentage</label>
                                <div className="flex items-center border border-gray-300 rounded w-full overflow-hidden">
                                    <input 
                                        type="number" 
                                        name="percentage" 
                                        placeholder="Enter percentage (0-100)" 
                                        value={asset.percentage || ''}
                                        className="p-3 w-full outline-none" 
                                        onChange={handleChange} 
                                        required 
                                        min="0" 
                                        max="100"
                                        step="1"
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
                                        value={asset.amount || ''}
                                        className="p-3 w-full bg-gray-50 outline-none" 
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
                                    value={asset.date || ''}
                                    className='p-3 border border-gray-300 rounded w-full' 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className='flex gap-4 mt-6'>
                            <button 
                                type='submit' 
                                className='flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all' 
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Asset'}
                            </button>
                            <button 
                                type='button'
                                onClick={() => navigate('/assets')}
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

export default EditAssets;