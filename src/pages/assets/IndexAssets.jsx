import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteModal from './DeleteAsset';
import { useAuth } from '../../hooks/useAuth.js';

const IndexAssets = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchAssets = () => {
    if (!user?.id) return;
    setLoading(true);
    axios
      .get('http://localhost:5559/asset')
      .then(res => {
        const all = res.data.data || res.data;
        // only this user's assets
        const own = all.filter(a => a.userID === user.id);
        setAssets(own);
        setFilteredAssets(own);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // re-fetch when user or path changes
  useEffect(fetchAssets, [user, location.pathname]);

  const showModal = id => {
    const a = assets.find(x => x._id === id);
    setAssetToDelete(a);
  };

  const handleDelete = id => showModal(id);

  const filterByDate = () => {
    if (!startDate && !endDate) {
      setFilteredAssets(assets);
      setIsFiltered(false);
      return;
    }
    const start = startDate ? new Date(startDate) : new Date(0);
    start.setHours(0,0,0,0);
    const end = endDate
      ? new Date(endDate)
      : new Date(8640000000000000);
    end.setHours(23,59,59,999);

    const f = assets.filter(a => {
      const d = new Date(a.date);
      d.setHours(0,0,0,0);
      return d >= start && d <= end;
    });
    setFilteredAssets(f);
    setIsFiltered(true);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilteredAssets(assets);
    setIsFiltered(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Asset List Report', 14, 20);

    if (startDate || endDate) {
      doc.setFontSize(12);
      doc.text(
        `Date Range: ${startDate||'All'} to ${endDate||'Present'}`,
        14,
        30
      );
    }
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);

    doc.autoTable({
      startY: 45,
      head: [[
        'ID', 'Name', 'Value', 'Category',
        'Change', '%', 'Amount', 'Date'
      ]],
      body: filteredAssets.map(a => [
        a.assetID,
        a.assetName,
        `Rs.${a.assetValue}`,
        a.category,
        a.changeType,
        `${a.percentage}%`,
        `Rs.${a.amount}`,
        new Date(a.date).toLocaleDateString()
      ]),
      theme: 'striped',
      headStyles: { fillColor: [76,175,80] }
    });

    doc.save('asset-list.pdf');
  };

  return (
    <Dashboard>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold'>Asset List</h1>
        <Link
          to='/assets/create'
          className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'
        >
          <MdOutlineAddBox className='mr-2' />
          Add Asset
        </Link>
      </div>

      {/* Filters */}
      <div className='bg-white shadow rounded p-4 mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Filter by Date</h2>
        <div className='flex flex-wrap gap-4'>
          <div>
            <label className='block text-sm font-medium'>Start Date</label>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='mt-1 border rounded px-2 py-1'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>End Date</label>
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className='mt-1 border rounded px-2 py-1'
            />
          </div>
          <div className='flex items-end gap-2'>
            <button
              onClick={filterByDate}
              className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded'
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className='bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded'
            >
              Reset
            </button>
            {isFiltered && (
              <button
                onClick={generatePDF}
                className='bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded'
              >
                Generate PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className='bg-white shadow rounded p-4'>
          <div className='mb-2 text-sm text-gray-600'>
            Showing {filteredAssets.length}{' '}
            {filteredAssets.length === 1 ? 'asset' : 'assets'}
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
              {filteredAssets.map((a, i) => (
                <tr key={a._id} className='border-b hover:bg-gray-100'>
                  <td className='p-3'>{a.assetID}</td>
                  <td className='p-3'>{a.assetName}</td>
                  <td className='p-3'>Rs. {a.assetValue}</td>
                  <td className='p-3'>{a.category}</td>
                  <td className='p-3'>{a.changeType}</td>
                  <td className='p-3'>{a.percentage}%</td>
                  <td className='p-3'>Rs. {a.amount}</td>
                  <td className='p-3'>{new Date(a.date).toLocaleDateString()}</td>
                  <td className='p-3 flex gap-2'>
                    <Link
                      to={`/assets/detail/${a._id}`}
                      className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'
                    >
                      <BsInfoCircle />
                    </Link>
                    <Link
                      to={`/assets/edit/${a._id}`}
                      className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'
                    >
                      <AiOutlineEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'
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
