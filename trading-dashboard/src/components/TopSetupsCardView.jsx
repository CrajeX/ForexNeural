// import React, { useState, useEffect, useCallback } from "react";
// import { TrendingUp, TrendingDown, Activity } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const TopSetupsCardView = ({ limit = 5, onAssetPairClick }) => {
//   const navigate = useNavigate();
//   const [topSetups, setTopSetups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Function to get bias icon and color
//   const getBiasConfig = (bias, score) => {
//     switch(bias) {
//       case 'Very Bullish':
//         return { 
//           icon: TrendingUp, 
//           color: '#1a9850',
//           bgColor: '#1a9850'
//         };
//       case 'Bullish':
//         return { 
//           icon: TrendingUp, 
//           color: '#91cf60',
//           bgColor: '#91cf60'
//         };
//       case 'Very Bearish':
//         return { 
//           icon: TrendingDown, 
//           color: '#d73027',
//           bgColor: '#d73027'
//         };
//       case 'Bearish':
//         return { 
//           icon: TrendingDown, 
//           color: '#fc8d59',
//           bgColor: '#fc8d59'
//         };
//       default:
//         return { 
//           icon: Activity, 
//           color: '#f39c12',
//           bgColor: '#f39c12'
//         };
//     }
//   };

//   // Handle click navigation using React Router
//   const handleAssetPairClick = (assetPairCode) => {
//     // Call external click handler if provided
//     if (onAssetPairClick) {
//       onAssetPairClick(assetPairCode);
//     }
    
//     // Set programmatic navigation flag for protected routes
//     sessionStorage.setItem('programmaticNav', 'true');
//     sessionStorage.setItem('allowNavigation', 'true');
    
//     // Navigate to currency profile page with asset pair code as URL parameter
//     // navigate(`/currency-profile/${encodeURIComponent(assetPairCode)}`);
//     navigate(`/dashboard/${encodeURIComponent(assetPairCode)}`);
//     console.log("Navigating to currency profile page for:", assetPairCode);
//   };

//   // Fetch economic data for a specific asset pair (same as TopSetups.jsx)
//   const fetchEconomicDataForPair = async (pair) => {
//     const baseAsset = pair.baseAsset;
//     const quoteAsset = pair.quoteAsset;
//     const assetPairCode = pair.value;

//     try {
//       const fetchWithFallback = async (url) => {
//         try {
//           const response = await fetch(url);
//           if (!response.ok) return null;
//           const data = await response.json();
//           return data.success && data.data && data.data.length > 0 ? data.data[0] : null;
//         } catch (error) {
//           console.warn(`Failed to fetch ${url}:`, error.message);
//           return null;
//         }
//       };

