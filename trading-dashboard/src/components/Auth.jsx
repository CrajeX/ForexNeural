
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



 const getToken = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to authenticate');
    }

    return data.token;
  } catch (err) {
    throw new Error(err.message || 'Token fetch failed');
  }
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
    // Admin shortcut
    if (formData.email === 'admin' && formData.password === 'admin') {
      console.log("Logging in as admin");
      navigate('/admin');
      return;
    }

    const token = await getToken(formData.email, formData.password);
    console.log('Token received:', token);

    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    if (!loginRes.ok) {
      const { error } = await loginRes.json();
      throw new Error(error || 'Login failed');
    }

    const loginData = await loginRes.json();
    console.log('Login data:', loginData);

    localStorage.setItem('token', token);

    const { account, person, profile, role } = loginData.user;
    const fullName = `${person.first_name} ${person.middle_name || ''} ${person.last_name}`.trim();

    const sessionData = {
      account_id: account.account_id,
      username: account.username,
      account_status: account.account_status,
      email: person.email,
      name: fullName,
      first_name: person.first_name,
      middle_name: person.middle_name,
      last_name: person.last_name,
      birth_date: person.birth_date,
      birth_place: person.birth_place,
      gender: person.gender,
      education: person.education,
      employee_id: profile?.employee_id,
      employment_status: profile?.employment_status,
      staff_id: profile?.staff_id,
      student_id: profile?.student_id || null,
      trading_level: profile?.trading_level || null,
      role_id: role?.role_id,
      role_name: role?.role_name,
      permissions: role?.permissions,
      token: token,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };

    // Register only if user does not already exist in SQL
    const checkRes = await fetch(`http://localhost:3000/api/check-user?account_id=${sessionData.account_id}`);
    const checkData = await checkRes.json();

    if (!checkData.exists) {
      const registerRes = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          account_id: sessionData.account_id,
          student_id: sessionData.student_id,
          email: sessionData.email,
          password: formData.password,
          username: sessionData.username,
          name: sessionData.name,
          roles: sessionData.role_name || 'student',
          address: sessionData.address || '',
          birth_place: sessionData.birth_place || '',
          phone_no: sessionData.phone_no || '',
          trading_level: sessionData.trading_level,
          gender: sessionData.gender || '',
          birth_date: sessionData.birth_date || '',
          authenticated: true,
          loginTime: sessionData.loginTime
        })
      });

      if (!registerRes.ok) {
        console.warn('Registration failed:', await registerRes.text());
      }
    }

    sessionStorage.setItem('session', JSON.stringify(sessionData));
    setSessionInfo(sessionData);

    let message = `Login successful! Welcome back, ${sessionData.name}!`;
    if (loginData.sessionInfo?.isExistingSession) {
      message += ` Previous session from ${new Date(loginData.sessionInfo.createdAt).toLocaleString()} restored.`;
    } else {
      message += ` New session started.`;
    }
    setSuccess(message);

    setFormData({ email: '', password: '' });
    navigate('/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || 'Connection error. Please check if the server is running.');
  } finally {
    setLoading(false);
  }
};



// const handleSubmit = async (e) => {
//   if (e && e.preventDefault) {
//     e.preventDefault();
//   }
  
//   setLoading(true);
//   setError('');
//   setSuccess('');
  
//   // Validate input fields
//   if (!formData.email || !formData.password) {
//     setError('Please fill in all fields');
//     setLoading(false);
//     return;
//   }
  
//   try {
//     // Check for admin login first
//     if (formData.email === 'admin' && formData.password === 'admin') {
//       console.log("Logging in as admin");
//       navigate('/admin');
//       return;
//     }
    
//     // STEP 1: Fetch token using credentials
//     const token = await getToken(formData.email, formData.password);
//     console.log('Token received:', token);
    
//     // STEP 2: Validate token with backend
//     const loginRes = await fetch('http://localhost:3001/api/auth/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ token })
//     });

//     if (!loginRes.ok) {
//       const { error } = await loginRes.json();
//       throw new Error(error || 'Login failed');
//     }

//     const loginData = await loginRes.json();
//     console.log('Login data:', loginData);
    
//     // Store authentication data
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(loginData.user));
    
//     // Create session data
//     const sessionData = {
//       user: loginData.user,
//       name: loginData.user.name || loginData.user.username,
//       sessionInfo: loginData.sessionInfo,
//       isAuthenticated: true,
//       loginTime: new Date().toISOString(),
//       // Add other user properties as needed
//       account_id: loginData.user.account_id,
//       student_id: loginData.user.student_id,
//       username: loginData.user.username,
//       roles: loginData.user.roles,
//       address: loginData.user.address,
//       birth_place: loginData.user.birth_place,
//       phone_no: loginData.user.phone_no,
//       trading_level: loginData.user.trading_level,
//       gender: loginData.user.gender,
//       birth_date: loginData.user.birth_date
//     };
    
//     // STEP 3: Register/sync user data with main server
//     const registerRes = await fetch('http://localhost:3000/api/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({
//         account_id: sessionData.account_id,
//         student_id: sessionData.student_id,
//         name: sessionData.name,
//         username: sessionData.username,
//         email: formData.email,
//         roles: sessionData.roles,
//         password: formData.password,
//         address: sessionData.address,
//         birth_place: sessionData.birth_place,
//         phone_no: sessionData.phone_no,
//         trading_level: sessionData.trading_level,
//         gender: sessionData.gender,
//         birth_date: sessionData.birth_date,
//         authenticated: true,
//         loginTime: sessionData.loginTime
//       })
//     });
    
//     if (!registerRes.ok) {
//       console.warn('Registration sync failed, but continuing with login');
//     }
    
//     // Save to sessionStorage
//     sessionStorage.setItem('isAuthenticated', 'true');
//     sessionStorage.setItem('user', JSON.stringify(loginData.user));
    
//     // Update component state
//     setSessionInfo(sessionData);
    
//     // Create success message
//     let message = `Login successful! Welcome back, ${sessionData.name}!`;
//     if (loginData.sessionInfo?.isExistingSession) {
//       message += ` Your previous session from ${new Date(loginData.sessionInfo.createdAt).toLocaleString()} has been restored.`;
//     } else {
//       message += ` New session created.`;
//     }
//     setSuccess(message);
    
//     // Reset form
//     setFormData({ email: '', password: '' });
    
//     console.log('✅ Ready to navigate based on role:', loginData.user.roles);
//     console.log("Authenticated - navigating to dashboard");
    
//     // Navigate to dashboard
//     navigate('/dashboard');
    
//   } catch (error) {
//     console.error('Login error:', error);
//     setError(error.message || 'Connection error. Please check if the server is running.');
//   } finally {
//     setLoading(false);
//   }
// };

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