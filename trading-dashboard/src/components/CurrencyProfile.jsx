// import React, { useState, useEffect, useNavigate } from "react";
// import { useParams } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
//   RadialBarChart,
//   RadialBar,
//   PieChart,
//   Pie,
// } from "recharts";

// const CurrencyProfile = ({ assetPairCode: propAssetPairCode}) => {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { assetPairCode: urlAssetPairCode } = useParams();
  

  
//   // Use URL parameter if available, otherwise use prop
//   const assetPairCode = urlAssetPairCode || propAssetPairCode;
//   const handleBack = () => {
//         const navigate = useNavigate();
//     sessionStorage.setItem('programmaticNav', 'true');
//     sessionStorage.setItem('allowNavigation', 'true');
//     navigate(-1); // Go back to previous page
//   };

//   useEffect(() => {
//     console.log(
//       "🔧 CurrencyProfile mounted with assetPairCode:",
//       assetPairCode
//     );
//   }, []);

//   useEffect(() => {
//     console.log("📝 assetPairCode changed to:", assetPairCode);
//     if (assetPairCode) {
//       fetchCurrencyProfile();
//     } else {
//       console.log("❌ No assetPairCode provided");
//       setError("No asset pair code provided");
//       setLoading(false);
//     }
//   }, [assetPairCode]);

//   const fetchCurrencyProfile = async () => {
//     try {
//       console.log("🚀 Starting fetchCurrencyProfile for:", assetPairCode);
//       setLoading(true);
//       setError(null);

//       const url = `http://localhost:3000/api/currency-profile/${assetPairCode}`;
//       console.log("📡 Fetching URL:", url);

//       const response = await fetch(url);
//       console.log("📊 Response status:", response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const result = await response.json();
//       console.log("✅ API Response:", result);

