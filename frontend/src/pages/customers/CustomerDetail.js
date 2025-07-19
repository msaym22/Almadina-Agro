import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerById, updateCustomerBalance } from '../../api/customers';
import CustomerForm from '../../components/customers/CustomerForm';
import DataTable from '../../components/common/DataTable';
import { formatCurrency } from '../../utils/helpers';

const CustomerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCustomer, status, error } = useSelector(state => state.customers);
  const [balanceAdjustment, setBalanceAdjustment] = useState(0);
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  useEffect(() => {
    dispatch(fetchCustomerById(id));
  }, [dispatch, id]);

  const handleBalanceUpdate = async () => {
    if (!balanceAdjustment || isNaN(balanceAdjustment)) {
      return;
    }

    try {
      await dispatch(updateCustomerBalance({
        id: currentCustomer.id,
        amount: parseFloat(balanceAdjustment)
      })).unwrap();
      setBalanceAdjustment(0);
      setAdjustmentNotes('');
    } catch (err) {
      console.error('Failed to update balance', err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (!currentCustomer) {
    return (
      <div className="text-center py-8">
        <p>Customer not found</p>
        <Link
          to="/customers"
          className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (item) => new Date(item.date).toLocaleDateString()
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (item) => formatCurrency(item.totalAmount)
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (item) => formatCurrency(item.discount)
    },
    {
      header: 'Payment',
      accessor: 'paymentMethod',
      render: (item) => `${item.paymentMethod} (${item.paymentStatus})`
    },
    {
      header: 'Actions',
      render: (item) => (
        <Link
          to={`/sales/${item.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          View
        </Link>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentCustomer.name}</h1>
        <Link
          to={`/customers/edit/${currentCustomer.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Customer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Contact</label>
              <p className="font-medium">{currentCustomer.contact || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <p>{currentCustomer.address || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Credit Limit</label>
              <p className="font-medium">{formatCurrency(currentCustomer.creditLimit)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Outstanding Balance</label>
              <p className={`font-medium ${
                currentCustomer.outstandingBalance > 0
                  ? 'text-red-600'
                  : currentCustomer.outstandingBalance < 0
                    ? 'text-green-600'
                    : ''
              }`}>
                {formatCurrency(currentCustomer.outstandingBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Balance Adjustment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (PKR)</label>
              <input
                type="number"
                step="0.01"
                value={balanceAdjustment}
                onChange={(e) => setBalanceAdjustment(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
              />
              <p className="text-sm text-gray-500 mt-1">
                Positive to add credit, negative to add payment
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={adjustmentNotes}
                onChange={(e) => setAdjustmentNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="Reason for adjustment"
              />
            </div>

            <button
              onClick={handleBalanceUpdate}
              disabled={!balanceAdjustment}
              className={`px-4 py-2 text-white rounded ${
                !balanceAdjustment
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Update Balance
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Purchase History</h2>
        {currentCustomer.purchases?.length > 0 ? (
          <DataTable
            columns={columns}
            data={currentCustomer.purchases}
          />
        ) : (
          <p>No purchase history found</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;