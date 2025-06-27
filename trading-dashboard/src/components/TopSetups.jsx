// // import React, { useState, useEffect, useCallback } from "react";
// // import CurrencyProfile from "./CurrencyProfile";

// // const TopSetups = ({ onAssetPairClick }) => {
// //   const [assetPairs, setAssetPairs] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [lastUpdated, setLastUpdated] = useState(null);
// //   const [filterText, setFilterText] = useState("");
// //   const [isAscending, setIsAscending] = useState(false);
// //   const [sortedBy, setSortedBy] = useState("totalScore");
// //   const [rawAssetPairs, setRawAssetPairs] = useState([]);
// //   const [biasFilter, setBiasFilter] = useState("All");

// //   // Add state for currency profile navigation
// //   const [currentAssetPair, setCurrentAssetPair] = useState(null);
// //   const [showCurrencyProfile, setShowCurrencyProfile] = useState(false);

// //   // Add click handler for asset pair navigation
// //   const handleAssetPairClick = (assetPairCode) => {
// //     if (onAssetPairClick) {
// //       onAssetPairClick(assetPairCode);
// //     }
// //     // Also trigger currency profile navigation
// //     console.log(assetPairCode);
// //     navigateToCurrencyProfile(assetPairCode);
// //   };

// //   const navigateToCurrencyProfile = (assetPairCode) => {
// //     setCurrentAssetPair(assetPairCode);
// //     setShowCurrencyProfile(true);
// //     console.log("Navigating to currency profile for:", assetPairCode);
// //   };

// //   const navigateBackToSetups = () => {
// //     setShowCurrencyProfile(false);
// //     setCurrentAssetPair(null);
// //   };

// //   // FIXED: Memoized fetchAssetPairs to prevent duplicate calls
// //   const fetchAssetPairs = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       console.log("🔗 Fetching all asset pairs from database...");

// //       // Fetch asset pairs
// //       const response = await fetch("http://${BASE_URL}:3000/api/asset-pairs");

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const result = await response.json();

// //       if (result.success && result.data) {
// //         console.log(`✅ Loaded ${result.data.length} asset pairs`);

// //         // FIXED: Remove duplicates before processing
// //         const uniquePairs = result.data.filter(
// //           (pair, index, self) =>
// //             index === self.findIndex((p) => p.value === pair.value)
// //         );

// //         console.log(
// //           `📋 Processing ${uniquePairs.length} unique asset pairs...`
// //         );

// //         // Process each asset pair to get economic data
// //         const assetPairsWithMetrics = await Promise.all(
// //           uniquePairs.map(async (pair, index) => {
// //             try {
// //               const economicData = await fetchEconomicDataForPair(pair);
// //               const metrics = generateProperMetrics(economicData, index);

// //               return {
// //                 asset_pair_code: pair.value,
// //                 description:
// //                   pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
// //                 baseAsset: pair.baseAsset,
// //                 quoteAsset: pair.quoteAsset,
// //                 created_at: pair.created_at,
// //                 updated_at: pair.updated_at,
// //                 ...metrics,
// //               };
// //             } catch (pairError) {
// //               console.error(
// //                 `❌ Error processing pair ${pair.value}:`,
// //                 pairError
// //               );
// //               // Return pair with default metrics if data fetch fails
// //               const fallbackMetrics = generateProperMetrics(null, index);
// //               return {
// //                 asset_pair_code: pair.value,
// //                 description:
// //                   pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
// //                 baseAsset: pair.baseAsset,
// //                 quoteAsset: pair.quoteAsset,
// //                 created_at: pair.created_at,
// //                 updated_at: pair.updated_at,
// //                 ...fallbackMetrics,
// //               };
// //             }
// //           })
// //         );

// //         console.log(
// //           `✅ Processed ${assetPairsWithMetrics.length} asset pairs with economic data`
// //         );
// //         setRawAssetPairs(assetPairsWithMetrics);
// //         setLastUpdated(new Date());
// //       } else {
// //         throw new Error("Invalid response format from server");
// //       }
// //     } catch (error) {
// //       console.error("❌ Error fetching asset pairs:", error);
// //       setError(error.message);
// //       setAssetPairs([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []); // Empty dependency array to prevent recreation

// //   useEffect(() => {
// //     const sorted = [...rawAssetPairs].sort((a, b) => {
// //       const direction = isAscending ? 1 : -1;
// //       return direction * (a[sortedBy] - b[sortedBy]);
// //     });

// //     setAssetPairs(sorted);
// //   }, [rawAssetPairs, isAscending, sortedBy]);

// //   // Fetch economic data for a specific asset pair
// //   const fetchEconomicDataForPair = async (pair) => {
// //     const baseAsset = pair.baseAsset;
// //     const quoteAsset = pair.quoteAsset;
// //     const assetPairCode = pair.value;

// //     try {
// //       // Fetch all economic data in parallel with proper error handling
// //       const fetchWithFallback = async (url) => {
// //         try {
// //           const response = await fetch(url);
// //           if (!response.ok) return null;
// //           const data = await response.json();
// //           return data.success && data.data && data.data.length > 0
// //             ? data.data[0]
// //             : null;
// //         } catch (error) {
// //           console.warn(`Failed to fetch ${url}:`, error.message);
// //           return null;
// //         }
// //       };

// //       const [
// //         cotBase,
// //         cotQuote,
// //         gdpBase,
// //         gdpQuote,
// //         mpmiBase,
// //         mpmiQuote,
// //         spmiBase,
// //         spmiQuote,
// //         retailBase,
// //         retailQuote,
// //         unemploymentBase,
// //         unemploymentQuote,
// //         employmentBase,
// //         employmentQuote,
// //         inflationBase,
// //         inflationQuote,
// //         interestBase,
// //         interestQuote,
// //         retailSentiment,
// //       ] = await Promise.all([
// //         // COT Data
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/cot/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/cot/${quoteAsset}?limit=1`
// //         ),

// //         // GDP Data
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/gdp/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/gdp/${quoteAsset}?limit=1`
// //         ),

// //         // Manufacturing PMI
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/mpmi/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/mpmi/${quoteAsset}?limit=1`
// //         ),

// //         // Services PMI
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/spmi/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/spmi/${quoteAsset}?limit=1`
// //         ),

// //         // Retail Sales
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/retail/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/retail/${quoteAsset}?limit=1`
// //         ),

// //         // Unemployment Rate
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/unemployment/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/unemployment/${quoteAsset}?limit=1`
// //         ),

// //         // Employment Change
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/employment/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/employment/${quoteAsset}?limit=1`
// //         ),

// //         // Core Inflation
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/inflation/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/inflation/${quoteAsset}?limit=1`
// //         ),

// //         // Interest Rate
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/interest/${baseAsset}?limit=1`
// //         ),
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/economic-data/interest/${quoteAsset}?limit=1`
// //         ),

// //         // Retail Sentiment
// //         fetchWithFallback(
// //           `http://${BASE_URL}:3000/api/retail-sentiment/${assetPairCode}?limit=1`
// //         ),
// //       ]);

// //       // Structure the data with proper fallbacks
// //       return {
// //         baseAsset,
// //         quoteAsset,
// //         // COT Data
// //         cotData: {
// //           baseLongPercent: cotBase?.long_percent,
// //           baseShortPercent: cotBase?.short_percent,
// //           baseNetChangePercent: cotBase?.net_change_percent,
// //           quoteLongPercent: cotQuote?.long_percent,
// //           quoteShortPercent: cotQuote?.short_percent,
// //           quoteNetChangePercent: cotQuote?.net_change_percent,
// //         },
// //         // Retail Position Data
// //         retailPosition: {
// //           longPercent: retailSentiment?.retail_long,
// //           shortPercent: retailSentiment?.retail_short,
// //         },
// //         // Employment Data
// //         employment: {
// //           baseChange: employmentBase?.employment_change,
// //           baseForecast: employmentBase?.forecast,
// //           quoteChange: employmentQuote?.employment_change,
// //           quoteForecast: employmentQuote?.forecast,
// //         },
// //         // Unemployment Data
// //         unemployment: {
// //           baseRate: unemploymentBase?.unemployment_rate,
// //           baseForecast: unemploymentBase?.forecast,
// //           quoteRate: unemploymentQuote?.unemployment_rate,
// //           quoteForecast: unemploymentQuote?.forecast,
// //         },
// //         // Economic Growth Data
// //         gdp: {
// //           baseResult: gdpBase?.result,
// //           quoteResult: gdpQuote?.result,
// //         },
// //         mpmi: {
// //           baseResult: mpmiBase?.result,
// //           quoteResult: mpmiQuote?.result,
// //         },
// //         spmi: {
// //           baseResult: spmiBase?.result,
// //           quoteResult: spmiQuote?.result,
// //         },
// //         retail: {
// //           baseResult: retailBase?.result,
// //           quoteResult: retailQuote?.result,
// //         },
// //         // Inflation Data
// //         inflation: {
// //           baseCPI: inflationBase?.core_inflation,
// //           baseForecast: inflationBase?.forecast,
// //           quoteCPI: inflationQuote?.core_inflation,
// //           quoteForecast: inflationQuote?.forecast,
// //         },
// //         // Interest Rate Data
// //         interestRate: {
// //           baseChange: interestBase?.change_in_interest,
// //           quoteChange: interestQuote?.change_in_interest,
// //         },
// //       };
// //     } catch (error) {
// //       console.error(
// //         `❌ Error fetching economic data for pair ${assetPairCode}:`,
// //         error
// //       );
// //       return null;
// //     }
// //   };

// //   // FIXED: Initialize component only once
// //   useEffect(() => {
// //     fetchAssetPairs();
// //   }, []); // Empty dependency to run only once

// //   // Function to calculate scores based on data dictionary rules
// //   const calculateScores = (data) => {
// //     if (!data) {
// //       // Return neutral scores if no data
// //       return {
// //         cot: 0,
// //         retailPosition: 0,
// //         employment: 0,
// //         unemployment: 0,
// //         gdp: 0,
// //         mpmi: 0,
// //         spmi: 0,
// //         retail: 0,
// //         inflation: 0,
// //         interestRate: 0,
// //       };
// //     }

// //     const scores = {};

// //     // COT Scoring (-1 to +1 each for base and quote)
// //     const cotBaseScore =
// //       data.cotData.baseNetChangePercent > 0
// //         ? 1
// //         : data.cotData.baseNetChangePercent < 0
// //         ? -1
// //         : 0;
// //     const cotQuoteScore =
// //       data.cotData.quoteNetChangePercent > 0
// //         ? -1
// //         : data.cotData.quoteNetChangePercent < 0
// //         ? 1
// //         : 0;
// //     scores.cot = cotBaseScore + cotQuoteScore;

// //     // Retail Position Score (-1 to +1)
// //     scores.retailPosition =
// //       data.retailPosition.longPercent > data.retailPosition.shortPercent
// //         ? -1
// //         : 1;

// //     // Employment Change Score (-2 to +2)
// //     const empBaseScore =
// //       data.employment.baseChange > data.employment.baseForecast
// //         ? 1
// //         : data.employment.baseChange < data.employment.baseForecast
// //         ? -1
// //         : 0;
// //     const empQuoteScore =
// //       data.employment.quoteChange > data.employment.quoteForecast
// //         ? -1
// //         : data.employment.quoteChange < data.employment.quoteForecast
// //         ? 1
// //         : 0;
// //     scores.employment = empBaseScore + empQuoteScore;

// //     // Unemployment Score (-2 to +2)
// //     const unempBaseScore =
// //       data.unemployment.baseRate > data.unemployment.baseForecast
// //         ? -1
// //         : data.unemployment.baseRate < data.unemployment.baseForecast
// //         ? 1
// //         : 0;
// //     const unempQuoteScore =
// //       data.unemployment.quoteRate > data.unemployment.quoteForecast
// //         ? 1
// //         : data.unemployment.quoteRate < data.unemployment.quoteForecast
// //         ? -1
// //         : 0;
// //     scores.unemployment = unempBaseScore + unempQuoteScore;

// //     // Economic Growth Scores (-2 to +2 each)
// //     const calculateGrowthScore = (baseResult, quoteResult) => {
// //       const baseScore =
// //         baseResult === "Beat"
// //           ? 1
// //           : baseResult === "Miss" || baseResult === "Missed"
// //           ? -1
// //           : 0;
// //       const quoteScore =
// //         quoteResult === "Beat"
// //           ? -1
// //           : quoteResult === "Miss" || quoteResult === "Missed"
// //           ? 1
// //           : 0;
// //       return baseScore + quoteScore;
// //     };

// //     scores.gdp = calculateGrowthScore(
// //       data.gdp.baseResult,
// //       data.gdp.quoteResult
// //     );
// //     scores.mpmi = calculateGrowthScore(
// //       data.mpmi.baseResult,
// //       data.mpmi.quoteResult
// //     );
// //     scores.spmi = calculateGrowthScore(
// //       data.spmi.baseResult,
// //       data.spmi.quoteResult
// //     );
// //     scores.retail = calculateGrowthScore(
// //       data.retail.baseResult,
// //       data.retail.quoteResult
// //     );

// //     // Inflation Score (-1 to +1 each for base and quote)
// //     const inflBaseScore =
// //       data.inflation.baseCPI > data.inflation.baseForecast
// //         ? 1
// //         : data.inflation.baseCPI < data.inflation.baseForecast
// //         ? -1
// //         : 0;
// //     const inflQuoteScore =
// //       data.inflation.quoteCPI > data.inflation.quoteForecast
// //         ? -1
// //         : data.inflation.quoteCPI < data.inflation.quoteForecast
// //         ? 1
// //         : 0;
// //     scores.inflation = inflBaseScore + inflQuoteScore;

