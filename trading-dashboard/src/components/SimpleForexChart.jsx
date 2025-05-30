// // import React, { useEffect, useState, useCallback } from 'react';
// // import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// // const SimpleForexChart = ({ instrument = 'EUR_USD' }) => {
// //   const [data, setData] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // Mock data generator for demonstration since OANDA API won't work in this environment
// //   const generateMockData = useCallback(() => {
// //     const baseRate = instrument === 'EUR_USD' ? 1.0850 : 
// //                      instrument === 'GBP_USD' ? 1.2650 : 
// //                      instrument === 'USD_JPY' ? 150.25 : 1.0000;
    
// //     const mockData = [];
// //     const now = new Date();
    
// //     for (let i = 59; i >= 0; i--) {
// //       const time = new Date(now.getTime() - i * 5000); // 5-second intervals
// //       const randomVariation = (Math.random() - 0.5) * 0.002; // Small random variation
// //       const rate = baseRate + randomVariation + Math.sin(i * 0.1) * 0.001; // Add some wave pattern
      
// //       mockData.push({
// //         time: time.toLocaleTimeString(),
// //         rate: parseFloat(rate.toFixed(5)),
// //         timestamp: time.getTime()
// //       });
// //     }
    
// //     return mockData;
// //   }, [instrument]);

// //   const fetchForexData = useCallback(async () => {
// //     setIsLoading(true);
// //     setError(null);
    
// //     try {
// //       // In a real application, you would use your API key like this:
// //       // const OANDA_API_KEY = process.env.REACT_APP_OANDA_API_KEY || process.env.VITE_OANDA_API_KEY;
      
// //       // For demonstration, we'll use mock data since OANDA API requires:
// //       // 1. Valid API key
// //       // 2. CORS proxy or server-side requests
// //       // 3. Proper authentication headers
      
// //       // Simulate API delay
// //       await new Promise(resolve => setTimeout(resolve, 500));
      
// //       // Use mock data for demonstration
// //       const chartData = generateMockData();
// //       setData(chartData);
      
// //       // Real OANDA API call would look like this:
// //       /*
// //       const OANDA_API_URL = 'https://api-fxpractice.oanda.com/v3';
// //       const response = await fetch(`${OANDA_API_URL}/instruments/${instrument}/candles?granularity=S5&count=60&price=M`, {
// //         headers: {
// //           'Authorization': `Bearer ${OANDA_API_KEY}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const result = await response.json();
// //       const chartData = result.candles.map(candle => ({
// //         time: new Date(candle.time).toLocaleTimeString(),
// //         rate: parseFloat(candle.mid.c),
// //         timestamp: new Date(candle.time).getTime()
// //       }));
// //       setData(chartData);
// //       */
      
// //     } catch (err) {
// //       console.error('Error fetching forex data:', err);
// //       setError(err.message);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [instrument, generateMockData]);

// //   useEffect(() => {
// //     fetchForexData();
// //     const interval = setInterval(fetchForexData, 10000); // refresh every 10 seconds
// //     return () => clearInterval(interval);
// //   }, [fetchForexData]);

// //   const customTooltip = ({ active, payload }) => {
// //     if (active && payload && payload.length) {
// //       const { time, rate } = payload[0].payload;
// //       return (
// //         <div className="bg-white p-2 border rounded shadow text-sm">
// //           <p className="font-medium">{time}</p>
// //           <p className="text-blue-600">{instrument}: {rate.toFixed(5)}</p>
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="w-full bg-white rounded-lg shadow p-4">
// //         <div className="flex items-center justify-center h-64">
// //           <p className="text-gray-600">Loading forex data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="w-full bg-white rounded-lg shadow p-4">
// //         <div className="flex items-center justify-center h-64">
// //           <div className="text-center">
// //             <p className="text-red-600 mb-2">Error: {error}</p>
// //             <button 
// //               onClick={fetchForexData}
// //               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!data || data.length === 0) {
// //     return (
// //       <div className="w-full bg-white rounded-lg shadow p-4">
// //         <div className="flex items-center justify-center h-64">
// //           <p className="text-gray-600">No data available</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const rates = data.map(d => d.rate);
// //   const minRate = Math.min(...rates);
// //   const maxRate = Math.max(...rates);
// //   const yAxisPadding = (maxRate - minRate) * 0.1 || 0.001; // Fallback for very small ranges

// //   return (
// //     <div className="w-full bg-white rounded-lg shadow-lg p-6">
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-xl font-bold text-gray-800">
// //           {instrument.replace('_', '/')} Real-Time Exchange Rate
// //         </h2>
// //         <div className="flex items-center space-x-2">
// //           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// //           <span className="text-sm text-gray-600">Live</span>
// //         </div>
// //       </div>
      
