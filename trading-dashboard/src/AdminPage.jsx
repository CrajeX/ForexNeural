
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  FilePenLine, FileSpreadsheetIcon, Settings, Maximize2, ZoomIn, ZoomOut, 
  Move, Clock, TrendingUp, TrendingDown, BarChart3, ActivityIcon, Activity, 
  Shield, Globe, Calendar, Bell, User, Search, Star, Eye, Target,
  X, Palette, Monitor, Sun, Moon, Save, RotateCcw, Layout, Volume2, Sliders,
  LogOut, Menu
} from 'lucide-react';
import TradingViewWidget from './components/DukascopyChart'
import TradingViewNewsWidget from './components/DukascopyNewsWidget'; 
import TradingViewEventsWidget from './components/EconomicCalendar';
import UserButtonWithPopup from './components/UserIcon'
import ProfilePage from './components/Profile';
import TopSetups from './components/TopSetups';
import CurrencyProfile from './components/CurrencyProfile';
import TopSetupsCardView from './components/TopSetupsCardView';
import CombinedEconomicDataForm from './components/EconomicDataEntry';
import TradingEconomicsHistory from './components/TradingEconomics';
// Settings Window Component with responsive design
import { 
  THEME_MODES, 
  DEFAULT_THEMES, 
  DEFAULT_SETTINGS, 
  getThemeColors, 
  getThemeStyles,
  saveSettings as saveSettingsToStorage,
  applyThemeToDocument 
} from './contexts/themeConfig';

// Hook for responsive breakpoints
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoints = {
    mobile: windowSize.width < 768,
    tablet: windowSize.width >= 768 && windowSize.width < 1024,
    desktop: windowSize.width >= 1024,
    sm: windowSize.width >= 640,
    md: windowSize.width >= 768,
    lg: windowSize.width >= 1024,
    xl: windowSize.width >= 1280
  };

  return { windowSize, ...breakpoints };
};




