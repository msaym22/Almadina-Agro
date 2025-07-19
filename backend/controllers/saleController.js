const { Sale, Product, Customer } = require('../models');
const upload = require('../middleware/upload');
const moment = require('moment');

const recordSale = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      const saleData = req.body;

      if (req.file) {
        saleData.receiptImage = req.file.path;
      }

      if (typeof saleData.items === 'string') {
        saleData.items = JSON.parse(saleData.items);
      }

      const { customerId, items, discount = 0, paymentMethod, paymentStatus } = saleData;

      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const productIds = items.map(item => item.productId);
      const products = await Product.findAll({ where: { id: productIds } });

      if (products.length !== items.length) {
        return res.status(400).json({ error: 'Invalid product IDs' });
      }

      let totalAmount = 0;

      for (const item of items) {
        const product = products.find(p => p.id === item.productId);

        if (item.quantity > product.stock) {
          return res.status(400).json({
            error: `Insufficient stock for ${product.name}`
          });
        }

        totalAmount += product.sellingPrice * item.quantity;
      }

      totalAmount -= discount;

      const sale = await Sale.create({
        customerId,
        items,
        totalAmount,
        discount,
        paymentMethod,
        paymentStatus,
        date: new Date(),
        receiptImage: saleData.receiptImage
      });

      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        product.stock -= item.quantity;
        await product.save();
      }

      if (paymentMethod === 'credit' && paymentStatus !== 'paid') {
        customer.outstandingBalance += totalAmount;
        await customer.save();
      }

      res.status(201).json(sale);
    });
  } catch (err) {
    res.status(500).json({ error: 'Sale recording failed' });
  }
};

const getSales = async (req, res) => {
  const { startDate, endDate, customerId, page = 1, limit = 20 } = req.query;

  const where = {};

  if (startDate && endDate) {
    where.date = {
      [Op.between]: [
        moment(startDate).startOf('day').toDate(),
        moment(endDate).endOf('day').toDate()
      ]
    };
  }

  if (customerId) {
    where.customerId = customerId;
  }

  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Sale.findAndCountAll({
      where,
      include: [{ model: Customer, as: 'customer' }],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      sales: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }]
    });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const products = await Product.findAll({
      where: { id: sale.items.map(item => item.productId) }
    });

    const invoiceData = {
      sale,
      products: sale.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          name: product.name,
          price: product.sellingPrice
        };
      })
    };

    res.json(invoiceData);
  } catch (err) {
    res.status(500).json({ error: 'Invoice generation failed' });
  }
};

module.exports = {
  recordSale,
  getSales,
  generateInvoice
};