//       const [
//         cotBase, cotQuote, gdpBase, gdpQuote,
//         mpmiBase, mpmiQuote, spmiBase, spmiQuote,
//         retailBase, retailQuote, unemploymentBase, unemploymentQuote,
//         employmentBase, employmentQuote, inflationBase, inflationQuote,
//         interestBase, interestQuote, retailSentiment,
//       ] = await Promise.all([
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/cot/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/cot/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/gdp/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/gdp/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/mpmi/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/mpmi/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/spmi/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/spmi/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/retail/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/retail/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/unemployment/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/unemployment/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/employment/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/employment/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/inflation/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/inflation/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/interest/${baseAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/economic-data/interest/${quoteAsset}?limit=1`),
//         fetchWithFallback(`http://${BASE_URL}:3000/api/retail-sentiment/${assetPairCode}?limit=1`),
        
//       ]);

//       return {
//         baseAsset,
//         quoteAsset,
//         cotData: {
//           baseLongPercent: cotBase?.long_percent,
//           baseShortPercent: cotBase?.short_percent,
//           baseNetChangePercent: cotBase?.net_change_percent,
//           quoteLongPercent: cotQuote?.long_percent,
//           quoteShortPercent: cotQuote?.short_percent,
//           quoteNetChangePercent: cotQuote?.net_change_percent,
//         },
//         retailPosition: {
//           longPercent: retailSentiment?.retail_long,
//           shortPercent: retailSentiment?.retail_short,
//         },
//         employment: {
//           baseChange: employmentBase?.employment_change,
//           baseForecast: employmentBase?.forecast,
//           quoteChange: employmentQuote?.employment_change,
//           quoteForecast: employmentQuote?.forecast,
//         },
//         unemployment: {
//           baseRate: unemploymentBase?.unemployment_rate,
//           baseForecast: unemploymentBase?.forecast,
//           quoteRate: unemploymentQuote?.unemployment_rate,
//           quoteForecast: unemploymentQuote?.forecast,
//         },
//         gdp: {
//           baseResult: gdpBase?.result,
//           quoteResult: gdpQuote?.result,
//         },
//         mpmi: {
//           baseResult: mpmiBase?.result,
//           quoteResult: mpmiQuote?.result,
//         },
//         spmi: {
//           baseResult: spmiBase?.result,
//           quoteResult: spmiQuote?.result,
//         },
//         retail: {
//           baseResult: retailBase?.result,
//           quoteResult: retailQuote?.result,
//         },
//         inflation: {
//           baseCPI: inflationBase?.core_inflation,
//           baseForecast: inflationBase?.forecast,
//           quoteCPI: inflationQuote?.core_inflation,
//           quoteForecast: inflationQuote?.forecast,
//         },
//         interestRate: {
//           baseChange: interestBase?.change_in_interest,
//           quoteChange: interestQuote?.change_in_interest,
//         },
//       };
//     } catch (error) {
//       console.error(`❌ Error fetching economic data for pair ${assetPairCode}:`, error);
//       return null;
//     }
//   };

//   // Calculate scores (same logic as TopSetups.jsx)
//   const calculateScores = (data) => {
//     if (!data) {
//       return {
//         cot: 0, retailPosition: 0, employment: 0, unemployment: 0,
//         gdp: 0, mpmi: 0, spmi: 0, retail: 0, inflation: 0, interestRate: 0,
//       };
//     }

//     const scores = {};

//     // COT Scoring
//     const cotBaseScore = data.cotData.baseNetChangePercent > 0 ? 1 : data.cotData.baseNetChangePercent < 0 ? -1 : 0;
//     const cotQuoteScore = data.cotData.quoteNetChangePercent > 0 ? -1 : data.cotData.quoteNetChangePercent < 0 ? 1 : 0;
//     scores.cot = cotBaseScore + cotQuoteScore;

//     // Retail Position Score
//     scores.retailPosition = data.retailPosition.longPercent > data.retailPosition.shortPercent ? -1 : 1;

//     // Employment Change Score
//     const empBaseScore = data.employment.baseChange > data.employment.baseForecast ? 1 : data.employment.baseChange < data.employment.baseForecast ? -1 : 0;
//     const empQuoteScore = data.employment.quoteChange > data.employment.quoteForecast ? -1 : data.employment.quoteChange < data.employment.quoteForecast ? 1 : 0;
//     scores.employment = empBaseScore + empQuoteScore;

//     // Unemployment Score
//     const unempBaseScore = data.unemployment.baseRate > data.unemployment.baseForecast ? -1 : data.unemployment.baseRate < data.unemployment.baseForecast ? 1 : 0;
//     const unempQuoteScore = data.unemployment.quoteRate > data.unemployment.quoteForecast ? 1 : data.unemployment.quoteRate < data.unemployment.quoteForecast ? -1 : 0;
//     scores.unemployment = unempBaseScore + unempQuoteScore;

//     // Economic Growth Scores
//     const calculateGrowthScore = (baseResult, quoteResult) => {
//       const baseScore = baseResult === "Beat" ? 1 : baseResult === "Miss" || baseResult === "Missed" ? -1 : 0;
//       const quoteScore = quoteResult === "Beat" ? -1 : quoteResult === "Miss" || quoteResult === "Missed" ? 1 : 0;
//       return baseScore + quoteScore;
//     };

//     scores.gdp = calculateGrowthScore(data.gdp.baseResult, data.gdp.quoteResult);
//     scores.mpmi = calculateGrowthScore(data.mpmi.baseResult, data.mpmi.quoteResult);
//     scores.spmi = calculateGrowthScore(data.spmi.baseResult, data.spmi.quoteResult);
//     scores.retail = calculateGrowthScore(data.retail.baseResult, data.retail.quoteResult);

//     // Inflation Score
//     const inflBaseScore = data.inflation.baseCPI > data.inflation.baseForecast ? 1 : data.inflation.baseCPI < data.inflation.baseForecast ? -1 : 0;
//     const inflQuoteScore = data.inflation.quoteCPI > data.inflation.quoteForecast ? -1 : data.inflation.quoteCPI < data.inflation.quoteForecast ? 1 : 0;
//     scores.inflation = inflBaseScore + inflQuoteScore;

//     // Interest Rate Score
//     const intBaseScore = data.interestRate.baseChange > 0 ? 1 : data.interestRate.baseChange < 0 ? -1 : 0;
//     const intQuoteScore = data.interestRate.quoteChange > 0 ? -1 : data.interestRate.quoteChange < 0 ? 1 : 0;
//     scores.interestRate = intBaseScore + intQuoteScore;

//     return scores;
//   };

//   // Generate metrics (same logic as TopSetups.jsx)
//   const generateProperMetrics = (economicData) => {
//     const scores = calculateScores(economicData);
//     const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

//     let output;
//     if (totalScore >= 12) output = "Very Bullish";
//     else if (totalScore >= 5) output = "Bullish";
//     else if (totalScore >= -4) output = "Neutral";
//     else if (totalScore >= -11) output = "Bearish";
//     else output = "Very Bearish";

//     return { output, totalScore };
//   };

//   // Fetch top setups data
//   const fetchTopSetups = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch("http://${BASE_URL}:3000/api/asset-pairs");
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();
//       if (result.success && result.data) {
//         // Remove duplicates
//         const uniquePairs = result.data.filter((pair, index, self) => 
//           index === self.findIndex(p => p.value === pair.value)
//         );

//         // Process asset pairs
//         const assetPairsWithMetrics = await Promise.all(
//           uniquePairs.map(async (pair) => {
//             try {
//               const economicData = await fetchEconomicDataForPair(pair);
//               const metrics = generateProperMetrics(economicData);

//               return {
//                 asset_pair_code: pair.value,
//                 symbol: pair.description || `${pair.baseAsset}/${pair.quoteAsset}`,
//                 baseAsset: pair.baseAsset,
//                 quoteAsset: pair.quoteAsset,
//                 bias: metrics.output,
//                 score: metrics.totalScore,
//                 change: `${metrics.totalScore >= 0 ? '+' : ''}${metrics.totalScore}`,
//                 confidence: Math.min(95, Math.max(35, 50 + Math.abs(metrics.totalScore) * 3))
//               };
//             } catch (pairError) {
//               console.error(`❌ Error processing pair ${pair.value}:`, pairError);
//               return {
//                 asset_pair_code: pair.value,
//                 symbol: pair.description || `${pair.baseAsset}/${pair.quoteAsset}`,
//                 baseAsset: pair.baseAsset,
//                 quoteAsset: pair.quoteAsset,
//                 bias: 'Neutral',
//                 score: 0,
//                 change: '0',
//                 confidence: 50
//               };
//             }
//           })
//         );

//         // Sort by absolute score and take top N
//         const sortedSetups = assetPairsWithMetrics
//           .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
//           .slice(0, limit);

//         setTopSetups(sortedSetups);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching top setups:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [limit]);

//   useEffect(() => {
//     fetchTopSetups();
//   }, [fetchTopSetups]);

// const styles = {
// container: {
//   backgroundColor: '#6B8E6B',
//   borderRadius: '12px',
//   color: 'white',
//   fontFamily: 'system-ui, -apple-system, sans-serif',
//   boxSizing: 'border-box',
//   margin: '0',
//   maxWidth: 'none',
//   padding: '20px',
  
//   // Default for desktop
//   width: '77vw',
  
//   // Small mobile
//   '@media (min-width: 300px) and(max-width: 375px)': {
//     padding: '12px',
//     borderRadius: '6px',
//     fontSize: '14px',
//     width: '200vw',
//   },
  
//   // Mobile
//   '@media (max-width: 768px)': {
//     padding: '16px',
//     borderRadius: '8px',
//     width: '100vw',
//   },
  
//   // Tablet
//   '@media (min-width: 769px) and (max-width: 1024px)': {
//     width: '100vw',
//     padding: '18px',
//   },
  
//   // PC/Desktop
//   '@media (min-width: 1025px)': {
//     width: '77vw',
//     padding: '20px',
//   },
// },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '16px'
//     },
//     title: {
//       fontSize: '18px',
//       fontWeight: '600',
//       margin: 0,
//       color: 'white'
//     },
//     viewAllButton: {
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       padding: '6px 12px',
//       fontSize: '12px',
//       cursor: 'pointer',
//       fontWeight: '500'
//     },
//     cardsList: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '8px'
//     },
//     card: {
//       backgroundColor: 'rgba(0, 0, 0, 0.2)',
//       borderRadius: '8px',
//       padding: '12px 16px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s ease',
//       border: '1px solid rgba(255, 255, 255, 0.1)'
//     },
//     leftSection: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px'
//     },
//     iconContainer: {
//       width: '32px',
//       height: '32px',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: 'white'
//     },
//     textContainer: {
//       display: 'flex',
//       flexDirection: 'column'
//     },
//     symbol: {
//       fontSize: '14px',
//       fontWeight: '600',
//       color: 'white',
//       marginBottom: '2px'
//     },
//     details: {
//       fontSize: '11px',
//       color: 'rgba(255, 255, 255, 0.8)'
//     },
//     rightSection: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'flex-end'
//     },
//     score: {
//       fontSize: '16px',
//       fontWeight: '600',
//       color: 'white',
//       marginBottom: '2px'
//     },
//     confidence: {
//       fontSize: '10px',
//       color: 'rgba(255, 255, 255, 0.8)'
//     },
//     loading: {
//       textAlign: 'center',
//       padding: '20px',
//       color: 'rgba(255, 255, 255, 0.8)',
//       fontSize: '14px'
//     },
//     error: {
//       textAlign: 'center',
//       padding: '20px',
//       color: '#ffcccc',
//       fontSize: '14px'
//     }
//   };

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.header}>
//           <h3 style={styles.title}>Top Trading Setups</h3>
          
