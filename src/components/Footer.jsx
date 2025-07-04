import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWallpaper } from '../context/WallpaperContext';

const { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } = FiIcons;

const Footer = () => {
  const { siteSettings } = useWallpaper();

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="text-white mt-16"
      style={{ 
        backgroundColor: siteSettings?.footerBg || '#1F2937',
        color: siteSettings?.footerTextColor || '#ffffff'
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              {siteSettings?.logo ? (
                <img 
                  src={siteSettings.logo} 
                  alt="Jo Baat Hey" 
                  className="h-10 w-auto"
                />
              ) : (
                <img 
                  src="/logo.png" 
                  alt="Jo Baat Hey" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}
              <div 
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-white font-bold text-lg">JB</span>
              </div>
              <div>
                <span 
                  className="text-xl font-bold"
                  style={{ fontFamily: siteSettings?.footerFont || 'inherit' }}
                >
                  {siteSettings?.siteName || 'Jo Baat Hey'}
                </span>
              </div>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              {siteSettings?.footerDescription || 'Discover premium wallpapers for all your devices. High-quality, curated collection updated daily.'}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {siteSettings?.socialLinks?.facebook && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <SafeIcon icon={FiFacebook} />
                </motion.a>
              )}
              {siteSettings?.socialLinks?.twitter && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <SafeIcon icon={FiTwitter} />
                </motion.a>
              )}
              {siteSettings?.socialLinks?.instagram && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <SafeIcon icon={FiInstagram} />
                </motion.a>
              )}
              {siteSettings?.socialLinks?.youtube && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <SafeIcon icon={FiYoutube} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: siteSettings?.footerHeadingColor || '#ffffff' }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/nature" className="text-gray-300 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-gray-300 hover:text-white transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/latest" className="text-gray-300 hover:text-white transition-colors">
                  Latest
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: siteSettings?.footerHeadingColor || '#ffffff' }}>
              Popular Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/nature" className="text-gray-300 hover:text-white transition-colors">
                  Nature
                </Link>
              </li>
              <li>
                <Link to="/category/abstract" className="text-gray-300 hover:text-white transition-colors">
                  Abstract
                </Link>
              </li>
              <li>
                <Link to="/category/urban" className="text-gray-300 hover:text-white transition-colors">
                  Urban
                </Link>
              </li>
              <li>
                <Link to="/category/space" className="text-gray-300 hover:text-white transition-colors">
                  Space
                </Link>
              </li>
              <li>
                <Link to="/category/minimal" className="text-gray-300 hover:text-white transition-colors">
                  Minimal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: siteSettings?.footerHeadingColor || '#ffffff' }}>
              Contact Info
            </h3>
            <div className="space-y-3">
              {siteSettings?.contactInfo?.email && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="text-gray-400" />
                  <span className="text-gray-300">{siteSettings.contactInfo.email}</span>
                </div>
              )}
              {siteSettings?.contactInfo?.phone && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="text-gray-400" />
                  <span className="text-gray-300">{siteSettings.contactInfo.phone}</span>
                </div>
              )}
              {siteSettings?.contactInfo?.address && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMapPin} className="text-gray-400" />
                  <span className="text-gray-300">{siteSettings.contactInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Footer Content */}
        {siteSettings?.customFooterContent && (
          <div 
            className="mt-8 pt-8 border-t border-gray-600"
            dangerouslySetInnerHTML={{ __html: siteSettings.customFooterContent }}
          />
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} {siteSettings?.siteName || 'Jo Baat Hey'}. {siteSettings?.copyrightText || 'All rights reserved.'}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;