// //       <div className="mb-2">
// //         <p className="text-sm text-gray-600">
// //           Current Rate: <span className="font-mono font-bold text-lg text-blue-600">
// //             {data[data.length - 1]?.rate.toFixed(5)}
// //           </span>
// //         </p>
// //       </div>

// //       <ResponsiveContainer width="100%" height={400}>
// //         <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
// //           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //           <XAxis 
// //             dataKey="time" 
// //             tick={{ fontSize: 12 }}
// //             tickFormatter={(value) => value.split(':').slice(0, 2).join(':')} // Show only HH:MM
// //           />
// //           <YAxis 
// //             domain={[minRate - yAxisPadding, maxRate + yAxisPadding]}
// //             tick={{ fontSize: 12 }}
// //             tickFormatter={(value) => value.toFixed(5)}
// //           />
// //           <Tooltip content={customTooltip} />
// //           <Line 
// //             type="monotone" 
// //             dataKey="rate" 
// //             stroke="#2563eb" 
// //             strokeWidth={2}
// //             dot={false}
// //             activeDot={{ r: 4, fill: '#2563eb' }}
// //           />
// //         </LineChart>
// //       </ResponsiveContainer>
      
// //       <div className="mt-4 text-xs text-gray-500 text-center">
// //         <p>Demo data - Updates every 10 seconds</p>
// //         <p>In production, connect to OANDA API with proper authentication</p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SimpleForexChart;
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// const SimpleForexChart = ({ instrument: initialInstrument = 'EUR_USD' }) => {
//   const [selectedInstrument, setSelectedInstrument] = useState(initialInstrument);
//   const [data, setData] = useState([]);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [priceChange, setPriceChange] = useState(0);
//   const [isLive, setIsLive] = useState(true);
//   const intervalRef = useRef(null);
//   const lastPriceRef = useRef(0);
//   const volatilityRef = useRef(0.0001);
//   const trendRef = useRef(0);
//   const momentumRef = useRef(0);

//   // Realistic forex pair configurations
//   const forexConfig = {
//     'EUR_USD': { base: 1.0850, volatility: 0.0002, spread: 0.00015, name: 'EUR/USD', flag: '🇪🇺/🇺🇸' },
//     'GBP_USD': { base: 1.2650, volatility: 0.0003, spread: 0.00020, name: 'GBP/USD', flag: '🇬🇧/🇺🇸' },
//     'USD_JPY': { base: 150.25, volatility: 0.05, spread: 0.02, name: 'USD/JPY', flag: '🇺🇸/🇯🇵' },
//     'AUD_USD': { base: 0.6650, volatility: 0.0003, spread: 0.00018, name: 'AUD/USD', flag: '🇦🇺/🇺🇸' },
//     'USD_CHF': { base: 0.8750, volatility: 0.0002, spread: 0.00016, name: 'USD/CHF', flag: '🇺🇸/🇨🇭' },
//     'EUR_GBP': { base: 0.8580, volatility: 0.0002, spread: 0.00014, name: 'EUR/GBP', flag: '🇪🇺/🇬🇧' },
//     'USD_CAD': { base: 1.3450, volatility: 0.0002, spread: 0.00017, name: 'USD/CAD', flag: '🇺🇸/🇨🇦' },
//     'NZD_USD': { base: 0.6150, volatility: 0.0004, spread: 0.00022, name: 'NZD/USD', flag: '🇳🇿/🇺🇸' },
//     'EUR_JPY': { base: 162.50, volatility: 0.08, spread: 0.025, name: 'EUR/JPY', flag: '🇪🇺/🇯🇵' },
//     'GBP_JPY': { base: 190.15, volatility: 0.12, spread: 0.035, name: 'GBP/JPY', flag: '🇬🇧/🇯🇵' }
//   };

//   const config = forexConfig[selectedInstrument] || forexConfig['EUR_USD'];

//   // Generate realistic price movement
//   const generateRealisticPrice = useCallback((lastPrice) => {
//     // Market noise (random walk)
//     const noise = (Math.random() - 0.5) * config.volatility * 2;
    
//     // Trend momentum (creates temporary trends)
//     if (Math.random() < 0.05) { // 5% chance to change trend
//       trendRef.current = (Math.random() - 0.5) * config.volatility * 0.5;
//     }
    
//     // Momentum decay
//     momentumRef.current *= 0.95;
//     momentumRef.current += trendRef.current * 0.1;
    
//     // Mean reversion (pulls price back to base)
//     const meanReversion = (config.base - lastPrice) * 0.001;
    
//     // Volatility clustering (high volatility periods)
//     if (Math.random() < 0.02) { // 2% chance for volatility spike
//       volatilityRef.current = Math.min(volatilityRef.current * 1.5, config.volatility * 3);
//     } else {
//       volatilityRef.current = Math.max(volatilityRef.current * 0.99, config.volatility);
//     }
    
//     // Combine all factors
//     const priceChange = noise + momentumRef.current + meanReversion;
//     const newPrice = lastPrice + priceChange * (1 + volatilityRef.current / config.volatility);
    
//     // Ensure price doesn't deviate too much from base
//     const maxDeviation = config.base * 0.02; // 2% max deviation
//     return Math.max(
//       config.base - maxDeviation,
//       Math.min(config.base + maxDeviation, newPrice)
//     );
//   }, [config]);

//   // Initialize chart with historical-looking data
//   const initializeData = useCallback(() => {
//     const initialData = [];
//     const now = new Date();
//     let price = config.base;
//     lastPriceRef.current = price;
    
//     // Generate 200 data points (20 seconds of history at 100ms intervals)
//     for (let i = 199; i >= 0; i--) {
//       const time = new Date(now.getTime() - i * 100);
//       price = generateRealisticPrice(price);
      
//       initialData.push({
//         time: time.toLocaleTimeString('en-US', { 
//           hour12: false, 
//           hour: '2-digit', 
//           minute: '2-digit', 
//           second: '2-digit' 
//         }) + '.' + Math.floor(time.getMilliseconds() / 100),
//         rate: parseFloat(price.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)),
//         timestamp: time.getTime(),
//         isNew: false
//       });
//     }
    
//     setData(initialData);
//     setCurrentPrice(price);
//     lastPriceRef.current = price;
//   }, [config, generateRealisticPrice, selectedInstrument]);

//   // Add new live data point
//   const addLiveDataPoint = useCallback(() => {
//     if (!isLive) return;
    
//     const now = new Date();
//     const newPrice = generateRealisticPrice(lastPriceRef.current);
//     const change = newPrice - lastPriceRef.current;
    
//     const newPoint = {
//       time: now.toLocaleTimeString('en-US', { 
//         hour12: false, 
//         hour: '2-digit', 
//         minute: '2-digit', 
//         second: '2-digit' 
//       }) + '.' + Math.floor(now.getMilliseconds() / 100),
//       rate: parseFloat(newPrice.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)),
//       timestamp: now.getTime(),
//       isNew: true
//     };
    
//     setData(prevData => {
//       const newData = [...prevData.slice(1), newPoint]; // Keep last 200 points for smooth tracer
//       return newData;
//     });
    
//     setCurrentPrice(newPrice);
//     setPriceChange(change);
//     lastPriceRef.current = newPrice;
//   }, [generateRealisticPrice, isLive, selectedInstrument]);

//   // Start/stop live updates
//   const toggleLiveUpdates = useCallback(() => {
//     setIsLive(prev => !prev);
//   }, []);

//   // Handle live updates with useEffect
//   useEffect(() => {
//     if (!isLive) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       return;
//     }

//     intervalRef.current = setInterval(addLiveDataPoint, 100000); // Ultra-fast 100ms updates
    
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [isLive, addLiveDataPoint]);

//   // Initialize data only once on mount
//   useEffect(() => {
//     initializeData();
//   }, [selectedInstrument]); // Re-initialize when instrument changes

//   // Handle instrument change
//   const handleInstrumentChange = (newInstrument) => {
//     setSelectedInstrument(newInstrument);
//     // Reset volatility and trend for new instrument
//     volatilityRef.current = forexConfig[newInstrument].volatility;
//     trendRef.current = 0;
//     momentumRef.current = 0;
//   };

//   // Custom tooltip
//   const customTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const { time, rate } = payload[0].payload;
//       return (
//         <div className="bg-black-800/80 text-white p-3 border border-black-600/50 rounded shadow-lg text-sm backdrop-blur-sm">
//           <p className="font-medium">{time}</p>
//           <p className="text-blue-400">{config.name}: {rate}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculate price statistics
//   const rates = data.map(d => d.rate);
//   const minRate = Math.min(...rates);
//   const maxRate = Math.max(...rates);
//   const yAxisPadding = (maxRate - minRate) * 0.1 || 0.001;

//   // Price change styling
//   const priceChangeClass = priceChange > 0 ? 'text-green-500' : 
//                           priceChange < 0 ? 'text-red-500' : 'text-gray-500';
//   const priceChangeIcon = priceChange > 0 ? '↗' : 
//                          priceChange < 0 ? '↘' : '→';

