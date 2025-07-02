// frontend/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser, getUserProfile } from '../api/apiService';
import ReCAPTCHA from 'react-google-recaptcha'; // 1. IMPORT ReCAPTCHA

const AuthPage = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [recaptchaToken, setRecaptchaToken] = useState(null); // 2. ADD STATE FOR THE TOKEN
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
                // Login logic remains unchanged
                // ...
            } else {
                // 4. VALIDATE AND INCLUDE TOKEN IN REGISTRATION
                if (!recaptchaToken) {
                    setError('Please complete the reCAPTCHA.');
                    return;
                }
                // Add the token to the form data being sent
                await registerUser({ ...formData, recaptchaToken });
                setSuccess('Registration successful! Redirecting to email confirmation...');
                navigate(`/confirm-email/${formData.email}`);
            }
        } catch (err) {
            // ... error handling remains the same
        }
    };

    const toggleForm = () => {
        // ... toggleForm logic remains the same
    };

    return (
        <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                {/* ... form header ... */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        {/* ... form inputs for name, email, password ... */}
                    </div>

                    {/* 3. ADD THE RECAPTCHA COMPONENT TO THE REGISTRATION FORM */}
                    {!isLogin && (
                        <div className="flex justify-center my-4">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={(token) => setRecaptchaToken(token)}
                                onExpired={() => setRecaptchaToken(null)}
                            />
                        </div>
                    )}

                    {/* ... rest of the form ... */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            {isLogin ? 'Sign in' : 'Register'}
                        </button>
                    </div>
                </form>
                {/* ... toggle button ... */}
            </div>
        </div>
    );
};

export default AuthPage;