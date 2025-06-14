import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HelloPage from './pages/HelloPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
// UserOrdersPage is no longer needed
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import { getUserProfile } from './api/apiService';

function App() {
    // State for authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to store the user's role
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Function to check token and fetch user role
        const checkAuthAndFetchRole = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    // If authenticated, fetch the user's profile
                    const response = await getUserProfile();
                    setUserRole(response.data.role); // Store the role
                } catch (error) {
                    console.error("Could not fetch user profile", error);
                    // If token is invalid or expired, log the user out
                    setIsAuthenticated(false);
                    setUserRole(null);
                    localStorage.removeItem('token');
                }
            }
        };
        checkAuthAndFetchRole();
    }, [isAuthenticated]); // This effect runs when the authentication state changes

    // Create a handler to update auth state and clear role on logout
    const handleSetIsAuthenticated = (authStatus) => {
        setIsAuthenticated(authStatus);
        if (!authStatus) {
            setUserRole(null); // Clear role on logout
        }
    };

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                {/* Pass auth status, the handler, and user role to the Navbar */}
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={handleSetIsAuthenticated} userRole={userRole} />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/hello" element={<HelloPage />} />
                        <Route
                            path="/auth"
                            element={<AuthPage setIsAuthenticated={handleSetIsAuthenticated} />}
                        />

                        {/* Authenticated User Routes */}
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/order" element={<OrderPage />} />
                        {/* The /my-orders route is now removed */}

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProductsPage />} />
                            <Route path="products/new" element={<AdminProductForm />} />
                            <Route path="products/edit/:id" element={<AdminProductForm />} />
                            <Route path="orders" element={<AdminOrdersPage />} />
                            <Route path="users" element={<AdminUsersPage />} />
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;



