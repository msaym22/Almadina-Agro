export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const calculateProfit = (sellingPrice, purchasePrice) => {
  if (!purchasePrice || purchasePrice <= 0) return 0;
  return sellingPrice - purchasePrice;
};

export const calculateProfitMargin = (sellingPrice, purchasePrice) => {
  if (!purchasePrice || purchasePrice <= 0) return 0;
  return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
};

export const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};