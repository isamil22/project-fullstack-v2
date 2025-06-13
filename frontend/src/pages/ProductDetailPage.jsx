import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../api/apiService';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(err => {
                console.error(`Error fetching product with id ${id}:`, err);
                setError("Product not found or an error occurred.");
            });
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, quantity);
            setMessage('Product added to cart successfully!');
        } catch (err) {
            setMessage('Failed to add product to cart. Please log in.');
            console.error(err);
        }
    };

    const handleOrderNow = async () => {
        try {
            await addToCart(product.id, quantity);
            navigate('/cart');
        } catch (err) {
            setMessage('Failed to add product to cart. Please log in.');
            console.error(err);
        }
    };

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (!product) {
        return <p className="text-center mt-10">Loading product details...</p>;
    }

    const fullImageUrl = product.image
        ? `http://localhost:8080${product.image}`
        : 'https://placehold.co/600x400/E91E63/FFFFFF?text=Product';

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <img
                        src={fullImageUrl}
                        alt={product.name}
                        className="w-full h-auto rounded-lg shadow-lg bg-gray-200"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://placehold.co/600x400/E91E63/FFFFFF?text=No+Image';
                        }}
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <p className="text-3xl text-pink-500 font-bold mb-6">${product.price.toFixed(2)}</p>

                    <div className="flex items-center space-x-4 mb-6">
                        <label htmlFor="quantity" className="font-bold">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded-md p-2 w-20 text-center"
                        />
                    </div>
                    {message && <p className="text-green-500 mb-4">{message}</p>}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition duration-300"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleOrderNow}
                            className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-300"
                        >
                            Order Now
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full mt-4 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        Keep Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;