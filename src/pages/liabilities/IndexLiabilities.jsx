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
import DeleteModal from './DeleteLiabilities';
import { set } from 'react-hook-form';

const IndexLiabilities = () => { 
    const [liabilities, setLiabilities] = useState([]);
    const [filteredLiabilities, setFilteredLiabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [liabilityToDelete, setLiabilityToDelete] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);

    const fetchLiabilities = async () => {
        axios.get('http://localhost:5559/liability')
            .then(response => {
                const data = response.data.data || response.data;
                setLiabilities(data);
                setFilteredLiabilities(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        fetchLiabilities();
    }, []);

    const showModal = (id) => {
        const liability = liabilities.find((liability) => liability._id === id);
        setLiabilityToDelete(liability);
    };

    const handleDelete = (id) => {
        showModal(id);
    };

    // Filter liabilities by date range
    const filterByDate = () => {
        if (!startDate && !endDate) {
            setFilteredLiabilities(liabilities);
            return;
        }

        const filtered = liabilities.filter(liability => {
            const liabilityDate = new Date(liability.dueDate);
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Max date
            
            // Reset time component for accurate date comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            liabilityDate.setHours(0, 0, 0, 0);
            
            return liabilityDate >= start && liabilityDate <= end;
        });

        setFilteredLiabilities(filtered);
        setIsFiltered(true);
    };

    // Reset filters
    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setFilteredLiabilities(liabilities);
        setIsFiltered(false);
    };

    // Generate PDF Function
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Add title and date information
        doc.setFontSize(18);
        doc.text("Liability List Report", 14, 20);
        
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
            head: [['Liability ID', 'Name', 'Type', 'Amount', 'Due Date', 'Status', 'Description']],
            body: filteredLiabilities.map(liability => [
                liability.liabilityID,
                liability.liabilityName,
                liability.type,
                `Rs. ${liability.amount}`,
                new Date(liability.dueDate).toLocaleDateString(),
                liability.status,
                liability.description
            ]),
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] } // Blue color for liability
        });

        // Save the PDF
        doc.save("liability-list.pdf");
    };

    return (
        <Dashboard>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Liability List</h1>
                <div className='flex'>
                    <Link to='/liabilities/create' className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'>
                        <MdOutlineAddBox className='mr-2' />
                        Add Liability
                    </Link>
                </div>
            </div>

            {/* Date Filter Controls */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-lg font-semibold mb-2'>Filter by Due Date</h2>
                <div className='flex flex-wrap gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                        <input
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>End Date</label>
                        <input
                            type='date'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
                    {/* Buttons for generating PDF and Reset Filter */}
                    {isFiltered && (
                        <div className='flex items-end gap-2'>
                            <button
                                onClick={generatePDF}
                                className="ml-4 bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded flex items-center"
                            >
                                Generate PDF
                            </button>

                        
                        </div>
                    )}
                </div>
            </div>

            

            {loading ? (
                <Spinner />
            ) : (
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <div className='mb-2 text-sm text-gray-600'>
                        Showing {filteredLiabilities.length} {filteredLiabilities.length === 1 ? 'liability' : 'liabilities'}
                    </div>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='p-3 text-left'>Liability ID</th>
                                <th className='p-3 text-left'>Name</th>
                                <th className='p-3 text-left'>Type</th>
                                <th className='p-3 text-left'>Amount</th>
                                <th className='p-3 text-left'>Status</th>
                                <th className='p-3 text-left'>Due Date</th>
                                <th className='p-3 text-left'>Description</th>
                                <th className='p-3 text-left'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLiabilities.map((liability, index) => (
                                <tr key={liability._id || index} className='border-b hover:bg-gray-100'>
                                    <td className='p-3'>{liability.liabilityID}</td>
                                    <td className='p-3'>{liability.liabilityName}</td>
                                    <td className='p-3'>{liability.type}</td>
                                    <td className='p-3'>Rs. {liability.amount}</td>
                                    <td className='p-3'>{liability.status}</td>
                                    <td className='p-3'>{new Date(liability.dueDate).toLocaleDateString()}</td>
                                    <td className='p-3 max-w-xs truncate' title={liability.description}>
                                        {liability.description}
                                    </td>
                                    <td className='p-3 flex gap-2'>
                                        <Link to={`/liabilities/detail/${liability._id}`} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'>
                                            <BsInfoCircle />
                                        </Link>
                                        <Link to={`/liabilities/edit/${liability._id}`} className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <button
                                            className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'
                                            onClick={() => handleDelete(liability._id)}
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
            {liabilityToDelete && (
                <DeleteModal
                    liability={liabilityToDelete}
                    onClose={() => setLiabilityToDelete(null)}
                    onDelete={() => {
                        fetchLiabilities();
                        setLiabilityToDelete(null);
                    }}
                />
            )}
        </Dashboard>
    );
};

export default IndexLiabilities;
