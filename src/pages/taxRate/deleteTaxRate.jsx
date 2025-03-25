import  { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';

const DeleteTaxRate = () => {
  const [slabs, setSlabs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5559/taxRate')
      .then(res => setSlabs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slab?")) return;
    try {
      await axios.delete(`http://localhost:5559/taxRate`);
      setSlabs(slabs.filter(s => s._id !== id));
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
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Income Slab</th>
            <th className="p-3 text-left">Tax %</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {slabs.map((slab, idx) => (
            <tr key={slab._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{slab.incomeTaxSlab}</td>
              <td className="p-3">{slab.taxRate}%</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(slab._id)}
                  className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Dashboard>
  );
};

export default DeleteTaxRate;
