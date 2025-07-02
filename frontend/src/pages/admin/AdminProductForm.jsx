import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadDescriptionImage } from '../../api/apiService';

const AdminProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        stock: '',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`/api/v1/products/${id}`);
                    setProduct({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        categoryId: data.category.id,
                        stock: data.stock,
                    });
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (content) => {
        setProduct((prev) => ({ ...prev, description: content }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        const productData = {
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            stock: product.stock
        };
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        if (image) {
            formData.append('images', image);
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        try {
            if (id) {
                await axios.put(`/api/v1/products/${id}`, formData, config);
            } else {
                await axios.post('/api/v1/products', formData, config);
            }
            setLoading(false);
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const handleImageUpload = (blobInfo, progress) => new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());

        uploadDescriptionImage(formData)
            .then((response) => {
                if (response.data && response.data.url) {
                    resolve(response.data.url);
                } else {
                    reject('Invalid JSON response');
                }
            })
            .catch((error) => {
                reject(`Image upload failed: ${error.message}`);
            });
    });

    return (
        <div className="container mt-5">
            <h2>{id ? 'Edit Product' : 'Create Product'}</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <Editor
                        apiKey="jeqjwyja4t9lzd3h889y31tf98ag6a1kp16xfns173v9cgr0"
                        value={product.description}
                        onEditorChange={handleDescriptionChange}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | image | help',
                            images_upload_handler: handleImageUpload,
                            automatic_uploads: true,
                            file_picker_types: 'image',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoryId">Category ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="categoryId"
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                    {loading ? 'Saving...' : (id ? 'Update' : 'Create')}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;