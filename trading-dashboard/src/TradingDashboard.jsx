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
import React, { useState,useRef,useEffect } from 'react';
import { FilePenLine,FileSpreadsheetIcon,Settings, Maximize2, ZoomIn, ZoomOut, Move, Clock, TrendingUp, TrendingDown, BarChart3, ActivityIcon,Activity, Shield, Globe, Calendar, Bell, User, Search, Star, Eye, Target } from 'lucide-react';
import TradingViewWidget from './components/DukascopyChart'
import TradingViewNewsWidget from './components/DukascopyNewsWidget'; 
import TradingViewEventsWidget from './components/EconomicCalendar';
import UserButtonWithPopup from './components/UserIcon';
import { useNavigate } from 'react-router-dom';
// ===== CONSTANTS SECTION =====
// Duplicate this section when creating new functions
const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'setups', label: 'Top Setups', icon: TrendingUp },
  { id: 'sentiment', label: 'Market Sentiment', icon: Activity },
  { id: 'risk', label: 'Risk Management', icon: Shield },
  { id: 'economic', label: 'Economic Calendar', icon: Calendar },
  // { id: 'seasonality', label: 'Seasonality', icon: Globe },
  { id: 'dataentry', label: 'Data Entry', icon: FilePenLine },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'charts', label: 'Charts', icon: ActivityIcon}
];

// Static market data - replace with API calls when implementing functions
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

const AI_INSIGHTS = [
  {
    type: 'positive',
    title: 'Strong USD momentum detected',
    description: 'Based on DXY technical analysis',
    color: '#10b981'
  },
  {
    type: 'warning',
    title: 'Gold showing seasonal strength',
    description: 'Historical pattern suggests continuation',
    color: '#f59e0b'
  },
  {
    type: 'info',
    title: 'Risk sentiment improving',
    description: 'Favor risk-on assets this week',
    color: '#3b82f6'
  }
];

