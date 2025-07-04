// frontend/src/api/adminApi.js
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

export const getDashboardData = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
            headers: getAuthHeaders(),
        });
        return response.data; // This will contain { stats, recentOrders }
    } catch (error) {
        console.error('Error fetching dashboard data:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch dashboard data.');
    }
};