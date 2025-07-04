import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const { FiTrendingUp, FiUsers, FiDownload, FiStar, FiMessageSquare, FiImage } = FiIcons;

const Analytics = () => {
  const { getAnalytics } = useWallpaper();
  const analytics = getAnalytics();

  const monthlyData = [
    { month: 'Jan', downloads: 4000, users: 240, wallpapers: 45 },
    { month: 'Feb', downloads: 3000, users: 198, wallpapers: 38 },
    { month: 'Mar', downloads: 5000, users: 320, wallpapers: 62 },
    { month: 'Apr', downloads: 4500, users: 280, wallpapers: 55 },
    { month: 'May', downloads: 6000, users: 390, wallpapers: 78 },
    { month: 'Jun', downloads: 5500, users: 350, wallpapers: 68 },
  ];

  const categoryPerformance = [
    { category: 'Nature', downloads: 15420, votes: 892 },
    { category: 'Abstract', downloads: 8930, votes: 567 },
    { category: 'Urban', downloads: 12650, votes: 743 },
    { category: 'Space', downloads: 6840, votes: 421 },
    { category: 'Minimal', downloads: 9320, votes: 612 },
  ];

  const userEngagement = [
    { week: 'W1', comments: 45, votes: 123 },
    { week: 'W2', comments: 52, votes: 145 },
    { week: 'W3', comments: 38, votes: 98 },
    { week: 'W4', comments: 67, votes: 178 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Detailed insights into your wallpaper platform performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Wallpapers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalWallpapers}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <SafeIcon icon={FiImage} className="text-xl text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiUsers} className="text-xl text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalDownloads.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+23% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <SafeIcon icon={FiDownload} className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalVotes}</p>
              <p className="text-xs text-green-600 mt-1">+15% from last month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <SafeIcon icon={FiStar} className="text-xl text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalComments}</p>
              <p className="text-xs text-green-600 mt-1">+19% from last month</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <SafeIcon icon={FiMessageSquare} className="text-xl text-pink-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Growth</h3>
            <SafeIcon icon={FiTrendingUp} className="text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="downloads" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="downloads" fill="#8B5CF6" />
              <Bar dataKey="votes" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="comments" stroke="#EC4899" strokeWidth={2} />
              <Line type="monotone" dataKey="votes" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Performing Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Wallpapers</h3>
          <div className="space-y-4">
            {analytics.topWallpapers.map((wallpaper, index) => (
              <div key={wallpaper.id} className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-500 w-4">#{index + 1}</span>
                <img
                  src={wallpaper.thumbnailUrl}
                  alt={wallpaper.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{wallpaper.title}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{wallpaper.downloads.toLocaleString()} downloads</span>
                    <span>{wallpaper.votes} votes</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <SafeIcon icon={FiTrendingUp} className="text-xs" />
                    <span className="text-sm font-medium">+{Math.floor(Math.random() * 20) + 5}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;