import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/apiService';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            // Sort orders by creation date, newest first
            const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setError('');
        setSuccess('');
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            setSuccess(`Order #${orderId} status updated to ${newStatus}.`);
        } catch (err) {
            setError(`Failed to update order #${orderId}. Please try again.`);
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{success}</p>}

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-grow">
                                    <p className="font-bold text-lg text-gray-800">Order #{order.id}</p>
                                    <div className="mt-2 text-gray-600 text-sm space-y-1">
                                        <p><strong>User ID:</strong> {order.userId}</p>
                                        <p><strong>Address:</strong> {order.address}</p>
                                        <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 w-full md:w-auto">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'DELIVERING' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                    <select
                                        id={`status-${order.id}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="block w-full text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md shadow-sm"
                                        disabled={order.status === 'DELIVERED' || order.status === 'CANCELED'}
                                    >
                                        <option value="PREPARING">Preparing</option>
                                        <option value="DELIVERING">Delivering</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELED">Canceled</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;