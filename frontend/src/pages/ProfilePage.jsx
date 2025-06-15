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
    const [activeTab, setActiveTab] = useState('description'); // State for active tab
    const navigate = useNavigate();

    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(`http://localhost:8080${response.data.images[0]}`);
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

    const imageList = product.images && product.images.length > 0
        ? product.images.map(img => `http://localhost:8080${img}`)
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

            {/* Description and Reviews Tab Section */}
            <div className="mt-16">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'description'
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'reviews'
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Reviews ({product.comments?.length || 0})
                        </button>
                    </nav>
                </div>

                <div className="mt-8">
                    {/* Description Content */}
                    {activeTab === 'description' && (
                        <div
                            className="prose max-w-none prose-pink"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    )}

                    {/* Reviews Content */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            {product.comments && product.comments.length > 0 ? (
                                product.comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold">
                                                {comment.userFullName ? comment.userFullName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-800">{comment.userFullName}</div>
                                                <div className="text-yellow-500">
                                                    {'★'.repeat(comment.score)}{'☆'.repeat(5 - comment.score)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 italic">"{comment.content}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No reviews yet for this product.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;