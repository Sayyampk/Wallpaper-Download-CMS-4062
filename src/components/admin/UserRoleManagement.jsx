import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const { FiUsers, FiEdit, FiTrash2, FiSearch, FiMail, FiCalendar, FiImage, FiDownload, FiStar, FiShield, FiCheck, FiX, FiPlus, FiSettings } = FiIcons;

const UserRoleManagement = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [bulkSelected, setBulkSelected] = useState(new Set());

  const [roleForm, setRoleForm] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: [],
    color: '#3B82F6',
    priority: 0
  });

  const [userEditForm, setUserEditForm] = useState({
    full_name: '',
    email: '',
    role_name: '',
    status: 'active'
  });

  const availablePermissions = [
    { id: 'view_dashboard', name: 'View Dashboard', category: 'Dashboard' },
    { id: 'manage_wallpapers', name: 'Manage Wallpapers', category: 'Content' },
    { id: 'upload_wallpapers', name: 'Upload Wallpapers', category: 'Content' },
    { id: 'delete_wallpapers', name: 'Delete Wallpapers', category: 'Content' },
    { id: 'approve_wallpapers', name: 'Approve Wallpapers', category: 'Content' },
    { id: 'manage_users', name: 'Manage Users', category: 'Users' },
    { id: 'view_users', name: 'View Users', category: 'Users' },
    { id: 'delete_users', name: 'Delete Users', category: 'Users' },
    { id: 'manage_comments', name: 'Manage Comments', category: 'Content' },
    { id: 'moderate_comments', name: 'Moderate Comments', category: 'Content' },
    { id: 'view_analytics', name: 'View Analytics', category: 'Analytics' },
    { id: 'manage_settings', name: 'Manage Settings', category: 'Settings' },
    { id: 'manage_roles', name: 'Manage Roles', category: 'System' },
    { id: 'system_admin', name: 'System Administrator', category: 'System' }
  ];

  useEffect(() => {
    if (hasPermission('view_users')) {
      fetchUsers();
      fetchRoles();
    }
  }, [hasPermission]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          role:user_roles(name, display_name, permissions, color)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
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
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role_name === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?.id && newRole !== 'admin') {
      toast.error('You cannot change your own admin role');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role_name: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      
      await fetchUsers();
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleUserEdit = (user) => {
    setEditingUser(user);
    setUserEditForm({
      full_name: user.full_name || '',
      email: user.email || '',
      role_name: user.role_name || '',
      status: user.status || 'active'
    });
  };

  const handleUserUpdate = async () => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...userEditForm,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      setEditingUser(null);
      setUserEditForm({ full_name: '', email: '', role_name: '', status: 'active' });
      await fetchUsers();
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleUserDelete = async (userId) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        
        await fetchUsers();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleRoleEdit = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      permissions: role.permissions || [],
      color: role.color || '#3B82F6',
      priority: role.priority || 0
    });
    setShowRoleForm(true);
  };

  const handleRoleSubmit = async () => {
    try {
      if (editingRole) {
        const { error } = await supabase
          .from('user_roles')
          .update({
            ...roleForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingRole.id);

        if (error) throw error;
        toast.success('Role updated successfully');
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert([{
            ...roleForm,
            id: crypto.randomUUID()
          }]);

        if (error) throw error;
        toast.success('Role created successfully');
      }

      setShowRoleForm(false);
      setEditingRole(null);
      setRoleForm({ name: '', display_name: '', description: '', permissions: [], color: '#3B82F6', priority: 0 });
      await fetchRoles();
    } catch (error) {
      toast.error('Failed to save role');
    }
  };

  const handleRoleDelete = async (roleId, roleName) => {
    const usersWithRole = users.filter(user => user.role_name === roleName);
    if (usersWithRole.length > 0) {
      toast.error(`Cannot delete role. ${usersWithRole.length} users are assigned to this role.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('id', roleId);

        if (error) throw error;
        
        await fetchRoles();
        toast.success('Role deleted successfully');
      } catch (error) {
        toast.error('Failed to delete role');
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (bulkSelected.size === 0) {
      toast.error('Please select users first');
      return;
    }

    const selectedUsers = Array.from(bulkSelected);
    
    if (selectedUsers.includes(currentUser?.id)) {
      toast.error('You cannot perform bulk actions on your own account');
      return;
    }

    try {
      switch (action) {
        case 'activate':
          await supabase
            .from('user_profiles')
            .update({ status: 'active', updated_at: new Date().toISOString() })
            .in('id', selectedUsers);
          toast.success(`${selectedUsers.length} users activated`);
          break;
        case 'deactivate':
          await supabase
            .from('user_profiles')
            .update({ status: 'inactive', updated_at: new Date().toISOString() })
            .in('id', selectedUsers);
          toast.success(`${selectedUsers.length} users deactivated`);
          break;
        case 'delete':
          if (window.confirm(`Delete ${selectedUsers.length} users? This action cannot be undone.`)) {
            for (const userId of selectedUsers) {
              await supabase.auth.admin.deleteUser(userId);
            }
            toast.success(`${selectedUsers.length} users deleted`);
          }
          break;
      }
      
      setBulkSelected(new Set());
      await fetchUsers();
    } catch (error) {
      toast.error(`Failed to perform bulk action: ${error.message}`);
    }
  };

  const toggleUserSelection = (userId) => {
    const newSelection = new Set(bulkSelected);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setBulkSelected(newSelection);
  };

  const getRoleColor = (roleName) => {
    const role = roles?.find(r => r.name === roleName);
    return role?.color || '#6B7280';
  };

  const getRoleDisplayName = (roleName) => {
    const role = roles?.find(r => r.name === roleName);
    return role?.display_name || roleName;
  };

  const hasRolePermission = (role, permission) => {
    const roleObj = roles?.find(r => r.name === role);
    return roleObj?.permissions?.includes(permission) || false;
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!hasPermission('view_users')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Role Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('manage_roles') && (
            <button
              onClick={() => setShowRoleForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} />
              <span>Create Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUsers} />
              <span>Users ({users.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} />
              <span>Roles ({roles?.length || 0})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roles?.map(role => (
                  <option key={role.id} value={role.name}>{role.display_name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {bulkSelected.size > 0 && hasPermission('manage_users') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg"
              >
                <span className="text-sm font-medium text-purple-700">
                  {bulkSelected.size} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    Deactivate
                  </button>
                  {hasPermission('delete_users') && (
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {hasPermission('manage_users') && (
                      <input
                        type="checkbox"
                        checked={bulkSelected.has(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    )}
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                      alt={user.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{user.full_name || 'No Name'}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <SafeIcon icon={FiMail} className="text-xs" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.status === 'active' ? '#10B981' : '#EF4444' }}
                    />
                    <span className="text-xs text-gray-500 capitalize">
                      {user.status || 'active'}
                    </span>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                      <SafeIcon icon={FiImage} className="text-sm" />
                      <span className="text-lg font-semibold">{user.uploads_count || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">Uploads</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                      <SafeIcon icon={FiDownload} className="text-sm" />
                      <span className="text-lg font-semibold">{user.downloads_count || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">Downloads</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-yellow-600 mb-1">
                      <SafeIcon icon={FiStar} className="text-sm" />
                      <span className="text-lg font-semibold">{user.votes_count || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">Votes</p>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Role:</span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getRoleColor(user.role_name) }}
                    >
                      {getRoleDisplayName(user.role_name)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Joined:</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="text-xs" />
                      <span>{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  {user.last_login_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Last Login:</span>
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {hasPermission('manage_users') && (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleUserEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <SafeIcon icon={FiEdit} />
                    </button>
                    {hasPermission('delete_users') && (
                      <button
                        onClick={() => handleUserDelete(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete User"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles?.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.display_name}</h3>
                    <p className="text-sm text-gray-500">{role.name}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Priority: {role.priority}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Permissions ({role.permissions?.length || 0}):
                </p>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions?.map(permission => {
                      const permissionObj = availablePermissions.find(p => p.id === permission);
                      return (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {permissionObj?.name || permission}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {users.filter(u => u.role_name === role.name).length} users
                </span>
                {hasPermission('manage_roles') && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRoleEdit(role)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit Role"
                    >
                      <SafeIcon icon={FiEdit} />
                    </button>
                    <button
                      onClick={() => handleRoleDelete(role.id, role.name)}
                      disabled={role.is_system_role}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Role"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userEditForm.full_name}
                  onChange={(e) => setUserEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userEditForm.email}
                  onChange={(e) => setUserEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={userEditForm.role_name}
                  onChange={(e) => setUserEditForm(prev => ({ ...prev, role_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {roles?.map(role => (
                    <option key={role.id} value={role.name}>{role.display_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={userEditForm.status}
                  onChange={(e) => setUserEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUserUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Update User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Role Form Modal */}
      {showRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., moderator"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={roleForm.display_name}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, display_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Moderator"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe this role..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="color"
                    value={roleForm.color}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <input
                    type="number"
                    value={roleForm.priority}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map(permission => (
                          <label key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={roleForm.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRoleForm(prev => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission.id]
                                  }));
                                } else {
                                  setRoleForm(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => p !== permission.id)
                                  }));
                                }
                              }}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRoleForm(false);
                  setEditingRole(null);
                  setRoleForm({ name: '', display_name: '', description: '', permissions: [], color: '#3B82F6', priority: 0 });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;