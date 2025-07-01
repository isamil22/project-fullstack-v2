// frontend/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser, getUserProfile } from '../api/apiService';

const AuthPage = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                const loginData = { email: formData.email, password: formData.password };
                const response = await loginUser(loginData);
                localStorage.setItem('token', response.data);

                setIsAuthenticated(true);
                setSuccess('Login successful! Redirecting...');

                const profileResponse = await getUserProfile();
                const userRole = profileResponse.data.role;

                if (userRole === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                await registerUser(formData);
                // **** MODIFICATION START ****
                // Change the success message to guide the user to email confirmation.
                setSuccess('Registration successful! Please check your email for a confirmation code.');
                // Do not switch to the login form automatically. Let the user see the message.
                // setIsLogin(true);
                // **** MODIFICATION END ****
            }
        } catch (err) {
            // Check for the specific "User is disabled" error on login
            const errorMessage = err.response?.data?.message || err.response?.data || 'An error occurred. Please try again.';
            if (isLogin && err.response?.status === 403) { // Or whatever status your backend sends for disabled users
                setError('User is disabled. Please confirm your email address.');
            } else {
                setError(errorMessage);
            }
            setIsAuthenticated(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setFormData({ fullName: '', email: '', password: '' }); // Reset form
    };

    return (
        <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        {!isLogin && (
                            <div className="mb-2">
                                <label htmlFor="full-name" className="sr-only">Full name</label>
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    placeholder="Full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* **** MODIFICATION START **** */}
                        {/* Add a link to the email confirmation page */}
                        <div className="text-sm">
                            <Link to="/confirm-email"
                                  className="font-medium text-pink-600 hover:text-pink-500">
                                Already have a code? Confirm email
                            </Link>
                        </div>
                        <div className="text-sm">
                            <Link to="/forgot-password"
                                  className="font-medium text-pink-600 hover:text-pink-500">
                                Forgot your password?
                            </Link>
                        </div>
                        {/* **** MODIFICATION END **** */}
                    </div>

                    {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center font-medium">{success}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            {isLogin ? 'Sign in' : 'Register'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={toggleForm} className="font-medium text-pink-600 hover:text-pink-500">
                        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;