import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

const AddTaxRate = () => {
  const [slabs, setSlabs] = useState([{ incomeTaxSlab: '', taxRate: '' }]);
  const [errors, setErrors] = useState([{}]);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setSlabs([...slabs, { incomeTaxSlab: '', taxRate: '' }]);
    setErrors([...errors, {}]);
  };

  const handleChange = (index, field, value) => {
    const updatedSlabs = [...slabs];
    updatedSlabs[index][field] = value;
    setSlabs(updatedSlabs);

    
    const updatedErrors = [...errors];
    if (updatedErrors[index]) {
      updatedErrors[index][field] = '';
      setErrors(updatedErrors);
    }
  };

  const validateSlabs = () => {
    const errorsArray = [];
    let isValid = true;
    slabs.forEach((slab, index) => {
      const rowErrors = {};
      if (!slab.incomeTaxSlab.trim()) {
        rowErrors.incomeTaxSlab = 'Income Slab is required';
        isValid = false;
      }
      if (slab.taxRate === '' || isNaN(slab.taxRate)) {
        rowErrors.taxRate = 'Tax Rate must be a valid number';
        isValid = false;
      } else if (Number(slab.taxRate) < 0 || Number(slab.taxRate) > 100) {
        rowErrors.taxRate = 'Tax Rate must be between 0 and 100';
        isValid = false;
      }
      errorsArray[index] = rowErrors;
    });
    setErrors(errorsArray);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateSlabs()) {
      alert('Please fix validation errors before submitting.');
      return;
    }
    try {
      await axios.post('http://localhost:5559/taxRate', slabs);
      alert('Tax slabs added successfully');
      navigate('/taxRate');
    } catch (error) {
      console.error(error);
      alert('Failed to add tax slabs');
    }
  };


  const handleRemoveEmptySlabs = () => {
    
    const filteredSlabs = slabs.filter(slab => {
      return !(slab.incomeTaxSlab.trim() === '' && (slab.taxRate === '' || slab.taxRate === null || slab.taxRate === undefined));
    });
    setSlabs(filteredSlabs);
    setErrors(filteredSlabs.map(() => ({})));
  };

  return (
    <Dashboard>
      <h1 className="mb-4 text-3xl font-bold">Add Tax Rate Slabs</h1>
      {slabs.map((slab, index) => (
        <div key={index} className="flex flex-col gap-2 mb-2">
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Income Slab"
                value={slab.incomeTaxSlab}
                onChange={(e) => handleChange(index, 'incomeTaxSlab', e.target.value)}
                className="w-full p-2 border rounded"
              />
              {errors[index] && errors[index].incomeTaxSlab && (
                <p className="text-sm text-red-500">{errors[index].incomeTaxSlab}</p>
              )}
            </div>
            <div className="w-1/4">
              <input
                type="number"
                placeholder="Tax %"
                value={slab.taxRate}
                onChange={(e) => handleChange(index, 'taxRate', e.target.value)}
                className="w-full p-2 border rounded"
              />
              {errors[index] && errors[index].taxRate && (
                <p className="text-sm text-red-500">{errors[index].taxRate}</p>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-800"
        >
          + Add Row
        </button>
        <button 
          onClick={handleRemoveEmptySlabs} 
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800"
        >
          Remove Empty Slabs
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
        >
          Submit
        </button>
      </div>
    </Dashboard>
  );
};

export default AddTaxRate;
