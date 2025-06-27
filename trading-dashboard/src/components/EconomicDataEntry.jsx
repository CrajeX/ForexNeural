
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  Save,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  Percent,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
} from "lucide-react";

// Context for form state management
const FormContext = createContext();

// Custom hooks with improved error handling and retry functionality
const useCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencies = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:3000/api/assets?type=Currency",
        { signal }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch currencies: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Ensure data is an array and handle potential null/undefined values
      const safeData = Array.isArray(data) ? data : [];

      // Remove duplicates based on currency code and filter out invalid entries
      const uniqueAssets = safeData
        .filter((asset) => asset && asset.code && asset.name) // Filter out invalid entries
        .reduce((acc, asset) => {
          // Only add if we haven't seen this currency code before
          if (!acc.find((item) => item.code === asset.code)) {
            acc.push(asset);
          }
          return acc;
        }, []);

      const currencyOptions = uniqueAssets
        .map((asset) => ({
          value: asset.code,
          label: `${asset.name} (${asset.code})`,
        }))
        .sort((a, b) => {
          // Sort with major currencies first
          const majorCurrencies = [
            "USD",
            "EUR",
            "GBP",
            "JPY",
            "AUD",
            "CAD",
            "CHF",
            "NZD",
          ];
          const aIndex = majorCurrencies.indexOf(a.value);
          const bIndex = majorCurrencies.indexOf(b.value);

          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex; // Both are major currencies, sort by order
          } else if (aIndex !== -1) {
            return -1; // a is major, b is not
          } else if (bIndex !== -1) {
            return 1; // b is major, a is not
          } else {
            return a.label.localeCompare(b.label); // Both are not major, sort alphabetically
          }
        });

      setCurrencies(currencyOptions);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error.message);
        console.error("Error fetching currencies:", error);
        setCurrencies([]); // Set empty array on error
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCurrencies(abortController.signal);
    return () => abortController.abort();
  }, [fetchCurrencies]);

  const retry = useCallback(() => {
    const abortController = new AbortController();
    fetchCurrencies(abortController.signal);
  }, [fetchCurrencies]);

  return { currencies, loading, error, retry };
};

const useAssetPairs = () => {
  const [assetPairs, setAssetPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssetPairs = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/asset-pairs", {
        signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch asset pairs: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Better data handling and validation
      const rawData = result.data || result || [];
      const safeData = Array.isArray(rawData) ? rawData : [];

      // Remove duplicates based on asset pair code/value and filter out invalid entries
      const uniquePairs = safeData
        .filter((pair) => pair && (pair.value || pair.code || pair.name)) // Filter out invalid entries
        .reduce((acc, pair) => {
          const pairValue = pair.value || pair.code || pair.name;
          // Only add if we haven't seen this pair value before
          if (
            !acc.find(
              (item) => (item.value || item.code || item.name) === pairValue
            )
          ) {
            acc.push(pair);
          }
          return acc;
        }, []);

      const assetPairOptions = uniquePairs
        .map((pair) => ({
          value: pair.value || pair.code || pair.name,
          label:
            pair.label ||
            pair.name ||
            `${pair.base || ""}/${pair.quote || ""}` ||
            pair.code ||
            pair.value,
        }))
        .sort((a, b) => {
          // Sort with major pairs first
          const majorPairs = [
            "EURUSD",
            "GBPUSD",
            "USDJPY",
            "AUDUSD",
            "USDCAD",
            "USDCHF",
            "NZDUSD",
          ];
          const aIndex = majorPairs.indexOf(a.value);
          const bIndex = majorPairs.indexOf(b.value);

          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex; // Both are major pairs, sort by order
          } else if (aIndex !== -1) {
            return -1; // a is major, b is not
          } else if (bIndex !== -1) {
            return 1; // b is major, a is not
          } else {
            return a.label.localeCompare(b.label); // Both are not major, sort alphabetically
          }
        });

      setAssetPairs(assetPairOptions);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error.message);
        console.error("Error fetching asset pairs:", error);
        setAssetPairs([]); // Set empty array on error
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAssetPairs(abortController.signal);
    return () => abortController.abort();
  }, [fetchAssetPairs]);

  const retry = useCallback(() => {
    const abortController = new AbortController();
    fetchAssetPairs(abortController.signal);
  }, [fetchAssetPairs]);

  return { assetPairs, loading, error, retry };
};

const validateField = (field, value) => {
  const errors = {};

  // Convert value to string and check if it has content
  const stringValue = String(value || "").trim();

  // Only validate if field has a value
  if (stringValue !== "") {
    const numValue = parseFloat(stringValue);

    if (isNaN(numValue)) {
      errors[field] = "Must be a valid number";
    }
  }

  return errors;
};

const validateForm = (formData) => {
  const errors = {};

  // Validate individual fields only if they have values
  Object.entries(formData).forEach(([key, value]) => {
    if (key !== "selectedCurrency" && key !== "selectedAssetPair") {
      const fieldErrors = validateField(key, value);
      Object.assign(errors, fieldErrors);
    }
  });

  return errors;
};

// Utility functions
const sanitizeNumericInput = (value) => {
  return value.replace(/[^0-9.-]/g, "");
};

// Enhanced Error Message Component
const ErrorMessage = ({ message, onRetry, type = "error" }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry && !retrying) {
      setRetrying(true);
      try {
        await onRetry();
      } catch (error) {
        console.error("Retry failed:", error);
      } finally {
        // Add a small delay to show the loading state
        setTimeout(() => setRetrying(false), 500);
      }
    }
  };

  return (
    <div className={`error-banner ${type}`}>
      <AlertCircle size={20} />
      <div className="error-content">
        <span className="error-text">{message}</span>
        {type === "error" && (
          <span className="error-hint">
            Check your internet connection and try again.
          </span>
        )}
      </div>
      {onRetry && (
        <button
          onClick={handleRetry}
          className="retry-button"
          disabled={retrying}
        >
          {retrying ? (
            <>
              <Loader2 size={12} className="spin" />
              Retrying...
            </>
          ) : (
            "Retry"
          )}
        </button>
      )}
    </div>
  );
};

