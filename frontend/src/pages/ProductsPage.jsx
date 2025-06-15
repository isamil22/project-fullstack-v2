// isamil22/project-fullstack/project-fullstack-6ef389f74415f1de0f4819cf9cb835c233eaddb4/frontend/src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllCategories } from '../api/apiService'; // Import getAllCategories
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        maxPrice: '',
        brand: '',
        specialFilter: '', // This will handle 'bestseller' and 'newArrival'
        categoryId: '' // Add categoryId to filters
    });

    useEffect(() => {
        // Fetch categories for the dropdown
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
                // Not setting a page-level error for this, as the page can still function
            }
        };

        fetchCategories();
    }, []); // Fetch categories only once

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {
                    search: filters.search,
                    maxPrice: filters.maxPrice,
                    brand: filters.brand,
                    categoryId: filters.categoryId // Pass categoryId to params
                };

                // Add bestseller or newArrival to params based on the specialFilter value
                if (filters.specialFilter === 'bestseller') {
                    params.bestseller = true;
                } else if (filters.specialFilter === 'newArrival') {
                    params.newArrival = true;
                }

                const response = await getAllProducts(params);
                const productsArray = Array.isArray(response.data)
                    ? response.data
                    : response.data.content;

                if (Array.isArray(productsArray)) {
                    setProducts(productsArray);
                } else {
                    console.error("Error: The product data is not an array:", response.data);
                    setError("Could not process product data from the server.");
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Could not load products. Please try again.");
            }
        };

        const timerId = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timerId);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Products</h1>

            {/* Filter and Search Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg shadow">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                />
                {/* Category Dropdown */}
                <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="specialFilter"
                    value={filters.specialFilter}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Products</option>
                    <option value="bestseller">Bestsellers</option>
                    <option value="newArrival">New Arrivals</option>
                </select>
            </div>

            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No products match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;