import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createProduct, updateProduct, getProductById, getAllCategories, uploadDescriptionImage } from '../../api/apiService';
import Loader from '../../components/Loader';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        brand: '',
        bestseller: false,
        newArrival: false,
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await uploadDescriptionImage(formData);
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', res.data.url);
            } catch (err) {
                console.error("Image upload failed:", err);
                setError("Image upload failed.");
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
    };

    useEffect(() => {
        getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(err => {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories.");
            });

        if (id) {
            setLoading(true);
            getProductById(id)
                .then(response => {
                    const data = response.data;

                    // --- 🐞 1. LOGGING THE API RESPONSE ---
                    console.log("API Response Data:", data);

                    setProduct({
                        name: data.name || '',
                        description: data.description || '',
                        price: data.price || '',
                        quantity: data.quantity || '',
                        categoryId: data.categoryId || '',
                        brand: data.brand || '',
                        bestseller: data.bestseller || false,
                        newArrival: data.newArrival || false,
                    });
                })
                .catch(err => {
                    console.error("Failed to fetch product data:", err);
                    setError("Failed to load product data.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Corrected handleDescriptionChange function
    const handleDescriptionChange = (value) => {
        setProduct(prev => ({ ...prev, description: value }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            ...product,
            description: product.description,
        };

        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
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
            const errorMessage = err.response?.data?.message || 'Operation failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- ✅ UPDATED LOADING CHECK ---
    // This prevents the form from rendering until data is fetched
    if (loading) {
        return <Loader />;
    }

    // --- 🐞 2. LOGGING THE VALUE PASSED TO THE EDITOR ---
    console.log("Value passed to ReactQuill:", product.description);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Product' : 'Create Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <TextField label="Name" name="name" value={product.name} onChange={handleChange} fullWidth required />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <ReactQuill
                        key={product.description} //  ADD THIS LINE
                        ref={quillRef}
                        theme="snow"
                        value={product.description}
                        onChange={handleDescriptionChange}
                        modules={modules}
                    />
                </div>

                <TextField label="Price" name="price" type="number" value={product.price} onChange={handleChange} fullWidth required />
                <TextField label="Quantity" name="quantity" type="number" value={product.quantity} onChange={handleChange} fullWidth required />

                <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select name="categoryId" value={product.categoryId} onChange={handleChange} label="Category">
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField label="Brand" name="brand" value={product.brand} onChange={handleChange} fullWidth required />

                <FormControlLabel control={<Checkbox name="bestseller" checked={product.bestseller} onChange={handleChange} />} label="Bestseller" />
                <FormControlLabel control={<Checkbox name="newArrival" checked={product.newArrival} onChange={handleChange} />} label="New Arrival" />

                <input type="file" multiple onChange={handleImageChange} style={{ margin: '20px 0' }} />

                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                    {loading ? <Loader /> : (id ? 'Update Product' : 'Add Product')}
                </Button>
            </form>
        </div>
    );
};

export default AdminProductForm;