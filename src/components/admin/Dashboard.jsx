import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const { FiImage, FiUsers, FiDownload, FiStar, FiMessageSquare, FiTrendingUp } = FiIcons;

const Dashboard = () => {
  const { getAnalytics } = useWallpaper();
  const analytics = getAnalytics();

  const stats = [
    { name: 'Total Wallpapers', value: analytics.totalWallpapers, icon: FiImage, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Users', value: analytics.totalUsers, icon: FiUsers, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Downloads', value: analytics.totalDownloads.toLocaleString(), icon: FiDownload, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Votes', value: analytics.totalVotes, icon: FiStar, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Total Comments', value: analytics.totalComments, icon: FiMessageSquare, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  const downloadData = [
    { name: 'Jan', downloads: 4000 },
    { name: 'Feb', downloads: 3000 },
    { name: 'Mar', downloads: 5000 },
    { name: 'Apr', downloads: 4500 },
    { name: 'May', downloads: 6000 },
    { name: 'Jun', downloads: 5500 },
  ];

  const categoryData = [
    { name: 'Nature', value: 245, color: '#10B981' },
    { name: 'Abstract', value: 189, color: '#8B5CF6' },
    { name: 'Urban', value: 156, color: '#F59E0B' },
    { name: 'Space', value: 98, color: '#EF4444' },
    { name: 'Minimal', value: 134, color: '#6B7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your wallpaper site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <SafeIcon icon={stat.icon} className={`text-xl ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downloads Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Downloads Over Time</h3>
            <SafeIcon icon={FiTrendingUp} className="text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={downloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="downloads" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Wallpapers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Wallpapers</h3>
          <div className="space-y-4">
            {analytics.topWallpapers.map((wallpaper, index) => (
              <div key={wallpaper.id} className="flex items-center space-x-4">
                <img
                  src={wallpaper.thumbnailUrl}
                  alt={wallpaper.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{wallpaper.title}</p>
                  <p className="text-sm text-gray-500">{wallpaper.downloads.toLocaleString()} downloads</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
          <div className="space-y-4">
            {analytics.topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.uploads} uploads</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.rank === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                    user.rank === 'Silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {user.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;