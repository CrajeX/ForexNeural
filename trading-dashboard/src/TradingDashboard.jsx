// import React, { useState, useEffect } from 'react';
// import { TrendingUp, TrendingDown, BarChart3, Activity, Shield, Globe, Calendar, Bell, Settings, User, Search, Star, Eye, Brain, Target } from 'lucide-react';
// import './TradingDashboard.css';

// // Constants
// const NAVIGATION_ITEMS = [
//   { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
//   { id: 'setups', label: 'Top Setups', icon: TrendingUp },
//   { id: 'sentiment', label: 'Market Sentiment', icon: Activity },
//   { id: 'risk', label: 'Risk Management', icon: Shield },
//   { id: 'economic', label: 'Economic Calendar', icon: Calendar },
//   { id: 'seasonality', label: 'Seasonality', icon: Globe },
//   { id: 'alerts', label: 'Alerts', icon: Bell }
// ];

// const MOCK_MARKET_DATA = {
//   topSetups: [
//     { symbol: 'EUR/USD', bias: 'Bullish', score: 8.7, change: '+0.23%', confidence: 92 },
//     { symbol: 'GBP/JPY', bias: 'Bearish', score: 7.9, change: '-0.18%', confidence: 87 },
//     { symbol: 'GOLD', bias: 'Bullish', score: 9.1, change: '+0.45%', confidence: 95 },
//     { symbol: 'AAPL', bias: 'Neutral', score: 6.2, change: '+0.12%', confidence: 74 }
//   ],
//   riskGauge: 'Risk-On',
//   marketSentiment: { institutional: 68, retail: 42 },
//   economicEvents: 3
// };

// const AI_INSIGHTS = [
//   {
//     type: 'positive',
//     title: 'Strong USD momentum detected',
//     description: 'Based on DXY technical analysis',
//     color: 'bg-green-400'
//   },
//   {
//     type: 'warning',
//     title: 'Gold showing seasonal strength',
//     description: 'Historical pattern suggests continuation',
//     color: 'bg-yellow-400'
//   },
//   {
//     type: 'info',
//     title: 'Risk sentiment improving',
//     description: 'Favor risk-on assets this week',
//     color: 'bg-blue-400'
//   }
// ];

// // Utility Functions
// const getBiasColor = (bias) => {
//   const colors = {
//     'Bullish': 'text-green-400 bg-green-900/30',
//     'Bearish': 'text-red-400 bg-red-900/30',
//     'Neutral': 'text-yellow-400 bg-yellow-900/30'
//   };
//   return colors[bias] || colors.Neutral;
// };

// const getScoreColor = (score) => {
//   if (score >= 8) return 'text-green-400';
//   if (score >= 6) return 'text-yellow-400';
//   return 'text-red-400';
// };

// // UI Components
// const BiasIndicator = ({ bias, confidence }) => (
//   <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBiasColor(bias)}`}>
//     {bias} ({confidence}%)
//   </div>
// );

// const ScoreDisplay = ({ score }) => (
//   <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
//     {score}/10
//   </div>
// );

// const ConfidenceBar = ({ confidence }) => (
//   <div className="w-full bg-gray-700 rounded-full h-2">
//     <div 
//       className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
//       style={{ width: `${confidence}%` }}
//     />
//   </div>
// );

// const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//     <div className="flex items-center gap-3 mb-4">
//       <Icon className={`w-8 h-8 ${color}`} />
//       <h4 className="text-lg font-semibold text-white">{title}</h4>
//     </div>
//     <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
//     <div className="text-sm text-gray-400">{subtitle}</div>
//   </div>
// );

// const TradingSetupCard = ({ setup, index }) => (
//   <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-4">
//         <div className="text-lg font-bold text-white">{setup.symbol}</div>
//         <BiasIndicator bias={setup.bias} confidence={setup.confidence} />
//         <ScoreDisplay score={setup.score} />
//       </div>
      
//       <div className="flex items-center gap-6">
//         <div className="text-right">
//           <div className={`text-lg font-semibold ${
//             setup.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
//           }`}>
//             {setup.change}
//           </div>
//           <div className="text-sm text-gray-400">24h Change</div>
//         </div>
        