// Enhanced Loading Skeleton Component
const LoadingSkeleton = ({ lines = 3 }) => (
  <div className="loading-skeleton">
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className={`skeleton-line ${i === lines - 1 ? "short" : ""}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

// Fixed SearchableSelect Component
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  loading,
  error,
  onRetry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  // Compute filtered options dynamically instead of storing in state
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options;
    }

    return options.filter((option) => {
      const searchLower = searchTerm.toLowerCase().trim();
      return (
        option.label?.toLowerCase().includes(searchLower) ||
        option.value?.toLowerCase().includes(searchLower)
      );
    });
  }, [options, searchTerm]);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Improved click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" && !isOpen) {
      setIsOpen(true);
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <div className="searchable-select" ref={selectRef}>
      <div
        className={`select-input ${isOpen ? "open" : ""} ${
          loading ? "loading" : ""
        }`}
        onClick={() => !loading && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {loading ? (
          <div className="loading-content">
            <Loader2 size={14} className="spin" />
            <span>Loading...</span>
          </div>
        ) : selectedOption ? (
          <span className="selected-option">{selectedOption.label}</span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </div>

      {isOpen && !loading && (
        <div className="dropdown-menu" role="listbox">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                } else if (e.key === "Enter" && filteredOptions.length === 1) {
                  onChange(filteredOptions[0].value);
                  setIsOpen(false);
                }
              }}
              autoFocus
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm("");
                }}
                type="button"
              >
                ✕
              </button>
            )}
          </div>

          <div className="options-list">
            {filteredOptions.length === 0 ? (
              <div className="no-options">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={`${option.value}-${index}`}
                  className={`option ${
                    option.value === value ? "selected" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="option-label">{option.label}</span>
                  {option.value !== option.label && (
                    <span className="option-value">({option.value})</span>
                  )}
                </div>
              ))
            )}
          </div>

          {searchTerm && filteredOptions.length > 0 && (
            <div className="search-footer">
              {filteredOptions.length} result
              {filteredOptions.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable Components
const FormInput = React.memo(
  ({
    label,
    value,
    onChange,
    error,
    type = "number",
    placeholder = "Enter number",
    disabled = false,
    calculated = false,
    isPercentage = false,
    autoCalculated = false,
  }) => {
    return (
      <div className="form-group">
        <label className="form-label">
          {label}
          {autoCalculated && <span className="auto-calc-badge">Auto</span>}
        </label>
        {calculated ? (
          <div className="calculated-field">{value || "Auto calculated"}</div>
        ) : (
          <input
            type={type}
            step="0.01"
            min="0"
            max={isPercentage ? "100" : undefined}
            value={value}
            onChange={(e) => onChange(sanitizeNumericInput(e.target.value))}
            className={`form-input ${error ? "error" : ""} ${
              autoCalculated ? "auto-calculated" : ""
            }`}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        {error && (
          <div className="error-message">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

// Section Selection Checklist Component
const SectionChecklistComponent = ({
  enabledSections,
  onSectionToggle,
  onSelectAll,
  allSelected,
  anySelected,
}) => {
  const sections = [
    {
      key: "retailSentiment",
      label: "Retail Sentiment Data",
      icon: TrendingUp,
      color: "#2563eb",
    },
    {
      key: "marketSentiments",
      label: "Market Sentiments (COT)",
      icon: BarChart3,
      color: "#2563eb",
    },
    {
      key: "laborMarket",
      label: "Labor Market Data",
      icon: Users,
      color: "#059669",
    },
    {
      key: "economicGrowth",
      label: "Economic Growth Data",
      icon: Building,
      color: "#7c3aed",
    },
    {
      key: "inflation",
      label: "Inflation Data",
      icon: Percent,
      color: "#dc2626",
    },
    {
      key: "interest",
      label: "Interest Data",
      icon: DollarSign,
      color: "#ea580c",
    },
  ];

  return (
    <div className="form-section">
      <div className="section-header">
        <CheckCircle size={20} style={{ color: "#059669" }} />
        <h2>Select Data Sections to Fill</h2>
      </div>

      <div className="checklist-container">
        <div className="select-all-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">
              <strong>Select All Sections</strong>
            </span>
          </label>
        </div>

        <div className="section-divider">
          <div className="divider-line"></div>
          <span className="divider-text">Individual Sections</span>
          <div className="divider-line"></div>
        </div>

        <div className="checklist-grid">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <label key={section.key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={enabledSections[section.key]}
                  onChange={() => onSectionToggle(section.key)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <IconComponent size={16} style={{ color: section.color }} />
                  <span className="checkbox-text">{section.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RetailSentimentSection = () => {
  const { formData, handleInputChange, errors, selectedAssetPair } =
    useContext(FormContext);

  const retailLong = parseFloat(formData.retailLong) || 0;
  const retailShort = parseFloat(formData.retailShort) || 0;
  const total = retailLong + retailShort;

  return (
    <section className="form-section">
      <div className="section-header">
        <TrendingUp size={20} style={{ color: "#2563eb" }} />
        <h2>Retail Sentiment Data</h2>
      </div>

      <div className="form-grid grid-auto-fit">
        <FormInput
          label="Retail Long %"
          value={formData.retailLong}
          onChange={(value) => handleInputChange("retailLong", value)}
          error={errors.retailLong}
          placeholder="Enter long percentage"
          isPercentage={true}
        />
        <FormInput
          label="Retail Short %"
          value={formData.retailShort}
          onChange={(value) => handleInputChange("retailShort", value)}
          error={errors.retailShort}
          placeholder="Enter short percentage"
          isPercentage={true}
        />
      </div>

      {/* Percentage Validation Display */}
      {(formData.retailLong || formData.retailShort) && (
        <div className="percentage-summary">
          <div className="percentage-bar">
            <div
              className="percentage-fill long"
              style={{ width: `${retailLong}%` }}
            >
              {retailLong > 15 && <span>{retailLong.toFixed(1)}%</span>}
            </div>
            <div
              className="percentage-fill short"
              style={{ width: `${retailShort}%` }}
            >
              {retailShort > 15 && <span>{retailShort.toFixed(1)}%</span>}
            </div>
          </div>
          <div className="total-percentage success">
            Total: {total.toFixed(2)}% ✓
          </div>
        </div>
      )}

      <div className="info-note">
        <span className="info-icon">ℹ️</span>
        <span>
          Retail sentiment data will be saved for asset pair:{" "}
          {selectedAssetPair || "None selected"}
        </span>
      </div>
    </section>
  );
};

const MarketSentimentsSection = () => {
  const { formData, handleInputChange, errors } = useContext(FormContext);

  // Calculate COT percentages for the bars
  const cotLong = parseFloat(formData.cotLongContracts) || 0;
  const cotShort = parseFloat(formData.cotShortContracts) || 0;
  const cotTotal = cotLong + cotShort;

  return (
    <section className="form-section">
      <div className="section-header">
        <BarChart3 size={20} style={{ color: "#2563eb" }} />
        <h2>Market Sentiments</h2>
      </div>
      {/* COT Percentage Inputs */}
      <div className="form-grid grid-auto-fit">
        <FormInput
          label="COT Long %"
          value={formData.cotLongContracts}
          onChange={(value) => handleInputChange("cotLongContracts", value)}
          error={errors.cotLongContracts}
          placeholder="Enter long percentage"
          isPercentage={true}
        />
        <FormInput
          label="COT Short %"
          value={formData.cotShortContracts}
          onChange={(value) => handleInputChange("cotShortContracts", value)}
          error={errors.cotShortContracts}
          placeholder="Enter short percentage"
          isPercentage={true}
        />
      </div>

      {/* COT Percentage Validation Display */}
      {(formData.cotLongContracts || formData.cotShortContracts) && (
        <div className="percentage-summary">
          <div className="percentage-bar">
            <div
              className="percentage-fill long"
              style={{ width: `${cotLong}%` }}
            >
              {cotLong > 15 && <span>{cotLong.toFixed(1)}%</span>}
            </div>
            <div
              className="percentage-fill short"
              style={{ width: `${cotShort}%` }}
            >
              {cotShort > 15 && <span>{cotShort.toFixed(1)}%</span>}
            </div>
          </div>
          <div className="total-percentage success">
            Total: {cotTotal.toFixed(2)}% ✓
          </div>
        </div>
      )}
    </section>
  );
};
const LaborMarketSection = () => {
  const { formData, handleInputChange, errors, selectedCurrency } =
    useContext(FormContext);

  return (
    <section className="form-section">
      <div className="section-header">
        <Users size={20} style={{ color: "#059669" }} />
        <h2>Labor Market Data</h2>
      </div>

      {/* Employment Change Row */}
      <div className="form-grid grid-auto-fit row-margin">
        <FormInput
          label="Employee Change"
          value={formData.employeeChange}
          onChange={(value) => handleInputChange("employeeChange", value)}
          error={errors.employeeChange}
          placeholder="Enter employment change"
        />
        <FormInput
          label="Employee Change Forecast"
          value={formData.employeeChangeForecast}
          onChange={(value) =>
            handleInputChange("employeeChangeForecast", value)
          }
          error={errors.employeeChangeForecast}
          placeholder="Enter forecast"
        />
      </div>

      {/* Unemployment Rate Row */}
      <div className="form-grid grid-auto-fit row-margin">
        <FormInput
          label="Unemployment Rate"
          value={formData.unemployment}
          onChange={(value) => handleInputChange("unemployment", value)}
          error={errors.unemployment}
          placeholder="Enter unemployment rate"
        />
        <FormInput
          label="Unemployment Rate Forecast"
          value={formData.unemploymentForecast}
          onChange={(value) => handleInputChange("unemploymentForecast", value)}
          error={errors.unemploymentForecast}
          placeholder="Enter forecast"
        />
      </div>

      {/* NFP Section - Only show when USD is selected */}
      {selectedCurrency === "USD" && (
        <>
          <div className="section-divider">
            <div className="divider-line"></div>
            <span className="divider-text">US Specific Data</span>
            <div className="divider-line"></div>
          </div>

          <div className="form-grid grid-auto-fit">
            <FormInput
              label="Actual NFP"
              value={formData.actualNfp}
              onChange={(value) => handleInputChange("actualNfp", value)}
              error={errors.actualNfp}
              placeholder="Enter NFP value"
            />
            <FormInput
              label="NFP Forecast"
              value={formData.nfpForecast}
              onChange={(value) => handleInputChange("nfpForecast", value)}
              error={errors.nfpForecast}
              placeholder="Enter forecast"
            />
          </div>

          <div className="info-note">
            <span className="info-icon">ℹ️</span>
            <span>Non-Farm Payrolls (NFP) data is only available for USD</span>
          </div>
        </>
      )}
    </section>
  );
};

const EconomicGrowthSection = () => {
  const { formData, handleInputChange, errors } = useContext(FormContext);

  return (
    <section className="form-section">
      <div className="section-header">
        <Building size={20} style={{ color: "#7c3aed" }} />
        <h2>Economic Growth Data</h2>
      </div>

      {/* GDP Row */}
      <div className="form-grid grid-auto-fit row-margin">
        <FormInput
          label="GDP"
          value={formData.gdp}
          onChange={(value) => handleInputChange("gdp", value)}
          error={errors.gdp}
        />
        <FormInput
          label="GDP Forecast"
          value={formData.gdpForecast}
          onChange={(value) => handleInputChange("gdpForecast", value)}
          error={errors.gdpForecast}
        />
      </div>

      {/* Manufacturing PMI Row */}
      <div className="form-grid grid-auto-fit row-margin">
        <FormInput
          label="Manufacturing PMI"
          value={formData.mPMI}
          onChange={(value) => handleInputChange("mPMI", value)}
          error={errors.mPMI}
        />
        <FormInput
          label="mPMI Forecast"
          value={formData.mPMIForecast}
          onChange={(value) => handleInputChange("mPMIForecast", value)}
          error={errors.mPMIForecast}
        />
      </div>

      {/* Services PMI Row */}
      <div className="form-grid grid-auto-fit row-margin">
        <FormInput
          label="Services PMI"
          value={formData.sPMI}
          onChange={(value) => handleInputChange("sPMI", value)}
          error={errors.sPMI}
        />
        <FormInput
          label="sPMI Forecast"
          value={formData.sPMIForecast}
          onChange={(value) => handleInputChange("sPMIForecast", value)}
          error={errors.sPMIForecast}
        />
      </div>

      {/* Retail Sales Row */}
      <div className="form-grid grid-auto-fit">
        <FormInput
          label="Retail Sales"
          value={formData.retailSales}
          onChange={(value) => handleInputChange("retailSales", value)}
          error={errors.retailSales}
        />
        <FormInput
          label="Retail Sales Forecast"
          value={formData.retailSalesForecast}
          onChange={(value) => handleInputChange("retailSalesForecast", value)}
          error={errors.retailSalesForecast}
        />
      </div>
    </section>
  );
};

const InflationSection = () => {
  const { formData, handleInputChange, errors } = useContext(FormContext);

  return (
    <section className="form-section">
      <div className="section-header">
        <Percent size={20} style={{ color: "#dc2626" }} />
        <h2>Inflation Data</h2>
      </div>
      <div className="form-grid grid-auto-fit">
        <FormInput
          label="CPI"
          value={formData.cpi}
          onChange={(value) => handleInputChange("cpi", value)}
          error={errors.cpi}
        />
        <FormInput
          label="CPI Forecast"
          value={formData.cpiForecast}
          onChange={(value) => handleInputChange("cpiForecast", value)}
          error={errors.cpiForecast}
        />
      </div>
    </section>
  );
};

const InterestSection = () => {
  const { formData, handleInputChange, errors } = useContext(FormContext);

  return (
    <section className="form-section">
      <div className="section-header">
        <DollarSign size={20} style={{ color: "#ea580c" }} />
        <h2>Interest Data</h2>
      </div>
      <div className="form-grid grid-auto-fit">
        <FormInput
          label="Interest Rate"
          value={formData.interestRate}
          onChange={(value) => handleInputChange("interestRate", value)}
          error={errors.interestRate}
        />
      </div>
    </section>
  );
};

// Main Component
const CombinedEconomicDataForm = () => {
  const [isHidden, setIsHidden] = useState(true);

  // Updated hook calls with retry functionality
  const {
    currencies,
    loading: currenciesLoading,
    error: currenciesError,
    retry: retryCurrencies,
  } = useCurrencies();

  const {
    assetPairs,
    loading: assetPairsLoading,
    error: assetPairsError,
    retry: retryAssetPairs,
  } = useAssetPairs();

  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedAssetPair, setSelectedAssetPair] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  // Checklist state for sections
  const [enabledSections, setEnabledSections] = useState({
    retailSentiment: false,
    marketSentiments: false,
    laborMarket: false,
    economicGrowth: false,
    inflation: false,
    interest: false,
  });

  const [formData, setFormData] = useState({
    // Retail Sentiment Data
    retailLong: "",
    retailShort: "",

    // Market Sentiments
    cotLongContracts: "",
    cotShortContracts: "",

    // Labor Market Data
    employeeChange: "",
    employeeChangeForecast: "",
    unemployment: "",
    unemploymentForecast: "",

    // NFP Data (USD only)
    actualNfp: "",
    nfpForecast: "",

    // Economic Growth Data
    gdp: "",
    gdpForecast: "",
    mPMI: "",
    mPMIForecast: "",
    sPMI: "",
    sPMIForecast: "",
    retailSales: "",
    retailSalesForecast: "",

    // Inflation Data
    cpi: "",
    cpiForecast: "",

    // Interest Data
    interestRate: "",
  });

  const [errors, setErrors] = useState({});

  // Handle section checkbox changes
  const handleSectionToggle = useCallback((section) => {
    setEnabledSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Track changes to retailSentiment
  useEffect(() => {
    const { retailSentiment, ...others } = enabledSections;

    const anyOtherSelected = Object.values(others).some((v) => v);

    if (retailSentiment && !anyOtherSelected) {
      // Only retailSentiment is selected
      setIsHidden(false); // Hide currency
    } else {
      // Either retailSentiment + others OR no retailSentiment
      setIsHidden(true); // Show currency
    }
  }, [enabledSections]);

  // Handle "All" checkbox
  const handleSelectAll = useCallback((checked) => {
    setEnabledSections({
      retailSentiment: checked,
      marketSentiments: checked,
      laborMarket: checked,
      economicGrowth: checked,
      inflation: checked,
      interest: checked,
    });
  }, []);

  // Check if all sections are selected
  const allSectionsSelected = useMemo(() => {
    return Object.values(enabledSections).every(Boolean);
  }, [enabledSections]);

  // Check if any sections are selected
  const anySectionsSelected = useMemo(() => {
    return Object.values(enabledSections).some(Boolean);
  }, [enabledSections]);

  // Updated default currency and asset pair setting with better error handling
  useEffect(() => {
    if (
      !currenciesLoading &&
      !currenciesError &&
      currencies.length > 0 &&
      !selectedCurrency
    ) {
      const defaultCurrency =
        currencies.find((curr) => curr.value === "USD") || currencies[0];
      setSelectedCurrency(defaultCurrency.value);
    }
  }, [currencies, selectedCurrency, currenciesLoading, currenciesError]);

  useEffect(() => {
    if (
      !assetPairsLoading &&
      !assetPairsError &&
      assetPairs.length > 0 &&
      !selectedAssetPair
    ) {
      setSelectedAssetPair(assetPairs[0].value);
    }
  }, [assetPairs, selectedAssetPair, assetPairsLoading, assetPairsError]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };

        // Auto-calculate complementary percentage for retail sentiment
        if (field === "retailLong" && value && !isNaN(parseFloat(value))) {
          const longValue = Math.min(parseFloat(value), 100); // Add 100% restriction
          if (longValue >= 0 && longValue <= 100) {
            newData.retailLong = longValue; // Update with restricted value
            newData.retailShort = (100 - longValue)
              .toFixed(2)
              .replace(/\.?0+$/, "");
          }
        } else if (
          field === "retailShort" &&
          value &&
          !isNaN(parseFloat(value))
        ) {
          const shortValue = Math.min(parseFloat(value), 100); // Add 100% restriction
          if (shortValue >= 0 && shortValue <= 100) {
            newData.retailShort = shortValue; // Update with restricted value
            newData.retailLong = (100 - shortValue)
              .toFixed(2)
              .replace(/\.?0+$/, "");
          }
        }

        // Auto-calculate complementary percentage for COT sentiment
        if (
          field === "cotLongContracts" &&
          value &&
          !isNaN(parseFloat(value))
        ) {
          const longValue = Math.min(parseFloat(value), 100); // Add 100% restriction
          if (longValue >= 0 && longValue <= 100) {
            newData.cotLongContracts = longValue; // Update with restricted value
            newData.cotShortContracts = (100 - longValue)
              .toFixed(2)
              .replace(/\.?0+$/, "");
          }
        } else if (
          field === "cotShortContracts" &&
          value &&
          !isNaN(parseFloat(value))
        ) {
          const shortValue = Math.min(parseFloat(value), 100); // Add 100% restriction
          if (shortValue >= 0 && shortValue <= 100) {
            newData.cotShortContracts = shortValue; // Update with restricted value
            newData.cotLongContracts = (100 - shortValue)
              .toFixed(2)
              .replace(/\.?0+$/, "");
          }
        }

        // Apply 100% restriction to other percentage fields
        if (
          [
            "retailLong",
            "retailShort",
            "cotLongContracts",
            "cotShortContracts",
          ].includes(field)
        ) {
          if (value && !isNaN(parseFloat(value))) {
            newData[field] = Math.min(parseFloat(value), 100);
          }
        }

        return newData;
      });

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      // Clear total error when user changes retail sentiment values
      if (errors.total && (field === "retailLong" || field === "retailShort")) {
        setErrors((prev) => ({
          ...prev,
          total: undefined,
        }));
      }

      // Clear total error when user changes COT sentiment values
      if (
        errors.cotTotal &&
        (field === "cotLongContracts" || field === "cotShortContracts")
      ) {
        setErrors((prev) => ({
          ...prev,
          cotTotal: undefined,
        }));
      }
    },
    [errors]
  );

  // Enhanced submit handler with stored procedures
  // const handleSubmit = useCallback(async () => {
  //   // Add validation for required selections
  //   if (enabledSections.retailSentiment && !selectedAssetPair) {
  //     setSubmitStatus({
  //       type: "error",
  //       message: "Please select an asset pair for retail sentiment data",
  //     });
  //     return;
  //   }

  //   // Check if other sections need currency but it's not selected
  //   const needsCurrency = Object.entries(enabledSections).some(
  //     ([key, enabled]) => enabled && key !== "retailSentiment"
  //   );

  //   if (needsCurrency && !selectedCurrency) {
  //     setSubmitStatus({
  //       type: "error",
  //       message: "Please select a currency for the economic data",
  //     });
  //     return;
  //   }

  //   const formErrors = validateForm(formData);
  //   setErrors(formErrors);

  //   if (Object.keys(formErrors).length > 0) {
  //     setSubmitStatus({
  //       type: "error",
  //       message: "Please fix the errors above",
  //     });
  //     return;
  //   }

  //   try {
  //     setSubmitStatus({ type: "loading", message: "Submitting..." });

  //     const submissionPromises = [];
  //     let submissionCount = 0;

  //     // Helper function to check if field has valid data
  //     const hasData = (value) => {
  //       const stringValue = String(value || "").trim();
  //       return stringValue !== "";
  //     };

  //     // Submit Retail Sentiment data using stored procedure
  //     if (hasData(formData.retailLong) && hasData(formData.retailShort)) {
  //       if (!selectedAssetPair) {
  //         setSubmitStatus({
  //           type: "error",
  //           message: "Please select an asset pair for retail sentiment data",
  //         });
  //         return;
  //       }

  //       console.log("📊 Submitting Retail Sentiment data...");
  //       const retailSentimentPromise = fetch(
  //         "http://localhost:3000/api/retail-sentiment",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_pair_code: selectedAssetPair,
  //             retailLong: formData.retailLong,
  //             retailShort: formData.retailShort,
  //             useStoredProcedure: true, // Flag to use stored procedure
  //           }),
  //         }
  //       );
  //       submissionPromises.push(retailSentimentPromise);
  //       submissionCount++;
  //     }

  //     // Submit COT data using stored procedure
  //     if (
  //       hasData(formData.cotLongContracts) &&
  //       hasData(formData.cotShortContracts)
  //     ) {
  //       console.log("📊 Submitting COT data...");
  //       const cotPromise = fetch(
  //         "http://localhost:3000/api/economic-data/cot",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             cotLongContracts: formData.cotLongContracts,
  //             cotShortContracts: formData.cotShortContracts,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(cotPromise);
  //       submissionCount++;
  //     }

  //     // Submit Employment Change data using stored procedure
  //     if (
  //       hasData(formData.employeeChange) &&
  //       hasData(formData.employeeChangeForecast)
  //     ) {
  //       console.log("📊 Submitting Employment Change data...");
  //       const employmentPromise = fetch(
  //         "http://localhost:3000/api/economic-data/employment",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             employeeChange: formData.employeeChange,
  //             employeeChangeForecast: formData.employeeChangeForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(employmentPromise);
  //       submissionCount++;
  //     }

  //     // Submit Unemployment Rate data using stored procedure
  //     if (
  //       hasData(formData.unemployment) &&
  //       hasData(formData.unemploymentForecast)
  //     ) {
  //       console.log("📊 Submitting Unemployment Rate data...");
  //       const unemploymentPromise = fetch(
  //         "http://localhost:3000/api/economic-data/unemployment",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             unemployment: formData.unemployment,
  //             unemploymentForecast: formData.unemploymentForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(unemploymentPromise);
  //       submissionCount++;
  //     }

  //     // Submit NFP data using stored procedure (USD only)
  //     if (hasData(formData.actualNfp) && hasData(formData.nfpForecast)) {
  //       if (selectedCurrency !== "USD") {
  //         setSubmitStatus({
  //           type: "error",
  //           message: "NFP data can only be submitted for USD currency",
  //         });
  //         return;
  //       }

  //       console.log("📊 Submitting NFP data...");
  //       const nfpPromise = fetch(
  //         "http://localhost:3000/api/economic-data/nfp",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             actualNfp: formData.actualNfp,
  //             nfpForecast: formData.nfpForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(nfpPromise);
  //       submissionCount++;
  //     }

  //     // Submit GDP Growth data using stored procedure
  //     if (hasData(formData.gdp) && hasData(formData.gdpForecast)) {
  //       console.log("📊 Submitting GDP Growth data...");
  //       const gdpPromise = fetch(
  //         "http://localhost:3000/api/economic-data/gdp",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             gdp: formData.gdp,
  //             gdpForecast: formData.gdpForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(gdpPromise);
  //       submissionCount++;
  //     }

  //     // Submit Manufacturing PMI data using stored procedure
  //     if (hasData(formData.mPMI) && hasData(formData.mPMIForecast)) {
  //       console.log("📊 Submitting Manufacturing PMI data...");
  //       const mpmiPromise = fetch(
  //         "http://localhost:3000/api/economic-data/mpmi",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             mPMI: formData.mPMI,
  //             mPMIForecast: formData.mPMIForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(mpmiPromise);
  //       submissionCount++;
  //     }

  //     // Submit Services PMI data using stored procedure
  //     if (hasData(formData.sPMI) && hasData(formData.sPMIForecast)) {
  //       console.log("📊 Submitting Services PMI data...");
  //       const spmiPromise = fetch(
  //         "http://localhost:3000/api/economic-data/spmi",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             sPMI: formData.sPMI,
  //             sPMIForecast: formData.sPMIForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(spmiPromise);
  //       submissionCount++;
  //     }

  //     // Submit Retail Sales data using stored procedure
  //     if (
  //       hasData(formData.retailSales) &&
  //       hasData(formData.retailSalesForecast)
  //     ) {
  //       console.log("📊 Submitting Retail Sales data...");
  //       const retailPromise = fetch(
  //         "http://localhost:3000/api/economic-data/retail",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             retailSales: formData.retailSales,
  //             retailSalesForecast: formData.retailSalesForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(retailPromise);
  //       submissionCount++;
  //     }

  //     // Submit Core Inflation data using stored procedure
  //     if (hasData(formData.cpi) && hasData(formData.cpiForecast)) {
  //       console.log("📊 Submitting Core Inflation data...");
  //       const inflationPromise = fetch(
  //         "http://localhost:3000/api/economic-data/inflation",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             cpi: formData.cpi,
  //             cpiForecast: formData.cpiForecast,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(inflationPromise);
  //       submissionCount++;
  //     }

  //     // Submit Interest Rate data using stored procedure
  //     if (hasData(formData.interestRate)) {
  //       console.log("📊 Submitting Interest Rate data...");
  //       const interestPromise = fetch(
  //         "http://localhost:3000/api/economic-data/interest",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             asset_code: selectedCurrency,
  //             interestRate: formData.interestRate,
  //             useStoredProcedure: true,
  //           }),
  //         }
  //       );
  //       submissionPromises.push(interestPromise);
  //       submissionCount++;
  //     }

  //     // Check if any data was provided
  //     if (submissionCount === 0) {
  //       setSubmitStatus({
  //         type: "error",
  //         message: "Please enter at least one field before submitting.",
  //       });
  //       return;
  //     }

  //     // Wait for all submissions to complete
  //     const responses = await Promise.all(submissionPromises);

  //     // Check if any submission failed
  //     for (const response of responses) {
  //       if (!response.ok) {
  //         const errorResult = await response.json();
  //         throw new Error(errorResult.error || "Failed to submit data");
  //       }
  //     }

  //     // Log success for all submissions
  //     const results = await Promise.all(responses.map((r) => r.json()));
  //     console.log("✅ All data submitted successfully:", results);

  //     setSubmitStatus({
  //       type: "success",
  //       message: `Successfully submitted ${submissionCount} dataset(s) and updated summary!`,
  //     });

  //     // Clear form after successful submission
  //     setFormData({
  //       retailLong: "",
  //       retailShort: "",
  //       cotLongContracts: "",
  //       cotShortContracts: "",
  //       employeeChange: "",
  //       employeeChangeForecast: "",
  //       unemployment: "",
  //       unemploymentForecast: "",
  //       actualNfp: "",
  //       nfpForecast: "",
  //       gdp: "",
  //       gdpForecast: "",
  //       mPMI: "",
  //       mPMIForecast: "",
  //       sPMI: "",
  //       sPMIForecast: "",
  //       retailSales: "",
  //       retailSalesForecast: "",
  //       cpi: "",
  //       cpiForecast: "",
  //       interestRate: "",
  //     });

  //     // Clear success message after 3 seconds
  //     setTimeout(() => setSubmitStatus(null), 3000);
  //   } catch (error) {
  //     console.error("❌ Submission error:", error);
  //     setSubmitStatus({
  //       type: "error",
  //       message: error.message || "Failed to submit data. Please try again.",
  //     });
  //   }
  // }, [formData, selectedCurrency, selectedAssetPair, enabledSections]);
// Enhanced submit handler with stored procedures and history saving
  const handleSubmit = useCallback(async () => {
    // Add validation for required selections
    if (enabledSections.retailSentiment && !selectedAssetPair) {
      setSubmitStatus({
        type: "error",
        message: "Please select an asset pair for retail sentiment data",
      });
      return;
    }

    // Check if other sections need currency but it's not selected
    const needsCurrency = Object.entries(enabledSections).some(
      ([key, enabled]) => enabled && key !== "retailSentiment"
    );

    if (needsCurrency && !selectedCurrency) {
      setSubmitStatus({
        type: "error",
        message: "Please select a currency for the economic data",
      });
      return;
    }

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors above",
      });
      return;
    }

    try {
      setSubmitStatus({ type: "loading", message: "Submitting..." });

      const submissionPromises = [];
      const historyPromises = [];
      let submissionCount = 0;

      // Helper function to check if field has valid data
      const hasData = (value) => {
        const stringValue = String(value || "").trim();
        return stringValue !== "";
      };

      // Submit Retail Sentiment data using stored procedure
      if (hasData(formData.retailLong) && hasData(formData.retailShort)) {
        if (!selectedAssetPair) {
          setSubmitStatus({
            type: "error",
            message: "Please select an asset pair for retail sentiment data",
          });
          return;
        }

        console.log("📊 Submitting Retail Sentiment data...");
        const retailSentimentPromise = fetch(
          "http://localhost:3000/api/retail-sentiment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_pair_code: selectedAssetPair,
              retailLong: formData.retailLong,
              retailShort: formData.retailShort,
              useStoredProcedure: true, // Flag to use stored procedure
            }),
          }
        );
        submissionPromises.push(retailSentimentPromise);

        // Also save to history
        const retailSentimentHistoryPromise = fetch(
          "http://localhost:3000/api/history/retail-sentiment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_pair_code: selectedAssetPair,
              retailLong: formData.retailLong,
              retailShort: formData.retailShort,
            }),
          }
        );
        historyPromises.push(retailSentimentHistoryPromise);
        submissionCount++;
      }

      // Submit COT data using stored procedure
      if (
        hasData(formData.cotLongContracts) &&
        hasData(formData.cotShortContracts)
      ) {
        console.log("📊 Submitting COT data...");
        const cotPromise = fetch(
          "http://localhost:3000/api/economic-data/cot",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              cotLongContracts: formData.cotLongContracts,
              cotShortContracts: formData.cotShortContracts,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(cotPromise);

        // Also save to history
        const cotHistoryPromise = fetch(
          "http://localhost:3000/api/history/cot",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              cotLongContracts: formData.cotLongContracts,
              cotShortContracts: formData.cotShortContracts,
            }),
          }
        );
        historyPromises.push(cotHistoryPromise);
        submissionCount++;
      }

      // Submit Employment Change data using stored procedure
      if (
        hasData(formData.employeeChange) &&
        hasData(formData.employeeChangeForecast)
      ) {
        console.log("📊 Submitting Employment Change data...");
        const employmentPromise = fetch(
          "http://localhost:3000/api/economic-data/employment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              employeeChange: formData.employeeChange,
              employeeChangeForecast: formData.employeeChangeForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(employmentPromise);

        // Also save to history
        const employmentHistoryPromise = fetch(
          "http://localhost:3000/api/history/employment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              employeeChange: formData.employeeChange,
              employeeChangeForecast: formData.employeeChangeForecast,
            }),
          }
        );
        historyPromises.push(employmentHistoryPromise);
        submissionCount++;
      }

      // Submit Unemployment Rate data using stored procedure
      if (
        hasData(formData.unemployment) &&
        hasData(formData.unemploymentForecast)
      ) {
        console.log("📊 Submitting Unemployment Rate data...");
        const unemploymentPromise = fetch(
          "http://localhost:3000/api/economic-data/unemployment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              unemployment: formData.unemployment,
              unemploymentForecast: formData.unemploymentForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(unemploymentPromise);

        // Also save to history
        const unemploymentHistoryPromise = fetch(
          "http://localhost:3000/api/history/unemployment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              unemployment: formData.unemployment,
              unemploymentForecast: formData.unemploymentForecast,
            }),
          }
        );
        historyPromises.push(unemploymentHistoryPromise);
        submissionCount++;
      }

      // Submit NFP data using stored procedure (USD only)
      if (hasData(formData.actualNfp) && hasData(formData.nfpForecast)) {
        if (selectedCurrency !== "USD") {
          setSubmitStatus({
            type: "error",
            message: "NFP data can only be submitted for USD currency",
          });
          return;
        }

        console.log("📊 Submitting NFP data...");
        const nfpPromise = fetch(
          "http://localhost:3000/api/economic-data/nfp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              actualNfp: formData.actualNfp,
              nfpForecast: formData.nfpForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(nfpPromise);

        // Also save to history
        const nfpHistoryPromise = fetch(
          "http://localhost:3000/api/history/nfp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              actualNfp: formData.actualNfp,
              nfpForecast: formData.nfpForecast,
            }),
          }
        );
        historyPromises.push(nfpHistoryPromise);
        submissionCount++;
      }

      // Submit GDP Growth data using stored procedure
      if (hasData(formData.gdp) && hasData(formData.gdpForecast)) {
        console.log("📊 Submitting GDP Growth data...");
        const gdpPromise = fetch(
          "http://localhost:3000/api/economic-data/gdp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              gdp: formData.gdp,
              gdpForecast: formData.gdpForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(gdpPromise);

        // Also save to history
        const gdpHistoryPromise = fetch(
          "http://localhost:3000/api/history/gdp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              gdp: formData.gdp,
              gdpForecast: formData.gdpForecast,
            }),
          }
        );
        historyPromises.push(gdpHistoryPromise);
        submissionCount++;
      }

      // Submit Manufacturing PMI data using stored procedure
      if (hasData(formData.mPMI) && hasData(formData.mPMIForecast)) {
        console.log("📊 Submitting Manufacturing PMI data...");
        const mpmiPromise = fetch(
          "http://localhost:3000/api/economic-data/mpmi",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              mPMI: formData.mPMI,
              mPMIForecast: formData.mPMIForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(mpmiPromise);

        // Also save to history
        const mpmiHistoryPromise = fetch(
          "http://localhost:3000/api/history/mpmi",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              mPMI: formData.mPMI,
              mPMIForecast: formData.mPMIForecast,
            }),
          }
        );
        historyPromises.push(mpmiHistoryPromise);
        submissionCount++;
      }

      // Submit Services PMI data using stored procedure
      if (hasData(formData.sPMI) && hasData(formData.sPMIForecast)) {
        console.log("📊 Submitting Services PMI data...");
        const spmiPromise = fetch(
          "http://localhost:3000/api/economic-data/spmi",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              sPMI: formData.sPMI,
              sPMIForecast: formData.sPMIForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(spmiPromise);

        // Also save to history
        const spmiHistoryPromise = fetch(
          "http://localhost:3000/api/history/spmi",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              sPMI: formData.sPMI,
              sPMIForecast: formData.sPMIForecast,
            }),
          }
        );
        historyPromises.push(spmiHistoryPromise);
        submissionCount++;
      }

      // Submit Retail Sales data using stored procedure
      if (
        hasData(formData.retailSales) &&
        hasData(formData.retailSalesForecast)
      ) {
        console.log("📊 Submitting Retail Sales data...");
        const retailPromise = fetch(
          "http://localhost:3000/api/economic-data/retail",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              retailSales: formData.retailSales,
              retailSalesForecast: formData.retailSalesForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(retailPromise);

        // Also save to history
        const retailHistoryPromise = fetch(
          "http://localhost:3000/api/history/retail",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              retailSales: formData.retailSales,
              retailSalesForecast: formData.retailSalesForecast,
            }),
          }
        );
        historyPromises.push(retailHistoryPromise);
        submissionCount++;
      }

      // Submit Core Inflation data using stored procedure
      if (hasData(formData.cpi) && hasData(formData.cpiForecast)) {
        console.log("📊 Submitting Core Inflation data...");
        const inflationPromise = fetch(
          "http://localhost:3000/api/economic-data/inflation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              cpi: formData.cpi,
              cpiForecast: formData.cpiForecast,
              useStoredProcedure: true,
            }),
          }
        );
        submissionPromises.push(inflationPromise);

        // Also save to history
        const inflationHistoryPromise = fetch(
          "http://localhost:3000/api/history/inflation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asset_code: selectedCurrency,
              cpi: formData.cpi,
              cpiForecast: formData.cpiForecast,
            }),
          }
        );
        historyPromises.push(inflationHistoryPromise);
        submissionCount++;
      }

      // Submit Interest Rate data using stored procedure
    
     if (hasData(formData.interestRate)) {
  console.log("📊 Submitting Interest Rate data...");
  
  // Just do the interest rate submission
  const interestPromise = fetch(
    "http://localhost:3000/api/economic-data/interest",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset_code: selectedCurrency,
        interestRate: formData.interestRate,
        useStoredProcedure: true,
      }),
    }
  );
  
  submissionPromises.push(interestPromise);
  
  // Handle history separately after a delay
  setTimeout(async () => {
    try {
      console.log("🔄 Saving latest interest rate to history...");
      const historyResponse = await fetch(
        "http://localhost:3000/api/history/interest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // Empty - let API use latest
        }
      );
      
      if (historyResponse.ok) {
        console.log("✅ Interest rate saved to history");
      } else {
        console.error("❌ Failed to save to history");
      }
    } catch (error) {
      console.error("❌ Error saving to history:", error);
    }
  }, 1000); // Wait 1 second for the interest rate to be saved
  
  submissionCount++;
}

      // Check if any data was provided
      if (submissionCount === 0) {
        setSubmitStatus({
          type: "error",
          message: "Please enter at least one field before submitting.",
        });
        return;
      }

      // Wait for all main submissions to complete
      const responses = await Promise.all(submissionPromises);

      // Check if any main submission failed
      for (const response of responses) {
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.error || "Failed to submit data");
        }
      }

      // If main submissions succeeded, also save to history
      console.log("📚 Saving data to history tables...");
      const historyResponses = await Promise.all(historyPromises);

      // Log success for all submissions
      const results = await Promise.all(responses.map((r) => r.json()));
      const historyResults = await Promise.all(historyResponses.map((r) => r.json()));
      
      console.log("✅ All data submitted successfully:", results);
      console.log("📚 All history data saved successfully:", historyResults);

      setSubmitStatus({
        type: "success",
        message: `Successfully submitted ${submissionCount} dataset(s), updated summary, and saved to history!`,
      });

      // Clear form after successful submission
      setFormData({
        retailLong: "",
        retailShort: "",
        cotLongContracts: "",
        cotShortContracts: "",
        employeeChange: "",
        employeeChangeForecast: "",
        unemployment: "",
        unemploymentForecast: "",
        actualNfp: "",
        nfpForecast: "",
        gdp: "",
        gdpForecast: "",
        mPMI: "",
        mPMIForecast: "",
        sPMI: "",
        sPMIForecast: "",
        retailSales: "",
        retailSalesForecast: "",
        cpi: "",
        cpiForecast: "",
        interestRate: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error("❌ Submission error:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit data. Please try again.",
      });
    }
  }, [formData, selectedCurrency, selectedAssetPair, enabledSections]);
  
  const contextValue = useMemo(
    () => ({
      formData,
      handleInputChange,
      errors,
      selectedCurrency,
      selectedAssetPair,
      setSelectedAssetPair,
    }),
    [
      formData,
      handleInputChange,
      errors,
      selectedCurrency,
      selectedAssetPair,
      setSelectedAssetPair,
    ]
  );

  return (
    <FormContext.Provider value={contextValue}>
      <div className="economic-form-container">
        <style>{`
          .economic-form-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
            padding: 1.5rem;
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          .main-wrapper {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .form-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .header-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .header-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          
          .main-title {
            font-size: 1.75rem;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
          }
          
          .control-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f9fafb;
            border-radius: 8px;
            padding: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .control-group {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          }
          
          .control-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            white-space: nowrap;
          }
          
          .select-input {
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            min-width: 200px;
            outline: none;
            transition: border-color 0.2s;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: white;
            color: #1f2937;
          }

          .select-input.loading {
            cursor: not-allowed;
            opacity: 0.7;
          }

          .loading-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #6b7280;
          }

          .selected-option {
            color: #1f2937;
            font-weight: 500;
          }
          
          .select-input:focus, .select-input.open {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .select-input .placeholder {
            color: #6b7280;
          }
          
          .dropdown-arrow {
            margin-left: 0.5rem;
            font-size: 0.75rem;
            color: #6b7280;
            transition: transform 0.2s ease;
          }
          
          .dropdown-arrow.open {
            transform: rotate(180deg);
          }
          
          .searchable-select {
            position: relative;
            min-width: 200px;
          }
          
          .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 250px;
            overflow: hidden;
          }

          .search-container {
            position: relative;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .search-input {
            width: 100%;
            padding: 0.75rem 2rem 0.75rem 0.75rem;
            border: none;
            font-size: 0.875rem;
            outline: none;
            box-sizing: border-box;
            color: #1f2937;
            background: #f9fafb;
          }

          .search-input:focus {
            background: white;
          }

          .clear-search {
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            font-size: 0.75rem;
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s;
          }

          .clear-search:hover {
            background: #f3f4f6;
            color: #374151;
          }
          
          .options-list {
            max-height: 180px;
            overflow-y: auto;
          }
          
          .option {
            padding: 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.15s;
            color: #1f2937;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
          }

          .option:last-child {
            border-bottom: none;
          }
          
          .option:hover {
            background: #f8fafc;
            color: #1f2937;
          }
          
          .option.selected {
            background: #eff6ff;
            color: #1e40af;
            font-weight: 600;
            border-left: 3px solid #2563eb;
          }

          .option.selected:hover {
            background: #dbeafe;
          }

          .option-label {
            flex: 1;
          }

          .option-value {
            color: #6b7280;
            font-size: 0.75rem;
            font-weight: normal;
          }
          
          .no-options {
            padding: 1rem 0.75rem;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            font-style: italic;
          }

          .search-footer {
            padding: 0.5rem 0.75rem;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 0.75rem;
            color: #6b7280;
            text-align: center;
          }

          .error-banner {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .error-banner.warning {
            background: #fefce8;
            border-color: #fef08a;
            color: #a16207;
          }

          .error-banner.info {
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #1e40af;
          }

          .error-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .error-text {
            font-weight: 500;
            font-size: 0.875rem;
          }

          .error-hint {
            font-size: 0.75rem;
            opacity: 0.8;
            font-weight: normal;
          }

          .retry-button {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            background: #dc2626;
            color: white;
            border: none;
            padding: 0.5rem 0.875rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            min-height: 2rem;
          }

          .retry-button:hover:not(:disabled) {
            background: #b91c1c;
            transform: translateY(-1px);
          }

          .retry-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
          }

          .loading-skeleton {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .skeleton-line {
            height: 1rem;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
            opacity: 0.7;
          }

          .skeleton-line.short {
            width: 60%;
          }

          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          .checklist-container {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
          }
          
          .select-all-option {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .checklist-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 0.75rem;
          }
          
          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            padding: 0.75rem;
            border-radius: 6px;
            transition: background-color 0.15s;
            border: 1px solid #e5e7eb;
            background: white;
          }
          
          .checkbox-label:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }
          
          .checkbox-input {
            display: none;
          }
          
          .checkbox-custom {
            width: 18px;
            height: 18px;
            border: 2px solid #d1d5db;
            border-radius: 3px;
            position: relative;
            transition: all 0.15s;
            flex-shrink: 0;
          }
          
          .checkbox-input:checked + .checkbox-custom {
            background: #2563eb;
            border-color: #2563eb;
          }
          
          .checkbox-input:checked + .checkbox-custom::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
          }
          
          .checkbox-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .checkbox-text {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }
          
          .warning-note {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 0.75rem;
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #dc2626;
          }

          .section-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          
          .section-header h2 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
          }
          
          .form-grid {
            display: grid;
            gap: 1rem;
          }
          
          .grid-auto-fit {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          
          .grid-three {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
          
          .grid-four {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
          
          .row-margin {
            margin-bottom: 1rem;
          }
          
          .form-group {
            display: flex;
            flex-direction: column;
          }
          
          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.375rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .auto-calc-badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 0.125rem 0.375rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          
          .form-input.auto-calculated {
            background: #f8fafc;
            border-color: #cbd5e1;
          }
          
          .form-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
          }
          
          .form-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .form-input.error {
            border-color: #dc2626;
          }
          
          .calculated-field {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            background: #f3f4f6;
            color: #6b7280;
            box-sizing: border-box;
          }
          
          .error-message {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #dc2626;
            font-size: 0.75rem;
            margin-top: 0.25rem;
          }
          
          .percentage-summary {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
          }
          
          .percentage-bar {
            display: flex;
            height: 40px;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            margin-bottom: 0.5rem;
          }
          
          .percentage-fill {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 500;
            font-size: 0.875rem;
            transition: width 0.3s ease;
          }
          
          .percentage-fill.long {
            background: #059669;
          }
          
          .percentage-fill.short {
            background: #dc2626;
          }
          
          .total-percentage {
            text-align: center;
            font-weight: 500;
            font-size: 0.875rem;
          }
          
          .total-percentage.success {
            color: #059669;
          }
          
          .total-percentage.error {
            color: #dc2626;
          }
          
          .submit-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            color: #1f2937;
            font-size: 0.875rem;
            line-height: 1.6;
          }
          
          .summary-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1rem;
          }
          
          .submit-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #059669;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .submit-button:hover:not(:disabled) {
            background: #047857;
          }
          
          .submit-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
          
          .status-message {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .status-message.success {
            background: #f0fdf4;
            color: #059669;
            border: 1px solid #bbf7d0;
          }
          
          .status-message.error {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
          }
          
          .status-message.loading {
            background: #eff6ff;
            color: #2563eb;
            border: 1px solid #bfdbfe;
          }
          
          .section-divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0 1rem 0;
            gap: 1rem;
          }
          
          .divider-line {
            flex: 1;
            height: 1px;
            background: #e5e7eb;
          }
          
          .divider-text {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            padding: 0 0.5rem;
            background: white;
          }
          
          .info-note {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 0.75rem;
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #1e40af;
          }
          
          .auto-calc-note {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 0.75rem;
            margin-top: 0.75rem;
            font-size: 0.875rem;
            color: #0c4a6e;
          }
          
          .info-icon {
            font-size: 1rem;
          }
          
          .spin {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Focus styles for accessibility */
          .select-input:focus {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
          }

          .option:focus {
            background: #f1f5f9;
            outline: 2px solid #2563eb;
            outline-offset: -2px;
          }
          
          @media (max-width: 768px) {
            .grid-auto-fit, .grid-three, .grid-four {
              grid-template-columns: 1fr;
            }
            
            .checklist-grid {
              grid-template-columns: 1fr;
            }
            
            .control-bar, .header-section {
              flex-direction: column;
              align-items: stretch;
            }
            
            .main-title {
              font-size: 1.5rem;
            }
            
            .economic-form-container {
              padding: 1rem;
            }
            
            .section-divider {
              margin: 1rem 0 0.75rem 0;
            }
            
            .divider-text {
              font-size: 0.8rem;
            }
            
            .select-input, .searchable-select {
              min-width: auto;
              width: 100%;
            }
            
            .dropdown-menu {
              position: fixed;
              left: 1rem;
              right: 1rem;
              top: auto;
              bottom: auto;
              max-height: 50vh;
              z-index: 9999;
            }

            .options-list {
              max-height: calc(50vh - 80px);
            }
            
            .checkbox-label {
              padding: 1rem;
            }
            
            .checkbox-text {
              font-size: 0.8rem;
            }

            .error-banner {
              flex-direction: column;
              align-items: stretch;
              gap: 0.75rem;
            }

            .retry-button {
              align-self: flex-start;
            }
          }
        `}</style>

        <div className="main-wrapper">
          {/* Header */}
          <div className="form-section">
            <div className="header-section">
              <div className="header-title">
                <DollarSign size={32} style={{ color: "#2563eb" }} />
                <h1 className="main-title">Combined Economic Data Entry</h1>
              </div>
            </div>

            {/* Currency and Asset Pair Selection */}
            <div className="control-bar">
              {/* Show Currency Selection if retailSentiment is NOT selected */}
              {isHidden && (
                <div className="control-group">
                  <label className="control-label">Currency Selection</label>
                  <SearchableSelect
                    options={currencies}
                    value={selectedCurrency}
                    onChange={setSelectedCurrency}
                    placeholder="Select currency..."
                    loading={currenciesLoading}
                    error={currenciesError}
                    onRetry={retryCurrencies}
                  />
                </div>
              )}

              {/* Show Asset Pair Selection ONLY if retailSentiment is selected */}
              {enabledSections.retailSentiment && (
                <div className="control-group">
                  <label className="control-label">Asset Pair Selection</label>
                  <SearchableSelect
                    options={assetPairs}
                    value={selectedAssetPair}
                    onChange={setSelectedAssetPair}
                    placeholder="Select asset pair..."
                    loading={assetPairsLoading}
                    error={assetPairsError}
                    onRetry={retryAssetPairs}
                  />
                </div>
              )}
            </div>

            {enabledSections.retailSentiment && !selectedAssetPair && (
              <div className="warning-note">
                <AlertCircle size={16} />
                <span>
                  Please select an asset pair above to enable retail sentiment
                  data submission.
                </span>
              </div>
            )}
          </div>

          {/* Section Selection Checklist */}
          <SectionChecklistComponent
            enabledSections={enabledSections}
            onSectionToggle={handleSectionToggle}
            onSelectAll={handleSelectAll}
            allSelected={allSectionsSelected}
            anySelected={anySectionsSelected}
          />

          {/* Form Sections - Only show if enabled */}
          {currenciesLoading || assetPairsLoading ? (
            <div className="form-section">
              <LoadingSkeleton />
            </div>
          ) : currenciesError || assetPairsError ? (
            <div className="form-section">
              <ErrorMessage
                message={currenciesError || assetPairsError}
                onRetry={() => {
                  if (currenciesError) retryCurrencies();
                  if (assetPairsError) retryAssetPairs();
                }}
              />
            </div>
          ) : (
            <>
              {enabledSections.retailSentiment && <RetailSentimentSection />}
              {enabledSections.marketSentiments && <MarketSentimentsSection />}
              {enabledSections.laborMarket && <LaborMarketSection />}
              {enabledSections.economicGrowth && <EconomicGrowthSection />}
              {enabledSections.inflation && <InflationSection />}
              {enabledSections.interest && <InterestSection />}
            </>
          )}

          {/* Summary - Only show if any sections are enabled */}
          {anySectionsSelected && (
            <div className="form-section">
              <h3 className="summary-title">Data Summary</h3>
              <div className="summary-grid">
                <div>
                  {isHidden ? (
                    <p>
                      <strong>Currency:</strong> {selectedCurrency}
                    </p>
                  ) : (
                    <p>
                      <strong>Currency:</strong> Not applicable
                    </p>
                  )}

                  {enabledSections.retailSentiment && (
                    <>
                      <p>
                        <strong>Asset Pair:</strong>{" "}
                        {selectedAssetPair || "Not selected"}
                      </p>
                      <p>
                        <strong>Retail Long%:</strong>{" "}
                        {formData.retailLong || "Not entered"}
                      </p>
                      <p>
                        <strong>Retail Short%:</strong>{" "}
                        {formData.retailShort || "Not entered"}
                      </p>
                    </>
                  )}

                  {enabledSections.economicGrowth && (
                    <p>
                      <strong>GDP:</strong> {formData.gdp || "Not entered"}
                    </p>
                  )}

                  {enabledSections.inflation && (
                    <p>
                      <strong>CPI:</strong> {formData.cpi || "Not entered"}
                    </p>
                  )}
                </div>

                <div>
                  {enabledSections.interest && (
                    <p>
                      <strong>Interest Rate:</strong>{" "}
                      {formData.interestRate || "Not entered"}
                    </p>
                  )}

                  {enabledSections.laborMarket && (
                    <>
                      <p>
                        <strong>Unemployment:</strong>{" "}
                        {formData.unemployment || "Not entered"}
                      </p>
                      <p>
                        <strong>Unemployment Forecast:</strong>{" "}
                        {formData.unemploymentForecast || "Not entered"}
                      </p>
                      <p>
                        <strong>Employee Change:</strong>{" "}
                        {formData.employeeChange || "Not entered"}
                      </p>
                      <p>
                        <strong>Employee Change Forecast:</strong>{" "}
                        {formData.employeeChangeForecast || "Not entered"}
                      </p>
                    </>
                  )}

                  {enabledSections.economicGrowth && (
                    <>
                      <p>
                        <strong>Manufacturing PMI:</strong>{" "}
                        {formData.mPMI || "Not entered"}
                      </p>
                      <p>
                        <strong>Services PMI:</strong>{" "}
                        {formData.sPMI || "Not entered"}
                      </p>
                      <p>
                        <strong>Retail Sales:</strong>{" "}
                        {formData.retailSales || "Not entered"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="info-note">
                <span className="info-icon">💡</span>
                <span>
                  Data will be stored in history tables and automatically update the summary for optimized frontend reading.
                </span>
              </div>
            </div>
          )}

          {/* Submit Section - Only show if any sections are enabled */}
          {anySectionsSelected && (
            <div className="form-section">
              <div className="submit-section">
                {submitStatus && (
                  <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.type === "loading" && (
                      <Loader2 size={16} className="spin" />
                    )}
                    {submitStatus.type === "success" && (
                      <CheckCircle size={16} />
                    )}
                    {submitStatus.type === "error" && <AlertCircle size={16} />}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="submit-button"
                  disabled={submitStatus?.type === "loading"}
                >
                  {submitStatus?.type === "loading" ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Submit Data
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormContext.Provider>
  );
};

export default CombinedEconomicDataForm;