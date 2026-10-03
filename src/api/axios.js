// src/api/axios.js
import axios from 'axios';

// Replace this with your actual backend URL (check your .env file if you have one)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; 

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Interceptor to attach auth tokens to every request if they exist
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Or however you store your token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;