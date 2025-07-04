// frontend/src/api/auth.js
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

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, userData);
        localStorage.setItem('token', response.data.token);
        return { success: true, token: response.data.token, user: response.data.user };
    } catch (error) {
        console.error('API Register Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Registration failed due to network or server error.');
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
        localStorage.setItem('token', response.data.token);
        return { success: true, token: response.data.token, user: response.data.user };
    } catch (error) {
        console.error('API Login Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Login failed due to network or server error.');
    }
};

// --- Corrected Get Profile Function ---
export const getProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: getAuthHeaders()
        });

        // --- THE CHANGE IS HERE ---
        // Your backend directly returns the user object, so just return response.data
        return response.data; // <--- CORRECTED: Return the user object directly
    } catch (error) {
        console.error('API Get Profile Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch user profile.');
    }
};