import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productID: '',
    name: '',
    category: '',
    price: '',
    quantity: '',
    address: {
      number: '',
      street: '',
      city: '',
      country: '',
      postalCode: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProduct((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5559/product', product);
      navigate('/product');
    } catch (error) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg'>
          <h2 className='mb-6 text-3xl font-bold text-center text-gray-800'>Create Product</h2>
          {error && <p className='mb-3 text-center text-red-500'>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 gap-4'>
              <input type='text' name='productID' placeholder='Product ID' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='text' name='name' placeholder='Product Name' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='text' name='category' placeholder='Category' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='number' name='price' placeholder='Price' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='number' name='quantity' placeholder='Quantity' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />

              {/* Address Fields */}
              <input type='text' name='address.number' placeholder='Address Number' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='text' name='address.street' placeholder='Street' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='text' name='address.city' placeholder='City' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='text' name='address.country' placeholder='Country' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
              <input type='text' name='address.postalCode' placeholder='Postal Code' className='p-3 border border-gray-300 rounded' onChange={handleChange} required />
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

export default CreateProduct;
