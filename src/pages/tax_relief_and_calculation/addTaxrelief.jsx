import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import { useAuth } from '../../hooks/useAuth.js';

const AddTaxRelief = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [taxRelief, setTaxRelief] = useState({
    userID: '',
    startYear: '',
    endYear: '',
    deduction: '',
    status: '',
    taxReliefs: [],      // array of { taxReliefID, taxReliefDescription, reliefAmount }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // auto-populate userID from whatever your user object really has
  useEffect(() => {
    const id =
      (user && (user._id || user.id || user.userID)) ||
      'dev-user-id-123';
    setTaxRelief(prev => ({ ...prev, userID: id }));
  }, [user]);

  // handle top-level input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setTaxRelief(prev => ({ ...prev, [name]: value }));
  };

  // update one entry in the taxReliefs array
  const handleTaxReliefEntryChange = (index, field, value) => {
    const updated = [...taxRelief.taxReliefs];
    updated[index][field] = value;
    setTaxRelief(prev => ({ ...prev, taxReliefs: updated }));
  };

  const addTaxReliefEntry = () => {
    setTaxRelief(prev => ({
      ...prev,
      taxReliefs: [
        ...prev.taxReliefs,
        { taxReliefID: '', taxReliefDescription: '', reliefAmount: '' }
      ]
    }));
  };

  const removeTaxReliefEntry = index => {
    const updated = taxRelief.taxReliefs.filter((_, i) => i !== index);
    setTaxRelief(prev => ({ ...prev, taxReliefs: updated }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // basic validation
    const { userID, startYear, endYear, deduction, status, taxReliefs } = taxRelief;
    const startYearNum = Number(startYear);
    const endYearNum = Number(endYear);

    if (
      !userID.trim() ||
      !status ||
      isNaN(startYearNum) ||
      isNaN(endYearNum) ||
      endYearNum !== startYearNum + 1 ||
      Number(deduction) < 0 ||
      !Array.isArray(taxReliefs) ||
      taxReliefs.length === 0 ||
      taxReliefs.some(
        entry =>
          !entry.taxReliefID.trim() ||
          !entry.taxReliefDescription.trim() ||
          Number(entry.reliefAmount) <= 0
      )
    ) {
      setError('Please fill all fields correctly and ensure all amounts are valid.');
      setLoading(false);
      return;
    }

    // compute totalIncome for the fiscal year
    const fiscalYearLabel = `${startYear.trim()} - ${endYear.trim()}`;
    const startDate = new Date(`${startYear.trim()}-04-01T00:00:00.000Z`);
    const endDate   = new Date(`${endYear.trim()}-03-31T23:59:59.999Z`);
    let totalIncome = 0;

    try {
      const res = await axios.get('http://localhost:5559/income');
      const incomes = Array.isArray(res.data.data) ? res.data.data : res.data;
      const filtered = incomes.filter(item => {
        const d = new Date(item.date);
        return d >= startDate && d <= endDate;
      });
      totalIncome = filtered.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    } catch {
      setError('Failed to retrieve incomes. Please try again.');
      setLoading(false);
      return;
    }

    // build payload
    const payload = {
      userID,
      year: fiscalYearLabel,
      income: totalIncome,
      deduction: Number(deduction),
      status,
      taxReliefs: taxReliefs.map(entry => ({
        taxReliefID: entry.taxReliefID,
        taxReliefDescription: entry.taxReliefDescription,
        reliefAmount: Number(entry.reliefAmount),
      })),
    };

    try {
      await axios.post('http://localhost:5559/taxRelief', payload);
      navigate('/taxRelief');
    } catch {
      setError('Failed to create tax relief. Please try again.');
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
            {/* startYear – endYear */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="startYear"
                placeholder="Start Year (e.g. 2021)"
                pattern="^\d{4}$"
                title="YYYY"
                className="w-1/2 p-2 border border-gray-300 rounded"
                value={taxRelief.startYear}
                onChange={handleChange}
                required
              />
              <span className="font-bold">–</span>
              <input
                type="text"
                name="endYear"
                placeholder="End Year (e.g. 2022)"
                pattern="^\d{4}$"
                title="YYYY"
                className="w-1/2 p-2 border border-gray-300 rounded"
                value={taxRelief.endYear}
                onChange={handleChange}
                required
              />
            </div>

            {/* Deduction */}
            <input
              type="number"
              name="deduction"
              placeholder="Deduction"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={taxRelief.deduction}
              onChange={handleChange}
              required
            />

            {/* Status */}
            <select
              name="status"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={taxRelief.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="not paid">Not Paid</option>
            </select>

            {/* Tax Relief Entries */}
            <h3 className="mb-2 font-bold">Tax Relief Entries</h3>
            {taxRelief.taxReliefs.map((entry, i) => (
              <div key={i} className="p-2 mb-2 border rounded">
                <input
                  type="text"
                  placeholder="Tax Relief ID"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.taxReliefID}
                  onChange={e => handleTaxReliefEntryChange(i, 'taxReliefID', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.taxReliefDescription}
                  onChange={e => handleTaxReliefEntryChange(i, 'taxReliefDescription', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Relief Amount"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.reliefAmount}
                  onChange={e => handleTaxReliefEntryChange(i, 'reliefAmount', e.target.value)}
                  required
                />
                {taxRelief.taxReliefs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTaxReliefEntry(i)}
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