//       if (result.success && result.data) {
//         setProfileData(result.data);
//       } else {
//         throw new Error("Invalid response format from server");
//       }
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const getScoreColor = (score) => {
//     if (score >= 2) return "#1E8449"; // Very Bullish
//     if (score >= 1) return "#58D68D"; // Bullish
//     if (score === 0) return "#BDBDBD"; // Neutral
//     if (score >= -1) return "#F5B041"; // Bearish
//     return "#C0392B"; // Very Bearish
//   };

//   const getBiasColor = (bias) => {
//     if (bias === "Very Bullish") return "#1E8449";
//     if (bias === "Bullish") return "#58D68D";
//     if (bias === "Neutral") return "#BDBDBD";
//     if (bias === "Bearish") return "#F5B041";
//     if (bias === "Very Bearish") return "#C0392B";
//     return "#BDBDBD";
//   };

//   const getScoreLabel = (score) => {
//     if (score >= 2) return "Very Bullish";
//     if (score >= 1) return "Bullish";
//     if (score === 0) return "Neutral";
//     if (score >= -1) return "Bearish";
//     return "Very Bearish";
//   };

//   // Get economic data from profileData - REAL DATABASE DATA ONLY
//   const getEconomicData = () => {
//     if (profileData) {
//       return {
//         baseAsset: profileData.assetPair?.baseAsset || "N/A",
//         quoteAsset: profileData.assetPair?.quoteAsset || "N/A",

//         // Extract REAL data from profileData.breakdown
//         cotData: extractCOTData(),
//         retailPosition: extractRetailPosition(),
//         nfp: extractNFPData(),
//         employment: extractEmploymentData(),
//         unemployment: extractUnemploymentData(),
//         gdp: extractGDPData(),
//         mpmi: extractMPMIData(),
//         spmi: extractSPMIData(),
//         retail: extractRetailData(),
//         inflation: extractInflationData(),
//         interestRate: extractInterestRateData(),
//       };
//     }

//     // No mock data - return empty structure if no profile data
//     return {
//       baseAsset: "N/A",
//       quoteAsset: "N/A",
//       cotData: {
//         baseLongPercent: 0,
//         baseShortPercent: 0,
//         baseNetChangePercent: 0,
//         quoteLongPercent: 0,
//         quoteShortPercent: 0,
//         quoteNetChangePercent: 0,
//       },
//       retailPosition: { longPercent: 0, shortPercent: 0 },
//       nfp: { actual: 0, forecast: 0, change: 0 },
//       employment: {
//         baseChange: 0,
//         baseForecast: 0,
//         baseResult: "N/A",
//         quoteChange: 0,
//         quoteForecast: 0,
//         quoteResult: "N/A",
//       },
//       unemployment: {
//         baseRate: 0,
//         baseForecast: 0,
//         baseResult: "N/A",
//         quoteRate: 0,
//         quoteForecast: 0,
//         quoteResult: "N/A",
//       },
//       gdp: {
//         baseResult: "N/A",
//         baseActual: "N/A",
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteActual: "N/A",
//         quoteForecast: "N/A",
//       },
//       mpmi: {
//         baseResult: "N/A",
//         baseValue: 0,
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteValue: 0,
//         quoteForecast: "N/A",
//       },
//       spmi: {
//         baseResult: "N/A",
//         baseValue: 0,
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteValue: 0,
//         quoteForecast: "N/A",
//       },
//       retail: {
//         baseResult: "N/A",
//         baseActual: "N/A",
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteActual: "N/A",
//         quoteForecast: "N/A",
//       },
//       inflation: { baseCPI: 0, baseForecast: 0, quoteCPI: 0, quoteForecast: 0 },
//       interestRate: { baseChange: 0, quoteChange: 0 },
//     };
//   };

//   // Extract functions for REAL DATABASE data only
//   const extractCOTData = () => {
//     const cotIndicator = profileData?.breakdown?.find(
//       (ind) =>
//         ind.name === "COT Data" || ind.name === "COT (Commitment of Traders)"
//     );
//     if (!cotIndicator)
//       return {
//         baseLongPercent: 0,
//         baseShortPercent: 0,
//         baseNetChangePercent: 0,
//         quoteLongPercent: 0,
//         quoteShortPercent: 0,
//         quoteNetChangePercent: 0,
//       };

//     return {
//       baseLongPercent: cotIndicator?.baseData?.["Long %"] || 0,
//       baseShortPercent: cotIndicator?.baseData?.["Short %"] || 0,
//       baseNetChangePercent: cotIndicator?.baseData?.["Net Change %"] || 0,
//       quoteLongPercent: cotIndicator?.quoteData?.["Long %"] || 0,
//       quoteShortPercent: cotIndicator?.quoteData?.["Short %"] || 0,
//       quoteNetChangePercent: cotIndicator?.quoteData?.["Net Change %"] || 0,
//     };
//   };

//   const extractRetailPosition = () => {
//     const retailIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Retail Position"
//     );
//     if (!retailIndicator) return { longPercent: 0, shortPercent: 0 };

//     return {
//       longPercent: retailIndicator?.baseData?.["Retail Long %"] || 0,
//       shortPercent: retailIndicator?.baseData?.["Retail Short %"] || 0,
//     };
//   };

//   const extractNFPData = () => {
//     // NFP data is usually USD specific - check if it exists in your data structure
//     const nfpData = profileData?.economicData?.nfp;
//     return {
//       actual: nfpData?.actual || 0,
//       forecast: nfpData?.forecast || 0,
//       change: nfpData?.change || 0,
//     };
//   };

//   const extractEmploymentData = () => {
//     const empIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Employment Change"
//     );
//     if (!empIndicator)
//       return {
//         baseChange: 0,
//         baseForecast: 0,
//         baseResult: "N/A",
//         quoteChange: 0,
//         quoteForecast: 0,
//         quoteResult: "N/A",
//       };

//     return {
//       baseChange: empIndicator?.baseData?.["Employment Change"] || 0,
//       baseForecast: empIndicator?.baseData?.["Forecast"] || 0,
//       baseResult: empIndicator?.baseData?.["Result"] || "N/A",
//       quoteChange: empIndicator?.quoteData?.["Employment Change"] || 0,
//       quoteForecast: empIndicator?.quoteData?.["Forecast"] || 0,
//       quoteResult: empIndicator?.quoteData?.["Result"] || "N/A",
//     };
//   };

//   const extractUnemploymentData = () => {
//     const unempIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Unemployment Rate"
//     );
//     if (!unempIndicator)
//       return {
//         baseRate: 0,
//         baseForecast: 0,
//         baseResult: "N/A",
//         quoteRate: 0,
//         quoteForecast: 0,
//         quoteResult: "N/A",
//       };

//     return {
//       baseRate: unempIndicator?.baseData?.["Unemployment Rate"] || 0,
//       baseForecast: unempIndicator?.baseData?.["Forecast"] || 0,
//       baseResult: unempIndicator?.baseData?.["Result"] || "N/A",
//       quoteRate: unempIndicator?.quoteData?.["Unemployment Rate"] || 0,
//       quoteForecast: unempIndicator?.quoteData?.["Forecast"] || 0,
//       quoteResult: unempIndicator?.quoteData?.["Result"] || "N/A",
//     };
//   };

//   const extractGDPData = () => {
//     const gdpIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "GDP Growth"
//     );
//     if (!gdpIndicator)
//       return {
//         baseResult: "N/A",
//         baseActual: "N/A",
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteActual: "N/A",
//         quoteForecast: "N/A",
//       };

//     return {
//       baseResult: gdpIndicator?.baseData?.["Result"] || "N/A",
//       baseActual: gdpIndicator?.baseData?.["GDP Growth"] || "N/A",
//       baseForecast: gdpIndicator?.baseData?.["Forecast"] || "N/A",
//       quoteResult: gdpIndicator?.quoteData?.["Result"] || "N/A",
//       quoteActual: gdpIndicator?.quoteData?.["GDP Growth"] || "N/A",
//       quoteForecast: gdpIndicator?.quoteData?.["Forecast"] || "N/A",
//     };
//   };

//   const extractMPMIData = () => {
//     const mpmiIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Manufacturing PMI"
//     );
//     if (!mpmiIndicator)
//       return {
//         baseResult: "N/A",
//         baseValue: 0,
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteValue: 0,
//         quoteForecast: "N/A",
//       };

//     return {
//       baseResult: mpmiIndicator?.baseData?.["Result"] || "N/A",
//       baseValue: mpmiIndicator?.baseData?.["Service PMI"] || 0,
//       baseForecast: mpmiIndicator?.baseData?.["Forecast"] || "N/A",
//       quoteResult: mpmiIndicator?.quoteData?.["Result"] || "N/A",
//       quoteValue: mpmiIndicator?.quoteData?.["Service PMI"] || 0,
//       quoteForecast: mpmiIndicator?.quoteData?.["Forecast"] || "N/A",
//     };
//   };

//   const extractSPMIData = () => {
//     const spmiIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Services PMI"
//     );
//     if (!spmiIndicator)
//       return {
//         baseResult: "N/A",
//         baseValue: 0,
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteValue: 0,
//         quoteForecast: "N/A",
//       };

//     return {
//       baseResult: spmiIndicator?.baseData?.["Result"] || "N/A",
//       baseValue: spmiIndicator?.baseData?.["Service PMI"] || 0,
//       baseForecast: spmiIndicator?.baseData?.["Forecast"] || "N/A",
//       quoteResult: spmiIndicator?.quoteData?.["Result"] || "N/A",
//       quoteValue: spmiIndicator?.quoteData?.["Service PMI"] || 0,
//       quoteForecast: spmiIndicator?.quoteData?.["Forecast"] || "N/A",
//     };
//   };

//   const extractRetailData = () => {
//     const retailIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Retail Sales"
//     );
//     if (!retailIndicator)
//       return {
//         baseResult: "N/A",
//         baseActual: "N/A",
//         baseForecast: "N/A",
//         quoteResult: "N/A",
//         quoteActual: "N/A",
//         quoteForecast: "N/A",
//       };

//     return {
//       baseResult: retailIndicator?.baseData?.["Result"] || "N/A",
//       baseActual: retailIndicator?.baseData?.["Retail Sales"] || "N/A",
//       baseForecast: retailIndicator?.baseData?.["Forecast"] || "N/A",
//       quoteResult: retailIndicator?.quoteData?.["Result"] || "N/A",
//       quoteActual: retailIndicator?.quoteData?.["Retail Sales"] || "N/A",
//       quoteForecast: retailIndicator?.quoteData?.["Forecast"] || "N/A",
//     };
//   };

//   const extractInflationData = () => {
//     const inflationIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Inflation" || ind.name === "Core Inflation"
//     );
//     if (!inflationIndicator)
//       return { baseCPI: 0, baseForecast: 0, quoteCPI: 0, quoteForecast: 0 };

//     return {
//       baseCPI: inflationIndicator?.baseData?.["Core Inflation"] || 0,
//       baseForecast: inflationIndicator?.baseData?.["Forecast"] || 0,
//       quoteCPI: inflationIndicator?.quoteData?.["Core Inflation"] || 0,
//       quoteForecast: inflationIndicator?.quoteData?.["Forecast"] || 0,
//     };
//   };

//   const extractInterestRateData = () => {
//     const interestIndicator = profileData?.breakdown?.find(
//       (ind) => ind.name === "Interest Rates"
//     );
//     if (!interestIndicator) return { baseChange: 0, quoteChange: 0 };

//     return {
//       baseChange: interestIndicator?.baseData?.["Change in Interest"] || 0,
//       quoteChange: interestIndicator?.quoteData?.["Change in Interest"] || 0,
//     };
//   };

//   const createMetricsData = () => {
//     if (profileData?.breakdown) {
//       return profileData.breakdown.map((indicator) => ({
//         name: indicator.name
//           .replace("COT (Commitment of Traders)", "COT")
//           .replace("Manufacturing PMI", "mPMI")
//           .replace("Services PMI", "sPMI")
//           .replace("Employment Change", "Emp. Change")
//           .replace("Unemployment Rate", "Unemployment")
//           .replace("Retail Sales", "Retail Sales")
//           .replace("Interest Rates", "Interest Rate")
//           .replace("Retail Position", "Retail Pos"),
//         score: indicator.score || 0,
//       }));
//     }

//     // Return empty array if no profileData
//     return [];
//   };

//   const createScoreDistributionData = () => {
//     if (profileData?.breakdown && profileData.breakdown.length > 0) {
//       const distribution = {
//         "Very Bearish": 0,
//         Bearish: 0,
//         Neutral: 0,
//         Bullish: 0,
//         "Very Bullish": 0,
//       };

//       profileData.breakdown.forEach((indicator) => {
//         const label = getScoreLabel(indicator.score);
//         distribution[label]++;
//       });

//       const total = profileData.breakdown.length;
//       return Object.entries(distribution)
//         .filter(([_, count]) => count > 0)
//         .map(([name, count]) => ({
//           name,
//           value: parseFloat(((count / total) * 100).toFixed(1)),
//           color: getBiasColor(name),
//         }));
//     }

//     // Return empty array if no data
//     return [];
//   };

//   const createRadarData = () => {
//     const metricsData = createMetricsData();
//     if (metricsData.length === 0) return [];

//     return metricsData.map((metric) => ({
//       indicator: metric.name,
//       Base_Currency: Math.max(0, (metric.score + 2) * 2.5), // Normalize to 0-10 scale
//       Quote_Currency: Math.max(0, (metric.score + 2) * 2), // Different scaling for comparison
//       fullScore: 10,
//     }));
//   };

//   // Check if pair includes USD for NFP display
//   const hasUSD = (economicData) => {
//     return (
//       economicData.baseAsset === "USD" || economicData.quoteAsset === "USD"
//     );
//   };

//   const styles = {
//     container: {
//       minHeight: "100vh",
//       backgroundColor: "#f8fafc",
//       padding: "12px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       fontSize: "11px",
//     },
//     backButton: {
//       marginBottom: "12px",
//       backgroundColor: "#2563eb",
//       color: "white",
//       padding: "6px 12px",
//       borderRadius: "4px",
//       border: "none",
//       cursor: "pointer",
//       fontSize: "11px",
//       fontWeight: "500",
//     },
//     pairTitle: {
//       fontSize: "24px",
//       fontWeight: "bold",
//       textAlign: "center",
//       margin: "0 0 16px 0",
//       color: "#1a202c",
//       letterSpacing: "1px",
//     },
//     mainGrid: {
//       display: "grid",
//       gridTemplateColumns: "220px 1fr 1fr",
//       gap: "12px",
//       maxWidth: "1400px",
//       margin: "0 auto",
//     },
//     leftColumn: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "12px",
//     },
//     centerColumn: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "12px",
//     },
//     rightColumn: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "12px",
//     },
//     // Bottom section grid for the three charts
//     bottomGrid: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr 1fr",
//       gap: "12px",
//       marginTop: "12px",
//       gridColumn: "1 / -1", // Span all columns
//     },
//     card: {
//       backgroundColor: "white",
//       borderRadius: "6px",
//       padding: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       border: "1px solid #e2e8f0",
//     },
//     sectionHeader: {
//       backgroundColor: "#5DADE2",
//       color: "white",
//       padding: "6px 8px",
//       borderRadius: "4px 4px 0 0",
//       margin: "-8px -8px 8px -8px",
//       fontSize: "10px",
//       fontWeight: "600",
//       textAlign: "center",
//       textTransform: "uppercase",
//       letterSpacing: "0.5px",
//     },
//     biasCard: {
//       textAlign: "center",
//       padding: "4px",
//     },
//     biasGauge: {
//       width: "140px",
//       height: "80px",
//       margin: "0 auto 8px",
//       position: "relative",
//     },
//     biasLabel: {
//       fontSize: "14px",
//       fontWeight: "bold",
//       marginBottom: "4px",
//     },
//     biasValue: {
//       fontSize: "11px",
//       color: "#4a5568",
//       fontWeight: "500",
//     },
//     metricsTable: {
//       width: "100%",
//       borderCollapse: "separate",
//       borderSpacing: "0 2px",
//     },
//     metricRow: {
//       backgroundColor: "#f8fafc",
//     },
//     metricCell: {
//       padding: "4px 6px",
//       textAlign: "left",
//       borderRadius: "3px",
//       fontSize: "10px",
//       color: "#2d3748",
//     },
//     metricScore: {
//       textAlign: "center",
//       fontWeight: "bold",
//       color: "white",
//       borderRadius: "3px",
//       width: "35px",
//       padding: "3px 4px",
//       fontSize: "10px",
//     },
//     cotChartsContainer: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr",
//       gap: "12px",
//       marginBottom: "12px",
//     },
//     cotChart: {
//       textAlign: "center",
//     },
//     cotTitle: {
//       margin: "0 0 8px 0",
//       fontSize: "12px",
//       fontWeight: "600",
//       color: "#2d3748",
//     },
//     cotStats: {
//       fontSize: "9px",
//       marginTop: "4px",
//       color: "#4a5568",
//     },
//     economicTable: {
//       width: "100%",
//       borderCollapse: "separate",
//       borderSpacing: "0",
//       border: "1px solid #E2E8F0",
//       borderRadius: "4px",
//       overflow: "hidden",
//       fontSize: "9px",
//     },
//     tableHeaderRow: {
//       backgroundColor: "#F7FAFC",
//     },
//     tableHeader: {
//       padding: "4px 6px",
//       textAlign: "center",
//       fontWeight: "600",
//       fontSize: "9px",
//       color: "#2D3748",
//       borderBottom: "1px solid #E2E8F0",
//       textTransform: "uppercase",
//       letterSpacing: "0.3px",
//     },
//     tableRow: {
//       borderBottom: "1px solid #E2E8F0",
//       backgroundColor: "white",
//     },
//     tableCell: {
//       padding: "4px 6px",
//       textAlign: "left",
//       borderRight: "1px solid #E2E8F0",
//       verticalAlign: "middle",
//       fontSize: "9px",
//     },
//     tableCellCenter: {
//       padding: "4px 6px",
//       textAlign: "center",
//       borderRight: "1px solid #E2E8F0",
//       verticalAlign: "middle",
//       fontSize: "9px",
//     },
//     tableCellLabel: {
//       fontWeight: "600",
//       color: "#2D3748",
//       fontSize: "9px",
//     },
//     // New styles for merged title rows
//     sectionTitleRow: {
//       backgroundColor: "#5DADE2",
//       color: "white",
//     },
//     sectionTitleCell: {
//       padding: "6px 8px",
//       textAlign: "center",
//       fontWeight: "600",
//       fontSize: "10px",
//       textTransform: "uppercase",
//       letterSpacing: "0.5px",
//       borderBottom: "1px solid #E2E8F0",
//     },
//     dataSection: {
//       backgroundColor: "#EBF8FF",
//       borderRadius: "6px",
//       padding: "8px",
//       marginBottom: "8px",
//       border: "1px solid #BEE3F8",
//     },
//     dataHeader: {
//       backgroundColor: "#5DADE2",
//       color: "white",
//       padding: "4px 6px",
//       borderRadius: "3px",
//       fontSize: "9px",
//       fontWeight: "600",
//       textAlign: "center",
//       marginBottom: "6px",
//       textTransform: "uppercase",
//     },
//     dataValue: {
//       color: "#4a5568",
//       fontWeight: "500",
//       fontSize: "9px",
//     },
//     insightCard: {
//       backgroundColor: "#f7fafc",
//       border: "2px solid #2d3748",
//       borderRadius: "6px",
//       padding: "12px",
//       minHeight: "80px",
//     },
//     insightText: {
//       fontSize: "12px",
//       fontStyle: "italic",
//       color: "#2d3748",
//       lineHeight: "1.3",
//     },
//     loading: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       height: "50vh",
//       fontSize: "14px",
//       color: "#666",
//     },
//     spinner: {
//       display: "inline-block",
//       width: "32px",
//       height: "32px",
//       border: "2px solid transparent",
//       borderTop: "2px solid #2563eb",
//       borderRadius: "50%",
//       animation: "spin 1s linear infinite",
//     },
//     errorContainer: {
//       minHeight: "100vh",
//       backgroundColor: "#f9fafb",
//       padding: "16px",
//     },
//     errorContent: {
//       maxWidth: "512px",
//       margin: "0 auto",
//     },
//     errorCard: {
//       backgroundColor: "#fef2f2",
//       border: "1px solid #fecaca",
//       borderRadius: "6px",
//       padding: "20px",
//       textAlign: "center",
//     },
//     errorText: {
//       color: "#dc2626",
//       marginBottom: "12px",
//       fontSize: "12px",
//     },
//   };

//   // Add CSS keyframes for spinner animation
//   const styleSheet = document.createElement("style");
//   styleSheet.textContent = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `;
//   if (!document.head.contains(styleSheet)) {
//     document.head.appendChild(styleSheet);
//   }

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.loading}>
//           <div style={styles.spinner}></div>
//           <span style={{ marginLeft: "12px", fontSize: "12px" }}>
//             Loading currency profile...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.errorContainer}>
//         <div style={styles.errorContent}>
//           <div style={styles.errorCard}>
//             <p style={styles.errorText}>❌ Error loading data: {error}</p>
//             <button style={styles.backButton} onClick={fetchCurrencyProfile}>
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const metricsData = createMetricsData();
//   const totalScore =
//     profileData?.totalScore ||
//     metricsData.reduce((sum, item) => sum + item.score, 0);
//   const bias =
//     profileData?.bias ||
//     getScoreLabel(Math.round(totalScore / metricsData.length));
//   const economicData = getEconomicData();
//   const assetPair = profileData?.assetPair || {
//     baseAsset: "EUR",
//     quoteAsset: "USD",
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.mainGrid}>
//         {/* Left Column */}
//         <div style={styles.leftColumn}>
//           {/* Metric Bias Gauge */}
//           <div style={styles.card}>
//             <div style={styles.biasCard}>
//               {/* Gauge Chart */}
//               <div style={styles.biasGauge}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RadialBarChart
//                     cx="50%"
//                     cy="80%"
//                     innerRadius="60%"
//                     outerRadius="90%"
//                     startAngle={180}
//                     endAngle={0}
//                     data={[
//                       {
//                         value: totalScore,
//                         fill: getBiasColor(bias),
//                       },
//                     ]}
//                   >
//                     <RadialBar dataKey="value" cornerRadius={8} />
//                   </RadialBarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Bias Label */}
//               <div style={{ ...styles.biasLabel, color: getBiasColor(bias) }}>
//                 {bias}
//               </div>

//               {/* Score Text */}
//               <div style={styles.biasValue}>Score {totalScore}</div>
//             </div>
//           </div>

//           {/* Asset Pair Title */}
//           <h1 style={styles.pairTitle}>
//             {assetPair.baseAsset}
//             {assetPair.quoteAsset}
//           </h1>

//           {/* Metrics Scoring Table */}
//           <div style={styles.card}>
//             <table style={styles.metricsTable}>
//               <thead>
//                 <tr>
//                   <th style={{ ...styles.metricCell, fontWeight: "600" }}>
//                     Metrics
//                   </th>
//                   <th
//                     style={{
//                       ...styles.metricCell,
//                       fontWeight: "600",
//                       textAlign: "center",
//                     }}
//                   >
//                     Score
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {metricsData.map((metric, index) => (
//                   <tr key={index} style={styles.metricRow}>
//                     <td style={styles.metricCell}>{metric.name}</td>
//                     <td style={styles.metricCell}>
//                       <div
//                         style={{
//                           ...styles.metricScore,
//                           backgroundColor: getScoreColor(metric.score),
//                         }}
//                       >
//                         {metric.score > 0 ? `+${metric.score}` : metric.score}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Center Column */}
//         <div style={styles.centerColumn}>
//           {/* Market Sentiment */}
//           <div style={styles.card}>
//             <div style={styles.sectionHeader}>Market Sentiment</div>
//             {/* COT Data Charts */}
//             <div style={styles.cotChartsContainer}>
//               {/* Base Asset COT Chart */}
//               <div style={styles.cotChart}>
//                 <h4 style={styles.cotTitle}>{assetPair.baseAsset}</h4>
//                 <ResponsiveContainer width="100%" height={160}>
//                   <PieChart>
//                     <Pie
//                       data={[
//                         {
//                           name: "Long",
//                           value: economicData.cotData.baseLongPercent,
//                           fill: "#1E8449",
//                         },
//                         {
//                           name: "Short",
//                           value: economicData.cotData.baseShortPercent,
//                           fill: "#C0392B",
//                         },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={25}
//                       outerRadius={55}
//                       dataKey="value"
//                       stroke="none"
//                       labelLine={true}
//                       label={({ name, value, x, y }) => (
//                         <text
//                           x={x}
//                           y={y}
//                           fill={name === "Long" ? "#1E8449" : "#C0392B"}
//                           textAnchor={name === "Long" ? "start" : "end"}
//                           dominantBaseline="central"
//                           fontSize={12}
//                         >
//                           {`${name}: ${value.toFixed(1)}%`}
//                         </text>
//                       )}
//                     />
//                     <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Quote Asset COT Chart */}
//               <div style={styles.cotChart}>
//                 <h4 style={styles.cotTitle}>{assetPair.quoteAsset}</h4>
//                 <ResponsiveContainer width="100%" height={160}>
//                   <PieChart>
//                     <Pie
//                       data={[
//                         {
//                           name: "Long",
//                           value: economicData.cotData.quoteLongPercent,
//                           fill: "#1E8449",
//                         },
//                         {
//                           name: "Short",
//                           value: economicData.cotData.quoteShortPercent,
//                           fill: "#C0392B",
//                         },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={25}
//                       outerRadius={55}
//                       dataKey="value"
//                       stroke="none"
//                       labelLine={true}
//                       label={({ name, value, x, y }) => (
//                         <text
//                           x={x}
//                           y={y}
//                           fill={name === "Long" ? "#1E8449" : "#C0392B"}
//                           textAnchor={name === "Long" ? "start" : "end"}
//                           dominantBaseline="central"
//                           fontSize={12}
//                         >
//                           {`${name}: ${value.toFixed(1)}%`}
//                         </text>
//                       )}
//                     />
//                     <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Retail Sentiment */}
//           <div style={styles.card}>
//             <div style={styles.sectionHeader}>Retail Sentiment</div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={styles.economicTable}>
//                 <thead>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Retail Long %</th>
//                     <th style={styles.tableHeader}>Retail Short %</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan={2} style={{ padding: "10px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           width: "100%",
//                           height: "30px",
//                           borderRadius: "4px",
//                           overflow: "hidden",
//                           border: "1px solid #CBD5E0", // optional border
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: `${economicData.retailPosition.longPercent}%`,
//                             backgroundColor: "#1E8449",
//                             color: "white",
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             fontWeight: "bold",
//                             fontSize: "0.85rem",
//                           }}
//                         >
//                           {economicData.retailPosition.longPercent > 5 &&
//                             `${economicData.retailPosition.longPercent}%`}
//                         </div>
//                         <div
//                           style={{
//                             width: `${economicData.retailPosition.shortPercent}%`,
//                             backgroundColor: "#C0392B",
//                             color: "white",
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             fontWeight: "bold",
//                             fontSize: "0.85rem",
//                           }}
//                         >
//                           {economicData.retailPosition.shortPercent > 5 &&
//                             `${economicData.retailPosition.shortPercent}%`}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Interest Rate */}
//           <div style={styles.card}>
//             <div style={styles.sectionHeader}>Interest Rate</div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={styles.economicTable}>
//                 <thead>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Actual</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Change</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.interestRate.baseChange > 0 ? "+" : ""}
//                         {economicData.interestRate.baseChange}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>-</div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.interestRate.baseChange > 0 ? "+" : ""}
//                         {economicData.interestRate.baseChange}%
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.interestRate.quoteChange}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>-</div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.interestRate.quoteChange}%
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Core Inflation */}
//           <div style={styles.card}>
//             <div style={styles.sectionHeader}>Core Inflation</div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={styles.economicTable}>
//                 <thead>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Actual</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Change</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.inflation.baseCPI}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.inflation.baseForecast}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.inflation.baseCPI >
//                         economicData.inflation.baseForecast
//                           ? "+"
//                           : ""}
//                         {(
//                           economicData.inflation.baseCPI -
//                           economicData.inflation.baseForecast
//                         ).toFixed(1)}
//                         %
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.inflation.quoteCPI}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.inflation.quoteForecast}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.inflation.quoteCPI ===
//                         economicData.inflation.quoteForecast
//                           ? "0.0"
//                           : (economicData.inflation.quoteCPI -
//                               economicData.inflation.quoteForecast >
//                             0
//                               ? "+"
//                               : "") +
//                             (
//                               economicData.inflation.quoteCPI -
//                               economicData.inflation.quoteForecast
//                             ).toFixed(1)}
//                         %
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div style={styles.rightColumn}>
//           {/* Labor Market Data - Combined Table */}
//           <div style={styles.card}>
//             <div style={styles.sectionHeader}>LABOR MARKET DATA</div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={styles.economicTable}>
//                 {/* NFP Section - Only show if USD is present */}
//                 {hasUSD(economicData) && (
//                   <>
//                     <thead>
//                       <tr style={styles.sectionTitleRow}>
//                         <th style={styles.sectionTitleCell} colSpan="4">
//                           NFP (USA)
//                         </th>
//                       </tr>
//                       <tr style={styles.tableHeaderRow}>
//                         <th style={styles.tableHeader}>Actual</th>
//                         <th style={styles.tableHeader}>Forecast</th>
//                         <th style={styles.tableHeader}>Change</th>
//                         <th style={styles.tableHeader}>-</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr style={styles.tableRow}>
//                         <td style={styles.tableCellCenter}>
//                           <div style={styles.dataValue}>
//                             {economicData.nfp.actual.toLocaleString()}
//                           </div>
//                         </td>
//                         <td style={styles.tableCellCenter}>
//                           <div style={styles.dataValue}>
//                             {economicData.nfp.forecast.toLocaleString()}
//                           </div>
//                         </td>
//                         <td style={styles.tableCellCenter}>
//                           <div style={styles.dataValue}>
//                             {economicData.nfp.change}%
//                           </div>
//                         </td>
//                         <td style={styles.tableCellCenter}>
//                           <div style={styles.dataValue}>-</div>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </>
//                 )}