//   return (
//     <div className="w-full bg-black-900 text-white rounded-lg shadow-2xl overflow-hidden relative" 
//          style={{
//            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #1E293B 75%, #0F172A 100%)',
//            backgroundSize: '400% 400%',
//            animation: 'backgroundShift 8s ease infinite'
//          }}>
//       <style jsx>{`
//         @keyframes backgroundShift {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>
//       {/* Header */}
//       <div className="bg-black-800/90 backdrop-blur-sm px-6 py-4 border-b border-gray-700/50">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-2xl font-bold">{config.flag} {config.name}</h1>
//             <div className="flex items-center space-x-2">
//               <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//               <span className="text-sm text-gray-400">{isLive ? 'LIVE' : 'PAUSED'}</span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3 ">
//             {/* Currency Pair Selector */}
//             <select
//               value={selectedInstrument}
//               onChange={(e) => handleInstrumentChange(e.target.value)}
//               className="bg-black-700 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
//                style={{
//            background: 'black'

//          }}
//             >
//               {Object.entries(forexConfig).map(([key, value]) => (
//                 <option key={key} value={key}>
//                   {value.flag} {value.name}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={toggleLiveUpdates}
//               className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
//                 isLive 
//                   ? 'bg-red-600 hover:bg-red-700 text-white' 
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//               style={{
//            background: 'red'
           
//          }}
//             >
//               {isLive ? 'PAUSE' : 'START'}
//             </button>
//           </div>
//         </div>
        
//         {/* Price Display */}
//         <div className="mt-4 flex items-center space-x-6">
//           <div className="text-3xl font-mono font-bold animate-pulse">
//             {currentPrice.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}
//           </div>
//           <div className={`text-lg font-medium ${priceChangeClass} flex items-center space-x-1 transition-all duration-100`}>
//             <span className="text-2xl animate-bounce">{priceChangeIcon}</span>
//             <span className="animate-pulse">{Math.abs(priceChange).toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</span>
//           </div>
//           <div className="text-sm text-gray-400">
//             <div>Spread: {config.spread.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</div>
//             <div>Vol: <span className="text-yellow-400 animate-pulse">{(volatilityRef.current * 10000).toFixed(1)} pips</span></div>
//           </div>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="p-6 bg-black/20 backdrop-blur-sm">
//         <ResponsiveContainer width="100%" height={450}>
//           <LineChart 
//             data={data} 
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
//             <XAxis 
//               dataKey="time" 
//               tick={{ fontSize: 12, fill: '#9CA3AF' }}
//               tickFormatter={(value) => {
//                 const parts = value.split('.');
//                 return parts[0].split(':').slice(1, 3).join(':') + (parts[1] ? '.' + parts[1] : '');
//               }}
//               stroke="#4B5563"
//             />
//             <YAxis 
//               domain={[minRate - yAxisPadding, maxRate + yAxisPadding]}
//               tick={{ fontSize: 12, fill: '#9CA3AF' }}
//               tickFormatter={(value) => value.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}
//               stroke="#4B5563"
//             />
//             <Tooltip content={customTooltip} />
//             <Line 
//               type="monotone" 
//               dataKey="rate" 
//               stroke="url(#lineGradient)"
//               strokeWidth={3}
//               dot={false}
//               activeDot={{ 
//                 r: 8, 
//                 fill: '#EF4444', 
//                 stroke: '#FEF2F2', 
//                 strokeWidth: 3,
//                 filter: 'drop-shadow(0 0 8px #EF4444)'
//               }}
//             />
//             <defs>
//               <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.3} />
//                 <stop offset="70%" stopColor="#3B82F6" stopOpacity={0.8} />
//                 <stop offset="100%" stopColor="#EF4444" stopOpacity={1} />
//               </linearGradient>
//             </defs>
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Market Info */}
//       <div className="bg-gray-800/90 backdrop-blur-sm px-6 py-3 text-xs text-gray-400 border-t border-gray-700/50">
//         <div className="flex justify-between items-center">
//           <div>
//             Market Hours: 24/5 • Last Update: <span className="text-green-400 animate-pulse">{data[data.length - 1]?.time || '--:--:--.--'}</span>
//           </div>
//           <div className="flex space-x-4">
//             <span>High: {maxRate.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</span>
//             <span>Low: {minRate.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimpleForexChart;
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// const SimpleForexChart = ({ instrument: initialInstrument = 'EUR_USD' }) => {
//   const [selectedInstrument, setSelectedInstrument] = useState(initialInstrument);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
//   const [data, setData] = useState([]);
//   const [currentCandle, setCurrentCandle] = useState(null);
//   const [priceChange, setPriceChange] = useState(0);
//   const [isLive, setIsLive] = useState(true);
//   const [showAnatomy, setShowAnatomy] = useState(false);
//   const intervalRef = useRef(null);
//   const lastPriceRef = useRef(0);
//   const volatilityRef = useRef(0.0001);
//   const trendRef = useRef(0);
//   const momentumRef = useRef(0);
//   const currentCandleRef = useRef(null);

