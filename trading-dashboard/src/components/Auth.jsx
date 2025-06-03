// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Link, Route } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// // Logo Component
// const Logo = () => {
//   return (
//     <div style={{
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1px'
//     }}>
//       {/* <div style={{ position: 'relative' }}>
//         <div style={{
//           width: '40px',
//           height: '40px',
//           background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
//           borderRadius: '12px',
//           transform: 'rotate(3deg)',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
//         }}></div>
//         <div style={{
//           position: 'absolute',
//           top: '-4px',
//           left: '-4px',
//           width: '40px',
//           height: '40px',
//           background: 'linear-gradient(135deg, #a855f7, #ec4899)',
//           borderRadius: '12px',
//           transform: 'rotate(-6deg)',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//           opacity: '0.8'
//         }}></div>
//         <div style={{
//           position: 'absolute',
//           top: '4px',
//           left: '4px',
//           width: '40px',
//           height: '40px',
//           background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
//           borderRadius: '12px',
//           transform: 'rotate(12deg)',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//           opacity: '0.6'
//         }}></div>
//       </div> */}
//       <img src='8Con Loco.png' style={{height:'5rem',}}></img>
//       <div>
//         <h1 style={{
//           fontSize: '24px',
//           fontWeight: 'bold',
//           background: 'linear-gradient(to right, #111827, #6b7280)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           margin: 0
//         }}>
//           8ConEdge
//         </h1>
//         <p style={{
//           fontSize: '12px',
//           color: '#6b7280',
//           margin: '0',
//           marginTop: '-4px'
//         }}>Confluence is Confidence</p>
//       </div>
//     </div>
//   );
// };

// // Footer Component
// const Footer = () => {
//   const footerLinkStyle = {
//     color: '#6b7280',
//     textDecoration: 'none',
//     transition: 'color 0.2s',
//     cursor: 'pointer'
//   };

//   const socialIconStyle = {
//     color: '#9ca3af',
//     textDecoration: 'none',
//     transition: 'color 0.2s',
//     cursor: 'pointer'
//   };

//   return (
//     <footer style={{
//       backgroundColor: '#f9fafb',
//       borderTop: '1px solid #e5e7eb',
//       padding: '32px 24px'
//     }}>
//       <div style={{
//         maxWidth: '1152px',
//         margin: '0 auto'
//       }}>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//           gap: '32px'
//         }}>
//           <div style={{ gridColumn: 'span 2' }}>
//             <Logo />
//             {/* <p style={{
//               color: '#6b7280',
//               marginTop: '16px',
//               maxWidth: '384px',
//               lineHeight: '1.5'
//             }}>
//               Empowering businesses with innovative solutions that drive growth and transform the way you work.
//             </p> */}
//           </div>
          
