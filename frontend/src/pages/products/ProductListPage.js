import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductList } from '../../components/products/ProductList';
import Button from '../../components/common/Button';
import productsAPI from '../../api/products';

export const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleView = (product) => {
    navigate(`/products/${product.id}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Deletion failed:', error);
      }
    }
  };

  const handleCreate = () => {
    navigate('/products/new');
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={handleCreate} variant="primary">
          Add New Product
        </Button>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};
export default ProductListPage;
//export { ProductListPage };