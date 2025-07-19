const { Customer, Sale } = require('../models');

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Customer creation failed' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const customer = await Customer.findByPk(req.params.id);
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

const getCustomers = async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` }},
      { contact: { [Op.iLike]: `%${search}%` }}
    ];
  }

  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Customer.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      customers: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{
        model: Sale,
        as: 'purchases',
        order: [['date', 'DESC']]
      }]
    });

    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    customer.outstandingBalance += amount;
    await customer.save();

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Balance update failed' });
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  getCustomers,
  getCustomerById,
  updateBalance
};