//           <div>
//             <h3 style={{
//               fontWeight: '600',
//               color: '#111827',
//               marginBottom: '16px',
//               fontSize: '16px'
//             }}>Company</h3>
//             <ul style={{
//               listStyle: 'none',
//               padding: 0,
//               margin: 0,
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '8px'
//             }}>
//               <li><a href="#" style={footerLinkStyle} 
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>About Us</a></li>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Careers</a></li>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Contact</a></li>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Blog</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h3 style={{
//               fontWeight: '600',
//               color: '#111827',
//               marginBottom: '16px',
//               fontSize: '16px'
//             }}>Support</h3>
//             <ul style={{
//               listStyle: 'none',
//               padding: 0,
//               margin: 0,
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '8px'
//             }}>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Help Center</a></li>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Privacy Policy</a></li>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Terms of Service</a></li>
//               <li><a href="#" style={footerLinkStyle}
//                 onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>Security</a></li>
//             </ul>
//           </div>
//         </div>
        
//         <div style={{
//           borderTop: '1px solid #e5e7eb',
//           marginTop: '32px',
//           paddingTop: '24px',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '16px',
//           alignItems: 'center'
//         }}>
//           <p style={{
//             color: '#6b7280',
//             fontSize: '14px',
//             margin: 0
//           }}>
//             © 2025 8ConEdge. All rights reserved.
//           </p>
//           <div style={{
//             display: 'flex',
//             gap: '24px'
//           }}>
//             <a href="#" style={socialIconStyle}
//               onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//               onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
//               <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//               </svg>
//             </a>
//             <a href="#" style={socialIconStyle}
//               onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//               onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
//               <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.566-1.36 2.14-2.23z"/>
//               </svg>
//             </a>
//             <a href="#" style={socialIconStyle}
//               onMouseEnter={(e) => e.target.style.color = '#2563eb'}
//               onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
//               <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// // Main Login/Signup Page Component
// const LoginSignupPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const navigate = useNavigate();
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Simulate API call
//     setTimeout(() => {
//       if (isLogin) {
//         if (formData.email && formData.password) {
//           alert('Login successful!');
//             navigate('/dashboard');
//         } else {
//           setError('Please fill in all fields');
//         }
//       } else {
//         if (formData.password !== formData.confirmPassword) {
//           setError('Passwords do not match');
//         } else if (formData.name && formData.email && formData.password) {
//           alert('Account created successfully!');
//         } else {
//           setError('Please fill in all fields');
//         }
//       }
//       setLoading(false);
//     }, 1000);
//   };

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setFormData({ name: '', email: '', password: '', confirmPassword: '' });
//     setError('');
//   };

//   const inputStyle = {
//     width: '100%',
//     paddingLeft: '40px',
//     paddingRight: '12px',
//     paddingTop: '12px',
//     paddingBottom: '12px',
//     border: '1px solid #d1d5db',
//     borderRadius: '12px',
//     fontSize: '16px',
//     outline: 'none',
//     transition: 'all 0.2s',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     boxSizing: 'border-box'
//   };

//   const inputFocusStyle = {
//     ...inputStyle,
//     borderColor: '#3b82f6',
//     boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
//   };

//   const buttonStyle = {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '12px 16px',
//     border: 'none',
//     fontSize: '16px',
//     fontWeight: '500',
//     borderRadius: '12px',
//     color: 'white',
//     background: 'linear-gradient(to right, #2563eb, #9333ea)',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     transform: 'translateY(0)'
//   };

//   const buttonHoverStyle = {
//     ...buttonStyle,
//     background: 'linear-gradient(to right, #1d4ed8, #7c3aed)',
//     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//     transform: 'translateY(-2px)'
//   };

//   const socialButtonStyle = {
//     width: '100%',
//     display: 'inline-flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '12px 16px',
//     border: '1px solid #d1d5db',
//     borderRadius: '12px',
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#6b7280',
//     backgroundColor: 'white',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//     textDecoration: 'none'
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #dbeafe, #ffffff, #faf5ff)',
//       display: 'flex',
//       flexDirection: 'column',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//     }}>
//       {/* Header */}
//       <header style={{ padding: '24px' }}>
//         <Logo />
//       </header>

//       {/* Main Content */}
//       <div style={{
//         flex: 1,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '24px',
//         paddingTop: '0.1rem',
//         paddingBottom: '48px'
//       }}>
//         <div style={{ width: '100%', maxWidth: '448px' }}>
//           {/* Floating Card */}
//           <div style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//             backdropFilter: 'blur(16px)',
//             borderRadius: '24px',
//             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//             border: '1px solid rgba(255, 255, 255, 0.2)',
//             padding: '32px'
//           }}>
//             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//               <h2 style={{
//                 fontSize: '30px',
//                 fontWeight: 'bold',
//                 color: '#111827',
//                 marginBottom: '8px',
//                 margin: 0
//               }}>
//                 {isLogin ? 'Welcome Back' : 'Create Account'}
//               </h2>
//               <p style={{
//                 color: '#6b7280',
//                 margin: 0,
//                 marginTop: '8px',
//                 lineHeight: '1.5'
//               }}>
//                 {isLogin ? 'Sign in to continue to your account' : 'Sign up to get started with FlexiCorp'}
//               </p>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//               {/* Error Message */}
//               {error && (
//                 <div style={{
//                   backgroundColor: '#fef2f2',
//                   border: '1px solid #fecaca',
//                   borderRadius: '12px',
//                   padding: '16px'
//                 }}>
//                   <p style={{
//                     color: '#991b1b',
//                     fontSize: '14px',
//                     margin: 0
//                   }}>{error}</p>
//                 </div>
//               )}

//               {/* Name Field (Signup only) */}
//               {!isLogin && (
//                 <div style={{ position: 'relative' }}>
//                   <div style={{
//                     position: 'absolute',
//                     left: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     pointerEvents: 'none'
//                   }}>
//                     <User size={20} color="#9ca3af" />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     style={inputStyle}
//                     placeholder="Full Name"
//                     required
//                     onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
//                     onBlur={(e) => Object.assign(e.target.style, inputStyle)}
//                   />
//                 </div>
//               )}

//               {/* Email Field */}
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   left: '12px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none'
//                 }}>
//                   <Mail size={20} color="#9ca3af" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   style={inputStyle}
//                   placeholder="Email Address"
//                   required
//                   onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
//                   onBlur={(e) => Object.assign(e.target.style, inputStyle)}
//                 />
//               </div>

//               {/* Password Field */}
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   left: '12px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none'
//                 }}>
//                   <Lock size={20} color="#9ca3af" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   style={{...inputStyle, paddingRight: '48px'}}
//                   placeholder="Password"
//                   required
//                   onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '48px'})}
//                   onBlur={(e) => Object.assign(e.target.style, {...inputStyle, paddingRight: '48px'})}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     padding: '4px'
//                   }}
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} color="#9ca3af" />
//                   ) : (
//                     <Eye size={20} color="#9ca3af" />
//                   )}
//                 </button>
//               </div>

//               {/* Confirm Password Field (Signup only) */}
//               {!isLogin && (
//                 <div style={{ position: 'relative' }}>
//                   <div style={{
//                     position: 'absolute',
//                     left: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     pointerEvents: 'none'
//                   }}>
//                     <Lock size={20} color="#9ca3af" />
//                   </div>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     style={inputStyle}
//                     placeholder="Confirm Password"
//                     required
//                     onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
//                     onBlur={(e) => Object.assign(e.target.style, inputStyle)}
//                   />
//                 </div>
//               )}

//               {/* Remember Me / Forgot Password */}
//               {isLogin && (
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}>
//                   <label style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     cursor: 'pointer'
//                   }}>
//                     <input 
//                       type="checkbox" 
//                       style={{
//                         marginRight: '8px',
//                         accentColor: '#2563eb'
//                       }}
//                     />
//                     <span style={{
//                       fontSize: '14px',
//                       color: '#6b7280'
//                     }}>Remember me</span>
//                   </label>
//                   <a href="#" style={{
//                     fontSize: '14px',
//                     color: '#2563eb',
//                     textDecoration: 'none',
//                     transition: 'color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
//                   onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
//                     Forgot password?
//                   </a>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 style={buttonStyle}
//                 onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
//                 onMouseLeave={(e) => !loading && Object.assign(e.target.style, buttonStyle)}
//               >
//                 {loading ? (
//                   <>
//                     <div style={{
//                       width: '20px',
//                       height: '20px',
//                       border: '2px solid transparent',
//                       borderTop: '2px solid white',
//                       borderRadius: '50%',
//                       animation: 'spin 1s linear infinite',
//                       marginRight: '8px'
//                     }}></div>
//                     {isLogin ? 'Signing In...' : 'Creating Account...'}
//                   </>
//                 ) : (
//                   <>
//                     {isLogin ? 'Sign In' : 'Create Account'}
//                     <ArrowRight size={20} style={{ marginLeft: '8px' }} />
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Toggle Mode */}
//             <div style={{
//               marginTop: '32px',
//               textAlign: 'center'
//             }}>
//               <p style={{
//                 color: '#6b7280',
//                 margin: 0
//               }}>
//                 {isLogin ? "Don't have an account?" : "Already have an account?"}
//                 <button
//                   onClick={toggleMode}
//                   style={{
//                     marginLeft: '8px',
//                     color: '#2563eb',
//                     fontWeight: '500',
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     transition: 'color 0.2s',
//                     fontSize: '16px'
//                   }}
//                   onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
//                   onMouseLeave={(e) => e.target.style.color = '#2563eb'}
//                 >
//                   {isLogin ? 'Sign up' : 'Sign in'}
//                 </button>
//               </p>
//             </div>

