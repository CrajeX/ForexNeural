import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const UserButtonWithPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  
  const styles = {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    headerButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '8px',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    popup: {
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      minWidth: '180px',
      backgroundColor: '#1f2937',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      border: '1px solid #374151',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      borderBottom: '1px solid #374151',
    },
    menuItemLast: {
      borderBottom: 'none',
    },
    menuItemHover: {
      backgroundColor: '#374151',
    },
    logoutItem: {
      color: '#ef4444',
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);
  const navigate = useNavigate();
  const handleMenuItemClick = (action) => {
    setShowPopup(false);
    
    // Handle different actions
    switch(action) {
      case 'profile':
        console.log('Navigate to profile');
        break;
      case 'settings':
        console.log('Navigate to settings');
        break;
      case 'logout':
        console.log('Logout user');
        navigate('/')
        // Add your logout logic here
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      <button
        ref={buttonRef}
        style={{
          ...styles.headerButton,
          ...(showPopup ? { color: '#ffffff', backgroundColor: '#374151' } : {})
        }}
        onClick={() => setShowPopup(!showPopup)}
        onMouseEnter={(e) => {
          if (!showPopup) e.target.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          if (!showPopup) e.target.style.color = '#9ca3af';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </button>
      
      {showPopup && (
        <div ref={popupRef} style={styles.popup}>
          <div 
            style={styles.menuItem}
            onClick={() => handleMenuItemClick('profile')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            My Profile
          </div>
          
          <div 
            style={styles.menuItem}
            onClick={() => handleMenuItemClick('settings')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            Settings
          </div>
          
          <div 
            style={{...styles.menuItem, ...styles.menuItemLast, ...styles.logoutItem}}
            onClick={() => handleMenuItemClick('logout')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButtonWithPopup;