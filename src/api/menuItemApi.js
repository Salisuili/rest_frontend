// frontend/src/api/menuItemApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error('Environment variable REACT_APP_API_URL is not set!');
    // For local development, you might set a default here:
    // API_URL = 'http://localhost:5000';
}

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

// --- Get All Menu Items ---
export const getMenuItems = async () => {
    try {
        // Ensure this matches your backend route, e.g., router.get('/api/menu-items', ...)
        const response = await axios.get(`${API_URL}/api/menu-items`, { 
            headers: getAuthHeaders(),
        });
        return response.data; // Array of menu item objects
    } catch (error) {
        console.error('Error fetching menu items:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch menu items.');
    }
};

// --- Get Menu Item By ID (NEWLY ADDED) ---
export const getMenuItemById = async (id) => {
    try {
        // Ensure this matches your backend route, e.g., router.get('/api/menu-items/:id', ...)
        const response = await axios.get(`${API_URL}/api/menu-items/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu item with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch menu item.');
    }
};

// --- Create Menu Item (NEWLY ADDED) ---
export const createMenuItem = async (menuItemData) => {
    try {
        // Ensure this matches your backend route, e.g., router.post('/api/menu-items', ...)
        const response = await axios.post(`${API_URL}/api/menu-items`, menuItemData, {
            headers: getAuthHeaders(),
        });
        return response.data; // The newly created menu item
    } catch (error) {
        console.error('Error creating menu item:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create menu item.');
    }
};

// --- Update Menu Item (for full edits) (NEWLY ADDED) ---
export const updateMenuItem = async (id, menuItemData) => {
    try {
        // Ensure this matches your backend route, e.g., router.put('/api/menu-items/:id', ...)
        const response = await axios.put(`${API_URL}/api/menu-items/${id}`, menuItemData, {
            headers: getAuthHeaders(),
        });
        return response.data; // The updated menu item
    } catch (error) {
        console.error(`Error updating menu item with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update menu item.');
    }
};

// --- Update Menu Item Availability ---
export const updateMenuItemAvailability = async (id, isAvailable) => {
    try {
        // Ensure this matches your backend route, e.g., router.patch('/api/menu-items/:id/availability', ...)
        const response = await axios.patch(`${API_URL}/api/menu-items/${id}/availability`, { is_available: isAvailable }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating menu item availability for ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update item availability.');
    }
};

// --- Delete Menu Item ---
export const deleteMenuItem = async (id) => {
    try {
        // Ensure this matches your backend route, e.g., router.delete('/api/menu-items/:id', ...)
        await axios.delete(`${API_URL}/api/menu-items/${id}`, {
            headers: getAuthHeaders(),
        });
        return { success: true }; // No content, just success
    } catch (error) {
        console.error(`Error deleting menu item with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete menu item.');
    }
};