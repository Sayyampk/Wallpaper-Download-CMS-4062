import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const { FiMessageSquare, FiTrash2, FiSearch, FiUser, FiImage, FiHeart } = FiIcons;

const CommentManagement = () => {
  const { comments, users, wallpapers } = useWallpaper();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComments = comments.filter(comment => {
    const user = users.find(u => u.id === comment.userId);
    const wallpaper = wallpapers.find(w => w.id === comment.wallpaperId);
    
    return comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (user && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (wallpaper && wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      // Delete comment logic here
      console.log('Delete comment:', commentId);
    }
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId) || { name: 'Unknown User', avatar: '' };
  };

  const getWallpaperById = (wallpaperId) => {
    return wallpapers.find(w => w.id === wallpaperId) || { title: 'Unknown Wallpaper' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comment Management</h1>
        <p className="text-gray-600">Manage user comments and feedback</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment, index) => {
          const user = getUserById(comment.userId);
          const wallpaper = getWallpaperById(comment.wallpaperId);
          
          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUser} className="text-gray-400 text-sm" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Comment"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <SafeIcon icon={FiImage} className="text-xs" />
                      <span>On: {wallpaper.title}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <SafeIcon icon={FiHeart} className="text-xs" />
                      <span>{comment.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiMessageSquare} className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default CommentManagement;