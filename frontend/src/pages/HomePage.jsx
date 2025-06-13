import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../api/apiService';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllProducts()
            .then(response => {
                // The backend might return an array directly or inside an object (e.g., with pagination)
                const productsArray = Array.isArray(response.data)
                    ? response.data
                    : response.data.content; // '.content' is a common property for paginated Spring Boot responses

                if (Array.isArray(productsArray)) {
                    // For a "featured" section, take only the first few items
                    setProducts(productsArray.slice(0, 4));
                } else {
                    console.error("Error: The product data from the API is not an array:", response.data);
                    setError("Could not process product data from the server.");
                }
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setError("Could not fetch products. Please make sure the backend is running and the API endpoint is correct.");
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-pink-500 mb-8">Featured Products</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;