//             {/* Social Login */}
//             <div style={{ marginTop: '32px' }}>
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   inset: 0,
//                   display: 'flex',
//                   alignItems: 'center'
//                 }}>
//                   <div style={{
//                     width: '100%',
//                     borderTop: '1px solid #d1d5db'
//                   }}></div>
//                 </div>
//                 <div style={{
//                   position: 'relative',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   fontSize: '14px'
//                 }}>
//                   <span style={{
//                     padding: '0 8px',
//                     backgroundColor: 'white',
//                     color: '#6b7280'
//                   }}>Or continue with</span>
//                 </div>
//               </div>

//               <div style={{
//                 marginTop: '24px',
//                 display: 'grid',
//                 gridTemplateColumns: '1fr 1fr',
//                 gap: '12px'
//               }}>
//                 <button style={socialButtonStyle}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
//                   <svg width="20" height="20" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                 </button>
//                 <button style={socialButtonStyle}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
//                   <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footer />

//       {/* Add CSS animation for spinner */}
//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LoginSignupPage;
// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

// // Logo Component
// const Logo = () => {
//   return (
//     <div style={{
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1px'
//     }}>
//       <img src='8Con Loco.png' style={{height:'5rem',}}></img>
//       <div>
//         <h1 style={{
//           fontSize: '24px',
//           fontWeight: 'bold',
//           background: 'linear-gradient(to right, #111827, #6b7280)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           margin: 0
//         }}>
//           8ConEdge
//         </h1>
//         <p style={{
//           fontSize: '12px',
//           color: '#6b7280',
//           margin: '0',
//           marginTop: '-4px'
//         }}>Confluence is Confidence</p>
//       </div>
//     </div>
//   );
// };

