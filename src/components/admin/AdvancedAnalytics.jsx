import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';

const {
  FiTrendingUp, FiUsers, FiDownload, FiStar, FiMessageSquare, FiImage,
  FiCalendar, FiClock, FiTarget, FiBarChart3, FiPieChart, FiActivity,
  FiEye, FiFilter, FiRefreshCw, FiDownloadCloud
} = FiIcons;

const AdvancedAnalytics = () => {
  const { getAnalytics, wallpapers, users, comments, votes } = useWallpaper();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('downloads');
  const [realTimeData, setRealTimeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate comprehensive analytics data
  const generateAdvancedAnalytics = () => {
    const now = new Date();
    const periods = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const days = periods[selectedPeriod];
    const timeSeriesData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        downloads: Math.floor(Math.random() * 1000) + 500,
        views: Math.floor(Math.random() * 5000) + 2000,
        users: Math.floor(Math.random() * 200) + 100,
        uploads: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 50) + 10,
        votes: Math.floor(Math.random() * 100) + 20
      });
    }

    return timeSeriesData;
  };

  const analyticsData = generateAdvancedAnalytics();

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev];
        if (newData.length > 20) newData.shift();
        
        newData.push({
          time: new Date().toLocaleTimeString(),
          value: Math.floor(Math.random() * 100) + 50,
          downloads: Math.floor(Math.random() * 10) + 1,
          views: Math.floor(Math.random() * 50) + 10
        });
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Performance metrics
  const performanceMetrics = {
    totalRevenue: 12450.75,
    conversionRate: 3.2,
    avgSessionDuration: '4m 32s',
    bounceRate: 24.5,
    pageLoadTime: 1.8,
    serverUptime: 99.9
  };

  // User behavior data
  const userBehaviorData = [
    { category: 'Nature', engagement: 85, retention: 72, satisfaction: 4.8 },
    { category: 'Abstract', engagement: 78, retention: 65, satisfaction: 4.5 },
    { category: 'Urban', engagement: 82, retention: 68, satisfaction: 4.6 },
    { category: 'Space', engagement: 90, retention: 75, satisfaction: 4.9 },
    { category: 'Minimal', engagement: 75, retention: 62, satisfaction: 4.3 }
  ];

  // Geographic data
  const geographicData = [
    { country: 'United States', users: 2840, downloads: 15420, percentage: 35.2 },
    { country: 'United Kingdom', users: 1650, downloads: 8930, percentage: 20.5 },
    { country: 'Germany', users: 1200, downloads: 6540, percentage: 14.8 },
    { country: 'France', users: 980, downloads: 5210, percentage: 12.1 },
    { country: 'Canada', users: 750, downloads: 4100, percentage: 9.3 },
    { country: 'Others', users: 1580, downloads: 8500, percentage: 8.1 }
  ];

  // Device analytics
  const deviceData = [
    { device: 'Desktop', users: 4200, percentage: 52.5, color: '#8B5CF6' },
    { device: 'Mobile', users: 3100, percentage: 38.7, color: '#10B981' },
    { device: 'Tablet', users: 700, percentage: 8.8, color: '#F59E0B' }
  ];

  // Top performing content
  const topContent = wallpapers
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10)
    .map((w, index) => ({
      ...w,
      rank: index + 1,
      growth: Math.floor(Math.random() * 50) + 10
    }));

  // Conversion funnel
  const conversionFunnel = [
    { stage: 'Visitors', count: 10000, percentage: 100 },
    { stage: 'Page Views', count: 8500, percentage: 85 },
    { stage: 'Wallpaper Views', count: 6200, percentage: 62 },
    { stage: 'Downloads', count: 3100, percentage: 31 },
    { stage: 'Registrations', count: 450, percentage: 4.5 }
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${performanceMetrics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+15.3% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.conversionRate}%</p>
              <p className="text-xs text-green-600 mt-1">+0.8% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <SafeIcon icon={FiTarget} className="text-xl text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.avgSessionDuration}</p>
              <p className="text-xs text-green-600 mt-1">+12s from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <SafeIcon icon={FiClock} className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Server Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.serverUptime}%</p>
              <p className="text-xs text-green-600 mt-1">Excellent performance</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiActivity} className="text-xl text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Real-time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Organic Search', value: 45, color: '#8B5CF6' },
                  { name: 'Direct', value: 25, color: '#10B981' },
                  { name: 'Social Media', value: 20, color: '#F59E0B' },
                  { name: 'Referrals', value: 10, color: '#EF4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Organic Search', value: 45, color: '#8B5CF6' },
                  { name: 'Direct', value: 25, color: '#10B981' },
                  { name: 'Social Media', value: 20, color: '#F59E0B' },
                  { name: 'Referrals', value: 10, color: '#EF4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Time Series Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="downloads">Downloads</option>
            <option value="views">Views</option>
            <option value="users">Users</option>
            <option value="uploads">Uploads</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* User Behavior Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Behavior by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={userBehaviorData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Engagement"
                dataKey="engagement"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Radar
                name="Retention"
                dataKey="retention"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Analytics</h3>
          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: device.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{device.device}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{device.users.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{device.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deviceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="device" type="category" />
                <Tooltip />
                <Bar dataKey="users" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Geographic Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8B5CF6" />
                <Bar dataKey="downloads" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Top Countries</h4>
            {geographicData.slice(0, 5).map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                  <span className="font-medium text-gray-900">{country.country}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{country.users.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{country.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {conversionFunnel.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{stage.stage}</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{stage.count.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-2">({stage.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              </div>
              {index < conversionFunnel.length - 1 && (
                <div className="flex justify-center mt-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Performing Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Wallpaper</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Growth</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((wallpaper) => (
                <tr key={wallpaper.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">#{wallpaper.rank}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={wallpaper.thumbnailUrl}
                        alt={wallpaper.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{wallpaper.title}</p>
                        <p className="text-sm text-gray-500">By {wallpaper.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {wallpaper.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">
                      {wallpaper.downloads.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiTrendingUp} className="text-green-500 text-sm" />
                      <span className="text-green-600 font-medium">+{wallpaper.growth}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="text-yellow-400 text-sm" />
                      <span className="font-medium text-gray-900">{wallpaper.rating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;