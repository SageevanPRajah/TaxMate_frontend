import React, { useEffect, useState } from 'react';
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
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold'>Product List</h1>
        <Link to='/product/create' className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center'>
          <MdOutlineAddBox className='mr-2' />
          Add Product
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className='bg-white shadow-md rounded-lg p-4'>
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
                  <td className='p-3 flex gap-2'>
                    <Link to={`/product/detail/${product._id}`} className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded'>
                      <BsInfoCircle />
                    </Link>
                    <Link to={`/product/edit/${product._id}`} className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded'>
                      <AiOutlineEdit />
                    </Link>
                    <button
                      className='bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'
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
