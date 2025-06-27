import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const CurrencyProfile = ({ assetPairCode: propAssetPairCode }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { assetPairCode: urlAssetPairCode } = useParams();
  const [nfpValues, setNFPValue] = useState({
    actual: 0,
    forecast: 0,
    change: 0,
  });
  // AI Integration State
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Use URL parameter if available, otherwise use prop
  const assetPairCode = urlAssetPairCode || propAssetPairCode;

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

      const url = `http://${BASE_URL}:3000/api/currency-profile/${assetPairCode}`;
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
      const response = await fetch(
        `http://${BASE_URL}:5000/api/ai-insight/${assetPairCode}`
      );
      const result = await response.json();

      if (result.success) {
        setAiInsight(result.data);
      } else {
        setAiError(result.error || "Failed to fetch AI insights");
      }
    } catch (error) {
      console.error("AI Insight fetch error:", error);
      setAiError("Unable to connect to AI service");
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
  const convertScoreToPercentage = (score) => {
    // Convert from -19 to +19 range to 1-100 range
    const minScore = -19;
    const maxScore = 19;
    const minPercentage = 1;
    const maxPercentage = 100;

    // Linear interpolation formula
    const percentage =
      ((score - minScore) / (maxScore - minScore)) *
        (maxPercentage - minPercentage) +
      minPercentage;

    return Math.round(percentage);
  };
  const getNFPdata = async () => {
    if (profileData) {
      return {
        nfp: await extractNFPData(),
      };
    }
    return {
      nfp: { actual: 0, forecast: 0, change: 0 },
    };
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

  const extractNFPData = async () => {
    const { quoteAsset, baseAsset } = profileData.assetPair;
    let assetCode = null;

    if (quoteAsset === "USD") assetCode = "USD";
    else if (baseAsset === "USD") assetCode = "USD";

    if (!assetCode) {
      return { actual: 0, forecast: 0, change: 0 };
    }

    try {
      const response = await fetch(
        `http://${BASE_URL}:3000/api/economic-data/nfp`
      );
      const result = await response.json();

      const nfpData = result?.data?.[0] || {};
      setNFPValue(nfpData);

      console.log("NFP Data", nfpValues);
      console.log("Actual", nfpData.actual_nfp);
      console.log("Forecast", nfpData.forecast);
      console.log("Change", nfpData.net_change_percent);
      return {
        actual: nfpData.actual_nfp || 0,
        forecast: nfpData.forecast || 0,
        change: nfpData.net_change_percent || 0,
      };
    } catch (err) {
      console.error("❌ Failed to fetch NFP data", err);
      return { actual: 0, forecast: 0, change: 0 };
    }
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
    if (!interestIndicator)
      return {
        baseChange: 0,
        quoteChange: 0,
        baseActual: 0, // Add this
        quoteActual: 0, // Add this
      };

    return {
      baseChange: interestIndicator?.baseData?.["Change in Interest"] || 0,
      quoteChange: interestIndicator?.quoteData?.["Change in Interest"] || 0,
      baseActual: interestIndicator?.baseData?.["Interest Rate"] || 0, // Add this
      quoteActual: interestIndicator?.quoteData?.["Interest Rate"] || 0, // Add this
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
  // AI Enhanced Insight Card
  const renderAiInsightCard = () => {
    return (
      <div style={styles.insightCard}>
        <div style={styles.aiSectionHeader}>8ConEdge AI Insight</div>

        {aiLoading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={styles.spinner}></div>
            <div style={{ marginTop: "10px", fontSize: "11px", color: "#666" }}>
              Analyzing market data...
            </div>
          </div>
        )}

        {aiError && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "11px",
              textAlign: "center",
              padding: "15px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>⚠️ AI Service Unavailable</div>
            <div>{aiError}</div>
            <button
              onClick={fetchAiInsight}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                fontSize: "10px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {aiInsight && !aiLoading && (
          <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
            {/* Executive Summary */}
            {aiInsight.summary?.executive_summary && (
              <div
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "4px",
                  border: "1px solid #16a34a",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#15803d",
                    marginBottom: "4px",
                  }}
                >
                  📋 Executive Summary
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#166534",
                    whiteSpace: "pre-line",
                  }}
                >
                  {aiInsight.summary.executive_summary}
                </div>
              </div>
            )}

            {/* AI Recommendation */}
            <div
              style={{
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "#f0f9ff",
                borderRadius: "4px",
                border: "1px solid #0ea5e9",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: "#0c4a6e",
                  marginBottom: "4px",
                }}
              >
                🤖 AI Recommendation
              </div>
              <div style={{ color: "#0369a1" }}>{aiInsight.recommendation}</div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  marginTop: "2px",
                }}
              >
                Confidence: {aiInsight.confidence} | Position Size:{" "}
                {aiInsight.position_size || "Standard"} |{" "}
                {aiInsight.analysis_date}
              </div>
            </div>

            {/* Currency Strength */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#1e293b",
                }}
              >
                💪 Currency Strength
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "black" }}>
                  {aiInsight.base_currency.code}:{" "}
                  {convertScoreToPercentage(aiInsight.base_currency.score)}/100
                </span>
                <span
                  style={{
                    color: getBiasColor(aiInsight.base_currency.bias),
                    fontWeight: "500",
                  }}
                >
                  {aiInsight.base_currency.bias}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "black" }}>
                  {aiInsight.quote_currency.code}:{" "}
                  {convertScoreToPercentage(aiInsight.quote_currency.score)}/100
                </span>
                <span
                  style={{
                    color: getBiasColor(aiInsight.quote_currency.bias),
                    fontWeight: "500",
                  }}
                >
                  {aiInsight.quote_currency.bias}
                </span>
              </div>
              {aiInsight.total_score && (
                <div
                  style={{
                    marginTop: "4px",
                    padding: "4px 8px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "3px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>
                    Total Score:{" "}
                    {convertScoreToPercentage(aiInsight.total_score)}
                  </span>
                </div>
              )}
            </div>

            {/* Key Drivers */}
            {aiInsight.summary?.key_drivers &&
              aiInsight.summary.key_drivers.length > 0 && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "8px",
                    backgroundColor: "#fefce8",
                    borderRadius: "4px",
                    border: "1px solid #ca8a04",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#a16207",
                      marginBottom: "4px",
                    }}
                  >
                    🎯 Key Drivers
                  </div>
                  {aiInsight.summary.key_drivers
                    .slice(0, 3)
                    .map((driver, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: "10px",
                          marginBottom: "2px",
                          color: "#92400e",
                        }}
                      >
                        {driver}
                      </div>
                    ))}
                </div>
              )}

            {/* Market Insights */}
            {aiInsight.insights && aiInsight.insights.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#1e293b",
                  }}
                >
                  🧠 Market Insights
                </div>
                {aiInsight.insights.slice(0, 3).map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "3px",
                      paddingLeft: "8px",
                      color: "#475569",
                    }}
                  >
                    • {insight}
                  </div>
                ))}
              </div>
            )}

            {/* Risk Factors */}
            {aiInsight.summary?.risk_factors &&
              aiInsight.summary.risk_factors.length > 0 && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "8px",
                    backgroundColor: "#fef2f2",
                    borderRadius: "4px",
                    border: "1px solid #dc2626",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#dc2626",
                      marginBottom: "4px",
                    }}
                  >
                    ⚠️ Bearish Factors
                  </div>
                  {aiInsight.summary.risk_factors.map((risk, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "10px",
                        marginBottom: "2px",
                        color: "#991b1b",
                      }}
                    >
                      {risk}
                    </div>
                  ))}
                </div>
              )}

            {/* Individual Scores Breakdown */}
            {aiInsight.individual_scores && (
              <div
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "4px",
                  border: "1px solid #64748b",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#334155",
                    marginBottom: "4px",
                  }}
                >
                  📊 Score Breakdown
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px",
                    fontSize: "9px",
                    color: "black",
                  }}
                >
                  {Object.entries(aiInsight.individual_scores).map(
                    ([metric, score]) => (
                      <div
                        key={metric}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "2px 4px",
                          backgroundColor: "white",
                          borderRadius: "2px",
                        }}
                      >
                        <span>{metric.replace("_", " ")}</span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              score > 0
                                ? "#16a34a"
                                : score < 0
                                ? "#dc2626"
                                : "#64748b",
                          }}
                        >
                          {score > 0 ? "+" : ""}
                          {score}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!aiInsight && !aiLoading && !aiError && (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "11px",
              padding: "20px",
            }}
          >
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
      padding: "20px",
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
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "center",
      margin: "0 0 -30px 0",
      color: "#1a202c",
      letterSpacing: "1px",
    },

    mainGrid: {
      display: "grid",
      gridTemplateColumns: "220px 1fr 1fr", // L | C | R
      gridTemplateRows: "auto auto", // Row 1: L C R, Row 2: B spans all
      gap: "10px",
      maxWidth: "1400px",
      margin: "0 auto",
      alignItems: "start",
    },

    leftColumn: {
      gridColumn: "1", // L position
      gridRow: "1",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    centerColumn: {
      gridColumn: "2", // C position
      gridRow: "1",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    rightColumn: {
      gridColumn: "3", // R position
      gridRow: "1",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    // Bottom section (B) spans all three columns
    bottomGrid: {
      gridColumn: "1 / -1", // B spans L + C + R
      gridRow: "2",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      marginTop: "6px",
    },

    card: {
      backgroundColor: "white",
      marginTop: "5px",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
      height: "fit-content",
      margin: "0", // Remove any default margins
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
      transform: "translateX(.5rem)",
      width: "100%", // if inside a flex item
      maxWidth: "calc(100% * 5 / 3)", // replace totalColumns with actual number
    },

    aiSectionHeader: {
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
      width: "12rem",
      transform: "translateX(.7rem)",
    },

    biasCard: {
      textAlign: "center",
      padding: "4px",
      height: "13rem",
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
      gap: "8px", // Reduced gap
      marginBottom: "8px", // Reduced margin
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
      padding: "6px", // Reduced padding
      marginBottom: "6px", // Reduced margin
      border: "1px solid #BEE3F8",
    },

    dataHeader: {
      backgroundColor: "#5DADE2",
      color: "white",
      padding: "3px 5px", // Reduced padding
      borderRadius: "3px",
      fontSize: "9px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "4px", // Reduced margin
      textTransform: "uppercase",
    },

    dataValue: {
      color: "#4a5568",
      fontWeight: "500",
      fontSize: "9px",
    },

    insightCard: {
      backgroundColor: "white",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      border: "1px  #2d3748",
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

  // Add this Speedometer component at the top of your file
  const Speedometer = ({ score, bias, getBiasColor }) => {
    // Convert score to angle (score range: -19 to +19, angle range: -90 to +90 degrees)
    const getAngle = (score) => {
      const clampedScore = Math.max(-19, Math.min(19, score));
      return (clampedScore / 19) * 90; // Maps -19 to -90°, +19 to +90°
    };

    const angle = getAngle(score);

    // Calculate needle position - COMPACT DIMENSIONS
    const centerX = 80;
    const centerY = 80;
    const needleLength = 55;
    const needleX = centerX + needleLength * Math.sin((angle * Math.PI) / 180);
    const needleY = centerY - needleLength * Math.cos((angle * Math.PI) / 180);

    // Color zones using getBiasColor function
    const zones = [
      {
        start: -90,
        end: -54,
        color: getBiasColor("Very Bearish"),
        label: "Very Bearish",
      },
      {
        start: -54,
        end: -18,
        color: getBiasColor("Bearish"),
        label: "Bearish",
      },
      { start: -18, end: 18, color: getBiasColor("Neutral"), label: "Neutral" },
      { start: 18, end: 54, color: getBiasColor("Bullish"), label: "Bullish" },
      {
        start: 54,
        end: 90,
        color: getBiasColor("Very Bullish"),
        label: "Very Bullish",
      },
    ];

    // Create SVG path for each zone - COMPACT RADII
    const createArcPath = (startAngle, endAngle, innerRadius, outerRadius) => {
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + innerRadius * Math.sin(startAngleRad);
      const y1 = centerY - innerRadius * Math.cos(startAngleRad);
      const x2 = centerX + outerRadius * Math.sin(startAngleRad);
      const y2 = centerY - outerRadius * Math.cos(startAngleRad);

      const x3 = centerX + outerRadius * Math.sin(endAngleRad);
      const y3 = centerY - outerRadius * Math.cos(endAngleRad);
      const x4 = centerX + innerRadius * Math.sin(endAngleRad);
      const y4 = centerY - innerRadius * Math.cos(endAngleRad);

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <svg width="160" height="100" style={{ overflow: "visible" }}>
          {/* Background arc - COMPACT */}
          <path
            d={createArcPath(-90, 90, 40, 65)}
            fill="#f1f5f9"
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Colored zones - COMPACT */}
          {zones.map((zone, index) => (
            <path
              key={index}
              d={createArcPath(zone.start, zone.end, 40, 65)}
              fill={zone.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}

          {/* Scale marks - COMPACT */}
          {[-19, -10, 0, 10, 19].map((value) => {
            const markAngle = (value / 19) * 90;
            const markX1 = centerX + 60 * Math.sin((markAngle * Math.PI) / 180);
            const markY1 = centerY - 60 * Math.cos((markAngle * Math.PI) / 180);
            const markX2 = centerX + 70 * Math.sin((markAngle * Math.PI) / 180);
            const markY2 = centerY - 70 * Math.cos((markAngle * Math.PI) / 180);

            return (
              <g key={value}>
                <line
                  x1={markX1}
                  y1={markY1}
                  x2={markX2}
                  y2={markY2}
                  stroke="#1a202c"
                  strokeWidth="1.5"
                />
                <text
                  x={centerX + 75 * Math.sin((markAngle * Math.PI) / 180)}
                  y={centerY - 75 * Math.cos((markAngle * Math.PI) / 180) + 3}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#4a5568"
                  fontWeight="600"
                >
                  {value > 0 ? `+${value}` : value}
                </text>
              </g>
            );
          })}

          {/* Center circle - COMPACT */}
          <circle
            cx={centerX}
            cy={centerY}
            r="5"
            fill="#2d3748"
            stroke="white"
            strokeWidth="1"
          />

          {/* Needle - COMPACT */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#2d3748"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Needle tip - COMPACT */}
          <circle cx={needleX} cy={needleY} r="2.5" fill="#2d3748" />
        </svg>

        {/* Current reading - COMPACT TEXT */}
        <div
          style={{
            textAlign: "center",
            marginTop: "5px",
            fontSize: "10px",
            color: "#4a5568",
          }}
        >
          <div style={{ fontWeight: "600", fontSize: "11px" }}>
            Score: {score}
          </div>
          <div style={{ color: "#718096", fontSize: "9px" }}>Market Bias</div>
        </div>
      </div>
    );
  };

  const metricsData = createMetricsData();
  const totalScore =
    profileData?.totalScore ||
    metricsData.reduce((sum, item) => sum + item.score, 0);
  const bias =
    profileData?.bias ||
    getScoreLabel(Math.round(totalScore / metricsData.length));
  const economicData = getEconomicData();

  const nfpData = getNFPdata();
  console.log("BASIC", nfpData);
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
              {/* Asset Pair Title */}

              {/* Asset Pair Title */}

              {/* Speed Meter */}
              <Speedometer
                score={totalScore}
                bias={bias}
                getBiasColor={getBiasColor}
              />

              <div style={{ paddingBottom: "1.5rem" }}>
                <h1 style={styles.pairTitle}>
                  {assetPair.baseAsset}
                  {assetPair.quoteAsset}
                </h1>
              </div>
              {/* Bias Label */}
              <div style={{ ...styles.biasLabel, color: getBiasColor(bias) }}>
                {bias}
              </div>

              {/* Score Text */}
              {/* <div style={styles.biasValue}>Score {totalScore}</div> */}
            </div>
          </div>

          {/* 8ConEdge AI Insight - Enhanced with AI Integration */}
          {renderAiInsightCard()}
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
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Actual
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Change
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const interestScore = calculateInterestRateScore(
                      economicData.interestRate.baseChange,
                      economicData.interestRate.quoteChange
                    );
                    return (
                      <>
                        <tr style={styles.tableRow}>
                          <td style={styles.tableCell}>
                            <div style={styles.tableCellLabel}>
                              {assetPair.baseAsset}
                            </div>
                          </td>
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {economicData.interestRate.baseActual}%{" "}
                            </div>
                          </td>
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {economicData.interestRate.baseChange > 0
                                ? "+"
                                : ""}
                              {economicData.interestRate.baseChange}%
                            </div>
                          </td>
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {interestScore.baseScore > 0
                                ? `+${interestScore.baseScore}`
                                : interestScore.baseScore}
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
                              {economicData.interestRate.quoteActual}%{" "}
                            </div>
                          </td>
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {economicData.interestRate.quoteChange}%
                            </div>
                          </td>
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {interestScore.quoteScore > 0
                                ? `+${interestScore.quoteScore}`
                                : interestScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
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
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Actual
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Change
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const inflationScore = calculateInflationScore(
                      economicData.inflation.baseCPI,
                      economicData.inflation.baseForecast,
                      economicData.inflation.quoteCPI,
                      economicData.inflation.quoteForecast
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {inflationScore.baseScore > 0
                                ? `+${inflationScore.baseScore}`
                                : inflationScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {inflationScore.quoteScore > 0
                                ? `+${inflationScore.quoteScore}`
                                : inflationScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
          {/* Score Distribution */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Score Distribution</div>
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={createScoreDistributionData()}
                  cx="48%"
                  cy="50%"
                  outerRadius={90}
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
                        <th style={styles.sectionTitleCell} colSpan="5">
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
                            {nfpValues.actual_nfp}
                          </div>
                        </td>
                        <td style={styles.tableCellCenter}>
                          <div style={styles.dataValue}>
                            {nfpValues.forecast}
                          </div>
                        </td>
                        <td style={styles.tableCellCenter}>
                          <div style={styles.dataValue}>
                            {nfpValues.net_change_percent}
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
                    <th style={styles.sectionTitleCell} colSpan="5">
                      Employment Change
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Emp. Change
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Result
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const empScore = calculateEmploymentScore(
                      economicData.employment.baseChange,
                      economicData.employment.baseForecast,
                      economicData.employment.quoteChange,
                      economicData.employment.quoteForecast
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {empScore.baseScore > 0
                                ? `+${empScore.baseScore}`
                                : empScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {empScore.quoteScore > 0
                                ? `+${empScore.quoteScore}`
                                : empScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>

                {/* Unemployment Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="5">
                      Unemployment Rate
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Unemployment
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Result
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const unempScore = calculateUnemploymentScore(
                      economicData.unemployment.baseRate,
                      economicData.unemployment.baseForecast,
                      economicData.unemployment.quoteRate,
                      economicData.unemployment.quoteForecast
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {unempScore.baseScore > 0
                                ? `+${unempScore.baseScore}`
                                : unempScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {unempScore.quoteScore > 0
                                ? `+${unempScore.quoteScore}`
                                : unempScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
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
                    <th style={styles.sectionTitleCell} colSpan="5">
                      GDP Growth
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Actual
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Result
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const gdpScore = calculateGrowthScore(
                      economicData.gdp.baseResult,
                      economicData.gdp.quoteResult
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {gdpScore.baseScore > 0
                                ? `+${gdpScore.baseScore}`
                                : gdpScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {gdpScore.quoteScore > 0
                                ? `+${gdpScore.quoteScore}`
                                : gdpScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>

                {/* Manufacturing PMI Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="5">
                      Manufacturing PMI
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Actual
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Result
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const mpmiScore = calculateGrowthScore(
                      economicData.mpmi.baseResult,
                      economicData.mpmi.quoteResult
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {mpmiScore.baseScore > 0
                                ? `+${mpmiScore.baseScore}`
                                : mpmiScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {mpmiScore.quoteScore > 0
                                ? `+${mpmiScore.quoteScore}`
                                : mpmiScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>

                {/* Services PMI Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="5">
                      Services PMI
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Actual
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Result
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const spmiScore = calculateGrowthScore(
                      economicData.spmi.baseResult,
                      economicData.spmi.quoteResult
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {spmiScore.baseScore > 0
                                ? `+${spmiScore.baseScore}`
                                : spmiScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {spmiScore.quoteScore > 0
                                ? `+${spmiScore.quoteScore}`
                                : spmiScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>

                {/* Retail Sales Section */}
                <thead>
                  <tr style={styles.sectionTitleRow}>
                    <th style={styles.sectionTitleCell} colSpan="5">
                      Retail Sales
                    </th>
                  </tr>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Currency
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Actual
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Forecast
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Result
                    </th>
                    <th style={{ ...styles.tableHeader, fontWeight: "bold" }}>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const retailScore = calculateGrowthScore(
                      economicData.retail.baseResult,
                      economicData.retail.quoteResult
                    );
                    return (
                      <>
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {retailScore.baseScore > 0
                                ? `+${retailScore.baseScore}`
                                : retailScore.baseScore}
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
                          <td style={styles.tableCellCenter}>
                            <div style={styles.dataValue}>
                              {retailScore.quoteScore > 0
                                ? `+${retailScore.quoteScore}`
                                : retailScore.quoteScore}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
          {/* Strength Radar */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Strength Radar</div>
            <ResponsiveContainer width="100%" height={350}>
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
      {/* Bottom Section with Three Charts */}
      <div style={styles.bottomGrid}>
        {/* Trading Reminders */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #f59e0b",
          }}
        >
          <div
            style={{
              fontWeight: "600",
              marginBottom: "6px",
              color: "#92400e",
            }}
          >
            ⚠️ Trading Reminders
          </div>
          {aiInsight?.reminders &&
            Array.isArray(aiInsight.reminders) &&
            aiInsight.reminders.slice(0, 4).map((reminder, index) => (
              <div
                key={index}
                style={{
                  fontSize: "10px",
                  marginBottom: "2px",
                  color: "#78350f",
                }}
              >
                • {reminder}
              </div>
            ))}
          <div
            style={{
              fontSize: "9px",
              marginTop: "4px",
              fontStyle: "italic",
              color: "#92400e",
            }}
          >
            This is data analysis only - not financial advice
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyProfile;