//         </div>
//         <div style={styles.loading}>Loading live data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.header}>
//           <h3 style={styles.title}>Top Trading Setups</h3>
          
//         </div>
//         <div style={styles.error}>Error loading data: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h3 style={styles.title}>Top Trading Setups</h3>
       
//       </div>
      
//       <div style={styles.cardsList}>
//         {topSetups.map((setup, index) => {
//           const biasConfig = getBiasConfig(setup.bias, setup.score);
//           const IconComponent = biasConfig.icon;
          
//           return (
//             <div
//               key={setup.asset_pair_code}
//               style={styles.card}
//               onClick={() => handleAssetPairClick(setup.asset_pair_code)}
//               onMouseEnter={(e) => {
//                 e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
//               }}
//             >
//               <div style={styles.leftSection}>
//                 <div style={{
//                   ...styles.iconContainer,
//                   backgroundColor: biasConfig.bgColor
//                 }}>
//                   <IconComponent size={16} />
//                 </div>
//                 <div style={styles.textContainer}>
//                   <div style={styles.symbol}>{setup.symbol}</div>
//                   <div style={styles.details}>
//                     {setup.bias} • Score: {setup.score}
//                   </div>
//                 </div>
//               </div>
              
//               <div style={styles.rightSection}>
//                 <div style={styles.score}>{setup.change}</div>
//                 <div style={styles.confidence}>{setup.confidence}% confidence</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default TopSetupsCardView;
import React, { useState, useEffect, useCallback, useRef } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopSetupsCardView = ({ limit = 5, onAssetPairClick }) => {
  const navigate = useNavigate();
  const [topSetups, setTopSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Cache for economic data to avoid repeated fetches
  const [economicDataCache, setEconomicDataCache] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  // Performance tracking
  const [performanceStats, setPerformanceStats] = useState(null);

  // Function to get bias icon and color
  const getBiasConfig = (bias, score) => {
    switch(bias) {
      case 'Very Bullish':
        return { 
          icon: TrendingUp, 
          color: '#1a9850',
          bgColor: '#1a9850'
        };
      case 'Bullish':
        return { 
          icon: TrendingUp, 
          color: '#91cf60',
          bgColor: '#91cf60'
        };
      case 'Very Bearish':
        return { 
          icon: TrendingDown, 
          color: '#d73027',
          bgColor: '#d73027'
        };
      case 'Bearish':
        return { 
          icon: TrendingDown, 
          color: '#fc8d59',
          bgColor: '#fc8d59'
        };
      default:
        return { 
          icon: Activity, 
          color: '#f39c12',
          bgColor: '#f39c12'
        };
    }
  };

  // Handle click navigation using React Router
  const handleAssetPairClick = (assetPairCode) => {
    // Call external click handler if provided
    if (onAssetPairClick) {
      onAssetPairClick(assetPairCode);
    }
    
    // Set programmatic navigation flag for protected routes
    sessionStorage.setItem('programmaticNav', 'true');
    sessionStorage.setItem('allowNavigation', 'true');
    
    // Navigate to currency profile page with asset pair code as URL parameter
    navigate(`/dashboard/${encodeURIComponent(assetPairCode)}`);
    console.log("Navigating to currency profile page for:", assetPairCode);
  };

  // Check if cache is valid
  const isCacheValid = () => {
    if (!economicDataCache || !cacheTimestamp) return false;
    return Date.now() - cacheTimestamp < CACHE_DURATION;
  };

  // ULTIMATE OPTIMIZATION: Single mega bulk call for ALL data
  const fetchAllEconomicDataMega = useCallback(async () => {
    // Check cache first
    if (isCacheValid()) {
      console.log("📋 CardView: Using cached economic data");
      return economicDataCache;
    }

    try {
      console.log("🚀 CardView: Fetching ALL economic data in single mega call...");
      const startTime = Date.now();
      
      // Single API call for ALL economic data
      const response = await fetch(`http://${BASE_URL}:3000/api/economic-data/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to fetch mega bulk economic data");
      }

      const fetchTime = Date.now() - startTime;

      // Organize data by asset code for quick lookup
      const economicData = {
        cot: {},
        gdp: {},
        mpmi: {},
        spmi: {},
        retail: {},
        unemployment: {},
        employment: {},
        inflation: {},
        interest: {},
        retailSentiment: {}
      };

      // Index all data by asset code/asset pair code for O(1) lookup
      if (result.data.cot) {
        result.data.cot.forEach(item => {
          economicData.cot[item.asset_code] = item;
        });
      }

      if (result.data.gdp) {
        result.data.gdp.forEach(item => {
          economicData.gdp[item.asset_code] = item;
        });
      }

      if (result.data.mpmi) {
        result.data.mpmi.forEach(item => {
          economicData.mpmi[item.asset_code] = item;
        });
      }

      if (result.data.spmi) {
        result.data.spmi.forEach(item => {
          economicData.spmi[item.asset_code] = item;
        });
      }

      if (result.data.retail) {
        result.data.retail.forEach(item => {
          economicData.retail[item.asset_code] = item;
        });
      }

      if (result.data.unemployment) {
        result.data.unemployment.forEach(item => {
          economicData.unemployment[item.asset_code] = item;
        });
      }

      if (result.data.employment) {
        result.data.employment.forEach(item => {
          economicData.employment[item.asset_code] = item;
        });
      }

      if (result.data.inflation) {
        result.data.inflation.forEach(item => {
          economicData.inflation[item.asset_code] = item;
        });
      }

      if (result.data.interest) {
        result.data.interest.forEach(item => {
          economicData.interest[item.asset_code] = item;
        });
      }

      if (result.data.retailSentiment) {
        result.data.retailSentiment.forEach(item => {
          economicData.retailSentiment[item.asset_pair_code] = item;
        });
      }

      // Cache the data
      setEconomicDataCache(economicData);
      setCacheTimestamp(Date.now());

      // Track performance
      setPerformanceStats({
        fetchTime,
        totalRecords: result.totalRecords || 0,
        backendTime: result.executionTimeMs || 0,
        recordsByType: result.recordsByType || {}
      });

      console.log(`🚀 CardView: MEGA BULK SUCCESS: ${result.totalRecords || 0} records in ${fetchTime}ms`);
      return economicData;

    } catch (error) {
      console.error("❌ CardView: Error fetching mega bulk economic data:", error);
      return null;
    }
  }, [economicDataCache, cacheTimestamp]);

  // Process economic data for a specific pair using cached data
  const getEconomicDataForPair = (pair, economicData) => {
    if (!economicData) return null;

    const baseAsset = pair.baseAsset;
    const quoteAsset = pair.quoteAsset;
    const assetPairCode = pair.value;

    return {
      baseAsset,
      quoteAsset,
      // COT Data
      cotData: {
        baseLongPercent: economicData.cot[baseAsset]?.long_percent,
        baseShortPercent: economicData.cot[baseAsset]?.short_percent,
        baseNetChangePercent: economicData.cot[baseAsset]?.net_change_percent,
        quoteLongPercent: economicData.cot[quoteAsset]?.long_percent,
        quoteShortPercent: economicData.cot[quoteAsset]?.short_percent,
        quoteNetChangePercent: economicData.cot[quoteAsset]?.net_change_percent,
      },
      // Retail Position Data
      retailPosition: {
        longPercent: economicData.retailSentiment[assetPairCode]?.retail_long,
        shortPercent: economicData.retailSentiment[assetPairCode]?.retail_short,
      },
      // Employment Data
      employment: {
        baseChange: economicData.employment[baseAsset]?.employment_change,
        baseForecast: economicData.employment[baseAsset]?.forecast,
        quoteChange: economicData.employment[quoteAsset]?.employment_change,
        quoteForecast: economicData.employment[quoteAsset]?.forecast,
      },
      // Unemployment Data
      unemployment: {
        baseRate: economicData.unemployment[baseAsset]?.unemployment_rate,
        baseForecast: economicData.unemployment[baseAsset]?.forecast,
        quoteRate: economicData.unemployment[quoteAsset]?.unemployment_rate,
        quoteForecast: economicData.unemployment[quoteAsset]?.forecast,
      },
      // Economic Growth Data
      gdp: {
        baseResult: economicData.gdp[baseAsset]?.result,
        quoteResult: economicData.gdp[quoteAsset]?.result,
      },
      mpmi: {
        baseResult: economicData.mpmi[baseAsset]?.result,
        quoteResult: economicData.mpmi[quoteAsset]?.result,
      },
      spmi: {
        baseResult: economicData.spmi[baseAsset]?.result,
        quoteResult: economicData.spmi[quoteAsset]?.result,
      },
      retail: {
        baseResult: economicData.retail[baseAsset]?.result,
        quoteResult: economicData.retail[quoteAsset]?.result,
      },
      // Inflation Data
      inflation: {
        baseCPI: economicData.inflation[baseAsset]?.core_inflation,
        baseForecast: economicData.inflation[baseAsset]?.forecast,
        quoteCPI: economicData.inflation[quoteAsset]?.core_inflation,
        quoteForecast: economicData.inflation[quoteAsset]?.forecast,
      },
      // Interest Rate Data
      interestRate: {
        baseChange: economicData.interest[baseAsset]?.change_in_interest,
        quoteChange: economicData.interest[quoteAsset]?.change_in_interest,
      },
    };
  };

  // Calculate scores (same logic as before)
  const calculateScores = (data) => {
    if (!data) {
      return {
        cot: 0, retailPosition: 0, employment: 0, unemployment: 0,
        gdp: 0, mpmi: 0, spmi: 0, retail: 0, inflation: 0, interestRate: 0,
      };
    }

    const scores = {};

    // COT Scoring
    const cotBaseScore = data.cotData.baseNetChangePercent > 0 ? 1 : data.cotData.baseNetChangePercent < 0 ? -1 : 0;
    const cotQuoteScore = data.cotData.quoteNetChangePercent > 0 ? -1 : data.cotData.quoteNetChangePercent < 0 ? 1 : 0;
    scores.cot = cotBaseScore + cotQuoteScore;

    // Retail Position Score
    scores.retailPosition = data.retailPosition.longPercent > data.retailPosition.shortPercent ? -1 : 1;

    // Employment Change Score
    const empBaseScore = data.employment.baseChange > data.employment.baseForecast ? 1 : data.employment.baseChange < data.employment.baseForecast ? -1 : 0;
    const empQuoteScore = data.employment.quoteChange > data.employment.quoteForecast ? -1 : data.employment.quoteChange < data.employment.quoteForecast ? 1 : 0;
    scores.employment = empBaseScore + empQuoteScore;

    // Unemployment Score
    const unempBaseScore = data.unemployment.baseRate > data.unemployment.baseForecast ? -1 : data.unemployment.baseRate < data.unemployment.baseForecast ? 1 : 0;
    const unempQuoteScore = data.unemployment.quoteRate > data.unemployment.quoteForecast ? 1 : data.unemployment.quoteRate < data.unemployment.quoteForecast ? -1 : 0;
    scores.unemployment = unempBaseScore + unempQuoteScore;

    // Economic Growth Scores
    const calculateGrowthScore = (baseResult, quoteResult) => {
      const baseScore = baseResult === "Beat" ? 1 : baseResult === "Miss" || baseResult === "Missed" ? -1 : 0;
      const quoteScore = quoteResult === "Beat" ? -1 : quoteResult === "Miss" || quoteResult === "Missed" ? 1 : 0;
      return baseScore + quoteScore;
    };

    scores.gdp = calculateGrowthScore(data.gdp.baseResult, data.gdp.quoteResult);
    scores.mpmi = calculateGrowthScore(data.mpmi.baseResult, data.mpmi.quoteResult);
    scores.spmi = calculateGrowthScore(data.spmi.baseResult, data.spmi.quoteResult);
    scores.retail = calculateGrowthScore(data.retail.baseResult, data.retail.quoteResult);

    // Inflation Score
    const inflBaseScore = data.inflation.baseCPI > data.inflation.baseForecast ? 1 : data.inflation.baseCPI < data.inflation.baseForecast ? -1 : 0;
    const inflQuoteScore = data.inflation.quoteCPI > data.inflation.quoteForecast ? -1 : data.inflation.quoteCPI < data.inflation.quoteForecast ? 1 : 0;
    scores.inflation = inflBaseScore + inflQuoteScore;

    // Interest Rate Score
    const intBaseScore = data.interestRate.baseChange > 0 ? 1 : data.interestRate.baseChange < 0 ? -1 : 0;
    const intQuoteScore = data.interestRate.quoteChange > 0 ? -1 : data.interestRate.quoteChange < 0 ? 1 : 0;
    scores.interestRate = intBaseScore + intQuoteScore;

    return scores;
  };

  // Generate metrics (same logic as before)
  const generateProperMetrics = (economicData) => {
    const scores = calculateScores(economicData);
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    let output;
    if (totalScore >= 12) output = "Very Bullish";
    else if (totalScore >= 5) output = "Bullish";
    else if (totalScore >= -4) output = "Neutral";
    else if (totalScore >= -11) output = "Bearish";
    else output = "Very Bearish";

    return { output, totalScore };
  };

  // ULTIMATE OPTIMIZED: Main fetch function with just 2 total API calls
  const fetchTopSetups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🚀 CardView: Starting ULTIMATE optimized fetch (2 API calls total)...");
      const startTime = Date.now();

      // Fetch asset pairs and ALL economic data in parallel (2 calls total)
      const [assetPairsResponse, economicData] = await Promise.all([
        fetch(`http://${BASE_URL}:3000/api/asset-pairs`),
        fetchAllEconomicDataMega()
      ]);

      if (!assetPairsResponse.ok) {
        throw new Error(`HTTP error! status: ${assetPairsResponse.status}`);
      }

      const assetPairsResult = await assetPairsResponse.json();

      if (assetPairsResult.success && assetPairsResult.data) {
        console.log(`✅ CardView: Loaded ${assetPairsResult.data.length} asset pairs`);

        // Remove duplicates
        const uniquePairs = assetPairsResult.data.filter((pair, index, self) => 
          index === self.findIndex(p => p.value === pair.value)
        );

        console.log(`📋 CardView: Processing ${uniquePairs.length} unique asset pairs...`);

        // Process all asset pairs with mega cached economic data (ultra fast)
        const assetPairsWithMetrics = uniquePairs.map((pair) => {
          try {
            const pairEconomicData = getEconomicDataForPair(pair, economicData);
            const metrics = generateProperMetrics(pairEconomicData);

            return {
              asset_pair_code: pair.value,
              symbol: pair.description || `${pair.baseAsset}/${pair.quoteAsset}`,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              bias: metrics.output,
              score: metrics.totalScore,
              change: `${metrics.totalScore >= 0 ? '+' : ''}${metrics.totalScore}`,
              confidence: Math.min(95, Math.max(35, 50 + Math.abs(metrics.totalScore) * 3))
            };
          } catch (pairError) {
            console.error(`❌ CardView: Error processing pair ${pair.value}:`, pairError);
            return {
              asset_pair_code: pair.value,
              symbol: pair.description || `${pair.baseAsset}/${pair.quoteAsset}`,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              bias: 'Neutral',
              score: 0,
              change: '0',
              confidence: 50
            };
          }
        });

        // Sort by absolute score and take top N
        const sortedSetups = assetPairsWithMetrics
          .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
          .slice(0, limit);

        const totalTime = Date.now() - startTime;
        console.log(`🚀 CardView: ULTIMATE SUCCESS: ${sortedSetups.length} top setups processed in ${totalTime}ms`);

        setTopSetups(sortedSetups);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("❌ CardView: Error in ultimate fetch:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [limit, fetchAllEconomicDataMega]);

  // Force refresh (clear cache)
  const forceRefresh = useCallback(() => {
    setEconomicDataCache(null);
    setCacheTimestamp(null);
    setPerformanceStats(null);
    fetchTopSetups();
  }, [fetchTopSetups]);

  useEffect(() => {
    fetchTopSetups();
  }, [fetchTopSetups]);

  const styles = {
    container: {
      backgroundColor: '#6B8E6B',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      margin: '0',
      maxWidth: 'none',
      padding: '20px',
      
      // Default for desktop
      width: '77vw',
      
      // Small mobile
      '@media (min-width: 300px) and(max-width: 375px)': {
        padding: '12px',
        borderRadius: '6px',
        fontSize: '14px',
        width: '200vw',
      },
      
      // Mobile
      '@media (max-width: 768px)': {
        padding: '16px',
        borderRadius: '8px',
        width: '100vw',
      },
      
      // Tablet
      '@media (min-width: 769px) and (max-width: 1024px)': {
        width: '100vw',
        padding: '18px',
      },
      
      // PC/Desktop
      '@media (min-width: 1025px)': {
        width: '77vw',
        padding: '20px',
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      margin: 0,
      color: 'white'
    },
    performanceIndicator: {
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'right'
    },
    viewAllButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: '500'
    },
    cardsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    card: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconContainer: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    symbol: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '2px'
    },
    details: {
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.8)'
    },
    rightSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    score: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '2px'
    },
    confidence: {
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.8)'
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px'
    },
    error: {
      textAlign: 'center',
      padding: '20px',
      color: '#ffcccc',
      fontSize: '14px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Top Trading Setups</h3>
          <div style={styles.performanceIndicator}>
            🚀 Ultra-Fast Loading...
          </div>
        </div>
        <div style={styles.loading}>Loading live data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Top Trading Setups</h3>
        </div>
        <div style={styles.error}>
          Error loading data: {error}
          <button 
            onClick={forceRefresh}
            style={{
              ...styles.viewAllButton,
              marginTop: '8px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Top Trading Setups</h3>
        <div style={styles.performanceIndicator}>
          {isCacheValid() && <div>📋 Cached</div>}
          {performanceStats && (
            <div>
              ⚡ {performanceStats.totalRecords} records
              <br />
              {performanceStats.fetchTime}ms load
            </div>
          )}
          {lastUpdated && (
            <div style={{ fontSize: '9px' }}>
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
      
      <div style={styles.cardsList}>
        {topSetups.map((setup, index) => {
          const biasConfig = getBiasConfig(setup.bias, setup.score);
          const IconComponent = biasConfig.icon;
          
          return (
            <div
              key={setup.asset_pair_code}
              style={styles.card}
              onClick={() => handleAssetPairClick(setup.asset_pair_code)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={styles.leftSection}>
                <div style={{
                  ...styles.iconContainer,
                  backgroundColor: biasConfig.bgColor
                }}>
                  <IconComponent size={16} />
                </div>
                <div style={styles.textContainer}>
                  <div style={styles.symbol}>{setup.symbol}</div>
                  <div style={styles.details}>
                    {setup.bias} • Score: {setup.score}
                  </div>
                </div>
              </div>
              
              <div style={styles.rightSection}>
                <div style={styles.score}>{setup.change}</div>
                <div style={styles.confidence}>{setup.confidence}% confidence</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSetupsCardView;