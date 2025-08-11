// frontend/src/api/menuItemApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error('Environment variable REACT_APP_API_URL is not set!');
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
        const response = await axios.get(`${API_URL}/api/menu-items`, { 
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching menu items:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch menu items.');
    }
};

// --- Get Menu Item By ID ---
export const getMenuItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/menu-items/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu item with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch menu item.');
    }
};

// --- Create Menu Item ---
export const createMenuItem = async (menuItemData) => {
    try {
        const response = await axios.post(`${API_URL}/api/menu-items`, menuItemData, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('Error creating menu item:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create menu item.');
    }
};

// --- Update Menu Item ---
export const updateMenuItem = async (id, menuItemData) => {
    try {
        const response = await axios.put(`${API_URL}/api/menu-items/${id}`, menuItemData, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error(`Error updating menu item with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update menu item.');
    }
};

// --- Update Menu Item Availability ---
export const updateMenuItemAvailability = async (id, isAvailable) => {
    try {
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
        await axios.delete(`${API_URL}/api/menu-items/${id}`, {
            headers: getAuthHeaders(),
        });
        return { success: true }; 
    } catch (error) {
        console.error(`Error deleting menu item with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete menu item.');
    }
};