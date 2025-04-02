import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams  } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const EditTaxRelief = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [taxRelief, setTaxRelief] = useState({
    userID: '',
    year: '',
    income: '',
    deduction: '',
   
    status: '',
    taxReliefs: [
      {
        taxReliefID: '',
        taxReliefDescription: '',
        reliefAmount: '',
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   useEffect(() => {
       const fetchProduct = async () => {
         try {
          
           const response = await axios.get(`http://localhost:5559/taxRelief/${id}`);
           setTaxRelief(response.data);
         } catch (error) {
           setError('Failed to fetch tax reliefs.');
           console.error('Error fetching tax relief:', error);
         }
       };
       fetchProduct();
     }, [id]);
  // Handle change for top-level fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxRelief((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle change for fields within taxReliefs array
  const handleTaxReliefChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = taxRelief.taxReliefs.map((entry, idx) =>
      idx === index ? { ...entry, [name]: value } : entry
    );
    setTaxRelief((prev) => ({
      ...prev,
      taxReliefs: updatedEntries,
    }));
  };

  // Add a new tax relief entry
  const addTaxReliefEntry = () => {
    setTaxRelief((prev) => ({
      ...prev,
      taxReliefs: [
        ...prev.taxReliefs,
        { taxReliefID: '', taxReliefDescription: '', reliefAmount: '' },
      ],
    }));
  };

  // Remove a tax relief entry (if more than one exists)
  const removeTaxReliefEntry = (index) => {
    if (taxRelief.taxReliefs.length === 1) return; // At least one is required
    const updatedEntries = taxRelief.taxReliefs.filter((_, idx) => idx !== index);
    setTaxRelief((prev) => ({
      ...prev,
      taxReliefs: updatedEntries,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Basic validation
    if (
      !taxRelief.userID.trim() ||
      !taxRelief.status ||
      Number(taxRelief.income) <= 0 ||
      Number(taxRelief.deduction) < 0 ||
      !Array.isArray(taxRelief.taxReliefs) ||
      taxRelief.taxReliefs.length === 0 ||
      taxRelief.taxReliefs.some(
        (entry) =>
          !entry.taxReliefID?.trim() ||
          !entry.taxReliefDescription?.trim() ||
          Number(entry.reliefAmount) <= 0
      )
    ) {
      setError('Please fill in all required fields. All amounts must be positive numbers.');
      setLoading(false);
      return;
    }
  
    try {
      await axios.put(`http://localhost:5559/taxRelief/${id}`, {
        ...taxRelief,
        income: Number(taxRelief.income),
        deduction: Number(taxRelief.deduction),
        taxReliefs: taxRelief.taxReliefs.map((entry) => ({
          ...entry,
          reliefAmount: Number(entry.reliefAmount),
        }))
      });
      navigate('/taxRelief');
    } catch (err) {
      setError('Failed to update tax relief. Please try again.');
      console.error('Error updating tax relief:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Edit Tax Relief</h2>
          {error && <p className="mb-3 text-center text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="number"
              name="year"
              placeholder="Year"
              className="w-full p-3 border border-gray-300 rounded"
              value={taxRelief.year}
              onChange={handleChange}
              required
            />
            
            <input
              type="number"
              name="deduction"
              placeholder="Deduction"
              className="w-full p-3 border border-gray-300 rounded"
                value={taxRelief.deduction}
              onChange={handleChange}
              required
            />
            {/* Tax Relief Entries */}
            <div>
              <h3 className="mb-2 font-semibold">Tax Relief Entries</h3>
              {taxRelief.taxReliefs.map((entry, index) => (
                <div key={index} className="p-4 mb-4 border rounded">
                  
                  <input
                    type="text"
                    name="taxReliefDescription"
                    placeholder="Tax Relief Description"
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    value={entry.taxReliefDescription}
                    onChange={(e) => handleTaxReliefChange(index, e)}
                    required
                  />
                  <input
                    type="number"
                    name="reliefAmount"
                    placeholder="Relief Amount"
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    value={entry.reliefAmount}
                    onChange={(e) => handleTaxReliefChange(index, e)}
                    required
                  />
                  {taxRelief.taxReliefs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTaxReliefEntry(index)}
                      className="text-sm text-red-500"
                    >
                      Remove Entry
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTaxReliefEntry}
                className="text-sm text-blue-500"
              >
                Add Another Entry
              </button>
            </div>
           
            <select
              name="status"
              className="w-full p-3 border border-gray-300 rounded"
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="not paid">Not Paid</option>
            </select>
            <button
              type="submit"
              className="w-full py-3 mt-4 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ?'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default EditTaxRelief;
