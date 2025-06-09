
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Logo Component
const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <img src='8Con Loco.png' style={{height:'5rem'}} alt="8ConEdge Logo" />
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #111827, #6b7280)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          8ConEdge
        </h1>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0',
          marginTop: '-4px'
        }}>Confluence is Confidence</p>
      </div>
    </div>
  );
};

// Simplified Footer Component
const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#6c9474',
      borderTop: '1px solid #e5e7eb',
      padding: '32px 24px'
    }}>
      <div style={{
        maxWidth: '1152px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Logo />
      </div>
    </footer>
  );
};

// Main Login Page Component
const LoginSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sessionInfo, setSessionInfo] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check for existing authentication on component mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/check-auth', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.authenticated && data.user) {
        console.log('✅ Found existing authentication:', data.user);
        
        // Save to memory state (since we can't use sessionStorage in artifacts)
        setSessionInfo({
          user: data.user,
          sessionInfo: data.sessionInfo,
          isAuthenticated: true
        });
        
        setSuccess(`Welcome back, ${data.user.name || data.user.username}! Your session is still active.`);
      }
    } catch (error) {
      console.log('ℹ️ No existing authentication found:', error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      // Make API call to your Express backend
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // required for cookies/session
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      if (formData.email == 'admin' && formData.password == 'admin' )
        {
           navigate('/admin');
           console.log("Logging in on admin")
        }
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Login successful:', data);
        
        // Store user data in component state (simulating sessionStorage)
        const sessionData = {
          user: data.user,
          name: data.username,
          sessionInfo: data.sessionInfo,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        
        setSessionInfo(sessionData);
        
        // Success message with session info
        let message = `Login successful! Welcome back, ${data.user.name || data.user.username}!`;
        
        if (data.sessionInfo?.isExistingSession) {
          message += ` Your previous session from ${new Date(data.sessionInfo.createdAt).toLocaleString()} has been restored.`;
        } else {
          message += ` New session created.`;
        }
        
        setSuccess(message);
        
        // Reset form
        setFormData({ email: '', password: '' });
        
        // In a real app, you would navigate here
        console.log('✅ Ready to navigate based on role:', data.user.roles);
        const response = await fetch('http://localhost:3000/api/register', {
         method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
   
    account_id: sessionData.account_id,
    student_id: sessionData.student_id,
    name: sessionData.name,
    username: sessionData.username,
    email: formData.email,
    roles: sessionData.roles,
    password: formData.password,
    address: sessionData.address,
    birth_place: sessionData.birth_place,
    phone_no: sessionData.phone_no,
    trading_level: sessionData.trading_level,
    gender: sessionData.gender,
    birth_date: sessionData.birth_date,
    authenticated: true,
    loginTime: new Date().toISOString(),
    
   
  })
      });
                // ✅ Save to sessionStorage
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('user', JSON.stringify(data.user));

          // Update state
          setSessionInfo(sessionData);
          setSuccess(`Welcome back, ${data.user.name || data.user.username}!`);
        
         
           navigate('/dashboard');
         
      } else {
        console.error('Login failed:', data.error);
        setError(data.error || 'Login failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please check if the server is running on http://localhost:3000');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setSessionInfo(null);
        setSuccess('Logged out successfully');
        setFormData({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error during logout');
    }
  };
   const getThemeColors = () => {
 
 
   
      return {
        background: '#e4eed3',
        cardBackground: '#1f2937',
        sidebar: '#6c9474',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        accent: '#3b82f6',
        border: 'black'
    
    }
  };

  const colors = getThemeColors();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: colors.sidebar,
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto'
        }}>
          <Logo />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px'
      }}>
        <div style={{
          backgroundColor: colors.sidebar ,
          padding: '48px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: colors.text,
              margin: '0 0 8px 0'
            }}>
              {sessionInfo ? 'Dashboard' : 'Welcome Back'}
            </h2>
            <p style={{
              color: colors.text,
              margin: 0
            }}>
              {sessionInfo ? 'You are successfully logged in' : 'Sign in to your 8ConEdge account'}
            </p>
          </div>

          {/* Session Info Display */}
          {sessionInfo && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0c4a6e',
                margin: '0 0 8px 0'
              }}>
                Session Active
              </h3>
              <div style={{ fontSize: '14px', color: '#075985' }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>User:</strong> {sessionInfo.user.name || sessionInfo.user.username}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Email:</strong> {sessionInfo.user.email}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Role:</strong> {sessionInfo.user.roles?.[0] || 'User'}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Login Time:</strong> {new Date(sessionInfo.loginTime).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: '12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #86efac',
              color: '#059669',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          {/* Login Form - Only show if not logged in */}
          {!sessionInfo && (
            <div>
              {/* Email Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 44px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 44px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  backgroundColor: loading ? colors.background :  '#395537',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#e4eed3', e.target.style.color = 'black';
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#395537', e.target.style.color = colors.text;
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Additional Links */}
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <a href="#" style={{ color: colors.text, textDecoration: 'none' }}>
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* CSS for spin animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginSignupPage;