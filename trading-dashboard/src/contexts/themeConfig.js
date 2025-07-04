import TopSetups from "../components/TopSetups";

// themeConfig.js - Enhanced theme configuration and utilities
export const THEME_MODES = {
  DARK: 'dark',
  LIGHT: 'light',
  CUSTOM: 'custom'
};

export const DEFAULT_THEMES = {
  dark: {
    background: '#6c9474',
    cardBackground: '#17271e',
    sidebar: '#6c9474',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    accent: '#ba7878',
    accentSecondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#374151',
    chart:'dark',
    textTopsetup: 'white',
    backgroundTopSetups:'black',
    topSetupsBar: '#a42c3d',
     topsetuptableline: "white",
    primary:"white",
      rowEven:"gray",
     rowOdd:"gray",
     search:"e4eed3"
  },
  light: {
    background: '#e4eed3',
    cardBackground: '#e4eed3',
    sidebar: '#e4eed3',
    text: '#111827',
    textSecondary: 'black',
    accent: '#3b82f6',
    accentSecondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#e5e7eb',
    chart:'light',
    textTopsetup: 'black',
    backgroundTopSetups:'#e4eed3',
    topSetupsBar: '#ba7878',
    topsetuptableline: "white",
     primary:"white",
     rowEven:"white",
     rowOdd:"white",
      search:"e4eed3"
  }
};

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  customColors: DEFAULT_THEMES.dark,
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
  transitionSpeed: 'medium',
  chart:'dark'
};

// Get current theme colors based on settings
export const getThemeColors = (settings) => {
  switch (settings.theme) {  
    case THEME_MODES.LIGHT:
      return DEFAULT_THEMES.light;
    case THEME_MODES.CUSTOM:
      return settings.customColors;
    case THEME_MODES.DARK:
    default:
      return DEFAULT_THEMES.dark;
  }
};

// Validate settings object
export const validateSettings = (settings) => {
  const validatedSettings = { ...DEFAULT_SETTINGS };
  
  // Validate each setting
  if (settings && typeof settings === 'object') {
    // Theme validation
    if (Object.values(THEME_MODES).includes(settings.theme)) {
      validatedSettings.theme = settings.theme;
    }
    
    // Custom colors validation
    if (settings.customColors && typeof settings.customColors === 'object') {
      validatedSettings.customColors = {
        ...DEFAULT_THEMES.dark,
        ...settings.customColors
      };
    }
    
    // Numeric settings validation
    const numericSettings = {
      sidebarWidth: { min: 200, max: 400 },
      cardBorderRadius: { min: 0, max: 24 },
      cardPadding: { min: 12, max: 40 },
      refreshInterval: { min: 5, max: 300 },
      chartHeight: { min: 200, max: 800 }
    };
    
    Object.entries(numericSettings).forEach(([key, { min, max }]) => {
      if (typeof settings[key] === 'number' && settings[key] >= min && settings[key] <= max) {
        validatedSettings[key] = settings[key];
      }
    });
    
    // Boolean settings validation
    const booleanSettings = [
      'compactMode', 'showSidebar', 'showWelcomeCard', 'showMetrics', 
      'showTopSetups', 'showSentiment', 'showInsights', 'autoRefresh',
      'enableNotifications', 'soundEnabled', 'emailAlerts', 'showChartToolbar',
      'enableAnimations', 'enableHoverEffects'
    ];
    
    booleanSettings.forEach(key => {
      if (typeof settings[key] === 'boolean') {
        validatedSettings[key] = settings[key];
      }
    });
    
    // String settings validation
    const stringSettings = {
      fontSize: ['small', 'medium', 'large'],
      fontFamily: ['system-ui', 'serif', 'monospace'],
      defaultTimeframe: ['1H', '4H', '1D', '1W', '1M'],
      transitionSpeed: ['slow', 'medium', 'fast']
    };
    
    Object.entries(stringSettings).forEach(([key, validValues]) => {
      if (validValues.includes(settings[key])) {
        validatedSettings[key] = settings[key];
      }
    });
  }
  
  return validatedSettings;
};

// Save settings to localStorage with validation
export const saveSettings = (settings) => {
  try {
    const validatedSettings = validateSettings(settings);
    const settingsToSave = {
      ...validatedSettings,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('dashboardSettings', JSON.stringify(settingsToSave));
    
    // Apply CSS custom properties for global theme
    applyThemeToDocument(validatedSettings);
    
    // Emit custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('settingsChanged', { 
      detail: validatedSettings 
    }));
    
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

// Load settings from localStorage with validation
export const loadSettings = () => {
  try {
    const saved = localStorage.getItem('dashboardSettings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      const validatedSettings = validateSettings(parsedSettings);
      
      // Apply theme immediately on load
      applyThemeToDocument(validatedSettings);
      
      return validatedSettings;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  
  // Return defaults and apply them
  const defaultSettings = validateSettings(DEFAULT_SETTINGS);
  applyThemeToDocument(defaultSettings);
  return defaultSettings;
};

// Apply theme colors to CSS custom properties
export const applyThemeToDocument = (settings) => {
  const colors = getThemeColors(settings);
  const root = document.documentElement;
  
  // Set CSS custom properties for colors
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Set additional theme-related properties
  root.style.setProperty('--sidebar-width', `${settings.sidebarWidth}px`);
  root.style.setProperty('--card-border-radius', `${settings.cardBorderRadius}px`);
  root.style.setProperty('--card-padding', `${settings.cardPadding}px`);
  root.style.setProperty('--font-size-base', 
    settings.fontSize === 'large' ? '18px' : 
    settings.fontSize === 'small' ? '14px' : '16px'
  );
  root.style.setProperty('--transition-speed', 
    settings.transitionSpeed === 'fast' ? '0.1s' :
    settings.transitionSpeed === 'slow' ? '0.4s' : '0.2s'
  );
  
  // Add theme class to body
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  document.body.classList.add(`theme-${settings.theme}`);
  
  // Add utility classes
  if (settings.compactMode) {
    document.body.classList.add('compact-mode');
  } else {
    document.body.classList.remove('compact-mode');
  }
  
  if (!settings.enableAnimations) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
};

// Get computed theme styles for inline styling
export const getThemeStyles = (settings) => {
  const colors = getThemeColors(settings);
  
  return {
    colors,
    // Common style objects
    page: {
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
      fontFamily: settings.fontFamily,
      fontSize: settings.fontSize === 'large' ? '18px' : settings.fontSize === 'small' ? '14px' : '16px',
      transition: settings.enableAnimations ? `all ${settings.transitionSpeed === 'fast' ? '0.1s' : settings.transitionSpeed === 'slow' ? '0.4s' : '0.2s'} ease` : 'none'
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: `${settings.cardBorderRadius}px`,
      padding: settings.compactMode ? `${Math.max(settings.cardPadding * 0.6, 12)}px` : `${settings.cardPadding}px`,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      transition: settings.enableAnimations ? 'all 0.2s ease' : 'none'
    },
    sidebar: {
      backgroundColor: colors.sidebar,
      width: settings.showSidebar ? `${settings.sidebarWidth}px` : '0',
      borderRight: `1px solid ${colors.border}`,
      color: colors.text,
      transition: settings.enableAnimations ? 'all 0.3s ease' : 'none'
    },
    button: {
      backgroundColor: colors.accent,
      color: '#ffffff',
      border: 'none',
      borderRadius: `${settings.cardBorderRadius}px`,
      padding: settings.compactMode ? '8px 16px' : '10px 20px',
      cursor: 'pointer',
      fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'small' ? '12px' : '14px',
      transition: settings.enableAnimations ? 'all 0.2s ease' : 'none'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: `${settings.cardBorderRadius}px`,
      padding: settings.compactMode ? '8px 16px' : '10px 20px',
      cursor: 'pointer',
      fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'small' ? '12px' : '14px',
      transition: settings.enableAnimations ? 'all 0.2s ease' : 'none'
    }
  };
};

// Export theme presets for easy switching
export const THEME_PRESETS = {
  oceanDark: {
    ...DEFAULT_THEMES.dark,
    accent: '#0ea5e9',
    accentSecondary: '#06b6d4',
    background: '#0f172a',
    cardBackground: '#1e293b'
  },
  forestDark: {
    ...DEFAULT_THEMES.dark,
    accent: '#059669',
    accentSecondary: '#0d9488',
    background: '#064e3b',
    cardBackground: '#065f46'
  },
  sunsetDark: {
    ...DEFAULT_THEMES.dark,
    accent: '#ea580c',
    accentSecondary: '#dc2626',
    background: '#7c2d12',
    cardBackground: '#9a3412'
  }
};

// Utility to create a custom theme preset
export const createThemePreset = (name, baseTheme, overrides) => {
  return {
    name,
    colors: {
      ...DEFAULT_THEMES[baseTheme],
      ...overrides
    }
  };
};

// Listen for system theme changes
export const initializeThemeListener = (onThemeChange) => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (typeof onThemeChange === 'function') {
        onThemeChange(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
  
  return () => {}; // No-op cleanup function
};