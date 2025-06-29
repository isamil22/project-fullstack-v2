import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    getAllCategories,
    getProductById,
    updateProduct,
    createProduct
} from '../../api/apiService';
import Loader from '../../components/Loader';

const AdminProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        brand: '',
        bestseller: false,
        newArrival: false
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await getAllCategories();
                const categoriesArray = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : categoriesResponse.data.content;
                setCategories(categoriesArray || []);

                // If editing, fetch the product
                if (id) {
                    const productResponse = await getProductById(id);
                    // Ensure categoryId is set correctly for the select dropdown
                    setProduct({ ...productResponse.data, categoryId: productResponse.data.category.id });
                }
            } catch (err) {
                console.error('Failed to fetch form data:', err);
                setError('Could not load required data. Please try again.');
                toast.error('Could not load required data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Ensure numeric fields are correctly formatted
        const productPayload = {
            ...product,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity, 10),
            categoryId: parseInt(product.categoryId, 10),
        };

        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(productPayload)], { type: "application/json" }));

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            if (id) {
                await updateProduct(id, formData);
            } else {
                await createProduct(formData);
            }
            toast.success(`Product ${id ? 'updated' : 'created'} successfully!`);
            navigate('/admin/products');
        } catch (error) {
            toast.error(`Error ${id ? 'updating' : 'creating'} product.`);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea name="description" value={product.description} onChange={handleChange} className="w-full p-2 border rounded" rows="4" required></textarea>
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Price</label>
                        <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full p-2 border rounded" step="0.01" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Quantity</label>
                        <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                </div>

                {/* Category and Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Category</label>
                        <select name="categoryId" value={product.categoryId} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select a Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Brand</label>
                        <input type="text" name="brand" value={product.brand} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-8">
                    <label className="flex items-center">
                        <input type="checkbox" name="bestseller" checked={product.bestseller} onChange={handleChange} className="h-4 w-4" />
                        <span className="ml-2">Bestseller</span>
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" name="newArrival" checked={product.newArrival} onChange={handleChange} className="h-4 w-4" />
                        <span className="ml-2">New Arrival</span>
                    </label>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-700">Images</label>
                    <input type="file" name="images" onChange={handleImageChange} multiple className="w-full p-2 border rounded" />
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
