import React, { useCallback } from 'react';

const FileUpload = ({ onFileSelect, accept, multiple = false }) => {
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(multiple ? e.target.files : e.target.files[0]);
    }
  }, [onFileSelect, multiple]);

  return (
    <div className="flex items-center">
      <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-600 rounded-lg tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white">
        <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-1 text-sm">Select File</span>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
      </label>
    </div>
  );
};

export default FileUpload;