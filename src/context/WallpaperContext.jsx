import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import slugify from 'slugify';

const WallpaperContext = createContext();

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
};

export const WallpaperProvider = ({ children }) => {
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Jo Baat Hey',
    tagline: 'Premium Wallpapers Collection',
    logo: '/logo.png',
    primaryColor: '#7C3AED',
    secondaryColor: '#3B82F6',
    accentColor: '#F59E0B',
    backgroundColor: '#F9FAFB',
    headerBg: '#ffffff',
    headerTextColor: '#374151',
    headerFont: 'Inter',
    footerBg: '#1F2937',
    footerTextColor: '#ffffff',
    footerHeadingColor: '#ffffff',
    footerFont: 'Inter',
    footerDescription: 'Discover premium wallpapers for all your devices. High-quality, curated collection updated daily.',
    copyrightText: 'All rights reserved.',
    searchPlaceholder: 'Search wallpapers...',
    heroTitle: 'Premium Wallpapers',
    heroSubtitle: 'Free Download',
    heroDescription: 'Discover thousands of high-quality wallpapers for your desktop, mobile, and tablet. All wallpapers are available in multiple resolutions.',
    featuredSectionTitle: 'Featured Wallpapers',
    categoriesTitle: 'Browse Categories',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    }
  });

  const [adsenseConfig, setAdsenseConfig] = useState({
    enabled: false,
    clientId: '',
    slots: {
      header: '',
      sidebar: '',
      footer: ''
    },
    downloadPopup: {
      enabled: true,
      duration: 5,
      customMessage: 'Please wait while we prepare your download',
      adCode: ''
    }
  });

  // Enhanced mock data with SEO and watermark features
  const mockWallpapers = [
    {
      id: 1,
      title: 'Mountain Sunset',
      slug: 'mountain-sunset',
      category: 'Nature',
      tags: ['mountain', 'sunset', 'landscape', 'golden hour'],
      resolution: '3840x2160',
      size: '2.4 MB',
      downloads: 15420,
      votes: 142,
      rating: 4.8,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&h=2160&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      author: 'John Nature',
      authorId: 'user1',
      featured: true,
      approved: true,
      watermark: true,
      seoTitle: 'Beautiful Mountain Sunset Wallpaper - 4K Free Download | Jo Baat Hey',
      seoDescription: 'Download this stunning mountain sunset wallpaper in 4K resolution. Perfect for desktop and mobile backgrounds. Free high-quality wallpaper.',
      seoKeywords: 'mountain wallpaper, sunset wallpaper, 4k wallpaper, free download, nature wallpaper, landscape wallpaper, golden hour',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    // ... other mock wallpapers
  ];

  const mockCategories = [
    { id: 1, name: 'Nature', slug: 'nature', count: 245, icon: 'FiSun', description: 'Beautiful nature wallpapers' },
    { id: 2, name: 'Abstract', slug: 'abstract', count: 189, icon: 'FiZap', description: 'Modern abstract designs' },
    { id: 3, name: 'Urban', slug: 'urban', count: 156, icon: 'FiMapPin', description: 'City and urban photography' },
    { id: 4, name: 'Space', slug: 'space', count: 98, icon: 'FiGlobe', description: 'Space and astronomy' },
    { id: 5, name: 'Minimal', slug: 'minimal', count: 134, icon: 'FiSquare', description: 'Clean minimal designs' },
    { id: 6, name: 'Technology', slug: 'technology', count: 87, icon: 'FiCpu', description: 'Tech and digital art' }
  ];

  const mockUsers = [
    {
      id: 'user1',
      name: 'John Nature',
      email: 'john@example.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      joinDate: '2024-01-01',
      uploads: 15,
      downloads: 1240,
      votes: 89,
      rank: 'Gold'
    },
    // ... other mock users
  ];

  const mockRoles = [
    {
      id: 'role1',
      name: 'admin',
      display_name: 'Administrator',
      description: 'Full system access',
      permissions: ['system_admin', 'manage_users', 'manage_roles'],
      color: '#DC2626',
      priority: 100,
      is_system_role: true
    },
    {
      id: 'role2',
      name: 'moderator',
      display_name: 'Moderator',
      description: 'Content moderation',
      permissions: ['moderate_comments', 'manage_wallpapers'],
      color: '#F59E0B',
      priority: 50,
      is_system_role: true
    },
    {
      id: 'role3',
      name: 'user',
      display_name: 'User',
      description: 'Basic user permissions',
      permissions: ['download_wallpapers', 'vote_wallpapers'],
      color: '#6B7280',
      priority: 10,
      is_system_role: true
    }
  ];

  useEffect(() => {
    // Initialize with mock data for development
    setWallpapers(mockWallpapers);
    setCategories(mockCategories);
    setUsers(mockUsers);
    setRoles(mockRoles);
    setComments([]);
    setVotes([]);
  }, []);

  // Fetch data from Supabase (when connected)
  const fetchWallpapers = async () => {
    try {
      const { data, error } = await supabase
        .from('wallpapers')
        .select(`
          *,
          category:categories(name, slug),
          uploader:user_profiles(full_name, avatar_url)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallpapers(data || []);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
      // Use mock data on error
      setWallpapers(mockWallpapers);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(mockCategories);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles(mockRoles);
    }
  };

  // Role management functions
  const createRole = async (roleData) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{
          ...roleData,
          id: crypto.randomUUID()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setRoles(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating role:', error);
      return { data: null, error };
    }
  };

  const updateRole = async (roleId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .update(updates)
        .eq('id', roleId)
        .select()
        .single();

      if (error) throw error;
      
      setRoles(prev => prev.map(role => 
        role.id === roleId ? data : role
      ));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating role:', error);
      return { data: null, error };
    }
  };

  const deleteRole = async (roleId) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
      
      setRoles(prev => prev.filter(role => role.id !== roleId));
      return { error: null };
    } catch (error) {
      console.error('Error deleting role:', error);
      return { error };
    }
  };

  // Wallpaper management functions
  const createWallpaper = async (wallpaperData) => {
    try {
      const slug = slugify(wallpaperData.title, { lower: true });
      const newWallpaper = {
        ...wallpaperData,
        slug,
        id: Date.now(),
        downloads: 0,
        votes: 0,
        rating: 0,
        approved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // In production, this would use Supabase
      setWallpapers(prev => [newWallpaper, ...prev]);
      toast.success('Wallpaper uploaded successfully!');
      return { data: newWallpaper, error: null };
    } catch (error) {
      toast.error('Failed to upload wallpaper');
      return { data: null, error };
    }
  };

  const updateWallpaper = async (id, updates) => {
    try {
      setWallpapers(prev => prev.map(w => 
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const deleteWallpaper = async (id) => {
    try {
      setWallpapers(prev => prev.filter(w => w.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // User management functions
  const updateUser = async (id, updates) => {
    try {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const deleteUser = async (id) => {
    try {
      setUsers(prev => prev.filter(u => u.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Search and filter functions
  const getWallpapersByCategory = (categorySlug) => {
    return wallpapers.filter(wallpaper => 
      wallpaper.category.toLowerCase() === categorySlug.toLowerCase()
    );
  };

  const getWallpaperBySlug = (slug) => {
    return wallpapers.find(wallpaper => wallpaper.slug === slug);
  };

  const getFeaturedWallpapers = () => {
    return wallpapers.filter(wallpaper => wallpaper.featured && wallpaper.approved);
  };

  const searchWallpapers = (term) => {
    if (!term) return wallpapers.filter(w => w.approved);
    
    return wallpapers.filter(wallpaper => 
      wallpaper.approved && (
        wallpaper.title.toLowerCase().includes(term.toLowerCase()) ||
        wallpaper.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
        wallpaper.category.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const downloadWallpaper = async (wallpaper) => {
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = wallpaper.fullUrl;
      link.download = `${wallpaper.slug}_${wallpaper.resolution}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count
      setWallpapers(prev => prev.map(w => 
        w.id === wallpaper.id ? { ...w, downloads: w.downloads + 1 } : w
      ));

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Analytics functions
  const getAnalytics = () => {
    const totalWallpapers = wallpapers.length;
    const totalDownloads = wallpapers.reduce((sum, w) => sum + w.downloads, 0);
    const totalVotes = votes.length;
    const totalUsers = users.length;
    const totalComments = comments.length;

    return {
      totalWallpapers,
      totalDownloads,
      totalVotes,
      totalUsers,
      totalComments,
      topWallpapers: wallpapers.sort((a, b) => b.downloads - a.downloads).slice(0, 5),
      topUsers: users.sort((a, b) => b.uploads - a.uploads).slice(0, 5)
    };
  };

  // Voting and comment functions
  const voteWallpaper = async (wallpaperId, rating, userId) => {
    try {
      const newVote = {
        id: Date.now(),
        wallpaperId,
        userId,
        rating,
        createdAt: new Date().toISOString()
      };

      setVotes(prev => [...prev, newVote]);

      // Update wallpaper rating
      setWallpapers(prev => prev.map(w => {
        if (w.id === wallpaperId) {
          const wallpaperVotes = votes.filter(v => v.wallpaperId === wallpaperId);
          const avgRating = wallpaperVotes.reduce((sum, v) => sum + v.rating, rating) / (wallpaperVotes.length + 1);
          return { ...w, votes: w.votes + 1, rating: avgRating };
        }
        return w;
      }));

      return { data: newVote, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const addComment = async (wallpaperId, content, userId) => {
    try {
      const newComment = {
        id: Date.now(),
        wallpaperId,
        userId,
        content,
        likes: 0,
        createdAt: new Date().toISOString()
      };

      setComments(prev => [newComment, ...prev]);
      return { data: newComment, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    wallpapers,
    categories,
    users,
    comments,
    votes,
    roles,
    loading,
    searchTerm,
    setSearchTerm,
    siteSettings,
    setSiteSettings,
    adsenseConfig,
    setAdsenseConfig,

    // Wallpaper functions
    createWallpaper,
    updateWallpaper,
    deleteWallpaper,
    getWallpapersByCategory,
    getWallpaperBySlug,
    getFeaturedWallpapers,
    searchWallpapers,
    downloadWallpaper,

    // User functions
    updateUser,
    deleteUser,

    // Role functions
    createRole,
    updateRole,
    deleteRole,

    // Voting functions
    voteWallpaper,

    // Comment functions
    addComment,

    // Analytics
    getAnalytics
  };

  return (
    <WallpaperContext.Provider value={value}>
      {children}
    </WallpaperContext.Provider>
  );
};