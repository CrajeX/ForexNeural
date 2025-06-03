import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Settings, 
  Save, 
  RotateCcw,
  Eye,
  Layout,
  Bell,
  Volume2,
  Globe,
  User,
  Shield,
  Sliders
} from 'lucide-react';

const SettingsWindow = ({ isOpen, onClose, onApplySettings }) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    // Theme Settings
    theme: 'dark', // 'dark', 'light', 'custom'
    
    // Custom Theme Colors (when theme is 'custom')
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
    
    // Layout Settings
    sidebarWidth: 256,
    compactMode: false,
    showSidebar: true,
    cardBorderRadius: 12,
    cardPadding: 24,
    
    // Typography
    fontSize: 'medium', // 'small', 'medium', 'large'
    fontFamily: 'system-ui',
    
    // Dashboard Preferences
    showWelcomeCard: true,
    showMetrics: true,
    showTopSetups: true,
    showSentiment: true,
    showInsights: true,
    autoRefresh: true,
    refreshInterval: 30, // seconds
    
    // Notifications
    enableNotifications: true,
    soundEnabled: true,
    emailAlerts: false,
    
    // Chart Settings
    chartHeight: 400,
    showChartToolbar: true,
    defaultTimeframe: '1H',
    
    // Animation & Effects
    enableAnimations: true,
    enableHoverEffects: true,
    transitionSpeed: 'medium' // 'fast', 'medium', 'slow'
  });

  // Load settings from memory on component mount (localStorage not supported)
  useEffect(() => {
    // In a real application, you would load from your preferred storage method
    // For now, we'll use the default settings
  }, []);

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
    // In a real application, you would save to your preferred storage method
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

  const fontSizeOptions = [
    { id: 'small', label: 'Small', size: '14px' },
    { id: 'medium', label: 'Medium', size: '16px' },
    { id: 'large', label: 'Large', size: '18px' }
  ];

  if (!isOpen) return null;

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
      backgroundColor: settings.theme === 'light' ? '#ffffff' : '#1f2937',
      borderRadius: '16px',
      width: '90vw',
      maxWidth: '900px',
      height: '80vh',
      maxHeight: '700px',
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${settings.theme === 'light' ? '#e5e7eb' : '#374151'}`,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px',
      borderBottom: `1px solid ${settings.theme === 'light' ? '#e5e7eb' : '#374151'}`
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: settings.theme === 'light' ? '#111827' : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    closeButton: {
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: settings.theme === 'light' ? '#6b7280' : '#9ca3af',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    content: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden'
    },
    sidebar: {
      width: '200px',
      backgroundColor: settings.theme === 'light' ? '#f9fafb' : '#111827',
      borderRight: `1px solid ${settings.theme === 'light' ? '#e5e7eb' : '#374151'}`,
      padding: '16px'
    },
    tabButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      marginBottom: '8px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      fontWeight: '500'
    },
    tabButtonActive: {
      backgroundColor: settings.theme === 'light' ? '#3b82f6' : '#2563eb',
      color: '#ffffff'
    },
    tabButtonInactive: {
      backgroundColor: 'transparent',
      color: settings.theme === 'light' ? '#6b7280' : '#9ca3af'
    },
    main: {
      flex: 1,
      padding: '24px',
      overflow: 'auto'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: settings.theme === 'light' ? '#111827' : '#ffffff',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    card: {
      padding: '16px',
      borderRadius: '8px',
      border: `1px solid ${settings.theme === 'light' ? '#e5e7eb' : '#374151'}`,
      backgroundColor: settings.theme === 'light' ? '#f9fafb' : '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    cardActive: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: settings.theme === 'light' ? '#374151' : '#d1d5db',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${settings.theme === 'light' ? '#d1d5db' : '#4b5563'}`,
      backgroundColor: settings.theme === 'light' ? '#ffffff' : '#374151',
      color: settings.theme === 'light' ? '#111827' : '#ffffff',
      fontSize: '14px'
    },
    colorInput: {
      width: '60px',
      height: '40px',
      padding: '4px',
      borderRadius: '6px',
      border: `1px solid ${settings.theme === 'light' ? '#d1d5db' : '#4b5563'}`,
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    toggle: {
      position: 'relative',
      width: '48px',
      height: '24px',
      backgroundColor: settings.theme === 'light' ? '#e5e7eb' : '#4b5563',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    toggleActive: {
      backgroundColor: '#3b82f6'
    },
    toggleKnob: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    toggleKnobActive: {
      transform: 'translateX(24px)'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px',
      borderTop: `1px solid ${settings.theme === 'light' ? '#e5e7eb' : '#374151'}`
    },
    button: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: settings.theme === 'light' ? '#6b7280' : '#9ca3af',
      border: `1px solid ${settings.theme === 'light' ? '#d1d5db' : '#4b5563'}`
    }
  };

  const renderAppearanceTab = () => (
    <div>
      <div style={settingsStyles.section}>
        <h3 style={settingsStyles.sectionTitle}>
          <Palette size={20} />
          Theme Selection
        </h3>
        <div style={settingsStyles.grid}>
          {themeOptions.map(theme => (
            <div
              key={theme.id}
              style={{
                ...settingsStyles.card,
                ...(settings.theme === theme.id ? settingsStyles.cardActive : {})
              }}
              onClick={() => handleSettingChange('theme', theme.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <theme.icon size={20} />
                <span style={{ fontWeight: '500' }}>{theme.label}</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '4px',
                  background: theme.preview
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {settings.theme === 'custom' && (
        <div style={settingsStyles.section}>
          <h3 style={settingsStyles.sectionTitle}>Custom Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.entries(settings.customColors).map(([key, value]) => (
              <div key={key} style={settingsStyles.formGroup}>
                <label style={settingsStyles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key, e.target.value)}
                    style={settingsStyles.colorInput}
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key, e.target.value)}
                    style={{ ...settingsStyles.input, flex: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={settingsStyles.section}>
        <h3 style={settingsStyles.sectionTitle}>Typography</h3>
        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Font Size</label>
          <div style={settingsStyles.grid}>
            {fontSizeOptions.map(option => (
              <div
                key={option.id}
                style={{
                  ...settingsStyles.card,
                  ...(settings.fontSize === option.id ? settingsStyles.cardActive : {})
                }}
                onClick={() => handleSettingChange('fontSize', option.id)}
              >
                <div style={{ fontSize: option.size, fontWeight: '500' }}>
                  {option.label}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {option.size}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div>
      <div style={settingsStyles.section}>
        <h3 style={settingsStyles.sectionTitle}>
          <Layout size={20} />
          Layout Options
        </h3>
        
        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Sidebar Width</label>
          <input
            type="range"
            min="200"
            max="320"
            value={settings.sidebarWidth}
            onChange={(e) => handleSettingChange('sidebarWidth', parseInt(e.target.value))}
            style={settingsStyles.input}
          />
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            {settings.sidebarWidth}px
          </div>
        </div>

        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Card Border Radius</label>
          <input
            type="range"
            min="0"
            max="24"
            value={settings.cardBorderRadius}
            onChange={(e) => handleSettingChange('cardBorderRadius', parseInt(e.target.value))}
            style={settingsStyles.input}
          />
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            {settings.cardBorderRadius}px
          </div>
        </div>

        <div style={settingsStyles.formGroup}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={settingsStyles.label}>Compact Mode</label>
            <div
              style={{
                ...settingsStyles.toggle,
                ...(settings.compactMode ? settingsStyles.toggleActive : {})
              }}
              onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
            >
              <div
                style={{
                  ...settingsStyles.toggleKnob,
                  ...(settings.compactMode ? settingsStyles.toggleKnobActive : {})
                }}
              />
            </div>
          </div>
        </div>

        <div style={settingsStyles.formGroup}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={settingsStyles.label}>Show Sidebar</label>
            <div
              style={{
                ...settingsStyles.toggle,
                ...(settings.showSidebar ? settingsStyles.toggleActive : {})
              }}
              onClick={() => handleSettingChange('showSidebar', !settings.showSidebar)}
            >
              <div
                style={{
                  ...settingsStyles.toggleKnob,
                  ...(settings.showSidebar ? settingsStyles.toggleKnobActive : {})
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardTab = () => (
    <div>
      <div style={settingsStyles.section}>
        <h3 style={settingsStyles.sectionTitle}>
          <Monitor size={20} />
          Dashboard Components
        </h3>
        
        {[
          { key: 'showWelcomeCard', label: 'Welcome Card' },
          { key: 'showMetrics', label: 'Key Metrics' },
          { key: 'showTopSetups', label: 'Top Setups' },
          { key: 'showSentiment', label: 'Market Sentiment' },
          { key: 'showInsights', label: 'AI Insights' }
        ].map(item => (
          <div key={item.key} style={settingsStyles.formGroup}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={settingsStyles.label}>{item.label}</label>
              <div
                style={{
                  ...settingsStyles.toggle,
                  ...(settings[item.key] ? settingsStyles.toggleActive : {})
                }}
                onClick={() => handleSettingChange(item.key, !settings[item.key])}
              >
                <div
                  style={{
                    ...settingsStyles.toggleKnob,
                    ...(settings[item.key] ? settingsStyles.toggleKnobActive : {})
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Auto Refresh Interval (seconds)</label>
          <input
            type="number"
            min="10"
            max="300"
            value={settings.refreshInterval}
            onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
            style={settingsStyles.input}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div>
      <div style={settingsStyles.section}>
        <h3 style={settingsStyles.sectionTitle}>
          <Bell size={20} />
          Notification Preferences
        </h3>
        
        {[
          { key: 'enableNotifications', label: 'Enable Notifications', icon: Bell },
          { key: 'soundEnabled', label: 'Sound Alerts', icon: Volume2 },
          { key: 'emailAlerts', label: 'Email Alerts', icon: Globe }
        ].map(item => (
          <div key={item.key} style={settingsStyles.formGroup}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <item.icon size={16} />
                <label style={settingsStyles.label}>{item.label}</label>
              </div>
              <div
                style={{
                  ...settingsStyles.toggle,
                  ...(settings[item.key] ? settingsStyles.toggleActive : {})
                }}
                onClick={() => handleSettingChange(item.key, !settings[item.key])}
              >
                <div
                  style={{
                    ...settingsStyles.toggleKnob,
                    ...(settings[item.key] ? settingsStyles.toggleKnobActive : {})
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div>
      <div style={settingsStyles.section}>
        <h3 style={settingsStyles.sectionTitle}>
          <Sliders size={20} />
          Performance & Effects
        </h3>
        
        {[
          { key: 'enableAnimations', label: 'Enable Animations' },
          { key: 'enableHoverEffects', label: 'Hover Effects' },
          { key: 'autoRefresh', label: 'Auto Refresh Data' }
        ].map(item => (
          <div key={item.key} style={settingsStyles.formGroup}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={settingsStyles.label}>{item.label}</label>
              <div
                style={{
                  ...settingsStyles.toggle,
                  ...(settings[item.key] ? settingsStyles.toggleActive : {})
                }}
                onClick={() => handleSettingChange(item.key, !settings[item.key])}
              >
                <div
                  style={{
                    ...settingsStyles.toggleKnob,
                    ...(settings[item.key] ? settingsStyles.toggleKnobActive : {})
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Chart Height</label>
          <input
            type="range"
            min="300"
            max="800"
            value={settings.chartHeight}
            onChange={(e) => handleSettingChange('chartHeight', parseInt(e.target.value))}
            style={settingsStyles.input}
          />
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            {settings.chartHeight}px
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
    //     return renderLayoutTab();
    //   case 'dashboard':
    //     return renderDashboardTab();
    //   case 'notifications':
    //     return renderNotificationsTab();
    //   case 'performance':
    //     return renderPerformanceTab();
      default:
        return renderAppearanceTab();
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
            style={settingsStyles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = settings.theme === 'light' ? '#f3f4f6' : '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={settingsStyles.content}>
          <div style={settingsStyles.sidebar}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                style={{
                  ...settingsStyles.tabButton,
                  ...(activeTab === tab.id ? settingsStyles.tabButtonActive : settingsStyles.tabButtonInactive)
                }}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = settings.theme === 'light' ? '#f3f4f6' : '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div style={settingsStyles.main}>
            {renderTabContent()}
          </div>
        </div>

        <div style={settingsStyles.footer}>
          <button
            style={{
              ...settingsStyles.button,
              ...settingsStyles.secondaryButton
            }}
            onClick={resetToDefaults}
            onMouseEnter={(e) => e.target.style.backgroundColor = settings.theme === 'light' ? '#f3f4f6' : '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                ...settingsStyles.button,
                ...settingsStyles.secondaryButton
              }}
              onClick={onClose}
              onMouseEnter={(e) => e.target.style.backgroundColor = settings.theme === 'light' ? '#f3f4f6' : '#374151'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              style={{
                ...settingsStyles.button,
                ...settingsStyles.primaryButton
              }}
              onClick={saveSettings}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
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

// Example usage component
const SettingsDemo = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [currentSettings, setCurrentSettings] = useState(null);

  const handleApplySettings = (newSettings) => {
    setCurrentSettings(newSettings);
    console.log('Applied settings:', newSettings);
    // Here you would apply the settings to your main dashboard
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111827', minHeight: '100vh', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Trading Dashboard Settings</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          <Settings size={20} />
          Open Settings
        </button>
      </div>

      {currentSettings && (
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <h3>Current Settings Preview:</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(currentSettings, null, 2)}
          </pre>
        </div>
      )}

      <SettingsWindow
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApplySettings={handleApplySettings}
      />
    </div>
  );
};

export default SettingsDemo;