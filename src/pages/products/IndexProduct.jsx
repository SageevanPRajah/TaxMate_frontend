import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteProduct from './DeleteProduct';

const Index = () => { 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Stores product to delete

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5559/product')
      .then(response => {
        console.log("API Response:", response.data);
        setProducts(response.data.data || response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setProducts(products.filter(product => product._id !== id)); // Remove from UI
    setSelectedProduct(null); // Close modal
  };

  return (
    <Dashboard>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-3xl font-bold'>Product List</h1>
        <Link to='/product/create' className='flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-800'>
          <MdOutlineAddBox className='mr-2' />
          Add Product
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className='p-4 bg-white rounded-lg shadow-md'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='p-3 text-left'>No</th>
                <th className='p-3 text-left'>Product ID</th>
                <th className='p-3 text-left'>Name</th>
                <th className='p-3 text-left'>Category</th>
                <th className='p-3 text-left'>Price</th>
                <th className='p-3 text-left'>Quantity</th>
                <th className='p-3 text-left'>Address</th>
                <th className='p-3 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id || index} className='border-b hover:bg-gray-100'>
                  <td className='p-3'>{index + 1}</td>
                  <td className='p-3'>{product.productID}</td>
                  <td className='p-3'>{product.name}</td>
                  <td className='p-3'>{product.category}</td>
                  <td className='p-3'>{product.price}</td>
                  <td className='p-3'>{product.quantity}</td>
                  <td className='p-3'>
                    {`${product.address.number}, ${product.address.street}, ${product.address.city}, ${product.address.country}, ${product.address.postalCode}`}
                  </td>
                  <td className='flex gap-2 p-3'>
                    <Link to={`/product/detail/${product._id}`} className='px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-700'>
                      <BsInfoCircle />
                    </Link>
                    <Link to={`/product/edit/${product._id}`} className='px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700'>
                      <AiOutlineEdit />
                    </Link>
                    <button
                      className='px-3 py-1 text-white bg-red-500 rounded hover:bg-red-700'
                      onClick={() => setSelectedProduct(product)}
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show Delete Modal if a product is selected */}
      {selectedProduct && (
        <DeleteProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDelete={handleDelete}
        />
      )}
    </Dashboard>
  );
};

export default Index;