// // Simplified Footer Component
// const Footer = () => {
//   return (
//     <footer style={{
//       backgroundColor: '#f9fafb',
//       borderTop: '1px solid #e5e7eb',
//       padding: '32px 24px'
//     }}>
//       <div style={{
//         maxWidth: '1152px',
//         margin: '0 auto',
//         display: 'flex',
//         justifyContent: 'center'
//       }}>
//         <Logo />
//       </div>
//     </footer>
//   );
// };

// // Main Login Page Component
// const LoginSignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
  
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Make API call to PHP backend
//       try {
//   const response = await fetch('http://localhost/8con/api/login.php', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include', // required for cookies/session
//     body: JSON.stringify({
//       email: formData.email,
//       password: formData.password
//     })
//   });

//   const data = await response.json();

//   if (response.ok) {
//     console.log('Login successful:', data);
//     // Handle success (e.g., redirect, show username, store session info, etc.)
//   } else {
//     console.error('Login failed:', data.error);
//     alert(data.error); // or show in UI
//   }

// } catch (error) {
//   console.error('Fetch error:', error);
//   alert('Network or server error occurred.');
// }


//       const data = await response.json();

//       if (response.ok && data.success) {
//         // Store user data in sessionStorage
//         sessionStorage.setItem('isAuthenticated', 'true');
//         sessionStorage.setItem('user', JSON.stringify(data.user));
        
//         alert(`Login successful! Welcome back, ${data.user.username}!`);
        
//         // Navigate to dashboard
//         window.location.href = '/dashboard';
//       } else {
//         setError(data.error || 'Login failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('Network error. Please check your connection and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputStyle = {
//     width: '100%',
//     paddingLeft: '40px',
//     paddingRight: '12px',
//     paddingTop: '12px',
//     paddingBottom: '12px',
//     border: '1px solid #d1d5db',
//     borderRadius: '12px',
//     fontSize: '16px',
//     outline: 'none',
//     transition: 'all 0.2s',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     boxSizing: 'border-box'
//   };

//   const inputFocusStyle = {
//     ...inputStyle,
//     borderColor: '#3b82f6',
//     boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
//   };

//   const buttonStyle = {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '12px 16px',
//     border: 'none',
//     fontSize: '16px',
//     fontWeight: '500',
//     borderRadius: '12px',
//     color: 'white',
//     background: 'linear-gradient(to right, #2563eb, #9333ea)',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     transform: 'translateY(0)'
//   };

//   const buttonHoverStyle = {
//     ...buttonStyle,
//     background: 'linear-gradient(to right, #1d4ed8, #7c3aed)',
//     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//     transform: 'translateY(-2px)'
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #dbeafe, #ffffff, #faf5ff)',
//       display: 'flex',
//       flexDirection: 'column',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//     }}>
//       {/* Header */}
//       <header style={{ padding: '24px' }}>
//         <Logo />
//       </header>

//       {/* Main Content */}
//       <div style={{
//         flex: 1,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '24px',
//         paddingTop: '0.1rem',
//         paddingBottom: '48px'
//       }}>
//         <div style={{ width: '100%', maxWidth: '448px' }}>
//           {/* Floating Card */}
//           <div style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//             backdropFilter: 'blur(16px)',
//             borderRadius: '24px',
//             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//             border: '1px solid rgba(255, 255, 255, 0.2)',
//             padding: '32px'
//           }}>
//             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//               <h2 style={{
//                 fontSize: '30px',
//                 fontWeight: 'bold',
//                 color: '#111827',
//                 marginBottom: '8px',
//                 margin: 0
//               }}>
//                 Welcome Back
//               </h2>
//               <p style={{
//                 color: '#6b7280',
//                 margin: 0,
//                 marginTop: '8px',
//                 lineHeight: '1.5'
//               }}>
//                 Sign in to continue to your account
//               </p>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//               {/* Error Message */}
//               {error && (
//                 <div style={{
//                   backgroundColor: '#fef2f2',
//                   border: '1px solid #fecaca',
//                   borderRadius: '12px',
//                   padding: '16px'
//                 }}>
//                   <p style={{
//                     color: '#991b1b',
//                     fontSize: '14px',
//                     margin: 0
//                   }}>{error}</p>
//                 </div>
//               )}

//               {/* Email Field */}
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   left: '12px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none'
//                 }}>
//                   <Mail size={20} color="#9ca3af" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   style={inputStyle}
//                   placeholder="Email Address"
//                   required
//                   onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
//                   onBlur={(e) => Object.assign(e.target.style, inputStyle)}
//                 />
//               </div>

//               {/* Password Field */}
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   left: '12px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none'
//                 }}>
//                   <Lock size={20} color="#9ca3af" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   style={{...inputStyle, paddingRight: '48px'}}
//                   placeholder="Password"
//                   required
//                   onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '48px'})}
//                   onBlur={(e) => Object.assign(e.target.style, {...inputStyle, paddingRight: '48px'})}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     padding: '4px'
//                   }}
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} color="#9ca3af" />
//                   ) : (
//                     <Eye size={20} color="#9ca3af" />
//                   )}
//                 </button>
//               </div>

//               {/* Remember Me / Forgot Password */}
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between'
//               }}>
//                 <label style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   cursor: 'pointer'
//                 }}>
//                   <input 
//                     type="checkbox" 
//                     style={{
//                       marginRight: '8px',
//                       accentColor: '#2563eb'
//                     }}
//                   />
//                   <span style={{
//                     fontSize: '14px',
//                     color: '#6b7280'
//                   }}>Remember me</span>
//                 </label>
//                 <a href="#" style={{
//                   fontSize: '14px',
//                   color: '#2563eb',
//                   textDecoration: 'none',
//                   transition: 'color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
//                 onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 style={buttonStyle}
//                 onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
//                 onMouseLeave={(e) => !loading && Object.assign(e.target.style, buttonStyle)}
//               >
//                 {loading ? (
//                   <>
//                     <div style={{
//                       width: '20px',
//                       height: '20px',
//                       border: '2px solid transparent',
//                       borderTop: '2px solid white',
//                       borderRadius: '50%',
//                       animation: 'spin 1s linear infinite',
//                       marginRight: '8px'
//                     }}></div>
//                     Signing In...
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <ArrowRight size={20} style={{ marginLeft: '8px' }} />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footer />

//       {/* Add CSS animation for spinner */}
//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LoginSignupPage;
// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// // Logo Component

// const Logo = () => {
//   return (
//     <div style={{
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     }}>
//       <img src='8Con Loco.png' style={{height:'5rem'}} alt="8ConEdge Logo" />
//       <div>
//         <h1 style={{
//           fontSize: '24px',
//           fontWeight: 'bold',
//           background: 'linear-gradient(to right, #111827, #6b7280)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           margin: 0
//         }}>
//           8ConEdge
//         </h1>
//         <p style={{
//           fontSize: '12px',
//           color: '#6b7280',
//           margin: '0',
//           marginTop: '-4px'
//         }}>Confluence is Confidence</p>
//       </div>
//     </div>
//   );
// };

// // Simplified Footer Component
// const Footer = () => {
//   return (
//     <footer style={{
//       backgroundColor: '#f9fafb',
//       borderTop: '1px solid #e5e7eb',
//       padding: '32px 24px'
//     }}>
//       <div style={{
//         maxWidth: '1152px',
//         margin: '0 auto',
//         display: 'flex',
//         justifyContent: 'center'
//       }}>
//         <Logo />
//       </div>
//     </footer>
//   );
// };

// // Main Login Page Component
// const LoginSignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//    const navigate = useNavigate();
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // const handleSubmit = async (e) => {
//   //   if (e && e.preventDefault) {
//   //     e.preventDefault();
//   //   }
//   //   setLoading(true);
//   //   setError('');

//   //   if (!formData.email || !formData.password) {
//   //     setError('Please fill in all fields');
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
     
//   //     // Make API call to PHP backend
//   //     const response = await fetch('http://localhost:3000/api/login', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       credentials: 'include', // required for cookies/session
//   //       body: JSON.stringify({
//   //         email: formData.email,
//   //         password: formData.password
//   //       })
//   //     });

//   //     const data = await response.json();

//   //     if (response.ok && data.success) {
//   //       console.log('Login successful:', data);
        
        
//   //       // In a real environment, you would use sessionStorage:
//   //       // sessionStorage.setItem('isAuthenticated', 'true');
//   //       // sessionStorage.setItem('user', JSON.stringify(data.user));
        
//   //       // For demo purposes, we'll just show success
//   //       alert(`Login successful! Welcome back, ${data.user?.username || 'User'}!`);
//   //       navigate('/dashboard');
//   //       // Navigate to dashboard
//   //       // window.location.href = '/dashboard';
        
