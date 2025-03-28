import { useEffect, useState } from 'react';
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
                const response = await axios.get(`http://localhost:5559/asset/${id}`);
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
                                    <strong className="text-gray-700">Asset Name:</strong> {asset.assetName}
                                </p>
                                <p className="text-lg">
                                <strong className="text-gray-700">Asset Value:</strong> Rs. {asset.assetValue}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Category:</strong> {asset.category}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Change Type:</strong> {asset.changeType}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Percentage:</strong> {asset.percentage}%
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Amount:</strong> Rs. {asset.amount}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Date:</strong> {new Date(asset.date).toLocaleDateString()}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Created:</strong> {new Date(asset.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Last Updated:</strong> {new Date(asset.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                                    onClick={() => navigate(`/assets/edit/${asset._id}`)}
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