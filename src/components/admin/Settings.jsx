import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const { FiSettings, FiSave, FiDollarSign, FiGlobe, FiShield, FiMail, FiClock } = FiIcons;

const Settings = () => {
  const { adsenseConfig, setAdsenseConfig } = useWallpaper();
  const [settings, setSettings] = useState({
    siteName: 'WallpaperHub',
    siteDescription: 'Premium wallpapers for desktop and mobile',
    contactEmail: 'admin@wallpaper.com',
    allowUserUploads: true,
    moderateComments: true,
    enableVoting: true,
    maxFileSize: '10',
    allowedFormats: ['jpg', 'png', 'webp'],
    ...adsenseConfig,
    // Download popup settings
    downloadPopupEnabled: adsenseConfig.downloadPopup?.enabled || false,
    downloadPopupDuration: adsenseConfig.downloadPopup?.duration || 5,
    downloadPopupMessage: adsenseConfig.downloadPopup?.customMessage || 'Please wait while we prepare your download',
    downloadPopupAdCode: adsenseConfig.downloadPopup?.adCode || '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Update AdSense config with download popup settings
    setAdsenseConfig({
      enabled: settings.enabled,
      clientId: settings.clientId,
      slots: {
        header: settings.headerSlot,
        sidebar: settings.sidebarSlot,
        footer: settings.footerSlot
      },
      downloadPopup: {
        enabled: settings.downloadPopupEnabled,
        duration: parseInt(settings.downloadPopupDuration),
        customMessage: settings.downloadPopupMessage,
        adCode: settings.downloadPopupAdCode
      }
    });
    
    console.log('Settings saved:', settings);
    // Here you would save to your backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your wallpaper platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiGlobe} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                name="maxFileSize"
                value={settings.maxFileSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Content Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiShield} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Content Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="allowUserUploads"
                checked={settings.allowUserUploads}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Allow User Uploads
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="moderateComments"
                checked={settings.moderateComments}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Moderate Comments
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="enableVoting"
                checked={settings.enableVoting}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable Voting System
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed File Formats
              </label>
              <div className="space-y-2">
                {['jpg', 'png', 'webp', 'gif'].map(format => (
                  <div key={format} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.allowedFormats.includes(format)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings(prev => ({
                            ...prev,
                            allowedFormats: [...prev.allowedFormats, format]
                          }));
                        } else {
                          setSettings(prev => ({
                            ...prev,
                            allowedFormats: prev.allowedFormats.filter(f => f !== format)
                          }));
                        }
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label className="text-sm text-gray-700 uppercase">
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AdSense Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiDollarSign} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Google AdSense</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="enabled"
                checked={settings.enabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable Google AdSense
              </label>
            </div>
            
            {settings.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AdSense Client ID
                  </label>
                  <input
                    type="text"
                    name="clientId"
                    value={settings.clientId}
                    onChange={handleInputChange}
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Ad Slot
                  </label>
                  <input
                    type="text"
                    name="headerSlot"
                    value={settings.headerSlot}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sidebar Ad Slot
                  </label>
                  <input
                    type="text"
                    name="sidebarSlot"
                    value={settings.sidebarSlot}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Ad Slot
                  </label>
                  <input
                    type="text"
                    name="footerSlot"
                    value={settings.footerSlot}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Download Popup Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiClock} className="text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Download Popup</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="downloadPopupEnabled"
                checked={settings.downloadPopupEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable Download Popup with Ads
              </label>
            </div>
            
            {settings.downloadPopupEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popup Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="downloadPopupDuration"
                    value={settings.downloadPopupDuration}
                    onChange={handleInputChange}
                    min="3"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 3 seconds, maximum 30 seconds</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Message
                  </label>
                  <input
                    type="text"
                    name="downloadPopupMessage"
                    value={settings.downloadPopupMessage}
                    onChange={handleInputChange}
                    placeholder="Please wait while we prepare your download"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Ad Code
                  </label>
                  <textarea
                    name="downloadPopupAdCode"
                    value={settings.downloadPopupAdCode}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder={`<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste your Google AdSense code here</p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Email Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiMail} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                New User Registrations
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                New Wallpaper Uploads
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                New Comments
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Weekly Analytics Report
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <SafeIcon icon={FiSave} />
          <span>Save Settings</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;