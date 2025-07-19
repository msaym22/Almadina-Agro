// src/api/backup.js
import api from './api';

export const createBackup = async () => {
  try {
    const response = await api.post('/backup/create');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreBackup = async (file) => {
  try {
    const formData = new FormData();
    formData.append('backup', file);

    const response = await api.post('/backup/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBackupHistory = async () => {
  try {
    const response = await api.get('/backup/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadBackup = async (filename) => {
  try {
    const response = await api.get(`/backup/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export as default object (backupAPI)
const backupAPI = {
  createBackup,
  restoreBackup,
  getBackupHistory,
  downloadBackup,
};

export default backupAPI;