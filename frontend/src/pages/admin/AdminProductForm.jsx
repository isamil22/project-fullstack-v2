import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createProduct, updateProduct, getProductById, getAllCategories } from '../../api/apiService'; // Import necessary functions
import Loader from '../../components/Loader'; // Import the Loader component

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '', // Use categoryId to match the DTO
        brand: '',
        bestseller: false,
        newArrival: false,
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]); // State to hold categories
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch categories
        getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(err => {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories.");
            });

        // If editing, fetch product data
        if (id) {
            setLoading(true);
            getProductById(id)
                .then(response => {
                    const data = response.data;
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

    const handleDescriptionChange = (value) => {
        setProduct(prev => ({ ...prev, description: value }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        const formData = new FormData();

        formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

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
            setLoading(false); // Stop loading
        }
    };

    if (loading && !id) { // Show a full-page loader only when initially loading product data for editing
        return <Loader />;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Product' : 'Create Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <TextField label="Name" name="name" value={product.name} onChange={handleChange} fullWidth required />

                <FormControl fullWidth margin="normal">
                    <label style={{ paddingBottom: '10px' }}>Description</label>
                    <ReactQuill theme="snow" value={product.description} onChange={handleDescriptionChange} />
                </FormControl>

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
