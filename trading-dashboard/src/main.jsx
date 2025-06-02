// Updated main.jsx with simple routing
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import TradingDashboard from './TradingDashboard'
import LoginSignupPage from './components/Auth'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<LoginSignupPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/signup" element={<Navigate to="/auth" replace />} />
          
          {/* Dashboard Route - No Protection */}
          <Route path="/dashboard" element={<TradingDashboard />} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
)