// //     // Interest Rate Score (-1 to +1 each for base and quote)
// //     const intBaseScore =
// //       data.interestRate.baseChange > 0
// //         ? 1
// //         : data.interestRate.baseChange < 0
// //         ? -1
// //         : 0;
// //     const intQuoteScore =
// //       data.interestRate.quoteChange > 0
// //         ? -1
// //         : data.interestRate.quoteChange < 0
// //         ? 1
// //         : 0;
// //     scores.interestRate = intBaseScore + intQuoteScore;

// //     return scores;
// //   };

// //   // Generate proper trading metrics based on live data
// //   const generateProperMetrics = (economicData, index) => {
// //     const scores = calculateScores(economicData);

// //     // Calculate total score
// //     const totalScore = Object.values(scores).reduce(
// //       (sum, score) => sum + score,
// //       0
// //     );

// //     // Determine output based on total score - FIXED LOGIC
// //     let output;
// //     if (totalScore >= 12) output = "Very Bullish";
// //     else if (totalScore >= 5) output = "Bullish";
// //     else if (totalScore >= -4) output = "Neutral";
// //     else if (totalScore >= -11)
// //       output = "Bearish"; // FIXED: was -5, should be -11
// //     else output = "Very Bearish";

// //     return {
// //       output,
// //       totalScore,
// //       // Individual scores for display (clamped to -2 to +2)
// //       cot: Math.max(-2, Math.min(2, scores.cot)),
// //       retailPosition: scores.retailPosition,
// //       employment: Math.max(-2, Math.min(2, scores.employment)),
// //       unemployment: Math.max(-2, Math.min(2, scores.unemployment)),
// //       gdp: Math.max(-2, Math.min(2, scores.gdp)),
// //       mpmi: Math.max(-2, Math.min(2, scores.mpmi)),
// //       spmi: Math.max(-2, Math.min(2, scores.spmi)),
// //       retail: Math.max(-2, Math.min(2, scores.retail)),
// //       inflation: Math.max(-2, Math.min(2, scores.inflation)),
// //       interestRate: Math.max(-2, Math.min(2, scores.interestRate)),
// //       // Raw economic data for debugging/display if needed
// //       economicData,
// //     };
// //   };

// //   const getScoreColor = (score, opacity = 0.8) => {
// //     if (score >= 12) return `rgba(30, 132, 73, 0.6 )`; // Very Bullish
// //     if (score >= 5) return `rgba(88, 214, 141, 0.6 )`; // Bullish
// //     if (score >= -4) return `rgba(189, 189, 189, 0.6 )`; // Neutral
// //     if (score >= -11) return `rgba(245, 176, 65, 0.6 )`; // Bearish
// //     return `rgba(192, 57, 43, 0.6 )`; // Very Bearish
// //   };

// //   const getMetricColor = (value) => {
// //     if (value === -2) return "rgba(192, 57, 43, 0.6 )";
// //     if (value === -1) return "rgba(245, 176, 65, 0.6 )";
// //     if (value === 0) return "rgba(189, 189, 189, 0.6 )";
// //     if (value === 1) return "rgba(88, 214, 141, 0.6 )";
// //     if (value === 2) return "rgba(30, 132, 73, 0.6 )";
// //   };

// //   const getOutputStyle = (output) => {
// //     const baseStyle = { fontWeight: "600" };
// //     if (output === "Very Bullish") return { ...baseStyle, color: "#1a9850" };
// //     if (output === "Bullish") return { ...baseStyle, color: "#91cf60" };
// //     if (output === "Neutral") return { ...baseStyle, color: "#4b5563" };
// //     if (output === "Bearish") return { ...baseStyle, color: "#fc8d59" };
// //     if (output === "Very Bearish") return { ...baseStyle, color: "#d73027" };
// //     return { ...baseStyle, color: "#4b5563" };
// //   };

// //   const styles = {
// //     container: {
// //       padding: "24px",
// //       backgroundColor: "#f9fafb",
// //       minHeight: "100vh",
// //     },
// //     maxWidth: {
// //       maxWidth: "90rem",
// //       margin: "0 auto",
// //     },
// //     tableContainer: {
// //       backgroundColor: "white",
// //       boxShadow:
// //         "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
// //       overflow: "hidden",
// //     },
// //     tableScroll: {
// //       overflowX: "auto",
// //     },
// //     table: {
// //       width: "100%",
// //       borderCollapse: "collapse",
// //     },
// //     thead: {
// //       backgroundColor: "#f3f4f6",
// //       borderBottom: "1px solid #e5e7eb",
// //     },
// //     th: {
// //       padding: "8px 12px",
// //       textAlign: "left",
// //       fontWeight: "500",
// //       color: "#374151",
// //       fontSize: "14px",
// //     },
// //     thCenter: {
// //       padding: "8px 12px",
// //       textAlign: "center",
// //       fontWeight: "500",
// //       color: "#374151",
// //       fontSize: "14px",
// //       width: "8%",
// //     },
// //     thAsset: {
// //       padding: "8px 12px",
// //       textAlign: "left",
// //       fontWeight: "500",
// //       color: "#374151",
// //       fontSize: "14px",
// //       width: "15%",
// //     },
// //     thOutput: {
// //       padding: "8px 12px",
// //       textAlign: "left",
// //       fontWeight: "500",
// //       color: "#374151",
// //       fontSize: "14px",
// //       width: "12%",
// //     },
// //     tr: {
// //       borderBottom: "1px solid #e5e7eb",
// //       cursor: "pointer",
// //       transition: "background-color 0.2s ease",
// //     },
// //     trEven: {
// //       borderBottom: "1px solid #e5e7eb",
// //       backgroundColor: "#f9fafb",
// //       cursor: "pointer",
// //       transition: "background-color 0.2s ease",
// //     },
// //     td: {
// //       padding: "12px",
// //     },
// //     tdCenter: {
// //       padding: "12px",
// //       textAlign: "center",
// //     },
// //     assetCode: {
// //       fontWeight: "500",
// //       color: "#2563eb",
// //     },
// //     assetDescription: {
// //       fontSize: "12px",
// //       color: "#6b7280",
// //     },
// //     scoreCell: {
// //       display: "inline-block",
// //       padding: "4px 8px",
// //       borderRadius: "4px",
// //       color: "white",
// //       fontSize: "16px",
// //       fontWeight: "700",
// //     },
// //     metricCell: {
// //       color: "#374151",
// //       fontSize: "14px",
// //       fontWeight: "700",
// //       textAlign: "center",
// //     },
// //     legend: {
// //       color: "black",
// //       marginTop: "16px",
// //       backgroundColor: "white",
// //       padding: "16px",
// //       borderRadius: "8px",
// //       boxShadow:
// //         "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
// //     },
// //     legendTitle: {
// //       fontSize: "14px",
// //       fontWeight: "500",
// //       marginBottom: "8px",
// //     },
// //     legendFlex: {
// //       display: "flex",
// //       flexWrap: "wrap",
// //       gap: "16px",
// //       fontSize: "12px",
// //     },
// //     legendItem: {
// //       display: "flex",
// //       alignItems: "center",
// //     },
// //     legendColor: {
// //       width: "16px",
// //       height: "16px",
// //       borderRadius: "4px",
// //       marginRight: "4px",
// //     },
// //     loading: {
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center",
// //       height: "256px",
// //     },
// //     spinner: {
// //       width: "32px",
// //       height: "32px",
// //       border: "2px solid #e5e7eb",
// //       borderTop: "2px solid #2563eb",
// //       borderRadius: "50%",
// //       animation: "spin 1s linear infinite",
// //     },
// //     loadingText: {
// //       marginLeft: "8px",
// //       color: "#4b5563",
// //     },
// //     errorContainer: {
// //       backgroundColor: "#fee2e2",
// //       border: "1px solid #fecaca",
// //       borderRadius: "8px",
// //       padding: "16px",
// //       margin: "16px 0",
// //     },
// //     errorText: {
// //       color: "#dc2626",
// //       fontSize: "14px",
// //     },
// //     retryButton: {
// //       backgroundColor: "#dc2626",
// //       color: "white",
// //       border: "none",
// //       borderRadius: "4px",
// //       padding: "8px 16px",
// //       fontSize: "14px",
// //       cursor: "pointer",
// //       marginTop: "8px",
// //     },
// //     backButton: {
// //       backgroundColor: "#6b7280",
// //       color: "white",
// //       border: "none",
// //       borderRadius: "6px",
// //       padding: "8px 16px",
// //       fontSize: "14px",
// //       cursor: "pointer",
// //       marginBottom: "16px",
// //     },
// //   };

// //   // FIXED: Conditional rendering based on showCurrencyProfile
// //   if (showCurrencyProfile && currentAssetPair) {
// //     // console.log(currentAssetPair)
// //     return (
// //       <div style={styles.container}>
// //         <div style={styles.maxWidth}>
// //           <button style={styles.backButton} onClick={navigateBackToSetups}>
// //             ← Back to Top Setups
// //           </button>
// //           <CurrencyProfile assetPairCode={currentAssetPair} />
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (loading && assetPairs.length === 0) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={styles.maxWidth}>
// //           <div style={styles.loading}>
// //             <div style={styles.spinner}></div>
// //             <span style={styles.loadingText}>
// //               Loading asset pairs and economic data from database...
// //             </span>
// //             <style>
// //               {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
// //             </style>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={styles.maxWidth}>
// //           <div style={styles.errorContainer}>
// //             <div style={styles.errorText}>❌ Error loading data: {error}</div>
// //             <button style={styles.retryButton} onClick={fetchAssetPairs}>
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.maxWidth}>
// //         <div
// //           style={{
// //             marginBottom: "16px",
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //           }}
// //         >
// //           {/* Left: Search Input + Refresh Button */}
// //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// //             <input
// //               type="text"
// //               placeholder="Search for an asset pair..."
// //               value={filterText}
// //               onChange={(e) => setFilterText(e.target.value)}
// //               style={{
// //                 padding: "8px 12px",
// //                 border: "1px solid #e5e7eb",
// //                 borderRadius: "6px",
// //                 width: "300px",
// //                 fontSize: "14px",
// //               }}
// //             />
// //             <select
// //               value={biasFilter}
// //               onChange={(e) => setBiasFilter(e.target.value)}
// //               style={{
// //                 padding: "8px 12px",
// //                 border: "1px solid #e5e7eb",
// //                 borderRadius: "6px",
// //                 fontSize: "14px",
// //                 backgroundColor: "white",
// //               }}
// //             >
// //               <option value="All">All Biases</option>
// //               <option value="Very Bullish">Very Bullish</option>
// //               <option value="Bullish">Bullish</option>
// //               <option value="Neutral">Neutral</option>
// //               <option value="Bearish">Bearish</option>
// //               <option value="Very Bearish">Very Bearish</option>
// //             </select>
// //             <button
// //               onClick={fetchAssetPairs}
// //               disabled={loading}
// //               style={{
// //                 backgroundColor: loading ? "#9ca3af" : "#2563eb",
// //                 color: "white",
// //                 border: "none",
// //                 borderRadius: "6px",
// //                 padding: "8px 16px",
// //                 fontSize: "14px",
// //                 cursor: loading ? "not-allowed" : "pointer",
// //               }}
// //             >
// //               {loading ? "Refreshing..." : "🔄 Refresh"}
// //             </button>
// //           </div>
// //           {/* Right: Timestamp */}
// //           <div
// //             style={{ fontSize: "12px", color: "#6b7280", textAlign: "right" }}
// //           >
// //             {lastUpdated && (
// //               <div>Last updated: {lastUpdated.toLocaleString()}</div>
// //             )}
// //           </div>
// //         </div>
// //         {/* Table */}
// //         {!error && assetPairs.length > 0 && (
// //           <>
// //             <div style={styles.tableContainer}>
// //               <div style={styles.tableScroll}>
// //                 <table style={styles.table}>
// //                   <thead style={styles.thead}>
// //                     <tr>
// //                       <th style={styles.thAsset}>Asset</th>
// //                       <th style={styles.thOutput}>Bias</th>
// //                       <th
// //                         style={{
// //                           ...styles.thCenter,
// //                           cursor: "pointer",
// //                           userSelect: "none",
// //                         }}
// //                         onClick={() => {
// //                           if (sortedBy === "totalScore") {
// //                             setIsAscending((prev) => !prev);
// //                           } else {
// //                             setSortedBy("totalScore");
// //                             setIsAscending(false);
// //                           }
// //                         }}
// //                       >
// //                         Score{" "}
// //                         <span style={{ fontSize: "0.8em" }}>
// //                           {isAscending ? "▲" : "▼"}
// //                         </span>
// //                       </th>
// //                       <th style={styles.thCenter}>COT</th>
// //                       <th style={styles.thCenter}>Retail Pos</th>
// //                       <th style={styles.thCenter}>Employment Change</th>
// //                       <th style={styles.thCenter}>Unemployment Rate</th>
// //                       <th style={styles.thCenter}>GDP</th>
// //                       <th style={styles.thCenter}>mPMI</th>
// //                       <th style={styles.thCenter}>sPMI</th>
// //                       <th style={styles.thCenter}>Retail Sales</th>
// //                       <th style={styles.thCenter}>Inflation</th>
// //                       <th style={styles.thCenter}>Interest Rates</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {assetPairs
// //                       .filter((pair) => {
// //                         // FIXED: Search logic - check both asset_pair_code AND description
// //                         const searchText = filterText.toLowerCase();
// //                         const matchesSearch =
// //                           pair.asset_pair_code
// //                             ?.toLowerCase()
// //                             .includes(searchText) ||
// //                           pair.description
// //                             ?.toLowerCase()
// //                             .includes(searchText) ||
// //                           pair.baseAsset?.toLowerCase().includes(searchText) ||
// //                           pair.quoteAsset?.toLowerCase().includes(searchText);

