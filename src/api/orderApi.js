// frontend/src/api/orderApi.js
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


export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/api/orders`, orderData, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Create Order Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create order.');
    }
};

// --- Payment Initiation ---
export const initiatePayment = async (orderId, userEmail) => {
    try {
        const response = await axios.post(`${API_URL}/api/orders/${orderId}/initiate-payment`, { email: userEmail }, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Initiate Payment Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to initiate payment.');
    }
};

export const getMyOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Get My Orders Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch your orders.');
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Get Order By ID Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch order details.');
    }
};

export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orders`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Get All Orders (Admin) Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch all orders for admin.');
    }
};

// --- Admin: Update Order Status ---
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status }, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Update Order Status (Admin) Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update order status.');
    }
};

export const verifyPayment = async (orderId, reference) => {
    try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}/verify-payment?reference=${reference}`, {
            headers: getAuthHeaders(),
        });
        return response.data; 
    } catch (error) {
        console.error('API Verify Payment Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to verify payment.');
    }
};