//   // Timeframe configurations (minimum 1 minute)
//   const timeframes = {
//     '1M': { interval: 60000, label: '1 Minute', maxCandles: 50 },
//     '5M': { interval: 300000, label: '5 Minutes', maxCandles: 50 },
//     '15M': { interval: 900000, label: '15 Minutes', maxCandles: 50 },
//     '1H': { interval: 3600000, label: '1 Hour', maxCandles: 50 },
//     '4H': { interval: 14400000, label: '4 Hours', maxCandles: 50 },
//     '1D': { interval: 86400000, label: '1 Day', maxCandles: 50 }
//   };

//   // Realistic forex pair configurations
//   const forexConfig = {
//     'EUR_USD': { base: 1.0850, volatility: 0.0002, spread: 0.00015, name: 'EUR/USD', flag: '🇪🇺/🇺🇸' },
//     'GBP_USD': { base: 1.2650, volatility: 0.0003, spread: 0.00020, name: 'GBP/USD', flag: '🇬🇧/🇺🇸' },
//     'USD_JPY': { base: 150.25, volatility: 0.05, spread: 0.02, name: 'USD/JPY', flag: '🇺🇸/🇯🇵' },
//     'AUD_USD': { base: 0.6650, volatility: 0.0003, spread: 0.00018, name: 'AUD/USD', flag: '🇦🇺/🇺🇸' },
//     'USD_CHF': { base: 0.8750, volatility: 0.0002, spread: 0.00016, name: 'USD/CHF', flag: '🇺🇸/🇨🇭' },
//     'EUR_GBP': { base: 0.8580, volatility: 0.0002, spread: 0.00014, name: 'EUR/GBP', flag: '🇪🇺/🇬🇧' },
//     'USD_CAD': { base: 1.3450, volatility: 0.0002, spread: 0.00017, name: 'USD/CAD', flag: '🇺🇸/🇨🇦' },
//     'NZD_USD': { base: 0.6150, volatility: 0.0004, spread: 0.00022, name: 'NZD/USD', flag: '🇳🇿/🇺🇸' },
//     'EUR_JPY': { base: 162.50, volatility: 0.08, spread: 0.025, name: 'EUR/JPY', flag: '🇪🇺/🇯🇵' },
//     'GBP_JPY': { base: 190.15, volatility: 0.12, spread: 0.035, name: 'GBP/JPY', flag: '🇬🇧/🇯🇵' }
//   };

//   const config = forexConfig[selectedInstrument] || forexConfig['EUR_USD'];
//   const timeframeConfig = timeframes[selectedTimeframe];

//   // Generate realistic price movement
//   const generateRealisticPrice = useCallback((lastPrice) => {
//     const noise = (Math.random() - 0.5) * config.volatility * 2;
    
//     if (Math.random() < 0.05) {
//       trendRef.current = (Math.random() - 0.5) * config.volatility * 0.5;
//     }
    
//     momentumRef.current *= 0.95;
//     momentumRef.current += trendRef.current * 0.1;
    
//     const meanReversion = (config.base - lastPrice) * 0.001;
    
//     if (Math.random() < 0.02) {
//       volatilityRef.current = Math.min(volatilityRef.current * 1.5, config.volatility * 3);
//     } else {
//       volatilityRef.current = Math.max(volatilityRef.current * 0.99, config.volatility);
//     }
    
//     const priceChange = noise + momentumRef.current + meanReversion;
//     const newPrice = lastPrice + priceChange * (1 + volatilityRef.current / config.volatility);
    
//     const maxDeviation = config.base * 0.02;
//     return Math.max(
//       config.base - maxDeviation,
//       Math.min(config.base + maxDeviation, newPrice)
//     );
//   }, [config]);

//   // Create candlestick data
//   const createCandle = useCallback((startTime, endTime, startPrice) => {
//     const tickCount = Math.max(10, Math.floor(timeframeConfig.interval / 5000)); // At least 10 ticks per candle
//     let open = startPrice;
//     let high = startPrice;
//     let low = startPrice;
//     let close = startPrice;
//     let currentPrice = startPrice;

//     for (let i = 0; i < tickCount; i++) {
//       currentPrice = generateRealisticPrice(currentPrice);
//       high = Math.max(high, currentPrice);
//       low = Math.min(low, currentPrice);
//     }
//     close = currentPrice;

