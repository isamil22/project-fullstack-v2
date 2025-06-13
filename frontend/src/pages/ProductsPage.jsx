import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../api/apiService';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllProducts()
            .then(response => {
                // Handle both direct array and paginated object responses
                const productsArray = Array.isArray(response.data)
                    ? response.data
                    : response.data.content;

                if (Array.isArray(productsArray)) {
                    setProducts(productsArray);
                } else {
                    console.error("Error: The product data from the API is not an array:", response.data);
                    setError("Could not process product data from the server.");
                }
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setError("Could not load products. Please check the backend connection and API response format.");
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Products</h1>
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;