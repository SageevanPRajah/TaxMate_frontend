import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const EditAssets = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [asset, setAsset] = useState({
        assetID: '',
        name: '',
        category: '',
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

    // Fetch existing asset data
    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const response = await axios.get(`http://localhost:5559/asset/${id}`);
                setAsset(response.data);
            } catch (error) {
                setError('Failed to fetch asset data.');
                console.error('Error fetching asset:', error);
            }
        };
        fetchAsset();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('location.')) {
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
            await axios.put(`http://localhost:5559/asset/${id}`, asset);
            navigate('/assets');
        } catch (error) {
            setError('Failed to update asset.');
            console.error('Error updating asset:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Asset</h2>
                    {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <input type="text" name="assetID" placeholder="Asset ID" className="p-3 border border-gray-300 rounded" value={asset.assetID} onChange={handleChange} required />
                            <input type="text" name="name" placeholder="Asset Name" className="p-3 border border-gray-300 rounded" value={asset.name} onChange={handleChange} required />
                            <input type="text" name="category" placeholder="Category" className="p-3 border border-gray-300 rounded" value={asset.category} onChange={handleChange} required />
                            <input type="number" name="value" placeholder="Value" className="p-3 border border-gray-300 rounded" value={asset.value} onChange={handleChange} required />

                            {/* Location Fields */}
                            {Object.keys(asset.location).map((field) => (
                                <input key={field} type="text" name={`location.${field}`} placeholder={field} className="p-3 border border-gray-300 rounded" value={asset.location[field]} onChange={handleChange} required />
                            ))}
                        </div>

                        <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Asset'}
                        </button>
                    </form>
                </div>
            </div>
        </Dashboard>
    );
};

export default EditAssets;