import React, { useEffect, useRef } from 'react';

const DukascopyChart = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dukascopy Chart</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            
        }
        #chart-container {
            // width: 1000px;
            // height: 100vh;
            // position:absolute;
            
        }
    </style>
</head>
<body>
    <div id="chart-container"></div>
    
    <script type="text/javascript">
        DukascopyApplet = {
            "type": "chart",
            "params": {
                "showUI": true,
                "showTabs": true,
                "showParameterToolbar": true,
                "showOfferSide": true,
                "allowInstrumentChange": true,
                "allowPeriodChange": true,
                "allowOfferSideChange": true,
                "showAdditionalToolbar": true,
                "showDetachButton": true,
                "presentationType": "candle",
                "axisX": true,
                "axisY": true,
                "legend": true,
                "timeline": true,
                "showDateSeparators": true,
                "showZoom": true,
                "showScrollButtons": true,
                "showAutoShiftButton": true,
                "crosshair": true,
                "borders": false,
                "theme": "Pastelle",
                "uiColor": "#000",
                "availableInstruments": "l:",
                "instrument": "EUR/USD",
                "period": "7",
                "offerSide": "BID",
                "timezone": 0,
                "live": true,
                "panLock": false,
                "width": "100%",
                "height": "600",
                "z-index":"10000",
            }
        };
    </script>
    <script type="text/javascript" src="https://freeserv-static.dukascopy.com/2.0/core.js"></script>
</body>
</html>`;

    // Write the HTML content to the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Live Trading Chart
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-2">
            <iframe
              ref={iframeRef}
              className=" border-0"
              style={{ height: '100vh', minHeight: '100vh',width:"100%" }}
              title="Dukascopy Trading Chart"
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Chart data provided by Dukascopy Bank SA
          </p>
        </div>
      </div>
    </div>
  );
};

export default DukascopyChart;