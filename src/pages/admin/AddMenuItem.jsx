// frontend/src/pages/admin/AddMenuItem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for direct API calls
import { createMenuItem } from '../../api/menuItemApi'; // Assuming this API handles sending the URL
import { getCategories } from '../../api/categoryApi';
import { toast } from 'react-hot-toast'; // Using react-hot-toast for consistency

// Define API_URL and getAuthHeaders directly in this file
// REACT_APP_API_URL is expected to be http://localhost:5001 or your base Render URL
const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {}; // Content-Type will be set automatically by FormData, do not manually set to application/json
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const AddMenuItem = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null); // State to store the selected image file
  const [uploadingImage, setUploadingImage] = useState(false); // State for image upload loading
  const [isAvailable, setIsAvailable] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // For form submission loading
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
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

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const uploadImageToServer = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      // CRITICAL: 'menuImage' must match the fieldname in multer.single('menuImage') in uploadRoutes.js
      formData.append('menuImage', file); 

      // Make a POST request to your backend's upload endpoint
      const response = await axios.post(`${API_URL}/api/upload/menu-item-image`, formData, {
        headers: {
          ...getAuthHeaders(),
          // 'Content-Type': 'multipart/form-data' is automatically set by Axios when using FormData
          // Do NOT set it manually here, as it can cause issues.
        },
        // You can add onUploadProgress here if you want to show progress
        // onUploadProgress: (event) => {
        //   const percent = Math.round((event.loaded * 100) / event.total);
        //   // Update a state variable for progress bar if you have one
        // }
      });

      if (response.data && response.data.imageUrl) {
        toast.success('Image uploaded successfully!');
        return response.data.imageUrl; // Return the URL from the backend
      } else {
        throw new Error('Backend did not return image URL.');
      }

    } catch (error) {
      console.error('Error during image upload process:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to upload image.');
      setImageFile(null); // Clear selected file on error
      return null;
    } finally {
      setUploadingImage(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let uploadedImageUrl = '';

    if (imageFile) {
      uploadedImageUrl = await uploadImageToServer(imageFile);
      if (!uploadedImageUrl) {
        setLoading(false);
        return; // Stop form submission if image upload failed
      }
    }

    try {
      const newMenuItem = {
        name,
        description,
        price: parseFloat(price),
        category_id: categoryId,
        image_url: uploadedImageUrl, // Use the URL returned by the backend
        is_available: isAvailable,
      };
      await createMenuItem(newMenuItem); // Send menu item data with the image URL
      toast.success('Menu item added successfully!');
      navigate('/admin/menu');
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
            disabled={loading || uploadingImage}
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
            disabled={loading || uploadingImage}
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
            step="0.01"
            required
            disabled={loading || uploadingImage}
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
            disabled={loading || fetchingCategories || uploadingImage}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {/* Image Upload Section */}
        <div className="mb-3">
          <label htmlFor="itemImageUpload" className="form-label">Upload Image (Optional)</label>
          <input
            type="file"
            className="form-control"
            id="itemImageUpload"
            accept="image/*" // Only allow image files
            onChange={handleImageFileChange}
            disabled={loading || uploadingImage}
          />
          {imageFile && !uploadingImage && (
            <small className="text-muted mt-1 d-block">Selected file: {imageFile.name}</small>
          )}
          {uploadingImage && (
            <div className="progress mt-2">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `100%` }} // Placeholder as actual progress needs onUploadProgress
                aria-valuenow={100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                Uploading...
              </div>
            </div>
          )}
        </div>
        {/* End Image Upload Section */}

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isAvailable"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            disabled={loading || uploadingImage}
          />
          <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
          {loading ? 'Adding...' : 'Add Menu Item'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/admin/menu')}
          disabled={loading || uploadingImage}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;