//     const precision = selectedInstrument.includes('JPY') ? 2 : 5;
    
//     return {
//       time: startTime,
//       timestamp: startTime,
//       open: parseFloat(open.toFixed(precision)),
//       high: parseFloat(high.toFixed(precision)),
//       low: parseFloat(low.toFixed(precision)),
//       close: parseFloat(close.toFixed(precision)),
//       // For recharts bar chart representation
//       body: Math.abs(close - open),
//       bodyStart: Math.min(open, close),
//       upperWick: high - Math.max(open, close),
//       lowerWick: Math.min(open, close) - low,
//       isGreen: close >= open
//     };
//   }, [generateRealisticPrice, selectedInstrument, timeframeConfig.interval]);

//   // Initialize chart with historical candlestick data
//   const initializeData = useCallback(() => {
//     const initialData = [];
//     const now = new Date();
//     let price = config.base;
//     lastPriceRef.current = price;

//     // Generate historical candles
//     for (let i = timeframeConfig.maxCandles - 1; i >= 0; i--) {
//       const candleStartTime = now.getTime() - i * timeframeConfig.interval;
//       const candle = createCandle(candleStartTime, candleStartTime + timeframeConfig.interval, price);
//       price = candle.close;
//       initialData.push(candle);
//     }

//     setData(initialData);
//     setCurrentCandle(null);
//     lastPriceRef.current = price;
//     currentCandleRef.current = null;
//   }, [config, createCandle, timeframeConfig]);

//   // Update current candle or create new one
//   const updateCandles = useCallback(() => {
//     if (!isLive) return;

//     const now = new Date();
//     const currentTime = now.getTime();
    
//     setData(prevData => {
//       const lastCandle = prevData[prevData.length - 1];
//       const timeSinceLastCandle = currentTime - lastCandle.timestamp;
      
//       if (timeSinceLastCandle >= timeframeConfig.interval) {
//         // Create new candle
//         const newCandle = createCandle(currentTime, currentTime + timeframeConfig.interval, lastPriceRef.current);
//         lastPriceRef.current = newCandle.close;
        
//         // Remove oldest candle and add new one
//         const newData = [...prevData.slice(1), newCandle];
//         currentCandleRef.current = newCandle;
//         setCurrentCandle(newCandle);
//         setPriceChange(newCandle.close - newCandle.open);
        
//         return newData;
//       } else {
//         // Update current candle
//         const updatedCandle = createCandle(lastCandle.timestamp, lastCandle.timestamp + timeframeConfig.interval, lastCandle.open);
//         lastPriceRef.current = updatedCandle.close;
        
//         const newData = [...prevData.slice(0, -1), updatedCandle];
//         currentCandleRef.current = updatedCandle;
//         setCurrentCandle(updatedCandle);
//         setPriceChange(updatedCandle.close - updatedCandle.open);
        
//         return newData;
//       }
//     });
//   }, [createCandle, isLive, timeframeConfig.interval]);

//   // Handle live updates
//   useEffect(() => {
//     if (!isLive) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       return;
//     }

//     intervalRef.current = setInterval(updateCandles, 1000); // Update every second
    
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [isLive, updateCandles]);

//   // Initialize data when instrument or timeframe changes
//   useEffect(() => {
//     initializeData();
//   }, [selectedInstrument, selectedTimeframe]);

//   // Handle instrument change
//   const handleInstrumentChange = (newInstrument) => {
//     setSelectedInstrument(newInstrument);
//     volatilityRef.current = forexConfig[newInstrument].volatility;
//     trendRef.current = 0;
//     momentumRef.current = 0;
//   };

//   // Handle timeframe change
//   const handleTimeframeChange = (newTimeframe) => {
//     setSelectedTimeframe(newTimeframe);
//   };

//   // Toggle live updates
//   const toggleLiveUpdates = useCallback(() => {
//     setIsLive(prev => !prev);
//   }, []);

//   // Custom candlestick chart component using bars
//   const CandlestickBar = (props) => {
//     const { payload, x, width } = props;
//     if (!payload) return null;

//     const { open, high, low, close, isGreen } = payload;
//     const candleWidth = Math.max(width * 0.6, 3);
//     const wickWidth = Math.max(1, candleWidth * 0.1);
    
//     // Scale values to chart coordinates
//     const yScale = props.yScale || ((val) => val);
    
//     const openY = yScale(open);
//     const closeY = yScale(close);
//     const highY = yScale(high);
//     const lowY = yScale(low);
    
//     const bodyTop = Math.min(openY, closeY);
//     const bodyHeight = Math.abs(openY - closeY);
    
