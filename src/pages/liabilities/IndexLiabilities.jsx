import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteLiability from './DeleteLiability.jsx';

const Index = () => { 
    const [liabilities, setLiabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLiability, setSelectedLiability] = useState(null); // Stores liability to delete

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5559/liability')
            .then(response => {
                console.log("API Response:", response.data);
                setLiabilities(response.data.data || response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        setLiabilities(liabilities.filter(liability => liability._id !== id)); // Remove from UI
        setSelectedLiability(null); // Close modal
    };

    return (
        <Dashboard>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Liability List</h1>
                <Link to='/liabilities/create' className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'>
                    <MdOutlineAddBox className='mr-2' />
                    Add Liability
                </Link>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='p-3 text-left'>No</th>
                                <th className='p-3 text-left'>Liability ID</th>
                                <th className='p-3 text-left'>Name</th>
                                <th className='p-3 text-left'>Category</th>
                                <th className='p-3 text-left'>Amount</th>
                                <th className='p-3 text-left'>Due Date</th>
                                <th className='p-3 text-left'>Address</th>
                                <th className='p-3 text-left'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liabilities.map((liability, index) => (
                                <tr key={liability._id || index} className='border-b hover:bg-gray-100'>
                                    <td className='p-3'>{index + 1}</td>
                                    <td className='p-3'>{liability.liabilityID}</td>
                                    <td className='p-3'>{liability.name}</td>
                                    <td className='p-3'>{liability.category}</td>
                                    <td className='p-3'>{liability.amount}</td>
                                    <td className='p-3'>{liability.dueDate}</td>
                                    <td className='p-3'>
                                        {`${liability.address.number}, ${liability.address.street}, ${liability.address.city}, ${liability.address.country}, ${liability.address.postalCode}`}
                                    </td>
                                    <td className='p-3 flex gap-2'>
                                        <Link to={`/liability/detail/${liability._id}`} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'>
                                            <BsInfoCircle />
                                        </Link>
                                        <Link to={`/liability/edit/${liability._id}`} className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <button
                                            className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'
                                            onClick={() => setSelectedLiability(liability)}
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

            {/* Show Delete Modal if a liability is selected */}
            {selectedLiability && (
                <DeleteLiability
                    liability={selectedLiability}
                    onClose={() => setSelectedLiability(null)}
                    onDelete={handleDelete}
                />
            )}
        </Dashboard>
    );
};

export default Index;