//         <div className="w-32">
//           <div className="text-sm text-gray-400 mb-1">Confidence</div>
//           <ConfidenceBar confidence={setup.confidence} />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const SentimentBar = ({ label, value, gradient }) => (
//   <div>
//     <div className="flex justify-between text-sm mb-2">
//       <span className="text-gray-400">{label}</span>
//       <span className="text-white font-semibold">{value}%</span>
//     </div>
//     <div className="w-full bg-gray-700 rounded-full h-3">
//       <div 
//         className={`${gradient} h-3 rounded-full transition-all duration-1000`}
//         style={{ width: `${value}%` }}
//       />
//     </div>
//   </div>
// );

// const InsightItem = ({ insight }) => (
//   <div className="flex items-start gap-3">
//     <div className={`w-2 h-2 ${insight.color} rounded-full mt-2`} />
//     <div>
//       <div className="text-white font-medium">{insight.title}</div>
//       <div className="text-sm text-gray-400">{insight.description}</div>
//     </div>
//   </div>
// );

// // Custom Hook for Data Loading
// const useMarketData = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [marketData, setMarketData] = useState({});

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       setMarketData(MOCK_MARKET_DATA);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   return { isLoading, marketData };
// };

// const TradingDashboard = () => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [userPreferences, setUserPreferences] = useState({
//     riskTolerance: 'moderate',
//     preferredAssets: ['forex', 'stocks'],
//     theme: 'dark'
//   });
  
//   const { isLoading, marketData } = useMarketData();

//   const Sidebar = () => (
//     <div className="sidebar">
//       <div className="p-6">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//             <Brain className="w-6 h-6 text-white" />
//           </div>
//           <h1 className="text-xl font-bold text-white">8ConEdge</h1>
//         </div>
        
//         <nav className="space-y-2">
//           {NAVIGATION_ITEMS.map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveSection(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                 activeSection === item.id 
//                   ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30' 
//                   : 'text-gray-400 hover:text-white hover:bg-gray-800'
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               {item.label}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );

//   const Header = () => (
//     <div className="header">
//       <div className="flex items-center gap-4">
//         <h2 className="text-2xl font-bold text-white capitalize">{activeSection}</h2>
//         <div className="flex items-center gap-2 text-sm text-gray-400">
//           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//           Live Data
//         </div>
//       </div>
      
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input 
//             type="text" 
//             placeholder="Search assets..."
//             className="search-input"
//           />
//         </div>
//         <button className="p-2 bg-gray-800 rounded-lg border border-gray-700 text-gray-400 hover:text-white">
//           <Settings className="w-5 h-5" />
//         </button>
//         <button className="p-2 bg-gray-800 rounded-lg border border-gray-700 text-gray-400 hover:text-white">
//           <User className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );

//   const WelcomeSection = () => (
//     <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-2xl font-bold mb-2">Welcome back, Trader!</h3>
//           <p className="text-blue-100">Your AI-powered trading companion is ready. Let's make confident decisions together.</p>
//         </div>
//         <div className="text-right">
//           <div className="text-3xl font-bold">{marketData.topSetups?.length || 0}</div>
//           <div className="text-blue-100">Active Setups</div>
//         </div>
//       </div>
//     </div>
//   );

//   const KeyMetrics = () => (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//       <MetricCard
//         icon={Target}
//         title="Success Rate"
//         value="87.3%"
//         subtitle="Last 30 days"
//         color="text-green-400"
//       />
//       <MetricCard
//         icon={Shield}
//         title="Risk Level"
//         value={marketData.riskGauge}
//         subtitle="Current market"
//         color="text-yellow-400"
//       />
//       <MetricCard
//         icon={Eye}
//         title="Watching"
//         value="24"
//         subtitle="Assets monitored"
//         color="text-purple-400"
//       />
//       <MetricCard
//         icon={Bell}
//         title="Alerts"
//         value={marketData.economicEvents}
//         subtitle="Active notifications"
//         color="text-orange-400"
//       />
//     </div>
//   );

//   const TopSetups = () => (
//     <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//       <div className="flex items-center justify-between mb-6">
//         <h4 className="text-xl font-semibold text-white">🎯 Top Trading Setups</h4>
//         <div className="flex items-center gap-2 text-sm text-gray-400">
//           <Star className="w-4 h-4 text-yellow-400" />
//           AI-Ranked by Confidence
//         </div>
//       </div>
      
