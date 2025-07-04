// frontend/src/api/orderApi.js
import axios from 'axios';
import supabase from '../config/supabase'; // Keep your existing supabase import

const API_URL = process.env.REACT_APP_API_URL;

// Helper to get authenticated headers (crucial for backend calls)
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

// Existing functions (for customer-facing features)
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getOrders = async (userId) => { // This is for specific user's orders
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_items(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getOrderDetails = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_items(*))')
    .eq('id', orderId)
    .single();
  if (error) throw error;
  return data;
};

export const initiatePayment = async (orderId, email) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders/${orderId}/pay`, { email }, {
      headers: getAuthHeaders(), // Ensure headers are sent for backend protected routes
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to initiate payment.');
  }
};

// --- NEW FUNCTION FOR ADMIN DASHBOARD ---
export const getAdminOrders = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/api/orders`, {
            params: { page, limit }, // Pass pagination parameters to the backend
            headers: getAuthHeaders(), // Send auth token for protected admin route
        });
        return response.data; // This will return { currentPage, totalPages, totalOrders, orders }
    } catch (error) {
        console.error('Error fetching admin orders:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch admin orders.');
    }
};