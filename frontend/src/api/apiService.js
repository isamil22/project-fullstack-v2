import axios from 'axios';

const apiService = axios.create({
    baseURL: '/api',
});

apiService.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// --- Existing Functions ---
export const getAllProducts = () => {
    return apiService.get('/products');
};

export const getProductById = (id) => {
    return apiService.get(`/products/${id}`);
};

export const getHelloMessage = () => {
    return apiService.get('/hello');
};

export const registerUser = (userData) => {
    return apiService.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
    return apiService.post('/auth/login', credentials);
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};

export const getUserProfile = () => {
    return apiService.get('/auth/user/profile');
};

export const getCart = () => {
    return apiService.get('/cart');
};

export const removeCartItem = (productId) => {
    return apiService.delete(`/cart/${productId}`);
};

export const addToCart = (productId, quantity) => {
    return apiService.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
};


export const createOrder = (orderData) => {
    return apiService.post(`/orders?address=${orderData.address}&phoneNumber=${orderData.phoneNumber}`);
};

// --- New Function for User Orders ---
export const getUserOrders = () => {
    return apiService.get('/orders/user');
};

// --- ADMIN FUNCTIONS ---
export const createProduct = (productData) => {
    return apiService.post('/products', productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateProduct = (id, productData) => {
    return apiService.put(`/products/${id}`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProduct = (id) => {
    return apiService.delete(`/products/${id}`);
};

export const getAllCategories = () => {
    return apiService.get('/categories');
};

export const getAllOrders = () => {
    return apiService.get('/orders');
};

export const updateOrderStatus = (orderId, status) => {
    return apiService.put(`/orders/${orderId}/status?status=${status}`);
};


// --- USER MANAGEMENT ADMIN FUNCTIONS ---
export const getAllUsers = () => {
    return apiService.get('/users');
};

export const updateUserRole = (userId, role) => {
    return apiService.put(`/users/${userId}/role?role=${role}`);
};

export const deleteUser = (userId) => {
    return apiService.delete(`/users/${userId}`);
};