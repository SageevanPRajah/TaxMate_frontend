import { useEffect, useState } from 'react'; 
import axios from 'axios';
import Dashboard from '../../components/Dashboard';
import { useNavigate } from 'react-router-dom';

const EditTaxRate = () => {
  const [slabs, setSlabs] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5559/taxRate')
      .then(res => {
        setSlabs(res.data);
        setErrors(res.data.map(() => ({})));
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...slabs];
    updated[index][field] = field === 'taxRate'
      ? parseFloat(value)
      : value;
    setSlabs(updated);
    const newErrors = [...errors];
    newErrors[index][field] = '';
    setErrors(newErrors);
  };

  const validateSlabs = () => {
    let isValid = true;
    const errorsArray = slabs.map((slab) => {
      const errorObj = {};
      if (!slab.incomeTaxSlab || slab.incomeTaxSlab.trim() === '') {
        errorObj.incomeTaxSlab = 'Income Slab is required';
        isValid = false;
      }
      if (slab.taxRate === '' || isNaN(slab.taxRate)) {
        errorObj.taxRate = 'Tax Rate must be a valid number';
        isValid = false;
      } else if (Number(slab.taxRate) < 0 || Number(slab.taxRate) > 100) {
        errorObj.taxRate = 'Tax Rate must be between 0 and 100';
        isValid = false;
      }
      return errorObj;
    });
    setErrors(errorsArray);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateSlabs()) {
      alert('Please fix validation errors before saving.');
      return;
    }
  
    try {
      console.log('📤 Sending to PUT /taxRate:', slabs);
      const response = await axios.put('http://localhost:5559/taxRate', slabs);
      console.log('✅ 200 OK – response.body:', response.data);
      alert('Tax slabs updated successfully');
      navigate('/taxRate');
    } catch (err) {
      // Log the full Axios error
      console.error('🚨 Axios error:', err);
      // If the server gave you a JSON error payload, log that too:
      if (err.response && err.response.data) {
        console.error('🚨 server said:', err.response.data);
        alert(`Update failed: ${err.response.data.message}`);
      } else {
        alert(`Update failed: ${err.message}`);
      }
    }
  };
  

 

  return (
    <Dashboard>
      <h1 className="mb-4 text-3xl font-bold">Edit Tax Rate Slabs</h1>
      {slabs.map((slab, index) => (
        <div key={slab._id} className="flex flex-col gap-2 mb-2">
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                type="text"
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
          onClick={handleSave} 
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
        >
          Save All Changes
        </button>
      </div>
    </Dashboard>
  );
};

export default EditTaxRate;
