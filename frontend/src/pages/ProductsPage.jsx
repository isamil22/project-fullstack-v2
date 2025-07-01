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
                // UPDATED: Sends 'categoryId' instead of 'category'
                if (filters.category && filters.category !== 'all') {
                    params.append('categoryId', filters.category);
                }
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                params.append('sort', filters.sort);

                const response = await getAllProducts(params);
                // UPDATED: Handles the paginated response from the backend
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
            currentParams.set(key, newFilters[key]);
        });
        setSearchParams(currentParams);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Our Products</h1>

            {/* You can add your filter UI elements here, using handleFilterChange */}

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