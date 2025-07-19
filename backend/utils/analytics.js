const moment = require('moment');

module.exports = {
  calculateMonthlySales: (sales) => {
    const monthlySales = {};

    sales.forEach(sale => {
      const month = moment(sale.date).format('YYYY-MM');

      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }

      monthlySales[month] += sale.totalAmount;
    });

    // Fill in missing months
    const start = moment().subtract(11, 'months').startOf('month');
    const end = moment().endOf('month');
    const result = [];

    while (start.isBefore(end)) {
      const month = start.format('YYYY-MM');
      result.push({
        month,
        total: monthlySales[month] || 0
      });
      start.add(1, 'month');
    }

    return result;
  },

  calculateProductPerformance: (products, sales) => {
    const productMap = {};

    // Initialize product data
    products.forEach(product => {
      productMap[product.id] = {
        id: product.id,
        name: product.name,
        quantitySold: 0,
        revenue: 0
      };
    });

    // Calculate sales data
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (productMap[item.productId]) {
          productMap[item.productId].quantitySold += item.quantity;
          productMap[item.productId].revenue += item.price * item.quantity;
        }
      });
    });

    // Convert to array and sort
    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  },

  calculateStockTurnover: (products) => {
    return products.map(product => {
      const turnover = product.purchasePrice && product.stock > 0
        ? (product.sellingPrice * product.stock) / product.purchasePrice
        : 0;
      return {
        id: product.id,
        name: product.name,
        turnover: turnover.toFixed(2)
      };
    }).sort((a, b) => b.turnover - a.turnover);
  }
};