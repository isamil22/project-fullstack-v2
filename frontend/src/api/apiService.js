// src/api/apiService.js
import axios from 'axios';

// Create an instance of axios
const apiService = axios.create({
    baseURL: '/api', // The base URL will be proxied by Vite
});

// Example function to fetch all products
export const getAllProducts = () => {
    return apiService.get('/products');
};

// Example function to fetch a single product by ID
export const getProductById = (id) => {
    return apiService.get(`/products/${id}`);
};

// You can add all your other API calls here
// e.g., login, register, addToCart, etc.