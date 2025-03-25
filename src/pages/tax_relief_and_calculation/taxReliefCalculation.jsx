import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteTaxRelief from './deleteTaxRelief';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TaxReliefCalculation = () => { 
  const [taxReliefs, setTaxReliefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null); 


  const [taxRates, setTaxRates] = useState([]);
 
  
  useEffect(() => {

    axios.get('http://localhost:5559/taxRate')
      .then(response => {
        console.log("API Response:", response.data);
        // Adjust based on API response structure
        setTaxRates(response.data.data || response.data); 
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  
        

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5559/taxRelief')
      .then(response => {
        console.log("API Response:", response.data);
        // Adjust based on API response structure
        setTaxReliefs(response.data.data || response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);


  const handleDelete = (id) => {
    setTaxReliefs(taxReliefs.filter(tax => tax._id !== id));
    setSelectedTax(null);
  };

  
  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text('Tax Relief Report', 14, 15);
  
    const tableColumn = [
      'User',
      'Year',
      'Income',
      'Deduction',
      'Tax Relief Entries',
      'Final Tax',
      'Status',
    ];
  
    const tableRows = [];
  
    taxReliefs.forEach((tax) => {
      const reliefDescriptions = tax.taxReliefs?.map((entry) => {
        return `ID: ${entry.taxReliefID}, Desc: ${entry.taxReliefDescription}, Amt: ${entry.reliefAmount}`;
      }).join('\n') || 'No entries';
  
      const rowData = [
        tax.userID,
        tax.year,
        tax.income,
        tax.deduction,
        reliefDescriptions,
        tax.finalTaxAmount,
        tax.status
      ];
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });
  
    doc.save('tax_relief_report.pdf');
  };
  


 

  

  


  
  

  return (
    <Dashboard>
<h2 className='text-3xl font-bold'>Tax Rate Slabs</h2>
<div className='p-4 mb-6 bg-white rounded-lg shadow-md'>
  
  <div className='flex justify-end gap-2 pt-2 pb-4'>
    
    <div className='flex gap-2'>
      <Link
        to='/taxRelief/addTaxRate'
        className='flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-800'
      >
        <MdOutlineAddBox className='mr-2' />
        Add Slab
      </Link>
      <Link
                to={`/taxRelief/editTaxrate/:id`} 
                className='flex items-center px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-800'
              >
                <AiOutlineEdit className='mr-2' />
                Edit Slab
              </Link>
      <Link
      
        to={`/taxRelief/deleteTaxRate/:id`} 
        className='flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800'
      >
        <MdOutlineDelete className='mr-2' />
        Delete Slabs 
      </Link>
    </div>
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
        taxRates.map((slab, ) => (
          <tr key={slab._id} className='border-b hover:bg-gray-50'>
            
            <td className='p-3'>{slab.incomeTaxSlab}</td>
            <td className='p-3'>{slab.taxRate}%</td>
            
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3} className='p-4 text-center text-gray-500'>
            No tax slabs available.
          </td>
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
          
          <div className='flex justify-end gap-2 pt-2 pb-4'>
           <Link 
            to='/taxRelief/addTaxRelief' 
             className='flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-800'
            >
             <MdOutlineAddBox className='mr-2' />
              Add Tax Relief
            </Link>
          </div>
        
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-200'>
                
                <th className='p-3 text-left'>User</th>
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
              {taxReliefs.map((tax, index) => (
                <tr key={tax._id || index} className='border-b hover:bg-gray-100'>
                  
                  <td className='p-3'>{tax.userID}</td>
                  <td className='p-3'>{tax.year}</td>
                  <td className='p-3'>{tax.income}</td>
                  <td className='p-3'>{tax.deduction}</td>
                  <td className='p-3'>
                    {tax.taxReliefs && tax.taxReliefs.length > 0 ? (
                      tax.taxReliefs.map((entry, idx) => (
                        <div key={idx} className='p-2 mb-2 border rounded'>
                          <div><strong>ID:</strong> {entry.taxReliefID}</div>
                          <div><strong>Description:</strong> {entry.taxReliefDescription}</div>
                          <div><strong>Amount:</strong> {entry.reliefAmount}</div>
                        </div>
                      ))
                    ) : (
                      <span>No entries</span>
                    )}
                  </td>
                  <td className='p-3'>{tax.finalTaxAmount}</td>
                  <td className='p-3'>{tax.status}</td>
                  <td className='flex gap-2 p-3'>
                    
                    <Link 
                      to={`/taxRelief/editTaxRelief/${tax._id}`} 
                      className='px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700'
                    >
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
              ))}
            </tbody>
          </table>
          <button
  onClick={generatePDFReport}
  className='flex items-center px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-800'
>
  Generate PDF Report
</button>
        </div>
      )}

      {/* Show Delete Modal if a tax relief record is selected */}
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
