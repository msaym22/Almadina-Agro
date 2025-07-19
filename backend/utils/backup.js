const fs = require('fs');
const path = require('path');
const { Product, Customer, Sale } = require('../models');
const { encrypt } = require('./encryption');
const moment = require('moment');

const backupDatabase = async () => {
  try {
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const backupDir = path.join(__dirname, '../..', process.env.BACKUP_DIR);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const products = await Product.findAll();
    const customers = await Customer.findAll();
    const sales = await Sale.findAll();

    const backupData = {
      timestamp: new Date(),
      products: products.map(p => p.toJSON()),
      customers: customers.map(c => c.toJSON()),
      sales: sales.map(s => s.toJSON())
    };

    const jsonData = JSON.stringify(backupData);
    const encrypted = encrypt(jsonData);

    const backupPath = path.join(backupDir, `backup_${timestamp}.enc`);
    fs.writeFileSync(backupPath, JSON.stringify(encrypted));

    console.log(`Backup created: ${backupPath}`);
    return backupPath;
  } catch (err) {
    console.error('Backup failed:', err);
    throw err;
  }
};

module.exports = {
  backupDatabase
};