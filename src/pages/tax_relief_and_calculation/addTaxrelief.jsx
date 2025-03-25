import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

const statusOptions = [ 'paid', 'non paid'];

const AddTaxRelief = () => {
  const navigate = useNavigate();
  const [taxRelief, setTaxRelief] = useState({
    userID: '',
    year: '',
    income: '',
    deduction: '',
    taxReliefs: [],
    finalTaxAmount: '',
    status: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxRelief((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaxReliefEntryChange = (index, field, value) => {
    const updatedTaxReliefs = [...taxRelief.taxReliefs];
    updatedTaxReliefs[index][field] = value;
    setTaxRelief((prev) => ({ ...prev, taxReliefs: updatedTaxReliefs }));
  };

  const addTaxReliefEntry = () => {
    setTaxRelief((prev) => ({
      ...prev,
      taxReliefs: [...prev.taxReliefs, { taxReliefID: '', taxReliefDescription: '', reliefAmount: '' }],
    }));
  };

  const removeTaxReliefEntry = (index) => {
    const updatedTaxReliefs = taxRelief.taxReliefs.filter((_, i) => i !== index);
    setTaxRelief((prev) => ({ ...prev, taxReliefs: updatedTaxReliefs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5559/taxRelief', taxRelief);
      navigate('/taxRelief');
    } catch (error) {
      setError('Failed to create tax relief. Please try again.');
      console.error('Error creating tax relief:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
          <h2 className='mb-6 text-3xl font-bold text-center text-gray-800'>Add Tax Relief</h2>
          {error && <p className='mb-3 text-center text-red-500'>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 gap-4'>
              
              <input type='text' name='year' placeholder='Year' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='number' name='income' placeholder='Income' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='number' name='deduction' placeholder='Deduction' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='number' name='finalTaxAmount' placeholder='Final Tax Amount' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <select
                name='status'
                value={taxRelief.status}
                onChange={handleChange}
                className='p-3 border border-gray-300 rounded'
                required
              >
                <option value='' disabled>Select Status</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Tax Relief Entries */}
              <div className='space-y-4'>
                {taxRelief.taxReliefs.map((entry, index) => (
                  <div key={index} className='p-4 border rounded-lg'>
                   
                    <input
                      type='text'
                      placeholder='Description'
                      value={entry.taxReliefDescription}
                      onChange={(e) => handleTaxReliefEntryChange(index, 'taxReliefDescription', e.target.value)}
                      className='w-full p-2 mb-2 border border-gray-300 rounded'
                      required
                    />
                    <input
                      type='number'
                      placeholder='Amount'
                      value={entry.reliefAmount}
                      onChange={(e) => handleTaxReliefEntryChange(index, 'reliefAmount', e.target.value)}
                      className='w-full p-2 mb-2 border border-gray-300 rounded'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => removeTaxReliefEntry(index)}
                      className='w-full py-2 text-white bg-red-500 rounded hover:bg-red-600'
                    >
                      Remove Entry
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={addTaxReliefEntry}
                  className='w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
                >
                  Add Tax Relief Entry
                </button>
              </div>
            </div>

            <button type='submit' className='w-full py-3 mt-4 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700' disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default AddTaxRelief;