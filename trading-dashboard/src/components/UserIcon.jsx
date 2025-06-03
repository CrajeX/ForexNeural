// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// const UserButtonWithPopup = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const popupRef = useRef(null);
//   const buttonRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');;
//   const styles = {
//     container: {
//       position: 'relative',
//       display: 'inline-block',
//     },
//     headerButton: {
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//       color: '#9ca3af',
//       padding: '8px',
//       borderRadius: '4px',
//       transition: 'all 0.2s ease',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     popup: {
//       position: 'absolute',
//       top: '100%',
//       right: '0',
//       marginTop: '8px',
//       minWidth: '180px',
//       backgroundColor: '#1f2937',
//       color: '#fff',
//       borderRadius: '8px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//       zIndex: 1000,
//       border: '1px solid #374151',
//     },
//     menuItem: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px',
//       padding: '12px 16px',
//       fontSize: '14px',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s ease',
//       borderBottom: '1px solid #374151',
//     },
//     menuItemLast: {
//       borderBottom: 'none',
//     },
//     menuItemHover: {
//       backgroundColor: '#374151',
//     },
//     logoutItem: {
//       color: '#ef4444',
//     }
//   };

//   // Close popup when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target) && 
//           buttonRef.current && !buttonRef.current.contains(event.target)) {
//         setShowPopup(false);
//       }
//     };

//     if (showPopup) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showPopup]);
//   const navigate = useNavigate();
//   const handleMenuItemClick = (action) => {
//     setShowPopup(false);
    
//     // Handle different actions
//     switch(action) {
//       case 'profile':
//         console.log('Navigate to profile');
//         break;
    
// case 'logout':
//   console.log('Logout user');
  
//   try {
//     // Make API call to Node.js backend
//     const response = async (e) => await fetch('http://localhost:3000/api/logout', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // Include session cookies
//     });

//     const data = async (e) => await response.json();

//     if (response.ok && data.success) {
//       console.log('Logout successful:', data);
      
//       // Clear local authentication state
//       sessionStorage.removeItem('isAuthenticated');
//       sessionStorage.removeItem('user');
      
//       // Navigate to home page
//       navigate('/');
//     } else {
//       console.error('Logout failed:', data.error);
//       alert(data.error || 'Logout failed. Please try again.');
//     }
//   } catch (error) {
//     console.error('Logout error:', error);
//     alert('Network error. Please check your connection and try again.');
//   }
//   break;

//   default:
//     break;
// };
//   };

//   return (
//     <div style={styles.container}>
//      <button
//   ref={buttonRef}
//   style={{
//     ...styles.headerButton,
//     ...(showPopup ? { color: '#ffffff', backgroundColor: 'transparent' } : {})
//   }}
//   onClick={() => setShowPopup(!showPopup)}
//   onMouseEnter={(e) => {
//     if (!showPopup) e.target.style.color = 'none';
//   }}
//   onMouseLeave={(e) => {
//     if (!showPopup) e.target.style.color = '#9ca3af';
//   }}
// >

//         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//           <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//         </svg>
//       </button>
      
//       {showPopup && (
//         <div ref={popupRef} style={styles.popup}>
//           <div 
//             style={styles.menuItem}
//             onClick={() => handleMenuItemClick('profile')}
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//             </svg>
//             My Profile
//           </div>
          
         
          
//           <div 
//             style={{...styles.menuItem, ...styles.menuItemLast, ...styles.logoutItem}}
//             onClick={() => handleMenuItemClick('logout')}
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
//             </svg>
//             Logout
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserButtonWithPopup;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UserButtonWithPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

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
    logoutItem: {
      color: '#ef4444',
    },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
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

  const handleMenuItemClick = async (action) => {
    setShowPopup(false);

    switch (action) {
      case 'profile':
        console.log('Navigate to profile');
        navigate('/profile');
        // You could use: navigate('/profile');
        break;

      case 'logout':
        console.log('Logging out...');
        setLoading(true);
        try {
          const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          const data = await response.json();

          if (response.ok && data.success) {
            sessionStorage.removeItem('isAuthenticated');
            sessionStorage.removeItem('user');
            navigate('/');
          } else {
            alert(data.error || 'Logout failed. Please try again.');
          }
        } catch (error) {
          console.error('Logout error:', error);
          alert('Network error. Please check your connection and try again.');
        } finally {
          setLoading(false);
        }
        break;

      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      <button
        ref={buttonRef}
        title="User menu"
        style={{
          ...styles.headerButton,
          ...(showPopup ? { color: '#ffffff' } : {})
        }}
        onClick={() => setShowPopup(!showPopup)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>

      {showPopup && (
        <div ref={popupRef} style={styles.popup}>
          <div
            style={styles.menuItem}
            onClick={() => handleMenuItemClick('profile')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            My Profile
          </div>

          <div
            style={{ ...styles.menuItem, ...styles.menuItemLast, ...styles.logoutItem }}
            onClick={() => handleMenuItemClick('logout')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            {loading ? 'Logging out...' : 'Logout'}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButtonWithPopup;