//                 {/* Employment Change Section */}
//                 <thead>
//                   <tr style={styles.sectionTitleRow}>
//                     <th style={styles.sectionTitleCell} colSpan="4">
//                       Employment Change
//                     </th>
//                   </tr>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Emp. Change</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.employment.baseChange.toLocaleString()}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.employment.baseForecast.toLocaleString()}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.employment.baseResult || "N/A"}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.employment.quoteChange.toLocaleString()}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.employment.quoteForecast.toLocaleString()}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.employment.quoteResult || "N/A"}
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* Unemployment Section */}
//                 <thead>
//                   <tr style={styles.sectionTitleRow}>
//                     <th style={styles.sectionTitleCell} colSpan="4">
//                       Unemployment
//                     </th>
//                   </tr>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Unemployment</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.unemployment.baseRate}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.unemployment.baseForecast}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.unemployment.baseResult || "N/A"}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.unemployment.quoteRate}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.unemployment.quoteForecast}%
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.unemployment.quoteResult || "N/A"}
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Economic Growth Data - Combined Table */}
//           <div style={styles.card}>
//             <div style={styles.sectionHeader}>ECONOMIC GROWTH DATA</div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={styles.economicTable}>
//                 {/* GDP Growth Section */}
//                 <thead>
//                   <tr style={styles.sectionTitleRow}>
//                     <th style={styles.sectionTitleCell} colSpan="4">
//                       GDP Growth
//                     </th>
//                   </tr>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Actual</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.gdp.baseActual || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.gdp.baseForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.gdp.baseResult}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.gdp.quoteActual || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.gdp.quoteForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.gdp.quoteResult}
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* Manufacturing PMI Section */}
//                 <thead>
//                   <tr style={styles.sectionTitleRow}>
//                     <th style={styles.sectionTitleCell} colSpan="4">
//                       Manufacturing PMI
//                     </th>
//                   </tr>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Actual</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.mpmi.baseValue || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.mpmi.baseForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.mpmi.baseResult}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.mpmi.quoteValue || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.mpmi.quoteForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.mpmi.quoteResult}
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* Services PMI Section */}
//                 <thead>
//                   <tr style={styles.sectionTitleRow}>
//                     <th style={styles.sectionTitleCell} colSpan="4">
//                       Services PMI
//                     </th>
//                   </tr>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Actual</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.spmi.baseValue || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.spmi.baseForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.spmi.baseResult}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.spmi.quoteValue || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.spmi.quoteForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.spmi.quoteResult}
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* Retail Sales Section */}
//                 <thead>
//                   <tr style={styles.sectionTitleRow}>
//                     <th style={styles.sectionTitleCell} colSpan="4">
//                       Retail Sales
//                     </th>
//                   </tr>
//                   <tr style={styles.tableHeaderRow}>
//                     <th style={styles.tableHeader}>Currency</th>
//                     <th style={styles.tableHeader}>Actual</th>
//                     <th style={styles.tableHeader}>Forecast</th>
//                     <th style={styles.tableHeader}>Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.baseAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.retail.baseActual || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.retail.baseForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.retail.baseResult}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr style={styles.tableRow}>
//                     <td style={styles.tableCell}>
//                       <div style={styles.tableCellLabel}>
//                         {assetPair.quoteAsset}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.retail.quoteActual || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.retail.quoteForecast || "N/A"}
//                       </div>
//                     </td>
//                     <td style={styles.tableCellCenter}>
//                       <div style={styles.dataValue}>
//                         {economicData.retail.quoteResult}
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section with Three Charts */}
//       <div style={styles.bottomGrid}>
//         {/* 8ConEdge Insight */}
//         <div style={styles.insightCard}>
//           <div style={styles.sectionHeader}>8ConEdge Insight</div>
//           <div style={styles.insightText}>AI tips.......</div>
//         </div>

