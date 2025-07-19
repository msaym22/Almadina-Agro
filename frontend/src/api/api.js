//import axios from 'axios';
//import { store } from '../app/store';
//
//const api = axios.create({
//  baseURL: 'http://localhost:5000', // Backend port
//  withCredentials: true,
//});
//
//API.interceptors.request.use((config) => {
//  const token = store.getState().auth.token;
//  if (token) {
//    config.headers.Authorization = `Bearer ${token}`;
//  }
//  return config;
//});
//
//API.interceptors.response.use(
//  (response) => response,
//  (error) => {
//    if (error.response && error.response.status === 401) {
//      // Handle unauthorized access
//    }
//    return Promise.reject(error);
//  }
//);
//
//export default API;


import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export default API;
