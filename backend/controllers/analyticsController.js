const { Product, Sale, Customer } = require('../models');
const { calculateProfitMargins, generateSalesReport } = require('../utils/analytics');

exports.getProductAnalytics = async (req, res) => {
  try {
    const products = await Product.findAll();
    const sales = await Sale.findAll();

    const analytics = {
      profitMargins: calculateProfitMargins(products, sales),
      fastMoving: products.filter(p => p.stockQuantity < 10),
      turnoverRates: products.map(p => ({
        id: p.id,
        rate: p.stockQuantity / (p.initialStock || 1)
      }))
    };
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusinessAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const report = await generateSalesReport(period);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerAnalytics = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{ model: Sale, as: 'purchases' }]
    });

    const analytics = customers.map(customer => ({
      id: customer.id,
      totalSpent: customer.purchases.reduce((sum, sale) => sum + sale.totalAmount, 0),
      lastPurchase: customer.purchases.sort((a,b) => b.createdAt - a.createdAt)[0]?.createdAt
    }));

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};