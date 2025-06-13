import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                            <Link to="/cart" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Cart</Link>
                            <Link to="/profile" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                            <Link to="/admin" className="text-gray-500 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Admin</Link>
                            <Link to="/auth" className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-medium">Login</Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-pink-500 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-pink-600 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                    <Link to="/products" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Products</Link>
                    <Link to="/cart" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Cart</Link>
                    <Link to="/profile" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                    <Link to="/admin" className="text-gray-500 hover:bg-pink-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                    <Link to="/auth" className="bg-pink-500 text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;