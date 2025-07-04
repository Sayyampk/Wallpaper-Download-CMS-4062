import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';
import toast from 'react-hot-toast';

const { FiUpload, FiX, FiCheck, FiAlertCircle, FiArrowLeft, FiSettings } = FiIcons;

const BulkWallpaperUpload = ({ onBack }) => {
  const { categories, createWallpaper } = useWallpaper();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [bulkSettings, setBulkSettings] = useState({
    category: '',
    author: '',
    featured: false,
    watermark: true,
    autoApprove: false,
    tagPrefix: '',
    seoKeywords: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      const fileId = Date.now() + index;
      
      reader.onload = () => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, preview: reader.result, status: 'ready' }
              : f
          )
        );
      };
      reader.readAsDataURL(file);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, resolution: `${img.width}x${img.height}` }
              : f
          )
        );
      };
      img.src = URL.createObjectURL(file);

      return {
        id: fileId,
        file,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'processing',
        preview: null,
        resolution: 'Calculating...',
        tags: []
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileData = (fileId, field, value) => {
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId ? { ...f, [field]: value } : f
      )
    );
  };

  const handleBulkUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!bulkSettings.category) {
      toast.error('Please select a category for bulk upload');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of uploadedFiles) {
      try {
        // Update status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id ? { ...f, status: 'uploading' } : f
          )
        );

        const wallpaperData = {
          title: file.title,
          category: bulkSettings.category,
          tags: [
            ...file.tags,
            ...(bulkSettings.tagPrefix ? [bulkSettings.tagPrefix] : []),
            file.title.toLowerCase().split(' ')
          ].flat().filter(Boolean),
          resolution: file.resolution,
          size: file.size,
          author: bulkSettings.author || 'Admin',
          featured: bulkSettings.featured,
          watermark: bulkSettings.watermark,
          approved: bulkSettings.autoApprove,
          url: file.preview,
          fullUrl: file.preview,
          thumbnailUrl: file.preview,
          seoTitle: `${file.title} - Premium Wallpaper`,
          seoDescription: `Download ${file.title} wallpaper in ${file.resolution} resolution`,
          seoKeywords: [
            file.title,
            bulkSettings.category,
            bulkSettings.seoKeywords,
            'wallpaper',
            'download',
            file.resolution
          ].filter(Boolean).join(', ')
        };

        await createWallpaper(wallpaperData);
        
        // Update status to success
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id ? { ...f, status: 'success' } : f
          )
        );
        
        successCount++;
      } catch (error) {
        // Update status to error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id ? { ...f, status: 'error' } : f
          )
        );
        errorCount++;
      }
    }

    setUploading(false);
    toast.success(`Bulk upload completed! ${successCount} uploaded, ${errorCount} failed`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <SafeIcon icon={FiCheck} className="text-green-500" />;
      case 'error': return <SafeIcon icon={FiAlertCircle} className="text-red-500" />;
      case 'uploading': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default: return <SafeIcon icon={FiUpload} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Wallpaper Upload</h1>
          <p className="text-gray-600">Upload multiple wallpapers at once with bulk settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bulk Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiSettings} className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Bulk Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={bulkSettings.category}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={bulkSettings.author}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Prefix
                </label>
                <input
                  type="text"
                  value={bulkSettings.tagPrefix}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, tagPrefix: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., premium, hd, 4k"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={bulkSettings.seoKeywords}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, seoKeywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Common keywords"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={bulkSettings.featured}
                    onChange={(e) => setBulkSettings(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Mark as Featured
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={bulkSettings.watermark}
                    onChange={(e) => setBulkSettings(prev => ({ ...prev, watermark: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Apply Watermark
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={bulkSettings.autoApprove}
                    onChange={(e) => setBulkSettings(prev => ({ ...prev, autoApprove: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Auto Approve
                  </label>
                </div>
              </div>

              <button
                onClick={handleBulkUpload}
                disabled={uploading || uploadedFiles.length === 0}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : `Upload ${uploadedFiles.length} Files`}
              </button>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
            }`}
          >
            <input {...getInputProps()} />
            <SafeIcon icon={FiUpload} className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive ? 'Drop the images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500">or click to select multiple files</p>
            <p className="text-xs text-gray-400 mt-2">
              Supports: JPEG, PNG, WebP (Max 10MB each)
            </p>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Preview */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <SafeIcon icon={FiUpload} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="text"
                            value={file.title}
                            onChange={(e) => updateFileData(file.id, 'title', e.target.value)}
                            className="text-sm font-medium text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none transition-colors"
                            disabled={uploading}
                          />
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(file.status)}
                            <button
                              onClick={() => removeFile(file.id)}
                              disabled={uploading}
                              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <SafeIcon icon={FiX} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{file.resolution}</span>
                          <span>{file.size}</span>
                        </div>

                        <input
                          type="text"
                          value={file.tags.join(', ')}
                          onChange={(e) => updateFileData(file.id, 'tags', e.target.value.split(',').map(tag => tag.trim()))}
                          placeholder="Custom tags (comma separated)"
                          className="mt-2 w-full text-xs text-gray-600 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none transition-colors"
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkWallpaperUpload;