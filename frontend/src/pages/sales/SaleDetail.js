import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import salesAPI from '../../api/sales';

export const SaleDetail = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await salesAPI.getSale(id);
        setSale(response.data);
      } catch (error) {
        console.error('Failed to fetch sale:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!sale) return <div>Sale not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Sale #{sale.id}</h1>
            <p className="text-gray-600">
              {new Date(sale.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">PKR {sale.totalAmount.toFixed(2)}</p>
            <p className="text-gray-600 capitalize">{sale.paymentMethod}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Customer</h2>
          <p>{sale.customer?.name || 'Walk-in Customer'}</p>
          {sale.customer?.phone && <p>Phone: {sale.customer.phone}</p>}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map(item => (
                <tr key={item.id}>
                  <td className="border p-2">{item.product.name}</td>
                  <td className="border p-2 text-center">PKR {item.product.sellingPrice}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-center">
                    PKR {(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          {sale.discount > 0 && (
            <p className="text-gray-600">
              Discount: PKR {sale.discount.toFixed(2)}
            </p>
          )}
          <p className="text-xl font-bold mt-2">
            Grand Total: PKR {sale.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default SaleDetail;
//export { SaleDetail };