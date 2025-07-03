import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};