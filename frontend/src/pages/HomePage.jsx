// isamil22/project-fullstack/project-fullstack-fd48dbc27313e0e58ad38b291978319a319d1734/frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getBestsellers, getApprovedReviews } from '../api/apiService';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [bestsellers, setBestsellers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, reviewsResponse] = await Promise.all([
                    getBestsellers(),
                    getApprovedReviews()
                ]);

                const productsArray = Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data.content;
                setBestsellers(productsArray);
                setReviews(reviewsResponse.data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not fetch data from the server.");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-pink-500 mb-8">Bestselling Products</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {bestsellers.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Approved Reviews Section */}
            <div className="mt-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Our Customers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-gray-600">"{review.content}"</p>
                            <div className="mt-4">
                                <p className="font-semibold text-pink-500">{review.userEmail}</p>
                                <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;