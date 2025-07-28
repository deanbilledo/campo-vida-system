import React, { useState } from 'react';
import { Button } from './Components';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageUpload, currentImage = '', label = "Image", type = "product" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [selectedFile, setSelectedFile] = useState(null);

  // Get validation limits based on type
  const getValidation = () => {
    switch (type) {
      case 'post':
        return {
          maxSize: 10 * 1024 * 1024, // 10MB for posts
          maxSizeText: '10MB',
          endpoint: '/api/upload/post'
        };
      case 'product':
      default:
        return {
          maxSize: 5 * 1024 * 1024, // 5MB for products
          maxSizeText: '5MB',
          endpoint: '/api/upload/product'
        };
    }
  };

  const validation = getValidation();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      e.target.value = '';
      return;
    }

    // Validate file size based on type
    if (file.size > validation.maxSize) {
      toast.error(`Image size must be less than ${validation.maxSizeText}`);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      // Auto-upload the file after preview is ready
      console.log('ImageUpload: Auto-uploading file:', file.name);
      setTimeout(() => {
        handleUpload(file);
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (fileToUpload = null) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    console.log('ImageUpload: Starting upload for file:', file.name);
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiClient.post(validation.endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        console.log('ImageUpload: Upload successful, imageUrl:', imageUrl);
        console.log('ImageUpload: Calling onImageUpload with:', imageUrl);
        setPreview(`http://localhost:5000${imageUrl}`);
        onImageUpload(imageUrl);
        toast.success(response.data.message || 'Image uploaded successfully!');
        setSelectedFile(null);
        
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload image';
      toast.error(errorMessage);
      setPreview(currentImage);
      setSelectedFile(null);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setSelectedFile(null);
    onImageUpload('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* File Input */}
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        
        {uploading && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
            <span>Uploading...</span>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
              style={{display: 'none'}}
            >
              Invalid image
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Instructions */}
      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, GIF, WebP. Max size: {validation.maxSizeText}
      </p>
    </div>
  );
};

export default ImageUpload;
