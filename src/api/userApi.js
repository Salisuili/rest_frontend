// frontend/src/api/userApi.js
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

// --- Get User's Addresses ---
export const getUserAddresses = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/users/me/addresses`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Get User Addresses Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch user addresses.');
    }
};

// --- Add New User Address ---
export const addUserAddress = async (addressData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/me/addresses`, addressData, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Add User Address Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to add new address.');
    }
};


// Get all users (for admin panel)
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/users`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Get All Users Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch all users.');
    }
};

// Delete a user by ID (for admin panel)
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/users/${userId}`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Delete User Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete user.');
    }
};

export const updateUserRole = async (userId, newRole) => {
    try {
        const response = await axios.put(`${API_URL}/api/users/${userId}/role`, { role: newRole }, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Update User Role Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update user role.');
    }
};