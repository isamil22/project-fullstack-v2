// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HelloPage from './pages/HelloPage';
import AuthPage from './pages/AuthPage'; // 1. Import AuthPage

function App() {
    // 2. Manage authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Effect to check token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                {/* 3. Pass state to Navbar */}
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/hello" element={<HelloPage />} />
                        {/* 4. Add the route for the authentication page */}
                        <Route
                            path="/auth"
                            element={<AuthPage setIsAuthenticated={setIsAuthenticated} />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;

