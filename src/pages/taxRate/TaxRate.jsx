import { useEffect, useState } from 'react';  
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';




const TaxRate = () => { 
  
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(true);
  

  

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5559/taxRate')
      .then(response => {
        setTaxRates(response.data.data || response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  

  return (
    <Dashboard>
       
      <h2 className='text-3xl font-bold'>Tax Rate Slabs</h2>
      <div className='p-4 mb-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-end gap-2 pt-2 pb-4'>
          <div className='flex gap-2'>
            <Link to='/taxRate/addTaxRate' className='flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-800'>
              <MdOutlineAddBox className='mr-2' /> Add Slab
            </Link>
            <Link to={`/taxRate/editTaxrate/:id`} className='flex items-center px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-800'>
              <AiOutlineEdit className='mr-2' /> Edit Slab
            </Link>
            <Link to={`/taxRate/deleteTaxRate/:id`} className='flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800'>
              <MdOutlineDelete className='mr-2' /> Delete Slabs
            </Link>
          </div>
        </div>
        
        {loading ? (
        <Spinner />
      ) : (
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
        )}
      </div>
        
     
      
    </Dashboard>
  );
  
};

export default TaxRate;