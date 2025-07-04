import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';
import WallpaperUpload from './WallpaperUpload';
import BulkWallpaperUpload from './BulkWallpaperUpload';

const { 
  FiPlus, FiEdit, FiTrash2, FiEye, FiCheck, FiX, FiDownload, FiStar, 
  FiSearch, FiImage, FiUpload, FiLayers, FiDroplet, FiAward, FiTag 
} = FiIcons;

const WallpaperManagement = () => {
  const { wallpapers, updateWallpaper, deleteWallpaper } = useWallpaper();
  const [showUpload, setShowUpload] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingWallpaper, setEditingWallpaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedWallpapers, setSelectedWallpapers] = useState(new Set());

  const filteredWallpapers = wallpapers.filter(wallpaper => {
    const matchesSearch = wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallpaper.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallpaper.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && wallpaper.approved) ||
                         (filterStatus === 'pending' && !wallpaper.approved) ||
                         (filterStatus === 'featured' && wallpaper.featured);
    
    const matchesCategory = filterCategory === 'all' || wallpaper.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleApprove = async (id) => {
    await updateWallpaper(id, { approved: true });
  };

  const handleReject = async (id) => {
    await updateWallpaper(id, { approved: false });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wallpaper?')) {
      await deleteWallpaper(id);
    }
  };

  const handleToggleFeatured = async (id, featured) => {
    await updateWallpaper(id, { featured: !featured });
  };

  const handleToggleWatermark = async (id, watermark) => {
    await updateWallpaper(id, { watermark: !watermark });
  };

  const handleBulkAction = async (action) => {
    if (selectedWallpapers.size === 0) {
      alert('Please select wallpapers first');
      return;
    }

    const updates = {};
    switch (action) {
      case 'approve':
        updates.approved = true;
        break;
      case 'reject':
        updates.approved = false;
        break;
      case 'feature':
        updates.featured = true;
        break;
      case 'unfeature':
        updates.featured = false;
        break;
      case 'delete':
        if (!window.confirm(`Delete ${selectedWallpapers.size} wallpapers?`)) return;
        break;
    }

    for (const id of selectedWallpapers) {
      if (action === 'delete') {
        await deleteWallpaper(id);
      } else {
        await updateWallpaper(id, updates);
      }
    }

    setSelectedWallpapers(new Set());
  };

  const toggleSelection = (id) => {
    const newSelection = new Set(selectedWallpapers);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedWallpapers(newSelection);
  };

  const selectAll = () => {
    if (selectedWallpapers.size === filteredWallpapers.length) {
      setSelectedWallpapers(new Set());
    } else {
      setSelectedWallpapers(new Set(filteredWallpapers.map(w => w.id)));
    }
  };

  if (showUpload) {
    return (
      <WallpaperUpload
        onBack={() => setShowUpload(false)}
        editingWallpaper={editingWallpaper}
        onComplete={() => {
          setShowUpload(false);
          setEditingWallpaper(null);
        }}
      />
    );
  }

  if (showBulkUpload) {
    return (
      <BulkWallpaperUpload
        onBack={() => setShowBulkUpload(false)}
      />
    );
  }

  const categories = [...new Set(wallpapers.map(w => w.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallpaper Management</h1>
          <p className="text-gray-600">Manage your wallpaper collection ({filteredWallpapers.length} wallpapers)</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiLayers} />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Upload Wallpaper</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search wallpapers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="featured">Featured</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={selectAll}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {selectedWallpapers.size === filteredWallpapers.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedWallpapers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg"
          >
            <span className="text-sm font-medium text-purple-700">
              {selectedWallpapers.size} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Wallpapers</p>
              <p className="text-2xl font-bold text-gray-900">{wallpapers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <SafeIcon icon={FiImage} className="text-xl text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {wallpapers.filter(w => !w.approved).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <SafeIcon icon={FiCheck} className="text-xl text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {wallpapers.filter(w => w.featured).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <SafeIcon icon={FiAward} className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {wallpapers.reduce((sum, w) => sum + w.downloads, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiDownload} className="text-xl text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wallpapers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWallpapers.map((wallpaper, index) => (
          <motion.div
            key={wallpaper.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Selection Checkbox */}
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedWallpapers.has(wallpaper.id)}
                onChange={() => toggleSelection(wallpaper.id)}
                className="absolute top-2 left-2 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 z-10"
              />
              
              <div className="relative aspect-[4/3]">
                <img
                  src={wallpaper.url}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status badges */}
                <div className="absolute top-2 right-2 space-y-1">
                  {wallpaper.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center space-x-1">
                      <SafeIcon icon={FiAward} className="text-xs" />
                      <span>Featured</span>
                    </span>
                  )}
                  {wallpaper.watermark && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center space-x-1">
                      <SafeIcon icon={FiDroplet} className="text-xs" />
                      <span>Watermark</span>
                    </span>
                  )}
                </div>

                {/* Approval status */}
                <div className="absolute bottom-2 left-2">
                  {wallpaper.approved ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {wallpaper.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center space-x-1">
                  <SafeIcon icon={FiTag} className="text-xs" />
                  <span>{wallpaper.category}</span>
                </span>
                <span>{wallpaper.resolution}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>By {wallpaper.author}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiDownload} className="text-xs" />
                    <span>{wallpaper.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiStar} className="text-xs" />
                    <span>{wallpaper.votes}</span>
                  </div>
                </div>
              </div>

              {/* SEO Info */}
              {wallpaper.seoTitle && (
                <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-medium">SEO: {wallpaper.seoTitle}</p>
                  {wallpaper.seoKeywords && (
                    <p className="mt-1">Keywords: {wallpaper.seoKeywords}</p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!wallpaper.approved && (
                    <button
                      onClick={() => handleApprove(wallpaper.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <SafeIcon icon={FiCheck} />
                    </button>
                  )}
                  {wallpaper.approved && (
                    <button
                      onClick={() => handleReject(wallpaper.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <SafeIcon icon={FiX} />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleFeatured(wallpaper.id, wallpaper.featured)}
                    className={`p-2 rounded-lg transition-colors ${
                      wallpaper.featured 
                        ? 'text-yellow-600 hover:bg-yellow-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={wallpaper.featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <SafeIcon icon={FiStar} />
                  </button>
                  <button
                    onClick={() => handleToggleWatermark(wallpaper.id, wallpaper.watermark)}
                    className={`p-2 rounded-lg transition-colors ${
                      wallpaper.watermark 
                        ? 'text-blue-600 hover:bg-blue-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={wallpaper.watermark ? 'Remove watermark' : 'Add watermark'}
                  >
                    <SafeIcon icon={FiDroplet} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingWallpaper(wallpaper);
                      setShowUpload(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <SafeIcon icon={FiEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(wallpaper.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredWallpapers.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiImage} className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No wallpapers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default WallpaperManagement;