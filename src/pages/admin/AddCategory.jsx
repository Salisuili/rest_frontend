// frontend/src/pages/admin/AddCategory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCategory } from '../../api/categoryApi'; 
import { toast } from 'react-toastify';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCategory = { name, description, image_url: imageUrl };
      await addCategory(newCategory); 
      toast.success('Category added successfully!');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to add category:', error);
      const errorMessage = error.response?.data?.error || 'Failed to add category. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoryDescription" className="form-label">Description (Optional)</label>
          <textarea
            className="form-control"
            id="categoryDescription"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="categoryImageUrl" className="form-label">Image URL (Optional)</label>
          <input
            type="url"
            className="form-control"
            id="categoryImageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/categories')}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCategory;