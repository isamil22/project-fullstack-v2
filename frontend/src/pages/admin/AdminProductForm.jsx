import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import ReactQuill from 'react-quill'; // Import react-quill
import 'react-quill/dist/quill.snow.css'; // Import the styles

const AdminProductForm = ({ onSubmit, initialData }) => {
    // ... (keep the existing state and other code)

    const [product, setProduct] = useState({
        name: '',
        description: '', // This will now hold HTML content
        price: '',
        quantity: '',
        category: '',
        brand: '',
        bestseller: false,
        newArrival: false,
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (initialData) {
            setProduct({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                quantity: initialData.quantity || '',
                category: initialData.category ? initialData.category.id : '',
                brand: initialData.brand || '',
                bestseller: initialData.bestseller || false,
                newArrival: initialData.newArrival || false,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Add a new handler for the rich text editor
    const handleDescriptionChange = (value) => {
        setProduct((prev) => ({
            ...prev,
            description: value,
        }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const productData = {
            ...product,
            categoryId: product.category, // Ensure categoryId is sent
        };

        // Remove the 'category' property as the backend expects 'categoryId'
        delete productData.category;

        formData.append('product', JSON.stringify(productData));

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ... (keep the other form fields) */}
            <TextField
                label="Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {/* Replace the Description TextField with ReactQuill */}
            <FormControl fullWidth margin="normal">
                <label style={{ paddingBottom: '10px' }}>Description</label>
                <ReactQuill
                    theme="snow"
                    value={product.description}
                    onChange={handleDescriptionChange}
                />
            </FormControl>

            <TextField
                label="Price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            {/* ... (keep the rest of the form) */}
            <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={product.quantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    label="Category"
                >
                    {/* You should populate this with your actual categories */}
                    <MenuItem value="makeup">Makeup</MenuItem>
                    <MenuItem value="skincare">Skincare</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Brand"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="bestseller"
                        checked={product.bestseller}
                        onChange={handleChange}
                    />
                }
                label="Bestseller"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="newArrival"
                        checked={product.newArrival}
                        onChange={handleChange}
                    />
                }
                label="New Arrival"
            />
            <input
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ margin: '20px 0' }}
            />
            <Button type="submit" variant="contained" color="primary">
                {initialData ? 'Update Product' : 'Add Product'}
            </Button>
        </form>
    );
};

export default AdminProductForm;
