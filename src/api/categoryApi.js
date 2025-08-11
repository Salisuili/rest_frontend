// frontend/src/api/categoryApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error('Environment variable REACT_APP_API_URL is not set!');
}

// Helper to get authenticated headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// --- Get All Categories ---
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/categories`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch categories.');
    }
};

// --- Add Category ---
export const addCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/api/categories`, categoryData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to add category.');
    }
};

// --- Update Category ---
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/api/categories/${id}`, categoryData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update category.');
    }
};

// --- Delete Category ---
export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/categories/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete category.');
    }
};