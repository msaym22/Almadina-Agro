export default {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  DATE_FORMAT: 'dd MMM yyyy',
  CURRENCY: 'PKR',
  LOW_STOCK_THRESHOLD: 10,
  PAGE_SIZE: 20,
  BACKUP_FILE_TYPES: ['.json', '.csv', '.xlsx'],
  THEME_COLORS: {
    primary: '#2E7D32',
    secondary: '#1565C0',
    danger: '#D32F2F',
    warning: '#ED6C02',
    success: '#2E7D32',
    info: '#0288D1'
  }
};