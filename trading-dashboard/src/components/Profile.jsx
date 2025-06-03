import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Settings, Shield, Bell, Home } from 'lucide-react';

// Reusable Components for Profile Development

/**
 * ProfileCard Component - Reusable card container
 * @param {string} title - Card title
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 */
const ProfileCard = ({ title, children, className = '' }) => {
  return (
    <div className={`profile-card ${className}`}>
      {title && (
        <h3 className="profile-card-title">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

/**
 * ProfileField Component - Reusable editable field
 * @param {string} label - Field label
 * @param {string} value - Field value
 * @param {string} type - Input type (text, email, tel, etc.)
 * @param {function} onChange - Change handler
 * @param {boolean} isEditing - Edit mode flag
 * @param {ReactNode} icon - Icon component
 */
const ProfileField = ({ label, value, type = 'text', onChange, isEditing, icon, placeholder }) => {
  return (
    <div className="profile-field">
      <div className="profile-field-icon">
        {icon}
      </div>
      <div className="profile-field-content">
        <label className="profile-field-label">{label}</label>
        {isEditing ? (
          <input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="profile-field-input"
          />
        ) : (
          <p className="profile-field-value">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Avatar Component - Reusable profile picture component
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {string} size - Size class (sm, md, lg, xl)
 * @param {boolean} editable - Whether avatar is editable
 * @param {function} onEdit - Edit handler
 */
const Avatar = ({ src, alt, size = 'xl', editable = false, onEdit }) => {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl'
  };

  return (
    <div className={`avatar-container ${sizeClasses[size]}`}>
      <img
        src={src || '/api/placeholder/150/150'}
        alt={alt}
        className="avatar-image"
      />
      {editable && (
        <button
          onClick={onEdit}
          className="avatar-edit-btn"
        >
          <Camera size={16} />
        </button>
      )}
    </div>
  );
};

/**
 * StatCard Component - Reusable statistics card
 * @param {string} title - Stat title
 * @param {string|number} value - Stat value
 * @param {ReactNode} icon - Icon component
 * @param {string} color - Color theme
 */
const StatCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-content">
        <div className="stat-card-text">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
        </div>
        <div className="stat-card-icon">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Main Profile Page Component
const ProfilePage = () => {
  // State management
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  // Navigation function
  const navigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Get user data from session storage (from login)
 const getUserFromSession = () => {
  try {
    const storedUser = sessionStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (!userData) {
      console.warn('No user found in sessionStorage');
      setLoading(false);
      return;
    }

    setUser(userData);
    setEditedUser(userData);
  } catch (error) {
    console.error('Error reading user from session:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getUserFromSession();
}, []);


  // Handle field changes during editing
  const handleFieldChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setUser(editedUser);
        setIsEditing(false);
        alert('Profile updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate avatar upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({ ...prev, avatar: e.target.result }));
        setEditedUser(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Tab navigation
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2 className="error-title">Access Denied</h2>
          <p className="error-message">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .profile-header {
          background-color: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e5e7eb;
        }

        .profile-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .profile-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background-color: #2563eb;
        }

        .btn-success {
          background-color: #10b981;
          color: white;
        }

        .btn-success:hover {
          background-color: #059669;
        }

        .btn-secondary {
          background-color: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #4b5563;
        }

        .btn-outline {
          background-color: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background-color: #f3f4f6;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .profile-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .profile-content {
            grid-template-columns: 300px 1fr;
          }
        }

        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          padding: 24px;
        }

        .profile-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .profile-intro {
          text-align: center;
        }

        .avatar-container {
          position: relative;
          margin: 0 auto;
        }

        .avatar-sm {
          width: 48px;
          height: 48px;
        }

        .avatar-md {
          width: 64px;
          height: 64px;
        }

        .avatar-lg {
          width: 96px;
          height: 96px;
        }

        .avatar-xl {
          width: 128px;
          height: 128px;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: #3b82f6;
          color: white;
          padding: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s;
        }

        .avatar-edit-btn:hover {
          background-color: #2563eb;
        }

        .profile-intro h2 {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin: 16px 0 4px 0;
        }

        .profile-intro p {
          color: #6b7280;
          margin: 4px 0;
        }

        .profile-intro .role {
          font-size: 14px;
          color: #9ca3af;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 16px;
          border-radius: 8px;
          border: 1px solid;
        }

        .stat-card-blue {
          background-color: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .stat-card-green {
          background-color: #f0fdf4;
          color: #16a34a;
          border-color: #bbf7d0;
        }

        .stat-card-purple {
          background-color: #faf5ff;
          color: #9333ea;
          border-color: #e9d5ff;
        }

        .stat-card-orange {
          background-color: #fff7ed;
          color: #ea580c;
          border-color: #fed7aa;
        }

        .stat-card-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-card-title {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.8;
          margin: 0 0 4px 0;
        }

        .stat-card-value {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }

        .stat-card-icon {
          opacity: 0.6;
        }

        .nav-tabs {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
          width: 100%;
        }

        .nav-tab:hover {
          background-color: #f9fafb;
        }

        .nav-tab.active {
          background-color: #eff6ff;
          color: #2563eb;
          border-right: 2px solid #2563eb;
        }

        .profile-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-field {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f9fafb;
        }

        .profile-field:last-child {
          border-bottom: none;
        }

        .profile-field-icon {
          flex-shrink: 0;
          color: #9ca3af;
        }

        .profile-field-content {
          flex: 1;
        }

        .profile-field-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .profile-field-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
        }

        .profile-field-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .profile-field-value {
          color: #1f2937;
          margin: 0;
        }

        .loading-container {
          min-height: 100vh;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner {
          width: 128px;
          height: 128px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          min-height: 100vh;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-content {
          text-align: center;
        }

        .error-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .error-message {
          color: #6b7280;
        }

        .hidden {
          display: none;
        }

        .placeholder-content {
          color: #6b7280;
          font-style: italic;
        }
      `}</style>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <h1 className="profile-title">My Profile</h1>
          <div className="header-actions">
            <button
              onClick={navigateToDashboard}
              className="btn btn-outline"
              title="Go to Dashboard"
            >
              <Home size={16} />
              <span>Dashboard</span>
            </button>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="btn btn-success"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          {/* Profile Card */}
          <ProfileCard>
            <div className="profile-intro">
              <Avatar
                src={user.avatar}
                alt={user.name || user.username}
                size="xl"
                editable={isEditing}
                onEdit={() => document.getElementById('avatar-upload').click()}
              />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <h2>{user.name || user.username}</h2>
              <p>{user.email}</p>
              <p className="role">
                {user.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : 'User'}
              </p>
            </div>
          </ProfileCard>

          {/* Stats Cards */}
          <div className="stats-grid">
            <StatCard
              title="Joined"
              value={user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
              icon={<Calendar size={20} />}
              color="blue"
            />
            <StatCard
              title="Status"
              value={user.status || 'Active'}
              icon={<User size={20} />}
              color="green"
            />
          </div>

          {/* Navigation */}
          <ProfileCard>
            <nav className="nav-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </ProfileCard>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <>
              {/* Personal Information */}
              <ProfileCard title="Personal Information">
                <div className="profile-fields">
                  <ProfileField
                    label="Full Name"
                    value={isEditing ? editedUser.name : user.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    isEditing={isEditing}
                    icon={<User size={18} />}
                    placeholder="Enter your full name"
                  />
                  <ProfileField
                    label="Email Address"
                    value={isEditing ? editedUser.email : user.email}
                    type="email"
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    isEditing={isEditing}
                    icon={<Mail size={18} />}
                    placeholder="Enter your email"
                  />
                  <ProfileField
                    label="Phone Number"
                    value={isEditing ? editedUser.phone : user.phone}
                    type="tel"
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    isEditing={isEditing}
                    icon={<Phone size={18} />}
                    placeholder="Enter your phone number"
                  />
                  <ProfileField
                    label="Location"
                    value={isEditing ? editedUser.location : user.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    isEditing={isEditing}
                    icon={<MapPin size={18} />}
                    placeholder="Enter your location"
                  />
                </div>
              </ProfileCard>

              {/* Academic Information (for students) */}
              {user.roles === 'student' && (
                <ProfileCard title="Academic Information">
                  <div className="profile-fields">
                    <ProfileField
                      label="Student ID"
                      value={user.student_id}
                      isEditing={false}
                      icon={<User size={18} />}
                    />
                    <ProfileField
                      label="Course/Program"
                      value={isEditing ? editedUser.course : user.course}
                      onChange={(e) => handleFieldChange('course', e.target.value)}
                      isEditing={isEditing}
                      icon={<User size={18} />}
                      placeholder="Enter your course"
                    />
                    <ProfileField
                      label="Year Level"
                      value={isEditing ? editedUser.yearLevel : user.yearLevel}
                      onChange={(e) => handleFieldChange('yearLevel', e.target.value)}
                      isEditing={isEditing}
                      icon={<Calendar size={18} />}
                      placeholder="Enter your year level"
                    />
                  </div>
                </ProfileCard>
              )}
            </>
          )}

          {/* Additional tab content */}
          {activeTab === 'settings' && (
            <ProfileCard title="Settings">
              <p className="placeholder-content">Settings panel coming soon...</p>
            </ProfileCard>
          )}

          {activeTab === 'security' && (
            <ProfileCard title="Security">
              <p className="placeholder-content">Security settings coming soon...</p>
            </ProfileCard>
          )}

          {activeTab === 'notifications' && (
            <ProfileCard title="Notifications">
              <p className="placeholder-content">Notification preferences coming soon...</p>
            </ProfileCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;