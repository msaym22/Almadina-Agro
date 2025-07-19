import React from 'react';
import DataTable from '../common/DataTable';
import { formatCurrency, formatDate } from '../../utils/helpers';

const SaleList = ({ sales, onSelect }) => {
  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (sale) => formatDate(sale.date)
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (sale) => sale.customer?.name || 'Walk-in Customer'
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (sale) => sale.items.length
    },
    {
      header: 'Total',
      accessor: 'totalAmount',
      render: (sale) => formatCurrency(sale.totalAmount)
    },
    {
      header: 'Payment',
      accessor: 'paymentMethod',
      render: (sale) => `${sale.paymentMethod} (${sale.paymentStatus})`
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={sales}
      onRowClick={onSelect}
    />
  );
};

export default SaleList;