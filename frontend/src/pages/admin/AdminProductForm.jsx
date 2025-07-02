import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById, uploadDescriptionImage, getAllCategories } from '../../api/apiService';

const AdminProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        quantity: '',
        bestseller: false,
        newArrival: false,
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Effect to fetch categories for the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await getAllCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setError("Failed to load product categories. Please try again.");
            }
        };
        fetchCategories();
    }, []);

    // Effect to fetch product data if we are editing
    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const { data } = await getProductById(id);
                    setProduct({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        categoryId: data.categoryId,
                        quantity: data.quantity,
                        bestseller: data.bestseller,
                        newArrival: data.newArrival,
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
        const { name, value, type, checked } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDescriptionChange = (content) => {
        setProduct((prev) => ({ ...prev, description: content }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        try {
            if (id) {
                await updateProduct(id, formData);
            } else {
                await createProduct(formData);
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
                    <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <Editor
                        apiKey="jeqjwyja4t9lzd3h889y31tf98ag6a1kp16xfns173v9cgr0" // Your correct API key is now here
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
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" step="0.01" className="form-control" id="price" name="price" value={product.price} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Stock Quantity</label>
                    <input type="number" className="form-control" id="quantity" name="quantity" value={product.quantity} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    <select id="categoryId" name="categoryId" value={product.categoryId} onChange={handleChange} className="form-control" required>
                        <option value="">-- Select a Category --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="images">Images</label>
                    <input type="file" className="form-control-file" id="images" name="images" multiple onChange={handleImageChange} />
                </div>

                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="bestseller" name="bestseller" checked={product.bestseller} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="bestseller">Bestseller</label>
                </div>

                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="newArrival" name="newArrival" checked={product.newArrival} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="newArrival">New Arrival</label>
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                    {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;