//         {/* Score Distribution */}
//         <div style={styles.card}>
//           <div style={styles.sectionHeader}>Score Distribution</div>
//           <ResponsiveContainer width="100%" height={200}>
//             {" "}
//             {/* Increased height */}
//             <PieChart>
//               <Pie
//                 data={createScoreDistributionData()}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70} // Increased radius for better fill
//                 dataKey="value"
//                 label={({ name, value }) => `${name}: ${value}%`} // Cleaner label
//                 labelLine={false}
//               >
//                 {createScoreDistributionData().map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => `${value}%`} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Strength Radar */}
//         <div style={styles.card}>
//           <div style={styles.sectionHeader}>Strength Radar</div>
//           <ResponsiveContainer width="100%" height={200}>
//             <RadarChart data={createRadarData()}>
//               <PolarGrid stroke="#e2e8f0" />
//               <PolarAngleAxis
//                 dataKey="indicator"
//                 tick={{ fontSize: 10, fill: "#4a5568" }}
//               />
//               <PolarRadiusAxis
//                 angle={90}
//                 domain={[0, 10]}
//                 tickCount={6}
//                 tick={{ fontSize: 8, fill: "#718096" }}
//               />
//               <Radar
//                 name={assetPair.baseAsset}
//                 dataKey="Base_Currency"
//                 stroke="#2B6CB0" // Strong blue (Base)
//                 fill="#2B6CB0"
//                 fillOpacity={0.5}
//               />
//               <Radar
//                 name={assetPair.quoteAsset}
//                 dataKey="Quote_Currency"
//                 stroke="#E53E3E" // Strong red (Quote)
//                 fill="#E53E3E"
//                 fillOpacity={0.5}
//               />
//               <Legend />
//               <Tooltip />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrencyProfile;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
} from "recharts";

