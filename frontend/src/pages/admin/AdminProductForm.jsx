import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getAllCategories } from '../../api/apiService.js';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        brand: '',
        categoryId: '',
        bestseller: false,
        newArrival: false
    });
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]); // FIX: Changed to handle multiple images
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data);
            } catch (err) {
                setError('Failed to load categories.');
            }
        };

        fetchCategories();

        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await getProductById(id);
                    setProduct({
                        ...response.data,
                        bestseller: response.data.bestseller || false,
                        newArrival: response.data.newArrival || false,
                    });
                } catch (err) {
                    setError('Failed to load product data.');
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]); // FIX: Store all selected files
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

        // FIX: Append all selected image files with the correct key 'images'
        if (images.length > 0) {
            images.forEach(imageFile => {
                formData.append('images', imageFile);
            });
        }

        setError('');
        setSuccess('');

        try {
            if (id) {
                await updateProduct(id, formData);
                setSuccess('Product updated successfully!');
            } else {
                await createProduct(formData);
                setSuccess('Product created successfully!');
            }
            setTimeout(() => navigate('/admin/products'), 2000);
        } catch (err) {
            setError('Operation failed. ' + (err.response?.data?.message || 'Please try again.'));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Product' : 'Create Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={product.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"></textarea>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" name="quantity" id="quantity" value={product.quantity} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                </div>
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                    <input type="text" name="brand" id="brand" value={product.brand} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                </div>
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="categoryId" id="categoryId" value={product.categoryId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500">
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                    {/* FIX: Add 'multiple' attribute to allow selecting multiple files */}
                    <input type="file" name="image" id="image" onChange={handleImageChange} multiple className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
                </div>
                <div className="flex space-x-4">
                    <label htmlFor="bestseller" className="flex items-center">
                        <input type="checkbox" name="bestseller" id="bestseller" checked={product.bestseller} onChange={handleChange} className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                        <span className="ml-2 text-sm font-medium text-gray-700">Mark as Bestseller</span>
                    </label>
                    <label htmlFor="newArrival" className="flex items-center">
                        <input type="checkbox" name="newArrival" id="newArrival" checked={product.newArrival} onChange={handleChange} className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                        <span className="ml-2 text-sm font-medium text-gray-700">Mark as New Arrival</span>
                    </label>
                </div>
                <div>
                    <button type="submit" className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700">{id ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;