import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

const AddTaxRelief = () => {
  const navigate = useNavigate();
  const [taxRelief, setTaxRelief] = useState({
    userID: '',
    startYear: '',
    endYear: '',
    deduction: '',
    status: '',
    taxReliefs: [],
  });
  const [error, setError] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxRelief((prev) => ({ ...prev, [name]: value }));

    if (name === 'userID') {
      const userIdPattern = /^U/;
      if (!userIdPattern.test(value) && value.length > 0) {
        setUserIdError("User ID should start with 'U'");
      } else {
        setUserIdError('');
      }
    }
  };

  const handleTaxReliefEntryChange = (index, field, value) => {
    const updatedEntries = [...taxRelief.taxReliefs];
    updatedEntries[index][field] = value;
    setTaxRelief((prev) => ({ ...prev, taxReliefs: updatedEntries }));
  };

  const addTaxReliefEntry = () => {
    setTaxRelief((prev) => ({
      ...prev,
      taxReliefs: [
        ...prev.taxReliefs,
        { taxReliefID: '', taxReliefDescription: '', reliefAmount: '' },
      ],
    }));
  };

  const removeTaxReliefEntry = (index) => {
    const updatedEntries = taxRelief.taxReliefs.filter((_, i) => i !== index);
    setTaxRelief((prev) => ({ ...prev, taxReliefs: updatedEntries }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userIdPattern = /^U/;
    if (!userIdPattern.test(taxRelief.userID)) {
      setError("User ID must start with 'U'");
      setLoading(false);
      return;
    }

    const startYearNum = Number(taxRelief.startYear);
    const endYearNum = Number(taxRelief.endYear);

    if (isNaN(startYearNum) || isNaN(endYearNum)) {
      setError('Start Year and End Year must be valid numbers.');
      setLoading(false);
      return;
    }

    if (endYearNum !== startYearNum + 1) {
      setError('Fiscal year must be consecutive. For example: 2021 - 2022');
      setLoading(false);
      return;
    }

    if (
      !taxRelief.userID.trim() ||
      !taxRelief.status ||
      !taxRelief.startYear.trim() ||
      !taxRelief.endYear.trim() ||
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
      setError(
        'Please make sure all required fields are filled and all amounts are positive numbers.'
      );
      setLoading(false);
      return;
    }

    const fiscalYear = `${taxRelief.startYear.trim()} - ${taxRelief.endYear.trim()}`;
    const startDate = new Date(`${taxRelief.startYear.trim()}-04-01T00:00:00.000Z`);
    const endDate = new Date(`${taxRelief.endYear.trim()}-03-31T23:59:59.999Z`);

    let totalIncome = 0;
    try {
      const incomeResponse = await axios.get('http://localhost:5559/income');
      const allIncomes = incomeResponse.data.data || incomeResponse.data;
      const filteredIncomes = allIncomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate >= startDate && incomeDate <= endDate;
      });
      totalIncome = filteredIncomes.reduce(
        (sum, income) => sum + Number(income.amount || 0),
        0
      );
    } catch (err) {
      setError('Failed to retrieve incomes. Please try again.');
      setLoading(false);
      return;
    }

    const payload = {
      userID: taxRelief.userID,
      income: totalIncome,
      deduction: Number(taxRelief.deduction),
      status: taxRelief.status,
      taxReliefs: taxRelief.taxReliefs.map((entry) => ({
        taxReliefID: entry.taxReliefID,
        taxReliefDescription: entry.taxReliefDescription,
        reliefAmount: Number(entry.reliefAmount),
      })),
      year: fiscalYear,
    };

    try {
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

            <input
              type="text"
              name="year"
              placeholder="Year"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={taxRelief.year}
              onChange={handleChange}
            />

            <input
              type="number"
              name="deduction"
              placeholder="Deduction"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={taxRelief.deduction}
              onChange={handleChange}
              required
            />

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
                  onChange={(e) =>
                    handleTaxReliefEntryChange(index, 'taxReliefDescription', e.target.value)
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Relief Amount"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={entry.reliefAmount}
                  onChange={(e) =>
                    handleTaxReliefEntryChange(index, 'reliefAmount', e.target.value)
                  }
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
