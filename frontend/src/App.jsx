import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import HelloPage from './pages/HelloPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminReviewsPage from './pages/admin/AdminReviewsPage.jsx';
import { getUserProfile } from './api/apiService.js';

function App() {
    // State to manage if the user is currently logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to store the role of the logged-in user (e.g., 'USER' or 'ADMIN')
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // This function checks for a token in local storage to determine auth state
        const checkAuthAndFetchRole = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    // If a token exists, fetch the user's profile to get their role
                    const response = await getUserProfile();
                    setUserRole(response.data.role); // Set the user's role
                } catch (error) {
                    console.error("Could not fetch user profile", error);
                    // If the token is invalid or expired, clear the auth state
                    setIsAuthenticated(false);
                    setUserRole(null);
                    localStorage.removeItem('token');
                }
            }
        };
        checkAuthAndFetchRole();
    }, [isAuthenticated]); // This effect re-runs whenever the isAuthenticated state changes

    // This handler is passed down to components like the login page to update the app's auth state
    const handleSetIsAuthenticated = (authStatus) => {
        setIsAuthenticated(authStatus);
        // If the user is logging out, also clear their role
        if (!authStatus) {
            setUserRole(null);
        }
    };

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                {/* Navbar is displayed on all pages and receives auth state and role */}
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={handleSetIsAuthenticated} userRole={userRole} />
                <main className="flex-grow">
                    <Routes>
                        {/* --- Public Routes --- */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/hello" element={<HelloPage />} />
                        <Route
                            path="/auth"
                            element={<AuthPage setIsAuthenticated={handleSetIsAuthenticated} />}
                        />

                        {/* --- Authenticated User Routes --- */}
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/order" element={<OrderPage />} />

                        {/* --- Admin-Only Routes --- */}
                        {/* The AdminLayout provides the sidebar for all nested admin pages */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProductsPage />} />
                            <Route path="products/new" element={<AdminProductForm />} />
                            <Route path="products/edit/:id" element={<AdminProductForm />} />
                            <Route path="orders" element={<AdminOrdersPage />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="reviews" element={<AdminReviewsPage />} />
                        </Route>
                    </Routes>
                </main>
                {/* Footer is displayed on all pages */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;


