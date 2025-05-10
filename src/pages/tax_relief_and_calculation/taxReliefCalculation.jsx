import { useEffect, useState } from 'react';  
import { useLocation, Link } from 'react-router-dom'; 
import axios from 'axios';
import { AiOutlineEdit, AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteTaxRelief from './deleteTaxRelief';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../../hooks/useAuth.js'; 


const TaxReliefCalculation = () => {
  const { user } = useAuth();                 // ← get logged-in user
  const location = useLocation();             // ← track navigation

  const [taxReliefs, setTaxReliefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [taxRates, setTaxRates] = useState([]);
  const [searchYear, setSearchYear] = useState('');

  const calculateTax = (income, deduction, totalRelief) => {
    const TAX_FREE_LIMIT = 1200000;
    let taxable = income - deduction - totalRelief - TAX_FREE_LIMIT;
    if (taxable <= 0) return 0;

    const slabs = [
      { limit: 600000, rate: 0.06 },
      { limit: 600000, rate: 0.12 },
      { limit: 600000, rate: 0.18 },
      { limit: 600000, rate: 0.24 },
      { limit: 600000, rate: 0.30 },
      { limit: Infinity, rate: 0.36 },
    ];

    let totalTax = 0;
    for (const slab of slabs) {
      if (taxable <= 0) break;
      const applyAmount = Math.min(taxable, slab.limit);
      totalTax += applyAmount * slab.rate;
      taxable -= applyAmount;
    }

    return Math.round(totalTax);
  };

  useEffect(() => {
    axios.get('http://localhost:5559/taxRate')
      .then(response => {
        setTaxRates(response.data.data || response.data); 
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // fetch and filter this user's tax reliefs
  const fetchTaxReliefs = () => {
    if (!user?.id) return;
    setLoading(true);
    axios.get('http://localhost:5559/taxRelief')
      .then(response => {
        const all = response.data.data || response.data;
        const own = all.filter(tr => tr.userID === user.id);
        setTaxReliefs(own);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // re-run on login or whenever we return to this route
  useEffect(fetchTaxReliefs, [user, location.pathname]);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text('Tax Relief Report', 14, 15);
  
    const tableColumn = [
      'User', 'Year', 'Income', 'Deduction', 'Tax Relief Entries', 'Total Tax', 'Status',
    ];
  
    const tableRows = [];
  
    taxReliefs
      .filter(tax => tax.year.toString().includes(searchYear))
      .forEach((tax) => {
        const totalRelief = tax.taxReliefs?.reduce(
          (sum, entry) => sum + Number(entry.reliefAmount || 0), 0
        ) || 0;
  
        const computedTax = calculateTax(
          Number(tax.income),
          Number(tax.deduction),
          totalRelief
        );
  
        const reliefDescriptions = tax.taxReliefs?.map((entry) => {
          return `• ${entry.taxReliefID} - ${entry.taxReliefDescription} - Rs.${entry.reliefAmount}`;
        }).join(', ') || 'No entries';
  
        const combinedReliefText = tax.taxReliefs && tax.taxReliefs.length > 0
          ? `${reliefDescriptions} | Total: Rs.${totalRelief}`
          : reliefDescriptions;
  
        const rowData = [
          
          tax.year,
          tax.income,
          tax.deduction,
          combinedReliefText,
          computedTax,
          tax.status,
        ];
  
        tableRows.push(rowData);
      });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        4: { cellWidth: 60 }, // Wider column for "Tax Relief Entries"
      },
    });
  
    doc.save('tax_relief_report.pdf');
  };
  

  const filteredTaxReliefs = taxReliefs.filter((tax) =>
    tax.year.toString().includes(searchYear)
  );

  return (
    <Dashboard>
      <h2 className='text-3xl font-bold'>Tax Rate Slabs</h2>
      <div className='p-4 mb-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-end gap-2 pt-2 pb-4'>
          
        </div>

        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='p-3 text-left'>Individual tax Slab</th>
              <th className='p-3 text-left'>Tax %</th>
            </tr>
          </thead>
          <tbody>
            {taxRates.length > 0 ? (
              taxRates.map((slab) => (
                <tr key={slab._id} className='border-b hover:bg-gray-50'>
                  <td className='p-3'>{slab.incomeTaxSlab}</td>
                  <td className='p-3'>{slab.taxRate}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className='p-4 text-center text-gray-500'>No tax slabs available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-3xl font-bold'>Tax Relief and Calculation</h1>
        
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className='p-4 overflow-auto bg-white rounded-lg shadow-md'>
          <div className="flex items-center justify-end gap-2 pt-2 pb-4">
           <div className="relative">
           <AiOutlineSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
          type="text"
          placeholder="Search by Year…"
          value={searchYear}
          onChange={e => setSearchYear(e.target.value)}
          className="w-64 py-2 pl-10 pr-4 text-sm font-medium text-gray-700 transition border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
           </div>
            <Link
             to="/taxRelief/addTaxRelief"
             className="flex items-center px-4 py-2 font-bold text-white transition bg-blue-600 rounded hover:bg-blue-800"
            >
              <MdOutlineAddBox className="mr-2" /> Add Tax Relief
            </Link>
          </div>
          

          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-200'>
               
                <th className='p-3 text-left'>Year</th>
                <th className='p-3 text-left'>Income</th>
                <th className='p-3 text-left'>Deduction</th>
                <th className='p-3 text-left'>Tax Relief Entries</th>
                <th className='p-3 text-left'>Final Tax Amount</th>
                <th className='p-3 text-left'>Status</th>
                <th className='p-3 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTaxReliefs.map((tax, index) => {
                const totalRelief = tax.taxReliefs?.reduce((sum, entry) => sum + Number(entry.reliefAmount || 0), 0) || 0;
                const computedTax = calculateTax(Number(tax.income), Number(tax.deduction), totalRelief);

                return (
                  <tr key={tax._id || index} className='border-b'>
                   
                    <td className='p-3'>{tax.year}</td>
                    <td className='p-3'>{tax.income}</td>
                    <td className='p-3'>{tax.deduction}</td>
                    <td className='p-3'>
                      {tax.taxReliefs?.length > 0 ? (
                        <>
                          {tax.taxReliefs.map((entry, idx) => (
                            <div key={idx} className='p-2 mb-2 border rounded'>
                              <div><strong>ID:</strong> {entry.taxReliefID}</div>
                              <div><strong>Description:</strong> {entry.taxReliefDescription}</div>
                              <div><strong>Amount:</strong> {entry.reliefAmount}</div>
                            </div>
                          ))}
                          <div className='font-bold'>
                            Total Relief Amount: {totalRelief}
                          </div>
                        </>
                      ) : (
                        'No entries'
                      )}
                    </td>
                    <td className='p-3'>{computedTax}</td>
                    <td className='p-3'>{tax.status}</td>
                    <td className='flex gap-2 p-3'>
                      <Link to={`/taxRelief/editTaxRelief/${tax._id}`} className='px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700'>
                        <AiOutlineEdit />
                      </Link>
                      <button
                        className='px-3 py-1 text-white bg-red-500 rounded hover:bg-red-700'
                        onClick={() => setSelectedTax(tax)}
                      >
                        <MdOutlineDelete />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            onClick={generatePDFReport}
            className='flex items-center px-4 py-2 mt-4 font-bold text-white bg-purple-600 rounded hover:bg-purple-800'
          >
            Generate PDF Report
          </button>
        </div>
      )}

    {selectedTax && (
      <DeleteTaxRelief
        taxRelief={selectedTax}
        onClose={() => setSelectedTax(null)}
        onDelete={handleDelete}
      />
    )}
    </Dashboard>
  );
};

export default TaxReliefCalculation;