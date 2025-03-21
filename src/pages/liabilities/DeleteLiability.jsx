import axios from 'axios';
import PropTypes from 'prop-types';

const DeleteLiability = ({ liability, onClose, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5559/liability/${liability._id}`);
            onDelete(liability._id); // Update the liability list after deletion
        } catch (error) {
            console.error('Error deleting liability:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[22rem] text-center">
                <h2 className="text-xl font-bold mb-4">Delete Liability?</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{liability.name}</strong>?</p>
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

DeleteLiability.propTypes = {
    liability: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DeleteLiability;