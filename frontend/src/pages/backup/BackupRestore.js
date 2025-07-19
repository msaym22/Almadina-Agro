// src/pages/backup/BackupRestore.js
import React, { useState, useEffect } from 'react';
import backupAPI from '../../api/backup';
import Button from '../../components/common/Button';

const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = async () => {
    try {
      setLoading(true);
      const response = await backupAPI.getBackupHistory();
      setBackups(response.backups || []);
    } catch (err) {
      setError('Failed to load backup history');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      setError(null);
      await backupAPI.createBackup();
      setSuccess('Backup created successfully');
      loadBackupHistory();
    } catch (err) {
      setError('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      setError('Please select a backup file');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await backupAPI.restoreBackup(selectedFile);
      setSuccess('Backup restored successfully');
      setSelectedFile(null);
      // Reset file input
      document.getElementById('backup-file').value = '';
    } catch (err) {
      setError('Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const blob = await backupAPI.downloadBackup(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download backup');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Backup & Restore</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Backup */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Backup</h2>
          <p className="text-gray-600 mb-4">
            Create a backup of all your data including products, customers, and sales.
          </p>
          <Button
            onClick={handleCreateBackup}
            disabled={loading}
            loading={loading}
            className="w-full"
          >
            Create Backup
          </Button>
        </div>

        {/* Restore Backup */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Restore Backup</h2>
          <p className="text-gray-600 mb-4">
            Select a backup file to restore your data.
          </p>
          <div className="mb-4">
            <input
              id="backup-file"
              type="file"
              accept=".json,.zip"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600 mb-4">
              Selected: {selectedFile.name}
            </p>
          )}
          <Button
            onClick={handleRestoreBackup}
            disabled={loading || !selectedFile}
            loading={loading}
            className="w-full"
            variant="secondary"
          >
            Restore Backup
          </Button>
        </div>
      </div>

      {/* Backup History */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Backup History</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : backups.length === 0 ? (
          <p className="text-gray-600">No backups found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(backup.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.size || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownload(backup.filename)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupRestore;
export { BackupRestore };