//     const color = isGreen ? '#10B981' : '#EF4444';
//     const wickColor = isGreen ? '#059669' : '#DC2626';
    
//     return (
//       <g>
//         {/* Upper wick */}
//         <line
//           x1={x + width / 2}
//           y1={highY}
//           x2={x + width / 2}
//           y2={Math.min(openY, closeY)}
//           stroke={wickColor}
//           strokeWidth={wickWidth}
//         />
//         {/* Lower wick */}
//         <line
//           x1={x + width / 2}
//           y1={Math.max(openY, closeY)}
//           x2={x + width / 2}
//           y2={lowY}
//           stroke={wickColor}
//           strokeWidth={wickWidth}
//         />
//         {/* Body */}
//         <rect
//           x={x + (width - candleWidth) / 2}
//           y={bodyTop}
//           width={candleWidth}
//           height={Math.max(bodyHeight, 1)}
//           fill={color}
//           stroke={color}
//           strokeWidth={0.5}
//         />
//       </g>
//     );
//   };

//   // Custom tooltip
//   const customTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       const timeStr = new Date(data.timestamp).toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
      
//       return (
//         <div className="bg-gray-800/95 text-white p-4 border border-gray-600/50 rounded shadow-lg text-sm backdrop-blur-sm">
//           <p className="font-medium mb-2">{timeStr}</p>
//           <div className="space-y-1">
//             <p><span className="text-blue-400">Open:</span> {data.open}</p>
//             <p><span className="text-green-400">High:</span> {data.high}</p>
//             <p><span className="text-red-400">Low:</span> {data.low}</p>
//             <p><span className="text-yellow-400">Close:</span> {data.close}</p>
//             <p><span className="text-gray-400">Change:</span> 
//               <span className={data.isGreen ? 'text-green-400' : 'text-red-400'}>
//                 {' '}{(data.close - data.open).toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}
//               </span>
//             </p>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculate price statistics
//   const rates = data.map(d => [d.open, d.high, d.low, d.close]).flat();
//   const minRate = Math.min(...rates);
//   const maxRate = Math.max(...rates);
//   const yAxisPadding = (maxRate - minRate) * 0.1 || 0.001;

//   // Price change styling
//   const priceChangeClass = priceChange > 0 ? 'text-green-500' : 
//                           priceChange < 0 ? 'text-red-500' : 'text-gray-500';
//   const priceChangeIcon = priceChange > 0 ? '↗' : 
//                          priceChange < 0 ? '↘' : '→';

//   // Anatomy overlay component
//   const AnatomyOverlay = () => {
//     if (!showAnatomy || data.length < 2) return null;
    
//     const sampleCandle = data[Math.floor(data.length * 0.7)]; // Use a candle from 70% of the way through
    
//     return (
//       <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
//         <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600">
//           <h3 className="text-xl font-bold mb-4 text-center">Candlestick Anatomy</h3>
          
//           {/* Visual representation */}
//           <div className="flex justify-center mb-6">
//             <svg width="120" height="200" viewBox="0 0 120 200">
//               {/* Sample candlestick */}
//               <line x1="60" y1="20" x2="60" y2="60" stroke="#059669" strokeWidth="2"/>
//               <rect x="45" y="60" width="30" height="80" fill="#10B981" stroke="#059669"/>
//               <line x1="60" y1="140" x2="60" y2="180" stroke="#059669" strokeWidth="2"/>
              
//               {/* Labels */}
//               <text x="80" y="25" fill="white" fontSize="12">High</text>
//               <text x="80" y="105" fill="white" fontSize="12">Open/Close</text>
//               <text x="80" y="185" fill="white" fontSize="12">Low</text>
              
//               {/* Arrows */}
//               <line x1="75" y1="40" x2="65" y2="40" stroke="white" strokeWidth="1"/>
//               <line x1="75" y1="100" x2="75" y2="100" stroke="white" strokeWidth="1"/>
//               <line x1="75" y1="165" x2="65" y2="165" stroke="white" strokeWidth="1"/>
//             </svg>
//           </div>
          
//           {/* Explanation */}
//           <div className="space-y-3 text-sm">
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span><strong>Green/Bullish:</strong> Close {">"} Open (Price went up)</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span><strong>Red/Bearish:</strong> Close {"<"} Open (Price went down)</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-1 bg-gray-400"></div>
//               <span><strong>Wicks/Shadows:</strong> Show price extremes</span>
//             </div>
//             <div className="mt-4 p-3 bg-gray-700 rounded">
//               <p className="text-xs text-gray-300">
//                 Each candle represents price action over {timeframeConfig.label.toLowerCase()}. 
//                 The body shows open-to-close movement, while wicks show the full price range.
//               </p>
//             </div>
//           </div>
          
