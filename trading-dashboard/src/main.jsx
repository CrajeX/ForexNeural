// First, update your main.jsx routing to include CurrencyProfile route:

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import TradingDashboard from './TradingDashboard'
import LoginSignupPage from './components/Auth'
import { AuthProvider } from './contexts/AuthContext'
import AdminPage from './AdminPage'
import SettingsDemo from './components/settings'
import SettingsWindow from './components/settings'
import ProfilePage from './components/Profile'
import CurrencyProfile from './components/CurrencyProfile'

// Protected Route Component
const ProtectedRoute = ({ children, allowDirectAccess = false }) => {
  const [isAllowed, setIsAllowed] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  
  React.useEffect(() => {
    const checkAccess = () => {
      // Check if navigation was programmatic (React Router navigation)
      const isProgrammaticNavigation = sessionStorage.getItem('programmaticNav') === 'true'
      
      // Check if user has valid referrer from within the app
      const hasValidReferrer = document.referrer && 
        (document.referrer.includes(window.location.origin) || 
         sessionStorage.getItem('allowNavigation') === 'true')
      
      // Check if it's a page refresh (not direct URL typing)
      const isPageRefresh = window.performance && 
        window.performance.navigation.type === 1 && 
        sessionStorage.getItem('allowNavigation') === 'true'
      
      const shouldAllow = allowDirectAccess || isProgrammaticNavigation || hasValidReferrer || isPageRefresh
      setIsAllowed(shouldAllow)
      setIsLoading(false)
      
      // Clear the programmatic navigation flag
      sessionStorage.removeItem('programmaticNav')
    }
    
    // Small delay to ensure sessionStorage is properly set
    const timer = setTimeout(checkAccess, 10)
    
    return () => clearTimeout(timer)
  }, [allowDirectAccess])
  
  if (isLoading) {
    return <div>Loading...</div> // Or your loading component
  }
  
  if (!isAllowed) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

// Navigation Interceptor Component
const NavigationInterceptor = ({ children }) => {
  React.useEffect(() => {
    // Set initial navigation permission
    sessionStorage.setItem('allowNavigation', 'true')
    
    // Intercept all programmatic navigation
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState
    
    window.history.pushState = function(...args) {
      sessionStorage.setItem('programmaticNav', 'true')
      sessionStorage.setItem('allowNavigation', 'true')
      return originalPushState.apply(window.history, args)
    }
    
    window.history.replaceState = function(...args) {
      sessionStorage.setItem('programmaticNav', 'true')
      sessionStorage.setItem('allowNavigation', 'true')
      return originalReplaceState.apply(window.history, args)
    }
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      sessionStorage.setItem('allowNavigation', 'true')
    }
    
    window.addEventListener('popstate', handlePopState)
    
    // Cleanup
    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
  
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <NavigationInterceptor>
          <Routes>
            {/* Public Routes - Allow direct access */}
            <Route path="/auth" element={<LoginSignupPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />
            
            {/* Protected Routes - Prevent direct URL access */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <TradingDashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/:assetPairCode" 
                element={
                  <ProtectedRoute>
                    <TradingDashboard />
                  </ProtectedRoute>
                }
              />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsWindow />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD THIS NEW ROUTE FOR CURRENCY PROFILE */}
            <Route 
              path="/currency-profile/:assetPairCode" 
              element={
                <ProtectedRoute>
                  <CurrencyProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            
            {/* Catch all route - 404 */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </NavigationInterceptor>
      </Router>
    </AuthProvider>
  </React.StrictMode>
)