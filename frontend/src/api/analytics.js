import API from './api';

export const getSalesAnalytics = (period) => {
  return API.get(`/analytics/sales?period=${period}`);
};

export const getProductAnalytics = () => {
  return API.get('/analytics/products');
};

export const getInventoryValuation = () => {
  return API.get('/analytics/inventory');
};

export const getCustomerAnalytics = () => {
  return API.get('/analytics/customers');
};

export const getMonthlySalesReport = () => {
  return API.get('/analytics/monthly-sales');
};