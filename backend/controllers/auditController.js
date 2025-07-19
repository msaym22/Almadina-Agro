const { Audit } = require('../models');

const logAudit = async (tableName, recordId, action, changes, userId) => {
  try {
    await Audit.create({
      tableName,
      recordId,
      action,
      changes,
      userId
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
};

module.exports = { logAudit };