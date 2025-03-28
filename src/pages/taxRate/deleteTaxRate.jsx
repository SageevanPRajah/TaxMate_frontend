import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';
import { useNavigate } from 'react-router-dom';

const DeleteTaxRate = () => {
  const [slabs, setSlabs] = useState([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    axios.get('http://localhost:5559/taxRate')
      .then(res => setSlabs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete all slabs?")) return;
    try {
      await axios.delete('http://localhost:5559/taxRate');
    
      navigate('/taxRate');
      
      setSlabs([]);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <Dashboard>
      <h1 className="mb-4 text-3xl font-bold">Delete Tax Rate Slabs</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Income Slab</th>
            <th className="p-3 text-left">Tax %</th>
          </tr>
        </thead>
        <tbody>
          {slabs.map((slab) => (
            <tr key={slab._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{slab.incomeTaxSlab}</td>
              <td className="p-3">{slab.taxRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleDelete}
        className="px-3 py-1 mt-4 text-white bg-red-600 rounded hover:bg-red-800"
      >
        Delete All
      </button>
    </Dashboard>
  );
};

export default DeleteTaxRate;
