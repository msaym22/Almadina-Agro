const crypto = require('crypto');

module.exports = {
  generateSKU: () => {
    const prefix = 'SKU-';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}-${random}`;
  },

  formatDate: (date) => {
    return new Date(date).toISOString().split('T')[0];
  },

  calculateProfitMargin: (sellingPrice, purchasePrice) => {
    if (!purchasePrice || purchasePrice <= 0) return 0;
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
  },

  encryptData: (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  },

  decryptData: (encryptedData, key) => {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const encryptedText = Buffer.from(encryptedData.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
};