import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallpaper } from '../context/WallpaperContext';
import WallpaperGrid from '../components/WallpaperGrid';

const Category = () => {
  const { categoryName } = useParams();
  const { getWallpapersByCategory } = useWallpaper();
  
  const wallpapers = getWallpapersByCategory(categoryName);
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {formattedCategoryName} Wallpapers
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-200"
          >
            {wallpapers.length} high-quality wallpapers in the {formattedCategoryName} category
          </motion.p>
        </div>
      </motion.section>

      {/* Wallpapers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wallpapers.length > 0 ? (
            <WallpaperGrid wallpapers={wallpapers} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No wallpapers found
              </h3>
              <p className="text-gray-600">
                We couldn't find any wallpapers in the {formattedCategoryName} category.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;