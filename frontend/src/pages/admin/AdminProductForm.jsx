import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../api/apiService';
import { toast } from 'react-toastify';

const AdminProductForm = () => {
    const [product, setProduct] = useState({ name: '', description: '', price: '', quantity: '', categoryId: '', brand: '', bestseller: false, newArrival: false });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        apiService.get('/categories').then(response => setCategories(response.data));
        if (id) {
            apiService.get(`/products/${id}`).then(response => {
                setProduct(response.data);
            });
        }
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

        try {
            // Step 1: Create product with text-based data
            const productResponse = await (id ? apiService.put(`/products/${id}`, product) : apiService.post('/products', product));
            const newProductId = productResponse.data.id;

            // Step 2: Upload images if any
            if (images.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }
                await apiService.post(`/products/${newProductId}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                {/* ... (rest of the form fields are the same) ... */}
                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-gray-700">Images</label>
                    <input type="file" name="images" onChange={handleImageChange} multiple className="w-full p-2 border rounded" />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;