const CurrencyProfile = ({ assetPairCode: propAssetPairCode, onNavigateBack }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { assetPairCode: urlAssetPairCode } = useParams();
  
  // AI Integration State
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Use URL parameter if available, otherwise use prop
  const assetPairCode = urlAssetPairCode || propAssetPairCode;
  const navigate = useNavigate();
  
  const handleBack = () => {
    sessionStorage.setItem('programmaticNav', 'true');
    sessionStorage.setItem('allowNavigation', 'true');
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    console.log(
      "🔧 CurrencyProfile mounted with assetPairCode:",
      assetPairCode
    );
  }, []);

  useEffect(() => {
    console.log("📝 assetPairCode changed to:", assetPairCode);
    if (assetPairCode) {
      fetchCurrencyProfile();
    } else {
      console.log("❌ No assetPairCode provided");
      setError("No asset pair code provided");
      setLoading(false);
    }
  }, [assetPairCode]);

  // AI Integration - Fetch AI insights when profile data changes
  useEffect(() => {
    if (assetPairCode && profileData) {
      fetchAiInsight();
    }
  }, [assetPairCode, profileData]);

  const fetchCurrencyProfile = async () => {
    try {
      console.log("🚀 Starting fetchCurrencyProfile for:", assetPairCode);
      setLoading(true);
      setError(null);

      const url = `http://localhost:3000/api/currency-profile/${assetPairCode}`;
      console.log("📡 Fetching URL:", url);

      const response = await fetch(url);
      console.log("📊 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success && result.data) {
        setProfileData(result.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // AI Integration - Fetch AI insights
  const fetchAiInsight = async () => {
    if (!assetPairCode) return;
    
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/ai-insight/${assetPairCode}`);
      const result = await response.json();
      
      if (result.success) {
        setAiInsight(result.data);
      } else {
        setAiError(result.error || 'Failed to fetch AI insights');
      }
    } catch (error) {
      console.error('AI Insight fetch error:', error);
      setAiError('Unable to connect to AI service');
    } finally {
      setAiLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 2) return "#1E8449"; // Very Bullish
    if (score >= 1) return "#58D68D"; // Bullish
    if (score === 0) return "#BDBDBD"; // Neutral
    if (score >= -1) return "#F5B041"; // Bearish
    return "#C0392B"; // Very Bearish
  };

  const getBiasColor = (bias) => {
    if (bias === "Very Bullish") return "#1E8449";
    if (bias === "Bullish") return "#58D68D";
    if (bias === "Neutral") return "#BDBDBD";
    if (bias === "Bearish") return "#F5B041";
    if (bias === "Very Bearish") return "#C0392B";
    return "#BDBDBD";
  };

  const getScoreLabel = (score) => {
    if (score >= 2) return "Very Bullish";
    if (score >= 1) return "Bullish";
    if (score === 0) return "Neutral";
    if (score >= -1) return "Bearish";
    return "Very Bearish";
  };

  // Get economic data from profileData - REAL DATABASE DATA ONLY
  const getEconomicData = () => {
    if (profileData) {
      return {
        baseAsset: profileData.assetPair?.baseAsset || "N/A",
        quoteAsset: profileData.assetPair?.quoteAsset || "N/A",

        // Extract REAL data from profileData.breakdown
        cotData: extractCOTData(),
        retailPosition: extractRetailPosition(),
        nfp: extractNFPData(),
        employment: extractEmploymentData(),
        unemployment: extractUnemploymentData(),
        gdp: extractGDPData(),
        mpmi: extractMPMIData(),
        spmi: extractSPMIData(),
        retail: extractRetailData(),
        inflation: extractInflationData(),
        interestRate: extractInterestRateData(),
      };
    }

    // No mock data - return empty structure if no profile data
    return {
      baseAsset: "N/A",
      quoteAsset: "N/A",
      cotData: {
        baseLongPercent: 0,
        baseShortPercent: 0,
        baseNetChangePercent: 0,
        quoteLongPercent: 0,
        quoteShortPercent: 0,
        quoteNetChangePercent: 0,
      },
      retailPosition: { longPercent: 0, shortPercent: 0 },
      nfp: { actual: 0, forecast: 0, change: 0 },
      employment: {
        baseChange: 0,
        baseForecast: 0,
        baseResult: "N/A",
        quoteChange: 0,
        quoteForecast: 0,
        quoteResult: "N/A",
      },
      unemployment: {
        baseRate: 0,
        baseForecast: 0,
        baseResult: "N/A",
        quoteRate: 0,
        quoteForecast: 0,
        quoteResult: "N/A",
      },
      gdp: {
        baseResult: "N/A",
        baseActual: "N/A",
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteActual: "N/A",
        quoteForecast: "N/A",
      },
      mpmi: {
        baseResult: "N/A",
        baseValue: 0,
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteValue: 0,
        quoteForecast: "N/A",
      },
      spmi: {
        baseResult: "N/A",
        baseValue: 0,
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteValue: 0,
        quoteForecast: "N/A",
      },
      retail: {
        baseResult: "N/A",
        baseActual: "N/A",
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteActual: "N/A",
        quoteForecast: "N/A",
      },
      inflation: { baseCPI: 0, baseForecast: 0, quoteCPI: 0, quoteForecast: 0 },
      interestRate: { baseChange: 0, quoteChange: 0 },
    };
  };

  // Extract functions for REAL DATABASE data only
  const extractCOTData = () => {
    const cotIndicator = profileData?.breakdown?.find(
      (ind) =>
        ind.name === "COT Data" || ind.name === "COT (Commitment of Traders)"
    );
    if (!cotIndicator)
      return {
        baseLongPercent: 0,
        baseShortPercent: 0,
        baseNetChangePercent: 0,
        quoteLongPercent: 0,
        quoteShortPercent: 0,
        quoteNetChangePercent: 0,
      };

    return {
      baseLongPercent: cotIndicator?.baseData?.["Long %"] || 0,
      baseShortPercent: cotIndicator?.baseData?.["Short %"] || 0,
      baseNetChangePercent: cotIndicator?.baseData?.["Net Change %"] || 0,
      quoteLongPercent: cotIndicator?.quoteData?.["Long %"] || 0,
      quoteShortPercent: cotIndicator?.quoteData?.["Short %"] || 0,
      quoteNetChangePercent: cotIndicator?.quoteData?.["Net Change %"] || 0,
    };
  };

  const extractRetailPosition = () => {
    const retailIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Retail Position"
    );
    if (!retailIndicator) return { longPercent: 0, shortPercent: 0 };

    return {
      longPercent: retailIndicator?.baseData?.["Retail Long %"] || 0,
      shortPercent: retailIndicator?.baseData?.["Retail Short %"] || 0,
    };
  };

  const extractNFPData = () => {
    // NFP data is usually USD specific - check if it exists in your data structure
    const nfpData = profileData?.economicData?.nfp;
    return {
      actual: nfpData?.actual || 0,
      forecast: nfpData?.forecast || 0,
      change: nfpData?.change || 0,
    };
  };

  const extractEmploymentData = () => {
    const empIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Employment Change"
    );
    if (!empIndicator)
      return {
        baseChange: 0,
        baseForecast: 0,
        baseResult: "N/A",
        quoteChange: 0,
        quoteForecast: 0,
        quoteResult: "N/A",
      };

    return {
      baseChange: empIndicator?.baseData?.["Employment Change"] || 0,
      baseForecast: empIndicator?.baseData?.["Forecast"] || 0,
      baseResult: empIndicator?.baseData?.["Result"] || "N/A",
      quoteChange: empIndicator?.quoteData?.["Employment Change"] || 0,
      quoteForecast: empIndicator?.quoteData?.["Forecast"] || 0,
      quoteResult: empIndicator?.quoteData?.["Result"] || "N/A",
    };
  };

  const extractUnemploymentData = () => {
    const unempIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Unemployment Rate"
    );
    if (!unempIndicator)
      return {
        baseRate: 0,
        baseForecast: 0,
        baseResult: "N/A",
        quoteRate: 0,
        quoteForecast: 0,
        quoteResult: "N/A",
      };

    return {
      baseRate: unempIndicator?.baseData?.["Unemployment Rate"] || 0,
      baseForecast: unempIndicator?.baseData?.["Forecast"] || 0,
      baseResult: unempIndicator?.baseData?.["Result"] || "N/A",
      quoteRate: unempIndicator?.quoteData?.["Unemployment Rate"] || 0,
      quoteForecast: unempIndicator?.quoteData?.["Forecast"] || 0,
      quoteResult: unempIndicator?.quoteData?.["Result"] || "N/A",
    };
  };

  const extractGDPData = () => {
    const gdpIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "GDP Growth"
    );
    if (!gdpIndicator)
      return {
        baseResult: "N/A",
        baseActual: "N/A",
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteActual: "N/A",
        quoteForecast: "N/A",
      };

    return {
      baseResult: gdpIndicator?.baseData?.["Result"] || "N/A",
      baseActual: gdpIndicator?.baseData?.["GDP Growth"] || "N/A",
      baseForecast: gdpIndicator?.baseData?.["Forecast"] || "N/A",
      quoteResult: gdpIndicator?.quoteData?.["Result"] || "N/A",
      quoteActual: gdpIndicator?.quoteData?.["GDP Growth"] || "N/A",
      quoteForecast: gdpIndicator?.quoteData?.["Forecast"] || "N/A",
    };
  };

  const extractMPMIData = () => {
    const mpmiIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Manufacturing PMI"
    );
    if (!mpmiIndicator)
      return {
        baseResult: "N/A",
        baseValue: 0,
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteValue: 0,
        quoteForecast: "N/A",
      };

    return {
      baseResult: mpmiIndicator?.baseData?.["Result"] || "N/A",
      baseValue: mpmiIndicator?.baseData?.["Service PMI"] || 0,
      baseForecast: mpmiIndicator?.baseData?.["Forecast"] || "N/A",
      quoteResult: mpmiIndicator?.quoteData?.["Result"] || "N/A",
      quoteValue: mpmiIndicator?.quoteData?.["Service PMI"] || 0,
      quoteForecast: mpmiIndicator?.quoteData?.["Forecast"] || "N/A",
    };
  };

  const extractSPMIData = () => {
    const spmiIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Services PMI"
    );
    if (!spmiIndicator)
      return {
        baseResult: "N/A",
        baseValue: 0,
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteValue: 0,
        quoteForecast: "N/A",
      };

    return {
      baseResult: spmiIndicator?.baseData?.["Result"] || "N/A",
      baseValue: spmiIndicator?.baseData?.["Service PMI"] || 0,
      baseForecast: spmiIndicator?.baseData?.["Forecast"] || "N/A",
      quoteResult: spmiIndicator?.quoteData?.["Result"] || "N/A",
      quoteValue: spmiIndicator?.quoteData?.["Service PMI"] || 0,
      quoteForecast: spmiIndicator?.quoteData?.["Forecast"] || "N/A",
    };
  };

  const extractRetailData = () => {
    const retailIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Retail Sales"
    );
    if (!retailIndicator)
      return {
        baseResult: "N/A",
        baseActual: "N/A",
        baseForecast: "N/A",
        quoteResult: "N/A",
        quoteActual: "N/A",
        quoteForecast: "N/A",
      };

    return {
      baseResult: retailIndicator?.baseData?.["Result"] || "N/A",
      baseActual: retailIndicator?.baseData?.["Retail Sales"] || "N/A",
      baseForecast: retailIndicator?.baseData?.["Forecast"] || "N/A",
      quoteResult: retailIndicator?.quoteData?.["Result"] || "N/A",
      quoteActual: retailIndicator?.quoteData?.["Retail Sales"] || "N/A",
      quoteForecast: retailIndicator?.quoteData?.["Forecast"] || "N/A",
    };
  };

  const extractInflationData = () => {
    const inflationIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Inflation" || ind.name === "Core Inflation"
    );
    if (!inflationIndicator)
      return { baseCPI: 0, baseForecast: 0, quoteCPI: 0, quoteForecast: 0 };

    return {
      baseCPI: inflationIndicator?.baseData?.["Core Inflation"] || 0,
      baseForecast: inflationIndicator?.baseData?.["Forecast"] || 0,
      quoteCPI: inflationIndicator?.quoteData?.["Core Inflation"] || 0,
      quoteForecast: inflationIndicator?.quoteData?.["Forecast"] || 0,
    };
  };

  const extractInterestRateData = () => {
    const interestIndicator = profileData?.breakdown?.find(
      (ind) => ind.name === "Interest Rates"
    );
    if (!interestIndicator) return { baseChange: 0, quoteChange: 0 };

    return {
      baseChange: interestIndicator?.baseData?.["Change in Interest"] || 0,
      quoteChange: interestIndicator?.quoteData?.["Change in Interest"] || 0,
    };
  };

  // Additional scoring functions from the updated file
  const calculateEmploymentScore = (
    baseChange,
    baseForecast,
    quoteChange,
    quoteForecast
  ) => {
    const baseScore =
      baseChange > baseForecast ? 1 : baseChange < baseForecast ? -1 : 0;
    const quoteScore =
      quoteChange > quoteForecast ? -1 : quoteChange < quoteForecast ? 1 : 0;
    return { baseScore, quoteScore, total: baseScore + quoteScore };
  };

  const calculateUnemploymentScore = (
    baseRate,
    baseForecast,
    quoteRate,
    quoteForecast
  ) => {
    const baseScore =
      baseRate > baseForecast ? -1 : baseRate < baseForecast ? 1 : 0;
    const quoteScore =
      quoteRate > quoteForecast ? 1 : quoteRate < quoteForecast ? -1 : 0;
    return { baseScore, quoteScore, total: baseScore + quoteScore };
  };

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
    return { baseScore, quoteScore, total: baseScore + quoteScore };
  };

  const calculateInflationScore = (
    baseCPI,
    baseForecast,
    quoteCPI,
    quoteForecast
  ) => {
    const baseScore =
      baseCPI > baseForecast ? 1 : baseCPI < baseForecast ? -1 : 0;
    const quoteScore =
      quoteCPI > quoteForecast ? -1 : quoteCPI < quoteForecast ? 1 : 0;
    return { baseScore, quoteScore, total: baseScore + quoteScore };
  };

  const calculateInterestRateScore = (baseChange, quoteChange) => {
    const baseScore = baseChange > 0 ? 1 : baseChange < 0 ? -1 : 0;
    const quoteScore = quoteChange > 0 ? -1 : quoteChange < 0 ? 1 : 0;
    return { baseScore, quoteScore, total: baseScore + quoteScore };
  };

  const createMetricsData = () => {
    if (profileData?.breakdown) {
      return profileData.breakdown.map((indicator) => ({
        name: indicator.name
          .replace("COT (Commitment of Traders)", "COT")
          .replace("Manufacturing PMI", "mPMI")
          .replace("Services PMI", "sPMI")
          .replace("Employment Change", "Emp. Change")
          .replace("Unemployment Rate", "Unemployment")
          .replace("Retail Sales", "Retail Sales")
          .replace("Interest Rates", "Interest Rate")
          .replace("Retail Position", "Retail Pos"),
        score: indicator.score || 0,
      }));
    }

    // Return empty array if no profileData
    return [];
  };

  const createScoreDistributionData = () => {
    if (profileData?.breakdown && profileData.breakdown.length > 0) {
      const distribution = {
        "Very Bearish": 0,
        Bearish: 0,
        Neutral: 0,
        Bullish: 0,
        "Very Bullish": 0,
      };

      profileData.breakdown.forEach((indicator) => {
        const label = getScoreLabel(indicator.score);
        distribution[label]++;
      });

      const total = profileData.breakdown.length;
      return Object.entries(distribution)
        .filter(([_, count]) => count > 0)
        .map(([name, count]) => ({
          name,
          value: parseFloat(((count / total) * 100).toFixed(1)),
          color: getBiasColor(name),
        }));
    }

    // Return empty array if no data
    return [];
  };

  const createRadarData = () => {
    const metricsData = createMetricsData();
    if (metricsData.length === 0) return [];

    return metricsData.map((metric) => ({
      indicator: metric.name,
      Base_Currency: Math.max(0, (metric.score + 2) * 2.5), // Normalize to 0-10 scale
      Quote_Currency: Math.max(0, (metric.score + 2) * 2), // Different scaling for comparison
      fullScore: 10,
    }));
  };

  // Check if pair includes USD for NFP display
  const hasUSD = (economicData) => {
    return (
      economicData.baseAsset === "USD" || economicData.quoteAsset === "USD"
    );
  };

  // AI Enhanced Insight Card
  const renderAiInsightCard = () => {
    return (
      <div style={styles.insightCard}>
        <div style={styles.sectionHeader}>8ConEdge AI Insight</div>
        
        {aiLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={styles.spinner}></div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
              Analyzing market data...
            </div>
          </div>
        )}
        
        {aiError && (
          <div style={{ 
            color: '#dc2626', 
            fontSize: '11px', 
            textAlign: 'center',
            padding: '15px'
          }}>
            <div style={{ marginBottom: '8px' }}>⚠️ AI Service Unavailable</div>
            <div>{aiError}</div>
            <button 
              onClick={fetchAiInsight}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                fontSize: '10px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        {aiInsight && !aiLoading && (
          <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
            {/* AI Recommendation */}
            <div style={{ 
              marginBottom: '12px', 
              padding: '8px',
              backgroundColor: '#f0f9ff',
              borderRadius: '4px',
              border: '1px solid #0ea5e9'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                color: '#0c4a6e',
                marginBottom: '4px'
              }}>
                🤖 AI Recommendation
              </div>
              <div style={{ color: '#0369a1' }}>
                {aiInsight.recommendation}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#64748b',
                marginTop: '2px'
              }}>
                Confidence: {aiInsight.confidence} | {aiInsight.analysis_date}
              </div>
            </div>
            
            {/* Currency Strength */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '6px',
                color: '#1e293b'
              }}>
                💪 Currency Strength
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{color: 'black'}}>{aiInsight.base_currency.code}: {aiInsight.base_currency.score}/100</span>
                <span style={{ 
                  color: getBiasColor(aiInsight.base_currency.bias),
                  fontWeight: '500'
                }}>
                  {aiInsight.base_currency.bias}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{color: 'black'}}>{aiInsight.quote_currency.code}: {aiInsight.quote_currency.score}/100</span>
                <span style={{ 
                  color: getBiasColor(aiInsight.quote_currency.bias),
                  fontWeight: '500'
                }}>
                  {aiInsight.quote_currency.bias}
                </span>
              </div>
            </div>
            
            {/* Market Insights */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '6px',
                color: '#1e293b'
              }}>
                🧠 Market Insights
              </div>
              {aiInsight.insights.map((insight, index) => (
                <div key={index} style={{ 
                  marginBottom: '3px',
                  paddingLeft: '8px',
                  color: '#475569'
                }}>
                  • {insight}
                </div>
              ))}
            </div>
            
            {/* Trading Reminders */}
            <div style={{ 
              backgroundColor: '#fef3c7',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '6px',
                color: '#92400e'
              }}>
                ⚠️ Trading Reminders
              </div>
              {aiInsight.reminders.slice(0, 3).map((reminder, index) => (
                <div key={index} style={{ 
                  fontSize: '10px',
                  marginBottom: '2px',
                  color: '#78350f'
                }}>
                  {reminder}
                </div>
              ))}
              <div style={{ 
                fontSize: '9px',
                marginTop: '4px',
                fontStyle: 'italic',
                color: '#92400e'
              }}>
                This is data analysis only - not financial advice
              </div>
            </div>
          </div>
        )}
        
        {!aiInsight && !aiLoading && !aiError && (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '11px',
            padding: '20px'
          }}>
            AI insights will appear here once data is loaded
          </div>
        )}
      </div>
    );
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "12px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "11px",
    },
    backButton: {
      marginBottom: "12px",
      backgroundColor: "#2563eb",
      color: "white",
      padding: "6px 12px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: "500",
    },
    pairTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      margin: "0 0 16px 0",
      color: "#1a202c",
      letterSpacing: "1px",
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "220px 1fr 1fr",
      gap: "12px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    centerColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    rightColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    // Bottom section grid for the three charts
    bottomGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "12px",
      marginTop: "12px",
      gridColumn: "1 / -1", // Span all columns
    },
    card: {
      backgroundColor: "white",
      borderRadius: "6px",
      padding: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
    },
    sectionHeader: {
      backgroundColor: "#5DADE2",
      color: "white",
      padding: "6px 8px",
      borderRadius: "4px 4px 0 0",
      margin: "-8px -8px 8px -8px",
      fontSize: "10px",
      fontWeight: "600",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    biasCard: {
      textAlign: "center",
      padding: "4px",
    },
    biasGauge: {
      width: "140px",
      height: "80px",
      margin: "0 auto 8px",
      position: "relative",
    },
    biasLabel: {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "4px",
    },
    biasValue: {
      fontSize: "11px",
      color: "#4a5568",
      fontWeight: "500",
    },
    metricsTable: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 2px",
    },
    metricRow: {
      backgroundColor: "#f8fafc",
    },
    metricCell: {
      padding: "4px 6px",
      textAlign: "left",
      borderRadius: "3px",
      fontSize: "10px",
      color: "#2d3748",
    },
    metricScore: {
      textAlign: "center",
      fontWeight: "bold",
      color: "white",
      borderRadius: "3px",
      width: "35px",
      padding: "3px 4px",
      fontSize: "10px",
    },
    cotChartsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "12px",
    },
    cotChart: {
      textAlign: "center",
    },
    cotTitle: {
      margin: "0 0 8px 0",
      fontSize: "12px",
      fontWeight: "600",
      color: "#2d3748",
    },
    cotStats: {
      fontSize: "9px",
      marginTop: "4px",
      color: "#4a5568",
    },
    economicTable: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      border: "1px solid #E2E8F0",
      borderRadius: "4px",
      overflow: "hidden",
      fontSize: "9px",
    },
    tableHeaderRow: {
      backgroundColor: "#F7FAFC",
    },
    tableHeader: {
      padding: "4px 6px",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "9px",
      color: "#2D3748",
      borderBottom: "1px solid #E2E8F0",
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    tableRow: {
      borderBottom: "1px solid #E2E8F0",
      backgroundColor: "white",
    },
    tableCell: {
      padding: "4px 6px",
      textAlign: "left",
      borderRight: "1px solid #E2E8F0",
      verticalAlign: "middle",
      fontSize: "9px",
    },
    tableCellCenter: {
      padding: "4px 6px",
      textAlign: "center",
      borderRight: "1px solid #E2E8F0",
      verticalAlign: "middle",
      fontSize: "9px",
    },
    tableCellLabel: {
      fontWeight: "600",
      color: "#2D3748",
      fontSize: "9px",
    },
    // New styles for merged title rows
    sectionTitleRow: {
      backgroundColor: "#5DADE2",
      color: "white",
    },
    sectionTitleCell: {
      padding: "6px 8px",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "1px solid #E2E8F0",
    },
    dataSection: {
      backgroundColor: "#EBF8FF",
      borderRadius: "6px",
      padding: "8px",
      marginBottom: "8px",
      border: "1px solid #BEE3F8",
    },
    dataHeader: {
      backgroundColor: "#5DADE2",
      color: "white",
      padding: "4px 6px",
      borderRadius: "3px",
      fontSize: "9px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "6px",
      textTransform: "uppercase",
    },
    dataValue: {
      color: "#4a5568",
      fontWeight: "500",
      fontSize: "9px",
    },
    insightCard: {
      backgroundColor: "#f7fafc",
      border: "2px solid #2d3748",
      borderRadius: "6px",
      padding: "12px",
      minHeight: "80px",
    },
    insightText: {
      fontSize: "12px",
      fontStyle: "italic",
      color: "#2d3748",
      lineHeight: "1.3",
    },
    loading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "50vh",
      fontSize: "14px",
      color: "#666",
    },
    spinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid transparent",
      borderTop: "2px solid #2563eb",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    errorContainer: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "16px",
    },
    errorContent: {
      maxWidth: "512px",
      margin: "0 auto",
    },
    errorCard: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "6px",
      padding: "20px",
      textAlign: "center",
    },
    errorText: {
      color: "#dc2626",
      marginBottom: "12px",
      fontSize: "12px",
    },
  };

  // Add CSS keyframes for spinner animation
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  if (!document.head.contains(styleSheet)) {
    document.head.appendChild(styleSheet);
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <span style={{ marginLeft: "12px", fontSize: "12px" }}>
            Loading currency profile...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <div style={styles.errorCard}>
            <p style={styles.errorText}>❌ Error loading data: {error}</p>
            <button style={styles.backButton} onClick={fetchCurrencyProfile}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

    const metricsData = createMetricsData();
  const totalScore =
    profileData?.totalScore ||
    metricsData.reduce((sum, item) => sum + item.score, 0);
  const bias =
    profileData?.bias ||
    getScoreLabel(Math.round(totalScore / metricsData.length));
  const economicData = getEconomicData();
  const assetPair = profileData?.assetPair || {
    baseAsset: "EUR",
    quoteAsset: "USD",
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainGrid}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* Metric Bias Gauge */}
          <div style={styles.card}>
            <div style={styles.biasCard}>
              {/* Gauge Chart */}
              <div style={styles.biasGauge}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="80%"
                    innerRadius="60%"
                    outerRadius="90%"
                    startAngle={180}
                    endAngle={0}
                    data={[
                      {
                        value: totalScore,
                        fill: getBiasColor(bias),
                      },
                    ]}
                  >
                    <RadialBar dataKey="value" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* Bias Label */}
              <div style={{ ...styles.biasLabel, color: getBiasColor(bias) }}>
                {bias}
              </div>

              {/* Score Text */}
              <div style={styles.biasValue}>Score {totalScore}</div>
            </div>
          </div>

          {/* Asset Pair Title */}
          <h1 style={styles.pairTitle}>
            {assetPair.baseAsset}
            {assetPair.quoteAsset}
          </h1>

          {/* Metrics Scoring Table */}
          <div style={styles.card}>
            <table style={styles.metricsTable}>
              <thead>
                <tr>
                  <th style={{ ...styles.metricCell, fontWeight: "600" }}>
                    Metrics
                  </th>
                  <th
                    style={{
                      ...styles.metricCell,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {metricsData.map((metric, index) => (
                  <tr key={index} style={styles.metricRow}>
                    <td style={styles.metricCell}>{metric.name}</td>
                    <td style={styles.metricCell}>
                      <div
                        style={{
                          ...styles.metricScore,
                          backgroundColor: getScoreColor(metric.score),
                        }}
                      >
                        {metric.score > 0 ? `+${metric.score}` : metric.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Column */}
        <div style={styles.centerColumn}>
          {/* Market Sentiment */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Market Sentiment</div>
            {/* COT Data Charts */}
            <div style={styles.cotChartsContainer}>
              {/* Base Asset COT Chart */}
              <div style={styles.cotChart}>
                <h4 style={styles.cotTitle}>{assetPair.baseAsset}</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Long",
                          value: economicData.cotData.baseLongPercent,
                          fill: "#1E8449",
                        },
                        {
                          name: "Short",
                          value: economicData.cotData.baseShortPercent,
                          fill: "#C0392B",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={55}
                      dataKey="value"
                      stroke="none"
                      labelLine={true}
                      label={({ name, value, x, y }) => (
                        <text
                          x={x}
                          y={y}
                          fill={name === "Long" ? "#1E8449" : "#C0392B"}
                          textAnchor={name === "Long" ? "start" : "end"}
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {`${name}: ${value.toFixed(1)}%`}
                        </text>
                      )}
                    />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Quote Asset COT Chart */}
              <div style={styles.cotChart}>
                <h4 style={styles.cotTitle}>{assetPair.quoteAsset}</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Long",
                          value: economicData.cotData.quoteLongPercent,
                          fill: "#1E8449",
                        },
                        {
                          name: "Short",
                          value: economicData.cotData.quoteShortPercent,
                          fill: "#C0392B",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={55}
                      dataKey="value"
                      stroke="none"
                      labelLine={true}
                      label={({ name, value, x, y }) => (
                        <text
                          x={x}
                          y={y}
                          fill={name === "Long" ? "#1E8449" : "#C0392B"}
                          textAnchor={name === "Long" ? "start" : "end"}
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {`${name}: ${value.toFixed(1)}%`}
                        </text>
                      )}
                    />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

            {/* Retail Sentiment */}
           <div style={styles.card}>
             <div style={styles.sectionHeader}>Retail Sentiment</div>
             <div style={{ overflowX: "auto" }}>
               <table style={styles.economicTable}>
                 <thead>
                   <tr style={styles.tableHeaderRow}>
                     <th style={styles.tableHeader}>Retail Long %</th>
                     <th style={styles.tableHeader}>Retail Short %</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td colSpan={2} style={{ padding: "10px" }}>
                       <div
                        style={{
                          display: "flex",
                          width: "100%",
                          height: "30px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          border: "1px solid #CBD5E0", // optional border
                        }}
                      >
                        <div
                          style={{
                            width: `${economicData.retailPosition.longPercent}%`,
                            backgroundColor: "#1E8449",
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          }}
                        >
                          {economicData.retailPosition.longPercent > 5 &&
                            `${economicData.retailPosition.longPercent}%`}
                        </div>
                        <div
                          style={{
                            width: `${economicData.retailPosition.shortPercent}%`,
                            backgroundColor: "#C0392B",
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          }}
                        >
                          {economicData.retailPosition.shortPercent > 5 &&
                            `${economicData.retailPosition.shortPercent}%`}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          {/* Interest Rate */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Interest Rate</div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.economicTable}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Actual</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.interestRate.baseChange > 0 ? "+" : ""}
                        {economicData.interestRate.baseChange}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>-</div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.interestRate.baseChange > 0 ? "+" : ""}
                        {economicData.interestRate.baseChange}%
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.interestRate.quoteChange}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>-</div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.interestRate.quoteChange}%
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Core Inflation */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Core Inflation</div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.economicTable}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Actual</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.inflation.baseCPI}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.inflation.baseForecast}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.inflation.baseCPI >
                        economicData.inflation.baseForecast
                          ? "+"
                          : ""}
                        {(
                          economicData.inflation.baseCPI -
                          economicData.inflation.baseForecast
                        ).toFixed(1)}
                        %
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.inflation.quoteCPI}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.inflation.quoteForecast}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.inflation.quoteCPI ===
                        economicData.inflation.quoteForecast
                          ? "0.0"
                          : (economicData.inflation.quoteCPI -
                              economicData.inflation.quoteForecast >
                            0
                              ? "+"
                              : "") +
                            (
                              economicData.inflation.quoteCPI -
                              economicData.inflation.quoteForecast
                            ).toFixed(1)}
                        %
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Labor Market Data - Combined Table */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>LABOR MARKET DATA</div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.economicTable}>
                {/* NFP Section - Only show if USD is present */}
                {hasUSD(economicData) && (
                  <>
                    <thead>
                      <tr style={styles.sectionTitleRow}>
                        <th style={styles.sectionTitleCell} colSpan="4">
                          NFP (USA)
                        </th>
                      </tr>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Actual</th>
                        <th style={styles.tableHeader}>Forecast</th>
                        <th style={styles.tableHeader}>Change</th>
                        <th style={styles.tableHeader}>-</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={styles.tableRow}>
                        <td style={styles.tableCellCenter}>
                          <div style={styles.dataValue}>
                            {economicData.nfp.actual.toLocaleString()}
                          </div>
                        </td>
                        <td style={styles.tableCellCenter}>
                          <div style={styles.dataValue}>
                            {economicData.nfp.forecast.toLocaleString()}
                          </div>
                        </td>
                        <td style={styles.tableCellCenter}>
                          <div style={styles.dataValue}>
                            {economicData.nfp.change}%
                          </div>
                        </td>
                        <td style={styles.tableCellCenter}>
                          <div style={styles.dataValue}>-</div>
                        </td>
                      </tr>
                    </tbody>
                  </>
                )}

                {/* Employment Change Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="4">
                      Employment Change
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Emp. Change</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.employment.baseChange.toLocaleString()}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.employment.baseForecast.toLocaleString()}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.employment.baseResult || "N/A"}
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.employment.quoteChange.toLocaleString()}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.employment.quoteForecast.toLocaleString()}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.employment.quoteResult || "N/A"}
                      </div>
                    </td>
                  </tr>
                </tbody>

                {/* Unemployment Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="4">
                      Unemployment
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Unemployment</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.unemployment.baseRate}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.unemployment.baseForecast}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.unemployment.baseResult || "N/A"}
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.unemployment.quoteRate}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.unemployment.quoteForecast}%
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.unemployment.quoteResult || "N/A"}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Economic Growth Data - Combined Table */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>ECONOMIC GROWTH DATA</div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.economicTable}>
                {/* GDP Growth Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="4">
                      GDP Growth
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Actual</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.gdp.baseActual || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.gdp.baseForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.gdp.baseResult}
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.gdp.quoteActual || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.gdp.quoteForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.gdp.quoteResult}
                      </div>
                    </td>
                  </tr>
                </tbody>

                {/* Manufacturing PMI Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="4">
                      Manufacturing PMI
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Actual</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.mpmi.baseValue || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.mpmi.baseForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.mpmi.baseResult}
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.mpmi.quoteValue || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.mpmi.quoteForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.mpmi.quoteResult}
                      </div>
                    </td>
                  </tr>
                </tbody>

                {/* Services PMI Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="4">
                      Services PMI
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Actual</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.spmi.baseValue || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.spmi.baseForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.spmi.baseResult}
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.spmi.quoteValue || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.spmi.quoteForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.spmi.quoteResult}
                      </div>
                    </td>
                  </tr>
                </tbody>

                {/* Retail Sales Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="4">
                      Retail Sales
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Currency</th>
                    <th style={styles.tableHeader}>Actual</th>
                    <th style={styles.tableHeader}>Forecast</th>
                    <th style={styles.tableHeader}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.baseAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.retail.baseActual || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.retail.baseForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.retail.baseResult}
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.tableCellLabel}>
                        {assetPair.quoteAsset}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.retail.quoteActual || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.retail.quoteForecast || "N/A"}
                      </div>
                    </td>
                    <td style={styles.tableCellCenter}>
                      <div style={styles.dataValue}>
                        {economicData.retail.quoteResult}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section with Three Charts */}
      <div style={styles.bottomGrid}>
        {/* 8ConEdge AI Insight - Enhanced with AI Integration */}
        {renderAiInsightCard()}

        {/* Score Distribution */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>Score Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={createScoreDistributionData()}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {createScoreDistributionData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Strength Radar */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>Strength Radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={createRadarData()}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="indicator"
                tick={{ fontSize: 10, fill: "#4a5568" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tickCount={6}
                tick={{ fontSize: 8, fill: "#718096" }}
              />
              <Radar
                name={assetPair.baseAsset}
                dataKey="Base_Currency"
                stroke="#2B6CB0"
                fill="#2B6CB0"
                fillOpacity={0.5}
              />
              <Radar
                name={assetPair.quoteAsset}
                dataKey="Quote_Currency"
                stroke="#E53E3E"
                fill="#E53E3E"
                fillOpacity={0.5}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>


  );
};

export default CurrencyProfile;
            