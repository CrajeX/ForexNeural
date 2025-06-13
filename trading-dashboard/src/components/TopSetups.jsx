import React, { useState, useEffect, useCallback } from "react";

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

  // Add click handler for asset pair navigation
  const handleAssetPairClick = (assetPairCode) => {
    if (onAssetPairClick) {
      onAssetPairClick(assetPairCode);
    }
  };

  const fetchAssetPairs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔗 Fetching all asset pairs from database...");

      // Fetch asset pairs
      const response = await fetch("http://localhost:3000/api/asset-pairs");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        console.log(`✅ Loaded ${result.data.length} asset pairs`);

        // Process each asset pair to get economic data
        const assetPairsWithMetrics = await Promise.all(
          result.data.map(async (pair, index) => {
            try {
              const economicData = await fetchEconomicDataForPair(pair);
              const metrics = generateProperMetrics(economicData, index);

              return {
                asset_pair_code: pair.value,
                description:
                  pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
                baseAsset: pair.baseAsset,
                quoteAsset: pair.quoteAsset,
                created_at: pair.created_at,
                updated_at: pair.updated_at,
                ...metrics,
              };
            } catch (pairError) {
              console.error(
                `❌ Error processing pair ${pair.value}:`,
                pairError
              );
              // Return pair with default metrics if data fetch fails
              const fallbackMetrics = generateProperMetrics(null, index);
              return {
                asset_pair_code: pair.value,
                description:
                  pair.description || `${pair.baseAsset} / ${pair.quoteAsset}`,
                baseAsset: pair.baseAsset,
                quoteAsset: pair.quoteAsset,
                created_at: pair.created_at,
                updated_at: pair.updated_at,
                ...fallbackMetrics,
              };
            }
          })
        );

        console.log(
          `✅ Processed ${assetPairsWithMetrics.length} asset pairs with economic data`
        );
        setRawAssetPairs(assetPairsWithMetrics);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Error fetching asset pairs:", error);
      setError(error.message);
      setAssetPairs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sorted = [...rawAssetPairs].sort((a, b) => {
      const direction = isAscending ? 1 : -1;
      return direction * (a[sortedBy] - b[sortedBy]);
    });

    setAssetPairs(sorted);
  }, [rawAssetPairs, isAscending, sortedBy]);

  // Fetch economic data for a specific asset pair
  const fetchEconomicDataForPair = async (pair) => {
    const baseAsset = pair.baseAsset;
    const quoteAsset = pair.quoteAsset;
    const assetPairCode = pair.value;

    try {
      // Fetch all economic data in parallel with proper error handling
      const fetchWithFallback = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) return null;
          const data = await response.json();
          return data.success && data.data && data.data.length > 0
            ? data.data[0]
            : null;
        } catch (error) {
          console.warn(`Failed to fetch ${url}:`, error.message);
          return null;
        }
      };

      const [
        cotBase,
        cotQuote,
        gdpBase,
        gdpQuote,
        mpmiBase,
        mpmiQuote,
        spmiBase,
        spmiQuote,
        retailBase,
        retailQuote,
        unemploymentBase,
        unemploymentQuote,
        employmentBase,
        employmentQuote,
        inflationBase,
        inflationQuote,
        interestBase,
        interestQuote,
        retailSentiment,
      ] = await Promise.all([
        // COT Data
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/cot/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/cot/${quoteAsset}?limit=1`
        ),

        // GDP Data
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/gdp/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/gdp/${quoteAsset}?limit=1`
        ),

        // Manufacturing PMI
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/mpmi/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/mpmi/${quoteAsset}?limit=1`
        ),

        // Services PMI
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/spmi/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/spmi/${quoteAsset}?limit=1`
        ),

        // Retail Sales
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/retail/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/retail/${quoteAsset}?limit=1`
        ),

        // Unemployment Rate
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/unemployment/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/unemployment/${quoteAsset}?limit=1`
        ),

        // Employment Change
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/employment/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/employment/${quoteAsset}?limit=1`
        ),

        // Core Inflation
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/inflation/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/inflation/${quoteAsset}?limit=1`
        ),

        // Interest Rate
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/interest/${baseAsset}?limit=1`
        ),
        fetchWithFallback(
          `http://localhost:3000/api/economic-data/interest/${quoteAsset}?limit=1`
        ),

        // Retail Sentiment
        fetchWithFallback(
          `http://localhost:3000/api/retail-sentiment/${assetPairCode}?limit=1`
        ),
      ]);

      // Structure the data with proper fallbacks
      return {
        baseAsset,
        quoteAsset,
        // COT Data
        cotData: {
          baseLongPercent: cotBase?.long_percent,
          baseShortPercent: cotBase?.short_percent,
          baseNetChangePercent: cotBase?.net_change_percent,
          quoteLongPercent: cotQuote?.long_percent,
          quoteShortPercent: cotQuote?.short_percent,
          quoteNetChangePercent: cotQuote?.net_change_percent,
        },
        // Retail Position Data
        retailPosition: {
          longPercent: retailSentiment?.retail_long,
          shortPercent: retailSentiment?.retail_short,
        },
        // Employment Data
        employment: {
          baseChange: employmentBase?.employment_change,
          baseForecast: employmentBase?.forecast,
          quoteChange: employmentQuote?.employment_change,
          quoteForecast: employmentQuote?.forecast,
        },
        // Unemployment Data
        unemployment: {
          baseRate: unemploymentBase?.unemployment_rate,
          baseForecast: unemploymentBase?.forecast,
          quoteRate: unemploymentQuote?.unemployment_rate,
          quoteForecast: unemploymentQuote?.forecast,
        },
        // Economic Growth Data
        gdp: {
          baseResult: gdpBase?.result,
          quoteResult: gdpQuote?.result,
        },
        mpmi: {
          baseResult: mpmiBase?.result,
          quoteResult: mpmiQuote?.result,
        },
        spmi: {
          baseResult: spmiBase?.result,
          quoteResult: spmiQuote?.result,
        },
        retail: {
          baseResult: retailBase?.result,
          quoteResult: retailQuote?.result,
        },
        // Inflation Data
        inflation: {
          baseCPI: inflationBase?.core_inflation,
          baseForecast: inflationBase?.forecast,
          quoteCPI: inflationQuote?.core_inflation,
          quoteForecast: inflationQuote?.forecast,
        },
        // Interest Rate Data
        interestRate: {
          baseChange: interestBase?.change_in_interest,
          quoteChange: interestQuote?.change_in_interest,
        },
      };
    } catch (error) {
      console.error(
        `❌ Error fetching economic data for pair ${assetPairCode}:`,
        error
      );
      return null;
    }
  };

  // Initialize component
  useEffect(() => {
    fetchAssetPairs();
  }, [fetchAssetPairs]);

  // Function to calculate scores based on data dictionary rules
  const calculateScores = (data) => {
    if (!data) {
      // Return neutral scores if no data
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

  // Generate proper trading metrics based on live data
  const generateProperMetrics = (economicData, index) => {
    const scores = calculateScores(economicData);

    // Calculate total score
    const totalScore = Object.values(scores).reduce(
      (sum, score) => sum + score,
      0
    );

    // Determine output based on total score
    let output;
    if (totalScore >= 12) output = "Very Bullish";
    else if (totalScore >= 5) output = "Bullish";
    else if (totalScore >= -4) output = "Neutral";
    else if (totalScore >= -5) output = "Bearish";
    else output = "Very Bearish";

    return {
      output,
      totalScore,
      // Individual scores for display (clamped to -2 to +2)
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
      // Raw economic data for debugging/display if needed
      economicData,
    };
  };

  const getScoreColor = (score, opacity = 0.8) => {
    if (score >= 12) return `rgba(30, 132, 73, 0.6 )`; // Very Bullish
    if (score >= 5) return `rgba(88, 214, 141, 0.6 )`; // Bullish
    if (score >= -4) return `rgba(189, 189, 189, 0.6 )`; // Neutral
    if (score >= -11) return `rgba(245, 176, 65, 0.6 )`; // Bearish
    return `rgba(192, 57, 43, 0.6 )`; // Very Bearish
  };

  const getMetricColor = (value) => {
    if (value === -2) return "rgba(192, 57, 43, 0.6 )";
    if (value === -1) return "rgba(245, 176, 65, 0.6 )";
    if (value === 0) return "rgba(189, 189, 189, 0.6 )";
    if (value === 1) return "rgba(88, 214, 141, 0.6 )";
    if (value === 2) return "rgba(30, 132, 73, 0.6 )";
  };

  const getOutputStyle = (output) => {
    const baseStyle = { fontWeight: "600" };
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
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
    },
    maxWidth: {
      maxWidth: "90rem",
      margin: "0 auto",
    },
    tableContainer: {
      backgroundColor: "white",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
    },
    tableScroll: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f3f4f6",
      borderBottom: "1px solid #e5e7eb",
    },
    th: {
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: "500",
      color: "#374151",
      fontSize: "14px",
    },
    thCenter: {
      padding: "8px 12px",
      textAlign: "center",
      fontWeight: "500",
      color: "#374151",
      fontSize: "14px",
      width: "8%",
    },
    thAsset: {
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: "500",
      color: "#374151",
      fontSize: "14px",
      width: "15%",
    },
    thOutput: {
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: "500",
      color: "#374151",
      fontSize: "14px",
      width: "12%",
    },
    tr: {
      borderBottom: "1px solid #e5e7eb",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    trEven: {
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    td: {
      padding: "12px",
    },
    tdCenter: {
      padding: "12px",
      textAlign: "center",
    },
    assetCode: {
      fontWeight: "500",
      color: "#2563eb",
    },
    assetDescription: {
      fontSize: "12px",
      color: "#6b7280",
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
      color: "#374151",
      fontSize: "14px",
      fontWeight: "700",
      textAlign: "center",
    },
    legend: {
      color: "black",
      marginTop: "16px",
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "8px",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },
    legendTitle: {
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
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
      border: "2px solid #e5e7eb",
      borderTop: "2px solid #2563eb",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      marginLeft: "8px",
      color: "#4b5563",
    },
    errorContainer: {
      backgroundColor: "#fee2e2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "16px",
      margin: "16px 0",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "14px",
    },
    retryButton: {
      backgroundColor: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "8px 16px",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "8px",
    },
  };

  if (loading && assetPairs.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <span style={styles.loadingText}>
              Loading asset pairs and economic data from database...
            </span>
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
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
            <button style={styles.retryButton} onClick={fetchAssetPairs}>
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
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                width: "300px",
                fontSize: "14px",
              }}
            />
            <select
              value={biasFilter}
              onChange={(e) => setBiasFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
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
              onClick={fetchAssetPairs}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#9ca3af" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
          {/* Right: Timestamp */}
          <div
            style={{ fontSize: "12px", color: "#6b7280", textAlign: "right" }}
          >
            {lastUpdated && (
              <div>Last updated: {lastUpdated.toLocaleString()}</div>
            )}
          </div>
        </div>
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
                    {assetPairs
                      .filter((pair) => {
                        const matchesSearch =
                          pair.asset_pair_code
                            .toLowerCase()
                            .includes(filterText.toLowerCase()) ||
                          pair.description
                            ?.toLowerCase()
                            .includes(filterText.toLowerCase());

                        const matchesBias =
                          biasFilter === "All" || pair.output === biasFilter;

                        return matchesSearch && matchesBias;
                      })
                      .map((pair, index) => (
                        <tr
                          key={pair.asset_pair_code}
                          style={index % 2 === 0 ? styles.tr : styles.trEven}
                          onClick={() => handleAssetPairClick(pair.asset_pair_code)}
                          onMouseOver={(e) => {
                            e.target.closest("tr").style.backgroundColor = "#e5f3ff";
                          }}
                          onMouseOut={(e) => {
                            e.target.closest("tr").style.backgroundColor =
                              index % 2 === 0 ? "white" : "#f9fafb";
                          }}
                        >
                          <td style={styles.td}>
                            <div>
                              <div style={styles.assetDescription}>
                                {pair.description}
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={getOutputStyle(pair.output)}>
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
                                color: "#374151",
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
            </div>
          </>
        )}

        {/* Legend */}
        {!error && assetPairs.length > 0 && (
          <div style={styles.legend}>
            <h3 style={styles.legendTitle}>Scoring Legend:</h3>
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
                Total Score Ranges:
              </h4>
              <div style={styles.legendFlex}>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      backgroundColor: "#1E8449",
                    }}
                  ></span>
                  <span>12 to 19 - Very Bullish</span>
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      backgroundColor: "#58D68D",
                    }}
                  ></span>
                  <span>5 to 11 - Bullish</span>
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      backgroundColor: "#BDBDBD",
                    }}
                  ></span>
                  <span>-4 to 4 - Neutral</span>
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      backgroundColor: "#F5B041",
                    }}
                  ></span>
                  <span>-11 to -5 - Bearish</span>
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      backgroundColor: "#C0392B",
                    }}
                  ></span>
                  <span>-19 to -12 - Very Bearish</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Navigation:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  lineHeight: "1.4",
                }}
              >
                📊 <strong>Click on any asset pair row</strong> to view detailed breakdown and analysis of each economic indicator.
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Scoring Metrics (Live Database Data):
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  lineHeight: "1.4",
                }}
              >
                <strong>COT:</strong> Base positive net change +1, Quote
                positive net change -1
                <br />
                <strong>Retail Position:</strong> Long% {`>`}Short% = -1, otherwise
                +1
                <br />
                <strong>Employment:</strong> Base/Quote beat forecast +1/-1,
                miss forecast -1/+1
                <br />
                <strong>Unemployment:</strong> Base exceeds forecast -1, Quote
                exceeds forecast +1
                <br />
                <strong>Economic Growth (GDP/PMI/Retail):</strong> Base beat +1,
                miss -1; Quote beat -1, miss +1
                <br />
                <strong>Inflation:</strong> Base exceeds forecast +1, Quote
                exceeds forecast -1
                <br />
                <strong>Interest Rate:</strong> Base positive change +1, Quote
                positive change -1
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Data Sources:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
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
                  color: "#374151",
                }}
              >
                API Status:
              </h4>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  lineHeight: "1.4",
                }}
              >
                🔄 Real-time data fetching with fallback handling. If API
                endpoints are unavailable, neutral scores are used to ensure the
                component continues functioning.
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!loading && !error && assetPairs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "#6b7280",
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
    </div>
  );
};

export default TopSetups;