// frontend/src/pages/admin/MenuItems.jsx
import React, { useEffect, useState } from 'react'; // Added React import
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // For notifications
import { getMenuItems, updateMenuItemAvailability, deleteMenuItem } from '../../api/menuItemApi'; // <--- NEW IMPORTS
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Assuming you have this

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenuItems(); // Fetch data from the API
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err.message || 'Failed to load menu items.');
      toast.error(err.message || 'Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems(); // Run on component mount
  }, []); // Empty dependency array

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const updatedItem = await updateMenuItemAvailability(id, !currentStatus);
      setMenuItems(prevItems =>
        prevItems.map(item => (item.id === id ? updatedItem : item))
      );
      toast.success(`Item status updated to ${updatedItem.is_available ? 'Available' : 'Unavailable'}.`);
    } catch (err) {
      console.error('Error toggling availability:', err);
      toast.error(err.message || 'Failed to update item availability.');
    }
  };

  const handleDeleteMenuItem = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMenuItem(id);
        setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.success(`"${name}" deleted successfully.`);
      } catch (err) {
        console.error('Error deleting menu item:', err);
        toast.error(err.message || 'Failed to delete menu item.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Menu Items</h2>
        <Link to="/admin/menu/new" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          {menuItems.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No menu items found. Click "Add New Item" to get started!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      {/* Access category name from the joined data.
                          Backend is sending it as `category_name` after flattening. */}
                      <td>{item.category_name || 'N/A'}</td> 
                      <td>₦{item.price.toLocaleString('en-US')}</td>
                      <td>
                        <span className={`badge ${
                          item.is_available ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleToggleAvailability(item.id, item.is_available)}
                        >
                          {item.is_available ? 'Disable' : 'Enable'}
                        </button>
                        <Link 
                          to={`/admin/menu/${item.id}/edit`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          Edit
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteMenuItem(item.id, item.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItems;