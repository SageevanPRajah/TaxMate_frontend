import axios from 'axios';
import PropTypes from 'prop-types';

const DeleteProduct = ({ asset, onClose, onDelete }) => {
  const handleDelete = async () => {
    if (!asset._id) {
      console.error('Product is undefined');
      return;
    }
    try {
      await axios.delete(`http://localhost:5559/asset/${asset._id}`);
      onDelete(asset._id); // Update the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[22rem] text-center">
        <h2 className="mb-4 text-xl font-bold">Delete Product?</h2>
        <p className="mb-6 text-gray-600">Are you sure you want to delete <strong>{asset.name}</strong>?</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
DeleteProduct.propTypes = {
  asset: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};


export default DeleteProduct;

