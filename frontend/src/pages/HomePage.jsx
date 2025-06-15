import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBestsellers, getNewArrivals, getApprovedReviews, getAllCategories } from '../api/apiService';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [bestsellers, setBestsellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    bestsellersResponse,
                    newArrivalsResponse,
                    reviewsResponse,
                    categoriesResponse
                ] = await Promise.all([
                    getBestsellers(),
                    getNewArrivals(),
                    getApprovedReviews(),
                    getAllCategories()
                ]);

                const bestsellersArray = Array.isArray(bestsellersResponse.data) ? bestsellersResponse.data : bestsellersResponse.data.content;
                setBestsellers(bestsellersArray);

                const newArrivalsArray = Array.isArray(newArrivalsResponse.data) ? newArrivalsResponse.data : newArrivalsResponse.data.content;
                setNewArrivals(newArrivalsArray);

                setReviews(reviewsResponse.data);
                setCategories(categoriesResponse.data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not fetch data from the server.");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* --- Hero Section with Background Image --- */}
            <div
                className="relative rounded-lg p-12 md:p-20 mb-16 text-center text-white overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url('https://placehold.co/1200x400/E91E63/FFFFFF?text=Beauty+Cosmetics')` }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Inner Beauty</h1>
                    <p className="text-lg mb-6">Explore our exclusive collection of premium cosmetics and skincare products.</p>
                    <Link to="/products" className="bg-white text-pink-500 font-bold py-3 px-8 rounded-full hover:bg-pink-100 transition-colors">
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* --- Shop By Category Section with Images --- */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map(category => (
                        <Link
                            key={category.id}
                            to={`/products?categoryId=${category.id}`}
                            className="group relative block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden aspect-square"
                        >
                            <img
                                src={`https://placehold.co/400x400/fde4f2/E91E63?text=${encodeURIComponent(category.name)}`}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-2">
                                <p className="font-semibold text-white text-xl text-center">{category.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <h2 className="text-3xl font-bold text-center text-pink-500 mb-8">Bestselling Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {bestsellers.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-16">
                <h2 className="text-3xl font-bold text-center text-pink-500 mb-8">New Arrivals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {newArrivals.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

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
