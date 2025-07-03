import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/api/menu/categories`);
  return response.data;
};

export const getMenuItems = async (categoryId = null, search = '') => {
  const params = {};
  if (categoryId) params.categoryId = categoryId;
  if (search) params.search = search;
  
  const response = await axios.get(`${API_URL}/api/menu/items`, { params });
  return response.data;
};

export const getMenuItem = async (id) => {
  const response = await axios.get(`${API_URL}/api/menu/items/${id}`);
  return response.data;
};