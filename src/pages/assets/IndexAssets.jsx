import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteModal from './DeleteAsset';

const IndexAssets = () => { 
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchAssets = async () => {
        axios.get('http://localhost:5559/asset')
            .then(response => {
                const data = response.data.data || response.data;
                setAssets(data);
                setFilteredAssets(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        fetchAssets();
    }, []);

    const showModal = (id) => {
        const asset = assets.find((asset) => asset._id === id);
        setAssetToDelete(asset);
    };

    const handleDelete = (id) => {
        showModal(id);
    };

    // Filter assets by date range
    const filterByDate = () => {
        if (!startDate && !endDate) {
            setFilteredAssets(assets);
            return;
        }

        const filtered = assets.filter(asset => {
            const assetDate = new Date(asset.date);
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Max date
            
            // Reset time component for accurate date comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            assetDate.setHours(0, 0, 0, 0);
            
            return assetDate >= start && assetDate <= end;
        });

        setFilteredAssets(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setFilteredAssets(assets);
    };

    // Generate PDF Function
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Add title and date information
        doc.setFontSize(18);
        doc.text("Asset List Report", 14, 20);
        
        // Add date range if filtered
        if (startDate || endDate) {
            doc.setFontSize(12);
            const dateRangeText = `Date Range: ${startDate ? new Date(startDate).toLocaleDateString() : 'All'} to ${endDate ? new Date(endDate).toLocaleDateString() : 'Present'}`;
            doc.text(dateRangeText, 14, 30);
        }
        
        // Add current date
        const today = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Generated on: ${today}`, 14, 40);
        
        // Use autoTable for better formatting
        doc.autoTable({
            startY: 45,
            head: [['Asset ID', 'Name', 'Value', 'Category', 'Change Type', 'Percentage', 'Amount', 'Date']],
            body: filteredAssets.map(asset => [
                asset.assetID,
                asset.assetName,
                `$${asset.assetValue}`,
                asset.category,
                asset.changeType,
                `${asset.percentage}%`,
                `$${asset.amount}`,
                new Date(asset.date).toLocaleDateString()
            ]),
            theme: 'striped',
            headStyles: { fillColor: [76, 175, 80] }
        });

        // Save the PDF
        doc.save("asset-list.pdf");
    };

    return (
        <Dashboard>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Asset List</h1>
                <div className='flex'>
                    <Link to='/assets/create' className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'>
                        <MdOutlineAddBox className='mr-2' />
                        Add Asset
                    </Link>
                    <button
                        onClick={generatePDF}
                        className="ml-4 bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded flex items-center"
                    >
                        Generate PDF
                    </button>
                </div>
            </div>

            {/* Date Filter Controls */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-lg font-semibold mb-2'>Filter by Date</h2>
                <div className='flex flex-wrap gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                        <input
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>End Date</label>
                        <input
                            type='date'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500'
                        />
                    </div>
                    <div className='flex items-end gap-2'>
                        <button
                            onClick={filterByDate}
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        >
                            Apply Filter
                        </button>
                        <button
                            onClick={resetFilters}
                            className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <div className='mb-2 text-sm text-gray-600'>
                        Showing {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'}
                    </div>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='p-3 text-left'>Asset ID</th>
                                <th className='p-3 text-left'>Name</th>
                                <th className='p-3 text-left'>Value</th>
                                <th className='p-3 text-left'>Category</th>
                                <th className='p-3 text-left'>Change Type</th>
                                <th className='p-3 text-left'>Percentage</th>
                                <th className='p-3 text-left'>Amount</th>
                                <th className='p-3 text-left'>Date</th>
                                <th className='p-3 text-left'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map((asset, index) => (
                                <tr key={asset._id || index} className='border-b hover:bg-gray-100'>
                                    <td className='p-3'>{asset.assetID}</td>
                                    <td className='p-3'>{asset.assetName}</td>
                                    <td className='p-3'>Rs. {asset.assetValue}</td>
                                    <td className='p-3'>{asset.category}</td>
                                    <td className='p-3'>{asset.changeType}</td>
                                    <td className='p-3'>{asset.percentage}%</td>
                                    <td className='p-3'>Rs. {asset.amount}</td>
                                    <td className='p-3'>{new Date(asset.date).toLocaleDateString()}</td>
                                    <td className='p-3 flex gap-2'>
                                        <Link to={`/assets/detail/${asset._id}`} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'>
                                            <BsInfoCircle />
                                        </Link>
                                        <Link to={`/assets/edit/${asset._id}`} className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <button
                                            className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'
                                            onClick={() => handleDelete(asset._id)}
                                        >
                                            <MdOutlineDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Show modal */}
            {assetToDelete && (
                <DeleteModal
                    asset={assetToDelete}
                    onClose={() => setAssetToDelete(null)}
                    onDelete={() => {
                        fetchAssets();
                        setAssetToDelete(null);
                    }}
                />
            )}
        </Dashboard>
    );
};

export default IndexAssets;
