// TradingViewEventsWidget.jsx
import React, { useEffect, useRef, memo, useState } from 'react';

const TradingViewEventsWidget = memo(({ 
  colorTheme = "dark",
  isTransparent = false,
  locale = "en",
  importanceFilter = "-1,0,1",
  countryFilter = "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
  height = "100%",
  width = "100%",
  showCopyright = true,
  onError = null
}) => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states
    setIsLoading(true);
    setError(null);

    // Check if container exists
    if (!containerRef.current) {
      setError('Container not found');
      setIsLoading(false);
      return;
    }

    // Clear previous content
    const container = containerRef.current;
    const widgetContainer = container.querySelector('.tradingview-widget-container__widget');
    if (widgetContainer) {
      widgetContainer.innerHTML = '';
    }

    // Remove existing script if any
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    try {
      // Create and configure script
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      script.type = "text/javascript";
      script.async = true;
      
      // Widget configuration
      const config = {
         "width": "100%",
  "height": "100%",
  "colorTheme": "dark",
  "isTransparent": false,
  "locale": "en",
  "importanceFilter": "-1,0,1",
  "countryFilter": "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu"
      };

      script.innerHTML = JSON.stringify(config);
      
      // Handle script load events
      script.onload = () => {
        setIsLoading(false);
      };
      
      script.onerror = (err) => {
        const errorMsg = 'Failed to load TradingView events widget';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(err);
        console.error(errorMsg, err);
      };

      // Store reference and append to container
      scriptRef.current = script;
      if (widgetContainer) {
        widgetContainer.appendChild(script);
      } else {
        container.appendChild(script);
      }

    } catch (err) {
      const errorMsg = 'Error initializing TradingView events widget';
      setError(errorMsg);
      setIsLoading(false);
      if (onError) onError(err);
      console.error(errorMsg, err);
    }

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [colorTheme, isTransparent, locale, importanceFilter, countryFilter, onError]);

  // Error state
  if (error) {
    return (
      <div 
        className="tradingview-events-widget-error" 
        style={{ 
          height, 
          width, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: colorTheme === 'dark' ? '#1e1e1e' : '#f5f5f5',
          border: `1px solid ${colorTheme === 'dark' ? '#333' : '#e0e0e0'}`,
          borderRadius: '4px',
          color: colorTheme === 'dark' ? '#ccc' : '#666'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>📅</div>
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
        height:'100vh', 
        width, 
        position: 'relative',
        backgroundColor: isTransparent ? 'transparent' : (colorTheme === 'dark' ? '#1e1e1e' : '#ffffff')
      }}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div 
          className="tradingview-events-widget-loading"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            <div style={{ fontSize: '14px' }}>Loading events...</div>
          </div>
        </div>
      )}
      
      {/* Widget container */}
      <div 
        className="tradingview-widget-container__widget" 
        style={{ 
          height: showCopyright ? "calc(100% - 32px)" : "100%", 
          width: "100%" 
        }}
      />
      
      {/* Copyright notice */}
      {showCopyright && (
        <div className="tradingview-widget-copyright">
          <a 
            href="https://www.tradingview.com/" 
            rel="noopener nofollow" 
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <span style={{ 
              color: colorTheme === 'dark' ? '#4CAF50' : '#2196F3', 
              fontSize: '12px' 
            }}>
              Track all markets on TradingView
            </span>
          </a>
        </div>
      )}
      
      {/* CSS for loading animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

TradingViewEventsWidget.displayName = 'TradingViewEventsWidget';

export default TradingViewEventsWidget;