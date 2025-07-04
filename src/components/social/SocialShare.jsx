import React from 'react';
import { motion } from 'framer-motion';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiShare2, FiCopy } = FiIcons;

const SocialShare = ({ wallpaper }) => {
  const shareUrl = `${window.location.origin}/#/wallpaper/${wallpaper.slug}`;
  const title = `Check out this amazing wallpaper: ${wallpaper.title}`;
  const description = wallpaper.seoDescription || `Beautiful ${wallpaper.category} wallpaper in ${wallpaper.resolution} resolution`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <SafeIcon icon={FiShare2} className="text-lg text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Share this wallpaper</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <FacebookShareButton url={shareUrl} quote={title}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FacebookIcon size={20} round />
            <span className="text-sm font-medium">Facebook</span>
          </motion.div>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <TwitterIcon size={20} round />
            <span className="text-sm font-medium">Twitter</span>
          </motion.div>
        </TwitterShareButton>

        <LinkedinShareButton url={shareUrl} title={title} summary={description}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <LinkedinIcon size={20} round />
            <span className="text-sm font-medium">LinkedIn</span>
          </motion.div>
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={title}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <WhatsappIcon size={20} round />
            <span className="text-sm font-medium">WhatsApp</span>
          </motion.div>
        </WhatsappShareButton>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <SafeIcon icon={FiCopy} />
        <span className="text-sm font-medium">Copy Link</span>
      </motion.button>
    </div>
  );
};

export default SocialShare;