import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';
import toast from 'react-hot-toast';

const { FiPalette, FiType, FiImage, FiSave, FiEye, FiUpload } = FiIcons;

const SiteDesigner = () => {
  const { siteSettings, setSiteSettings } = useWallpaper();
  const [activeTab, setActiveTab] = useState('header');
  const [previewMode, setPreviewMode] = useState(false);

  const [settings, setSettings] = useState({
    // Site Identity
    siteName: siteSettings?.siteName || 'Jo Baat Hey',
    tagline: siteSettings?.tagline || 'Premium Wallpapers Collection',
    logo: siteSettings?.logo || '',
    favicon: siteSettings?.favicon || '',
    
    // Colors
    primaryColor: siteSettings?.primaryColor || '#7C3AED',
    secondaryColor: siteSettings?.secondaryColor || '#3B82F6',
    accentColor: siteSettings?.accentColor || '#F59E0B',
    backgroundColor: siteSettings?.backgroundColor || '#F9FAFB',
    
    // Header Design
    headerBg: siteSettings?.headerBg || '#ffffff',
    headerTextColor: siteSettings?.headerTextColor || '#374151',
    headerFont: siteSettings?.headerFont || 'Inter',
    headerHeight: siteSettings?.headerHeight || '64px',
    headerShadow: siteSettings?.headerShadow || true,
    searchPlaceholder: siteSettings?.searchPlaceholder || 'Search wallpapers...',
    
    // Footer Design
    footerBg: siteSettings?.footerBg || '#1F2937',
    footerTextColor: siteSettings?.footerTextColor || '#ffffff',
    footerHeadingColor: siteSettings?.footerHeadingColor || '#ffffff',
    footerFont: siteSettings?.footerFont || 'Inter',
    footerDescription: siteSettings?.footerDescription || 'Discover premium wallpapers for all your devices.',
    copyrightText: siteSettings?.copyrightText || 'All rights reserved.',
    customFooterContent: siteSettings?.customFooterContent || '',
    
    // Typography
    headingFont: siteSettings?.headingFont || 'Inter',
    bodyFont: siteSettings?.bodyFont || 'Inter',
    fontSize: siteSettings?.fontSize || '16px',
    
    // Homepage Layout
    heroTitle: siteSettings?.heroTitle || 'Premium Wallpapers',
    heroSubtitle: siteSettings?.heroSubtitle || 'Free Download',
    heroDescription: siteSettings?.heroDescription || 'Discover thousands of high-quality wallpapers',
    heroBackground: siteSettings?.heroBackground || '',
    featuredSectionTitle: siteSettings?.featuredSectionTitle || 'Featured Wallpapers',
    categoriesTitle: siteSettings?.categoriesTitle || 'Browse Categories',
    
    // Social Links
    socialLinks: siteSettings?.socialLinks || {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    
    // Contact Info
    contactInfo: siteSettings?.contactInfo || {
      email: '',
      phone: '',
      address: ''
    }
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setSiteSettings(settings);
    toast.success('Site design saved successfully!');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSettings(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'header', label: 'Header Design', icon: FiType },
    { id: 'footer', label: 'Footer Design', icon: FiType },
    { id: 'colors', label: 'Colors & Theme', icon: FiPalette },
    { id: 'homepage', label: 'Homepage Layout', icon: FiImage },
    { id: 'identity', label: 'Site Identity', icon: FiImage }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Designer</h1>
          <p className="text-gray-600">Customize your website's appearance and branding</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiEye} />
            <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <SafeIcon icon={FiSave} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Site Identity Tab */}
          {activeTab === 'identity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Identity</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Upload
                  </label>
                  <div className="flex items-center space-x-4">
                    {settings.logo && (
                      <img src={settings.logo} alt="Logo" className="h-12 w-auto" />
                    )}
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                      <SafeIcon icon={FiUpload} className="inline mr-2" />
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Header Design Tab */}
          {activeTab === 'header' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Header Design</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.headerBg}
                    onChange={(e) => handleInputChange('headerBg', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={settings.headerTextColor}
                    onChange={(e) => handleInputChange('headerTextColor', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.headerFont}
                    onChange={(e) => handleInputChange('headerFont', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Placeholder
                  </label>
                  <input
                    type="text"
                    value={settings.searchPlaceholder}
                    onChange={(e) => handleInputChange('searchPlaceholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.headerShadow}
                    onChange={(e) => handleInputChange('headerShadow', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Header Shadow
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer Design Tab */}
          {activeTab === 'footer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Design</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.footerBg}
                    onChange={(e) => handleInputChange('footerBg', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={settings.footerTextColor}
                    onChange={(e) => handleInputChange('footerTextColor', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Description
                  </label>
                  <textarea
                    value={settings.footerDescription}
                    onChange={(e) => handleInputChange('footerDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={settings.copyrightText}
                    onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Links
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="Facebook URL"
                      value={settings.socialLinks.facebook}
                      onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={settings.socialLinks.twitter}
                      onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={settings.socialLinks.instagram}
                      onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Contact Email"
                      value={settings.contactInfo.email}
                      onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={settings.contactInfo.phone}
                      onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={settings.contactInfo.address}
                      onChange={(e) => handleNestedChange('contactInfo', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Colors & Theme Tab */}
          {activeTab === 'colors' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Colors & Theme</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Homepage Layout Tab */}
          {activeTab === 'homepage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Homepage Layout</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.heroSubtitle}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Description
                  </label>
                  <textarea
                    value={settings.heroDescription}
                    onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Section Title
                  </label>
                  <input
                    type="text"
                    value={settings.featuredSectionTitle}
                    onChange={(e) => handleInputChange('featuredSectionTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories Title
                  </label>
                  <input
                    type="text"
                    value={settings.categoriesTitle}
                    onChange={(e) => handleInputChange('categoriesTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          
          <div className="border rounded-lg overflow-hidden">
            {/* Header Preview */}
            <div 
              className="p-4 flex items-center justify-between"
              style={{ 
                backgroundColor: settings.headerBg,
                color: settings.headerTextColor,
                fontFamily: settings.headerFont
              }}
            >
              <div className="flex items-center space-x-2">
                {settings.logo && (
                  <img src={settings.logo} alt="Logo" className="h-8 w-auto" />
                )}
                <div>
                  <span className="font-bold">{settings.siteName}</span>
                  {settings.tagline && (
                    <p className="text-xs opacity-75">{settings.tagline}</p>
                  )}
                </div>
              </div>
              <div className="text-sm">Navigation Menu</div>
            </div>

            {/* Content Preview */}
            <div 
              className="p-8 text-center"
              style={{ backgroundColor: settings.backgroundColor }}
            >
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: settings.primaryColor }}
              >
                {settings.heroTitle}
              </h1>
              <h2 
                className="text-xl mb-4"
                style={{ color: settings.secondaryColor }}
              >
                {settings.heroSubtitle}
              </h2>
              <p className="text-gray-600 mb-6">{settings.heroDescription}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Category {i}</span>
                  </div>
                ))}
              </div>
              
              <h3 
                className="text-xl font-semibold mb-4"
                style={{ color: settings.primaryColor }}
              >
                {settings.featuredSectionTitle}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Wallpaper {i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Preview */}
            <div 
              className="p-4 text-center"
              style={{ 
                backgroundColor: settings.footerBg,
                color: settings.footerTextColor
              }}
            >
              <p className="text-sm mb-2">{settings.footerDescription}</p>
              <p className="text-xs opacity-75">
                © 2024 {settings.siteName}. {settings.copyrightText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDesigner;