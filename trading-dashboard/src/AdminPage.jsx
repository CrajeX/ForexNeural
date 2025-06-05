import React, { useState, useRef, useEffect } from 'react';
import { 
  FilePenLine, FileSpreadsheetIcon, Settings, Maximize2, ZoomIn, ZoomOut, 
  Move, Clock, TrendingUp, TrendingDown, BarChart3, ActivityIcon, Activity, 
  Shield, Globe, Calendar, Bell, User, Search, Star, Eye, Target,
  X, Palette, Monitor, Sun, Moon, Save, RotateCcw, Layout, Volume2, Sliders
} from 'lucide-react';
import TradingViewWidget from './components/DukascopyChart'
import TradingViewNewsWidget from './components/DukascopyNewsWidget'; 
import TradingViewEventsWidget from './components/EconomicCalendar';
import UserButtonWithPopup from './components/UserIcon'
import GDPDashboard from './components/GPD';
// Settings Window Component
const SettingsWindow = ({ isOpen, onClose, onApplySettings, currentSettings }) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState(currentSettings);

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
    onApplySettings(settings);
    onClose();
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      theme: 'dark',
      customColors: {
        background: '#111827',
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
    };
    setSettings(defaultSettings);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    // { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'performance', label: 'Performance', icon: Sliders }
  ];

  const themeOptions = [
    { id: 'dark', label: 'Dark Mode', icon: Moon, preview: '#111827' },
    { id: 'light', label: 'Light Mode', icon: Sun, preview: '#ffffff' },
    { id: 'custom', label: 'Custom Theme', icon: Palette, preview: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }
  ];

  if (!isOpen) return null;

  const getThemeColors = () => {
    if (settings.theme === 'custom') {
      return settings.customColors;
    } else if (settings.theme === 'light') {
      return {
        background: '#ffffff',
        cardBackground: '#f9fafb',
        sidebar: '#f9fafb',
        text: '#111827',
        textSecondary: '#6b7280',
        accent: '#3b82f6',
        border: 'black'
      };
    } else {
      return {
        background: '#111827',
        cardBackground: '#1f2937',
        sidebar: '#1f2937',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        accent: '#3b82f6',
        border: 'black'
      };
    }
  };

  const colors = getThemeColors();

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
      backdropFilter: 'blur(4px)'
    },
    modal: {
      backgroundColor: colors.cardBackground,
      borderRadius: `${settings.cardBorderRadius}px`,
      width: '90vw',
      maxWidth: '900px',
      height: '80vh',
      maxHeight: '700px',
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${settings.cardPadding}px`,
      borderBottom: `1px solid ${colors.border}`
    },
    title: {
      fontSize: settings.fontSize === 'large' ? '28px' : settings.fontSize === 'small' ? '20px' : '24px',
      fontWeight: 'bold',
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    content: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden'
    },
    sidebar: {
      width: settings.showSidebar ? '200px' : '0',
      backgroundColor: colors.sidebar,
      borderRight: `1px solid ${colors.border}`,
      padding: settings.showSidebar ? '16px' : '0',
      overflow: 'hidden'
    },
    main: {
      flex: 1,
      padding: `${settings.cardPadding}px`,
      overflow: 'auto',
      fontSize: settings.fontSize === 'large' ? '18px' : settings.fontSize === 'small' ? '14px' : '16px'
    }
  };

  const renderAppearanceTab = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: colors.text, marginBottom: '16px' }}>Theme Selection</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {themeOptions.map(theme => (
            <div
              key={theme.id}
              onClick={() => handleSettingChange('theme', theme.id)}
              style={{
                padding: '16px',
                borderRadius: `${settings.cardBorderRadius}px`,
                border: `2px solid ${settings.theme === theme.id ? colors.accent : colors.border}`,
                backgroundColor: settings.theme === theme.id ? `${colors.accent}20` : colors.cardBackground,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <theme.icon size={20} style={{ color: colors.text }} />
                <span style={{ color: colors.text, fontWeight: '500' }}>{theme.label}</span>
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

      {settings.theme === 'custom' && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: colors.text, marginBottom: '16px' }}>Custom Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {Object.entries(settings.customColors).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key, e.target.value)}
                    style={{
                      width: '60px',
                      height: '40px',
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
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.cardBackground,
                      color: colors.text,
                      fontSize: '14px'
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceTab();
      case 'layout':
        return (
          <div>
            <h3 style={{ color: colors.text, marginBottom: '16px' }}>Layout Options</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: colors.text }}>Show Sidebar</span>
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
            </div>
          </div>
        );
      default:
        return <div style={{ color: colors.text }}>Content for {activeTab} tab</div>;
    }
  };

  return (
    <div style={settingsStyles.overlay} onClick={onClose}>
      <div style={settingsStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={settingsStyles.header}>
          <h2 style={settingsStyles.title}>
            <Settings size={24} />
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
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={settingsStyles.content}>
          <div style={settingsStyles.sidebar}>
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
                  transition: 'all 0.2s',
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
          </div>

          <div style={settingsStyles.main}>
            {renderTabContent()}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${settings.cardPadding}px`,
          borderTop: `1px solid ${colors.border}`
        }}>
          <button
            onClick={resetToDefaults}
            style={{
              padding: '10px 20px',
              borderRadius: `${settings.cardBorderRadius}px`,
              border: `1px solid ${colors.border}`,
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: `${settings.cardBorderRadius}px`,
                border: `1px solid ${colors.border}`,
                backgroundColor: 'transparent',
                color: colors.textSecondary,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              style={{
                padding: '10px 20px',
                borderRadius: `${settings.cardBorderRadius}px`,
                border: 'none',
                backgroundColor: colors.accent,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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

// Main Trading Dashboard Component
const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState({
    theme: 'dark',
    customColors: {
      background: '#111827',
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
    { id: 'sentiment', label: 'Market Sentiment', icon: Activity },
    { id: 'risk', label: 'Risk Management', icon: Shield },
    { id: 'economic', label: 'Economic Calendar', icon: Calendar },
    { id: 'dataentry', label: 'Data Entry', icon: Monitor },
  ];

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

  // Generate dynamic styles based on current settings
  const getThemeColors = () => {
    if (dashboardSettings.theme === 'custom') {
      return dashboardSettings.customColors;
    } else if (dashboardSettings.theme === 'light') {
      return {
        // LIGHT MODE
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
        logocolos:'black',
        searchText:'white'
      };
    } else {
      // DARK MODE
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
        border: '#ba7878',
        logocolos:'white',
        searchText:'black'
      };
    }
  };

  const colors = getThemeColors();

  const dynamicStyles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: dashboardSettings.fontFamily,
      color: colors.text,
      fontSize: dashboardSettings.fontSize === 'large' ? '18px' : dashboardSettings.fontSize === 'small' ? '14px' : '16px',
      transition: dashboardSettings.enableAnimations ? 'all 0.3s ease' : 'none'
    },
    sidebar: {
      width: dashboardSettings.showSidebar ? `${dashboardSettings.sidebarWidth}px` : '0',
      backgroundColor: colors.sidebar,
      borderRight: `1px solid ${colors.border}`,
      minHeight: '100vh',
      overflow: 'hidden',
      transition: dashboardSettings.enableAnimations ? 'width 0.3s ease' : 'none'
    },
    sidebarContent: {
      padding: dashboardSettings.showSidebar ? `${dashboardSettings.cardPadding}px` : '0',
      opacity: dashboardSettings.showSidebar ? 1 : 0,
      transition: dashboardSettings.enableAnimations ? 'opacity 0.3s ease' : 'none'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: `linear-gradient(to right, ${colors.accent}, ${colors.accentSecondary})`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: dashboardSettings.fontSize === 'large' ? '24px' : dashboardSettings.fontSize === 'small' ? '16px' : '20px',
      fontWeight: 'bold',
      color: colors.text
    },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: `${Math.floor(dashboardSettings.cardPadding / 2)}px ${dashboardSettings.cardPadding}px`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      transition: dashboardSettings.enableAnimations ? 'all 0.2s' : 'none',
      fontSize: dashboardSettings.fontSize === 'large' ? '16px' : dashboardSettings.fontSize === 'small' ? '12px' : '14px',
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
      flex: 1
    },
    header: {
      backgroundColor: colors.cardBackground,
      borderBottom: `1px solid ${colors.border}`,
      padding: `${dashboardSettings.cardPadding}px`
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      padding: `${dashboardSettings.cardPadding}px`,
      border: `1px solid ${colors.border}`,
      transition: dashboardSettings.enableAnimations ? 'all 0.2s' : 'none'
    },
    welcomeSection: {
      background: `linear-gradient(to right, ${colors.accent}, ${colors.accentSecondary})`,
      borderRadius: `${dashboardSettings.cardBorderRadius}px`,
      padding: `${dashboardSettings.cardPadding}px`,
      color: '#ffffff',
      marginBottom: `${dashboardSettings.cardPadding}px`
    }
  };

  const Sidebar = () => (
    <div style={dynamicStyles.sidebar}>
      <div style={dynamicStyles.sidebarContent}>
        <div style={dynamicStyles.logo}>
          <div style={dynamicStyles.logoIcon}>
            <BarChart3 size={20} color="black" />
          </div>
          <span style={dynamicStyles.logoText}>8ConEdge</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NAVIGATION_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...dynamicStyles.navButton,
                ...(activeSection === item.id ? dynamicStyles.navButtonActive : dynamicStyles.navButtonInactive)
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id && dashboardSettings.enableHoverEffects) {
                  e.target.style.backgroundColor = colors.border;
                  e.target.style.color = colors.text;
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id && dashboardSettings.enableHoverEffects) {
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
  );

  const Header = () => (
    <div style={dynamicStyles.header}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{
            fontSize: dashboardSettings.fontSize === 'large' ? '28px' : dashboardSettings.fontSize === 'small' ? '20px' : '24px',
            fontWeight: 'bold',
            color: colors.text,
            textTransform: 'capitalize',
            margin: 0
          }}>
            {activeSection}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.textSecondary }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: colors.success, borderRadius: '50%' }} />
            Dashboard View
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                backgroundColor: colors.logocolos,
                border: `1px solid ${colors.logocolos}`,
                borderRadius: `${dashboardSettings.cardBorderRadius}px`,
                color: colors.searchText,
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{
              padding: '8px',
              backgroundColor: colors.cardBackground,
              borderRadius: `${dashboardSettings.cardBorderRadius}px`,
              border: `1px solid ${colors.cardBackground}`,
              color: colors.textSecondary,
              cursor: 'pointer',
              transition: dashboardSettings.enableAnimations ? 'color 0.2s' : 'none'
            }}
            onMouseEnter={(e) => dashboardSettings.enableHoverEffects && (e.target.style.color = colors.text)}
            onMouseLeave={(e) => dashboardSettings.enableHoverEffects && (e.target.style.color = colors.textSecondary)}
          >
            <Settings size={20} />
          </button>
         
            <UserButtonWithPopup/>
          
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
    const userData = JSON.parse(sessionStorage.getItem('user') || 'null');

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
     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
       <div>
         <h2 style={{
           fontSize: dashboardSettings.fontSize === 'large' ? '28px' : dashboardSettings.fontSize === 'small' ? '20px' : '24px',
           fontWeight: 'bold',
           marginBottom: '8px',
           margin: 0
         }}>
           Welcome back, {sessionData.username|| 'Trader'}!
         </h2>
         <p style={{ color: '#bfdbfe', margin: '8px 0 0 0' }}>
           Your AI-powered trading companion is ready. Let's make confident decisions together.
         </p>
         {!sessionData.isAuthenticated && (
           <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
             Please log in to access all features.
           </p>
         )}
       </div>
       <div style={{ textAlign: 'right' }}>
         <div style={{
           fontSize: dashboardSettings.fontSize === 'large' ? '32px' : dashboardSettings.fontSize === 'small' ? '24px' : '28px',
           fontWeight: 'bold',
           marginBottom: '4px'
         }}>
           {STATIC_MARKET_DATA.topSetups.length}
         </div>
         <div style={{ color: '#bfdbfe', fontSize: '14px' }}>
           Active Setups
         </div>
       </div>
     </div>
   </div>
 );
};

  const MetricsGrid = () => {
    if (!dashboardSettings.showMetrics) return null;
    
    const metrics = [
      { label: 'Active Positions', value: '7', change: '+2', icon: Target, color: colors.logocolos },
      { label: 'Win Rate', value: '68%', change: '+5%', icon: TrendingUp, color: colors.logocolos },
      { label: 'Risk Score', value: '4.2/10', change: '-0.3', icon: Shield, color: colors.logocolos },
      { label: 'Daily P&L', value: '+$234', change: '+12%', icon: Activity, color: colors.logocolos }
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: `${dashboardSettings.cardPadding}px`, marginBottom: `${dashboardSettings.cardPadding}px` }}>
        {metrics.map((metric, index) => (
          <div key={index} style={dynamicStyles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: `${metric.color}20`,
                borderRadius: `${dashboardSettings.cardBorderRadius}px`,
                color: metric.color
              }}>
                <metric.icon size={20} />
              </div>
              <div style={{ fontSize: '1.2rem', color: colors.logocolos, fontWeight: 'bold' }}>
                {metric.change}
              </div>
            </div>
            <div style={{
              fontSize: dashboardSettings.fontSize === 'large' ? '28px' : dashboardSettings.fontSize === 'small' ? '20px' : '24px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '4px'
            }}>
              {metric.value}
            </div>
            <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TopSetupsSection = () => {
    if (!dashboardSettings.showTopSetups) return null;
    
    return (
      <div style={dynamicStyles.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{
            fontSize: dashboardSettings.fontSize === 'large' ? '22px' : dashboardSettings.fontSize === 'small' ? '16px' : '18px',
            fontWeight: 'bold',
            color: colors.text,
            margin: 0
          }}>
            Top Trading Setups
          </h3>
          <button style={{
            padding: '6px 12px',
            backgroundColor: colors.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: `${dashboardSettings.cardBorderRadius}px`,
            fontSize: '12px',
            cursor: 'pointer'
          }}>
            View All
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STATIC_MARKET_DATA.topSetups.map((setup, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: colors.background,
              borderRadius: `${dashboardSettings.cardBorderRadius}px`,
              border: `1px solid ${colors.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: setup.bias === 'Bullish' ? colors.success : setup.bias === 'Bearish' ? colors.danger : colors.warning,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  {setup.bias === 'Bullish' ? <TrendingUp size={16} /> : setup.bias === 'Bearish' ? <TrendingDown size={16} /> : <Activity size={16} />}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: colors.text, marginBottom: '4px' }}>
                    {setup.symbol}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                    {setup.bias} • Score: {setup.score}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: setup.change.startsWith('+') ? colors.logocolos : colors.danger,
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {setup.change}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                  {setup.confidence}% confidence
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SentimentSection = () => {
    if (!dashboardSettings.showSentiment) return null;
    
    return (
      <div style={dynamicStyles.card}>
        <h3 style={{
          fontSize: dashboardSettings.fontSize === 'large' ? '22px' : dashboardSettings.fontSize === 'small' ? '16px' : '18px',
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: '24px'
        }}>
          Market Sentiment
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Institutional</span>
              <span style={{ color: colors.text, fontWeight: 'bold' }}>{STATIC_MARKET_DATA.marketSentiment.institutional}%</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: colors.border,
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${STATIC_MARKET_DATA.marketSentiment.institutional}%`,
                backgroundColor: colors.success,
                transition: dashboardSettings.enableAnimations ? 'width 0.5s ease' : 'none'
              }} />
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Retail</span>
              <span style={{ color: colors.text, fontWeight: 'bold' }}>{STATIC_MARKET_DATA.marketSentiment.retail}%</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: colors.border,
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${STATIC_MARKET_DATA.marketSentiment.retail}%`,
                backgroundColor: colors.warning,
                transition: dashboardSettings.enableAnimations ? 'width 0.5s ease' : 'none'
              }} />
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: colors.background,
          borderRadius: `${dashboardSettings.cardBorderRadius}px`,
          textAlign: 'center'
        }}>
          <div style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
            Overall Market Bias
          </div>
          <div style={{
            fontSize: dashboardSettings.fontSize === 'large' ? '22px' : dashboardSettings.fontSize === 'small' ? '16px' : '18px',
            fontWeight: 'bold',
            color: colors.logocolos
          }}>
            {STATIC_MARKET_DATA.riskGauge}
          </div>
        </div>
      </div>
    );
  };
   <Sidebar />
//       <div style={styles.mainContent}>
//         <Header />
//         <main style={styles.main}>
//        {activeSection === 'dashboard' ? <DashboardContent /> : 
//  activeSection === 'charts' ? <TradingViewWidget /> :
//   activeSection === 'alerts' ? <TradingViewNewsWidget /> : 
//   activeSection === 'economic' ? <TradingViewEventsWidget /> : 
//  <PlaceholderSection />}
  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div style={{ padding: `${dashboardSettings.cardPadding}px` }}>
            <WelcomeSection />
            <MetricsGrid />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: `${dashboardSettings.cardPadding}px` }}>
              <TopSetupsSection />
              <SentimentSection />
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
      case 'dataentry':
        return (
         <GDPDashboard/>
        ); 
      default:
        return (
          <div style={{ padding: `${dashboardSettings.cardPadding}px` }}>
            <div style={dynamicStyles.card}>
              <h2 style={{ color: colors.text, marginBottom: '16px', textTransform: 'capitalize' }}>
                {activeSection}
              </h2>
              <p style={{ color: colors.textSecondary }}>
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

export default AdminPage;