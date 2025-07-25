const { Sale, SaleItem, Product, Customer } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment'); // Make sure moment is installed (npm install moment)

// Create a new sale
exports.createSale = async (req, res) => {
  console.log("Sale creation request received. req.body:", req.body); // Log incoming request body
  let transaction;
  try {
    // Assuming saleData is sent as a JSON string in a 'saleData' field of FormData
    // And receiptImage (if any) is in req.file
    const { saleData } = req.body;
    const parsedSaleData = JSON.parse(saleData);
    console.log("Parsed Sale Data:", parsedSaleData); // Log parsed data

    const receiptImage = req.file ? req.file.path : null; // Get image path if uploaded

    transaction = await Sale.sequelize.transaction();

    // Validate customer and products existence before creating sale
    const customer = await Customer.findByPk(parsedSaleData.customerId, { transaction });
    // Allow sale without a customer (e.g., walk-in) if customerId is null/undefined
    if (parsedSaleData.customerId && !customer) {
      throw new Error('Customer not found');
    }

    const productIds = parsedSaleData.items.map(item => item.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction });

    if (products.length !== parsedSaleData.items.length) {
      // This check might be too strict if some items are invalid but others are valid.
      // Consider filtering out invalid items or returning a more specific error.
      throw new Error('One or more product IDs in sale items are invalid or not found');
    }

    // Calculate total amount and prepare sale items
    let calculatedSubTotal = 0;
    const saleItemsToCreate = [];

    for (const item of parsedSaleData.items) {
      const product = products.find(p => p.id === item.productId);

      if (item.quantity > product.stock) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      const itemPrice = product.sellingPrice; // Use product's current selling price
      calculatedSubTotal += itemPrice * item.quantity;
      saleItemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: itemPrice, // Record price at the time of sale
      });
    }

    const finalTotalAmount = calculatedSubTotal - (parsedSaleData.discount || 0);

    // Create the sale record
    const sale = await Sale.create({
      customerId: parsedSaleData.customerId,
      saleDate: parsedSaleData.saleDate || new Date(), // Use provided date or current date
      totalAmount: finalTotalAmount,
      subTotal: calculatedSubTotal, // Store subTotal
      discount: parsedSaleData.discount || 0,
      paymentMethod: parsedSaleData.paymentMethod,
      paymentStatus: parsedSaleData.paymentStatus,
      notes: parsedSaleData.notes || '',
      receiptImage: receiptImage,
    }, { transaction });

    // Create sale items and update product stock within the same transaction
    for (const itemData of saleItemsToCreate) {
      await SaleItem.create({
        saleId: sale.id,
        productId: itemData.productId,
        quantity: itemData.quantity,
        priceAtSale: itemData.priceAtSale
      }, { transaction });

      // Update product stock
      const productToUpdate = products.find(p => p.id === itemData.productId);
      if (productToUpdate) {
        productToUpdate.stock -= itemData.quantity;
        await productToUpdate.save({ transaction });
      }
    }

    // Update customer's outstanding balance if payment method is credit and not fully paid
    if (parsedSaleData.paymentMethod === 'credit' && parsedSaleData.paymentStatus !== 'paid' && customer) {
      customer.outstandingBalance = (customer.outstandingBalance || 0) + finalTotalAmount;
      await customer.save({ transaction });
    }

    await transaction.commit();

    // Fetch the created sale with all necessary associations for the frontend
    const createdSale = await Sale.findByPk(sale.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'contact', 'address', 'outstandingBalance']
        },
        {
          model: SaleItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sellingPrice', 'nameUrdu']
            }
          ]
        }
      ]
    });

    console.log("Sale created and fetched successfully:", createdSale); // Log final response
    res.status(201).json(createdSale);

  } catch (error) {
    if (transaction) await transaction.rollback(); // Rollback transaction on error
    console.error('Error creating sale:', error); // Log full error object
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors.map(e => e.message) });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Invalid customer or product ID due to foreign key constraint', details: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Duplicate entry', details: error.message });
    }
    res.status(500).json({ error: 'Failed to create sale', details: error.message });
  }
};

