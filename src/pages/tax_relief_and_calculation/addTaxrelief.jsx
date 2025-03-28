import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

const AddTaxRelief = () => {
  const navigate = useNavigate();
  const [taxRelief, setTaxRelief] = useState({
    userID: '',
    year: '',
    income: '',
    deduction: '',
    
    status: '',
    taxReliefs: [] // Must be non-empty when submitting!
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update top-level fields (userID, year, income, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxRelief((prev) => ({ ...prev, [name]: value }));
  };

  // Update individual tax relief entries in the array
  const handleTaxReliefEntryChange = (index, field, value) => {
    const updatedEntries = [...taxRelief.taxReliefs];
    updatedEntries[index][field] = value;
    setTaxRelief((prev) => ({ ...prev, taxReliefs: updatedEntries }));
  };

  // Add a new tax relief entry (object with taxReliefID, taxReliefDescription, and reliefAmount)
  const addTaxReliefEntry = () => {
    setTaxRelief((prev) => ({
      ...prev,
      taxReliefs: [
        ...prev.taxReliefs,
        { taxReliefID: '', taxReliefDescription: '', reliefAmount: '' }
      ]
    }));
  };

  // Remove a tax relief entry (if more than one exists)
  const removeTaxReliefEntry = (index) => {
    const updatedEntries = taxRelief.taxReliefs.filter((_, i) => i !== index);
    setTaxRelief((prev) => ({ ...prev, taxReliefs: updatedEntries }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (
      !taxRelief.userID.trim() ||
      !taxRelief.status ||
      Number(taxRelief.income) <= 0 ||
      Number(taxRelief.deduction) < 0 ||
      !Array.isArray(taxRelief.taxReliefs) ||
      taxRelief.taxReliefs.length === 0 ||
      taxRelief.taxReliefs.some(
        (entry) =>
          !entry.taxReliefID.trim() ||
          !entry.taxReliefDescription.trim() ||
          Number(entry.reliefAmount) <= 0
      )
    ) {
      setError('Please make sure all required fields are filled and all amounts are positive numbers.');
      setLoading(false);
      return;
    }
  
    try {
      const payload = {
        ...taxRelief,
        income: Number(taxRelief.income),
        deduction: Number(taxRelief.deduction),
        taxReliefs: taxRelief.taxReliefs.map((entry) => ({
          taxReliefID: entry.taxReliefID,
          taxReliefDescription: entry.taxReliefDescription,
          reliefAmount: Number(entry.reliefAmount),
        })),
      };
  
      await axios.post('http://localhost:5559/taxRelief', payload);
      navigate('/taxRelief');
    } catch (err) {
      setError('Failed to create tax relief. Please try again.');
      console.error('Error creating tax relief:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white rounded-lg shadow-lg w-96">
          <h2 className="mb-4 text-2xl font-bold">Add Tax Relief</h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* User ID (required) */}
           
            {/* Optional: Year */}
            <input
              type="text"
              name="year"
              placeholder="Year"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={taxRelief.year}
              onChange={handleChange}
            />
        
            
            {/* Deduction (required) */}
            <input
              type="number"
              name="deduction"
              placeholder="Deduction"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={taxRelief.deduction}
              onChange={handleChange}
              required
            />
            
            {/* Status (required) */}
            <select
              name="status"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={taxRelief.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="not paid">Not Paid</option>
            </select>

            <h3 className="mt-4 font-bold">Tax Relief Entries</h3>
            {taxRelief.taxReliefs.map((entry, index) => (
              <div key={index} className="p-2 my-2 border rounded">
                <input
                  type="text"
                  placeholder="Tax Relief ID"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.taxReliefID}
                  onChange={(e) => handleTaxReliefEntryChange(index, 'taxReliefID', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Tax Relief Description"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.taxReliefDescription}
                  onChange={(e) => handleTaxReliefEntryChange(index, 'taxReliefDescription', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Relief Amount"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.reliefAmount}
                  onChange={(e) => handleTaxReliefEntryChange(index, 'reliefAmount', e.target.value)}
                  required
                />
                {taxRelief.taxReliefs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTaxReliefEntry(index)}
                    className="w-full py-1 text-white bg-red-500 rounded"
                  >
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTaxReliefEntry}
              className="w-full py-2 mb-4 text-white bg-blue-500 rounded"
            >
              Add Tax Relief Entry
            </button>
            <button
              type="submit"
              className="w-full py-2 text-white bg-green-600 rounded"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default AddTaxRelief;