//       <div className="space-y-4">
//         {marketData.topSetups?.map((setup, index) => (
//           <TradingSetupCard key={index} setup={setup} index={index} />
//         ))}
//       </div>
//     </div>
//   );

//   const MarketSentiment = () => (
//     <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//       <h4 className="text-xl font-semibold text-white mb-4">📊 Market Sentiment</h4>
//       <div className="space-y-4">
//         <SentimentBar
//           label="Institutional"
//           value={marketData.marketSentiment?.institutional}
//           gradient="bg-gradient-to-r from-green-500 to-blue-500"
//         />
//         <SentimentBar
//           label="Retail"
//           value={marketData.marketSentiment?.retail}
//           gradient="bg-gradient-to-r from-orange-500 to-red-500"
//         />
//       </div>
//     </div>
//   );

//   const AIInsights = () => (
//     <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//       <h4 className="text-xl font-semibold text-white mb-4">🤖 AI Insights</h4>
//       <div className="space-y-3">
//         {AI_INSIGHTS.map((insight, index) => (
//           <InsightItem key={index} insight={insight} />
//         ))}
//       </div>
//     </div>
//   );

//   const DashboardContent = () => (
//     <div className="space-y-6">
//       <WelcomeSection />
//       <KeyMetrics />
//       <TopSetups />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <MarketSentiment />
//         <AIInsights />
//       </div>
//     </div>
//   );

//   const LoadingScreen = () => (
//     <div className="section-content min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
//           <Brain className="w-8 h-8 text-white" />
//         </div>
//         <h3 className="text-xl font-semibold text-white mb-2">Loading 8ConEdge</h3>
//         <p className="text-gray-400">Analyzing market data and preparing your insights...</p>
//         <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
//           <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
//         </div>
//       </div>
//     </div>
//   );

//   const PlaceholderSection = () => (
//     <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
//       <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
//         <BarChart3 className="w-8 h-8 text-white" />
//       </div>
//       <h3 className="text-xl font-semibold text-white mb-2">
//         {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
//       </h3>
//       <p className="text-gray-400 mb-4">This section is under development and will be available soon.</p>
//       <button 
//         onClick={() => setActiveSection('dashboard')}
//         className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );

//   if (isLoading) {
//     return (
//       <div className="dashboard-container">
//         <Sidebar />
//         <LoadingScreen />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <Sidebar />
//       <Header />
      
//       <main className="section-content">
//         {activeSection === 'dashboard' ? <DashboardContent /> : <PlaceholderSection />}
//       </main>
//     </div>
//   );
// };

// export default TradingDashboard;
// import React, { useState,useRef,useEffect } from 'react';
// import { FilePenLine,FileSpreadsheetIcon,Settings, Maximize2, ZoomIn, ZoomOut, Move, Clock, TrendingUp, TrendingDown, BarChart3, ActivityIcon,Activity, Shield, Globe, Calendar, Bell, User, Search, Star, Eye, Target } from 'lucide-react';
// import TradingViewWidget from './components/DukascopyChart'
// import TradingViewNewsWidget from './components/DukascopyNewsWidget'; 
// import TradingViewEventsWidget from './components/EconomicCalendar';
// import UserButtonWithPopup from './components/UserIcon';
// // import { useNavigate } from 'react-router-dom';
// // ===== CONSTANTS SECTION =====
// // Duplicate this section when creating new functions
// const NAVIGATION_ITEMS = [
//    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
//   { id: 'alerts', label: 'Alerts', icon: Bell },
//   { id: 'charts', label: 'Charts', icon: ActivityIcon},
//   { id: 'setups', label: 'Top Setups', icon: TrendingUp },
//   { id: 'sentiment', label: 'Market Sentiment', icon: Activity },
//   { id: 'risk', label: 'Risk Management', icon: Shield },
//   { id: 'economic', label: 'Economic Calendar', icon: Calendar },
//   // { id: 'seasonality', label: 'Seasonality', icon: Globe },
//   // { id: 'dataentry', label: 'Data Entry', icon: FilePenLine },
  
// ];

