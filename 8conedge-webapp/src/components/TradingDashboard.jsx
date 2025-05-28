import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Shield, Globe, Calendar, Bell, Settings, User, Search, Star, Eye, Brain, Target } from 'lucide-react';

const TradingDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState({});
  const [userPreferences, setUserPreferences] = useState({
    riskTolerance: 'moderate',
    preferredAssets: ['forex', 'stocks'],
    theme: 'dark'
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate real market data
      setMarketData({
        topSetups: [
          { symbol: 'EUR/USD', bias: 'Bullish', score: 8.7, change: '+0.23%', confidence: 92 },
          { symbol: 'GBP/JPY', bias: 'Bearish', score: 7.9, change: '-0.18%', confidence: 87 },
          { symbol: 'GOLD', bias: 'Bullish', score: 9.1, change: '+0.45%', confidence: 95 },
          { symbol: 'AAPL', bias: 'Neutral', score: 6.2, change: '+0.12%', confidence: 74 }
        ],
        riskGauge: 'Risk-On',
        marketSentiment: { institutional: 68, retail: 42 },
        economicEvents: 3
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const BiasIndicator = ({ bias, score, confidence }) => {
    const getBiasColor = (bias) => {
      switch(bias) {
        case 'Bullish': return 'text-green-400 bg-green-900/30';
        case 'Bearish': return 'text-red-400 bg-red-900/30';
        default: return 'text-yellow-400 bg-yellow-900/30';
      }
    };

    return (
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBiasColor(bias)}`}>
        {bias} ({confidence}%)
      </div>
    );
  };

  const ScoreDisplay = ({ score }) => {
    const getScoreColor = (score) => {
      if (score >= 8) return 'text-green-400';
      if (score >= 6) return 'text-yellow-400';
      return 'text-red-400';
    };

    return (
      <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score}/10
      </div>
    );
  };

  const ConfidenceBar = ({ confidence }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
        style={{ width: `${confidence}%` }}
      />
    </div>
  );

  const Sidebar = () => (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 border-r border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">8ConEdge</h1>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'setups', label: 'Top Setups', icon: TrendingUp },
            { id: 'sentiment', label: 'Market Sentiment', icon: Activity },
            { id: 'risk', label: 'Risk Management', icon: Shield },
            { id: 'economic', label: 'Economic Calendar', icon: Calendar },
            { id: 'seasonality', label: 'Seasonality', icon: Globe },
            { id: 'alerts', label: 'Alerts', icon: Bell }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
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
    <div className="ml-64 bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
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
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
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
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Success Rate</h4>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">87.3%</div>
          <div className="text-sm text-gray-400">Last 30 days</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Risk Level</h4>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-2">{marketData.riskGauge}</div>
          <div className="text-sm text-gray-400">Current market</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-purple-400" />
            <h4 className="text-lg font-semibold text-white">Watching</h4>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">24</div>
          <div className="text-sm text-gray-400">Assets monitored</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-orange-400" />
            <h4 className="text-lg font-semibold text-white">Alerts</h4>
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">{marketData.economicEvents}</div>
          <div className="text-sm text-gray-400">Active notifications</div>
        </div>
      </div>

      {/* Top Setups */}
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
            <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-white">{setup.symbol}</div>
                  <BiasIndicator bias={setup.bias} confidence={setup.confidence} />
                  <ScoreDisplay score={setup.score} />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${setup.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {setup.change}
                    </div>
                    <div className="text-sm text-gray-400">24h Change</div>
                  </div>
                  
                  <div className="w-32">
                    <div className="text-sm text-gray-400 mb-1">Confidence</div>
                    <ConfidenceBar confidence={setup.confidence} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-semibold text-white mb-4">📊 Market Sentiment</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Institutional</span>
                <span className="text-white font-semibold">{marketData.marketSentiment?.institutional}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${marketData.marketSentiment?.institutional}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Retail</span>
                <span className="text-white font-semibold">{marketData.marketSentiment?.retail}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${marketData.marketSentiment?.retail}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-semibold text-white mb-4">🤖 AI Insights</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
              <div>
                <div className="text-white font-medium">Strong USD momentum detected</div>
                <div className="text-sm text-gray-400">Based on DXY technical analysis</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
              <div>
                <div className="text-white font-medium">Gold showing seasonal strength</div>
                <div className="text-sm text-gray-400">Historical pattern suggests continuation</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
              <div>
                <div className="text-white font-medium">Risk sentiment improving</div>
                <div className="text-sm text-gray-400">Favor risk-on assets this week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingScreen = () => (
    <div className="ml-64 min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Loading 8ConEdge</h3>
        <p className="text-gray-400">Analyzing market data and preparing your insights...</p>
        <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Sidebar />
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Sidebar />
      <Header />
      
      <main className="ml-64 p-6">
        {activeSection === 'dashboard' && <DashboardContent />}
        {activeSection !== 'dashboard' && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section</h3>
            <p className="text-gray-400 mb-4">This section is under development and will be available soon.</p>
            <button 
              onClick={() => setActiveSection('dashboard')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TradingDashboard;