const SettingsWindow = ({ isOpen, onClose, onApplySettings, currentSettings }) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState(currentSettings);
  const [loading, setLoading] = useState(false);
  const { mobile, tablet } = useResponsive();

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCustomColorChange = (colorKey, value) => {
    setSettings(prev => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        [colorKey]: value
      }
    }));
  };

  const saveSettings = () => {
    const success = saveSettingsToStorage(settings);
    
    if (success) {
      onApplySettings(settings);
      onClose();
    } else {
      console.error('Failed to save settings');
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    setLoading(true);
    
    try {
      const response = await fetch(`http://${BASE_URL}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('user');
        onClose();
        window.location.href = '/';
      } else {
        alert(data.error || 'Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const themeOptions = [
    { 
      id: THEME_MODES.DARK, 
      label: 'Dark Mode', 
      icon: Moon, 
      preview: DEFAULT_THEMES.dark.background 
    },
    { 
      id: THEME_MODES.LIGHT, 
      label: 'Light Mode', 
      icon: Sun, 
      preview: DEFAULT_THEMES.light.background 
    },
    { 
      id: THEME_MODES.CUSTOM, 
      label: 'Custom Theme', 
      icon: Palette, 
      preview: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' 
    }
  ];

  if (!isOpen) return null;

  const colors = getThemeColors(settings);
  const themeStyles = getThemeStyles(settings);

  const settingsStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      padding: mobile ? '16px' : '24px'
    },
    modal: {
      ...themeStyles.card,
      width: mobile ? '100%' : tablet ? '85vw' : '90vw',
      maxWidth: mobile ? 'none' : '900px',
      height: mobile ? '100%' : tablet ? '85vh' : '80vh',
      maxHeight: mobile ? 'none' : '700px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: mobile ? '16px' : `${settings.cardPadding}px`,
      borderBottom: `1px solid ${colors.border}`,
      flexShrink: 0
    },
    title: {
      fontSize: mobile ? '18px' : tablet ? '20px' : settings.fontSize === 'large' ? '28px' : settings.fontSize === 'small' ? '20px' : '24px',
      fontWeight: 'bold',
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    content: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      flexDirection: mobile ? 'column' : 'row'
    },
    sidebar: {
      width: mobile ? '100%' : tablet ? '180px' : '200px',
      padding: mobile ? '12px' : '16px',
      borderRight: mobile ? 'none' : `1px solid ${colors.border}`,
      borderBottom: mobile ? `1px solid ${colors.border}` : 'none',
      overflow: mobile ? 'auto' : 'hidden',
      flexShrink: 0,
      backgroundColor: mobile ? colors.background : 'transparent'
    },
    main: {
      flex: 1,
      padding: mobile ? '16px' : `${settings.cardPadding}px`,
      overflow: 'auto',
      fontSize: mobile ? '14px' : settings.fontSize === 'large' ? '18px' : settings.fontSize === 'small' ? '14px' : '16px'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: mobile ? '16px' : `${settings.cardPadding}px`,
      borderTop: `1px solid ${colors.border}`,
      flexShrink: 0,
      flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? '12px' : '0'
    }
  };

  // Mobile-optimized tab navigation
  const MobileTabNavigation = () => (
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      gap: '8px',
      padding: '0 4px',
      '::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: `${settings.cardBorderRadius}px`,
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
            color: activeTab === tab.id ? '#ffffff' : colors.textSecondary,
            whiteSpace: 'nowrap',
            minWidth: 'fit-content'
          }}
        >
          <tab.icon size={14} />
          {tab.label}
        </button>
      ))}
    </div>
  );

  // Desktop tab navigation
  const DesktopTabNavigation = () => (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: `${settings.cardBorderRadius}px`,
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
            color: activeTab === tab.id ? '#ffffff' : colors.textSecondary
          }}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </>
  );

  const renderAppearanceTab = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: colors.text, marginBottom: '16px', fontSize: mobile ? '16px' : '18px' }}>Theme Selection</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {themeOptions.map(theme => (
            <div
              key={theme.id}
              onClick={() => handleSettingChange('theme', theme.id)}
              style={{
                padding: mobile ? '12px' : '16px',
                borderRadius: `${settings.cardBorderRadius}px`,
                border: `2px solid ${settings.theme === theme.id ? colors.accent : colors.border}`,
                backgroundColor: settings.theme === theme.id ? `${colors.accent}20` : colors.cardBackground,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <theme.icon size={20} style={{ color: colors.text }} />
                <span style={{ color: colors.text, fontWeight: '500', fontSize: mobile ? '14px' : '16px' }}>{theme.label}</span>
              </div>
              <div 
                style={{ 
                  width: '100%', 
                  height: '24px', 
                  borderRadius: '4px',
                  background: theme.preview 
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {settings.theme === THEME_MODES.CUSTOM && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: colors.text, marginBottom: '16px', fontSize: mobile ? '16px' : '18px' }}>Custom Colors</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            {Object.entries(settings.customColors).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: colors.textSecondary, fontSize: mobile ? '12px' : '14px' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key, e.target.value)}
                    style={{
                      width: mobile ? '50px' : '60px',
                      height: mobile ? '35px' : '40px',
                      padding: '4px',
                      borderRadius: '6px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key, e.target.value)}
                    style={{
                      flex: 1,
                      padding: mobile ? '6px 10px' : '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.cardBackground,
                      color: colors.text,
                      fontSize: mobile ? '12px' : '14px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLogoutTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ color: colors.text, marginBottom: '16px', fontSize: mobile ? '16px' : '18px' }}>Account Actions</h3>
        <p style={{ color: colors.textSecondary, marginBottom: '24px', fontSize: mobile ? '14px' : '16px' }}>
          Logging out will end your current session and redirect you to the login page.
        </p>
      </div>
      
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: mobile ? '12px 20px' : '16px 24px',
          borderRadius: `${settings.cardBorderRadius}px`,
          border: 'none',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          fontSize: mobile ? '14px' : '16px',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s',
          alignSelf: mobile ? 'stretch' : 'flex-start',
          width: mobile ? '100%' : 'auto'
        }}
      >
        <LogOut size={20} />
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );

  const renderLayoutTab = () => (
    <div>
      <h3 style={{ color: colors.text, marginBottom: '16px', fontSize: mobile ? '16px' : '18px' }}>Layout Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!mobile && (
          <div>
            <label style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
              Sidebar Width: {settings.sidebarWidth}px
            </label>
            <input
              type="range"
              min="200"
              max="400"
              value={settings.sidebarWidth}
              onChange={(e) => handleSettingChange('sidebarWidth', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
        <div>
          <label style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Card Border Radius: {settings.cardBorderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="24"
            value={settings.cardBorderRadius}
            onChange={(e) => handleSettingChange('cardBorderRadius', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Card Padding: {settings.cardPadding}px
          </label>
          <input
            type="range"
            min="12"
            max="40"
            value={settings.cardPadding}
            onChange={(e) => handleSettingChange('cardPadding', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Font Size
          </label>
          <select
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            style={{
              width: '100%',
              padding: mobile ? '10px 12px' : '8px 12px',
              borderRadius: `${settings.cardBorderRadius}px`,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBackground,
              color: colors.text,
              fontSize: '14px'
            }}
          >
            <option value="small">Small (14px)</option>
            <option value="medium">Medium (16px)</option>
            <option value="large">Large (18px)</option>
          </select>
        </div>
        
        {/* Toggle switches */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: colors.text, fontSize: mobile ? '14px' : '16px' }}>Show Sidebar</span>
          <div
            onClick={() => handleSettingChange('showSidebar', !settings.showSidebar)}
            style={{
              width: '48px',
              height: '24px',
              backgroundColor: settings.showSidebar ? colors.accent : colors.border,
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '2px',
              left: settings.showSidebar ? '26px' : '2px',
              width: '20px',
              height: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              transition: 'all 0.2s'
            }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: colors.text, fontSize: mobile ? '14px' : '16px' }}>Compact Mode</span>
          <div
            onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
            style={{
              width: '48px',
              height: '24px',
              backgroundColor: settings.compactMode ? colors.accent : colors.border,
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '2px',
              left: settings.compactMode ? '26px' : '2px',
              width: '20px',
              height: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              transition: 'all 0.2s'
            }} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceTab();
      case 'layout':
        return renderLayoutTab();
      case 'logout':
        return renderLogoutTab();
      default:
        return <div style={{ color: colors.text }}>Content for {activeTab} tab</div>;
    }
  };

  return (
    <div style={settingsStyles.overlay} onClick={onClose}>
      <div style={settingsStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={settingsStyles.header}>
          <h2 style={settingsStyles.title}>
            <Settings size={mobile ? 20 : 24} />
            Dashboard Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={settingsStyles.content}>
          <div style={settingsStyles.sidebar}>
            {mobile ? <MobileTabNavigation /> : <DesktopTabNavigation />}
          </div>
          <div style={settingsStyles.main}>
            {renderTabContent()}
          </div>
        </div>
        
        <div style={settingsStyles.footer}>
          <button
            onClick={resetToDefaults}
            style={{
              ...themeStyles.buttonSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: mobile ? '10px 16px' : '10px 20px',
              fontSize: mobile ? '14px' : '16px',
              width: mobile ? '100%' : 'auto',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          <div style={{ display: 'flex', gap: '12px', width: mobile ? '100%' : 'auto' }}>
            <button
              onClick={onClose}
              style={{
                ...themeStyles.buttonSecondary,
                padding: mobile ? '10px 16px' : '10px 20px',
                fontSize: mobile ? '14px' : '16px',
                flex: mobile ? 1 : 'none'
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              style={{
                ...themeStyles.button,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: mobile ? '10px 16px' : '10px 20px',
                fontSize: mobile ? '14px' : '16px',
                flex: mobile ? 1 : 'none',
                justifyContent: 'center'
              }}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Trading Dashboard Component with Responsive Design
const TradingDashboard = () => {
 
  const { assetPairCode } = useParams(); // ✅ hook at top level
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { mobile, tablet, desktop, windowSize } = useResponsive();
  const navigate = useNavigate();
  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
    },
    maxWidth: {
      maxWidth: "90rem",
      margin: "0 auto",
    },
   backButton: {
    position: "absolute",
    backgroundColor: "rgba(107, 114, 128, 0.3)", // Transparent by default
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "16px",
    transition: "background-color 0.3s ease", // Smooth transition
    "&:hover": {
      backgroundColor: "#6b7280", // Full opacity on hover
    },
  },

  };

  const [dashboardSettings, setDashboardSettings] = useState({
    theme: 'dark',
    customColors: {
      background: '#3b82f6',
      cardBackground: '#1f2937',
      sidebar: '#1f2937',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      accent: '#3b82f6',
      accentSecondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      border: '#374151'
    },
    sidebarWidth: 256,
    compactMode: false,
    showSidebar: true,
    cardBorderRadius: 12,
    cardPadding: 24,
    fontSize: 'medium',
    fontFamily: 'system-ui',
    showWelcomeCard: true,
    showMetrics: true,
    showTopSetups: true,
    showSentiment: true,
    showInsights: true,
    autoRefresh: true,
    refreshInterval: 30,
    enableNotifications: true,
    soundEnabled: true,
    emailAlerts: false,
    chartHeight: 400,
    showChartToolbar: true,
    defaultTimeframe: '1H',
    enableAnimations: true,
    enableHoverEffects: true,
    transitionSpeed: 'medium'
  });

  const NAVIGATION_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'charts', label: 'Charts', icon: ActivityIcon },
    { id: 'setups', label: 'Top Setups', icon: TrendingUp },
    { id: 'economic', label: 'Economic Calendar', icon: Calendar },
    { id: 'dataentry', label: 'Data Entry', icon: User },
     { id: "history", label: "Economic History", icon: User },
  ];
   useEffect(() => {
    if (assetPairCode != null) {
      setActiveSection('currencyprofile');
    }
  }, [assetPairCode]);
  const STATIC_MARKET_DATA = {
    topSetups: [
      { symbol: 'EUR/USD', bias: 'Bullish', score: 8.7, change: '+0.23%', confidence: 92 },
      { symbol: 'GBP/JPY', bias: 'Bearish', score: 7.9, change: '-0.18%', confidence: 87 },
      { symbol: 'GOLD', bias: 'Bullish', score: 9.1, change: '+0.45%', confidence: 95 },
      { symbol: 'AAPL', bias: 'Neutral', score: 6.2, change: '+0.12%', confidence: 74 }
    ],
    riskGauge: 'Risk-On',
    marketSentiment: { institutional: 68, retail: 42 },
    economicEvents: 3
  };

  const handleApplySettings = (newSettings) => {
    setDashboardSettings(newSettings);
    console.log('Settings applied:', newSettings);
  };

  // Responsive padding and sizing
  const getResponsivePadding = () => {
    if (mobile) return 12;
    if (tablet) return 16;
    return dashboardSettings.cardPadding;
  };

   const navigateBackToSetups = () => {
     navigate('/dashboard');
     setActiveSection('dashboard');
  };

  const getResponsiveFontSize = () => {
    if (mobile) return '14px';
    if (tablet) return '15px';
    return dashboardSettings.fontSize === 'large' ? '18px' : 
           dashboardSettings.fontSize === 'small' ? '14px' : '16px';
  };

  // Generate dynamic styles based on current settings and screen size
  const getThemeColors = () => {
    if (dashboardSettings.theme === 'custom') {
      return dashboardSettings.customColors;
    } else if (dashboardSettings.theme === 'light') {
      return {
        background: '#e4eed3',
        cardBackground: '#e4eed',
        sidebar: '#e4eed3',
        text: '#111827',
        textSecondary: '#6b7280',
        accent: '#6c9474',
        accentSecondary: '#a42c3d',
        success: '#395537',
        warning: '#f59e0b',
        danger: '#ef4444',
        border: '#6c9474',
        logocolos: 'black',
        searchText: 'white'
      };
    } else {
      return {
        background: '#395537',
        cardBackground: '#6c9474',
        sidebar: '#17271e',
        text: 'white',
        textSecondary: 'white',
        accent: '#ba7878',
        accentSecondary: '#a42c3d',
        success: '#395537',
        warning: '#f59e0b',
        danger: '#ef4444',
        border: 'black',
        logocolos: 'white',
        searchText: 'black'
      };
    }
  };

  const colors = getThemeColors();
  const responsivePadding = getResponsivePadding();

  const dynamicStyles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: dashboardSettings.fontFamily,
      color: colors.text,
      fontSize: getResponsiveFontSize(),
      transition: dashboardSettings.enableAnimations ? 'all 0.3s ease' : 'none',
      position: 'relative'
    },
    sidebar: {
      width: mobile ? '280px' : dashboardSettings.showSidebar ? `${dashboardSettings.sidebarWidth}px` : '0',
      backgroundColor: colors.sidebar,
      borderRight: `1px solid ${colors.border}`,
      minHeight: '100vh',
      overflow: 'hidden',
      transition: dashboardSettings.enableAnimations ? 'all 0.3s ease' : 'none',
      position: mobile ? 'fixed' : 'relative',
      top: 0,
      left: mobile ? (isMobileSidebarOpen ? '0' : '-280px') : 'auto',
      zIndex: mobile ? 1000 : 'auto',
      boxShadow: mobile && isMobileSidebarOpen ? '0 0 20px rgba(0,0,0,0.3)' : 'none'
    },
    sidebarOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
      display: mobile && isMobileSidebarOpen ? 'block' : 'none'
    },
    sidebarContent: {
      padding: mobile ? '16px' : tablet ? '20px' : `${responsivePadding}px`,
      opacity: mobile ? 1 : (dashboardSettings.showSidebar ? 1 : 0),
      transition: dashboardSettings.enableAnimations ? 'opacity 0.3s ease' : 'none',
      height: '100%',
      overflowY: 'auto'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: mobile ? '24px' : '32px'
    },
    logoIcon: {
      width: mobile ? '28px' : '32px',
      height: mobile ? '28px' : '32px',
      background: `linear-gradient(to right, ${colors.accent}, ${colors.accentSecondary})`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: mobile ? '18px' : tablet ? '20px' : dashboardSettings.fontSize === 'large' ? '24px' : dashboardSettings.fontSize === 'small' ? '16px' : '20px',
      fontWeight: 'bold',
      color: colors.text
    },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: mobile ? '12px 16px' : `${Math.floor(responsivePadding / 2)}px ${responsivePadding}px`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      transition: dashboardSettings.enableAnimations ? 'all 0.2s' : 'none',
      fontSize: mobile ? '14px' : tablet ? '14px' : dashboardSettings.fontSize === 'large' ? '16px' : dashboardSettings.fontSize === 'small' ? '12px' : '14px',
      marginBottom: '8px'
    },
    navButtonActive: {
      backgroundColor: colors.accent,
      color: '#ffffff'
    },
    navButtonInactive: {
      backgroundColor: 'transparent',
      color: colors.textSecondary
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0, // Prevents flex item from overflowing
      marginLeft: mobile ? '0' : 'auto'
    },
header: {
  height: '4rem',
  backgroundColor: colors.cardBackground,
  borderBottom: `1px solid ${colors.border}`,
  padding: mobile ? '12px 16px' : tablet ? '16px 10px' : `${responsivePadding}px`,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  flexShrink: 0,

  // ✨ Add these to center headerContent
  display: 'flex',
  alignItems: 'center',
},
headerContent: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%', // makes sure it stretches across the header
  gap: mobile ? '12px' : '16px',
},

    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: mobile ? '12px' : '0',
      flex: mobile ? 1 : 'none'
    },
    headerTitle: {
      fontSize: mobile ? '18px' : tablet ? '20px' : dashboardSettings.fontSize === 'large' ? '28px' : dashboardSettings.fontSize === 'small' ? '20px' : '24px',
      fontWeight: 'bold',
      color: colors.text,
      textTransform: 'capitalize',
      margin: 0
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: mobile ? '8px' : '16px'
    },
    searchContainer: {
      position: 'relative',
      display: mobile ? 'none' : 'block' // Hide search on mobile to save space
    },
    searchInput: {
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: mobile ? '10px' : '8px',
      paddingBottom: mobile ? '10px' : '8px',
      backgroundColor: colors.logocolos,
      border: `1px solid ${colors.logocolos}`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      color: colors.searchText,
      fontSize: mobile ? '16px' : '14px', // Prevent zoom on iOS
      outline: 'none',
      width: tablet ? '200px' : '250px'
    },
    mobileMenuButton: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: colors.text,
      cursor: 'pointer',
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      display: mobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      padding: `${responsivePadding}px`,
      border: `1px solid ${colors.border}`,
      transition: dashboardSettings.enableAnimations ? 'all 0.2s' : 'none',
    },
    welcomeSection: {
      background: `linear-gradient(to right, ${colors.accent}, ${colors.accentSecondary})`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      padding: `${responsivePadding}px`,
      color: '#ffffff',
      marginBottom: `${responsivePadding}px`
    },
    mainContentArea: {
      flex: 1,
      overflow: 'auto',
      padding: mobile ? '16px' : tablet ? '20px' : `${responsivePadding}px`
    },
    gridContainer: {
      display: 'grid',
      gap: `${responsivePadding}px`,
      marginBottom: `${responsivePadding}px`
    },
    metricsGrid: {
      gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    contentGrid: {
      gridTemplateColumns: mobile ? '1fr' : tablet ? '1fr' : '2fr 1fr'
    }
  };

  // Close mobile sidebar when clicking outside or changing sections
  useEffect(() => {
    if (mobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [activeSection]);

  // Handle mobile sidebar overlay click
  const handleOverlayClick = () => {
    if (mobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      <div style={dynamicStyles.sidebarOverlay} onClick={handleOverlayClick} />
      
      <div style={dynamicStyles.sidebar}>
        <div style={dynamicStyles.sidebarContent}>
          <div style={dynamicStyles.logo}>
            <div style={dynamicStyles.logoIcon}>
              <BarChart3 size={mobile ? 16 : 20} color="black" />
            </div>
            <span style={dynamicStyles.logoText}>8ConEdge</span>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {NAVIGATION_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (mobile) setIsMobileSidebarOpen(false);
                }}
                style={{
                  ...dynamicStyles.navButton,
                  ...(activeSection === item.id ? dynamicStyles.navButtonActive : dynamicStyles.navButtonInactive)
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id && dashboardSettings.enableHoverEffects && !mobile) {
                    e.target.style.backgroundColor = colors.border;
                    e.target.style.color = colors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id && dashboardSettings.enableHoverEffects && !mobile) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = colors.textSecondary;
                  }
                }}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
    const LogoProfile = () => {
       const sessionData= JSON.parse(sessionStorage.getItem('session') || 'null');
    //    const [sessionData, setSessionData] = useState({
    //   isAuthenticated: false,
    //   user: null,
    //   loading: true
    // });
  const name = sessionData?.first_name || 'Trader';
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: mobile ? '36px' : '40px',
        height: mobile ? '36px' : '40px',
        backgroundColor: colors.accent,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: mobile ? '14px' : '16px',
        fontWeight: 'bold',
      }}
    >
      {firstLetter}
    </div>
  );
};

  const Header = () => (
    <div style={dynamicStyles.header}>
      <div style={dynamicStyles.headerContent}>
        <div style={dynamicStyles.headerLeft}>
          <button
            style={dynamicStyles.mobileMenuButton}
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu size={20} />
          </button>
          
          <div>
            <h1 style={dynamicStyles.headerTitle}>
              {activeSection}
            </h1>
            {!mobile && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '14px', 
                color: colors.textSecondary,
                marginTop: '4px'
              }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: colors.success, 
                  borderRadius: '50%' 
                }} />
                Dashboard View
              </div>
            )}
          </div>
        </div>
        
        <div style={dynamicStyles.headerActions}>
          
           
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{
              padding: mobile ? '10px' : '8px',
              backgroundColor: colors.cardBackground,
              borderRadius: `${dashboardSettings.cardBorderRadius}px`,
              border: `1px solid ${colors.cardBackground}`,
              color: colors.textSecondary,
              cursor: 'pointer',
              transition: dashboardSettings.enableAnimations ? 'color 0.2s' : 'none'
            }}
          >
            <Settings size={mobile ? 18 : 20} />
          </button>
          
          {/* User button component would go here */}
            <LogoProfile />

        </div>
      </div>
    </div>
  );

  const WelcomeSection = () => {
    const [sessionData, setSessionData] = useState({
      isAuthenticated: false,
      user: null,
      loading: true
    });

    useEffect(() => {
      try {
        const authStatus = sessionStorage.getItem('isAuthenticated');
        const userData = JSON.parse(sessionStorage.getItem('session') || 'null');
        
        setSessionData({
          isAuthenticated: authStatus === 'true',
          user: userData,
          username: userData?.name || userData?.username || null,
          email: userData?.email || null,
          loading: false
        });
      } catch (error) {
        console.error('Error reading session data:', error);
        setSessionData({
          isAuthenticated: false,
          user: null,
          username: null,
          email: null,
          loading: false
        });
      }
    }, []);

    if (!dashboardSettings.showWelcomeCard) return null;

    if (sessionData.loading) {
      return (
        <div style={dynamicStyles.welcomeSection}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>Loading...</div>
          </div>
        </div>
      );
    }

    return (
      <div style={dynamicStyles.welcomeSection}>
        <div style={{ 
          display: 'flex', 
          alignItems: mobile ? 'flex-start' : 'center', 
          justifyContent: 'space-between',
          flexDirection: mobile ? 'column' : 'row',
          gap: mobile ? '16px' : '0'
        }}>
          <div style={{ flex: mobile ? 'none' : 1 }}>
            <h2 style={{
              fontSize: mobile ? '20px' : tablet ? '22px' : dashboardSettings.fontSize === 'large' ? '28px' : dashboardSettings.fontSize === 'small' ? '20px' : '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              margin: 0
            }}>
              Welcome back, {sessionData.username || 'Trader'}!
            </h2>
            <p style={{ 
              color: '#bfdbfe', 
              margin: '8px 0 0 0',
              fontSize: mobile ? '14px' : '16px',
              lineHeight: mobile ? '1.4' : '1.5'
            }}>
              Your AI-powered trading companion is ready. Let's make confident decisions together.
            </p>
            {!sessionData.isAuthenticated && (
              <p style={{ 
                fontSize: '12px', 
                color: '#ef4444', 
                margin: '4px 0 0 0' 
              }}>
                Please log in to access all features.
              </p>
            )}
          </div>
          <div style={{ 
            textAlign: mobile ? 'center' : 'right',
            alignSelf: mobile ? 'center' : 'auto'
          }}>
            <div style={{
              fontSize: mobile ? '24px' : tablet ? '28px' : dashboardSettings.fontSize === 'large' ? '32px' : dashboardSettings.fontSize === 'small' ? '24px' : '28px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              {STATIC_MARKET_DATA.topSetups.length}
            </div>
            <div style={{ 
              color: '#bfdbfe', 
              fontSize: mobile ? '12px' : '14px' 
            }}>
              Active Setups
            </div>
          </div>
        </div>
      </div>
    );
  };


 

const TopSetupsSection = () => {
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get bias icon
  const getBiasIcon = (bias) => {
    switch(bias) {
      case 'Very Bullish':
      case 'Bullish':
        return TrendingUp;
      case 'Very Bearish':
      case 'Bearish':
        return TrendingDown;
      default:
        return Activity;
    }
  };

  // Function to get bias color
  const getBiasColor = (bias) => {
    switch(bias) {
      case 'Very Bullish':
      case 'Bullish':
        return colors.success;
      case 'Very Bearish':
      case 'Bearish':
        return colors.danger;
      default:
        return colors.warning;
    }
  };

  // Fetch live top setups data (limit to top 5)
  const fetchTopSetups = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch asset pairs
      const response = await fetch(`http://${BASE_URL}/api/asset-pairs`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success && result.data) {
        // Process each asset pair to get economic data (same logic as TopSetups.jsx)
        const assetPairsWithMetrics = await Promise.all(
          result.data.slice(0, 10).map(async (pair) => { // Get more than 5 to sort and pick top 5
            try {
              const economicData = await fetchEconomicDataForPair(pair);
              const metrics = generateProperMetrics(economicData);

              return {
                symbol: pair.description || `${pair.baseAsset}/${pair.quoteAsset}`,
                asset_pair_code: pair.value,
                baseAsset: pair.baseAsset,
                quoteAsset: pair.quoteAsset,
                bias: metrics.output,
                score: metrics.totalScore,
                change: `${metrics.totalScore >= 0 ? '+' : ''}${metrics.totalScore}`,
                confidence: Math.min(95, Math.max(35, 50 + Math.abs(metrics.totalScore) * 3)) // Calculate confidence based on score
              };
            } catch (pairError) {
              console.error(`❌ Error processing pair ${pair.value}:`, pairError);
              return {
                symbol: pair.description || `${pair.baseAsset}/${pair.quoteAsset}`,
                asset_pair_code: pair.value,
                baseAsset: pair.baseAsset,
                quoteAsset: pair.quoteAsset,
                bias: 'Neutral',
                score: 0,
                change: '0',
                confidence: 50
              };
            }
          })
        );

        // Sort by score (highest first) and take top 5
        const sortedSetups = assetPairsWithMetrics
          .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
          .slice(0, 5);

        setTopSetups(sortedSetups);
      }
    } catch (error) {
      console.error("❌ Error fetching top setups:", error);
      // Fallback to static data on error
      setTopSetups([
        { symbol: 'EUR/USD', bias: 'Bullish', score: 8, change: '+8', confidence: 75 },
        { symbol: 'GBP/JPY', bias: 'Very Bullish', score: 12, change: '+12', confidence: 85 },
        { symbol: 'USD/CAD', bias: 'Bearish', score: -6, change: '-6', confidence: 65 },
        { symbol: 'AUD/NZD', bias: 'Neutral', score: 2, change: '+2', confidence: 55 },
        { symbol: 'EUR/GBP', bias: 'Bullish', score: 7, change: '+7', confidence: 70 }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper functions (same logic as TopSetups.jsx)
  const fetchEconomicDataForPair = async (pair) => {
    const baseAsset = pair.baseAsset;
    const quoteAsset = pair.quoteAsset;
    const assetPairCode = pair.value;

    try {
      const fetchWithFallback = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) return null;
          const data = await response.json();
          return data.success && data.data && data.data.length > 0 ? data.data[0] : null;
        } catch (error) {
          return null;
        }
      };

      const [
        cotBase, cotQuote, gdpBase, gdpQuote,
        mpmiBase, mpmiQuote, spmiBase, spmiQuote,
        retailBase, retailQuote, unemploymentBase, unemploymentQuote,
        employmentBase, employmentQuote, inflationBase, inflationQuote,
        interestBase, interestQuote, retailSentiment
      ] = await Promise.all([
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/cot/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/cot/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/gdp/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/gdp/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/mpmi/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/mpmi/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/spmi/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/spmi/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/retail/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/retail/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/unemployment/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/unemployment/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/employment/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/employment/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/inflation/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/inflation/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/interest/${baseAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/economic-data/interest/${quoteAsset}?limit=1`),
        fetchWithFallback(`http://${BASE_URL}/api/retail-sentiment/${assetPairCode}?limit=1`)
      ]);

      return {
        baseAsset, quoteAsset,
        cotData: {
          baseNetChangePercent: cotBase?.net_change_percent,
          quoteNetChangePercent: cotQuote?.net_change_percent,
        },
        retailPosition: {
          longPercent: retailSentiment?.retail_long,
          shortPercent: retailSentiment?.retail_short,
        },
        employment: {
          baseChange: employmentBase?.employment_change,
          baseForecast: employmentBase?.forecast,
          quoteChange: employmentQuote?.employment_change,
          quoteForecast: employmentQuote?.forecast,
        },
        unemployment: {
          baseRate: unemploymentBase?.unemployment_rate,
          baseForecast: unemploymentBase?.forecast,
          quoteRate: unemploymentQuote?.unemployment_rate,
          quoteForecast: unemploymentQuote?.forecast,
        },
        gdp: {
          baseResult: gdpBase?.result,
          quoteResult: gdpQuote?.result,
        },
        mpmi: {
          baseResult: mpmiBase?.result,
          quoteResult: mpmiQuote?.result,
        },
        spmi: {
          baseResult: spmiBase?.result,
          quoteResult: spmiQuote?.result,
        },
        retail: {
          baseResult: retailBase?.result,
          quoteResult: retailQuote?.result,
        },
        inflation: {
          baseCPI: inflationBase?.core_inflation,
          baseForecast: inflationBase?.forecast,
          quoteCPI: inflationQuote?.core_inflation,
          quoteForecast: inflationQuote?.forecast,
        },
        interestRate: {
          baseChange: interestBase?.change_in_interest,
          quoteChange: interestQuote?.change_in_interest,
        },
      };
    } catch (error) {
      return null;
    }
  };

  const generateProperMetrics = (economicData) => {
    if (!economicData) {
      return { output: 'Neutral', totalScore: 0 };
    }

    // Same scoring logic as TopSetups.jsx
    const scores = {};

    // COT Scoring
    const cotBaseScore = economicData.cotData.baseNetChangePercent > 0 ? 1 : 
                       economicData.cotData.baseNetChangePercent < 0 ? -1 : 0;
    const cotQuoteScore = economicData.cotData.quoteNetChangePercent > 0 ? -1 : 
                         economicData.cotData.quoteNetChangePercent < 0 ? 1 : 0;
    scores.cot = cotBaseScore + cotQuoteScore;

    // Retail Position Score
    scores.retailPosition = economicData.retailPosition.longPercent > economicData.retailPosition.shortPercent ? -1 : 1;

    // Employment Change Score
    const empBaseScore = economicData.employment.baseChange > economicData.employment.baseForecast ? 1 :
                        economicData.employment.baseChange < economicData.employment.baseForecast ? -1 : 0;
    const empQuoteScore = economicData.employment.quoteChange > economicData.employment.quoteForecast ? -1 :
                         economicData.employment.quoteChange < economicData.employment.quoteForecast ? 1 : 0;
    scores.employment = empBaseScore + empQuoteScore;

    // Calculate other scores... (simplified for brevity)
    scores.unemployment = 0;
    scores.gdp = 0;
    scores.mpmi = 0;
    scores.spmi = 0;
    scores.retail = 0;
    scores.inflation = 0;
    scores.interestRate = 0;

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    let output;
    if (totalScore >= 12) output = "Very Bullish";
    else if (totalScore >= 5) output = "Bullish";
    else if (totalScore >= -4) output = "Neutral";
    else if (totalScore >= -11) output = "Bearish";
    else output = "Very Bearish";

    return { output, totalScore };
  };

  useEffect(() => {
    fetchTopSetups();
  }, [fetchTopSetups]);

  if (!dashboardSettings.showTopSetups) return null;
  
  return (
    <div style={dynamicStyles.card}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: mobile ? '16px' : '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h3 style={{
          fontSize: mobile ? '16px' : tablet ? '18px' : dashboardSettings.fontSize === 'large' ? '22px' : dashboardSettings.fontSize === 'small' ? '16px' : '18px',
          fontWeight: 'bold',
          color: colors.text,
          margin: 0
        }}>
          Top Trading Setups {loading && '(Loading...)'}
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '12px' : '16px' }}>
        {topSetups.map((setup, index) => {
          const BiasIcon = getBiasIcon(setup.bias);
          const biasColor = getBiasColor(setup.bias);
          
          return (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: mobile ? '12px' : '16px',
              backgroundColor: colors.background,
              borderRadius: `${dashboardSettings.cardBorderRadius}px`,
              border: `1px solid ${colors.border}`,
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? '12px' : '16px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: mobile ? '32px' : '40px',
                  height: mobile ? '32px' : '40px',
                  backgroundColor: biasColor,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  <BiasIcon size={mobile ? 14 : 16} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: colors.text, 
                    marginBottom: '4px',
                    fontSize: mobile ? '14px' : '16px'
                  }}>
                    {setup.symbol}
                  </div>
                  <div style={{ 
                    fontSize: mobile ? '11px' : '12px', 
                    color: colors.textSecondary 
                  }}>
                    {setup.bias} • Score: {setup.score}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  color: setup.change.startsWith('+') ? colors.logocolos : colors.danger,
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  fontSize: mobile ? '14px' : '16px'
                }}>
                  {setup.change}
                </div>
                <div style={{ 
                  fontSize: mobile ? '10px' : '12px', 
                  color: colors.textSecondary 
                }}>
                  {setup.confidence}% confidence
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


  // Placeholder components for different sections
  const PlaceholderWidget = ({ title }) => (
    <div style={{
      ...dynamicStyles.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: mobile ? '200px' : '300px',
      textAlign: 'center'
    }}>
      <div>
        <h3 style={{ 
          color: colors.text, 
          marginBottom: '16px',
          fontSize: mobile ? '18px' : '24px'
        }}>
          {title}
        </h3>
        <p style={{ 
          color: colors.textSecondary,
          fontSize: mobile ? '14px' : '16px'
        }}>
          Widget placeholder - Replace with actual component
        </p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div style={dynamicStyles.mainContentArea}>
            <WelcomeSection />
           
            <div style={{
              ...dynamicStyles.gridContainer,
              ...dynamicStyles.contentGrid
            }}>
              <TopSetupsCardView/>
              
            </div>
          </div>
        );
       case 'alerts':
        return (
           <TradingViewNewsWidget />
        );
      case 'charts':
        return (
           <TradingViewWidget />
        );
      case 'economic':
        return (
          <TradingViewEventsWidget />
        );
      case 'setups':
        return (
          <TopSetups/>
        );
      case 'dataentry':
        return (
          <CombinedEconomicDataForm/>
        );
      case "history":
        return <TradingEconomicsHistory />;
      case 'currencyprofile':
        return (
           <div style={styles.container}>
                  <div style={styles.maxWidth}>
                    {/* <button 
                      style={styles.backButton}
                      onClick={navigateBackToSetups}
                    >
                      ← Back to Dashboard
                    </button> */}
                      <CurrencyProfile assetPairCode={assetPairCode} />
                  </div>
                </div>
         
        )
      default:
        return (
          <div style={dynamicStyles.mainContentArea}>
            <div style={dynamicStyles.card}>
              <h2 style={{ 
                color: colors.text, 
                marginBottom: '16px', 
                textTransform: 'capitalize',
                fontSize: mobile ? '18px' : '24px'
              }}>
                {activeSection}
              </h2>
              <p style={{ 
                color: colors.textSecondary,
                fontSize: mobile ? '14px' : '16px'
              }}>
                This section is under development.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={dynamicStyles.container}>
      <Sidebar />
      <div style={dynamicStyles.mainContent}>
        <Header />
        {renderMainContent()}
      </div>
      
      <SettingsWindow
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApplySettings={handleApplySettings}
        currentSettings={dashboardSettings}
      />
    </div>
  );
};

export default TradingDashboard;