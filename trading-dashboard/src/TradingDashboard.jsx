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
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Shield, Globe, Calendar, Bell, Settings, User, Search, Star, Eye, Target } from 'lucide-react';
import './TradingDashboard.css';

// Constants
const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'setups', label: 'Top Setups', icon: TrendingUp },
  { id: 'sentiment', label: 'Market Sentiment', icon: Activity },
  { id: 'risk', label: 'Risk Management', icon: Shield },
  { id: 'economic', label: 'Economic Calendar', icon: Calendar },
  { id: 'seasonality', label: 'Seasonality', icon: Globe },
  { id: 'alerts', label: 'Alerts', icon: Bell }
];

const MOCK_MARKET_DATA = {
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
    color: 'bg-green-400'
  },
  {
    type: 'warning',
    title: 'Gold showing seasonal strength',
    description: 'Historical pattern suggests continuation',
    color: 'bg-yellow-400'
  },
  {
    type: 'info',
    title: 'Risk sentiment improving',
    description: 'Favor risk-on assets this week',
    color: 'bg-blue-400'
  }
];

// Utility Functions
const getBiasColor = (bias) => {
  const colors = {
    'Bullish': 'text-green-400 bg-green-900/30',
    'Bearish': 'text-red-400 bg-red-900/30',
    'Neutral': 'text-yellow-400 bg-yellow-900/30'
  };
  return colors[bias] || colors.Neutral;
};

const getScoreColor = (score) => {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-red-400';
};

// UI Components
const BiasIndicator = ({ bias, confidence }) => (
  <div className={`bias-indicator ${bias.toLowerCase() === 'bullish' ? 'bias-bullish' : bias.toLowerCase() === 'bearish' ? 'bias-bearish' : 'bias-neutral'}`}>
    {bias} ({confidence}%)
  </div>
);

const ScoreDisplay = ({ score }) => (
  <div className={`score-display ${getScoreColor(score)}`}>
    {score}/10
  </div>
);

const ConfidenceBar = ({ confidence }) => (
  <div className="confidence-bar-container">
    <div 
      className="confidence-bar"
      style={{ width: `${confidence}%` }}
    />
  </div>
);

const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="card">
    <div className="metric-card-header">
      <Icon className={`w-8 h-8 ${color}`} />
      <h4 className="metric-card-title">{title}</h4>
    </div>
    <div className={`metric-card-value ${color}`}>{value}</div>
    <div className="metric-card-subtitle">{subtitle}</div>
  </div>
);

const TradingSetupCard = ({ setup, index }) => (
  <div className="setup-card">
    <div className="setup-card-content">
      <div className="setup-card-left">
        <div className="setup-symbol">{setup.symbol}</div>
        <BiasIndicator bias={setup.bias} confidence={setup.confidence} />
        <ScoreDisplay score={setup.score} />
      </div>
      
      <div className="setup-card-right">
        <div className="text-right">
          <div className={setup.change.startsWith('+') ? 'setup-change-positive' : 'setup-change-negative'}>
            {setup.change}
          </div>
          <div className="setup-change-label">24h Change</div>
        </div>
        
        <div className="confidence-section">
          <div className="confidence-label">Confidence</div>
          <ConfidenceBar confidence={setup.confidence} />
        </div>
      </div>
    </div>
  </div>
);

const SentimentBar = ({ label, value, gradient }) => (
  <div className="sentiment-item">
    <div className="sentiment-header">
      <span className="sentiment-label">{label}</span>
      <span className="sentiment-value">{value}%</span>
    </div>
    <div className="sentiment-bar-container">
      <div 
        className={gradient === 'bg-gradient-to-r from-green-500 to-blue-500' ? 'sentiment-bar-institutional' : 'sentiment-bar-retail'}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const InsightItem = ({ insight }) => (
  <div className="insight-item">
    <div className={`insight-dot ${insight.color}`} />
    <div>
      <div className="insight-title">{insight.title}</div>
      <div className="insight-description">{insight.description}</div>
    </div>
  </div>
);

// Custom Hook for Data Loading
const useMarketData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMarketData(MOCK_MARKET_DATA);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return { isLoading, marketData };
};

const TradingDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userPreferences, setUserPreferences] = useState({
    riskTolerance: 'moderate',
    preferredAssets: ['forex', 'stocks'],
    theme: 'dark'
  });
  
  const { isLoading, marketData } = useMarketData();

  const Sidebar = () => (
    <div className="sidebar">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
         
            <div className="flex justify-center">
            <img src="/1.png" alt="Icon" className="w-7 h-6" />
            
            </div>

         

        </div>
        
        <nav className="space-y-2">
          {NAVIGATION_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={activeSection === item.id ? 'active' : ''}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const Header = () => (
    <div className="header">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white capitalize">{activeSection}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Data
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search assets..."
            className="search-input"
          />
        </div>
        <button className="p-2 bg-gray-800 rounded-lg border border-gray-700 text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
        <button className="p-2 bg-gray-800 rounded-lg border border-gray-700 text-gray-400 hover:text-white">
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const WelcomeSection = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Welcome back, Trader!</h3>
          <p className="text-blue-100">Your AI-powered trading companion is ready. Let's make confident decisions together.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{marketData.topSetups?.length || 0}</div>
          <div className="text-blue-100">Active Setups</div>
        </div>
      </div>
    </div>
  );

  const KeyMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        icon={Target}
        title="Success Rate"
        value="87.3%"
        subtitle="Last 30 days"
        color="text-green-400"
      />
      <MetricCard
        icon={Shield}
        title="Risk Level"
        value={marketData.riskGauge}
        subtitle="Current market"
        color="text-yellow-400"
      />
      <MetricCard
        icon={Eye}
        title="Watching"
        value="24"
        subtitle="Assets monitored"
        color="text-purple-400"
      />
      <MetricCard
        icon={Bell}
        title="Alerts"
        value={marketData.economicEvents}
        subtitle="Active notifications"
        color="text-orange-400"
      />
    </div>
  );

  const TopSetups = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-semibold text-white">🎯 Top Trading Setups</h4>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Star className="w-4 h-4 text-yellow-400" />
          AI-Ranked by Confidence
        </div>
      </div>
      
      <div className="space-y-4">
        {marketData.topSetups?.map((setup, index) => (
          <TradingSetupCard key={index} setup={setup} index={index} />
        ))}
      </div>
    </div>
  );

  const MarketSentiment = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h4 className="text-xl font-semibold text-white mb-4">📊 Market Sentiment</h4>
      <div className="space-y-4">
        <SentimentBar
          label="Institutional"
          value={marketData.marketSentiment?.institutional}
          gradient="bg-gradient-to-r from-green-500 to-blue-500"
        />
        <SentimentBar
          label="Retail"
          value={marketData.marketSentiment?.retail}
          gradient="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>
    </div>
  );

  const AIInsights = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h4 className="text-xl font-semibold text-white mb-4">🤖 AI Insights</h4>
      <div className="space-y-3">
        {AI_INSIGHTS.map((insight, index) => (
          <InsightItem key={index} insight={insight} />
        ))}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <WelcomeSection />
      <KeyMetrics />
      <TopSetups />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketSentiment />
        <AIInsights />
      </div>
    </div>
  );

  const LoadingScreen = () => (
    <div className="section-content min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
          
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Loading 8ConEdge</h3>
        <p className="text-gray-400">Analyzing market data and preparing your insights...</p>
        <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );

  const PlaceholderSection = () => (
    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
        <BarChart3 className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
      </h3>
      <p className="text-gray-400 mb-4">This section is under development and will be available soon.</p>
      <button 
        onClick={() => setActiveSection('dashboard')}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
      >
        Back to Dashboard
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Header />
      
      <main className="section-content">
        {activeSection === 'dashboard' ? <DashboardContent /> : <PlaceholderSection />}
      </main>
    </div>
  );
};

export default TradingDashboard;