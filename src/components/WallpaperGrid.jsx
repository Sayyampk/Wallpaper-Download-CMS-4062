import React from 'react';
import { motion } from 'framer-motion';
import WallpaperCard from './WallpaperCard';

const WallpaperGrid = ({ wallpapers, title }) => {
  return (
    <div className="space-y-6">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          {title}
        </motion.h2>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {wallpapers.map((wallpaper, index) => (
          <motion.div
            key={wallpaper.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <WallpaperCard wallpaper={wallpaper} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WallpaperGrid;