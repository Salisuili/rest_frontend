import axios from 'axios';
import supabase from '../config/supabase';

const API_URL = process.env.REACT_APP_API_URL;

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getOrders = async (userId) => {
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
  const response = await axios.post(`${API_URL}/api/orders/${orderId}/pay`, { email });
  return response.data;
};