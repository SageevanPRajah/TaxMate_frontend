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
import DeleteModal from './DeleteLiabilities';
import { useAuth } from '../../hooks/useAuth.js';

const IndexLiabilities = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [liabilities, setLiabilities] = useState([]);
  const [filteredLiabilities, setFilteredLiabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liabilityToDelete, setLiabilityToDelete] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchLiabilities = () => {
    if (!user?.id) return;
    setLoading(true);
    axios.get('http://localhost:5559/liability')
      .then(res => {
        const all = res.data.data || res.data;
        // only show this user's records
        const own = all.filter(l => l.userID === user.id);
        setLiabilities(own);
        setFilteredLiabilities(own);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // re-fetch on login or when navigating back here
  useEffect(fetchLiabilities, [user, location.pathname]);

  const showModal = id => {
    const li = liabilities.find(l => l._id === id);
    setLiabilityToDelete(li);
  };

  const handleDelete = id => showModal(id);

  const filterByDate = () => {
    if (!startDate && !endDate) {
      setFilteredLiabilities(liabilities);
      setIsFiltered(false);
      return;
    }
    const start = startDate ? new Date(startDate) : new Date(0);
    start.setHours(0,0,0,0);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
    end.setHours(23,59,59,999);

    const f = liabilities.filter(l => {
      const d = new Date(l.dueDate);
      return d >= start && d <= end;
    });

    setFilteredLiabilities(f);
    setIsFiltered(true);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilteredLiabilities(liabilities);
    setIsFiltered(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liability List Report", 14, 20);
    if (startDate || endDate) {
      doc.setFontSize(12);
      doc.text(
        `Date Range: ${startDate||'All'} to ${endDate||'All'}`,
        14,
        30
      );
    }
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);

    doc.autoTable({
      startY: 45,
      head: [[
        "Liability ID",
        "Name",
        "Type",
        "Amount",
        "Due Date",
        "Status",
        "Description"
      ]],
      body: filteredLiabilities.map(l => [
        l.liabilityID,
        l.liabilityName,
        l.type,
        `Rs. ${l.amount}`,
        new Date(l.dueDate).toLocaleDateString(),
        l.status,
        l.description
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59,130,246] }
    });

    doc.save("liability-list.pdf");
  };

  return (
    <Dashboard>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold'>Liability List</h1>
        <Link
          to='/liabilities/create'
          className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'
        >
          <MdOutlineAddBox className='mr-2' />
          Add Liability
        </Link>
      </div>

      <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Filter by Due Date</h2>
        <div className='flex flex-wrap gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Start Date</label>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>End Date</label>
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300'
            />
          </div>
          <div className='flex items-end gap-2'>
            <button
              onClick={filterByDate}
              className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'
            >
              Apply Filter
            </button>
            <button
              onClick={resetFilters}
              className='bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded'
            >
              Reset
            </button>
            {isFiltered && (
              <button
                onClick={generatePDF}
                className='bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded'
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
              {filteredLiabilities.map((l, idx) => (
                <tr key={l._id} className='border-b hover:bg-gray-100'>
                  <td className='p-3'>{l.liabilityID}</td>
                  <td className='p-3'>{l.liabilityName}</td>
                  <td className='p-3'>{l.type}</td>
                  <td className='p-3'>Rs. {l.amount}</td>
                  <td className='p-3'>{l.status}</td>
                  <td className='p-3'>{new Date(l.dueDate).toLocaleDateString()}</td>
                  <td className='p-3 max-w-xs truncate' title={l.description}>{l.description}</td>
                  <td className='p-3 flex gap-2'>
                    <Link
                      to={`/liabilities/detail/${l._id}`}
                      className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'
                    >
                      <BsInfoCircle />
                    </Link>
                    <Link
                      to={`/liabilities/edit/${l._id}`}
                      className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'
                    >
                      <AiOutlineEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(l._id)}
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
