import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createSale } from '../../api/sales';
import { toast } from 'react-toastify';
import CustomerSearch from '../../components/customers/CustomerSearch';
import ProductSearch from '../../components/products/ProductSearch';
import FileUpload from '../../components/common/FileUpload';
import { addSale } from '../../features/sales/saleSlice';

const NewSale = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const addProductToSale = (product) => {
    const existingItem = saleItems.find(item => item.productId === product.id);

    if (existingItem) {
      setSaleItems(
        saleItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSaleItems([
        ...saleItems,
        {
          productId: product.id,
          name: product.name,
          price: product.sellingPrice,
          quantity: 1
        }
      ]);
    }
  };

  const removeItem = (productId) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setSaleItems(
      saleItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: parseInt(quantity) }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) =>
      total + (item.price * item.quantity), 0);
  };

  const onSubmit = async (data) => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (saleItems.length === 0) {
      toast.error('Please add at least one product to the sale');
      return;
    }

    const saleData = {
      customerId: selectedCustomer.id,
      items: saleItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      discount: parseFloat(data.discount) || 0,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
    };

    if (receiptImage) {
      const formData = new FormData();
      formData.append('file', receiptImage);
      formData.append('data', JSON.stringify(saleData));

      try {
        const response = await createSale(formData);
        dispatch(addSale(response.data));
        toast.success('Sale recorded successfully!');
        navigate(`/sales/${response.data.id}`);
      } catch (error) {
        toast.error('Failed to record sale');
      }
    } else {
      try {
        const response = await createSale(saleData);
        dispatch(addSale(response.data));
        toast.success('Sale recorded successfully!');
        navigate(`/sales/${response.data.id}`);
      } catch (error) {
        toast.error('Failed to record sale');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Record New Sale</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Customer</label>
            <CustomerSearch
              onSelect={setSelectedCustomer}
              value={selectedCustomer?.name || ''}
            />

            {selectedCustomer && (
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p>{selectedCustomer.contact}</p>
                <p>Outstanding: PKR {selectedCustomer.outstandingBalance.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Products</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Add Products</label>
            <ProductSearch onSelect={addProductToSale} />
          </div>

          {saleItems.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Sale Items</h3>

              <div className="border rounded">
                <div className="grid grid-cols-12 gap-2 p-2 bg-gray-50 font-medium">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1">Action</div>
                </div>

                {saleItems.map(item => (
                  <div key={item.productId} className="grid grid-cols-12 gap-2 p-2 border-t">
                    <div className="col-span-5">{item.name}</div>
                    <div className="col-span-2">PKR {item.price.toFixed(2)}</div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </div>
                    <div className="col-span-2">PKR {(item.price * item.quantity).toFixed(2)}</div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <div className="text-lg font-semibold">
                  Subtotal: PKR {calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Payment Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount (PKR)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('discount')}
                className="w-full p-2 border rounded"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                {...register('paymentMethod', { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Status</label>
              <select
                {...register('paymentStatus', { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Receipt Image</label>
              <FileUpload
                onFileSelect={setReceiptImage}
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Record Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSale;