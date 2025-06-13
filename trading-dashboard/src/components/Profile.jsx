
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Settings, Shield, Bell, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './profilepage.css';
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
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl'
  };

  // Helper function to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate avatar URL based on user data
  const getAvatarUrl = () => {
    // If there's a custom uploaded avatar, use it
    if (src && !imageError) {
      return src;
    }
    
    // Fallback to a placeholder with initials
    const initials = getInitials(alt || 'User');
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=150&background=3b82f6&color=ffffff&bold=true`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`avatar-container ${sizeClasses[size]}`}>
      <img
        src={getAvatarUrl()}
        alt={alt}
        className="avatar-image"
        onError={handleImageError}
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Navigation function
  const navigateToDashboard = () => {
    
    navigate('/dashboard');
  };

  // Get user data from session storage and fetch from MongoDB
  const getUserFromSession = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Get session data from sessionStorage
    const storedSession = sessionStorage.getItem('session');
const sessionData = storedSession ? JSON.parse(storedSession) : null;


    if (!sessionData?.account_id) {
      throw new Error('No user session found. Please log in again.');
    }

    console.log('🔍 Fetching profile for account_id:', sessionData.person_id);


    const response = await fetch(`http://localhost:3000/api/profile/${sessionData.person_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch profile data');
    }

    console.log('✅ Profile data received:', data.profile);
    
    const profileData = data.profile;

    setUser(profileData);
    setEditedUser(profileData);

    // Optional: update the stored session with refreshed profile (if needed)
    // sessionStorage.setItem('session', JSON.stringify({ ...sessionData, user: profileData }));

  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    setError(error.message);

    // Optional: Fallback mock
    const mockData = {
      account_id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      location: "New York, NY",
      student_id: "2024001",
      course: "Computer Science",
      yearLevel: "3rd Year",
      roles: "student",
      status: "Active",
      avatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUser(mockData);
    setEditedUser(mockData);
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

  // Save profile changes to MongoDB
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const account_id = user.account_id;
      
      if (!account_id) {
        throw new Error('Account ID not found. Please log in again.');
      }
      
      console.log('💾 Saving profile for account_id:', account_id);
      console.log('📝 Profile data:', editedUser);
      
      // FIXED: Update profile endpoint (matches backend route)
      const response = await fetch(`http://localhost:3000/api/profile/${account_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedUser)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Update failed`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUser(data.profile);
        setEditedUser(data.profile);
        setIsEditing(false);
        
        // Update sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.profile));
        
        alert(data.message || 'Profile updated successfully!');
        console.log('✅ Profile updated successfully');
      } else {
        throw new Error(data.error || 'Update failed');
      }
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setError(error.message);
      
      let userMessage = 'Failed to update profile. ';
      
      if (error.message.includes('404')) {
        userMessage += 'Profile not found.';
      } else if (error.message.includes('Failed to fetch')) {
        userMessage += 'Cannot connect to server. Please check your connection.';
      } else if (error.message.includes('Account ID')) {
        userMessage += 'Please log in again.';
      } else {
        userMessage += error.message;
      }
      
      alert(userMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
    setError(null);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const account_id = user.account_id;
      
      if (!account_id) {
        throw new Error('Account ID not found. Please log in again.');
      }
      
      // FIXED: Avatar upload endpoint (matches backend route)
      const response = await fetch(`http://localhost:3000/api/profile/${account_id}/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload avatar');
      }

      const data = await response.json();
      
      if (data.success) {
        setUser(prev => ({ ...prev, avatar: data.avatarUrl }));
        setEditedUser(prev => ({ ...prev, avatar: data.avatarUrl }));
        
        // Update sessionStorage
        sessionStorage.setItem('user', JSON.stringify({ ...user, avatar: data.avatarUrl }));
        
        // alert(data.message || 'Avatar updated successfully!');
        // console.log('✅ Avatar updated successfully');
      } else {
        throw new Error(data.error || 'Avatar upload failed');
      }
    } catch (error) {
      console.error('❌ Avatar upload error:', error);
      
      // Fallback to local preview for demo
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target.result;
        setUser(prev => ({ ...prev, avatar: newAvatar }));
        setEditedUser(prev => ({ ...prev, avatar: newAvatar }));
      };
      reader.readAsDataURL(file);
      
      alert('Avatar upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tab navigation
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    // { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    // { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={getUserFromSession}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          
          <div className="header-actions">
            {/* <button
              onClick={navigateToDashboard}
              className="btn btn-outline"
              title="Go to Dashboard"
            >
              <Home size={16} />
              <span>Dashboard</span>
            </button> */}
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
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
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
                <button onClick={handleCancelEdit} className="btn btn-secondary">
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* Sidebar */}
        <div className="profile-sidebar">
          <ProfileCard>
            <div className="profile-intro">
              <Avatar
                src={user.avatar}
                alt={user.name || 'User Avatar'}
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
              <h2>{user.name || 'N/A'}</h2>
              <p>{user.email || 'No email'}</p>
              <p className="role">
                {user.roles
                  ? typeof user.roles === 'string'
                    ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1)
                    : user.roles.join(', ')
                  : 'User'}
              </p>
            </div>
          </ProfileCard>

          <div className="stats-grid">
            <StatCard
              title="Joined"
              value={
                user.created_at
                  ? new Date(user.created_at).getFullYear()
                  : 'Unknown'
              }
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

          <ProfileCard>
            <nav className="nav-tabs">
              {tabs.map((tab) => (
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
                    type="email"
                    value={isEditing ? editedUser.email : user.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    isEditing={isEditing}
                    icon={<Mail size={18} />}
                    placeholder="Enter your email"
                  />
                  <ProfileField
                    label="Phone Number"
                    type="tel"
                    value={isEditing ? editedUser.phone_no : user.phone_no}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    isEditing={isEditing}
                    icon={<Phone size={18} />}
                    placeholder="Enter your phone number"
                  />
                  <ProfileField
                    label="Location"
                    value={isEditing ? editedUser.address : user.address}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    isEditing={isEditing}
                    icon={<MapPin size={18} />}
                    placeholder="Enter your location"
                  />
                </div>
              </ProfileCard>

              {/* Academic Info for Students */}
              {user?.roles === 'student' && (
                <ProfileCard title="Academic Information">
                  <div className="profile-fields">
                    <ProfileField
                      label="Student ID"
                      value={user.student_id || 'N/A'}
                      isEditing={false}
                      icon={<User size={18} />}
                    />
                    <ProfileField
                      label="Course/Program"
                      value={isEditing ? editedUser.trading_level : user.trading_level}
                      onChange={(e) => handleFieldChange('course', e.target.value)}
                      isEditing={isEditing}
                      icon={<User size={18} />}
                      placeholder="Enter your course"
                    />
                    <ProfileField
                      label="Trading Level"
                      value={isEditing ? editedUser.yearLevel : user.trading_level}
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
              <div className="notification-settings">
                <div className="notification-group">
                  <h4 className="notification-group-title">Email Notifications</h4>
                  <div className="notification-options">
                    <label className="notification-option">
                      <input type="checkbox" defaultChecked />
                      <span>Account updates</span>
                    </label>
                    <label className="notification-option">
                      <input type="checkbox" defaultChecked />
                      <span>Security alerts</span>
                    </label>
                    <label className="notification-option">
                      <input type="checkbox" />
                      <span>Marketing emails</span>
                    </label>
                  </div>
                </div>
                
                <div className="notification-group">
                  <h4 className="notification-group-title">Push Notifications</h4>
                  <div className="notification-options">
                    <label className="notification-option">
                      <input type="checkbox" defaultChecked />
                      <span>Important updates</span>
                    </label>
                    <label className="notification-option">
                      <input type="checkbox" />
                      <span>Daily reminders</span>
                    </label>
                  </div>
                </div>
              </div>
            </ProfileCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;