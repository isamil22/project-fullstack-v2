import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/apiService';

/**
 * AuthPage component for user login and registration.
 * @param {object} props - The component props.
 * @param {function} props.setIsAuthenticated - Function to update the authentication state in the parent component.
 */
const AuthPage = ({ setIsAuthenticated }) => {
    // State to toggle between Login and Register forms
    const [isLogin, setIsLogin] = useState(true);
    // State for form data
    const [formData, setFormData] = useState({ email: '', password: '' });
    // State for error messages
    const [error, setError] = useState('');
    // State for success messages
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    /**
     * Handles changes in form input fields.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    /**
     * Handles form submission for both login and registration.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                // Handle login
                const response = await loginUser(formData);
                localStorage.setItem('token', response.data);
                setIsAuthenticated(true); // Update global auth state
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => navigate('/'), 1500); // Redirect to home page
            } else {
                // Handle registration
                await registerUser(formData);
                setSuccess('Registration successful! You can now log in.');
                setIsLogin(true); // Switch to the login form
            }
        } catch (err) {
            // Set error message from API response or a generic one
            const errorMessage = err.response?.data?.message || err.response?.data || 'An error occurred. Please try again.';
            setError(errorMessage);
        }
    };

    /**
     * Toggles between the login and registration forms.
     */
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setFormData({ email: '', password: '' });
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
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
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