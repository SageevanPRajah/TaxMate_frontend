import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteAssets from './DeleteAssets';


const IndexAssets = () => { 
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null); // Stores asset to delete

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5559/assets')
            .then(response => {
                console.log("API Response:", response.data);
                setAssets(response.data.data || response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        setAssets(assets.filter(asset => asset._id !== id)); // Remove from UI
        setSelectedAsset(null); // Close modal
    };

    return (
        <Dashboard>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Asset List</h1>
                <Link to='/assets/create' className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'>
                    <MdOutlineAddBox className='mr-2' />
                    Add Asset
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
                                <th className='p-3 text-left'>Asset ID</th>
                                <th className='p-3 text-left'>Name</th>
                                <th className='p-3 text-left'>Category</th>
                                <th className='p-3 text-left'>Value</th>
                                <th className='p-3 text-left'>Location</th>
                                <th className='p-3 text-left'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset, index) => (
                                <tr key={asset._id || index} className='border-b hover:bg-gray-100'>
                                    <td className='p-3'>{index + 1}</td>
                                    <td className='p-3'>{asset.assetID}</td>
                                    <td className='p-3'>{asset.name}</td>
                                    <td className='p-3'>{asset.category}</td>
                                    <td className='p-3'>{asset.value}</td>
                                    <td className='p-3'>{asset.location}</td>
                                    <td className='p-3 flex gap-2'>
                                        <Link to={`/assets/detail/${asset._id}`} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'>
                                            <BsInfoCircle />
                                        </Link>
                                        <Link to={`/assets/edit/${asset._id}`} className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <button
                                            className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'
                                            onClick={() => setSelectedAsset(asset)}
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

            {/* Show Delete Modal if an asset is selected */}
            {selectedAsset && (
                <DeleteAssets
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    onDelete={handleDelete}
                />
            )}
        </Dashboard>
    );
};

export default IndexAssets;