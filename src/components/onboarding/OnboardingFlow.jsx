import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';
import { useWallpaper } from '../../context/WallpaperContext';
import toast from 'react-hot-toast';

const { FiUser, FiImage, FiHeart, FiSettings, FiCheck, FiArrowRight, FiArrowLeft } = FiIcons;

const OnboardingFlow = ({ onComplete }) => {
  const { user, profile, updateProfile, completeOnboardingStep } = useAuth();
  const { categories } = useWallpaper();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    avatar_url: profile?.avatar_url || '',
    favorite_categories: [],
    preferences: {
      email_notifications: true,
      download_quality: 'high',
      theme: 'light'
    }
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to WallpaperHub!',
      description: 'Let\'s set up your profile to get started',
      icon: FiUser,
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us a bit about yourself',
      icon: FiUser,
      component: ProfileStep
    },
    {
      id: 'preferences',
      title: 'Set Your Preferences',
      description: 'Choose your favorite categories and settings',
      icon: FiHeart,
      component: PreferencesStep
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Welcome to the WallpaperHub community',
      icon: FiCheck,
      component: CompleteStep
    }
  ];

  const nextStep = async () => {
    const step = steps[currentStep];
    
    // Save current step data
    await completeOnboardingStep(step.id, {
      ...formData,
      step_index: currentStep
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Update user profile
      await updateProfile({
        ...formData,
        onboarding_completed: true
      });

      // Mark onboarding as complete
      await completeOnboardingStep('onboarding_complete', formData);

      toast.success('Welcome to WallpaperHub! 🎉');
      onComplete();
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePreferences = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <SafeIcon icon={steps[currentStep].icon} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
                <p className="text-purple-100 text-sm">{steps[currentStep].description}</p>
              </div>
            </div>
            <div className="text-sm text-purple-100">
              {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent 
                formData={formData}
                updateFormData={updateFormData}
                updatePreferences={updatePreferences}
                categories={categories}
                user={user}
                profile={profile}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back</span>
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
            <SafeIcon icon={currentStep === steps.length - 1 ? FiCheck : FiArrowRight} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Welcome Step Component
const WelcomeStep = ({ user }) => (
  <div className="text-center space-y-6">
    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
      <SafeIcon icon={FiImage} className="text-white text-3xl" />
    </div>
    
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to WallpaperHub, {user?.email?.split('@')[0]}!
      </h3>
      <p className="text-gray-600 text-lg">
        Discover thousands of high-quality wallpapers and join our amazing community.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-purple-50 rounded-lg">
        <SafeIcon icon={FiImage} className="text-purple-600 text-xl mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-900">High Quality</p>
        <p className="text-xs text-gray-500">4K & HD wallpapers</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg">
        <SafeIcon icon={FiHeart} className="text-blue-600 text-xl mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-900">Free Downloads</p>
        <p className="text-xs text-gray-500">No hidden costs</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <SafeIcon icon={FiUser} className="text-green-600 text-xl mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-900">Community</p>
        <p className="text-xs text-gray-500">Share & discover</p>
      </div>
    </div>
  </div>
);

// Profile Step Component
const ProfileStep = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tell us about yourself</h3>
      <p className="text-gray-600">This information will be displayed on your profile</p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => updateFormData('full_name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateFormData('bio', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Tell us a bit about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website (optional)
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => updateFormData('website', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture URL (optional)
        </label>
        <input
          type="url"
          value={formData.avatar_url}
          onChange={(e) => updateFormData('avatar_url', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="https://example.com/avatar.jpg"
        />
        {formData.avatar_url && (
          <div className="mt-2">
            <img
              src={formData.avatar_url}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

// Preferences Step Component
const PreferencesStep = ({ formData, updateFormData, updatePreferences, categories }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Choose your preferences</h3>
      <p className="text-gray-600">Help us personalize your experience</p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Favorite Categories</h4>
      <p className="text-sm text-gray-600 mb-4">Select categories you're most interested in</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              const isSelected = formData.favorite_categories.includes(category.name);
              if (isSelected) {
                updateFormData('favorite_categories', 
                  formData.favorite_categories.filter(cat => cat !== category.name)
                );
              } else {
                updateFormData('favorite_categories', 
                  [...formData.favorite_categories, category.name]
                );
              }
            }}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.favorite_categories.includes(category.name)
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <SafeIcon 
                icon={FiIcons[category.icon] || FiImage} 
                className="text-xl mx-auto mb-1" 
              />
              <p className="text-sm font-medium">{category.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates about new wallpapers</p>
          </div>
          <button
            onClick={() => updatePreferences('email_notifications', !formData.preferences.email_notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.preferences.email_notifications ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.preferences.email_notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Download Quality
          </label>
          <select
            value={formData.preferences.download_quality}
            onChange={(e) => updatePreferences('download_quality', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="high">High Quality (Recommended)</option>
            <option value="medium">Medium Quality</option>
            <option value="original">Original Quality</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme Preference
          </label>
          <select
            value={formData.preferences.theme}
            onChange={(e) => updatePreferences('theme', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="light">Light Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="auto">Auto (System Preference)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

// Complete Step Component
const CompleteStep = ({ formData }) => (
  <div className="text-center space-y-6">
    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
      <SafeIcon icon={FiCheck} className="text-white text-3xl" />
    </div>
    
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to the community, {formData.full_name}! 🎉
      </h3>
      <p className="text-gray-600 text-lg">
        Your profile is all set up and ready to go. Start exploring amazing wallpapers!
      </p>
    </div>

    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-3">What's next?</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiImage} className="text-purple-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Browse Wallpapers</p>
            <p className="text-sm text-gray-500">Discover thousands of high-quality wallpapers</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiHeart} className="text-red-500 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Save Favorites</p>
            <p className="text-sm text-gray-500">Create your personal collection</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiUser} className="text-blue-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Upload Content</p>
            <p className="text-sm text-gray-500">Share your own wallpapers</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiSettings} className="text-gray-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Customize Settings</p>
            <p className="text-sm text-gray-500">Personalize your experience</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OnboardingFlow;