// // Static market data - replace with API calls when implementing functions
// const STATIC_MARKET_DATA = {
//   topSetups: [
//     { symbol: 'EUR/USD', bias: 'Bullish', score: 8.7, change: '+0.23%', confidence: 92 },
//     { symbol: 'GBP/JPY', bias: 'Bearish', score: 7.9, change: '-0.18%', confidence: 87 },
//     { symbol: 'GOLD', bias: 'Bullish', score: 9.1, change: '+0.45%', confidence: 95 },
//     { symbol: 'AAPL', bias: 'Neutral', score: 6.2, change: '+0.12%', confidence: 74 }
//   ],
//   riskGauge: 'Risk-On',
//   marketSentiment: { institutional: 68, retail: 42 },
//   economicEvents: 3
// };

// const AI_INSIGHTS = [
//   {
//     type: 'positive',
//     title: 'Strong USD momentum detected',
//     description: 'Based on DXY technical analysis',
//     color: '#10b981'
//   },
//   {
//     type: 'warning',
//     title: 'Gold showing seasonal strength',
//     description: 'Historical pattern suggests continuation',
//     color: '#f59e0b'
//   },
//   {
//     type: 'info',
//     title: 'Risk sentiment improving',
//     description: 'Favor risk-on assets this week',
//     color: '#3b82f6'
//   }
// ];

