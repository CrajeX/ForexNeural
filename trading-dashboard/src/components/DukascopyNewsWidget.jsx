import React, { useEffect, useRef, memo, useState } from 'react';
import { loadSettings, getThemeColors } from '../contexts/themeConfig';

const TradingViewNewsWidget = memo(({
  feedMode = "all_symbols",
  isTransparent = false,
  displayMode = "regular",
  locale = "en",
  height = "100vh",
  width = "100%",
  showCopyright = true,
  onError = null
}) => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  const [settings, setSettings] = useState(loadSettings());
  const [widgetKey, setWidgetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const colorTheme = getThemeColors(settings).chart === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const handleSettingsChange = (e) => {
      setSettings(e.detail);
      setWidgetKey(prev => prev + 1);
    };
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const container = containerRef.current;
    if (!container) {
      setError('Container not found');
      setIsLoading(false);
      return;
    }

    const widgetContainer = container.querySelector('.tradingview-widget-container__widget');
    if (widgetContainer) widgetContainer.innerHTML = '';
    if (scriptRef.current) scriptRef.current.remove();

    try {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;

      const config = {
        feedMode,
        isTransparent,
        displayMode,
        width: "100%",
        height: "100%",
        colorTheme,
        locale
      };

      script.innerHTML = JSON.stringify(config);
      script.onload = () => setIsLoading(false);
      script.onerror = (err) => {
        const errorMsg = 'Failed to load TradingView news widget';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(err);
        console.error(errorMsg, err);
      };

      scriptRef.current = script;
      if (widgetContainer) widgetContainer.appendChild(script);
      else container.appendChild(script);
    } catch (err) {
      const errorMsg = 'Error initializing TradingView news widget';
      setError(errorMsg);
      setIsLoading(false);
      if (onError) onError(err);
      console.error(errorMsg, err);
    }

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [widgetKey, feedMode, isTransparent, displayMode, colorTheme, locale, onError]);

  if (error) {
    return (
      <div style={{
        height, width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorTheme === 'dark' ? '#1e1e1e' : '#f5f5f5',
        border: `1px solid ${colorTheme === 'dark' ? '#333' : '#e0e0e0'}`,
        borderRadius: '4px',
        color: colorTheme === 'dark' ? '#ccc' : '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>📰</div>
          <div>{error}</div>
          <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
            Please check your connection and try again
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{
        height,
        width,
        position: 'relative',
        backgroundColor: isTransparent ? 'transparent' : (colorTheme === 'dark' ? '#1e1e1e' : '#ffffff')
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: colorTheme === 'dark' ? '#1e1e1e' : '#f9f9f9',
            zIndex: 1
          }}
        >
          <div style={{ textAlign: 'center', color: colorTheme === 'dark' ? '#ccc' : '#666' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${colorTheme === 'dark' ? '#333' : '#e0e0e0'}`,
              borderTop: `2px solid ${colorTheme === 'dark' ? '#fff' : '#2196F3'}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 8px'
            }}></div>
            <div style={{ fontSize: '14px' }}>Loading news...</div>
          </div>
        </div>
      )}

      <div
        className="tradingview-widget-container__widget"
        style={{ height: showCopyright ? "calc(100% - 32px)" : "100%", width: "100%" }}
      />

      {showCopyright && (
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style={{ textDecoration: 'none' }}>
            <span style={{ color: colorTheme === 'dark' ? '#4CAF50' : '#2196F3', fontSize: '12px' }}>
              Track all markets on TradingView
            </span>
          </a>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

TradingViewNewsWidget.displayName = 'TradingViewNewsWidget';
export default TradingViewNewsWidget;
