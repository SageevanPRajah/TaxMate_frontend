import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

const AddTaxRate = () => {
  const [slabs, setSlabs] = useState([{ incomeTaxSlab: '', taxRate: '' }]);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setSlabs([...slabs, { incomeTaxSlab: '', taxRate: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...slabs];
    updated[index][field] = value;
    setSlabs(updated);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5559/taxRate', slabs);
      alert('Tax slabs added successfully');
      navigate('/taxRelief');
    } catch (error) {
      console.error(error);
      alert('Failed to add tax slabs');
    }
  };

  return (
    <Dashboard>
      <h1 className="mb-4 text-3xl font-bold">Add Tax Rate Slabs</h1>
      {slabs.map((slab, index) => (
        <div key={index} className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="Income Slab"
            value={slab.incomeTaxSlab}
            onChange={(e) => handleChange(index, 'incomeTaxSlab', e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Tax %"
            value={slab.taxRate}
            onChange={(e) => handleChange(index, 'taxRate', e.target.value)}
            className="w-1/4 p-2 border rounded"
          />
        </div>
      ))}
      <div className="flex gap-4 mt-4">
        <button onClick={handleAddRow} className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-800">
          + Add Row
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800">
          Submit
        </button>
      </div>
    </Dashboard>
  );
};

export default AddTaxRate;
