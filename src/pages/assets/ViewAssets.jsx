import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';

const ViewAssets = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                console.log("Fetching asset with ID:", id);
                const response = await axios.get(`http://localhost:5559/asset/${id}`);
                console.log("Fetched asset:", response.data);
                setAsset(response.data);
            } catch (error) {
                console.error("Error fetching asset:", error);
                setError("Failed to fetch asset details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAsset();
    }, [id]);

    return (
        <Dashboard>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br ">
                <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-[35rem] backdrop-blur-lg border border-gray-300">
                    <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
                        Asset Details
                    </h2>

                    {loading ? (
                        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center font-medium">{error}</p>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-gray-50 shadow-md">
                                <p className="text-lg">
                                    <strong className="text-gray-700">Asset ID:</strong> {asset.assetID}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Name:</strong> {asset.name}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Category:</strong> {asset.category}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Value:</strong> ${asset.value}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Quantity:</strong> {asset.quantity}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-gray-50 shadow-md">
                                <h3 className="text-xl font-semibold text-gray-800">Location</h3>
                                <p className="text-lg">{asset.location.number}, {asset.location.street}</p>
                                <p className="text-lg">{asset.location.city}, {asset.location.country}</p>
                                <p className="text-lg">{asset.location.postalCode}</p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                                    onClick={() => navigate(`/asset/edit/${asset._id}`)}
                                >
                                    Edit Asset
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dashboard>
    );
};

export default ViewAssets;