// //                         const matchesBias =
// //                           biasFilter === "All" || pair.output === biasFilter;

// //                         return matchesSearch && matchesBias;
// //                       })
// //                       .map((pair, index) => (
// //                         <tr
// //                           key={pair.asset_pair_code}
// //                           style={index % 2 === 0 ? styles.tr : styles.trEven}
// //                           onClick={() =>
// //                             handleAssetPairClick(pair.asset_pair_code)
// //                           }
// //                           onMouseOver={(e) => {
// //                             e.target.closest("tr").style.backgroundColor =
// //                               "#e5f3ff";
// //                           }}
// //                           onMouseOut={(e) => {
// //                             e.target.closest("tr").style.backgroundColor =
// //                               index % 2 === 0 ? "white" : "#f9fafb";
// //                           }}
// //                         >
// //                           <td style={styles.td}>
// //                             <div>
// //                               <div style={styles.assetDescription}>
// //                                 {pair.description}
// //                               </div>
// //                             </div>
// //                           </td>
// //                           <td style={styles.td}>
// //                             <span style={getOutputStyle(pair.output)}>
// //                               {pair.output}
// //                             </span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getScoreColor(pair.totalScore),
// //                             }}
// //                           >
// //                             <span
// //                               style={{
// //                                 ...styles.scoreCell,
// //                                 backgroundColor: "transparent",
// //                                 color: "#374151",
// //                               }}
// //                             >
// //                               {pair.totalScore}
// //                             </span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.cot),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>{pair.cot}</span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(
// //                                 pair.retailPosition
// //                               ),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>
// //                               {pair.retailPosition}
// //                             </span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.employment),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>
// //                               {pair.employment}
// //                             </span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(
// //                                 pair.unemployment
// //                               ),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>
// //                               {pair.unemployment}
// //                             </span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.gdp),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>{pair.gdp}</span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.mpmi),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>{pair.mpmi}</span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.spmi),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>{pair.spmi}</span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.retail),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>{pair.retail}</span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(pair.inflation),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>
// //                               {pair.inflation}
// //                             </span>
// //                           </td>
// //                           <td
// //                             style={{
// //                               ...styles.tdCenter,
// //                               backgroundColor: getMetricColor(
// //                                 pair.interestRate
// //                               ),
// //                             }}
// //                           >
// //                             <span style={styles.metricCell}>
// //                               {pair.interestRate}
// //                             </span>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         {/* Legend */}
// //         {!error && assetPairs.length > 0 && (
// //           <div style={styles.legend}>
// //             <h3 style={styles.legendTitle}>Scoring Legend:</h3>
// //             <div style={styles.legendFlex}>
// //               <div style={styles.legendItem}>
// //                 <span
// //                   style={{ ...styles.legendColor, backgroundColor: "#C0392B" }}
// //                 ></span>
// //                 <span>-2 - Very Bearish</span>
// //               </div>
// //               <div style={styles.legendItem}>
// //                 <span
// //                   style={{ ...styles.legendColor, backgroundColor: "#F5B041" }}
// //                 ></span>
// //                 <span>-1 - Bearish</span>
// //               </div>
// //               <div style={styles.legendItem}>
// //                 <span
// //                   style={{ ...styles.legendColor, backgroundColor: "#BDBDBD" }}
// //                 ></span>
// //                 <span>0 - Neutral</span>
// //               </div>
// //               <div style={styles.legendItem}>
// //                 <span
// //                   style={{ ...styles.legendColor, backgroundColor: "#58D68D" }}
// //                 ></span>
// //                 <span>1 - Bullish</span>
// //               </div>
// //               <div style={styles.legendItem}>
// //                 <span
// //                   style={{ ...styles.legendColor, backgroundColor: "#1E8449" }}
// //                 ></span>
// //                 <span>2 - Very Bullish</span>
// //               </div>
// //             </div>

// //             <div style={{ marginTop: "12px" }}>
// //               <h4
// //                 style={{
// //                   fontSize: "12px",
// //                   fontWeight: "500",
// //                   marginBottom: "8px",
// //                   color: "#374151",
// //                 }}
// //               >
// //                 Total Score Ranges:
// //               </h4>
// //               <div style={styles.legendFlex}>
// //                 <div style={styles.legendItem}>
// //                   <span
// //                     style={{
// //                       ...styles.legendColor,
// //                       backgroundColor: "#1E8449",
// //                     }}
// //                   ></span>
// //                   <span>12 to 19 - Very Bullish</span>
// //                 </div>
// //                 <div style={styles.legendItem}>
// //                   <span
// //                     style={{
// //                       ...styles.legendColor,
// //                       backgroundColor: "#58D68D",
// //                     }}
// //                   ></span>
// //                   <span>5 to 11 - Bullish</span>
// //                 </div>
// //                 <div style={styles.legendItem}>
// //                   <span
// //                     style={{
// //                       ...styles.legendColor,
// //                       backgroundColor: "#BDBDBD",
// //                     }}
// //                   ></span>
// //                   <span>-4 to 4 - Neutral</span>
// //                 </div>
// //                 <div style={styles.legendItem}>
// //                   <span
// //                     style={{
// //                       ...styles.legendColor,
// //                       backgroundColor: "#F5B041",
// //                     }}
// //                   ></span>
// //                   <span>-11 to -5 - Bearish</span>
// //                 </div>
// //                 <div style={styles.legendItem}>
// //                   <span
// //                     style={{
// //                       ...styles.legendColor,
// //                       backgroundColor: "#C0392B",
// //                     }}
// //                   ></span>
// //                   <span>-19 to -12 - Very Bearish</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div style={{ marginTop: "12px" }}>
// //               <h4
// //                 style={{
// //                   fontSize: "12px",
// //                   fontWeight: "500",
// //                   marginBottom: "4px",
// //                   color: "#374151",
// //                 }}
// //               >
// //                 Navigation:
// //               </h4>
// //               <div
// //                 style={{
// //                   fontSize: "11px",
// //                   color: "#6b7280",
// //                   lineHeight: "1.4",
// //                 }}
// //               >
// //                 📊 <strong>Click on any asset pair row</strong> to view detailed
// //                 breakdown and analysis of each economic indicator.
// //               </div>
// //             </div>

// //             <div style={{ marginTop: "12px" }}>
// //               <h4
// //                 style={{
// //                   fontSize: "12px",
// //                   fontWeight: "500",
// //                   marginBottom: "4px",
// //                   color: "#374151",
// //                 }}
// //               >
// //                 Scoring Metrics (Live Database Data):
// //               </h4>
// //               <div
// //                 style={{
// //                   fontSize: "11px",
// //                   color: "#6b7280",
// //                   lineHeight: "1.4",
// //                 }}
// //               >
// //                 <strong>COT:</strong> Base asset positive net change +1; Quote
// //                 asset positive net change -1
// //                 <br />
// //                 <strong>Retail Position:</strong> Long% &gt; Short% = -1;
// //                 otherwise +1
// //                 <br />
// //                 <strong>Employment:</strong> Base/Quote beats forecast +1/-1;
// //                 misses forecast -1/+1
// //                 <br />
// //                 <strong>Unemployment:</strong> Base exceeds forecast -1; Quote
// //                 exceeds forecast +1
// //                 <br />
// //                 <strong>Economic Growth (GDP/PMI/Retail):</strong> Base beats
// //                 forecast +1, misses forecast -1; Quote beats forecast -1, misses
// //                 forecast +1
// //                 <br />
// //                 <strong>Inflation:</strong> Base exceeds forecast +1; Quote
// //                 exceeds forecast -1
// //                 <br />
// //                 <strong>Interest Rates:</strong> Base positive change +1; Quote
// //                 positive change -1
// //               </div>
// //             </div>

// //             <div style={{ marginTop: "12px" }}>
// //               <h4
// //                 style={{
// //                   fontSize: "12px",
// //                   fontWeight: "500",
// //                   marginBottom: "4px",
// //                   color: "#374151",
// //                 }}
// //               >
// //                 Data Sources:
// //               </h4>
// //               <div
// //                 style={{
// //                   fontSize: "11px",
// //                   color: "#6b7280",
// //                   lineHeight: "1.4",
// //                 }}
// //               >
// //                 All data is fetched live from your database including COT Data,
// //                 GDP Growth, Manufacturing & Services PMI, Retail Sales,
// //                 Unemployment Rate, Employment Change, Core Inflation, Interest
// //                 Rates, and Retail Sentiment. Scores are calculated using your
// //                 existing algorithm with real economic indicators.
// //               </div>
// //             </div>

// //             <div style={{ marginTop: "12px" }}>
// //               <h4
// //                 style={{
// //                   fontSize: "12px",
// //                   fontWeight: "500",
// //                   marginBottom: "4px",
// //                   color: "#374151",
// //                 }}
// //               >
// //                 API Status:
// //               </h4>
// //               <div
// //                 style={{
// //                   fontSize: "11px",
// //                   color: "#6b7280",
// //                   lineHeight: "1.4",
// //                 }}
// //               >
// //                 🔄 Real-time data fetching with fallback handling. If API
// //                 endpoints are unavailable, neutral scores are used to ensure the
// //                 component continues functioning.
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* No Data Message */}
// //         {!loading && !error && assetPairs.length === 0 && (
// //           <div
// //             style={{
// //               textAlign: "center",
// //               padding: "48px",
// //               color: "#6b7280",
// //             }}
// //           >
// //             <div style={{ fontSize: "18px", marginBottom: "8px" }}>
// //               📊 No Asset Pairs Found
// //             </div>
// //             <div style={{ fontSize: "14px" }}>
// //               No asset pairs are available in the database. Please add some
// //               asset pairs first.
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default TopSetups;
// import React, { useState, useEffect, useCallback } from "react";
// import CurrencyProfile from "./CurrencyProfile";

// const TopSetups = ({ onAssetPairClick }) => {
//   const [assetPairs, setAssetPairs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [filterText, setFilterText] = useState("");
//   const [isAscending, setIsAscending] = useState(false);
//   const [sortedBy, setSortedBy] = useState("totalScore");
//   const [rawAssetPairs, setRawAssetPairs] = useState([]);
//   const [biasFilter, setBiasFilter] = useState("All");

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Add state for currency profile navigation
//   const [currentAssetPair, setCurrentAssetPair] = useState(null);
//   const [showCurrencyProfile, setShowCurrencyProfile] = useState(false);

//   // Cache for economic data to avoid repeated fetches
//   const [economicDataCache, setEconomicDataCache] = useState(null);
//   const [cacheTimestamp, setCacheTimestamp] = useState(null);
//   const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

//   // Performance tracking
//   const [performanceStats, setPerformanceStats] = useState(null);

//   // Add click handler for asset pair navigation
//   const handleAssetPairClick = (assetPairCode) => {
//     if (onAssetPairClick) {
//       onAssetPairClick(assetPairCode);
//     }
//     // Only navigate if we specifically want to show the currency profile
//     // Comment out the automatic navigation to prevent unwanted view changes
//     // navigateToCurrencyProfile(assetPairCode);
//     console.log("Asset pair clicked:", assetPairCode);
//   };

//   const navigateToCurrencyProfile = (assetPairCode) => {
//     setCurrentAssetPair(assetPairCode);
//     setShowCurrencyProfile(true);
//     console.log("Navigating to currency profile for:", assetPairCode);
//   };

//   const navigateBackToSetups = () => {
//     setShowCurrencyProfile(false);
//     setCurrentAssetPair(null);
//   };

//   // Check if cache is valid
//   const isCacheValid = () => {
//     if (!economicDataCache || !cacheTimestamp) return false;
//     return Date.now() - cacheTimestamp < CACHE_DURATION;
//   };

//   // ULTIMATE OPTIMIZATION: Single mega bulk call for ALL data
//   const fetchAllEconomicDataMega = useCallback(async () => {
//     // Check cache first
//     if (isCacheValid()) {
//       console.log("📋 Using cached economic data");
//       return economicDataCache;
//     }

//     try {
//       console.log("🚀 Fetching ALL economic data in single mega call...");
//       const startTime = Date.now();
      
//       // Single API call for ALL economic data
//       const response = await fetch("http://${BASE_URL}:3000/api/economic-data/all");
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
      
//       if (!result.success) {
//         throw new Error("Failed to fetch mega bulk economic data");
//       }

//       const fetchTime = Date.now() - startTime;

//       // Organize data by asset code for quick lookup
//       const economicData = {
//         cot: {},
//         gdp: {},
//         mpmi: {},
//         spmi: {},
//         retail: {},
//         unemployment: {},
//         employment: {},
//         inflation: {},
//         interest: {},
//         retailSentiment: {}
//       };

//       // Index all data by asset code/asset pair code for O(1) lookup
//       if (result.data.cot) {
//         result.data.cot.forEach(item => {
//           economicData.cot[item.asset_code] = item;
//         });
//       }

//       if (result.data.gdp) {
//         result.data.gdp.forEach(item => {
//           economicData.gdp[item.asset_code] = item;
//         });
//       }

//       if (result.data.mpmi) {
//         result.data.mpmi.forEach(item => {
//           economicData.mpmi[item.asset_code] = item;
//         });
//       }

//       if (result.data.spmi) {
//         result.data.spmi.forEach(item => {
//           economicData.spmi[item.asset_code] = item;
//         });
//       }

//       if (result.data.retail) {
//         result.data.retail.forEach(item => {
//           economicData.retail[item.asset_code] = item;
//         });
//       }

//       if (result.data.unemployment) {
//         result.data.unemployment.forEach(item => {
//           economicData.unemployment[item.asset_code] = item;
//         });
//       }

