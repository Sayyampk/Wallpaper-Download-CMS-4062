import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWallpaper } from '../context/WallpaperContext';
import WallpaperGrid from '../components/WallpaperGrid';
import CategoryGrid from '../components/CategoryGrid';

const { FiStar, FiTrendingUp, FiGrid } = FiIcons;

const Home = () => {
  const { wallpapers, categories, getFeaturedWallpapers } = useWallpaper();
  const featuredWallpapers = getFeaturedWallpapers();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Premium Wallpapers
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Free Download
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto"
          >
            Discover thousands of high-quality wallpapers for your desktop, mobile, and tablet. 
            All wallpapers are available in multiple resolutions.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiStar} className="text-yellow-400" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTrendingUp} className="text-green-400" />
              <span>High Resolution</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiGrid} className="text-blue-400" />
              <span>Multiple Categories</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collection of wallpapers organized by category
            </p>
          </motion.div>

          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Featured Wallpapers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WallpaperGrid wallpapers={featuredWallpapers} title="Featured Wallpapers" />
        </div>
      </section>

      {/* Latest Wallpapers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WallpaperGrid wallpapers={wallpapers.slice(0, 8)} title="Latest Wallpapers" />
        </div>
      </section>
    </div>
  );
};

export default Home;