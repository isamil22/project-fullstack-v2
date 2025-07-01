import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../api/apiService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'all',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'name,asc',
    });

    useEffect(() => {
        getAllCategories()
            .then(response => setCategories(response.data))
            .catch(err => console.error("Failed to fetch categories:", err));
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append('search', filters.search);
                if (filters.category && filters.category !== 'all') {
                    params.append('categoryId', filters.category);
                }
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                params.append('sort', filters.sort);

                const response = await getAllProducts(params);
                const productsArray = response.data.content || [];
                setProducts(productsArray);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const timerId = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timerId);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        const currentParams = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) {
                currentParams.set(key, newFilters[key]);
            } else {
                currentParams.delete(key);
            }
        });
        setSearchParams(currentParams);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Our Products</h1>

            {/* --- NEW: Filter and Search Bar --- */}
            <div className="mb-10 p-4 bg-gray-100 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    {/* Search Input */}
                    <input
                        type="text"
                        name="search"
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />

                    {/* Category Select */}
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Min Price Input */}
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />

                    {/* Max Price Input */}
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
            </div>

            {error && <p className="text-center text-red-500 py-10">{error}</p>}

            {loading ? (
                <Loader />
            ) : (
                <>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="col-span-full text-center text-gray-500 text-lg py-10">
                            No products match your criteria.
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductsPage;