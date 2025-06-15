import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../api/apiService';

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getUserOrders();
                // Sort orders by creation date, newest first
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (err) {
                setError('Failed to fetch your orders. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading your orders...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    return (
        // The container div and title have been removed to make this component embeddable
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Order History</h2>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <p className="font-bold text-lg text-gray-800">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'DELIVERING' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Items:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {order.orderItems.map(item => (
                                        <li key={item.id} className="text-gray-700">
                                            {item.quantity} x Product ID: {item.productId} at ${item.price.toFixed(2)} each
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">You have not placed any orders yet.</p>
            )}
        </div>
    );
};

export default UserOrdersPage;