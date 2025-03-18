import React from 'react';
import axios from 'axios';

const DeleteProduct = ({ product, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5559/product/${product._id}`);
      onDelete(product._id); // Update the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[22rem] text-center">
        <h2 className="text-xl font-bold mb-4">Delete Product?</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{product.name}</strong>?</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
