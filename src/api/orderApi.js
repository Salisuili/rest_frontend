// frontend/src/api/orderApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Expected to be http://localhost:5000 or your base Render URL

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

// --- Order Creation ---
export const createOrder = async (orderData) => {
    try {
        // FIX: Added '/api' prefix to the endpoint path
        const response = await axios.post(`${API_URL}/api/orders`, orderData, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting the created order object from your backend
    } catch (error) {
        console.error('API Create Order Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create order.');
    }
};

// --- Payment Initiation ---
export const initiatePayment = async (orderId, userEmail) => {
    try {
        // FIX: Added '/api' prefix to the endpoint path
        const response = await axios.post(`${API_URL}/api/orders/${orderId}/initiate-payment`, { email: userEmail }, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting Paystack authorization_url etc.
    } catch (error) {
        console.error('API Initiate Payment Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to initiate payment.');
    }
};

// --- Get User's Orders ---
export const getMyOrders = async () => {
    try {
        // FIX: Added '/api' prefix to the endpoint path
        const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting an array of user's orders
    } catch (error) {
        console.error('API Get My Orders Error:', error.response?.data || error.message);
        // FIX: Corrected 'new new Error' to 'new Error'
        throw new Error(error.response?.data?.error || 'Failed to fetch your orders.');
    }
};

// --- Get Single Order by ID ---
export const getOrderById = async (orderId) => {
    try {
        // FIX: Added '/api' prefix to the endpoint path
        const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting a single order object
    } catch (error) {
        console.error('API Get Order By ID Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch order details.');
    }
};

// --- Admin: Get All Orders ---
export const getAllOrders = async () => {
    try {
        // FIX: Added '/api' prefix to the endpoint path
        const response = await axios.get(`${API_URL}/api/orders`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting an array of all orders
    } catch (error) {
        console.error('API Get All Orders (Admin) Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch all orders for admin.');
    }
};

// --- Admin: Update Order Status ---
export const updateOrderStatus = async (orderId, status) => {
    try {
        // FIX: Added '/api' prefix to the endpoint path AND captured response
        const response = await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status }, {
            headers: getAuthHeaders(),
        });
        return response.data; // Now 'response' is defined
    } catch (error) {
        console.error('API Update Order Status (Admin) Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update order status.');
    }
};

// --- Payment Verification (if needed client-side, though often webhook-driven) ---
export const verifyPayment = async (orderId, reference) => {
    try {
        // FIX: Added '/api' prefix to the endpoint path
        const response = await axios.get(`${API_URL}/api/orders/${orderId}/verify-payment?reference=${reference}`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Expecting payment verification status
    } catch (error) {
        console.error('API Verify Payment Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to verify payment.');
    }
};
