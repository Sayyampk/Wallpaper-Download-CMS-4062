import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWallpaper } from '../context/WallpaperContext';
import DownloadPopup from './ads/DownloadPopup';

const { FiDownload, FiEye, FiHeart } = FiIcons;

const WallpaperCard = ({ wallpaper }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const { downloadWallpaper } = useWallpaper();

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show popup first
    setShowDownloadPopup(true);
  };

  const handleActualDownload = async () => {
    setIsLoading(true);
    try {
      await downloadWallpaper(wallpaper);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/wallpaper/${wallpaper.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={wallpaper.url}
              alt={wallpaper.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
            >
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all"
                >
                  <SafeIcon icon={FiEye} className="text-lg" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="p-3 bg-purple-600 bg-opacity-80 backdrop-blur-sm rounded-full text-white hover:bg-opacity-100 transition-all disabled:opacity-50"
                >
                  <SafeIcon 
                    icon={FiDownload} 
                    className={`text-lg ${isLoading ? 'animate-pulse' : ''}`} 
                  />
                </motion.button>
              </div>
            </motion.div>

            {/* Featured Badge */}
            {wallpaper.featured && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
              {wallpaper.title}
            </h3>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {wallpaper.category}
              </span>
              <span>{wallpaper.resolution}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>By {wallpaper.author}</span>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiDownload} className="text-xs" />
                <span>{wallpaper.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Download Popup */}
      <DownloadPopup
        isOpen={showDownloadPopup}
        onClose={() => setShowDownloadPopup(false)}
        onDownload={handleActualDownload}
        wallpaper={wallpaper}
      />
    </>
  );
};

export default WallpaperCard;