//       if (result.data.employment) {
//         result.data.employment.forEach(item => {
//           economicData.employment[item.asset_code] = item;
//         });
//       }

//       if (result.data.inflation) {
//         result.data.inflation.forEach(item => {
//           economicData.inflation[item.asset_code] = item;
//         });
//       }

//       if (result.data.interest) {
//         result.data.interest.forEach(item => {
//           economicData.interest[item.asset_code] = item;
//         });
//       }

//       if (result.data.retailSentiment) {
//         result.data.retailSentiment.forEach(item => {
//           economicData.retailSentiment[item.asset_pair_code] = item;
//         });
//       }

//       // Cache the data
//       setEconomicDataCache(economicData);
//       setCacheTimestamp(Date.now());

//       // Track performance
//       setPerformanceStats({
//         fetchTime,
//         totalRecords: result.totalRecords || 0,
//         backendTime: result.executionTimeMs || 0,
//         recordsByType: result.recordsByType || {}
//       });

//       console.log(`🚀 MEGA BULK SUCCESS: ${result.totalRecords || 0} records in ${fetchTime}ms`);
//       return economicData;

//     } catch (error) {
//       console.error("❌ Error fetching mega bulk economic data:", error);
//       return null;
//     }
//   }, [economicDataCache, cacheTimestamp]);

//   // Process economic data for a specific pair using cached data (same as before)
//   const getEconomicDataForPair = (pair, economicData) => {
//     if (!economicData) return null;

//     const baseAsset = pair.baseAsset;
//     const quoteAsset = pair.quoteAsset;
//     const assetPairCode = pair.value;

//     return {
//       baseAsset,
//       quoteAsset,
//       // COT Data
//       cotData: {
//         baseLongPercent: economicData.cot[baseAsset]?.long_percent,
//         baseShortPercent: economicData.cot[baseAsset]?.short_percent,
//         baseNetChangePercent: economicData.cot[baseAsset]?.net_change_percent,
//         quoteLongPercent: economicData.cot[quoteAsset]?.long_percent,
//         quoteShortPercent: economicData.cot[quoteAsset]?.short_percent,
//         quoteNetChangePercent: economicData.cot[quoteAsset]?.net_change_percent,
//       },
//       // Retail Position Data
//       retailPosition: {
//         longPercent: economicData.retailSentiment[assetPairCode]?.retail_long,
//         shortPercent: economicData.retailSentiment[assetPairCode]?.retail_short,
//       },
//       // Employment Data
//       employment: {
//         baseChange: economicData.employment[baseAsset]?.employment_change,
//         baseForecast: economicData.employment[baseAsset]?.forecast,
//         quoteChange: economicData.employment[quoteAsset]?.employment_change,
//         quoteForecast: economicData.employment[quoteAsset]?.forecast,
//       },
//       // Unemployment Data
//       unemployment: {
//         baseRate: economicData.unemployment[baseAsset]?.unemployment_rate,
//         baseForecast: economicData.unemployment[baseAsset]?.forecast,
//         quoteRate: economicData.unemployment[quoteAsset]?.unemployment_rate,
//         quoteForecast: economicData.unemployment[quoteAsset]?.forecast,
//       },
//       // Economic Growth Data
//       gdp: {
//         baseResult: economicData.gdp[baseAsset]?.result,
//         quoteResult: economicData.gdp[quoteAsset]?.result,
//       },
//       mpmi: {
//         baseResult: economicData.mpmi[baseAsset]?.result,
//         quoteResult: economicData.mpmi[quoteAsset]?.result,
//       },
//       spmi: {
//         baseResult: economicData.spmi[baseAsset]?.result,
//         quoteResult: economicData.spmi[quoteAsset]?.result,
//       },
//       retail: {
//         baseResult: economicData.retail[baseAsset]?.result,
//         quoteResult: economicData.retail[quoteAsset]?.result,
//       },
//       // Inflation Data
//       inflation: {
//         baseCPI: economicData.inflation[baseAsset]?.core_inflation,
//         baseForecast: economicData.inflation[baseAsset]?.forecast,
//         quoteCPI: economicData.inflation[quoteAsset]?.core_inflation,
//         quoteForecast: economicData.inflation[quoteAsset]?.forecast,
//       },
//       // Interest Rate Data
//       interestRate: {
//         baseChange: economicData.interest[baseAsset]?.change_in_interest,
//         quoteChange: economicData.interest[quoteAsset]?.change_in_interest,
//       },
//     };
//   };

//   // ULTIMATE OPTIMIZED: Main fetch function with just 2 total API calls
//   const fetchAssetPairs = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log("🚀 Starting ULTIMATE optimized fetch (2 API calls total)...");
//       const startTime = Date.now();

//       // Fetch asset pairs and ALL economic data in parallel (2 calls total)
//       const [assetPairsResponse, economicData] = await Promise.all([
//         fetch("http://${BASE_URL}:3000/api/asset-pairs"),
//         fetchAllEconomicDataMega()
//       ]);

//       if (!assetPairsResponse.ok) {
//         throw new Error(`HTTP error! status: ${assetPairsResponse.status}`);
//       }

//       const assetPairsResult = await assetPairsResponse.json();

//       if (assetPairsResult.success && assetPairsResult.data) {
//         console.log(`✅ Loaded ${assetPairsResult.data.length} asset pairs`);

//         // Remove duplicates
//         const uniquePairs = assetPairsResult.data.filter(
//           (pair, index, self) =>
//             index === self.findIndex((p) => p.value === pair.value)
//         );

//         console.log(`📋 Processing ${uniquePairs.length} unique asset pairs...`);

//         // Process all asset pairs with mega cached economic data (ultra fast)
//         const assetPairsWithMetrics = uniquePairs.map((pair, index) => {
//           try {
//             const pairEconomicData = getEconomicDataForPair(pair, economicData);
//             const metrics = generateProperMetrics(pairEconomicData, index);

//             return {
//               asset_pair_code: pair.value,
//               description: pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
//               baseAsset: pair.baseAsset,
//               quoteAsset: pair.quoteAsset,
//               created_at: pair.created_at,
//               updated_at: pair.updated_at,
//               ...metrics,
//             };
//           } catch (pairError) {
//             console.error(`❌ Error processing pair ${pair.value}:`, pairError);
//             const fallbackMetrics = generateProperMetrics(null, index);
//             return {
//               asset_pair_code: pair.value,
//               description: pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
//               baseAsset: pair.baseAsset,
//               quoteAsset: pair.quoteAsset,
//               created_at: pair.created_at,
//               updated_at: pair.updated_at,
//               ...fallbackMetrics,
//             };
//           }
//         });

//         const totalTime = Date.now() - startTime;
//         console.log(`🚀 ULTIMATE SUCCESS: ${assetPairsWithMetrics.length} asset pairs processed in ${totalTime}ms`);

//         setRawAssetPairs(assetPairsWithMetrics);
//         setLastUpdated(new Date());
//         // Reset to first page when data changes
//         setCurrentPage(1);
//       } else {
//         throw new Error("Invalid response format from server");
//       }
//     } catch (error) {
//       console.error("❌ Error in ultimate fetch:", error);
//       setError(error.message);
//       setAssetPairs([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchAllEconomicDataMega]);

//   // Force refresh (clear cache) with state reset
//   const forceRefresh = useCallback(() => {
//     setEconomicDataCache(null);
//     setCacheTimestamp(null);
//     setPerformanceStats(null);
//     setCurrentPage(1); // Reset pagination
//     // Ensure we stay in the main TopSetups view
//     setShowCurrencyProfile(false);
//     setCurrentAssetPair(null);
//     fetchAssetPairs();
//   }, [fetchAssetPairs]);

//   useEffect(() => {
//     const sorted = [...rawAssetPairs].sort((a, b) => {
//       const direction = isAscending ? 1 : -1;
//       return direction * (a[sortedBy] - b[sortedBy]);
//     });

//     setAssetPairs(sorted);
//     // Reset to first page when sorting changes
//     setCurrentPage(1);
//   }, [rawAssetPairs, isAscending, sortedBy]);

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterText, biasFilter]);

//   // Initialize component only once and ensure state stability
//   useEffect(() => {
//     // Prevent unwanted state changes on mount
//     setShowCurrencyProfile(false);
//     setCurrentAssetPair(null);
//     fetchAssetPairs();
//   }, []);

//   // Filter data based on search and bias
//   const filteredAssetPairs = assetPairs.filter((pair) => {
//     const searchText = filterText.toLowerCase();
//     const matchesSearch =
//       pair.asset_pair_code?.toLowerCase().includes(searchText) ||
//       pair.description?.toLowerCase().includes(searchText) ||
//       pair.baseAsset?.toLowerCase().includes(searchText) ||
//       pair.quoteAsset?.toLowerCase().includes(searchText);

//     const matchesBias = biasFilter === "All" || pair.output === biasFilter;

//     return matchesSearch && matchesBias;
//   });

//   // Calculate pagination
//   const totalItems = filteredAssetPairs.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentItems = filteredAssetPairs.slice(startIndex, endIndex);

//   // Pagination handlers
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const start = Math.max(1, currentPage - 2);
//       const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
//       if (start > 1) {
//         pages.push(1);
//         if (start > 2) pages.push('...');
//       }
      
//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
      
//       if (end < totalPages) {
//         if (end < totalPages - 1) pages.push('...');
//         pages.push(totalPages);
//       }
//     }
    
//     return pages;
//   };

//   // All the scoring and styling functions remain the same...
//   const calculateScores = (data) => {
//     if (!data) {
//       return {
//         cot: 0,
//         retailPosition: 0,
//         employment: 0,
//         unemployment: 0,
//         gdp: 0,
//         mpmi: 0,
//         spmi: 0,
//         retail: 0,
//         inflation: 0,
//         interestRate: 0,
//       };
//     }

//     const scores = {};

//     // COT Scoring (-1 to +1 each for base and quote)
//     const cotBaseScore =
//       data.cotData.baseNetChangePercent > 0
//         ? 1
//         : data.cotData.baseNetChangePercent < 0
//         ? -1
//         : 0;
//     const cotQuoteScore =
//       data.cotData.quoteNetChangePercent > 0
//         ? -1
//         : data.cotData.quoteNetChangePercent < 0
//         ? 1
//         : 0;
//     scores.cot = cotBaseScore + cotQuoteScore;

//     // Retail Position Score (-1 to +1)
//     scores.retailPosition =
//       data.retailPosition.longPercent > data.retailPosition.shortPercent
//         ? -1
//         : 1;

//     // Employment Change Score (-2 to +2)
//     const empBaseScore =
//       data.employment.baseChange > data.employment.baseForecast
//         ? 1
//         : data.employment.baseChange < data.employment.baseForecast
//         ? -1
//         : 0;
//     const empQuoteScore =
//       data.employment.quoteChange > data.employment.quoteForecast
//         ? -1
//         : data.employment.quoteChange < data.employment.quoteForecast
//         ? 1
//         : 0;
//     scores.employment = empBaseScore + empQuoteScore;

//     // Unemployment Score (-2 to +2)
//     const unempBaseScore =
//       data.unemployment.baseRate > data.unemployment.baseForecast
//         ? -1
//         : data.unemployment.baseRate < data.unemployment.baseForecast
//         ? 1
//         : 0;
//     const unempQuoteScore =
//       data.unemployment.quoteRate > data.unemployment.quoteForecast
//         ? 1
//         : data.unemployment.quoteRate < data.unemployment.quoteForecast
//         ? -1
//         : 0;
//     scores.unemployment = unempBaseScore + unempQuoteScore;

//     // Economic Growth Scores (-2 to +2 each)
//     const calculateGrowthScore = (baseResult, quoteResult) => {
//       const baseScore =
//         baseResult === "Beat"
//           ? 1
//           : baseResult === "Miss" || baseResult === "Missed"
//           ? -1
//           : 0;
//       const quoteScore =
//         quoteResult === "Beat"
//           ? -1
//           : quoteResult === "Miss" || quoteResult === "Missed"
//           ? 1
//           : 0;
//       return baseScore + quoteScore;
//     };

//     scores.gdp = calculateGrowthScore(
//       data.gdp.baseResult,
//       data.gdp.quoteResult
//     );
//     scores.mpmi = calculateGrowthScore(
//       data.mpmi.baseResult,
//       data.mpmi.quoteResult
//     );
//     scores.spmi = calculateGrowthScore(
//       data.spmi.baseResult,
//       data.spmi.quoteResult
//     );
//     scores.retail = calculateGrowthScore(
//       data.retail.baseResult,
//       data.retail.quoteResult
//     );

//     // Inflation Score (-1 to +1 each for base and quote)
//     const inflBaseScore =
//       data.inflation.baseCPI > data.inflation.baseForecast
//         ? 1
//         : data.inflation.baseCPI < data.inflation.baseForecast
//         ? -1
//         : 0;
//     const inflQuoteScore =
//       data.inflation.quoteCPI > data.inflation.quoteForecast
//         ? -1
//         : data.inflation.quoteCPI < data.inflation.quoteForecast
//         ? 1
//         : 0;
//     scores.inflation = inflBaseScore + inflQuoteScore;

//     // Interest Rate Score (-1 to +1 each for base and quote)
//     const intBaseScore =
//       data.interestRate.baseChange > 0
//         ? 1
//         : data.interestRate.baseChange < 0
//         ? -1
//         : 0;
//     const intQuoteScore =
//       data.interestRate.quoteChange > 0
//         ? -1
//         : data.interestRate.quoteChange < 0
//         ? 1
//         : 0;
//     scores.interestRate = intBaseScore + intQuoteScore;

//     return scores;
//   };

