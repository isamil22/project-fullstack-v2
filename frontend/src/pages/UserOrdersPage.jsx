import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../api/apiService';
import Loader from '../components/Loader';

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getUserOrders();
                setOrders(fetchedOrders);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Status: {order.status}</p>
                            <p className="font-bold mt-2">Total: ${order.total}</p>
                            <div className="mt-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center border-t pt-2 mt-2">
                                        <div>
                                            <p>{item.product.name}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <p>${item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no orders.</p>
            )}
        </div>
    );
};

export default UserOrdersPage;