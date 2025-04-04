import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", id);
        const response = await axios.get(`http://localhost:5559/product/${id}`);
        console.log("Fetched product:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br ">
        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-[35rem] backdrop-blur-lg border border-gray-300">
          <h2 className="mb-6 text-4xl font-extrabold tracking-wide text-center text-gray-900">
            Product Details
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 animate-pulse">Loading...</p>
          ) : error ? (
            <p className="font-medium text-center text-red-500">{error}</p>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-lg shadow-md bg-gray-50">
                <p className="text-lg">
                  <strong className="text-gray-700">Product ID:</strong> {product.productID}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Name:</strong> {product.name}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Category:</strong> {product.category}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Price:</strong> ${product.price}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Quantity:</strong> {product.quantity}
                </p>
              </div>

              <div className="p-4 rounded-lg shadow-md bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800">Address</h3>
                <p className="text-lg">{product.address.number}, {product.address.street}</p>
                <p className="text-lg">{product.address.city}, {product.address.country}</p>
                <p className="text-lg">{product.address.postalCode}</p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="px-6 py-2 font-semibold text-gray-800 transition-all bg-gray-300 rounded-lg shadow-md hover:bg-gray-400"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  className="px-6 py-2 font-semibold text-white transition-all bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-600"
                  onClick={() => navigate(`/product/edit/${product._id}`)}
                >
                  Edit Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default ViewProduct;