//   const generateProperMetrics = (economicData, index) => {
//     const scores = calculateScores(economicData);

//     const totalScore = Object.values(scores).reduce(
//       (sum, score) => sum + score,
//       0
//     );

//     let output;
//     if (totalScore >= 12) output = "Very Bullish";
//     else if (totalScore >= 5) output = "Bullish";
//     else if (totalScore >= -4) output = "Neutral";
//     else if (totalScore >= -11) output = "Bearish";
//     else output = "Very Bearish";

//     return {
//       output,
//       totalScore,
//       cot: Math.max(-2, Math.min(2, scores.cot)),
//       retailPosition: scores.retailPosition,
//       employment: Math.max(-2, Math.min(2, scores.employment)),
//       unemployment: Math.max(-2, Math.min(2, scores.unemployment)),
//       gdp: Math.max(-2, Math.min(2, scores.gdp)),
//       mpmi: Math.max(-2, Math.min(2, scores.mpmi)),
//       spmi: Math.max(-2, Math.min(2, scores.spmi)),
//       retail: Math.max(-2, Math.min(2, scores.retail)),
//       inflation: Math.max(-2, Math.min(2, scores.inflation)),
//       interestRate: Math.max(-2, Math.min(2, scores.interestRate)),
//       economicData,
//     };
//   };

//   const getScoreColor = (score) => {
//     if (score >= 12) return `rgba(30, 132, 73, 0.6)`;
//     if (score >= 5) return `rgba(88, 214, 141, 0.6)`;
//     if (score >= -4) return `rgba(189, 189, 189, 0.6)`;
//     if (score >= -11) return `rgba(245, 176, 65, 0.6)`;
//     return `rgba(192, 57, 43, 0.6)`;
//   };

//   const getMetricColor = (value) => {
//     if (value === -2) return "rgba(192, 57, 43, 0.6)";
//     if (value === -1) return "rgba(245, 176, 65, 0.6)";
//     if (value === 0) return "rgba(189, 189, 189, 0.6)";
//     if (value === 1) return "rgba(88, 214, 141, 0.6)";
//     if (value === 2) return "rgba(30, 132, 73, 0.6)";
//   };

//   const getOutputStyle = (output) => {
//     const baseStyle = { fontWeight: "200", fontSize: "1rem", fontStyle: "italic" };
//     if (output === "Very Bullish") return { ...baseStyle, color: "#1a9850" };
//     if (output === "Bullish") return { ...baseStyle, color: "#91cf60" };
//     if (output === "Neutral") return { ...baseStyle, color: "#4b5563" };
//     if (output === "Bearish") return { ...baseStyle, color: "#fc8d59" };
//     if (output === "Very Bearish") return { ...baseStyle, color: "#d73027" };
//     return { ...baseStyle, color: "#4b5563" };
//   };

//   const styles = {
//     container: {
//       padding: "24px",
//       backgroundColor: "#f9fafb",
//       minHeight: "100vh",
//     },
//     maxWidth: {
//       maxWidth: "90rem",
//       margin: "0 auto",
//     },
//     tableContainer: {
//       backgroundColor: "white",
//       boxShadow:
//         "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//       overflow: "hidden",
//     },
//     tableScroll: {
//       overflowX: "auto",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//     },
//     thead: {
//       backgroundColor: "#f3f4f6",
//       borderBottom: "1px solid #e5e7eb",
//     },
//     th: {
//       padding: "8px 12px",
//       textAlign: "left",
//       fontWeight: "500",
//       color: "#374151",
//       fontSize: "14px",
//     },
//     thCenter: {
//       padding: "8px 12px",
//       textAlign: "center",
//       fontWeight: "500",
//       color: "#374151",
//       fontSize: "14px",
//       width: "8%",
//     },
//     thAsset: {
//       padding: "8px 12px",
//       textAlign: "left",
//       fontWeight: "500",
//       color: "#374151",
//       fontSize: "14px",
//       width: "15%",
//     },
//     thOutput: {
//       padding: "8px 12px",
//       textAlign: "left",
//       fontWeight: "500",
//       color: "#374151",
//       fontSize: "14px",
//       width: "12%",
//     },
//     tr: {
//       borderBottom: "1px solid #e5e7eb",
//       cursor: "pointer",
//     },
//     trEven: {
//       borderBottom: "1px solid #e5e7eb",
//       backgroundColor: "#f9fafb",
//       cursor: "pointer",
//     },
//     td: {
//       padding: "12px",
//     },
//     tdCenter: {
//       padding: "2px",
//       textAlign: "center",
//     },
//     assetCode: {
//       fontWeight: "500",
//       color: "#2563eb",
//     },
//     assetDescription: {
//       fontSize: "12px",
//       color: "#6b7280",
//       fontWeight: "bold"
//     },
//     scoreCell: {
//       display: "inline-block",
//       padding: "4px 8px",
//       borderRadius: "4px",
//       color: "white",
//       fontSize: "16px",
//       fontWeight: "700",
//     },
//     metricCell: {
//       color: "#374151",
//       fontSize: "14px",
//       fontWeight: "700",
//       textAlign: "center",
//     },
//     // Pagination styles
//     paginationContainer: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "16px",
//       backgroundColor: "white",
//       borderTop: "1px solid #e5e7eb",
//     },
//     paginationInfo: {
//       fontSize: "14px",
//       color: "#6b7280",
//     },
//     paginationControls: {
//       display: "flex",
//       alignItems: "center",
//       gap: "8px",
//     },
//     paginationButton: {
//       padding: "8px 12px",
//       border: "1px solid #e5e7eb",
//       borderRadius: "6px",
//       backgroundColor: "white",
//       color: "#374151",
//       cursor: "pointer",
//       fontSize: "14px",
//     },
//     paginationButtonActive: {
//       padding: "8px 12px",
//       border: "1px solid #2563eb",
//       borderRadius: "6px",
//       backgroundColor: "#2563eb",
//       color: "white",
//       cursor: "pointer",
//       fontSize: "14px",
//       fontWeight: "500",
//     },
//     legend: {
//       color: "black",
//       marginTop: "16px",
//       backgroundColor: "white",
//       padding: "16px",
//       borderRadius: "8px",
//       boxShadow:
//         "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//     },
//     legendTitle: {
//       fontSize: "14px",
//       fontWeight: "500",
//       marginBottom: "8px",
//     },
//     legendFlex: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "16px",
//       fontSize: "12px",
//     },
//     legendItem: {
//       display: "flex",
//       alignItems: "center",
//     },
//     legendColor: {
//       width: "16px",
//       height: "16px",
//       borderRadius: "4px",
//       marginRight: "4px",
//     },
//     loading: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       height: "256px",
//     },
//     spinner: {
//       width: "32px",
//       height: "32px",
//       border: "2px solid #e5e7eb",
//       borderTop: "2px solid #2563eb",
//       borderRadius: "50%",
//       animation: "spin 1s linear infinite",
//     },
//     loadingText: {
//       marginLeft: "8px",
//       color: "#4b5563",
//     },
//     errorContainer: {
//       backgroundColor: "#fee2e2",
//       border: "1px solid #fecaca",
//       borderRadius: "8px",
//       padding: "16px",
//       margin: "16px 0",
//     },
//     errorText: {
//       color: "#dc2626",
//       fontSize: "14px",
//     },
//     retryButton: {
//       backgroundColor: "#dc2626",
//       color: "white",
//       border: "none",
//       borderRadius: "4px",
//       padding: "8px 16px",
//       fontSize: "14px",
//       cursor: "pointer",
//       marginTop: "8px",
//     },
//     backButton: {
//       backgroundColor: "#6b7280",
//       color: "white",
//       border: "none",
//       borderRadius: "6px",
//       padding: "8px 16px",
//       fontSize: "14px",
//       cursor: "pointer",
//       marginBottom: "16px",
//     },
//   };

//   // Conditional rendering
//   if (showCurrencyProfile && currentAssetPair) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.maxWidth}>
//           <button style={styles.backButton} onClick={navigateBackToSetups}>
//             ← Back to Top Setups
//           </button>
//           <CurrencyProfile assetPairCode={currentAssetPair} />
//         </div>
//       </div>
//     );
//   }

//   if (loading && assetPairs.length === 0) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.maxWidth}>
//           <div style={styles.loading}>
//             <div style={styles.spinner}></div>
//             <span style={styles.loadingText}>
//               🚀 Loading with ULTIMATE optimization...
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.maxWidth}>
//           <div style={styles.errorContainer}>
//             <div style={styles.errorText}>❌ Error loading data: {error}</div>
//             <button style={styles.retryButton} onClick={forceRefresh}>
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.maxWidth}>
//         <div
//           style={{
//             marginBottom: "16px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {/* Left: Search Input + Refresh Button */}
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <input
//               type="text"
//               placeholder="Search for an asset pair..."
//               value={filterText}
//               onChange={(e) => setFilterText(e.target.value)}
//               style={{
//                 padding: "8px 12px",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "6px",
//                 width: "300px",
//                 fontSize: "14px",
//               }}
//             />
//             <select
//               value={biasFilter}
//               onChange={(e) => setBiasFilter(e.target.value)}
//               style={{
//                 padding: "8px 12px",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "6px",
//                 fontSize: "14px",
//                 backgroundColor: "white",
//               }}
//             >
//               <option value="All">All Biases</option>
//               <option value="Very Bullish">Very Bullish</option>
//               <option value="Bullish">Bullish</option>
//               <option value="Neutral">Neutral</option>
//               <option value="Bearish">Bearish</option>
//               <option value="Very Bearish">Very Bearish</option>
//             </select>
//             <button
//               onClick={forceRefresh}
//               disabled={loading}
//               style={{
//                 backgroundColor: loading ? "#9ca3af" : "#2563eb",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 padding: "8px 16px",
//                 fontSize: "14px",
//                 cursor: loading ? "not-allowed" : "pointer",
//               }}
//             >
//               {loading ? "Refreshing..." : "🚀 Refresh"}
//             </button>
//           </div>
          
//           {/* Right: Performance Stats & Cache Status */}
//           <div
//             style={{ fontSize: "12px", color: "#6b7280", textAlign: "right" }}
//           >
//             {lastUpdated && (
//               <div>Last updated: {lastUpdated.toLocaleString()}</div>
//             )}
//             {isCacheValid() && (
//               <div style={{ color: "#059669" }}>📋 Using cached data</div>
//             )}
//             {performanceStats && (
//               <div style={{ color: "#059669", fontSize: "11px" }}>
//                 🚀 Fetched {performanceStats.totalRecords} records in {performanceStats.fetchTime}ms
//                 {performanceStats.backendTime && ` (Backend: ${performanceStats.backendTime}ms)`}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Add CSS for hover effects */}
//         <style>
//           {`
//             .asset-pair-row {
//               transition: background-color 0.2s ease !important;
//             }
//             .asset-pair-row:hover {
//               background-color: #e5f3ff !important;
//             }
//             .asset-pair-row-even {
//               background-color: #f9fafb !important;
//             }
//             .asset-pair-row-odd {
//               background-color: white !important;
//             }
//             .pagination-btn {
//               transition: all 0.2s ease !important;
//             }
//             .pagination-btn:hover:not(:disabled) {
//               background-color: #f3f4f6 !important;
//               border-color: #9ca3af !important;
//             }
//             .pagination-btn-active {
//               background-color: #2563eb !important;
//               color: white !important;
//               border-color: #2563eb !important;
//             }
//             @keyframes spin { 
//               0% { transform: rotate(0deg); } 
//               100% { transform: rotate(360deg); } 
//             }
//           `}
//         </style>

//         {/* Table */}
//         {!error && assetPairs.length > 0 && (
//           <>
//             <div style={styles.tableContainer}>
//               <div style={styles.tableScroll}>
//                 <table style={styles.table}>
//                   <thead style={styles.thead}>
//                     <tr>
//                       <th style={styles.thAsset}>Asset</th>
//                       <th style={styles.thOutput}>Bias</th>
//                       <th
//                         style={{
//                           ...styles.thCenter,
//                           cursor: "pointer",
//                           userSelect: "none",
//                         }}
//                         onClick={() => {
//                           if (sortedBy === "totalScore") {
//                             setIsAscending((prev) => !prev);
//                           } else {
//                             setSortedBy("totalScore");
//                             setIsAscending(false);
//                           }
//                         }}
//                       >
//                         Score{" "}
//                         <span style={{ fontSize: "0.8em" }}>
//                           {isAscending ? "▲" : "▼"}
//                         </span>
//                       </th>
//                       <th style={styles.thCenter}>COT</th>
//                       <th style={styles.thCenter}>Retail Pos</th>
//                       <th style={styles.thCenter}>Employment Change</th>
//                       <th style={styles.thCenter}>Unemployment Rate</th>
//                       <th style={styles.thCenter}>GDP</th>
//                       <th style={styles.thCenter}>mPMI</th>
//                       <th style={styles.thCenter}>sPMI</th>
//                       <th style={styles.thCenter}>Retail Sales</th>
//                       <th style={styles.thCenter}>Inflation</th>
//                       <th style={styles.thCenter}>Interest Rates</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentItems.map((pair, index) => (
//                       <tr
//                         key={pair.asset_pair_code}
//                         className={`asset-pair-row ${index % 2 === 0 ? 'asset-pair-row-odd' : 'asset-pair-row-even'}`}
//                         style={{
//                           ...styles.tr,
//                           borderBottom: "1px solid #e5e7eb",
//                           cursor: "pointer",
//                           backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
//                         }}
//                         onClick={() =>
//                           handleAssetPairClick(pair.asset_pair_code)
//                         }
//                       >
//                         <td style={styles.td}>
//                           <div>
//                             <div style={styles.assetDescription}>
//                               {pair.baseAsset} / {pair.quoteAsset}
//                             </div>
//                           </div>
//                         </td>
//                         <td style={styles.td}>
//                           <span style={getOutputStyle(pair.output)}>
//                             {pair.output}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getScoreColor(pair.totalScore),
//                           }}
//                         >
//                           <span
//                             style={{
//                               ...styles.scoreCell,
//                               backgroundColor: "transparent",
//                               color: "#374151",
//                             }}
//                           >
//                             {pair.totalScore}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.cot),
//                           }}
//                         >
//                           <span style={styles.metricCell}>{pair.cot}</span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(
//                               pair.retailPosition
//                             ),
//                           }}
//                         >
//                           <span style={styles.metricCell}>
//                             {pair.retailPosition}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.employment),
//                           }}
//                         >
//                           <span style={styles.metricCell}>
//                             {pair.employment}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(
//                               pair.unemployment
//                             ),
//                           }}
//                         >
//                           <span style={styles.metricCell}>
//                             {pair.unemployment}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.gdp),
//                           }}
//                         >
//                           <span style={styles.metricCell}>{pair.gdp}</span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.mpmi),
//                           }}
//                         >
//                           <span style={styles.metricCell}>{pair.mpmi}</span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.spmi),
//                           }}
//                         >
//                           <span style={styles.metricCell}>{pair.spmi}</span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.retail),
//                           }}
//                         >
//                           <span style={styles.metricCell}>{pair.retail}</span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(pair.inflation),
//                           }}
//                         >
//                           <span style={styles.metricCell}>
//                             {pair.inflation}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             ...styles.tdCenter,
//                             backgroundColor: getMetricColor(
//                               pair.interestRate
//                             ),
//                           }}
//                         >
//                           <span style={styles.metricCell}>
//                             {pair.interestRate}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Controls */}
//               {totalPages > 1 && (
//                 <div style={styles.paginationContainer}>
//                   <div style={styles.paginationInfo}>
//                     Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
//                   </div>
                  
