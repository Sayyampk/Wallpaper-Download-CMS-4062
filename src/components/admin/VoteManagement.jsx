import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const { FiStar, FiSearch, FiUser, FiImage, FiTrash2 } = FiIcons;

const VoteManagement = () => {
  const { votes, users, wallpapers } = useWallpaper();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const filteredVotes = votes.filter(vote => {
    const user = users.find(u => u.id === vote.userId);
    const wallpaper = wallpapers.find(w => w.id === vote.wallpaperId);
    
    const matchesSearch = (user && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (wallpaper && wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = filterRating === 'all' || vote.rating.toString() === filterRating;
    
    return matchesSearch && matchesRating;
  });

  const handleDelete = (voteId) => {
    if (window.confirm('Are you sure you want to delete this vote?')) {
      console.log('Delete vote:', voteId);
    }
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId) || { name: 'Unknown User', avatar: '' };
  };

  const getWallpaperById = (wallpaperId) => {
    return wallpapers.find(w => w.id === wallpaperId) || { title: 'Unknown Wallpaper' };
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <SafeIcon
        key={i}
        icon={FiStar}
        className={`text-sm ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vote Management</h1>
        <p className="text-gray-600">Manage user ratings and votes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search votes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Votes List */}
      <div className="space-y-4">
        {filteredVotes.map((vote, index) => {
          const user = getUserById(vote.userId);
          const wallpaper = getWallpaperById(vote.wallpaperId);
          
          return (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <SafeIcon icon={FiUser} className="text-gray-400 text-sm" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <SafeIcon icon={FiImage} className="text-xs" />
                      <span>{wallpaper.title}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(vote.rating)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(vote.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Vote"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredVotes.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiStar} className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No votes found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default VoteManagement;