//           <button
//             onClick={() => setShowAnatomy(false)}
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
//           >
//             Got it!
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden relative">
//       <AnatomyOverlay />
      
//       {/* Header */}
//       <div className="bg-gray-800/90 backdrop-blur-sm px-6 py-4 border-b border-gray-700/50">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-2xl font-bold">{config.flag} {config.name}</h1>
//             <div className="flex items-center space-x-2">
//               <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//               <span className="text-sm text-gray-400">{isLive ? 'LIVE' : 'PAUSED'}</span>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             {/* Timeframe Selector */}
//             <select
//               value={selectedTimeframe}
//               onChange={(e) => handleTimeframeChange(e.target.value)}
//               className="bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
//             >
//               {Object.entries(timeframes).map(([key, value]) => (
//                 <option key={key} value={key}>
//                   {value.label}
//                 </option>
//               ))}
//             </select>
            
//             {/* Currency Pair Selector */}
//             <select
//               value={selectedInstrument}
//               onChange={(e) => handleInstrumentChange(e.target.value)}
//               className="bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
//             >
//               {Object.entries(forexConfig).map(([key, value]) => (
//                 <option key={key} value={key}>
//                   {value.flag} {value.name}
//                 </option>
//               ))}
//             </select>
            
//             {/* Anatomy Button */}
//             <button
//               onClick={() => setShowAnatomy(true)}
//               className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
//             >
//               📚 Anatomy
//             </button>
            
//             <button
//               onClick={toggleLiveUpdates}
//               className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
//                 isLive 
//                   ? 'bg-red-600 hover:bg-red-700 text-white' 
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               {isLive ? 'PAUSE' : 'START'}
//             </button>
//           </div>
//         </div>
        
//         {/* Price Display */}
//         <div className="mt-4 flex items-center space-x-6">
//           <div className="text-3xl font-mono font-bold">
//             {currentCandle ? currentCandle.close.toFixed(selectedInstrument.includes('JPY') ? 2 : 5) : '--'}
//           </div>
//           <div className={`text-lg font-medium ${priceChangeClass} flex items-center space-x-1 transition-all duration-300`}>
//             <span className="text-2xl">{priceChangeIcon}</span>
//             <span>{Math.abs(priceChange).toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</span>
//           </div>
//           <div className="text-sm text-gray-400">
//             <div>Timeframe: <span className="text-blue-400">{timeframeConfig.label}</span></div>
//             <div>Spread: {config.spread.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</div>
//           </div>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="p-6 bg-black/20 backdrop-blur-sm">
//         <ResponsiveContainer width="100%" height={450}>
//           <ComposedChart 
//             data={data} 
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
//             <XAxis 
//               dataKey="timestamp"
//               tick={{ fontSize: 12, fill: '#9CA3AF' }}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 if (selectedTimeframe === '1D') {
//                   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//                 }
//                 return date.toLocaleTimeString('en-US', { 
//                   hour: '2-digit', 
//                   minute: '2-digit',
//                   hour12: false 
//                 });
//               }}
//               stroke="#4B5563"
//             />
//             <YAxis 
//               domain={[minRate - yAxisPadding, maxRate + yAxisPadding]}
//               tick={{ fontSize: 12, fill: '#9CA3AF' }}
//               tickFormatter={(value) => value.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}
//               stroke="#4B5563"
//             />
//             <Tooltip content={customTooltip} />
            
//             {/* Render candlesticks using custom shape */}
//             <Bar
//               dataKey="close"
//               shape={(props) => <CandlestickBar {...props} yScale={(val) => {
//                 const chartHeight = 450 - 40; // Approximate chart height minus margins
//                 const range = (maxRate + yAxisPadding) - (minRate - yAxisPadding);
//                 return 20 + (chartHeight * ((maxRate + yAxisPadding) - val) / range);
//               }} />}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Market Info */}
//       <div className="bg-gray-800/90 backdrop-blur-sm px-6 py-3 text-xs text-gray-400 border-t border-gray-700/50">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-4">
//             <span>Market Hours: 24/5</span>
//             <span>Timeframe: {timeframeConfig.label}</span>
//             <span className="text-green-400">
//               Last Update: {currentCandle ? new Date(currentCandle.timestamp).toLocaleTimeString() : '--:--:--'}
//             </span>
//           </div>
//           <div className="flex space-x-4">
//             <span>High: {maxRate.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</span>
//             <span>Low: {minRate.toFixed(selectedInstrument.includes('JPY') ? 2 : 5)}</span>
//             <span>Candles: {data.length}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimpleForexChart;