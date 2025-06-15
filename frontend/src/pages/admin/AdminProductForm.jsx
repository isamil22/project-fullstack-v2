import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getAllCategories, uploadDescriptionImage } from '../../api/apiService.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const quillRef = useRef(null);

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                try {
                    const response = await uploadDescriptionImage(formData);
                    const imageUrl = `http://localhost:8080${response.data.url}`;
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', imageUrl);
                } catch (error) {
                    setError('Image upload failed: ' + (error.response?.data?.message || 'Server error'));
                }
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'},
                    {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

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

    const handleDescriptionChange = (value) => {
        setProduct(prev => ({ ...prev, description: value }));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

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
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={product.description}
                        onChange={handleDescriptionChange}
                        modules={modules}
                        className="mt-1 bg-white"
                    />
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