// Get all sales with pagination and search
exports.getSales = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    const where = {};
    const customerWhere = {};
    const productWhere = {}; // New: for searching products within sale items

    if (search) {
      if (!isNaN(search) && parseFloat(search).toString() === search) { // Check if it's a number
        where[Op.or] = [
          { id: parseInt(search) }, // Search by Sale ID
          { totalAmount: parseFloat(search) } // Search by Total Amount
        ];
      } else {
        // Search by customer name (case-insensitive)
        customerWhere.name = { [Op.iLike]: `%${search}%` };
        // Search by product name (case-insensitive)
        productWhere.name = { [Op.iLike]: `%${search}%` };
      }
    }

    if (req.query.customerId) { // Filter by specific customer ID if provided
      where.customerId = req.query.customerId;
    }

    if (req.query.startDate && req.query.endDate) {
      where.saleDate = {
        [Op.between]: [
          moment(req.query.startDate).startOf('day').toDate(),
          moment(req.query.endDate).endOf('day').toDate()
        ]
      };
    } else if (req.query.startDate) {
      where.saleDate = { [Op.gte]: moment(req.query.startDate).startOf('day').toDate() };
    } else if (req.query.endDate) {
      where.saleDate = { [Op.lte]: moment(req.query.endDate).endOf('day').toDate() };
    }

    const includeOptions = [
      {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name', 'contact', 'address'],
        where: Object.keys(customerWhere).length > 0 ? customerWhere : undefined,
        required: Object.keys(customerWhere).length > 0 // INNER JOIN if customer search is active
      },
      {
        model: SaleItem,
        as: 'items',
        attributes: ['quantity', 'priceAtSale'],
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'nameUrdu', 'sellingPrice'],
            where: Object.keys(productWhere).length > 0 ? productWhere : undefined,
            required: Object.keys(productWhere).length > 0 // INNER JOIN if product search is active
          }
        ],
        required: Object.keys(productWhere).length > 0 // INNER JOIN if product search is active
      }
    ];

    // If no specific customer or product search, make includes LEFT OUTER JOINs to not filter out sales
    if (Object.keys(customerWhere).length === 0) {
      includeOptions[0].required = false; // LEFT OUTER JOIN for customer
    }
    if (Object.keys(productWhere).length === 0) {
      includeOptions[1].required = false; // LEFT OUTER JOIN for items
      includeOptions[1].include[0].required = false; // LEFT OUTER JOIN for product within items
    }


    const { count, rows } = await Sale.findAndCountAll({
      where,
      order: [['saleDate', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
      include: includeOptions
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      sales: rows, // Ensure this is 'sales' for the frontend's fetchSales.fulfilled
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Failed to fetch sales:', err); // Log full error object
    res.status(500).json({ error: 'Failed to fetch sales', details: err.message });
  }
};

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'contact', 'address', 'outstandingBalance'] },
        {
          model: SaleItem,
          as: 'items',
          attributes: ['quantity', 'priceAtSale'],
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sellingPrice', 'nameUrdu'] }] // Added 'nameUrdu'
        }
      ]
    });

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (err) {
    console.error('Server error fetching sale by ID:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update a sale by ID
exports.updateSale = async (req, res) => {
  console.log("Sale update request received. req.body:", req.body);
  const { id } = req.params;
  const { items, ...saleData } = req.body; // Destructure items if present

  let transaction;
  try {
    transaction = await Sale.sequelize.transaction();

    const [updatedRows] = await Sale.update(saleData, {
      where: { id },
      transaction,
      returning: true // Return the updated row
    });

    if (updatedRows === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Sale not found' });
    }

    if (items && items.length > 0) {
      await SaleItem.destroy({ where: { saleId: id }, transaction }); // Delete old items
      for (const item of items) {
        await SaleItem.create({
          saleId: id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: item.priceAtSale // Use priceAtSale from frontend
        }, { transaction });

        // This is a simplified stock update. For a real system, you'd need to calculate
        // the difference between old and new quantities for the product.
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          product.stock -= item.quantity;
          await product.save({ transaction });
        }
      }
    }

    await transaction.commit();

    const updatedSale = await Sale.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name'] },
        { model: SaleItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'nameUrdu'] }] }
      ]
    });
    console.log("Sale updated successfully:", updatedSale);
    res.json(updatedSale);

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Sale update failed:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
  console.log("Sale deletion request received. id:", req.params.id);
  let transaction;
  try {
    transaction = await Sale.sequelize.transaction();

    // Revert stock for products in this sale before deleting
    const saleItems = await SaleItem.findAll({ where: { saleId: req.params.id }, transaction });
    for (const item of saleItems) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (product) {
        product.stock += item.quantity; // Add back stock
        await product.save({ transaction });
      }
    }

    const deleted = await Sale.destroy({
      where: { id: req.params.id },
      transaction
    });

    if (deleted) {
      await transaction.commit();
      console.log("Sale deleted successfully. ID:", req.params.id);
      res.status(204).send();
    } else {
      await transaction.rollback();
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Sale deletion failed:', err);
    res.status(500).json({ error: 'Deletion failed', details: err.message });
  }
};

// Fetches data for a single invoice and sends it to the frontend
exports.generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'contact', 'address', 'outstandingBalance']
        },
        {
          model: SaleItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sellingPrice', 'nameUrdu']
          }]
        }
      ]
    });

    if (sale) {
      // The frontend expects a specific data structure. We format it here.
      const invoiceData = {
        invoiceId: sale.id,
        customerName: sale.customer ? sale.customer.name : 'Walk-in Customer',
        customerPhone: sale.customer ? sale.customer.contact : 'N/A',
        customerAddress: sale.customer ? sale.customer.address : 'N/A',
        date: sale.saleDate,
        paymentMethod: sale.paymentMethod,
        paymentStatus: sale.paymentStatus,
        subTotal: sale.subTotal,
        discount: sale.discount,
        grandTotal: sale.totalAmount,
        notes: sale.notes,
        items: sale.items.map(item => ({
          id: item.id,
          productName: item.product.name,
          productNameUrdu: item.product.nameUrdu,
          quantity: item.quantity,
          unitPrice: item.priceAtSale,
          total: item.quantity * item.priceAtSale,
        })),
      };
      res.json(invoiceData);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (err) {
    console.error('Server error fetching invoice data:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Export all functions
module.exports = {
  createSale: exports.createSale,
  getSales: exports.getSales,
  getSaleById: exports.getSaleById,
  updateSale: exports.updateSale,
  deleteSale: exports.deleteSale,
  generateInvoice: exports.generateInvoice,
};

console.log('--- saleController.js has been loaded. Exports:', module.exports);