import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const CreateAsset = () => {
    const navigate = useNavigate();
    const [asset, setAsset] = useState({
        assetID: '',
        name: '',
        type: '',
        value: '',
        location: {
            number: '',
            street: '',
            city: '',
            country: '',
            postalCode: '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setAsset((prev) => ({
                ...prev,
                location: { ...prev.location, [field]: value },
            }));
        } else {
            setAsset((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:5559/asset', asset);
            navigate('/asset');
        } catch (error) {
            setError('Failed to create asset. Please try again.');
            console.error('Error creating asset:', error);
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
                            <input type='text' name='assetID' placeholder='Asset ID' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='text' name='name' placeholder='Asset Name' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='text' name='type' placeholder='Type' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='number' name='value' placeholder='Value' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />

                            {/* Location Fields */}
                            <input type='text' name='location.number' placeholder='Location Number' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='text' name='location.street' placeholder='Street' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='text' name='location.city' placeholder='City' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='text' name='location.country' placeholder='Country' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                            <input type='text' name='location.postalCode' placeholder='Postal Code' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
                        </div>

                        <button type='submit' className='mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all' disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </Dashboard>
    );
};

export default CreateAsset;