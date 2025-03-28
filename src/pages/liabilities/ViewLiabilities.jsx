import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';

const ViewLiabilities = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [liability, setLiability] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLiability = async () => {
            try {
                const response = await axios.get(`http://localhost:5559/liability/${id}`);
                setLiability(response.data);
            } catch (error) {
                console.error("Error fetching liability:", error);
                setError("Failed to fetch liability details.");
            } finally {
                setLoading(false);
            }
        };
        fetchLiability();
    }, [id]);

    return (
        <Dashboard>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br ">
                <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-[35rem] backdrop-blur-lg border border-gray-300">
                    <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
                        Liability Details
                    </h2>

                    {loading ? (
                        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center font-medium">{error}</p>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-gray-50 shadow-md">
                                <p className="text-lg">
                                    <strong className="text-gray-700">Liability ID:</strong> {liability.liabilityID}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Liability Name:</strong> {liability.liabilityName}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Type:</strong> {liability.type}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Amount:</strong> ${liability.amount}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Due Date:</strong> {new Date(liability.dueDate).toLocaleDateString()}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Status:</strong> {liability.status}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Creditor:</strong> {liability.creditor}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Created At:</strong> {new Date(liability.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-700">Updated At:</strong> {new Date(liability.updatedAt).toLocaleDateString()}
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
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                                    onClick={() => navigate(`/liabilities/edit/${liability._id}`)}
                                >
                                    Edit Liability
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dashboard>
    );
};

export default ViewLiabilities;