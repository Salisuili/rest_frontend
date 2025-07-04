// frontend/src/pages/admin/AddMenuItem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMenuItem } from '../../api/menuItemApi';
import { getCategories } from '../../api/categoryApi'; 
import { toast } from 'react-toastify';

const AddMenuItem = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true); // For category loading
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id); // Set default to first category
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories. Cannot add menu item.');
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newMenuItem = {
        name,
        description,
        price: parseFloat(price), // Ensure price is a number
        category_id: categoryId,
        image_url: imageUrl,
        is_available: isAvailable,
      };
      await createMenuItem(newMenuItem);
      toast.success('Menu item added successfully!');
      navigate('/admin/menu'); // Navigate back to menu items list
    } catch (error) {
      console.error('Failed to add menu item:', error);
      const errorMessage = error.response?.data?.error || 'Failed to add menu item. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCategories) {
    return <div className="container mt-4">Loading categories...</div>;
  }

  if (categories.length === 0 && !fetchingCategories) {
    return (
        <div className="container mt-4 alert alert-warning">
            No categories found. Please add categories first before adding menu items.
            <button className="btn btn-primary ms-3" onClick={() => navigate('/admin/categories/new')}>Add Category</button>
        </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemDescription" className="form-label">Description (Optional)</label>
          <textarea
            className="form-control"
            id="itemDescription"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="itemPrice" className="form-label">Price (₦)</label>
          <input
            type="number"
            className="form-control"
            id="itemPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01" // Allows for decimal prices
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemCategory" className="form-label">Category</label>
          <select
            className="form-select"
            id="itemCategory"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={loading || fetchingCategories}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="itemImageUrl" className="form-label">Image URL (Optional)</label>
          <input
            type="url"
            className="form-control"
            id="itemImageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isAvailable"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            disabled={loading}
          />
          <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Menu Item'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/menu')}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;