//   //       // Reset form for demo
//   //       setFormData({ email: '', password: '' });
//   //     } else {
//   //       console.error('Login failed:', data.error);
//   //       setError(data.error || 'Login failed. Please try again.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Login error:', error);
//   //     setError('Network error. Please check your connection and try again.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//   if (e && e.preventDefault) {
//     e.preventDefault();
//   }
//   setLoading(true);
//   setError('');
  
//   if (!formData.email || !formData.password) {
//     setError('Please fill in all fields');
//     setLoading(false);
//     return;
//   }
  
//   try {
//     // Make API call to your Express backend (port 3001, not 3000)
//     const response = await fetch('http://localhost:3000/api/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // required for cookies/session
//       body: JSON.stringify({
//         email: formData.email,
//         password: formData.password
//       })
//     });
    
//     const data = await response.json();
    
//     if (response.ok && data.success) {
//       console.log('Login successful:', data);
      
//       // Save user data to sessionStorage (UNCOMMENTED AND ACTIVE)
//       sessionStorage.setItem('isAuthenticated', 'true');
//       sessionStorage.setItem('user', JSON.stringify(data.user));
      
//       // Log what was saved for debugging
//       console.log('✅ Saved to sessionStorage:', {
//         isAuthenticated: sessionStorage.getItem('isAuthenticated'),
//         user: JSON.parse(sessionStorage.getItem('user') || 'null')
//       });
      
//       // Success message
//       alert(`Login successful! Welcome back, ${data.user?.name || data.user?.username || 'User'}!`);
//       if(data.user?.roles == 'student'){
//         navigate('/dashboard');
//       }
//       // Navigate to dashboard
      
      
//       // Reset form
//       setFormData({ email: '', password: '' });
      
//     } else {
//       console.error('Login failed:', data.error);
//       setError(data.error || 'Login failed. Please try again.');
//     }
    
//   } catch (error) {
//     console.error('Login error:', error);
//     setError('Network error. Please check your connection and try again.');
//   } finally {
//     setLoading(false);
//   }
// };

// // Helper function to get user data (you can use this anywhere in your app)
//   const getUserFromSession = () => {
//   try {
//     const userData = JSON.parse(sessionStorage.getItem('user') || 'null');
//     const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    
//     return {
//       user: userData,
//       isAuthenticated: isAuthenticated && userData !== null
//     };
//   } catch (error) {
//     console.error('Error reading from sessionStorage:', error);
//     return {
//       user: null,
//       isAuthenticated: false
//     };
//   }
// };
//   const inputStyle = {
//     width: '100%',
//     paddingLeft: '40px',
//     paddingRight: '12px',
//     paddingTop: '12px',
//     paddingBottom: '12px',
//     border: '1px solid #d1d5db',
//     borderRadius: '12px',
//     fontSize: '16px',
//     outline: 'none',
//     transition: 'all 0.2s',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     boxSizing: 'border-box'
//   };

//   const inputFocusStyle = {
//     ...inputStyle,
//     borderColor: '#3b82f6',
//     boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
//   };

//   const buttonStyle = {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '12px 16px',
//     border: 'none',
//     fontSize: '16px',
//     fontWeight: '500',
//     borderRadius: '12px',
//     color: 'white',
//     background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
//     cursor: loading ? 'not-allowed' : 'pointer',
//     transition: 'all 0.2s',
//     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     transform: 'translateY(0)'
//   };

//   const buttonHoverStyle = {
//     ...buttonStyle,
//     background: 'linear-gradient(to right, #1d4ed8, #7c3aed)',
//     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//     transform: 'translateY(-2px)'
//   };

//   return (
//     <>
//       {/* CSS Animation for spinner */}
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//           .spinner {
//             width: 20px;
//             height: 20px;
//             border: 2px solid transparent;
//             border-top: 2px solid white;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//             margin-right: 8px;
//           }
//         `}
//       </style>
      
//       <div style={{
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #dbeafe, #ffffff, #faf5ff)',
//         display: 'flex',
//         flexDirection: 'column',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//       }}>
//         {/* Header */}
//         <header style={{ padding: '24px' }}>
//           <Logo />
//         </header>

//         {/* Main Content */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '24px',
//           paddingTop: '0.1rem',
//           paddingBottom: '48px'
//         }}>
//           <div style={{ width: '100%', maxWidth: '448px' }}>
//             {/* Floating Card */}
//             <div style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               backdropFilter: 'blur(16px)',
//               borderRadius: '24px',
//               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//               border: '1px solid rgba(255, 255, 255, 0.2)',
//               padding: '32px'
//             }}>
//               <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//                 <h2 style={{
//                   fontSize: '30px',
//                   fontWeight: 'bold',
//                   color: '#111827',
//                   marginBottom: '8px',
//                   margin: 0
//                 }}>
//                   Welcome Back
//                 </h2>
//                 <p style={{
//                   color: '#6b7280',
//                   margin: 0,
//                   marginTop: '8px',
//                   lineHeight: '1.5'
//                 }}>
//                   Sign in to continue to your account
//                 </p>
//               </div>

