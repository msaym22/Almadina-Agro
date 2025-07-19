import React from 'react';

const ProductForm = ({
  product,
  onChange,
  onImageChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Product Name*</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={onChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Selling Price (PKR)*</label>
            <input
              type="number"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={onChange}
              min="0"
              step="0.01"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Purchase Price (PKR)</label>
            <input
              type="number"
              name="purchasePrice"
              value={product.purchasePrice}
              onChange={onChange}
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Minimum Price (PKR)</label>
            <input
              type="number"
              name="minimumPrice"
              value={product.minimumPrice}
              onChange={onChange}
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={onChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="berrings">Seeds</option>
              <option value="belts">Fertilizers</option>
              <option value="cutter">Pesticides</option>
              <option value="kabuta">Tools</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="w-full p-2"
            />
            {product.imageUrl && (
              <div className="mt-2">
                <img
                  src={product.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-contain"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={onChange}
              rows="4"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Used In/Applications</label>
            <input
              type="text"
              name="usedIn"
              value={product.usedIn}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Storage Location</label>
            <input
              type="text"
              name="storageLocation"
              value={product.storageLocation}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={product.supplier}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={product.expiryDate || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Comments/Notes</label>
        <textarea
          name="comments"
          value={product.comments}
          onChange={onChange}
          rows="2"
          className="w-full p-2 border rounded"
        ></textarea>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </div>
  );
};

export default ProductForm;