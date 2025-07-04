import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { WallpaperProvider } from './context/WallpaperContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import WallpaperDetail from './pages/WallpaperDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import WallpaperManagement from './components/admin/WallpaperManagement';
import UserRoleManagement from './components/admin/UserRoleManagement';
import CommentManagement from './components/admin/CommentManagement';
import VoteManagement from './components/admin/VoteManagement';
import Analytics from './components/admin/Analytics';
import Settings from './components/admin/Settings';
import SiteDesigner from './components/admin/SiteDesigner';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <WallpaperProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Main Site Routes */}
                <Route path="/*" element={
                  <>
                    <Header />
                    <motion.main
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/category/:categoryName" element={<Category />} />
                        <Route path="/wallpaper/:slug" element={<WallpaperDetail />} />
                        <Route path="/search" element={<Search />} />
                      </Routes>
                    </motion.main>
                    <Footer />
                  </>
                } />

                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="wallpapers" element={<WallpaperManagement />} />
                  <Route path="users" element={<UserRoleManagement />} />
                  <Route path="comments" element={<CommentManagement />} />
                  <Route path="votes" element={<VoteManagement />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="design" element={<SiteDesigner />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </WallpaperProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;