//               {/* Login Form */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                 {/* Error Message */}
//                 {error && (
//                   <div style={{
//                     backgroundColor: '#fef2f2',
//                     border: '1px solid #fecaca',
//                     borderRadius: '12px',
//                     padding: '16px'
//                   }}>
//                     <p style={{
//                       color: '#991b1b',
//                       fontSize: '14px',
//                       margin: 0
//                     }}>{error}</p>
//                   </div>
//                 )}

//                 {/* Email Field */}
//                 <div style={{ position: 'relative' }}>
//                   <div style={{
//                     position: 'absolute',
//                     left: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     pointerEvents: 'none'
//                   }}>
//                     <Mail size={20} color="#9ca3af" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     style={inputStyle}
//                     placeholder="Email Address"
//                     required
//                     disabled={loading}
//                     onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
//                     onBlur={(e) => Object.assign(e.target.style, inputStyle)}
//                   />
//                 </div>

//                 {/* Password Field */}
//                 <div style={{ position: 'relative' }}>
//                   <div style={{
//                     position: 'absolute',
//                     left: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     pointerEvents: 'none'
//                   }}>
//                     <Lock size={20} color="#9ca3af" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     style={{...inputStyle, paddingRight: '48px'}}
//                     placeholder="Password"
//                     required
//                     disabled={loading}
//                     onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '48px'})}
//                     onBlur={(e) => Object.assign(e.target.style, {...inputStyle, paddingRight: '48px'})}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     style={{
//                       position: 'absolute',
//                       right: '12px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       background: 'none',
//                       border: 'none',
//                       cursor: 'pointer',
//                       padding: '4px'
//                     }}
//                     disabled={loading}
//                   >
//                     {showPassword ? (
//                       <EyeOff size={20} color="#9ca3af" />
//                     ) : (
//                       <Eye size={20} color="#9ca3af" />
//                     )}
//                   </button>
//                 </div>

//                 {/* Remember Me / Forgot Password */}
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}>
//                   <label style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     cursor: loading ? 'not-allowed' : 'pointer'
//                   }}>
//                     <input 
//                       type="checkbox" 
//                       style={{
//                         marginRight: '8px',
//                         accentColor: '#2563eb'
//                       }}
//                       disabled={loading}
//                     />
//                     <span style={{
//                       fontSize: '14px',
//                       color: '#6b7280'
//                     }}>Remember me</span>
//                   </label>
//                   <a href="#" style={{
//                     fontSize: '14px',
//                     color: '#2563eb',
//                     textDecoration: 'none',
//                     transition: 'color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
//                   onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
//                     Forgot password?
//                   </a>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   style={buttonStyle}
//                   onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
//                   onMouseLeave={(e) => !loading && Object.assign(e.target.style, buttonStyle)}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="spinner"></div>
//                       Signing In...
//                     </>
//                   ) : (
//                     <>
//                       Sign In
//                       <ArrowRight size={20} style={{ marginLeft: '8px' }} />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
                  
