import PropTypes from 'prop-types';
import axios from 'axios';

const DeleteAsset = ({ asset, onClose, onDelete }) => {
  const handleDelete = async () => {
    console.log('Deleting asset:', asset._id);
    if (!asset._id) {
      console.error('Asset is undefined');
      return;
    }
    try {
      await axios.delete(`http://localhost:5559/asset/${asset._id}`);
      onDelete(); // Update the asset list after deletion
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[22rem] text-center">
        <h2 className="text-xl font-bold mb-4">Delete Asset?</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{asset.assetName}</strong>?</p>
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

DeleteAsset.propTypes = {
  asset: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    assetName: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteAsset;

