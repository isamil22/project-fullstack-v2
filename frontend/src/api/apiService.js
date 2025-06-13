import axios from 'axios';

// Create an instance of axios
const apiService = axios.create({
    baseURL: '/api', // The base URL will be proxied by Vite in development
});

// Add a request interceptor to include the token in headers for authenticated requests
apiService.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        // Add the Authorization header if a token is found
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// --- Product Functions ---

export const getAllProducts = () => {
    return apiService.get('/products');
};

export const getProductById = (id) => {
    return apiService.get(`/products/${id}`);
};

export const getHelloMessage = () => {
    return apiService.get('/hello');
};

// --- Authentication Functions ---

/**
 * Registers a new user.
 * @param {object} userData - The user's data (e.g., { email, password }).
 * @returns {Promise} A promise that resolves with the server's response.
 */
export const registerUser = (userData) => {
    return apiService.post('/auth/register', userData);
};

/**
 * Logs in a user.
 * @param {object} credentials - The user's credentials ({ email, password }).
 * @returns {Promise} A promise that resolves with the server's response, which should include the JWT.
 */
export const loginUser = (credentials) => {
    return apiService.post('/auth/login', credentials);
};

/**
 * Logs out the user by removing the token from local storage.
 */
export const logoutUser = () => {
    localStorage.removeItem('token');
};