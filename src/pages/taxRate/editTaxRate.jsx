import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';
import { useNavigate } from 'react-router-dom';

const EditTaxRate = () => {
  const [slabs, setSlabs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5559/taxRate')
      .then(res => setSlabs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...slabs];
    updated[index][field] = value;
    setSlabs(updated);
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5559/taxRate', slabs);
      alert('Tax slabs updated successfully');
      navigate('/taxRelief');
    } catch (error) {
      console.error(error);
      alert('Update failed');
    }
  };

  return (
    <Dashboard>
      <h1 className="mb-4 text-3xl font-bold">Edit Tax Rate Slabs</h1>
      {slabs.map((slab, index) => (
        <div key={slab._id} className="flex gap-4 mb-2">
          <input
            type="text"
            value={slab.incomeTaxSlab}
            onChange={(e) => handleChange(index, 'incomeTaxSlab', e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            value={slab.taxRate}
            onChange={(e) => handleChange(index, 'taxRate', e.target.value)}
            className="w-1/4 p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={handleSave} className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-800">
        Save All Changes
      </button>
    </Dashboard>
  );
};

export default EditTaxRate;
