import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/apiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch profile. Please make sure you are logged in.');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!user) {
        return <p className="text-center">Loading profile...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
                <p className="text-lg"><span className="font-semibold">Role:</span> {user.role}</p>
            </div>
        </div>
    );
};

export default ProfilePage;