// // ===== STYLES OBJECT =====
// const styles = {
//     title: {
//       fontSize: '24px',
//       fontWeight: 'bold',
//       padding: '20px',
//       color: '#374151',
//       textAlign: 'center',
//       backgroundColor: '#f8f9fa',
//       borderBottom: '1px solid #e5e7eb',
//       margin: '0'
//     },
//     chartWrapper: {
//       width: '100%',
//       flex: '1',
//       overflow: 'hidden'
//     },
//     iframe: {
//       width: '100%',
//       height: '100%',
//       border: '0',
//       display: 'block'
//     },
//   container: {
//     display: 'flex',
//     minHeight: '100vh',
//     backgroundColor: '#111827',
//     fontFamily: 'system-ui, -apple-system, sans-serif',
//     color: '#ffffff'
//   },
//   sidebar: {
//     width: '256px',
//     backgroundColor: '#1f2937',
//     borderRight: '1px solid #374151',
//     minHeight: '100vh'
//   },
//   sidebarContent: {
//     padding: '24px'
//   },
//   logo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '32px'
//   },
//   logoIcon: {
//     width: '32px',
//     height: '32px',
//     background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
//     borderRadius: '8px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   logoText: {
//     fontSize: '20px',
//     fontWeight: 'bold',
//     color: '#ffffff'
//   },
//   nav: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px'
//   },
//   navButton: {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '12px 16px',
//     borderRadius: '8px',
//     textAlign: 'left',
//     border: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     fontSize: '14px'
//   },
//   navButtonActive: {
//     backgroundColor: '#2563eb',
//     color: '#ffffff'
//   },
//   navButtonInactive: {
//     backgroundColor: 'transparent',
//     color: '#9ca3af'
//   },
//   mainContent: {
//     flex: 1
//   },
//   header: {
//     backgroundColor: '#1f2937',
//     borderBottom: '1px solid #374151',
//     padding: '24px'
//   },
//   headerContent: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   headerLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px'
//   },
//   headerTitle: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textTransform: 'capitalize'
//   },
//   headerStatus: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     fontSize: '14px',
//     color: '#9ca3af'
//   },
//   statusDot: {
//     width: '8px',
//     height: '8px',
//     backgroundColor: '#10b981',
//     borderRadius: '50%'
//   },
//   headerRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px'
//   },
//   searchContainer: {
//     position: 'relative'
//   },
//   searchInput: {
//     paddingLeft: '40px',
//     paddingRight: '16px',
//     paddingTop: '8px',
//     paddingBottom: '8px',
//     backgroundColor: '#374151',
//     border: '1px solid #4b5563',
//     borderRadius: '8px',
//     color: '#ffffff',
//     fontSize: '14px',
//     outline: 'none'
//   },
//   searchIcon: {
//     position: 'absolute',
//     left: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     color: '#9ca3af'
//   },
//   headerButton: {
//     padding: '8px',
//     backgroundColor: '#374151',
//     borderRadius: '8px',
//     border: '1px solid #4b5563',
//     color: '#9ca3af',
//     cursor: 'pointer',
//     transition: 'color 0.2s'
//   },
//   main: {
//     padding: '24px'
//   },
//   welcomeSection: {
//     background: 'linear-gradient(to right, #2563eb, #7c3aed)',
//     borderRadius: '12px',
//     padding: '24px',
//     color: '#ffffff',
//     marginBottom: '24px'
//   },
//   welcomeContent: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   welcomeTitle: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     marginBottom: '8px'
//   },
//   welcomeSubtitle: {
//     color: '#bfdbfe'
//   },
//   welcomeStats: {
//     textAlign: 'right'
//   },
//   welcomeNumber: {
//     fontSize: '32px',
//     fontWeight: 'bold'
//   },
//   welcomeLabel: {
//     color: '#bfdbfe'
//   },
//   metricsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//     gap: '24px',
//     marginBottom: '24px'
//   },
//   metricCard: {
//     backgroundColor: '#1f2937',
//     borderRadius: '12px',
//     padding: '24px',
//     border: '1px solid #374151'
//   },
//   metricHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '16px'
//   },
//   metricTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#ffffff'
//   },
//   metricValue: {
//     fontSize: '32px',
//     fontWeight: 'bold',
//     marginBottom: '8px'
//   },
//   metricSubtitle: {
//     fontSize: '14px',
//     color: '#9ca3af'
//   },
//   setupsCard: {
//     backgroundColor: '#1f2937',
//     borderRadius: '12px',
//     padding: '24px',
//     border: '1px solid #374151',
//     marginBottom: '24px'
//   },
//   setupsHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: '24px'
//   },
//   setupsTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#ffffff'
//   },
//   setupsSubtitle: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     fontSize: '14px',
//     color: '#9ca3af'
//   },
//   setupsList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px'
//   },
//   setupItem: {
//     backgroundColor: '#374151',
//     borderRadius: '8px',
//     padding: '16px',
//     border: '1px solid #4b5563'
//   },
//   setupContent: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   setupLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px'
//   },
//   setupSymbol: {
//     fontSize: '18px',
//     fontWeight: 'bold',
//     color: '#ffffff'
//   },
//   biasIndicator: {
//     padding: '4px 12px',
//     borderRadius: '16px',
//     fontSize: '12px',
//     fontWeight: '500'
//   },
//   scoreDisplay: {
//     fontSize: '24px',
//     fontWeight: 'bold'
//   },
//   setupRight: {
//     textAlign: 'right',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px'
//   },
//   changeValue: {
//     fontSize: '18px',
//     fontWeight: '600'
//   },
//   changeLabel: {
//     fontSize: '12px',
//     color: '#9ca3af'
//   },
//   confidenceSection: {
//     width: '128px'
//   },
//   confidenceLabel: {
//     fontSize: '12px',
//     color: '#9ca3af',
//     marginBottom: '4px'
//   },
//   confidenceBar: {
//     width: '100%',
//     backgroundColor: '#374151',
//     borderRadius: '4px',
//     height: '8px',
//     overflow: 'hidden'
//   },
//   confidenceFill: {
//     height: '100%',
//     background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
//     transition: 'width 0.3s'
//   },
//   bottomGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//     gap: '24px'
//   },
//   sentimentCard: {
//     backgroundColor: '#1f2937',
//     borderRadius: '12px',
//     padding: '24px',
//     border: '1px solid #374151'
//   },
//   sentimentTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: '16px'
//   },
//   sentimentList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px'
//   },
//   sentimentItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px'
//   },
//   sentimentHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     fontSize: '14px'
//   },
//   sentimentLabel: {
//     color: '#d1d5db'
//   },
//   sentimentValue: {
//     color: '#ffffff',
//     fontWeight: '600'
//   },
//   sentimentBarContainer: {
//     width: '100%',
//     backgroundColor: '#374151',
//     borderRadius: '4px',
//     height: '12px',
//     overflow: 'hidden'
//   },
//   sentimentBarFill: {
//     height: '100%',
//     transition: 'width 0.3s'
//   },
//   insightsCard: {
//     backgroundColor: '#1f2937',
//     borderRadius: '12px',
//     padding: '24px',
//     border: '1px solid #374151'
//   },
//   insightsTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: '16px'
//   },
//   insightsList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '12px'
//   },
//   insightItem: {
//     display: 'flex',
//     alignItems: 'flex-start',
//     gap: '12px',
//     padding: '12px',
//     backgroundColor: '#374151',
//     borderRadius: '8px'
//   },
//   insightDot: {
//     width: '12px',
//     height: '12px',
//     borderRadius: '50%',
//     marginTop: '4px'
//   },
//   insightContent: {
//     flex: 1
//   },
//   insightTitle: {
//     color: '#ffffff',
//     fontWeight: '500',
//     marginBottom: '4px'
//   },
//   insightDescription: {
//     color: '#9ca3af',
//     fontSize: '14px'
//   },
//   placeholderSection: {
//     backgroundColor: '#1f2937',
//     borderRadius: '12px',
//     padding: '32px',
//     border: '1px solid #374151',
//     textAlign: 'center'
//   },
//   placeholderIcon: {
//     width: '64px',
//     height: '64px',
//     background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '0 auto 16px'
//   },
//   placeholderTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: '8px'
//   },
//   placeholderDescription: {
//     color: '#9ca3af',
//     marginBottom: '16px'
//   },
//   placeholderButton: {
//     padding: '8px 24px',
//     background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
//     color: '#ffffff',
//     borderRadius: '8px',
//     border: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   }
// };

