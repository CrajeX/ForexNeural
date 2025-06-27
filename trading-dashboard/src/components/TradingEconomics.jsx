import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

const TradingEconomicsHistory = () => {
  const [selectedAsset, setSelectedAsset] = useState('USD');
  const [selectedDataType, setSelectedDataType] = useState('cot');
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [chartType, setChartType] = useState('line');
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // New state for hover indicators
  const [activeHoverData, setActiveHoverData] = useState(null);
  const [hoverLineX, setHoverLineX] = useState(null);

  // Available data types (excluding retail sentiment as requested)
  const dataTypes = [
    { value: 'cot', label: 'COT Data', color: '#8884d8' },
    { value: 'employment', label: 'Employment Change', color: '#82ca9d' },
    { value: 'unemployment', label: 'Unemployment Rate', color: '#ffc658' },
    { value: 'gdp', label: 'GDP Growth', color: '#ff7300' },
    { value: 'mpmi', label: 'Manufacturing PMI', color: '#00ff00' },
    { value: 'spmi', label: 'Services PMI', color: '#0088fe' },
    { value: 'retail', label: 'Retail Sales', color: '#00c49f' },
    { value: 'inflation', label: 'Core Inflation', color: '#ffbb28' },
    { value: 'interest', label: 'Interest Rates', color: '#ff8042' },
    { value: 'nfp', label: 'NFP (USD Only)', color: '#8dd1e1' }
  ];

  const timeframes = [
    { value: '7days', label: '7 Days', days: 7 },
    { value: 'monthly', label: '1 Month', days: 30 },
    { value: 'quarterly', label: '3 Months', days: 90 },
    { value: 'yearly', label: '1 Year', days: 365 },
    { value: '10years', label: '10 Years', days: 3650 }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'bar', label: 'Bar Chart' }
  ];

  // Enhanced asset fetching function similar to the data entry form
  const fetchAssets = useCallback(async (signal) => {
    try {
      setAssetsLoading(true);
      setAssetsError(null);

      console.log('🔄 Fetching assets...');
      const response = await fetch(
        "http://localhost:3000/api/assets?type=Currency",
        { signal }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch assets: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      // Remove duplicates and filter valid assets
      const uniqueAssets = safeData
        .filter((asset) => asset && asset.code && asset.name)
        .reduce((acc, asset) => {
          if (!acc.find((item) => item.code === asset.code)) {
            acc.push(asset);
          }
          return acc;
        }, []);

      // Sort with major currencies first, then alphabetically
      const sortedAssets = uniqueAssets.sort((a, b) => {
        const majorCurrencies = [
          "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"
        ];
        const aIndex = majorCurrencies.indexOf(a.code);
        const bIndex = majorCurrencies.indexOf(b.code);

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        } else if (aIndex !== -1) {
          return -1;
        } else if (bIndex !== -1) {
          return 1;
        } else {
          return a.name.localeCompare(b.name);
        }
      });

      setAssets(sortedAssets);
      console.log('✅ Assets loaded:', sortedAssets.length, 'currencies');

      // Set default currency if not already set
      if (!selectedAsset && sortedAssets.length > 0) {
        const defaultAsset = sortedAssets.find(asset => asset.code === 'USD') || sortedAssets[0];
        setSelectedAsset(defaultAsset.code);
      }

    } catch (error) {
      if (error.name !== "AbortError") {
        setAssetsError(error.message);
        console.error("Error fetching assets:", error);
        
        // Fallback to common currencies
        const fallbackAssets = [
          { code: 'USD', name: 'US Dollar' },
          { code: 'EUR', name: 'Euro' },
          { code: 'GBP', name: 'British Pound' },
          { code: 'JPY', name: 'Japanese Yen' },
          { code: 'AUD', name: 'Australian Dollar' },
          { code: 'CAD', name: 'Canadian Dollar' },
          { code: 'CHF', name: 'Swiss Franc' },
          { code: 'NZD', name: 'New Zealand Dollar' }
        ];
        setAssets(fallbackAssets);
        
        if (!selectedAsset) {
          setSelectedAsset('USD');
        }
      }
    } finally {
      setAssetsLoading(false);
    }
  }, [selectedAsset]);

  // Retry function for asset fetching
  const retryAssetFetch = useCallback(() => {
    const abortController = new AbortController();
    fetchAssets(abortController.signal);
  }, [fetchAssets]);

  // Fetch historical data from actual API endpoints
  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching historical data for:', selectedDataType, selectedAsset, selectedTimeframe);
      
      // Calculate date range based on timeframe
      const endDate = new Date();
      const startDate = new Date();
      
      const timeframeConfig = timeframes.find(t => t.value === selectedTimeframe);
      if (timeframeConfig) {
        startDate.setDate(startDate.getDate() - timeframeConfig.days);
      } else {
        startDate.setDate(startDate.getDate() - 30); // Default to 30 days
      }

      const formatDate = (date) => date.toISOString().split('T')[0];
      
      let endpoint = '';
      let assetParam = '';
      
      // Map data types to API endpoints
      switch (selectedDataType) {
        case 'cot':
          endpoint = 'cot-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'employment':
          endpoint = 'employment-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'unemployment':
          endpoint = 'unemployment-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'gdp':
          endpoint = 'gdp-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'mpmi':
          endpoint = 'mpmi-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'spmi':
          endpoint = 'spmi-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'retail':
          endpoint = 'retail-sales-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'inflation':
          endpoint = 'inflation-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'interest':
          endpoint = 'interest-history';
          assetParam = `asset_code=${selectedAsset}`;
          break;
        case 'nfp':
          if (selectedAsset !== 'USD') {
            setHistoricalData([]);
            setLastUpdated(new Date());
            setError('NFP data is only available for USD currency');
            return;
          }
          endpoint = 'nfp-history';
          assetParam = `asset_code=USD`;
          break;
        default:
          throw new Error(`Unknown data type: ${selectedDataType}`);
      }

      const url = `http://localhost:3000/api/economic-data/${endpoint}?${assetParam}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&limit=200`;
      
      console.log('📡 API Request URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API returned unsuccessful response');
      }
      
      const rawData = result.data || [];
      
      console.log('📊 Raw historical data:', rawData);
      
      // Process the data for charting
      const processedData = processHistoricalData(rawData, selectedDataType, selectedTimeframe);
      
      setHistoricalData(processedData);
      setLastUpdated(new Date());
      console.log('✅ Historical data loaded:', processedData.length, 'data points');
      
      if (processedData.length === 0) {
        setError('No historical data found for the selected criteria');
      }
      
    } catch (error) {
      console.error('❌ Error fetching historical data:', error);
      setError(`Failed to load data: ${error.message}`);
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAsset, selectedDataType, selectedTimeframe]);

  // Process historical data from API response
  const processHistoricalData = (rawData, dataType, timeframe) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    const processedData = rawData.map((item, index) => {
      const date = new Date(item.created_at);
      
      const formatDate = (date) => {
        if (['7days'].includes(timeframe)) {
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          ...(timeframe === 'monthly' || timeframe === '7days' ? { day: 'numeric' } : {})
        });
      };

      let dataPoint = {
        date: formatDate(date),
        timestamp: date.getTime(),
        created_at: item.created_at,
        dateIndex: index
      };

      switch (dataType) {
        case 'cot':
          dataPoint.longPercent = parseFloat(item.long_percent || 0);
          dataPoint.shortPercent = parseFloat(item.short_percent || 0);
          dataPoint.netChange = parseFloat(item.net_change_percent || 0);
          dataPoint.longContracts = parseInt(item.long_contracts || 0);
          dataPoint.shortContracts = parseInt(item.short_contracts || 0);
          // COT doesn't have forecast data
          dataPoint.actualLabel = 'Long Positions';
          dataPoint.actualValue = dataPoint.longPercent;
          dataPoint.shortLabel = 'Short Positions';
          dataPoint.shortValue = dataPoint.shortPercent;
          break;
        case 'employment':
          dataPoint.actual = parseFloat(item.employment_change || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.change = parseFloat(item.net_change_percent || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.actual - dataPoint.forecast;
          dataPoint.actualLabel = 'Employment Change';
          dataPoint.actualValue = dataPoint.actual;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'unemployment':
          dataPoint.rate = parseFloat(item.unemployment_rate || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.change = parseFloat(item.net_change_percent || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.rate - dataPoint.forecast;
          dataPoint.actualLabel = 'Unemployment Rate';
          dataPoint.actualValue = dataPoint.rate;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'gdp':
          dataPoint.growth = parseFloat(item.gdp_growth || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.change = parseFloat(item.change_in_gdp || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.growth - dataPoint.forecast;
          dataPoint.actualLabel = 'GDP Growth';
          dataPoint.actualValue = dataPoint.growth;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'mpmi':
          dataPoint.pmi = parseFloat(item.service_pmi || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.pmi - dataPoint.forecast;
          dataPoint.actualLabel = 'Manufacturing PMI';
          dataPoint.actualValue = dataPoint.pmi;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'spmi':
          dataPoint.pmi = parseFloat(item.service_pmi || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.pmi - dataPoint.forecast;
          dataPoint.actualLabel = 'Services PMI';
          dataPoint.actualValue = dataPoint.pmi;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'retail':
          dataPoint.sales = parseFloat(item.retail_sales || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.change = parseFloat(item.net_change_percent || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.sales - dataPoint.forecast;
          dataPoint.actualLabel = 'Retail Sales';
          dataPoint.actualValue = dataPoint.sales;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'inflation':
          dataPoint.cpi = parseFloat(item.core_inflation || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.change = parseFloat(item.net_change_percent || 0);
          dataPoint.result = item.result || 'N/A';
          dataPoint.variance = dataPoint.cpi - dataPoint.forecast;
          dataPoint.actualLabel = 'Core Inflation';
          dataPoint.actualValue = dataPoint.cpi;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        case 'interest':
          dataPoint.rate = parseFloat(item.interest_rate || 0);
          dataPoint.change = parseFloat(item.change_in_interest || 0);
          dataPoint.actualLabel = 'Interest Rate';
          dataPoint.actualValue = dataPoint.rate;
          dataPoint.changeLabel = 'Change in Interest';
          dataPoint.changeValue = dataPoint.change;
          // Interest rates don't have forecast in your schema
          break;
        case 'nfp':
          dataPoint.actual = parseFloat(item.actual_nfp || 0);
          dataPoint.forecast = parseFloat(item.forecast || 0);
          dataPoint.change = parseFloat(item.net_change_percent || 0);
          dataPoint.variance = dataPoint.actual - dataPoint.forecast;
          dataPoint.actualLabel = 'Actual NFP';
          dataPoint.actualValue = dataPoint.actual;
          dataPoint.forecastValue = dataPoint.forecast;
          break;
        default:
          dataPoint.value = parseFloat(item.value || 0);
          dataPoint.actualLabel = 'Value';
          dataPoint.actualValue = dataPoint.value;
      }

      return dataPoint;
    }).sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp ascending

    console.log('📈 Processed data:', processedData);
    return processedData;
  };

  // Initialize component - fetch assets on mount
  useEffect(() => {
    const abortController = new AbortController();
    fetchAssets(abortController.signal);
    return () => abortController.abort();
  }, [fetchAssets]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (selectedAsset && selectedDataType && !assetsLoading) {
      fetchHistoricalData();
    }
  }, [selectedAsset, selectedDataType, selectedTimeframe, assetsLoading, fetchHistoricalData]);

  // Get chart data based on data type
  const getChartData = () => {
    return historicalData.filter(d => d !== null);
  };

  // Get data type configuration
  const getDataTypeConfig = () => {
    return dataTypes.find(dt => dt.value === selectedDataType) || dataTypes[0];
  };

  // Check if current data type has forecast values
  const hasForecastData = () => {
    return ['employment', 'unemployment', 'gdp', 'mpmi', 'spmi', 'retail', 'inflation', 'nfp'].includes(selectedDataType);
  };

  // Enhanced Custom tooltip for charts with forecast/actual indicators
  const CustomTooltip = ({ active, payload, label, coordinate }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const hasVariance = data.variance !== undefined;
      const hasActualForecast = data.actualValue !== undefined && data.forecastValue !== undefined;
      const isCOTData = selectedDataType === 'cot';
      const isInterestData = selectedDataType === 'interest';
      
      return (
        <div style={styles.enhancedTooltip}>
          <div style={styles.tooltipHeader}>
            <p style={styles.tooltipLabel}>{`📅 ${label}`}</p>
            {data.result && (
              <span style={{
                ...styles.resultBadge,
                backgroundColor: data.result === 'Beat' ? '#10b981' : 
                               data.result === 'Miss' || data.result === 'Missed' ? '#ef4444' : 
                               data.result === 'As Expected' || data.result === 'Met' ? '#3b82f6' : '#6b7280'
              }}>
                {data.result}
              </span>
            )}
          </div>
          
          {/* Show COT Data */}
          {isCOTData && (
            <div style={styles.actualForecastSection}>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.actualIndicator}>📊</span>
                  <span>Long Positions:</span>
                </div>
                <span style={styles.actualValue}>
                  {data.longPercent.toFixed(2)}%
                </span>
              </div>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.forecastIndicator}>📉</span>
                  <span>Short Positions:</span>
                </div>
                <span style={styles.forecastValue}>
                  {data.shortPercent.toFixed(2)}%
                </span>
              </div>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.forecastIndicator}>📈</span>
                  <span>Net Change:</span>
                </div>
                <span style={{
                  ...styles.forecastValue,
                  color: data.netChange > 0 ? '#10b981' : data.netChange < 0 ? '#ef4444' : '#6b7280'
                }}>
                  {data.netChange > 0 ? '+' : ''}{data.netChange.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {/* Show Interest Rate Data */}
          {isInterestData && (
            <div style={styles.actualForecastSection}>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.actualIndicator}>📊</span>
                  <span>Interest Rate:</span>
                </div>
                <span style={styles.actualValue}>
                  {data.rate.toFixed(2)}%
                </span>
              </div>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.forecastIndicator}>🔄</span>
                  <span>Change in Interest:</span>
                </div>
                <span style={{
                  ...styles.forecastValue,
                  color: data.change > 0 ? '#10b981' : data.change < 0 ? '#ef4444' : '#6b7280'
                }}>
                  {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {/* Show Actual vs Forecast comparison for forecast data types */}
          {hasActualForecast && !isCOTData && !isInterestData && (
            <div style={styles.actualForecastSection}>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.actualIndicator}>📊</span>
                  <span>Actual {data.actualLabel}:</span>
                </div>
                <span style={styles.actualValue}>
                  {data.actualValue.toFixed(2)}
                  {(selectedDataType === 'unemployment' || selectedDataType === 'inflation' || selectedDataType === 'gdp' || selectedDataType === 'mpmi' || selectedDataType === 'spmi') && '%'}
                  {selectedDataType === 'retail' && '%'}
                </span>
              </div>
              <div style={styles.actualForecastRow}>
                <div style={styles.actualForecastLabel}>
                  <span style={styles.forecastIndicator}>🎯</span>
                  <span>Forecast:</span>
                </div>
                <span style={styles.forecastValue}>
                  {data.forecastValue.toFixed(2)}
                  {(selectedDataType === 'unemployment' || selectedDataType === 'inflation' || selectedDataType === 'gdp' || selectedDataType === 'mpmi' || selectedDataType === 'spmi') && '%'}
                  {selectedDataType === 'retail' && '%'}
                </span>
              </div>
            </div>
          )}

          {/* Traditional chart data display for additional metrics */}
          {!isCOTData && !isInterestData && !hasActualForecast && (
            <div style={styles.tooltipContent}>
              {payload.map((entry, index) => (
                <div key={index} style={styles.tooltipRow}>
                  <div style={styles.tooltipColorIndicator}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: entry.color,
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}></div>
                    <span style={styles.tooltipEntryName}>
                      {entry.name}
                    </span>
                  </div>
                  <span style={styles.tooltipEntryValue}>
                    {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                    {(entry.name.includes('%') || entry.name.includes('Rate') || entry.name.includes('Percent')) && '%'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {hasVariance && hasForecastData() && !isCOTData && !isInterestData && (
            <div style={styles.varianceSection}>
              <div style={styles.varianceDivider}></div>
              <div style={styles.varianceRow}>
                <span style={styles.varianceLabel}>Variance:</span>
                <span style={{
                  ...styles.varianceValue,
                  color: data.variance > 0 ? '#10b981' : data.variance < 0 ? '#ef4444' : '#6b7280'
                }}>
                  {data.variance > 0 ? '+' : ''}{data.variance.toFixed(2)}
                  {(selectedDataType === 'unemployment' || selectedDataType === 'inflation' || selectedDataType === 'gdp' || selectedDataType === 'mpmi' || selectedDataType === 'spmi') && '%'}
                  {selectedDataType === 'retail' && '%'}
                  {data.variance > 0 ? ' ⬆️' : data.variance < 0 ? ' ⬇️' : ' ➡️'}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Handle mouse move over chart to show crosshair
  const handleMouseMove = (e) => {
    if (e && e.activeLabel !== undefined) {
      const data = getChartData();
      const activeData = data.find(d => d.date === e.activeLabel);
      if (activeData) {
        setActiveHoverData(activeData);
        setHoverLineX(e.activeLabel);
      }
    }
  };

  // Handle mouse leave chart
  const handleMouseLeave = () => {
    setActiveHoverData(null);
    setHoverLineX(null);
  };

  // Render chart based on type and data
  const renderChart = () => {
    const data = getChartData();
    const config = getDataTypeConfig();
    
    if (!data.length) return null;

    const commonProps = {
      width: 800,
      height: 400,
      data: data,
      margin: { top: 20, right: 30, left: 20, bottom: 60 },
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Hover line indicator */}
            {hoverLineX && (
              <ReferenceLine 
                x={hoverLineX} 
                stroke="#64748b" 
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.7}
              />
            )}
            {renderDataLines('area')}
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Hover line indicator */}
            {hoverLineX && (
              <ReferenceLine 
                x={hoverLineX} 
                stroke="#64748b" 
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.7}
              />
            )}
            {renderDataBars()}
          </BarChart>
        );
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Hover line indicator */}
            {hoverLineX && (
              <ReferenceLine 
                x={hoverLineX} 
                stroke="#64748b" 
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.7}
              />
            )}
            {renderDataLines('line')}
          </LineChart>
        );
    }
  };

  // Render data lines/areas based on data type
  const renderDataLines = (type) => {
    const config = getDataTypeConfig();
    const Component = type === 'area' ? Area : Line;
    const commonProps = type === 'area' ? { fillOpacity: 0.6 } : { strokeWidth: 2 };

    switch (selectedDataType) {
      case 'cot':
        return (
          <>
            <Component
              type="monotone"
              dataKey="longPercent"
              stroke="#82ca9d"
              name="Long %"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#82ca9d', strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="shortPercent"
              stroke="#ff7300"
              name="Short %"
              {...commonProps}
              dot={{ fill: '#ff7300', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ff7300', strokeWidth: 2 }}
            />
          </>
        );
      case 'employment':
        return (
          <>
            <Component
              type="monotone"
              dataKey="actual"
              stroke={config.color}
              name="Actual"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#ffc658"
              strokeDasharray="5 5"
              name="Forecast"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#ffc658', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ffc658', strokeWidth: 2 }}
            />
          </>
        );
      case 'unemployment':
        return (
          <>
            <Component
              type="monotone"
              dataKey="rate"
              stroke={config.color}
              name="Unemployment Rate %"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#ff8042"
              strokeDasharray="5 5"
              name="Forecast %"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#ff8042', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ff8042', strokeWidth: 2 }}
            />
          </>
        );
      case 'gdp':
        return (
          <>
            <Component
              type="monotone"
              dataKey="growth"
              stroke={config.color}
              name="GDP Growth %"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#8dd1e1"
              strokeDasharray="5 5"
              name="Forecast %"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#8dd1e1', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#8dd1e1', strokeWidth: 2 }}
            />
          </>
        );
      case 'mpmi':
      case 'spmi':
        return (
          <>
            <Component
              type="monotone"
              dataKey="pmi"
              stroke={config.color}
              name={`${selectedDataType.toUpperCase()} Value`}
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#ff7300"
              strokeDasharray="5 5"
              name="Forecast"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#ff7300', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ff7300', strokeWidth: 2 }}
            />
          </>
        );
      case 'retail':
        return (
          <>
            <Component
              type="monotone"
              dataKey="sales"
              stroke={config.color}
              name="Retail Sales %"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#8884d8"
              strokeDasharray="5 5"
              name="Forecast %"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#8884d8', strokeWidth: 2 }}
            />
          </>
        );
      case 'inflation':
        return (
          <>
            <Component
              type="monotone"
              dataKey="cpi"
              stroke={config.color}
              name="Core Inflation %"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#00c49f"
              strokeDasharray="5 5"
              name="Forecast %"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#00c49f', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#00c49f', strokeWidth: 2 }}
            />
          </>
        );
      case 'interest':
        return (
          <Component
            type="monotone"
            dataKey="rate"
            stroke={config.color}
            name="Interest Rate %"
            {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
            {...commonProps}
            dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
          />
        );
      case 'nfp':
        return (
          <>
            <Component
              type="monotone"
              dataKey="actual"
              stroke={config.color}
              name="Actual NFP"
              {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
              {...commonProps}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            />
            <Component
              type="monotone"
              dataKey="forecast"
              stroke="#ffbb28"
              strokeDasharray="5 5"
              name="Forecast"
              {...commonProps}
              {...(type === 'area' ? { fill: 'url(#forecastGradient)' } : {})}
              dot={{ fill: '#ffbb28', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ffbb28', strokeWidth: 2 }}
            />
          </>
        );
      default:
        return (
          <Component
            type="monotone"
            dataKey="value"
            stroke={config.color}
            name="Value"
            {...(type === 'area' ? { fill: 'url(#colorGradient)' } : {})}
            {...commonProps}
            dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
          />
        );
    }
  };

  // Render data bars for bar chart
  const renderDataBars = () => {
    const config = getDataTypeConfig();

    switch (selectedDataType) {
      case 'cot':
        return (
          <>
            <Bar dataKey="longPercent" fill="#82ca9d" name="Long %" />
            <Bar dataKey="shortPercent" fill="#ff7300" name="Short %" />
          </>
        );
      case 'employment':
        return (
          <>
            <Bar dataKey="actual" fill={config.color} name="Actual" />
            <Bar dataKey="forecast" fill="#ffc658" name="Forecast" />
          </>
        );
      case 'unemployment':
        return (
          <Bar dataKey="rate" fill={config.color} name="Unemployment Rate %" />
        );
      case 'gdp':
        return (
          <Bar dataKey="growth" fill={config.color} name="GDP Growth %" />
        );
      case 'mpmi':
      case 'spmi':
        return (
          <Bar dataKey="pmi" fill={config.color} name={`${selectedDataType.toUpperCase()} Value`} />
        );
      case 'retail':
        return (
          <Bar dataKey="sales" fill={config.color} name="Retail Sales %" />
        );
      case 'inflation':
        return (
          <Bar dataKey="cpi" fill={config.color} name="Core Inflation %" />
        );
      case 'interest':
        return (
          <Bar dataKey="rate" fill={config.color} name="Interest Rate %" />
        );
      case 'nfp':
        return (
          <>
            <Bar dataKey="actual" fill={config.color} name="Actual NFP" />
            <Bar dataKey="forecast" fill="#ffbb28" name="Forecast" />
          </>
        );
      default:
        return (
          <Bar dataKey="value" fill={config.color} name="Value" />
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📈 Trading Economics History</h1>
        <p style={styles.subtitle}>Historical analysis of economic indicators by asset with forecast/actual indicators</p>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Asset:</label>
          {assetsLoading ? (
            <div style={styles.loadingSelect}>
              <div style={styles.spinner}></div>
              <span>Loading assets...</span>
            </div>
          ) : assetsError ? (
            <div style={styles.errorSelect}>
              <span style={styles.errorText}>❌ Error loading assets</span>
              <button 
                onClick={retryAssetFetch}
                style={styles.retryButton}
              >
                Retry
              </button>
            </div>
          ) : (
            <select 
              value={selectedAsset} 
              onChange={(e) => setSelectedAsset(e.target.value)}
              style={styles.select}
            >
              {assets.map(asset => (
                <option key={asset.code} value={asset.code}>
                  {asset.code} - {asset.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Data Type:</label>
          <select 
            value={selectedDataType} 
            onChange={(e) => setSelectedDataType(e.target.value)}
            style={styles.select}
          >
            {dataTypes.map(type => (
              <option 
                key={type.value} 
                value={type.value}
                disabled={type.value === 'nfp' && selectedAsset !== 'USD'}
              >
                {type.label} {type.value === 'nfp' && selectedAsset !== 'USD' ? '(USD Only)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Timeframe:</label>
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            style={styles.select}
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            style={styles.select}
          >
            {chartTypes.map(ct => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={fetchHistoricalData}
          disabled={loading || assetsLoading}
          style={{
            ...styles.refreshButton,
            backgroundColor: (loading || assetsLoading) ? '#9ca3af' : '#2563eb',
            cursor: (loading || assetsLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Assets Error Banner */}
      {assetsError && (
        <div style={styles.errorBanner}>
          <span>⚠️ Assets loaded from fallback data due to API error: {assetsError}</span>
        </div>
      )}

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusLeft}>
          <span style={styles.statusText}>
            📊 {getDataTypeConfig().label} for {selectedAsset} | {timeframes.find(t => t.value === selectedTimeframe)?.label}
            {hasForecastData() && <span style={styles.forecastIndicator}> • Forecast/Actual View</span>}
          </span>
          {lastUpdated && (
            <span style={styles.statusTime}>
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          )}
        </div>
        <div style={styles.statusRight}>
          {historicalData.length > 0 && (
            <span style={styles.dataPoints}>
              {historicalData.length} data points
            </span>
          )}
          {assets.length > 0 && (
            <span style={styles.assetCount}>
              {assets.length} assets available
            </span>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div style={styles.chartContainer}>
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <span style={styles.loadingText}>Loading historical data...</span>
          </div>
        )}

        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorText}>❌ {error}</div>
            <button style={styles.retryButton} onClick={fetchHistoricalData}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && historicalData.length > 0 && (
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={450}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && historicalData.length === 0 && (
          <div style={styles.noDataContainer}>
            <div style={styles.noDataText}>
              📊 No historical data available for the selected criteria
            </div>
            <div style={styles.noDataSubtext}>
              Try selecting a different asset, data type, or timeframe
            </div>
          </div>
        )}
      </div>

      {/* Hover Data Panel */}
      {activeHoverData && (hasForecastData() || selectedDataType === 'cot' || selectedDataType === 'interest') && (
        <div style={styles.hoverDataPanel}>
          <h4 style={styles.hoverDataTitle}>
            {selectedDataType === 'cot' ? '📊 COT Data Analysis' : 
             selectedDataType === 'interest' ? '📈 Interest Rate Analysis' : 
             '🎯 Forecast vs Actual Analysis'}
          </h4>
          <div style={styles.hoverDataGrid}>
            <div style={styles.hoverDataCard}>
              <div style={styles.hoverDataLabel}>Date</div>
              <div style={styles.hoverDataValue}>{activeHoverData.date}</div>
            </div>
            
            {/* COT Data Display */}
            {selectedDataType === 'cot' && (
              <>
                <div style={styles.hoverDataCard}>
                  <div style={styles.hoverDataLabel}>📊 Long Positions</div>
                  <div style={styles.hoverDataValue}>{activeHoverData.longPercent.toFixed(2)}%</div>
                </div>
                <div style={styles.hoverDataCard}>
                  <div style={styles.hoverDataLabel}>📉 Short Positions</div>
                  <div style={styles.hoverDataValue}>{activeHoverData.shortPercent.toFixed(2)}%</div>
                </div>
                <div style={styles.hoverDataCard}>
                  <div style={styles.hoverDataLabel}>📈 Net Change</div>
                  <div style={{
                    ...styles.hoverDataValue,
                    color: activeHoverData.netChange > 0 ? '#10b981' : 
                           activeHoverData.netChange < 0 ? '#ef4444' : '#6b7280'
                  }}>
                    {activeHoverData.netChange > 0 ? '+' : ''}{activeHoverData.netChange.toFixed(2)}%
                  </div>
                </div>
              </>
            )}

            {/* Interest Rate Data Display */}
            {selectedDataType === 'interest' && (
              <>
                <div style={styles.hoverDataCard}>
                  <div style={styles.hoverDataLabel}>📊 Interest Rate</div>
                  <div style={styles.hoverDataValue}>{activeHoverData.rate.toFixed(2)}%</div>
                </div>
                <div style={styles.hoverDataCard}>
                  <div style={styles.hoverDataLabel}>🔄 Change in Interest</div>
                  <div style={{
                    ...styles.hoverDataValue,
                    color: activeHoverData.change > 0 ? '#10b981' : 
                           activeHoverData.change < 0 ? '#ef4444' : '#6b7280'
                  }}>
                    {activeHoverData.change > 0 ? '+' : ''}{activeHoverData.change.toFixed(2)}%
                  </div>
                </div>
              </>
            )}

            {/* Forecast Data Display */}
            {hasForecastData() && selectedDataType !== 'cot' && selectedDataType !== 'interest' && (
              <>
                {activeHoverData.actualValue !== undefined && (
                  <div style={styles.hoverDataCard}>
                    <div style={styles.hoverDataLabel}>📊 Actual {activeHoverData.actualLabel}</div>
                    <div style={styles.hoverDataValue}>
                      {activeHoverData.actualValue.toFixed(2)}
                      {(selectedDataType === 'unemployment' || selectedDataType === 'inflation' || selectedDataType === 'gdp' || selectedDataType === 'mpmi' || selectedDataType === 'spmi') && '%'}
                      {selectedDataType === 'retail' && '%'}
                    </div>
                  </div>
                )}
                {activeHoverData.forecastValue !== undefined && (
                  <div style={styles.hoverDataCard}>
                    <div style={styles.hoverDataLabel}>🎯 Forecast</div>
                    <div style={styles.hoverDataValue}>
                      {activeHoverData.forecastValue.toFixed(2)}
                      {(selectedDataType === 'unemployment' || selectedDataType === 'inflation' || selectedDataType === 'gdp' || selectedDataType === 'mpmi' || selectedDataType === 'spmi') && '%'}
                      {selectedDataType === 'retail' && '%'}
                    </div>
                  </div>
                )}
                <div style={styles.hoverDataCard}>
                  <div style={styles.hoverDataLabel}>Result</div>
                  <div style={{
                    ...styles.hoverDataValue,
                    color: activeHoverData.result === 'Beat' ? '#10b981' : 
                           activeHoverData.result === 'Miss' || activeHoverData.result === 'Missed' ? '#ef4444' : 
                           activeHoverData.result === 'As Expected' || activeHoverData.result === 'Met' ? '#3b82f6' : '#6b7280'
                  }}>
                    {activeHoverData.result || 'N/A'}
                  </div>
                </div>
                {activeHoverData.variance !== undefined && (
                  <div style={styles.hoverDataCard}>
                    <div style={styles.hoverDataLabel}>Variance</div>
                    <div style={{
                      ...styles.hoverDataValue,
                      color: activeHoverData.variance > 0 ? '#10b981' : 
                             activeHoverData.variance < 0 ? '#ef4444' : '#6b7280'
                    }}>
                      {activeHoverData.variance > 0 ? '+' : ''}{activeHoverData.variance.toFixed(2)}
                      {(selectedDataType === 'unemployment' || selectedDataType === 'inflation' || selectedDataType === 'gdp' || selectedDataType === 'mpmi' || selectedDataType === 'spmi') && '%'}
                      {selectedDataType === 'retail' && '%'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Data Summary */}
      {!loading && historicalData.length > 0 && (
        <div style={styles.summaryContainer}>
          <h3 style={styles.summaryTitle}>📊 Data Summary</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Data Points</div>
              <div style={styles.summaryValue}>{historicalData.length}</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Period</div>
              <div style={styles.summaryValue}>
                {timeframes.find(t => t.value === selectedTimeframe)?.label}
              </div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Asset</div>
              <div style={styles.summaryValue}>
                {assets.find(a => a.code === selectedAsset)?.name || selectedAsset}
              </div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Indicator</div>
              <div style={styles.summaryValue}>{getDataTypeConfig().label}</div>
            </div>
            {hasForecastData() && (
              <>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>Data Type</div>
                  <div style={styles.summaryValue}>📊 Actual vs 🎯 Forecast</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>Variance Analysis</div>
                  <div style={styles.summaryValue}>✅ Available</div>
                </div>
              </>
            )}
            {!hasForecastData() && (
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Data Type</div>
                <div style={styles.summaryValue}>📊 Historical Values</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <h3 style={styles.infoPanelTitle}>ℹ️ About Economic Indicators & Features</h3>
        <div style={styles.infoPanelContent}>
          <div style={styles.infoSection}>
            <h4 style={styles.infoSectionTitle}>🎯 Interactive Features:</h4>
            <ul style={styles.infoList}>
              <li><strong>Hover Line Indicator:</strong> Move your mouse over the chart to see a vertical crosshair line</li>
              <li><strong>Enhanced Tooltips:</strong> Hover to see detailed actual vs forecast comparisons with variance calculations</li>
              <li><strong>Result Indicators:</strong> Color-coded badges show if actual results Beat, Met, or Missed forecasts</li>
              <li><strong>Active Data Panel:</strong> Real-time analysis panel appears when hovering over forecast data types</li>
              <li><strong>Actual vs Forecast Display:</strong> Clear separation showing actual values (📊) vs forecast values (🎯)</li>
            </ul>
          </div>
          
          <div style={styles.infoSection}>
            <h4 style={styles.infoSectionTitle}>📊 Economic Indicators & Data Types:</h4>
            <ul style={styles.infoList}>
              <li><strong>COT (Commitment of Traders):</strong> Shows the positions of large institutional traders in futures markets (Historical values only)</li>
              <li><strong>Employment Change:</strong> Monthly employment change (actual vs forecast) - displays in thousands (K)</li>
              <li><strong>Unemployment Rate:</strong> Percentage of unemployed labor force (actual vs forecast) - displays as percentage (%)</li>
              <li><strong>GDP Growth:</strong> Quarterly economic growth rate (actual vs forecast) - displays as percentage (%)</li>
              <li><strong>Manufacturing PMI:</strong> Manufacturing activity indicator (actual vs forecast) - displays as index value</li>
              <li><strong>Services PMI:</strong> Services sector activity indicator (actual vs forecast) - displays as index value</li>
              <li><strong>Retail Sales:</strong> Monthly retail sales change (actual vs forecast) - displays as percentage (%)</li>
              <li><strong>Core Inflation:</strong> Consumer price index excluding volatile items (actual vs forecast) - displays as percentage (%)</li>
              <li><strong>Interest Rates:</strong> Central bank policy rates (Historical values only) - displays as percentage (%)</li>
              <li><strong>NFP (Non-Farm Payrolls):</strong> US employment report (actual vs forecast) - displays in thousands (K), USD only</li>
            </ul>
          </div>

          <div style={styles.infoSection}>
            <h4 style={styles.infoSectionTitle}>📈 Understanding Results:</h4>
            <ul style={styles.infoList}>
              <li><strong>Beat (Green):</strong> Actual value exceeded forecast expectations</li>
              <li><strong>Met/As Expected (Blue):</strong> Actual value matched forecast expectations</li>
              <li><strong>Miss/Missed (Red):</strong> Actual value fell short of forecast expectations</li>
              <li><strong>Variance:</strong> The difference between actual and forecast values (positive means better than expected)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced CSS styles with new hover features
const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0'
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'end',
    justifyContent: 'center',
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '180px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
    minWidth: '180px'
  },
  loadingSelect: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    minWidth: '180px'
  },
  errorSelect: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px 12px',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '12px',
    backgroundColor: '#fef2f2',
    minWidth: '180px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '12px'
  },
  refreshButton: {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    height: 'fit-content'
  },
  errorBanner: {
    padding: '12px 16px',
    backgroundColor: '#fef3cd',
    color: '#856404',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid #ffeaa7'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0'
  },
  statusLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  forecastIndicator: {
    fontSize: '12px',
    color: '#2563eb',
    fontWeight: '400'
  },
  statusTime: {
    fontSize: '12px',
    color: '#6b7280'
  },
  statusRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-end'
  },
  dataPoints: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500'
  },
  assetCount: {
    fontSize: '12px',
    color: '#6b7280'
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    position: 'relative',
    minHeight: '500px'
  },
  chartWrapper: {
    width: '100%',
    height: '450px'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    flexDirection: 'column',
    gap: '16px'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    gap: '16px'
  },
  retryButton: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  noDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    gap: '8px'
  },
  noDataText: {
    color: '#6b7280',
    fontSize: '18px',
    fontWeight: '500'
  },
  noDataSubtext: {
    color: '#9ca3af',
    fontSize: '14px'
  },
  
  // Enhanced tooltip styles
  enhancedTooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '13px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    minWidth: '200px',
    maxWidth: '320px'
  },
  tooltipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #f1f5f9'
  },
  tooltipLabel: {
    fontWeight: '600',
    color: '#1e293b',
    margin: '0'
  },
  resultBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    color: 'white',
    fontWeight: '500'
  },
  actualForecastSection: {
    marginBottom: '12px',
    padding: '8px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  actualForecastRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  actualForecastLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#475569',
    fontWeight: '500'
  },
  actualIndicator: {
    marginRight: '6px',
    fontSize: '14px'
  },
  forecastIndicator: {
    marginRight: '6px',
    fontSize: '14px'
  },
  actualValue: {
    fontSize: '13px',
    color: '#059669',
    fontWeight: '600'
  },
  forecastValue: {
    fontSize: '13px',
    color: '#dc2626',
    fontWeight: '600'
  },
  tooltipContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tooltipColorIndicator: {
    display: 'flex',
    alignItems: 'center'
  },
  tooltipEntryName: {
    fontSize: '12px',
    color: '#475569',
    fontWeight: '500'
  },
  tooltipEntryValue: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '600'
  },
  varianceSection: {
    marginTop: '8px',
    paddingTop: '8px'
  },
  varianceDivider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    marginBottom: '8px'
  },
  varianceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  varianceLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500'
  },
  varianceValue: {
    fontSize: '13px',
    fontWeight: '600'
  },

  // Hover data panel styles
  hoverDataPanel: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e0f2fe'
  },
  hoverDataTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    margin: '0 0 16px 0'
  },
  hoverDataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  hoverDataCard: {
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  hoverDataLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '4px',
    textTransform: 'uppercase'
  },
  hoverDataValue: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '600'
  },

  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    margin: '0 0 16px 0'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  summaryCard: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '4px'
  },
  summaryValue: {
    fontSize: '18px',
    color: '#1e293b',
    fontWeight: '600'
  },
  infoPanel: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  infoPanelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    margin: '0 0 16px 0'
  },
  infoPanelContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#4b5563'
  },
  infoSection: {
    marginBottom: '20px'
  },
  infoSectionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
    margin: '0 0 8px 0'
  },
  infoList: {
    margin: '0',
    paddingLeft: '20px'
  }
};

// Add keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the keyframes into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = spinKeyframes;
  document.head.appendChild(styleSheet);
}

export default TradingEconomicsHistory;