// ===== STYLES OBJECT =====
const styles = {
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      padding: '20px',
      color: '#374151',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e5e7eb',
      margin: '0'
    },
    chartWrapper: {
      width: '100%',
      flex: '1',
      overflow: 'hidden'
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: '0',
      display: 'block'
    },
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#111827',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff'
  },
  sidebar: {
    width: '256px',
    backgroundColor: '#1f2937',
    borderRight: '1px solid #374151',
    minHeight: '100vh'
  },
  sidebarContent: {
    padding: '24px'
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
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'left',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px'
  },
  navButtonActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff'
  },
  navButtonInactive: {
    backgroundColor: 'transparent',
    color: '#9ca3af'
  },
  mainContent: {
    flex: 1
  },
  header: {
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
    padding: '24px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'capitalize'
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#9ca3af'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  searchContainer: {
    position: 'relative'
  },
  searchInput: {
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  },
  headerButton: {
    padding: '8px',
    backgroundColor: '#374151',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  main: {
    padding: '24px'
  },
  welcomeSection: {
    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
    borderRadius: '12px',
    padding: '24px',
    color: '#ffffff',
    marginBottom: '24px'
  },
  welcomeContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  welcomeSubtitle: {
    color: '#bfdbfe'
  },
  welcomeStats: {
    textAlign: 'right'
  },
  welcomeNumber: {
    fontSize: '32px',
    fontWeight: 'bold'
  },
  welcomeLabel: {
    color: '#bfdbfe'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  metricCard: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151'
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  metricTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  metricSubtitle: {
    fontSize: '14px',
    color: '#9ca3af'
  },
  setupsCard: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151',
    marginBottom: '24px'
  },
  setupsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  setupsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff'
  },
  setupsSubtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#9ca3af'
  },
  setupsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  setupItem: {
    backgroundColor: '#374151',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #4b5563'
  },
  setupContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  setupLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  setupSymbol: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  biasIndicator: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500'
  },
  scoreDisplay: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  setupRight: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  changeValue: {
    fontSize: '18px',
    fontWeight: '600'
  },
  changeLabel: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  confidenceSection: {
    width: '128px'
  },
  confidenceLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '4px'
  },
  confidenceBar: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden'
  },
  confidenceFill: {
    height: '100%',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    transition: 'width 0.3s'
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  sentimentCard: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151'
  },
  sentimentTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px'
  },
  sentimentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sentimentItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sentimentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  sentimentLabel: {
    color: '#d1d5db'
  },
  sentimentValue: {
    color: '#ffffff',
    fontWeight: '600'
  },
  sentimentBarContainer: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: '4px',
    height: '12px',
    overflow: 'hidden'
  },
  sentimentBarFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  insightsCard: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151'
  },
  insightsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px'
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#374151',
    borderRadius: '8px'
  },
  insightDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginTop: '4px'
  },
  insightContent: {
    flex: 1
  },
  insightTitle: {
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: '4px'
  },
  insightDescription: {
    color: '#9ca3af',
    fontSize: '14px'
  },
  placeholderSection: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #374151',
    textAlign: 'center'
  },
  placeholderIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  placeholderTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px'
  },
  placeholderDescription: {
    color: '#9ca3af',
    marginBottom: '16px'
  },
  placeholderButton: {
    padding: '8px 24px',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

// ===== UTILITY FUNCTIONS SECTION =====
// Duplicate these utility functions when creating new components
const getBiasStyle = (bias) => {
  const baseStyle = { ...styles.biasIndicator };
  switch (bias) {
    case 'Bullish':
      return { ...baseStyle, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
    case 'Bearish':
      return { ...baseStyle, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
    case 'Neutral':
      return { ...baseStyle, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
    default:
      return { ...baseStyle, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
  }
};

const getScoreColor = (score) => {
  if (score >= 8) return '#10b981';
  if (score >= 6) return '#f59e0b';
  return '#ef4444';
};

// ===== UI COMPONENTS SECTION =====
// Duplicate these components when creating new sections
const BiasIndicator = ({ bias, confidence }) => (
  <div style={getBiasStyle(bias)}>
    {bias} ({confidence}%)
  </div>
);

const ScoreDisplay = ({ score }) => (
  <div style={{ ...styles.scoreDisplay, color: getScoreColor(score) }}>
    {score}/10
  </div>
);

const ConfidenceBar = ({ confidence }) => (
  <div style={styles.confidenceBar}>
    <div 
      style={{
        ...styles.confidenceFill,
        width: `${confidence}%`
      }}
    />
  </div>
);

const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div style={styles.metricCard}>
    <div style={styles.metricHeader}>
      <Icon size={32} color={color} />
      <h4 style={styles.metricTitle}>{title}</h4>
    </div>
    <div style={{ ...styles.metricValue, color }}>{value}</div>
    <div style={styles.metricSubtitle}>{subtitle}</div>
  </div>
);

const TradingSetupCard = ({ setup, index }) => (
  <div style={styles.setupItem}>
    <div style={styles.setupContent}>
      <div style={styles.setupLeft}>
        <div style={styles.setupSymbol}>{setup.symbol}</div>
        <BiasIndicator bias={setup.bias} confidence={setup.confidence} />
        <ScoreDisplay score={setup.score} />
      </div>
      
      <div style={styles.setupRight}>
        <div style={{ ...styles.changeValue, color: setup.change.startsWith('+') ? '#10b981' : '#ef4444' }}>
          {setup.change}
        </div>
        <div style={styles.changeLabel}>24h Change</div>
        
        <div style={styles.confidenceSection}>
          <div style={styles.confidenceLabel}>Confidence</div>
          <ConfidenceBar confidence={setup.confidence} />
        </div>
      </div>
    </div>
  </div>
);

const SentimentBar = ({ label, value, isInstitutional }) => (
  <div style={styles.sentimentItem}>
    <div style={styles.sentimentHeader}>
      <span style={styles.sentimentLabel}>{label}</span>
      <span style={styles.sentimentValue}>{value}%</span>
    </div>
    <div style={styles.sentimentBarContainer}>
      <div 
        style={{
          ...styles.sentimentBarFill,
          width: `${value}%`,
          background: isInstitutional 
            ? 'linear-gradient(to right, #10b981, #3b82f6)' 
            : 'linear-gradient(to right, #f97316, #ef4444)'
        }}
      />
    </div>
  </div>
);

const InsightItem = ({ insight }) => (
  <div style={styles.insightItem}>
    <div style={{ ...styles.insightDot, backgroundColor: insight.color }} />
    <div style={styles.insightContent}>
      <div style={styles.insightTitle}>{insight.title}</div>
      <div style={styles.insightDescription}>{insight.description}</div>
    </div>
  </div>
);

// ===== MAIN DASHBOARD COMPONENT =====
const TradingDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // ===== COMPONENT SECTIONS =====
  // Duplicate these component sections when creating new pages
  
  const Sidebar = () => (
    <div style={styles.sidebar}>
      <div style={styles.sidebarContent}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <BarChart3 size={20} color="#ffffff" />
          </div>
          <div style={styles.logoText}>8ConEdge</div>
        </div>
        
        <nav style={styles.nav}>
          {NAVIGATION_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...styles.navButton,
                ...(activeSection === item.id ? styles.navButtonActive : styles.navButtonInactive)
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#9ca3af';
                }
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
  const Header = () => (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.headerLeft}>
          <h2 style={styles.headerTitle}>{activeSection}</h2>
          <div style={styles.headerStatus}>
            <div style={styles.statusDot} />
            Dashboard View
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search assets..."
              style={styles.searchInput}
            />
          </div>
          <button style={styles.headerButton}
            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
            <Settings size={20} />
          </button>
          <UserButtonWithPopup/>  
        </div>
      </div>
    </div>
  );

  const WelcomeSection = () => (
    <div style={styles.welcomeSection}>
      <div style={styles.welcomeContent}>
        <div>
          <h3 style={styles.welcomeTitle}>Welcome back, Trader!</h3>
          <p style={styles.welcomeSubtitle}>Your AI-powered trading companion is ready. Let's make confident decisions together.</p>
        </div>
        <div style={styles.welcomeStats}>
          <div style={styles.welcomeNumber}>{STATIC_MARKET_DATA.topSetups.length}</div>
          <div style={styles.welcomeLabel}>Active Setups</div>
        </div>
      </div>
    </div>
  );
  const successRate = '';
  const KeyMetrics = () => (
    <div style={styles.metricsGrid}>
      <MetricCard
        icon={Target}
        title="Success Rate"
        value={successRate}
        subtitle="Last 30 days"
        color="#10b981"
      />
      <MetricCard
        icon={Shield}
        title="Risk Level"
        value={STATIC_MARKET_DATA.riskGauge}
        subtitle="Current market"
        color="#f59e0b"
      />
      <MetricCard
        icon={Eye}
        title="Watching"
        value="24"
        subtitle="Assets monitored"
        color="#8b5cf6"
      />
      <MetricCard
        icon={Bell}
        title="Alerts"
        value={STATIC_MARKET_DATA.economicEvents}
        subtitle="Active notifications"
        color="#f97316"
      />
    </div>
  );

  const TopSetups = () => (
    <div style={styles.setupsCard}>
      <div style={styles.setupsHeader}>
        <h4 style={styles.setupsTitle}>🎯 Top Trading Setups</h4>
        <div style={styles.setupsSubtitle}>
          <Star size={16} color="#f59e0b" />
          AI-Ranked by Confidence
        </div>
      </div>
      
      <div style={styles.setupsList}>
        {STATIC_MARKET_DATA.topSetups.map((setup, index) => (
          <TradingSetupCard key={index} setup={setup} index={index} />
        ))}
      </div>
    </div>
  );

  const MarketSentiment = () => (
    <div style={styles.sentimentCard}>
      <h4 style={styles.sentimentTitle}>📊 Market Sentiment</h4>
      <div style={styles.sentimentList}>
        <SentimentBar
          label="Institutional"
          value={STATIC_MARKET_DATA.marketSentiment.institutional}
          isInstitutional={true}
        />
        <SentimentBar
          label="Retail"
          value={STATIC_MARKET_DATA.marketSentiment.retail}
          isInstitutional={false}
        />
      </div>
    </div>
  );

  const AIInsights = () => (
    <div style={styles.insightsCard}>
      <h4 style={styles.insightsTitle}>🤖 AI Insights</h4>
      <div style={styles.insightsList}>
        {AI_INSIGHTS.map((insight, index) => (
          <InsightItem key={index} insight={insight} />
        ))}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div>
      <h1>Market Data</h1>
      <WelcomeSection />
      <KeyMetrics />
      <TopSetups />
      <div style={styles.bottomGrid}>
        <MarketSentiment />
        <AIInsights />
      </div>
    </div>
  );


  // CHART SECTION
 



  const PlaceholderSection = () => (
    <div style={styles.placeholderSection}>
      <div style={styles.placeholderIcon}>
        <BarChart3 size={32} color="#ffffff" />
      </div>
      <h3 style={styles.placeholderTitle}>
        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
      </h3>
      <p style={styles.placeholderDescription}>This section is under development and will be available soon.</p>
      <button 
        onClick={() => setActiveSection('dashboard')}
        style={styles.placeholderButton}
        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)'}
        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)'}
      >
        Back to Dashboard
      </button>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
     
     
    <div style={styles.container}>
       
      <Sidebar />
      <div style={styles.mainContent}>
        <Header />
        <main style={styles.main}>
       {activeSection === 'dashboard' ? <DashboardContent /> : 
 activeSection === 'charts' ? <TradingViewWidget /> :
  activeSection === 'alerts' ? <TradingViewNewsWidget /> : 
  activeSection === 'economic' ? <TradingViewEventsWidget /> : 
 <PlaceholderSection />}

        </main>
      </div>
    </div>
  );
};
// HELLLO JHAMES
export default TradingDashboard;