//         {/* Footer */}
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default LoginSignupPage;
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
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
      backgroundColor: '#f9fafb',
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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);
    setError('');
    
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
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Login successful:', data);
        
        // Enhanced user data storage with more comprehensive information
        const userProfile = {
          // Core user information
          id: data.user._id || data.user.id,
          email: data.user.email,
          username: data.user.username,
          name: data.user.name || data.user.fullName,
          roles: data.user.roles || data.user.role,
          
          // Profile information
          avatar: data.user.avatar || data.user.profilePicture,
          phone: data.user.phone || data.user.phoneNumber,
          location: data.user.location || data.user.address,
          bio: data.user.bio || data.user.description,
          
          // Academic information (for students)
          studentId: data.user.studentId,
          course: data.user.course || data.user.program,
          yearLevel: data.user.yearLevel || data.user.year,
          department: data.user.department,
          
          // Professional information (for faculty/staff)
          employeeId: data.user.employeeId,
          position: data.user.position || data.user.title,
          
          // Account status and timestamps
          status: data.user.status || 'active',
          isVerified: data.user.isVerified || false,
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
          lastLogin: new Date().toISOString(),
          
          // Additional metadata
          preferences: data.user.preferences || {},
          permissions: data.user.permissions || []
        };
        
        // Save comprehensive user data to sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('user', JSON.stringify(userProfile));
        sessionStorage.setItem('authToken', data.token || ''); // If using JWT tokens
        sessionStorage.setItem('loginTime', new Date().toISOString());
        
        // Log what was saved for debugging
        console.log('✅ Saved to sessionStorage:', {
          isAuthenticated: sessionStorage.getItem('isAuthenticated'),
          user: JSON.parse(sessionStorage.getItem('user') || 'null'),
          hasToken: !!sessionStorage.getItem('authToken')
        });
        
        // Success message with personalized greeting
        const welcomeName = userProfile.name || userProfile.username || 'User';
        alert(`Login successful! Welcome back, ${welcomeName}!`);
        
        // Role-based navigation
        switch(userProfile.roles) {
          case 'student':
            navigate('/dashboard');
            break;
          case 'teacher':
          case 'faculty':
            navigate('/teacher-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/dashboard');
        }
        
        // Reset form
        setFormData({ email: '', password: '' });
        
      } else {
        console.error('Login failed:', data.error);
        setError(data.error || 'Login failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced helper function to get user data (export this for use in other components)
  const getUserFromSession = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('user') || 'null');
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      const authToken = sessionStorage.getItem('authToken');
      const loginTime = sessionStorage.getItem('loginTime');
      
      return {
        user: userData,
        isAuthenticated: isAuthenticated && userData !== null,
        token: authToken,
        loginTime: loginTime,
        // Check if session is still valid (optional: implement session timeout)
        isSessionValid: () => {
          if (!loginTime) return false;
          const sessionAge = Date.now() - new Date(loginTime).getTime();
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          return sessionAge < maxAge;
        }
      };
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return {
        user: null,
        isAuthenticated: false,
        token: null,
        loginTime: null,
        isSessionValid: () => false
      };
    }
  };

  // Logout function (can be used in other components)
  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('loginTime');
    navigate('/login');
  };

  // Component styles (same as before)
  const inputStyle = {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '12px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
  };

  const buttonStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '12px',
    color: 'white',
    background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transform: 'translateY(0)'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: 'linear-gradient(to right, #1d4ed8, #7c3aed)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)'
  };

  return (
    <>
      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
          }
        `}
      </style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dbeafe, #ffffff, #faf5ff)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Header */}
        <header style={{ padding: '24px' }}>
          <Logo />
        </header>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          paddingTop: '0.1rem',
          paddingBottom: '48px'
        }}>
          <div style={{ width: '100%', maxWidth: '448px' }}>
            {/* Floating Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: 0
                }}>
                  Welcome Back
                </h2>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  marginTop: '8px',
                  lineHeight: '1.5'
                }}>
                  Sign in to continue to your account
                </p>
              </div>

              {/* Login Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Error Message */}
                {error && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px'
                  }}>
                    <p style={{
                      color: '#991b1b',
                      fontSize: '14px',
                      margin: 0
                    }}>{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <Mail size={20} color="#9ca3af" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="Email Address"
                    required
                    disabled={loading}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>

                {/* Password Field */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <Lock size={20} color="#9ca3af" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{...inputStyle, paddingRight: '48px'}}
                    placeholder="Password"
                    required
                    disabled={loading}
                    onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '48px'})}
                    onBlur={(e) => Object.assign(e.target.style, {...inputStyle, paddingRight: '48px'})}
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
                      padding: '4px'
                    }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </button>
                </div>

                {/* Remember Me / Forgot Password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                    <input 
                      type="checkbox" 
                      style={{
                        marginRight: '8px',
                        accentColor: '#2563eb'
                      }}
                      disabled={loading}
                    />
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>Remember me</span>
                  </label>
                  <a href="#" style={{
                    fontSize: '14px',
                    color: '#2563eb',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={buttonStyle}
                  onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
                  onMouseLeave={(e) => !loading && Object.assign(e.target.style, buttonStyle)}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
                  
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

// Export utility functions for use in other components
export const authUtils = {
  getUserFromSession: () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('user') || 'null');
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      const authToken = sessionStorage.getItem('authToken');
      const loginTime = sessionStorage.getItem('loginTime');
      
      return {
        user: userData,
        isAuthenticated: isAuthenticated && userData !== null,
        token: authToken,
        loginTime: loginTime,
        isSessionValid: () => {
          if (!loginTime) return false;
          const sessionAge = Date.now() - new Date(loginTime).getTime();
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          return sessionAge < maxAge;
        }
      };
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return {
        user: null,
        isAuthenticated: false,
        token: null,
        loginTime: null,
        isSessionValid: () => false
      };
    }
  },
  
  logout: (navigate) => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('loginTime');
    if (navigate) navigate('/login');
  }
};

export default LoginSignupPage;