//                   <div style={styles.paginationControls}>
//                     <button
//                       className="pagination-btn"
//                       style={{
//                         ...styles.paginationButton,
//                         ...(currentPage === 1 ? {
//                           backgroundColor: "#f9fafb",
//                           color: "#9ca3af",
//                           cursor: "not-allowed",
//                           border: "1px solid #e5e7eb"
//                         } : {})
//                       }}
//                       onClick={goToPreviousPage}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </button>
                    
//                     {getPageNumbers().map((page, index) => (
//                       <button
//                         key={index}
//                         className={`pagination-btn ${page === currentPage ? 'pagination-btn-active' : ''}`}
//                         style={{
//                           ...(page === currentPage 
//                             ? styles.paginationButtonActive 
//                             : styles.paginationButton),
//                           ...(page === '...' ? { cursor: 'default', backgroundColor: 'white' } : {})
//                         }}
//                         onClick={() => page !== '...' && goToPage(page)}
//                         disabled={page === '...'}
//                       >
//                         {page}
//                       </button>
//                     ))}
                    
//                     <button
//                       className="pagination-btn"
//                       style={{
//                         ...styles.paginationButton,
//                         ...(currentPage === totalPages ? {
//                           backgroundColor: "#f9fafb",
//                           color: "#9ca3af",
//                           cursor: "not-allowed",
//                           border: "1px solid #e5e7eb"
//                         } : {})
//                       }}
//                       onClick={goToNextPage}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* Enhanced Legend with Performance Info */}
//         {!error && assetPairs.length > 0 && (
//           <div style={styles.legend}>
//             <h3 style={styles.legendTitle}>⚡ ULTIMATE PERFORMANCE - 2 API Calls Total! (Showing {itemsPerPage} per page)</h3>
            
//             {performanceStats && (
//               <div style={{ marginBottom: "12px", padding: "8px", backgroundColor: "#f0fdf4", borderRadius: "4px", fontSize: "11px" }}>
//                 <strong style={{ color: "#059669" }}>🚀 Performance Stats:</strong>
//                 <div style={{ color: "#059669" }}>
//                   • Total Records: {performanceStats.totalRecords}
//                   • Frontend Time: {performanceStats.fetchTime}ms
//                   • Backend Time: {performanceStats.backendTime}ms
//                   • Records by Type: {Object.entries(performanceStats.recordsByType).map(([key, count]) => `${key}(${count})`).join(', ')}
//                 </div>
//               </div>
//             )}

//             <div style={styles.legendFlex}>
//               <div style={styles.legendItem}>
//                 <span
//                   style={{ ...styles.legendColor, backgroundColor: "#C0392B" }}
//                 ></span>
//                 <span>-2 - Very Bearish</span>
//               </div>
//               <div style={styles.legendItem}>
//                 <span
//                   style={{ ...styles.legendColor, backgroundColor: "#F5B041" }}
//                 ></span>
//                 <span>-1 - Bearish</span>
//               </div>
//               <div style={styles.legendItem}>
//                 <span
//                   style={{ ...styles.legendColor, backgroundColor: "#BDBDBD" }}
//                 ></span>
//                 <span>0 - Neutral</span>
//               </div>
//               <div style={styles.legendItem}>
//                 <span
//                   style={{ ...styles.legendColor, backgroundColor: "#58D68D" }}
//                 ></span>
//                 <span>1 - Bullish</span>
//               </div>
//               <div style={styles.legendItem}>
//                 <span
//                   style={{ ...styles.legendColor, backgroundColor: "#1E8449" }}
//                 ></span>
//                 <span>2 - Very Bullish</span>
//               </div>
//             </div>

//             <div style={{ marginTop: "12px" }}>
//               <h4
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   marginBottom: "8px",
//                   color: "#374151",
//                 }}
//               >
//                 📄 Pagination Features:
//               </h4>
//               <div
//                 style={{
//                   fontSize: "11px",
//                   color: "#059669",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 <strong>Smart Pagination:</strong> Shows 10 results per page with intelligent page number display<br/>
//                 <strong>Auto Reset:</strong> Returns to page 1 when filters or sorting changes<br/>
//                 <strong>Performance Friendly:</strong> Only renders visible rows for optimal speed<br/>
//                 <strong>Filter Aware:</strong> Pagination updates automatically based on search results<br/>
//                 <strong>Navigation:</strong> Previous/Next buttons plus direct page number access
//               </div>
//             </div>

//             <div style={{ marginTop: "12px" }}>
//               <h4
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   marginBottom: "8px",
//                   color: "#374151",
//                 }}
//               >
//                 🚀 ULTIMATE Optimizations Applied:
//               </h4>
//               <div
//                 style={{
//                   fontSize: "11px",
//                   color: "#059669",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 <strong>MEGA BULK API:</strong> Single /api/economic-data/all endpoint fetches ALL economic data in one call<br/>
//                 <strong>2 Total API Calls:</strong> Asset pairs + ALL economic data (previously 18+ calls per pair)<br/>
//                 <strong>Parallel Database Queries:</strong> Backend executes 10 optimized JOIN queries simultaneously<br/>
//                 <strong>Smart Caching:</strong> Economic data cached for 2 minutes with automatic invalidation<br/>
//                 <strong>O(1) Lookups:</strong> All economic data indexed by asset/pair code for instant access<br/>
//                 <strong>Performance Tracking:</strong> Real-time monitoring of fetch times and record counts
//               </div>
//             </div>

//             <div style={{ marginTop: "12px" }}>
//               <h4
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   marginBottom: "8px",
//                   color: "#374151",
//                 }}
//               >
//                 Expected Performance:
//               </h4>
//               <div style={{ fontSize: "11px", color: "#059669", lineHeight: "1.4" }}>
//                 <strong>Local Network:</strong> 100-300ms total load time<br/>
//                 <strong>Over Internet:</strong> 300-800ms total load time<br/>
//                 <strong>Cache Hits:</strong> ~50ms load time (nearly instant)<br/>
//                 <strong>Database Impact:</strong> 90%+ reduction in query load
//               </div>
//             </div>
//           </div>
//         )}
//          <div style={{ marginTop: "12px" }}>
//             <h4
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   marginBottom: "4px",
//                   color: "#374151",
//                 }}
//               >
//                 Scoring Metrics (Live Database Data):
//               </h4>
//               <div
//                 style={{
//                   fontSize: "11px",
//                   color: "#6b7280",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 <strong>COT:</strong> Base asset positive net change +1; Quote
//                 asset positive net change -1
//                 <br />
//                 <strong>Retail Position:</strong> Long% &gt; Short% = -1;
//                 otherwise +1
//                 <br />
//                 <strong>Employment:</strong> Base/Quote beats forecast +1/-1;
//                 misses forecast -1/+1
//                 <br />
//                 <strong>Unemployment:</strong> Base exceeds forecast -1; Quote
//                 exceeds forecast +1
//                 <br />
//                 <strong>Economic Growth (GDP/PMI/Retail):</strong> Base beats
//                 forecast +1, misses forecast -1; Quote beats forecast -1, misses
//                 forecast +1
//                 <br />
//                 <strong>Inflation:</strong> Base exceeds forecast +1; Quote
//                 exceeds forecast -1
//                 <br />
//                 <strong>Interest Rates:</strong> Base positive change +1; Quote
//                 positive change -1
//               </div>
//             </div>

//             <div style={{ marginTop: "12px" }}>
//               <h4
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   marginBottom: "4px",
//                   color: "#374151",
//                 }}
//               >
//                 Data Sources:
//               </h4>
//               <div
//                 style={{
//                   fontSize: "11px",
//                   color: "#6b7280",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 All data is fetched live from your database including COT Data,
//                 GDP Growth, Manufacturing & Services PMI, Retail Sales,
//                 Unemployment Rate, Employment Change, Core Inflation, Interest
//                 Rates, and Retail Sentiment. Scores are calculated using your
//                 existing algorithm with real economic indicators.
//               </div>
//             </div>

//             <div style={{ marginTop: "12px" }}>
//               <h4
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   marginBottom: "4px",
//                   color: "#374151",
//                 }}
//               >
//                 API Status:
//               </h4>
//               <div
//                 style={{
//                   fontSize: "11px",
//                   color: "#6b7280",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 🔄 Real-time data fetching with fallback handling. If API
//                 endpoints are unavailable, neutral scores are used to ensure the
//                 component continues functioning.
//               </div>
//             </div>
//           </div>
//         {/* No Data Message */}
//         {!loading && !error && assetPairs.length === 0 && (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "48px",
//               color: "#6b7280",
//             }}
//           >
//             <div style={{ fontSize: "18px", marginBottom: "8px" }}>
//               📊 No Asset Pairs Found
//             </div>
//             <div style={{ fontSize: "14px" }}>
//               No asset pairs are available in the database. Please add some
//               asset pairs first.
//             </div>
//           </div>
//         )}
//       </div>
//   );
// };

// export default TopSetups;
import React, { useState, useEffect, useCallback } from "react";
import CurrencyProfile from "./CurrencyProfile";
import { getThemeColors, loadSettings } from '../contexts/themeConfig';

