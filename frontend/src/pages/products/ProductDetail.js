import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StockManagement } from '../../components/products/StockManagement';
import productsAPI from '../../api/products';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getProduct(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdateStock = async (productId, adjustment) => {
    try {
      await productsAPI.updateStock(productId, adjustment);
      setProduct(prev => ({
        ...prev,
        stockQuantity: prev.stockQuantity + adjustment
      }));
    } catch (error) {
      console.error('Stock update failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded shadow p-6">
        <div className="flex">
          <div className="w-1/3">
            {product.image && (
              <img
                src={`/uploads/${product.image}`}
                alt={product.name}
                className="w-full rounded"
              />
            )}
          </div>
          <div className="w-2/3 pl-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="mt-4">
              <p><span className="font-semibold">SKU:</span> {product.sku}</p>
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Selling Price:</span> PKR {product.sellingPrice}</p>
              <p><span className="font-semibold">Purchase Price:</span> PKR {product.purchasePrice || 'N/A'}</p>
              <p><span className="font-semibold">Stock:</span> {product.stockQuantity}</p>
              <p><span className="font-semibold">Storage:</span> {product.storageLocation}</p>
              {product.expiryDate && (
                <p><span className="font-semibold">Expiry:</span> {new Date(product.expiryDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        <StockManagement
          product={product}
          onUpdateStock={handleUpdateStock}
        />
      </div>
    </div>
  );
};
export default ProductDetail;
//# export { ProductDetail };