//import API from './api';
//
//export const login = (username, password) => {
//  return API.post('/auth/login', { username, password });
//};
//
//export const register = (username, password, role) => {
//  return API.post('/auth/register', { username, password, role });
//};
//
//export const getCurrentUser = () => {
//  return API.get('/auth/me');
//};

import axios from 'axios';

// Create instance with credentials
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true
});

export const login = (credentials) => API.post('/api/auth/login', credentials);
