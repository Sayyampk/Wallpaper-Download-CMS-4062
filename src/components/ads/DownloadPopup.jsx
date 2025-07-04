import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const { FiX, FiDownload, FiClock } = FiIcons;

const DownloadPopup = ({ isOpen, onClose, onDownload, wallpaper }) => {
  const { adsenseConfig } = useWallpaper();
  const [countdown, setCountdown] = useState(adsenseConfig.downloadPopup?.duration || 5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(adsenseConfig.downloadPopup?.duration || 5);
      setCanClose(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, adsenseConfig.downloadPopup?.duration]);

  useEffect(() => {
    if (isOpen && adsenseConfig.downloadPopup?.enabled && adsenseConfig.downloadPopup?.adCode) {
      // Inject Google Ad code
      const timer = setTimeout(() => {
        try {
          if (window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (error) {
          console.error('AdSense error in popup:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, adsenseConfig.downloadPopup]);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  const handleDownload = () => {
    onDownload();
    onClose();
  };

  if (!isOpen || !adsenseConfig.downloadPopup?.enabled) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={canClose ? handleClose : undefined}
          >
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiDownload} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Preparing Download</h3>
                      <p className="text-sm text-gray-200">
                        {wallpaper?.title || 'Wallpaper'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Close button (only when countdown is done) */}
                  {canClose && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleClose}
                      className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                    >
                      <SafeIcon icon={FiX} className="text-white text-sm" />
                    </motion.button>
                  )}
                </div>

                {/* Countdown */}
                {!canClose && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
                    <SafeIcon icon={FiClock} />
                    <span>Download starts in {countdown} seconds</span>
                  </div>
                )}
              </div>

              {/* Ad Content */}
              <div className="p-6">
                {adsenseConfig.downloadPopup?.customMessage && (
                  <div className="mb-4 text-center">
                    <p className="text-gray-700">{adsenseConfig.downloadPopup.customMessage}</p>
                  </div>
                )}

                {/* Google Ad Space */}
                <div className="mb-6">
                  {adsenseConfig.downloadPopup?.adCode ? (
                    <div 
                      className="min-h-[250px] bg-gray-100 rounded-lg flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: adsenseConfig.downloadPopup.adCode }}
                    />
                  ) : (
                    <div className="min-h-[250px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p className="text-sm">Advertisement Space</p>
                        <p className="text-xs mt-1">Configure in Admin Settings</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: canClose ? 1.02 : 1 }}
                  whileTap={{ scale: canClose ? 0.98 : 1 }}
                  onClick={handleDownload}
                  disabled={!canClose}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    canClose
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canClose ? (
                    <span className="flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiDownload} />
                      <span>Download Now</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiClock} />
                      <span>Please wait {countdown}s</span>
                    </span>
                  )}
                </motion.button>

                {canClose && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleClose}
                    className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    Close without downloading
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DownloadPopup;