// // ===== UTILITY FUNCTIONS SECTION =====
// // Duplicate these utility functions when creating new components
// const getBiasStyle = (bias) => {
//   const baseStyle = { ...styles.biasIndicator };
//   switch (bias) {
//     case 'Bullish':
//       return { ...baseStyle, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
//     case 'Bearish':
//       return { ...baseStyle, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
//     case 'Neutral':
//       return { ...baseStyle, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
//     default:
//       return { ...baseStyle, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
//   }
// };

// const getScoreColor = (score) => {
//   if (score >= 8) return '#10b981';
//   if (score >= 6) return '#f59e0b';
//   return '#ef4444';
// };

// // ===== UI COMPONENTS SECTION =====
// // Duplicate these components when creating new sections
// const BiasIndicator = ({ bias, confidence }) => (
//   <div style={getBiasStyle(bias)}>
//     {bias} ({confidence}%)
//   </div>
// );

// const ScoreDisplay = ({ score }) => (
//   <div style={{ ...styles.scoreDisplay, color: getScoreColor(score) }}>
//     {score}/10
//   </div>
// );

// const ConfidenceBar = ({ confidence }) => (
//   <div style={styles.confidenceBar}>
//     <div 
//       style={{
//         ...styles.confidenceFill,
//         width: `${confidence}%`
//       }}
//     />
//   </div>
// );

// const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div style={styles.metricCard}>
//     <div style={styles.metricHeader}>
//       <Icon size={32} color={color} />
//       <h4 style={styles.metricTitle}>{title}</h4>
//     </div>
//     <div style={{ ...styles.metricValue, color }}>{value}</div>
//     <div style={styles.metricSubtitle}>{subtitle}</div>
//   </div>
// );

// const TradingSetupCard = ({ setup, index }) => (
//   <div style={styles.setupItem}>
//     <div style={styles.setupContent}>
//       <div style={styles.setupLeft}>
//         <div style={styles.setupSymbol}>{setup.symbol}</div>
//         <BiasIndicator bias={setup.bias} confidence={setup.confidence} />
//         <ScoreDisplay score={setup.score} />
//       </div>
      
//       <div style={styles.setupRight}>
//         <div style={{ ...styles.changeValue, color: setup.change.startsWith('+') ? '#10b981' : '#ef4444' }}>
//           {setup.change}
//         </div>
//         <div style={styles.changeLabel}>24h Change</div>
        
//         <div style={styles.confidenceSection}>
//           <div style={styles.confidenceLabel}>Confidence</div>
//           <ConfidenceBar confidence={setup.confidence} />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const SentimentBar = ({ label, value, isInstitutional }) => (
//   <div style={styles.sentimentItem}>
//     <div style={styles.sentimentHeader}>
//       <span style={styles.sentimentLabel}>{label}</span>
//       <span style={styles.sentimentValue}>{value}%</span>
//     </div>
//     <div style={styles.sentimentBarContainer}>
//       <div 
//         style={{
//           ...styles.sentimentBarFill,
//           width: `${value}%`,
//           background: isInstitutional 
//             ? 'linear-gradient(to right, #10b981, #3b82f6)' 
//             : 'linear-gradient(to right, #f97316, #ef4444)'
//         }}
//       />
//     </div>
//   </div>
// );

