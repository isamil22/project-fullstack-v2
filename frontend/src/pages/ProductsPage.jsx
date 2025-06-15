import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../api/apiService';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        brand: ''
    });

    // Fetch products whenever the filters change
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Create a clean params object, excluding any empty filter values
                const params = {};
                for (const key in filters) {
                    if (filters[key]) {
                        params[key] = filters[key];
                    }
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

        // Debounce fetching to avoid too many API calls while typing
        const timerId = setTimeout(() => {
            fetchProducts();
        }, 500); // Wait for 500ms after user stops typing

        return () => clearTimeout(timerId); // Cleanup timeout on component unmount or filter change
    }, [filters]);

    // Handler to update the filter state
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-white rounded-lg shadow">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name or description..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
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