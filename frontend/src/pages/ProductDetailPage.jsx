import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../api/apiService';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(response.data.images[0]); // Use the S3 URL directly
                }
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

    // Use the S3 URLs directly from the product data
    const imageList = product.images && product.images.length > 0
        ? product.images
        : ['https://placehold.co/600x400/E91E63/FFFFFF?text=Product'];


    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Image Gallery Section */}
                <div>
                    <div className="mb-4">
                        <img
                            src={selectedImage || imageList[0]}
                            alt={product.name}
                            className="w-full h-auto rounded-lg shadow-lg bg-gray-200 object-cover aspect-square"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://placehold.co/600x400/E91E63/FFFFFF?text=No+Image';
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {imageList.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className={`w-full h-24 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-pink-500' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(img)}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details and Actions Section */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
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

            {/* Description and Comments Section - HORIZONTAL LAYOUT */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Column 1: Description */}
                <div>
                    <div className="border-b border-gray-200 mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 py-4">Product Description</h2>
                    </div>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>

                {/* Column 2: Comments */}
                <div>
                    <div className="border-b border-gray-200 mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 py-4">Customer Comments</h2>
                    </div>
                    <div className="space-y-6">
                        {product.comments && product.comments.length > 0 ? (
                            product.comments.map(comment => (
                                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 italic">"{comment.content}"</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="text-yellow-500" aria-label={`Rating: ${comment.score} out of 5 stars`}>
                                            {'★'.repeat(comment.score)}
                                            {'☆'.repeat(5 - comment.score)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            - <span className="font-semibold">{comment.userFullName}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;