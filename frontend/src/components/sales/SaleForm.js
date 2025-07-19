import React, { useState, useEffect } from 'react';
import { SearchInput } from '../common/SearchInput';

export const SaleForm = ({ products, customers, onSubmit }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedProducts(prev =>
      prev.map(p => p.id === id ? { ...p, quantity } : p)
    );
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + (item.sellingPrice * item.quantity), 0
    );
    return subtotal - discount;
  };

  const handleSubmit = () => {
    const saleData = {
      customerId: selectedCustomer,
      items: selectedProducts.map(p => ({ productId: p.id, quantity: p.quantity })),
      paymentMethod,
      discount,
      totalAmount: calculateTotal()
    };
    onSubmit(saleData);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-medium">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="credit">Credit</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Add Products</label>
        <SearchInput
          onSearch={(term) => {}}
          onSelect={handleAddProduct}
          data={products}
          placeholder="Search products..."
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Selected Products</h3>
        {selectedProducts.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b py-2">
            <div>
              <span>{item.name}</span>
              <span className="ml-2 text-gray-500">(PKR {item.sellingPrice})</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                className="w-16 border rounded p-1 text-center"
              />
              <button
                onClick={() => setSelectedProducts(prev => prev.filter(p => p.id !== item.id))}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <div>
          <label className="font-medium">Discount (PKR)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value))}
            className="border rounded p-2 w-32 ml-2"
          />
        </div>
        <div className="text-xl font-bold">
          Total: PKR {calculateTotal().toFixed(2)}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        disabled={selectedProducts.length === 0}
      >
        Complete Sale
      </button>
    </div>
  );
};