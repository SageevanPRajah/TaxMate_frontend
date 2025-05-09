// DeleteTaxRelief.jsx
import PropTypes from 'prop-types';
import axios from 'axios';

const DeleteTaxRelief = ({ taxRelief, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5559/taxRelief/${taxRelief._id}`);
      onDelete(taxRelief._id);
    } catch (error) {
      console.error('Error deleting tax relief:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[22rem] text-center">
        <h2 className="mb-4 text-xl font-bold">Delete tax relief?</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete{' '}
          <strong>{taxRelief.taxReliefDescription}</strong>?
        </p>
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

DeleteTaxRelief.propTypes = {
  taxRelief: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taxReliefDescription: PropTypes.string.isRequired,
  }).isRequired,
  onClose:   PropTypes.func.isRequired,
  onDelete:  PropTypes.func.isRequired,
};

export default DeleteTaxRelief;
