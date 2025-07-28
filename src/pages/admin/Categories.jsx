// frontend/src/pages/admin/Categories.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast for notifications
import { getCategories } from '../../api/categoryApi'; // We will create this file next
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Assuming you have a loading spinner component

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategories(); // Call the API to fetch categories
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to load categories.');
        toast.error(err.message || 'Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while data is being fetched
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Categories Management</h2>
        <Link to="/admin/categories/new" className="btn btn-primary">
          Add New Category
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          {categories.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No categories found. Click "Add New Category" to get started!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Image URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || 'N/A'}</td>
                      <td>
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                        ) : 'No Image'}
                      </td>
                      <td>
                        {/* <Link 
                          to={`/admin/categories/${category.id}/edit`} 
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          Edit
                        </Link> */}
                        <button className="btn btn-sm btn-outline-danger">
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

export default Categories;