// const InsightItem = ({ insight }) => (
//   <div style={styles.insightItem}>
//     <div style={{ ...styles.insightDot, backgroundColor: insight.color }} />
//     <div style={styles.insightContent}>
//       <div style={styles.insightTitle}>{insight.title}</div>
//       <div style={styles.insightDescription}>{insight.description}</div>
//     </div>
//   </div>
// );

// // ===== MAIN DASHBOARD COMPONENT =====
// const TradingDashboard = () => {
//   const [activeSection, setActiveSection] = useState('dashboard');
  
//   // ===== COMPONENT SECTIONS =====
//   // Duplicate these component sections when creating new pages
  
//   const Sidebar = () => (
//     <div style={styles.sidebar}>
//       <div style={styles.sidebarContent}>
//         <div style={styles.logo}>
//           <div style={styles.logoIcon}>
//             <BarChart3 size={20} color="#ffffff" />
//           </div>
//           <div style={styles.logoText}>8ConEdge</div>
//         </div>
        
//         <nav style={styles.nav}>
//           {NAVIGATION_ITEMS.map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveSection(item.id)}
//               style={{
//                 ...styles.navButton,
//                 ...(activeSection === item.id ? styles.navButtonActive : styles.navButtonInactive)
//               }}
//               onMouseEnter={(e) => {
//                 if (activeSection !== item.id) {
//                   e.target.style.backgroundColor = '#374151';
//                   e.target.style.color = '#ffffff';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (activeSection !== item.id) {
//                   e.target.style.backgroundColor = 'transparent';
//                   e.target.style.color = '#9ca3af';
//                 }
//               }}
//             >
//               <item.icon size={20} />
//               {item.label}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
//   const Header = () => (
//     <div style={styles.header}>
//       <div style={styles.headerContent}>
//         <div style={styles.headerLeft}>
//           <h2 style={styles.headerTitle}>{activeSection}</h2>
//           <div style={styles.headerStatus}>
//             <div style={styles.statusDot} />
//             Dashboard View
//           </div>
//         </div>
        
//         <div style={styles.headerRight}>
//           <div style={styles.searchContainer}>
//             <Search size={16} style={styles.searchIcon} />
//             <input 
//               type="text" 
//               placeholder="Search assets..."
//               style={styles.searchInput}
//             />
//           </div>
//           <button style={styles.headerButton}
//             onMouseEnter={(e) => e.target.style.color = '#ffffff'}
//             onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
//             <Settings size={20} />
//           </button>
//           <UserButtonWithPopup/>  
//         </div>
//       </div>
//     </div>
//   );

//  const WelcomeSectionBest = () => {
//   const [sessionData, setSessionData] = useState({
//     isAuthenticated: false,
//     user: null,
//     loading: true
//   });

//   useEffect(() => {
//     try {
//       const authStatus = sessionStorage.getItem('isAuthenticated');
//       const userData = JSON.parse(sessionStorage.getItem('user') || 'null');
//       const username = userData?.username;
//       const email = userData?.email;
      
//       // If you're storing the full user object from login:
//       // const userObject = sessionStorage.getItem('user');
//       // const parsedUser = userObject ? JSON.parse(userObject) : null;
      
//       setSessionData({
//         isAuthenticated: authStatus === 'true',
//         user: userData || null,
//         username,
//         email,
//         // user: parsedUser?.username || null, // if using full user object
//         loading: false
//       });
//     } catch (error) {
//       console.error('Error reading session data:', error);
//       setSessionData({
//         isAuthenticated: false,
//         user: null,
//         loading: false
//       });
//     }
//   }, []);

