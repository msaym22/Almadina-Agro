//import React, { useState } from 'react';
//import { useForm } from 'react-hook-form';
//import { useNavigate } from 'react-router-dom';
//import { useDispatch } from 'react-redux';
//import { createProduct } from '../../api/products';
//import { toast } from 'react-toastify';
//import FileUpload from '../../components/common/FileUpload';
//import ImagePreview from '../../components/common/ImagePreview';
//import RichTextEditor from '../../components/common/RichTextEditor';
//import { addNewProduct } from '../../features/products/productSlice';
//
//const NewProduct = () => {
//  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
//  const [productImage, setProductImage] = useState(null);
//  const [description, setDescription] = useState('');
//  const navigate = useNavigate();
//  const dispatch = useDispatch();
//
//  const onSubmit = async (data) => {
//    const productData = {
//      ...data,
//      sellingPrice: parseFloat(data.sellingPrice),
//      purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
//      minimumPrice: data.minimumPrice ? parseFloat(data.minimumPrice) : null,
//      stock: data.stock ? parseInt(data.stock) : 0,
//      description
//    };
//
//    if (productImage) {
//      const formData = new FormData();
//      formData.append('file', productImage);
//      formData.append('data', JSON.stringify(productData));
//
//      try {
//        const response = await createProduct(formData);
//        dispatch(addProduct(response.data));
//        toast.success('Product created successfully!');
//        navigate(`/products/${response.data.id}`);
//      } catch (error) {
//        toast.error('Failed to create product');
//      }
//    } else {
//      try {
//        const response = await createProduct(productData);
//        dispatch(addProduct(response.data));
//        toast.success('Product created successfully!');
//        navigate(`/products/${response.data.id}`);
//      } catch (error) {
//        toast.error('Failed to create product');
//      }
//    }
//  };
//
//  const handleDescriptionChange = (content) => {
//    setDescription(content);
//  };
//
//  return (
//    <div className="max-w-4xl mx-auto p-4">
//      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
//
//      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//        <div className="bg-white p-6 rounded shadow">
//          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
//
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//            <div>
//              <label className="block text-sm font-medium mb-1">Product Name *</label>
//              <input
//                {...register('name', { required: 'Product name is required' })}
//                className="w-full p-2 border rounded"
//                placeholder="Enter product name"
//              />
//              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Category</label>
//              <input
//                {...register('category')}
//                className="w-full p-2 border rounded"
//                placeholder="Enter category"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Selling Price (PKR) *</label>
//              <input
//                type="number"
//                step="0.01"
//                min="0"
//                {...register('sellingPrice', {
//                  required: 'Selling price is required',
//                  min: { value: 0, message: 'Price must be positive' }
//                })}
//                className="w-full p-2 border rounded"
//                placeholder="0.00"
//              />
//              {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice.message}</p>}
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Purchase Price (PKR)</label>
//              <input
//                type="number"
//                step="0.01"
//                min="0"
//                {...register('purchasePrice')}
//                className="w-full p-2 border rounded"
//                placeholder="0.00"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Minimum Price (PKR)</label>
//              <input
//                type="number"
//                step="0.01"
//                min="0"
//                {...register('minimumPrice')}
//                className="w-full p-2 border rounded"
//                placeholder="0.00"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Initial Stock</label>
//              <input
//                type="number"
//                min="0"
//                {...register('stock')}
//                className="w-full p-2 border rounded"
//                placeholder="0"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Supplier</label>
//              <input
//                {...register('supplier')}
//                className="w-full p-2 border rounded"
//                placeholder="Enter supplier name"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Storage Location</label>
//              <input
//                {...register('location')}
//                className="w-full p-2 border rounded"
//                placeholder="Enter storage location"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Expiry Date</label>
//              <input
//                type="date"
//                {...register('expiryDate')}
//                className="w-full p-2 border rounded"
//              />
//            </div>
//          </div>
//        </div>
//
//        <div className="bg-white p-6 rounded shadow">
//          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
//          <FileUpload
//            onFileSelect={setProductImage}
//            accept="image/*"
//          />
//          {productImage && <ImagePreview file={productImage} />}
//        </div>
//
//        <div className="bg-white p-6 rounded shadow">
//          <h2 className="text-lg font-semibold mb-4">Description</h2>
//          <RichTextEditor value={description} onChange={handleDescriptionChange} />
//        </div>
//
//        <div className="bg-white p-6 rounded shadow">
//          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
//
//          <div className="grid grid-cols-1 gap-4">
//            <div>
//              <label className="block text-sm font-medium mb-1">Applications / Usage</label>
//              <input
//                {...register('applications')}
//                className="w-full p-2 border rounded"
//                placeholder="Enter applications"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Alternative Products</label>
//              <input
//                {...register('alternatives')}
//                className="w-full p-2 border rounded"
//                placeholder="Enter alternative products"
//              />
//            </div>
//
//            <div>
//              <label className="block text-sm font-medium mb-1">Comments / Notes</label>
//              <textarea
//                {...register('comments')}
//                className="w-full p-2 border rounded"
//                rows="3"
//                placeholder="Enter comments"
//              />
//            </div>
//          </div>
//        </div>
//
//        <div className="flex justify-end">
//          <button
//            type="submit"
//            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//          >
//            Create Product
//          </button>
//        </div>
//      </form>
//    </div>
//  );
//};
//
//export default NewProduct;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm';

import productsAPI from '../../api/products';

export const NewProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    sellingPrice: 0,
    purchasePrice: 0,
    minimumPrice: 0,
    description: '',
    usedIn: '',
    alternativeProducts: [],
    category: '',
    comments: '',
    storageLocation: '',
    stockQuantity: 0,
    supplier: '',
    expiryDate: null
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append('image', image);

      const response = await productsAPI.createProduct(formData);
      navigate(`/products/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <ProductForm
        product={productData}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default NewProduct;