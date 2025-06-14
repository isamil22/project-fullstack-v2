import React, { useState, useEffect } from 'react';
import { getUserProfile, getUserOrders } from '/src/api/apiService.js';
import ReviewForm from '/src/components/ReviewForm.jsx';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    // This state now simply toggles the review form visibility
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileResponse, ordersResponse] = await Promise.all([
                    getUserProfile(),
                    getUserOrders()
                ]);
                setUser(profileResponse.data);
                const sortedOrders = ordersResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (err) {
                setError('Failed to fetch your data. Please make sure you are logged in.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading your profile and orders...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    // A user is eligible to review if they have one or more orders.
    const canReview = orders.length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* --- User Profile Information Section --- */}
            {user && (
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mb-10">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Profile</h1>
                    <div className="space-y-4">
                        <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
                        <p className="text-lg"><span className="font-semibold">Role:</span> {user.role}</p>
                    </div>
                </div>
            )}

            {/* --- Service Review Section --- */}
            {canReview && (
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mb-10">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Review Our Service</h2>
                    <p className="text-center text-gray-600 mb-6">Your feedback helps us improve.</p>
                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition duration-300"
                    >
                        {showReviewForm ? 'Close Review Form' : 'Write a Review'}
                    </button>
                    {showReviewForm && <ReviewForm onReviewSubmitted={() => setShowReviewForm(false)} />}
                </div>
            )}


            {/* --- Order History Section --- */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">My Order History</h2>
                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 mb-3">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-bold text-lg text-gray-800">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">
                                            Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full self-start ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'DELIVERING' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2 text-gray-700">Items:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {order.orderItems.map(item => (
                                            <li key={item.id} className="flex justify-between items-center">
                                                <span>{item.quantity} x (Product ID: {item.productId}) - ${item.price.toFixed(2)} each</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10 bg-white p-6 rounded-lg shadow-md">You have not placed any orders yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;