const TopSetups = ({ onAssetPairClick }) => {
  const [assetPairs, setAssetPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [isAscending, setIsAscending] = useState(false);
  const [sortedBy, setSortedBy] = useState("totalScore");
  const [rawAssetPairs, setRawAssetPairs] = useState([]);
  const [biasFilter, setBiasFilter] = useState("All");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Add state for currency profile navigation
  const [currentAssetPair, setCurrentAssetPair] = useState(null);
  const [showCurrencyProfile, setShowCurrencyProfile] = useState(false);

  // Cache for economic data to avoid repeated fetches
  const [economicDataCache, setEconomicDataCache] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  // Performance tracking
  const [performanceStats, setPerformanceStats] = useState(null);

  // Theme integration
  const [settings, setSettings] = useState(loadSettings());
  const theme = getThemeColors(settings);

  // Update theme on external event
  useEffect(() => {
    const handleSettingsChange = (e) => {
      setSettings(e.detail);
    };
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  // Add click handler for asset pair navigation
  const handleAssetPairClick = (assetPairCode) => {
    if (onAssetPairClick) {
      console.log("pressed")
      onAssetPairClick(assetPairCode);
      setShowCurrencyProfile(true)
    }
    // Only navigate if we specifically want to show the currency profile
    // Comment out the automatic navigation to prevent unwanted view changes
    navigateToCurrencyProfile(assetPairCode);
    console.log("Asset pair clicked:", assetPairCode);
  };

  const navigateToCurrencyProfile = (assetPairCode) => {
    setCurrentAssetPair(assetPairCode);
    setShowCurrencyProfile(true);
    console.log("Navigating to currency profile for:", assetPairCode);
  };

  const navigateBackToSetups = () => {
    setShowCurrencyProfile(false);
    setCurrentAssetPair(null);
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
      console.log("📋 Using cached economic data");
      return economicDataCache;
    }

    try {
      console.log("🚀 Fetching ALL economic data in single mega call...");
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

      console.log(`🚀 MEGA BULK SUCCESS: ${result.totalRecords || 0} records in ${fetchTime}ms`);
      return economicData;

    } catch (error) {
      console.error("❌ Error fetching mega bulk economic data:", error);
      return null;
    }
  }, [economicDataCache, cacheTimestamp]);

  // Process economic data for a specific pair using cached data (same as before)
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

  // ULTIMATE OPTIMIZED: Main fetch function with just 2 total API calls
  const fetchAssetPairs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🚀 Starting ULTIMATE optimized fetch (2 API calls total)...");
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
        console.log(`✅ Loaded ${assetPairsResult.data.length} asset pairs`);

        // Remove duplicates
        const uniquePairs = assetPairsResult.data.filter(
          (pair, index, self) =>
            index === self.findIndex((p) => p.value === pair.value)
        );

        console.log(`📋 Processing ${uniquePairs.length} unique asset pairs...`);

        // Process all asset pairs with mega cached economic data (ultra fast)
        const assetPairsWithMetrics = uniquePairs.map((pair, index) => {
          try {
            const pairEconomicData = getEconomicDataForPair(pair, economicData);
            const metrics = generateProperMetrics(pairEconomicData, index);

            return {
              asset_pair_code: pair.value,
              description: pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              created_at: pair.created_at,
              updated_at: pair.updated_at,
              ...metrics,
            };
          } catch (pairError) {
            console.error(`❌ Error processing pair ${pair.value}:`, pairError);
            const fallbackMetrics = generateProperMetrics(null, index);
            return {
              asset_pair_code: pair.value,
              description: pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              created_at: pair.created_at,
              updated_at: pair.updated_at,
              ...fallbackMetrics,
            };
          }
        });

        const totalTime = Date.now() - startTime;
        console.log(`🚀 ULTIMATE SUCCESS: ${assetPairsWithMetrics.length} asset pairs processed in ${totalTime}ms`);

        setRawAssetPairs(assetPairsWithMetrics);
        setLastUpdated(new Date());
        // Reset to first page when data changes
        setCurrentPage(1);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Error in ultimate fetch:", error);
      setError(error.message);
      setAssetPairs([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllEconomicDataMega]);

  // Force refresh (clear cache) with state reset
  const forceRefresh = useCallback(() => {
    setEconomicDataCache(null);
    setCacheTimestamp(null);
    setPerformanceStats(null);
    setCurrentPage(1); // Reset pagination
    // Ensure we stay in the main TopSetups view
    setShowCurrencyProfile(false);
    setCurrentAssetPair(null);
    fetchAssetPairs();
  }, [fetchAssetPairs]);

  useEffect(() => {
    const sorted = [...rawAssetPairs].sort((a, b) => {
      const direction = isAscending ? 1 : -1;
      return direction * (a[sortedBy] - b[sortedBy]);
    });

    setAssetPairs(sorted);
    // Reset to first page when sorting changes
    setCurrentPage(1);
  }, [rawAssetPairs, isAscending, sortedBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, biasFilter]);

  // Initialize component only once and ensure state stability
  useEffect(() => {
    // Prevent unwanted state changes on mount
    setShowCurrencyProfile(false);
    setCurrentAssetPair(null);
    fetchAssetPairs();
  }, []);

  // Filter data based on search and bias
  const filteredAssetPairs = assetPairs.filter((pair) => {
    const searchText = filterText.toLowerCase();
    const matchesSearch =
      pair.asset_pair_code?.toLowerCase().includes(searchText) ||
      pair.description?.toLowerCase().includes(searchText) ||
      pair.baseAsset?.toLowerCase().includes(searchText) ||
      pair.quoteAsset?.toLowerCase().includes(searchText);

    const matchesBias = biasFilter === "All" || pair.output === biasFilter;

    return matchesSearch && matchesBias;
  });

  // Calculate pagination
  const totalItems = filteredAssetPairs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAssetPairs.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // All the scoring and styling functions remain the same...
  const calculateScores = (data) => {
    if (!data) {
      return {
        cot: 0,
        retailPosition: 0,
        employment: 0,
        unemployment: 0,
        gdp: 0,
        mpmi: 0,
        spmi: 0,
        retail: 0,
        inflation: 0,
        interestRate: 0,
      };
    }

    const scores = {};

    // COT Scoring (-1 to +1 each for base and quote)
    const cotBaseScore =
      data.cotData.baseNetChangePercent > 0
        ? 1
        : data.cotData.baseNetChangePercent < 0
        ? -1
        : 0;
    const cotQuoteScore =
      data.cotData.quoteNetChangePercent > 0
        ? -1
        : data.cotData.quoteNetChangePercent < 0
        ? 1
        : 0;
    scores.cot = cotBaseScore + cotQuoteScore;

    // Retail Position Score (-1 to +1)
    scores.retailPosition =
      data.retailPosition.longPercent > data.retailPosition.shortPercent
        ? -1
        : 1;

    // Employment Change Score (-2 to +2)
    const empBaseScore =
      data.employment.baseChange > data.employment.baseForecast
        ? 1
        : data.employment.baseChange < data.employment.baseForecast
        ? -1
        : 0;
    const empQuoteScore =
      data.employment.quoteChange > data.employment.quoteForecast
        ? -1
        : data.employment.quoteChange < data.employment.quoteForecast
        ? 1
        : 0;
    scores.employment = empBaseScore + empQuoteScore;

    // Unemployment Score (-2 to +2)
    const unempBaseScore =
      data.unemployment.baseRate > data.unemployment.baseForecast
        ? -1
        : data.unemployment.baseRate < data.unemployment.baseForecast
        ? 1
        : 0;
    const unempQuoteScore =
      data.unemployment.quoteRate > data.unemployment.quoteForecast
        ? 1
        : data.unemployment.quoteRate < data.unemployment.quoteForecast
        ? -1
        : 0;
    scores.unemployment = unempBaseScore + unempQuoteScore;

    // Economic Growth Scores (-2 to +2 each)
    const calculateGrowthScore = (baseResult, quoteResult) => {
      const baseScore =
        baseResult === "Beat"
          ? 1
          : baseResult === "Miss" || baseResult === "Missed"
          ? -1
          : 0;
      const quoteScore =
        quoteResult === "Beat"
          ? -1
          : quoteResult === "Miss" || quoteResult === "Missed"
          ? 1
          : 0;
      return baseScore + quoteScore;
    };

    scores.gdp = calculateGrowthScore(
      data.gdp.baseResult,
      data.gdp.quoteResult
    );
    scores.mpmi = calculateGrowthScore(
      data.mpmi.baseResult,
      data.mpmi.quoteResult
    );
    scores.spmi = calculateGrowthScore(
      data.spmi.baseResult,
      data.spmi.quoteResult
    );
    scores.retail = calculateGrowthScore(
      data.retail.baseResult,
      data.retail.quoteResult
    );

    // Inflation Score (-1 to +1 each for base and quote)
    const inflBaseScore =
      data.inflation.baseCPI > data.inflation.baseForecast
        ? 1
        : data.inflation.baseCPI < data.inflation.baseForecast
        ? -1
        : 0;
    const inflQuoteScore =
      data.inflation.quoteCPI > data.inflation.quoteForecast
        ? -1
        : data.inflation.quoteCPI < data.inflation.quoteForecast
        ? 1
        : 0;
    scores.inflation = inflBaseScore + inflQuoteScore;

    // Interest Rate Score (-1 to +1 each for base and quote)
    const intBaseScore =
      data.interestRate.baseChange > 0
        ? 1
        : data.interestRate.baseChange < 0
        ? -1
        : 0;
    const intQuoteScore =
      data.interestRate.quoteChange > 0
        ? -1
        : data.interestRate.quoteChange < 0
        ? 1
        : 0;
    scores.interestRate = intBaseScore + intQuoteScore;

    return scores;
  };

  const generateProperMetrics = (economicData, index) => {
    const scores = calculateScores(economicData);

    const totalScore = Object.values(scores).reduce(
      (sum, score) => sum + score,
      0
    );

    let output;
    if (totalScore >= 12) output = "Very Bullish";
    else if (totalScore >= 5) output = "Bullish";
    else if (totalScore >= -4) output = "Neutral";
    else if (totalScore >= -11) output = "Bearish";
    else output = "Very Bearish";

    return {
      output,
      totalScore,
      cot: Math.max(-2, Math.min(2, scores.cot)),
      retailPosition: scores.retailPosition,
      employment: Math.max(-2, Math.min(2, scores.employment)),
      unemployment: Math.max(-2, Math.min(2, scores.unemployment)),
      gdp: Math.max(-2, Math.min(2, scores.gdp)),
      mpmi: Math.max(-2, Math.min(2, scores.mpmi)),
      spmi: Math.max(-2, Math.min(2, scores.spmi)),
      retail: Math.max(-2, Math.min(2, scores.retail)),
      inflation: Math.max(-2, Math.min(2, scores.inflation)),
      interestRate: Math.max(-2, Math.min(2, scores.interestRate)),
      economicData,
    };
  };

  const getScoreColor = (score) => {
    if (score >= 12) return `rgba(30, 132, 73, 0.6)`;
    if (score >= 5) return `rgba(88, 214, 141, 0.6)`;
    if (score >= -4) return `rgba(189, 189, 189, 0.6)`;
    if (score >= -11) return `rgba(245, 176, 65, 0.6)`;
    return `rgba(192, 57, 43, 0.6)`;
  };

  const getMetricColor = (value) => {
    if (value === -2) return "rgba(192, 57, 43, 0.6)";
    if (value === -1) return "rgba(245, 176, 65, 0.6)";
    if (value === 0) return "rgba(189, 189, 189, 0.6)";
    if (value === 1) return "rgba(88, 214, 141, 0.6)";
    if (value === 2) return "rgba(30, 132, 73, 0.6)";
  };

  const getOutputStyle = (output) => {
    const baseStyle = { fontWeight: "200", fontSize: "1rem", fontStyle: "italic" };
    if (output === "Very Bullish") return { ...baseStyle, color: "#1a9850" };
    if (output === "Bullish") return { ...baseStyle, color: "#91cf60" };
    if (output === "Neutral") return { ...baseStyle, color: "#4b5563" };
    if (output === "Bearish") return { ...baseStyle, color: "#fc8d59" };
    if (output === "Very Bearish") return { ...baseStyle, color: "#d73027" };
    return { ...baseStyle, color: "#4b5563" };
  };

  const styles = {
    container: {
      padding: "24px",
      backgroundColor: theme.background,
      minHeight: "100vh",
      color: theme.text,
    },
    maxWidth: {
      maxWidth: "90rem",
      margin: "0 auto",
    },
    tableContainer: {
      backgroundColor: theme.surface,
      boxShadow: theme.mode === 'dark' 
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
    },
    tableScroll: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: theme.accent,
      borderBottom: `1px solid ${theme.border}`,
    },
    th: {
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: "500",
      color: theme.text,
      fontSize: "14px",
    },
    thCenter: {
      padding: "8px 12px",
      textAlign: "center",
      fontWeight: "500",
      color: theme.text,
      fontSize: "14px",
      width: "8%",
    },
    thAsset: {
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: "500",
      color: theme.text,
      fontSize: "14px",
      width: "15%",
    },
    thOutput: {
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: "500",
      color: theme.text,
      fontSize: "14px",
      width: "12%",
    },
    tr: {
      borderBottom: `1px solid ${theme.border}`,
      cursor: "pointer",
    },
    trEven: {
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: theme.accent,
      cursor: "pointer",
    },
    td: {
      padding: "12px",
    },
    tdCenter: {
      padding: "2px",
      textAlign: "center",
    },
    assetCode: {
      fontWeight: "500",
      color: theme.primary,
    },
    assetDescription: {
      fontSize: "12px",
      color: theme.textTopsetups,
      fontWeight: "bold"
    },
    scoreCell: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      color: "white",
      fontSize: "16px",
      fontWeight: "700",
    },
    metricCell: {
      color: theme.text,
      fontSize: "14px",
      fontWeight: "700",
      textAlign: "center",
    },
    // Pagination styles
    paginationContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px",
      backgroundColor: theme.surface,
      borderTop: `1px solid ${theme.border}`,
    },
    paginationInfo: {
      fontSize: "14px",
      color: theme.textTopsetups,
    },
    paginationControls: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    paginationButton: {
      padding: "8px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.surface,
      color: theme.text,
      cursor: "pointer",
      fontSize: "14px",
    },
    paginationButtonActive: {
      padding: "8px 12px",
      border: `1px solid ${theme.primary}`,
      borderRadius: "6px",
      backgroundColor: theme.primary,
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    legend: {
      color: theme.text,
      marginTop: "16px",
      backgroundColor: theme.surface,
      padding: "16px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.mode === 'dark' 
        ? "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)"
        : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },
    legendTitle: {
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
      color: theme.text,
    },
    legendFlex: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      fontSize: "12px",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
    },
    legendColor: {
      width: "16px",
      height: "16px",
      borderRadius: "4px",
      marginRight: "4px",
    },
    loading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "256px",
    },
    spinner: {
      width: "32px",
      height: "32px",
      border: `2px solid ${theme.border}`,
      borderTop: `2px solid ${theme.primary}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      marginLeft: "8px",
      color: theme.textTopsetups,
    },
    errorContainer: {
      backgroundColor: theme.mode === 'dark' ? "rgba(239, 68, 68, 0.1)" : "#fee2e2",
      border: theme.mode === 'dark' ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca",
      borderRadius: "8px",
      padding: "16px",
      margin: "16px 0",
    },
    errorText: {
      color: theme.mode === 'dark' ? "#fca5a5" : "#dc2626",
      fontSize: "14px",
    },
    retryButton: {
      backgroundColor: theme.mode === 'dark' ? "#dc2626" : "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "8px 16px",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "8px",
    },
    backButton: {
      backgroundColor: theme.textTopsetups,
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "16px",
    },
  };

  // Conditional rendering
  if (showCurrencyProfile && currentAssetPair) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <button style={styles.backButton} onClick={navigateBackToSetups}>
            ← Back to Top Setups
          </button>
          <CurrencyProfile assetPairCode={currentAssetPair} />
        </div>
      </div>
    );
  }

  if (loading && assetPairs.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <span style={styles.loadingText}>
              🚀 Loading with ULTIMATE optimization...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.errorContainer}>
            <div style={styles.errorText}>❌ Error loading data: {error}</div>
            <button style={styles.retryButton} onClick={forceRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Search Input + Refresh Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              placeholder="Search for an asset pair..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                width: "300px",
                fontSize: "14px",
                backgroundColor: theme.surface,
                color: theme.text,
              }}
            />
            <select
              value={biasFilter}
              onChange={(e) => setBiasFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: theme.surface,
                color: theme.text,
              }}
            >
              <option value="All">All Biases</option>
              <option value="Very Bullish">Very Bullish</option>
              <option value="Bullish">Bullish</option>
              <option value="Neutral">Neutral</option>
              <option value="Bearish">Bearish</option>
              <option value="Very Bearish">Very Bearish</option>
            </select>
            <button
              onClick={forceRefresh}
              disabled={loading}
              style={{
                backgroundColor: loading ? theme.textTopsetups : theme.primary,
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Refreshing..." : "🚀 Refresh"}
            </button>
          </div>
          
          {/* Right: Performance Stats & Cache Status */}
          <div
            style={{ fontSize: "12px", color: theme.textTopsetups, textAlign: "right" }}
          >
            {lastUpdated && (
              <div>Last updated: {lastUpdated.toLocaleString()}</div>
            )}
            {isCacheValid() && (
              <div style={{ color: theme.mode === 'dark' ? "#10b981" : "#059669" }}>📋 Using cached data</div>
            )}
            {performanceStats && (
              <div style={{ color: theme.mode === 'dark' ? "#10b981" : "#059669", fontSize: "11px" }}>
                🚀 Fetched {performanceStats.totalRecords} records in {performanceStats.fetchTime}ms
                {performanceStats.backendTime && ` (Backend: ${performanceStats.backendTime}ms)`}
              </div>
            )}
          </div>
        </div>

        {/* Add CSS for hover effects with theme support */}
        <style>
          {`
            .asset-pair-row {
              transition: background-color 0.2s ease !important;
            }
            .asset-pair-row:hover {
              background-color: ${theme.cardBackground} !important;
              box-shadow: ${theme.mode === 'dark'
                ? '0 0 16px 6px rgba(0, 0, 0, 0.3)' // black glow in dark mode
                : '0 0 16px 6px rgba(255, 255, 255, 0.5)'} !important; // white glow in light mode
            }
            .asset-pair-row-even {
              background-color: ${theme.accent} !important;
            }
            .asset-pair-row-odd {
              background-color: ${theme.surface} !important;
            }
            .pagination-btn {
              transition: all 0.2s ease !important;
            }
            .pagination-btn:hover:not(:disabled) {
              background-color: ${theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'} !important;
              border-color: ${theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#9ca3af'} !important;
            }
            .pagination-btn-active {
              background-color: ${theme.primary} !important;
              color: white !important;
              border-color: ${theme.primary} !important;
            }
            @keyframes spin { 
              0% { transform: rotate(0deg); } 
              100% { transform: rotate(360deg); } 
            }
          `}
        </style>

        {/* Table */}
        {!error && assetPairs.length > 0 && (
          <>
            <div style={styles.tableContainer}>
              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.thAsset}>Asset</th>
                      <th style={styles.thOutput}>Bias</th>
                      <th
                        style={{
                          ...styles.thCenter,
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        onClick={() => {
                          if (sortedBy === "totalScore") {
                            setIsAscending((prev) => !prev);
                          } else {
                            setSortedBy("totalScore");
                            setIsAscending(false);
                          }
                        }}
                      >
                        Score{" "}
                        <span style={{ fontSize: "0.8em" }}>
                          {isAscending ? "▲" : "▼"}
                        </span>
                      </th>
                      <th style={styles.thCenter}>COT</th>
                      <th style={styles.thCenter}>Retail Pos</th>
                      <th style={styles.thCenter}>Employment Change</th>
                      <th style={styles.thCenter}>Unemployment Rate</th>
                      <th style={styles.thCenter}>GDP</th>
                      <th style={styles.thCenter}>mPMI</th>
                      <th style={styles.thCenter}>sPMI</th>
                      <th style={styles.thCenter}>Retail Sales</th>
                      <th style={styles.thCenter}>Inflation</th>
                      <th style={styles.thCenter}>Interest Rates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((pair, index) => (
                      <tr
                        key={pair.asset_pair_code}
                        className={`asset-pair-row ${index % 2 === 0 ? 'asset-pair-row-odd' : 'asset-pair-row-even'}`}
                        style={{
                          ...styles.tr,
                          borderBottom: `1px solid ${theme.border}`,
                          cursor: "pointer",
                          backgroundColor: index % 2 === 0 ? theme.surface : theme.accent,
                        }}
                        onClick={() =>
                          handleAssetPairClick(pair.asset_pair_code)
                        }
                      >
                        <td style={styles.td}>
                          <div>
                            <div style={styles.assetDescription}>
                              {pair.baseAsset} / {pair.quoteAsset}
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={theme.textTopsetups}>
                            {pair.output}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getScoreColor(pair.totalScore),
                          }}
                        >
                          <span
                            style={{
                              ...styles.scoreCell,
                              backgroundColor: "transparent",
                              color: theme.textTopsetups,
                            }}
                          >
                            {pair.totalScore}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.cot),
                          }}
                        >
                          <span style={styles.metricCell}>{pair.cot}</span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(
                              pair.retailPosition
                            ),
                          }}
                        >
                          <span style={styles.metricCell}>
                            {pair.retailPosition}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.employment),
                          }}
                        >
                          <span style={styles.metricCell}>
                            {pair.employment}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(
                              pair.unemployment
                            ),
                          }}
                        >
                          <span style={styles.metricCell}>
                            {pair.unemployment}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.gdp),
                          }}
                        >
                          <span style={styles.metricCell}>{pair.gdp}</span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.mpmi),
                          }}
                        >
                          <span style={styles.metricCell}>{pair.mpmi}</span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.spmi),
                          }}
                        >
                          <span style={styles.metricCell}>{pair.spmi}</span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.retail),
                          }}
                        >
                          <span style={styles.metricCell}>{pair.retail}</span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(pair.inflation),
                          }}
                        >
                          <span style={styles.metricCell}>
                            {pair.inflation}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: getMetricColor(
                              pair.interestRate
                            ),
                          }}
                        >
                          <span style={styles.metricCell}>
                            {pair.interestRate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={styles.paginationContainer}>
                  <div style={styles.paginationInfo}>
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
                  </div>
                  
                  <div style={styles.paginationControls}>
                    <button
                      className="pagination-btn"
                      style={{
                        ...styles.paginationButton,
                        ...(currentPage === 1 ? {
                          backgroundColor: theme.accent,
                          color: theme.textTopsetups,
                          cursor: "not-allowed",
                          border: `1px solid ${theme.border}`
                        } : {})
                      }}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        className={`pagination-btn ${page === currentPage ? 'pagination-btn-active' : ''}`}
                        style={{
                          ...(page === currentPage 
                            ? styles.paginationButtonActive 
                            : styles.paginationButton),
                          ...(page === '...' ? { cursor: 'default', backgroundColor: theme.surface } : {})
                        }}
                        onClick={() => page !== '...' && goToPage(page)}
                        disabled={page === '...'}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      className="pagination-btn"
                      style={{
                        ...styles.paginationButton,
                        ...(currentPage === totalPages ? {
                          backgroundColor: theme.accent,
                          color: theme.textTopsetups,
                          cursor: "not-allowed",
                          border: `1px solid ${theme.border}`
                        } : {})
                      }}
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Enhanced Legend with Performance Info */}
        {!error && assetPairs.length > 0 && (
          <div style={styles.legend}>
            <h3 style={styles.legendTitle}>⚡ ULTIMATE PERFORMANCE - 2 API Calls Total! (Showing {itemsPerPage} per page)</h3>
            
            {performanceStats && (
              <div style={{ 
                marginBottom: "12px", 
                padding: "8px", 
                backgroundColor: theme.mode === 'dark' ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4", 
                borderRadius: "4px", 
                fontSize: "11px",
                border: `1px solid ${theme.mode === 'dark' ? "rgba(16, 185, 129, 0.3)" : "#bbf7d0"}`
              }}>
                <strong style={{ color: theme.mode === 'dark' ? "#10b981" : "#059669" }}>🚀 Performance Stats:</strong>
                <div style={{ color: theme.mode === 'dark' ? "#10b981" : "#059669" }}>
                  • Total Records: {performanceStats.totalRecords}
                  • Frontend Time: {performanceStats.fetchTime}ms
                  • Backend Time: {performanceStats.backendTime}ms
                  • Records by Type: {Object.entries(performanceStats.recordsByType).map(([key, count]) => `${key}(${count})`).join(', ')}
                </div>
              </div>
            )}

            <div style={styles.legendFlex}>
              <div style={styles.legendItem}>
                <span
                  style={{ ...styles.legendColor, backgroundColor: "#C0392B" }}
                ></span>
                <span>-2 - Very Bearish</span>
              </div>
              <div style={styles.legendItem}>
                <span
                  style={{ ...styles.legendColor, backgroundColor: "#F5B041" }}
                ></span>
                <span>-1 - Bearish</span>
              </div>
              <div style={styles.legendItem}>
                <span
                  style={{ ...styles.legendColor, backgroundColor: "#BDBDBD" }}
                ></span>
                <span>0 - Neutral</span>
              </div>
              <div style={styles.legendItem}>
                <span
                  style={{ ...styles.legendColor, backgroundColor: "#58D68D" }}
                ></span>
                <span>1 - Bullish</span>
              </div>
              <div style={styles.legendItem}>
                <span
                  style={{ ...styles.legendColor, backgroundColor: "#1E8449" }}
                ></span>
                <span>2 - Very Bullish</span>
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#374151",
                }}
              >
                📄 Pagination Features:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.mode === 'dark' ? "#10b981" : "#059669",
                  lineHeight: "1.4",
                }}
              >
                <strong>Smart Pagination:</strong> Shows 10 results per page with intelligent page number display<br/>
                <strong>Auto Reset:</strong> Returns to page 1 when filters or sorting changes<br/>
                <strong>Performance Friendly:</strong> Only renders visible rows for optimal speed<br/>
                <strong>Filter Aware:</strong> Pagination updates automatically based on search results<br/>
                <strong>Navigation:</strong> Previous/Next buttons plus direct page number access
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: theme.text,
                }}
              >
                🚀 ULTIMATE Optimizations Applied:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.mode === 'dark' ? "#10b981" : "#059669",
                  lineHeight: "1.4",
                }}
              >
                <strong>MEGA BULK API:</strong> Single /api/economic-data/all endpoint fetches ALL economic data in one call<br/>
                <strong>2 Total API Calls:</strong> Asset pairs + ALL economic data (previously 18+ calls per pair)<br/>
                <strong>Parallel Database Queries:</strong> Backend executes 10 optimized JOIN queries simultaneously<br/>
                <strong>Smart Caching:</strong> Economic data cached for 2 minutes with automatic invalidation<br/>
                <strong>O(1) Lookups:</strong> All economic data indexed by asset/pair code for instant access<br/>
                <strong>Performance Tracking:</strong> Real-time monitoring of fetch times and record counts
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#374151",
                }}
              >
                Expected Performance:
              </h4>
              <div style={{ fontSize: "11px", color: theme.mode === 'dark' ? "#10b981" : "#059669", lineHeight: "1.4" }}>
                <strong>Local Network:</strong> 100-300ms total load time<br/>
                <strong>Over Internet:</strong> 300-800ms total load time<br/>
                <strong>Cache Hits:</strong> ~50ms load time (nearly instant)<br/>
                <strong>Database Impact:</strong> 90%+ reduction in query load
              </div>
            </div>
          </div>
        )}
         <div style={{ marginTop: "12px" }}>
            <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: theme.text,
                }}
              >
                Scoring Metrics (Live Database Data):
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.textTopsetups,
                  lineHeight: "1.4",
                }}
              >
                <strong>COT:</strong> Base asset positive net change +1; Quote
                asset positive net change -1
                <br />
                <strong>Retail Position:</strong> Long% &gt; Short% = -1;
                otherwise +1
                <br />
                <strong>Employment:</strong> Base/Quote beats forecast +1/-1;
                misses forecast -1/+1
                <br />
                <strong>Unemployment:</strong> Base exceeds forecast -1; Quote
                exceeds forecast +1
                <br />
                <strong>Economic Growth (GDP/PMI/Retail):</strong> Base beats
                forecast +1, misses forecast -1; Quote beats forecast -1, misses
                forecast +1
                <br />
                <strong>Inflation:</strong> Base exceeds forecast +1; Quote
                exceeds forecast -1
                <br />
                <strong>Interest Rates:</strong> Base positive change +1; Quote
                positive change -1
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: theme.text,
                }}
              >
                Data Sources:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.textTopsetups,
                  lineHeight: "1.4",
                }}
              >
                All data is fetched live from your database including COT Data,
                GDP Growth, Manufacturing & Services PMI, Retail Sales,
                Unemployment Rate, Employment Change, Core Inflation, Interest
                Rates, and Retail Sentiment. Scores are calculated using your
                existing algorithm with real economic indicators.
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: theme.text,
                }}
              >
                API Status:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.textTopsetups,
                  lineHeight: "1.4",
                }}
              >
                🔄 Real-time data fetching with fallback handling. If API
                endpoints are unavailable, neutral scores are used to ensure the
                component continues functioning.
              </div>
            </div>
          </div>
        {/* No Data Message */}
        {!loading && !error && assetPairs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: theme.textTopsetups,
            }}
          >
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>
              📊 No Asset Pairs Found
            </div>
            <div style={{ fontSize: "14px" }}>
              No asset pairs are available in the database. Please add some
              asset pairs first.
            </div>
          </div>
        )}
      </div>
  );
};

export default TopSetups;