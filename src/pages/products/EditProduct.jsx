import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../../components/Dashboard.jsx';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5559/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError('Failed to fetch product data.');
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

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
      await axios.put(`http://localhost:5559/product/${id}`, product);
      navigate('/product');
    } catch (error) {
      setError('Failed to update product.');
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] backdrop-blur-lg">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Edit Product</h2>
          {error && <p className="mb-3 text-center text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" name="productID" placeholder="Product ID" className="p-3 border border-gray-300 rounded" value={product.productID} onChange={handleChange} required />
              <input type="text" name="name" placeholder="Product Name" className="p-3 border border-gray-300 rounded" value={product.name} onChange={handleChange} required />
              <input type="text" name="category" placeholder="Category" className="p-3 border border-gray-300 rounded" value={product.category} onChange={handleChange} required />
              <input type="number" name="price" placeholder="Price" className="p-3 border border-gray-300 rounded" value={product.price} onChange={handleChange} required />
              <input type="number" name="quantity" placeholder="Quantity" className="p-3 border border-gray-300 rounded" value={product.quantity} onChange={handleChange} required />

              {/* Address Fields */}
              {Object.keys(product.address).map((field) => (
                <input key={field} type="text" name={`address.${field}`} placeholder={field} className="p-3 border border-gray-300 rounded" value={product.address[field]} onChange={handleChange} required />
              ))}
            </div>

            <button type="submit" className="w-full py-3 mt-4 font-semibold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default EditProduct;
