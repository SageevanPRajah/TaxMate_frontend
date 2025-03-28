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
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Prevent negative numbers for specific fields
        if (name === 'assetValue' || name === 'percentage') {
            if (value < 0) return;
        }

        // Asset ID validation - only allow alphanumeric characters
        if (name === 'assetID') {
            const alphanumericRegex = /^[a-zA-Z0-9]*$/;
            if (!alphanumericRegex.test(value)) return;
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
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        // Additional validation before submission
        if (parseFloat(asset.assetValue) < 0 || parseFloat(asset.percentage) < 0) {
            setError('Asset Value and Percentage cannot be negative numbers.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5559/asset', asset, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate('/assets');
        } catch (error) {
            setError('Failed to create asset. Please try again.');
            console.error('Error creating asset:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setShowConfirmation(false);
    };

    return (
        <Dashboard>
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
                    <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Create Asset</h2>
                    {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

                    {!showConfirmation ? (
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 gap-4'>
                                <div className="relative">
                                    <input 
                                        type='text' 
                                        name='assetID' 
                                        placeholder='Asset ID (Alphanumeric only)' 
                                        className='p-3 border border-gray-300 rounded w-full' 
                                        onChange={handleChange} 
                                        value={asset.assetID}
                                        required 
                                        pattern="[a-zA-Z0-9]+"
                                        title="Only alphanumeric characters are allowed"
                                    />
                                    <span className="absolute right-3 top-3 text-gray-500 text-xs">Required</span>
                                </div>

                                <input 
                                    type='text' 
                                    name='assetName' 
                                    placeholder='Asset Name' 
                                    className='p-3 border border-gray-300 rounded' 
                                    onChange={handleChange} 
                                    required 
                                />

                                <div className="relative">
                                    <input 
                                        type='number' 
                                        name='assetValue' 
                                        placeholder='Asset Value' 
                                        className='p-3 border border-gray-300 rounded w-full' 
                                        onChange={handleChange} 
                                        required 
                                        min="0"
                                        step="0.01"
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className="absolute right-3 top-3 text-gray-500">Rs.</span>
                                </div>
                                
                                {/* Category Dropdown */}
                                <select
                                    name="category"
                                    className="p-3 border border-gray-300 rounded"
                                    onChange={handleChange}
                                    value={asset.category}
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
                                    value={asset.changeType}
                                    required
                                >
                                    <option value="">Select Change Type</option>
                                    <option value="Increase">Increase</option>
                                    <option value="Decrease">Decrease</option>
                                </select>

                                <div className="relative">
                                    <input 
                                        type='number' 
                                        name='percentage' 
                                        placeholder='Percentage' 
                                        className='p-3 border border-gray-300 rounded w-full' 
                                        onChange={handleChange} 
                                        required 
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                                </div>

                                <div className="relative">
                                    <input 
                                        type='number' 
                                        name='amount' 
                                        placeholder='Amount' 
                                        className='p-3 border border-gray-300 rounded w-full bg-gray-50' 
                                        value={asset.amount}
                                        readOnly
                                    />
                                    <span className="absolute right-3 top-3 text-gray-500">Rs.</span>
                                </div>

                                <input 
                                    type='date' 
                                    name='date' 
                                    placeholder='Date' 
                                    className='p-3 border border-gray-300 rounded' 
                                    onChange={handleChange} 
                                    value={asset.date}
                                    required 
                                />
                            </div>

                            <button 
                                type='submit' 
                                className='mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all' 
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    ) : (
                        <div className='p-6 bg-white rounded-lg'>
                            <h3 className='text-xl font-semibold mb-4 text-center text-gray-800'>Confirm Asset Details</h3>
                            <div className='space-y-3 text-sm border rounded-lg p-4 bg-gray-50'>
                                <p><span className='font-medium'>Asset ID:</span> {asset.assetID}</p>
                                <p><span className='font-medium'>Asset Name:</span> {asset.assetName}</p>
                                <p><span className='font-medium'>Asset Value:</span> Rs. {parseFloat(asset.assetValue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p><span className='font-medium'>Category:</span> {asset.category}</p>
                                <p><span className='font-medium'>Change Type:</span> {asset.changeType}</p>
                                <p><span className='font-medium'>Percentage:</span> {asset.percentage}%</p>
                                <p><span className='font-medium'>Calculated Amount:</span> Rs. {parseFloat(asset.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p><span className='font-medium'>Date:</span> {new Date(asset.date).toLocaleDateString()}</p>
                            </div>
                            <div className='flex gap-4 mt-6'>
                                <button
                                    onClick={handleConfirm}
                                    className='flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all'
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'OK'}
                                </button>
                                <button
                                    onClick={handleBack}
                                    className='flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all'
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dashboard>
    );
};

export default CreateAsset;
