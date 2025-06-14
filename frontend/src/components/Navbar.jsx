import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/apiService';

const Navbar = ({ isAuthenticated, setIsAuthenticated, userRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        setIsAuthenticated(false); // This will clear the role in App.jsx
        navigate('/auth');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-pink-500">
                            BeautyCosmetics
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/products" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Products</Link>

                            {/* Show Admin link only if user role is ADMIN */}
                            {userRole === 'ADMIN' && (
                                <Link to="/admin/dashboard" className="font-bold text-pink-500 hover:text-pink-600 px-3 py-2 rounded-md text-sm">
                                    Admin
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <Link to="/cart" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Cart</Link>
                                    <Link to="/profile" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/auth" className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-pink-500 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-pink-600 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                    <Link to="/products" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Products</Link>

                    {userRole === 'ADMIN' && (
                        <Link to="/admin/dashboard" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Cart</Link>
                            <Link to="/profile" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left bg-pink-500 text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className="bg-pink-500 text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;