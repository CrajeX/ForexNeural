import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Globe, RefreshCw, AlertCircle } from 'lucide-react';

const GDPDashboard = () => {
  const [gdpData, setGdpData] = useState({
    fred: [],
    worldBank: [],
    oecd: [],
    alphaVantage: []
  });
  const [loading, setLoading] = useState({
    fred: false,
    worldBank: false,
    oecd: false,
    alphaVantage: false
  });
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('USA');

  // FRED API - Federal Reserve Economic Data
  const fetchFredData = async () => {
    setLoading(prev => ({ ...prev, fred: true }));
    try {
      // Note: In production, you'd need to register for a free API key at https://fred.stlouisfed.org/docs/api/api_key.html
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=GDPC1&api_key=YOUR_FRED_API_KEY&file_type=json&limit=20`
      );
      
      if (!response.ok) throw new Error('FRED API unavailable');
      
      const data = await response.json();
      const formattedData = data.observations?.map(obs => ({
        date: obs.date,
        value: parseFloat(obs.value),
        source: 'FRED'
      })) || [];
      
      setGdpData(prev => ({ ...prev, fred: formattedData }));
    } catch (error) {
      setErrors(prev => ({ ...prev, fred: error.message }));
      // Mock data for demo purposes
      setGdpData(prev => ({ 
        ...prev, 
        fred: [
          { date: '2023-Q1', value: 2.4, source: 'FRED (Demo)' },
          { date: '2023-Q2', value: 2.1, source: 'FRED (Demo)' },
          { date: '2023-Q3', value: 3.2, source: 'FRED (Demo)' },
          { date: '2023-Q4', value: 2.8, source: 'FRED (Demo)' }
        ]
      }));
    } finally {
      setLoading(prev => ({ ...prev, fred: false }));
    }
  };

  // World Bank API
  const fetchWorldBankData = async () => {
    setLoading(prev => ({ ...prev, worldBank: true }));
    try {
      const response = await fetch(
        `https://api.worldbank.org/v2/country/${selectedCountry}/indicator/NY.GDP.MKTP.KD.ZG?format=json&date=2018:2023`
      );
      
      if (!response.ok) throw new Error('World Bank API unavailable');
      
      const data = await response.json();
      const formattedData = data[1]?.map(item => ({
        date: item.date,
        value: item.value,
        source: 'World Bank'
      })).filter(item => item.value !== null) || [];
      
      setGdpData(prev => ({ ...prev, worldBank: formattedData }));
    } catch (error) {
      setErrors(prev => ({ ...prev, worldBank: error.message }));
      // Mock data for demo
      setGdpData(prev => ({ 
        ...prev, 
        worldBank: [
          { date: '2020', value: -3.4, source: 'World Bank (Demo)' },
          { date: '2021', value: 5.7, source: 'World Bank (Demo)' },
          { date: '2022', value: 2.1, source: 'World Bank (Demo)' },
          { date: '2023', value: 2.5, source: 'World Bank (Demo)' }
        ]
      }));
    } finally {
      setLoading(prev => ({ ...prev, worldBank: false }));
    }
  };

  // Alpha Vantage API
  const fetchAlphaVantageData = async () => {
    setLoading(prev => ({ ...prev, alphaVantage: true }));
    try {
      // Note: Register for free API key at https://www.alphavantage.co/support/#api-key
      const response = await fetch(
        `https://www.alphavantage.co/query?function=REAL_GDP&interval=quarterly&apikey=YOUR_ALPHA_VANTAGE_API_KEY`
      );
      
      if (!response.ok) throw new Error('Alpha Vantage API unavailable');
      
      const data = await response.json();
      const formattedData = Object.entries(data.data || {}).map(([date, value]) => ({
        date,
        value: parseFloat(value),
        source: 'Alpha Vantage'
      })) || [];
      
      setGdpData(prev => ({ ...prev, alphaVantage: formattedData }));
    } catch (error) {
      setErrors(prev => ({ ...prev, alphaVantage: error.message }));
      // Mock data for demo
      setGdpData(prev => ({ 
        ...prev, 
        alphaVantage: [
          { date: '2023-01-01', value: 2.2, source: 'Alpha Vantage (Demo)' },
          { date: '2023-04-01', value: 2.5, source: 'Alpha Vantage (Demo)' },
          { date: '2023-07-01', value: 3.1, source: 'Alpha Vantage (Demo)' },
          { date: '2023-10-01', value: 2.8, source: 'Alpha Vantage (Demo)' }
        ]
      }));
    } finally {
      setLoading(prev => ({ ...prev, alphaVantage: false }));
    }
  };

  // OECD API
  const fetchOECDData = async () => {
    setLoading(prev => ({ ...prev, oecd: true }));
    try {
      const response = await fetch(
        `https://stats.oecd.org/SDMX-JSON/data/QNA/USA.B1_GE.GPSA.Q/all?startTime=2022&endTime=2023`
      );
      
      if (!response.ok) throw new Error('OECD API unavailable');
      
      const data = await response.json();
      // OECD data structure is complex, this is a simplified parsing
      const formattedData = data.dataSets?.[0]?.observations || {};
      const processedData = Object.entries(formattedData).map(([key, value], index) => ({
        date: `2023-Q${index + 1}`,
        value: Array.isArray(value) ? value[0] : value,
        source: 'OECD'
      }));
      
      setGdpData(prev => ({ ...prev, oecd: processedData }));
    } catch (error) {
      setErrors(prev => ({ ...prev, oecd: error.message }));
      // Mock data for demo
      setGdpData(prev => ({ 
        ...prev, 
        oecd: [
          { date: '2023-Q1', value: 2.3, source: 'OECD (Demo)' },
          { date: '2023-Q2', value: 2.0, source: 'OECD (Demo)' },
          { date: '2023-Q3', value: 3.0, source: 'OECD (Demo)' },
          { date: '2023-Q4', value: 2.7, source: 'OECD (Demo)' }
        ]
      }));
    } finally {
      setLoading(prev => ({ ...prev, oecd: false }));
    }
  };

  const refreshAllData = () => {
    fetchFredData();
    fetchWorldBankData();
    fetchAlphaVantageData();
    fetchOECDData();
  };

  useEffect(() => {
    refreshAllData();
  }, [selectedCountry]);

  const combineDataForChart = () => {
    const allData = [
      ...gdpData.fred.map(d => ({ ...d, source: 'FRED' })),
      ...gdpData.worldBank.map(d => ({ ...d, source: 'World Bank' })),
      ...gdpData.alphaVantage.map(d => ({ ...d, source: 'Alpha Vantage' })),
      ...gdpData.oecd.map(d => ({ ...d, source: 'OECD' }))
    ];
    
    return allData.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getLatestGDP = (source) => {
    const data = gdpData[source];
    if (!data || data.length === 0) return null;
    return data[data.length - 1];
  };

  const isPositiveGrowth = (value) => value > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">GDP Growth Rate Dashboard</h1>
                <p className="text-gray-600">Real-time GDP data from multiple sources</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USA">United States</option>
                <option value="GBR">United Kingdom</option>
                <option value="DEU">Germany</option>
                <option value="JPN">Japan</option>
                <option value="CHN">China</option>
              </select>
              <button
                onClick={refreshAllData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {['fred', 'worldBank', 'alphaVantage', 'oecd'].map((source) => {
            const latest = getLatestGDP(source);
            const sourceName = {
              fred: 'FRED',
              worldBank: 'World Bank',
              alphaVantage: 'Alpha Vantage',
              oecd: 'OECD'
            }[source];

            return (
              <div key={source} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{sourceName}</h3>
                  {loading[source] ? (
                    <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : errors[source] ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    latest && (isPositiveGrowth(latest.value) ? 
                      <TrendingUp className="w-5 h-5 text-green-500" /> :
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )
                  )}
                </div>
                {latest ? (
                  <div>
                    <div className={`text-2xl font-bold ${isPositiveGrowth(latest.value) ? 'text-green-600' : 'text-red-600'}`}>
                      {latest.value.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">{latest.date}</div>
                  </div>
                ) : (
                  <div className="text-gray-400">No data available</div>
                )}
                {errors[source] && (
                  <div className="text-xs text-red-500 mt-2">{errors[source]}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">GDP Growth Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combineDataForChart()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Latest Values */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest GDP Growth by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { source: 'FRED', value: getLatestGDP('fred')?.value || 0 },
                { source: 'World Bank', value: getLatestGDP('worldBank')?.value || 0 },
                { source: 'Alpha Vantage', value: getLatestGDP('alphaVantage')?.value || 0 },
                { source: 'OECD', value: getLatestGDP('oecd')?.value || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Integration Guide */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">API Integration Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Required API Keys:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• FRED: Register at fred.stlouisfed.org</li>
                <li>• Alpha Vantage: Free at alphavantage.co</li>
                <li>• World Bank: No key required</li>
                <li>• OECD: No key required</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Update Frequencies:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• GDP data: Quarterly releases</li>
                <li>• Best practice: Cache for 24 hours</li>
                <li>• Rate limits: Vary by provider</li>
                <li>• Error handling: Always implement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPDashboard;