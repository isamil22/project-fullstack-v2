import React, { useState, useEffect } from 'react';
import { getCart, removeCartItem } from '../api/apiService';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState('');

    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCart(response.data);
        } catch (err) {
            setError('Failed to fetch cart. Please try again later.');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await removeCartItem(productId);
            fetchCart();
        } catch (err) {
            setError('Failed to remove item from cart.');
        }
    };


    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!cart) {
        return <p className="text-center">Loading cart...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>
            {cart.items.length === 0 ? (
                <p className="text-center">Your cart is empty.</p>
            ) : (
                <div className="max-w-3xl mx-auto">
                    {cart.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                            <div>
                                <h2 className="text-lg font-semibold">{item.productName}</h2>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(item.productId)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CartPage;