import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/apiService';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

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

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (!product) {
        return <p className="text-center mt-10">Loading product details...</p>;
    }

    // SOLUTION: Apply the same fix on the detail page.
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
                            e.currentTarget.onerror = null; // prevents looping
                            e.currentTarget.src = 'https://placehold.co/600x400/E91E63/FFFFFF?text=No+Image';
                        }}
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <p className="text-3xl text-pink-500 font-bold mb-6">${product.price.toFixed(2)}</p>
                    <button className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition duration-300">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;