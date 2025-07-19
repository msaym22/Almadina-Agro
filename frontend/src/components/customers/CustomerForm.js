import React from 'react';
import { useForm } from 'react-hook-form';

const CustomerForm = ({ customer, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: customer || {
      name: '',
      contact: '',
      address: '',
      creditLimit: 0,
      outstandingBalance: 0
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Enter customer name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contact Number</label>
        <input
          {...register('contact')}
          className="w-full p-2 border rounded"
          placeholder="Enter contact number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          {...register('address')}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Enter address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Credit Limit (PKR)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('creditLimit')}
            className="w-full p-2 border rounded"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Initial Balance (PKR)</label>
          <input
            type="number"
            step="0.01"
            {...register('outstandingBalance')}
            className="w-full p-2 border rounded"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">Positive for credit, negative for advance payment</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {customer ? 'Update Customer' : 'Create Customer'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;