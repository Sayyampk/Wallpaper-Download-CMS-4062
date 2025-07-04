import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWallpaper } from '../context/WallpaperContext';
import SEOHead from '../components/seo/SEOHead';
import VotingBox from '../components/voting/VotingBox';
import SocialShare from '../components/social/SocialShare';
import CommentSection from '../components/comments/CommentSection';
import AdSense from '../components/ads/AdSense';
import DownloadPopup from '../components/ads/DownloadPopup';

const { FiDownload, FiEye, FiArrowLeft, FiTag, FiUser, FiMonitor } = FiIcons;

const WallpaperDetail = () => {
  const { slug } = useParams();
  const { getWallpaperBySlug, downloadWallpaper, adsenseConfig } = useWallpaper();
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const wallpaper = getWallpaperBySlug(slug);

  if (!wallpaper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallpaper not found</h2>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setShowDownloadPopup(true);
  };

  const handleActualDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadWallpaper(wallpaper);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={wallpaper.seoTitle || wallpaper.title}
        description={wallpaper.seoDescription}
        keywords={wallpaper.seoKeywords}
        image={wallpaper.url}
        type="article"
        author={wallpaper.author}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} />
              <span>Back to Gallery</span>
            </Link>
          </div>
        </div>

        {/* Header Ad */}
        {adsenseConfig.enabled && (
          <div className="bg-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSense 
                slot={adsenseConfig.slots.header} 
                style={{ height: '90px' }} 
              />
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Image Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="aspect-[16/10] relative">
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {wallpaper.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                    
                    {wallpaper.watermark && (
                      <div className="absolute bottom-4 right-4">
                        <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                          © WallpaperHub
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Title and Download */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {wallpaper.title}
                    </h1>
                    <p className="text-gray-600">By {wallpaper.author}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <SafeIcon icon={FiDownload} />
                    <span>
                      {isDownloading ? 'Downloading...' : `Download (${wallpaper.downloads.toLocaleString()})`}
                    </span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallpaper Details</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiMonitor} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Resolution</p>
                      <p className="font-medium">{wallpaper.resolution}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiDownload} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">File Size</p>
                      <p className="font-medium">{wallpaper.size}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiUser} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Author</p>
                      <p className="font-medium">{wallpaper.author}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiEye} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Downloads</p>
                      <p className="font-medium">{wallpaper.downloads.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <SafeIcon icon={FiTag} />
                    <span>Tags</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {wallpaper.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
                  <Link
                    to={`/category/${wallpaper.category.toLowerCase()}`}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    {wallpaper.category}
                  </Link>
                </div>
              </motion.div>

              {/* Comments Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <CommentSection wallpaper={wallpaper} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sidebar Ad */}
              {adsenseConfig.enabled && (
                <AdSense 
                  slot={adsenseConfig.slots.sidebar} 
                  style={{ height: '250px' }} 
                />
              )}

              {/* Voting Box */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <VotingBox wallpaper={wallpaper} />
              </motion.div>

              {/* Social Share */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <SocialShare wallpaper={wallpaper} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer Ad */}
        {adsenseConfig.enabled && (
          <div className="bg-white py-4 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSense 
                slot={adsenseConfig.slots.footer} 
                style={{ height: '90px' }} 
              />
            </div>
          </div>
        )}
      </div>

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

export default WallpaperDetail;