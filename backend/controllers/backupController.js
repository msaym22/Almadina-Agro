const { backupDatabase } = require('../utils/backup');
const fs = require('fs');
const path = require('path');

const createBackup = async (req, res) => {
  try {
    const backupPath = await backupDatabase();
    res.download(backupPath);
  } catch (err) {
    res.status(500).json({ error: 'Backup creation failed' });
  }
};

const restoreBackup = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const backupFile = req.files.file;
  const backupDir = path.join(__dirname, '../../', process.env.BACKUP_DIR);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const filePath = path.join(backupDir, backupFile.name);
  await backupFile.mv(filePath);

  try {
    const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const { decrypt } = require('../utils/encryption');
    const decryptedData = decrypt(backupData);
    const { products, customers, sales } = JSON.parse(decryptedData);

    await require('../models').sequelize.sync({ force: true });

    await Promise.all([
      ...products.map(p => require('../models').Product.create(p)),
      ...customers.map(c => require('../models').Customer.create(c)),
      ...sales.map(s => require('../models').Sale.create(s))
    ]);

    res.json({ message: 'Restore completed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Restore failed' });
  }
};

const scheduleBackups = () => {
  setInterval(async () => {
    try {
      await backupDatabase();
      console.log('Scheduled backup completed');
    } catch (err) {
      console.error('Scheduled backup failed:', err);
    }
  }, 24 * 60 * 60 * 1000);
};

module.exports = {
  createBackup,
  restoreBackup,
  scheduleBackups
};