import React, { useState } from 'react';

const ImagePreview = ({ url, alt = "Preview" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative">
      <img
        src={url}
        alt={alt}
        className="w-full h-64 object-contain border rounded cursor-pointer"
        onClick={toggleFullscreen}
      />

      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <img
            src={url}
            alt={alt}
            className="max-h-full max-w-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={toggleFullscreen}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;