//   if (sessionData.loading) {
//     return (
//       <div style={styles.welcomeSection}>
//         <div style={styles.welcomeContent}>
//           <div>Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.welcomeSection}>
//       <div style={styles.welcomeContent}>
//         <div>
//           <h3 style={styles.welcomeTitle}>
//             Welcome back, {sessionData.username}!
//           </h3>
//           <p style={styles.welcomeSubtitle}>
//             Your AI-powered trading companion is ready. Let's make confident decisions together.
//           </p>
//           {!sessionData.isAuthenticated && (
//             <p style={{ fontSize: '12px', color: '#ef4444' }}>
//               Please log in to access all features.
//             </p>
//           )}
//         </div>
//         <div style={styles.welcomeStats}>
//           <div style={styles.welcomeNumber}>{STATIC_MARKET_DATA.topSetups.length}</div>
//           <div style={styles.welcomeLabel}>Active Setups</div>
//         </div>
//       </div>
//     </div>
//   );
// };
//   const successRate = '';
//   const KeyMetrics = () => (
//     <div style={styles.metricsGrid}>
//       <MetricCard
//         icon={Target}
//         title="Success Rate"
//         value={successRate}
//         subtitle="Last 30 days"
//         color="#10b981"
//       />
//       <MetricCard
//         icon={Shield}
//         title="Risk Level"
//         value={STATIC_MARKET_DATA.riskGauge}
//         subtitle="Current market"
//         color="#f59e0b"
//       />
//       <MetricCard
//         icon={Eye}
//         title="Watching"
//         value="24"
//         subtitle="Assets monitored"
//         color="#8b5cf6"
//       />
//       <MetricCard
//         icon={Bell}
//         title="Alerts"
//         value={STATIC_MARKET_DATA.economicEvents}
//         subtitle="Active notifications"
//         color="#f97316"
//       />
//     </div>
//   );

//   const TopSetups = () => (
//     <div style={styles.setupsCard}>
//       <div style={styles.setupsHeader}>
//         <h4 style={styles.setupsTitle}>🎯 Top Trading Setups</h4>
//         <div style={styles.setupsSubtitle}>
//           <Star size={16} color="#f59e0b" />
//           AI-Ranked by Confidence
//         </div>
//       </div>
      
//       <div style={styles.setupsList}>
//         {STATIC_MARKET_DATA.topSetups.map((setup, index) => (
//           <TradingSetupCard key={index} setup={setup} index={index} />
//         ))}
//       </div>
//     </div>
//   );

//   const MarketSentiment = () => (
//     <div style={styles.sentimentCard}>
//       <h4 style={styles.sentimentTitle}>📊 Market Sentiment</h4>
//       <div style={styles.sentimentList}>
//         <SentimentBar
//           label="Institutional"
//           value={STATIC_MARKET_DATA.marketSentiment.institutional}
//           isInstitutional={true}
//         />
//         <SentimentBar
//           label="Retail"
//           value={STATIC_MARKET_DATA.marketSentiment.retail}
//           isInstitutional={false}
//         />
//       </div>
//     </div>
//   );

//   const AIInsights = () => (
//     <div style={styles.insightsCard}>
//       <h4 style={styles.insightsTitle}>🤖 AI Insights</h4>
//       <div style={styles.insightsList}>
//         {AI_INSIGHTS.map((insight, index) => (
//           <InsightItem key={index} insight={insight} />
//         ))}
//       </div>
//     </div>
//   );

//   const DashboardContent = () => (
//     <div>
//       <h1>Market Data</h1>
//       <WelcomeSectionBest />
//       <KeyMetrics />
//       <TopSetups />
//       <div style={styles.bottomGrid}>
//         <MarketSentiment />
//         <AIInsights />
//       </div>
//     </div>
//   );


//   // CHART SECTION
 



//   const PlaceholderSection = () => (
//     <div style={styles.placeholderSection}>
//       <div style={styles.placeholderIcon}>
//         <BarChart3 size={32} color="#ffffff" />
//       </div>
//       <h3 style={styles.placeholderTitle}>
//         {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
//       </h3>
//       <p style={styles.placeholderDescription}>This section is under development and will be available soon.</p>
//       <button 
//         onClick={() => setActiveSection('dashboard')}
//         style={styles.placeholderButton}
//         onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)'}
//         onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)'}
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );

//   // ===== MAIN RENDER =====
//   return (
     
     
//     <div style={styles.container}>
       
//       <Sidebar />
//       <div style={styles.mainContent}>
//         <Header />
//         <main style={styles.main}>
//        {activeSection === 'dashboard' ? <DashboardContent /> : 
//  activeSection === 'charts' ? <TradingViewWidget /> :
//   activeSection === 'alerts' ? <TradingViewNewsWidget /> : 
//   activeSection === 'economic' ? <TradingViewEventsWidget /> : 
//  <PlaceholderSection />}

//         </main>
//       </div>
//     </div>
//   );
// };
// // HELLLO JHAMES
// export default TradingDashboard;

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
const TradingDashboard = () => {
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

export default TradingDashboard;