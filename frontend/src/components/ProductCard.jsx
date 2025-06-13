import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // SOLUTION: Use the 'image' property and prepend the backend server's URL.
    const fullImageUrl = product.image
        ? `http://localhost:8080${product.image}`
        : 'https://placehold.co/300x300/E91E63/FFFFFF?text=Product';

    return (
        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Link to={`/products/${product.id}`}>
                <img
                    src={fullImageUrl}
                    alt={product.name}
                    className="w-full h-56 object-cover bg-gray-200"
                    // This fallback will be used if an image is missing from the backend
                    onError={(e) => {
                        e.currentTarget.onerror = null; // prevents looping
                        e.currentTarget.src = 'https://placehold.co/300x300/E91E63/FFFFFF?text=No+Image';
                    }}
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-pink-500 font-bold mt-2">${product.price?.toFixed(2)}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;