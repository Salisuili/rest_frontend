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
        // This hits your backend route: GET /api/users/me/addresses
        const response = await axios.get(`${API_URL}/api/users/me/addresses`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting an array of address objects
    } catch (error) {
        console.error('API Get User Addresses Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch user addresses.');
    }
};

// --- Add New User Address ---
export const addUserAddress = async (addressData) => {
    try {
        // This hits your backend route: POST /api/users/me/addresses
        const response = await axios.post(`${API_URL}/api/users/me/addresses`, addressData, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting the newly created address object
    } catch (error) {
        console.error('API Add User Address Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to add new address.');
    }
};

// You can add update and delete address functions here later