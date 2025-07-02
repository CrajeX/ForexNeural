-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 05:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `8con`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CleanupOldHistory` (IN `p_days_to_keep` INT)   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Delete old records from all history tables
  DELETE FROM cot_data_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM retail_sentiment_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM employment_change_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM unemployment_rate_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM gdp_growth_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM mpmi_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM spmi_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM retail_sales_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM core_inflation_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM interest_rate_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  DELETE FROM nfp_history WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY);
  
  -- Log the cleanup
  INSERT INTO `activity_logs` (`action`, `description`, `created_at`)
  VALUES ('history_cleanup', CONCAT('Cleaned up history data older than ', p_days_to_keep, ' days'), NOW());
  
  COMMIT;
  
  SELECT CONCAT('Successfully cleaned up history data older than ', p_days_to_keep, ' days') as result;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAssetPairHistory` (IN `p_asset_pair_code` VARCHAR(20), IN `p_start_date` DATE, IN `p_end_date` DATE)   BEGIN
    SELECT 
        id,
        asset_pair_code,
        retail_long,
        retail_short,
        entry_type,
        previous_long,
        previous_short,
        changed_by,
        change_reason,
        created_at,
        CASE 
            WHEN previous_long IS NOT NULL THEN 
                CONCAT('Long: ', previous_long, '% → ', retail_long, '% (', 
                       FORMAT(retail_long - previous_long, 2), '% change)')
            ELSE 'Initial Entry'
        END as change_summary
    FROM retail_sentiment_history 
    WHERE asset_pair_code = p_asset_pair_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    ORDER BY created_at DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAssetPairsWithScores` (IN `page_number` INT, IN `page_size` INT, IN `search_text` VARCHAR(255), IN `bias_filter` VARCHAR(50), IN `sort_by` VARCHAR(50), IN `sort_order` VARCHAR(4))   BEGIN
    DECLARE offset_val INT DEFAULT 0;
    DECLARE search_pattern VARCHAR(257);
    
    -- Set default values if parameters are NULL
    IF page_number IS NULL THEN SET page_number = 1; END IF;
    IF page_size IS NULL THEN SET page_size = 10; END IF;
    IF search_text IS NULL THEN SET search_text = ''; END IF;
    IF bias_filter IS NULL THEN SET bias_filter = 'All'; END IF;
    IF sort_by IS NULL THEN SET sort_by = 'totalScore'; END IF;
    IF sort_order IS NULL THEN SET sort_order = 'DESC'; END IF;
    
    -- Calculate offset
    SET offset_val = (page_number - 1) * page_size;
    
    -- Prepare search pattern
    SET search_pattern = CONCAT('%', search_text, '%');
    
    -- Drop temporary table if exists
    DROP TEMPORARY TABLE IF EXISTS temp_asset_scores;
    
    -- Create temporary table (MariaDB in XAMPP supports this)
    CREATE TEMPORARY TABLE temp_asset_scores (
        asset_pair_code VARCHAR(20),
        base_asset VARCHAR(10),
        quote_asset VARCHAR(10),
        description TEXT,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        
        -- Individual scores
        cot_score INT DEFAULT 0,
        retail_position_score INT DEFAULT 0,
        employment_score INT DEFAULT 0,
        unemployment_score INT DEFAULT 0,
        gdp_score INT DEFAULT 0,
        mpmi_score INT DEFAULT 0,
        spmi_score INT DEFAULT 0,
        retail_score INT DEFAULT 0,
        inflation_score INT DEFAULT 0,
        interest_rate_score INT DEFAULT 0,
        
        -- Total score and bias
        total_score INT DEFAULT 0,
        bias VARCHAR(20) DEFAULT 'Neutral'
    );
    
    -- Insert all asset pairs with calculated scores
    INSERT INTO temp_asset_scores (
        asset_pair_code, base_asset, quote_asset, description, created_at, updated_at,
        cot_score, retail_position_score, employment_score, unemployment_score,
        gdp_score, mpmi_score, spmi_score, retail_score, inflation_score, interest_rate_score
    )
    SELECT 
        ap.asset_pair_code,
        ap.base_asset,
        ap.quote_asset,
        COALESCE(ap.description, CONCAT(ap.base_asset, ' / ', ap.quote_asset)),
        ap.created_at,
        ap.updated_at,
        
        -- COT Score calculation
        COALESCE(
            (CASE 
                WHEN cot_base.net_change_percent > 0 THEN 1
                WHEN cot_base.net_change_percent < 0 THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN cot_quote.net_change_percent > 0 THEN -1
                WHEN cot_quote.net_change_percent < 0 THEN 1
                ELSE 0
            END), 0
        ) AS cot_score,
        
        -- Retail Position Score
        COALESCE(
            CASE 
                WHEN rs.retail_long > rs.retail_short THEN -1
                ELSE 1
            END, 0
        ) AS retail_position_score,
        
        -- Employment Score
        COALESCE(
            (CASE 
                WHEN emp_base.employment_change > emp_base.forecast THEN 1
                WHEN emp_base.employment_change < emp_base.forecast THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN emp_quote.employment_change > emp_quote.forecast THEN -1
                WHEN emp_quote.employment_change < emp_quote.forecast THEN 1
                ELSE 0
            END), 0
        ) AS employment_score,
        
        -- Unemployment Score
        COALESCE(
            (CASE 
                WHEN unemp_base.unemployment_rate > unemp_base.forecast THEN -1
                WHEN unemp_base.unemployment_rate < unemp_base.forecast THEN 1
                ELSE 0
            END) +
            (CASE 
                WHEN unemp_quote.unemployment_rate > unemp_quote.forecast THEN 1
                WHEN unemp_quote.unemployment_rate < unemp_quote.forecast THEN -1
                ELSE 0
            END), 0
        ) AS unemployment_score,
        
        -- GDP Score
        COALESCE(
            (CASE 
                WHEN gdp_base.result = 'Beat' THEN 1
                WHEN gdp_base.result IN ('Miss', 'Missed') THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN gdp_quote.result = 'Beat' THEN -1
                WHEN gdp_quote.result IN ('Miss', 'Missed') THEN 1
                ELSE 0
            END), 0
        ) AS gdp_score,
        
        -- Manufacturing PMI Score
        COALESCE(
            (CASE 
                WHEN mpmi_base.result = 'Beat' THEN 1
                WHEN mpmi_base.result IN ('Miss', 'Missed') THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN mpmi_quote.result = 'Beat' THEN -1
                WHEN mpmi_quote.result IN ('Miss', 'Missed') THEN 1
                ELSE 0
            END), 0
        ) AS mpmi_score,
        
        -- Services PMI Score
        COALESCE(
            (CASE 
                WHEN spmi_base.result = 'Beat' THEN 1
                WHEN spmi_base.result IN ('Miss', 'Missed') THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN spmi_quote.result = 'Beat' THEN -1
                WHEN spmi_quote.result IN ('Miss', 'Missed') THEN 1
                ELSE 0
            END), 0
        ) AS spmi_score,
        
        -- Retail Sales Score
        COALESCE(
            (CASE 
                WHEN retail_base.result = 'Beat' THEN 1
                WHEN retail_base.result IN ('Miss', 'Missed') THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN retail_quote.result = 'Beat' THEN -1
                WHEN retail_quote.result IN ('Miss', 'Missed') THEN 1
                ELSE 0
            END), 0
        ) AS retail_score,
        
        -- Inflation Score
        COALESCE(
            (CASE 
                WHEN inf_base.core_inflation > inf_base.forecast THEN 1
                WHEN inf_base.core_inflation < inf_base.forecast THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN inf_quote.core_inflation > inf_quote.forecast THEN -1
                WHEN inf_quote.core_inflation < inf_quote.forecast THEN 1
                ELSE 0
            END), 0
        ) AS inflation_score,
        
        -- Interest Rate Score
        COALESCE(
            (CASE 
                WHEN int_base.change_in_interest > 0 THEN 1
                WHEN int_base.change_in_interest < 0 THEN -1
                ELSE 0
            END) +
            (CASE 
                WHEN int_quote.change_in_interest > 0 THEN -1
                WHEN int_quote.change_in_interest < 0 THEN 1
                ELSE 0
            END), 0
        ) AS interest_rate_score
        
    FROM asset_pairs ap
    
    -- COT Data (latest for each asset)
    LEFT JOIN (
        SELECT c1.* FROM cot_data c1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM cot_data GROUP BY asset_code
        ) c2 ON c1.asset_code = c2.asset_code AND c1.created_at = c2.max_created
    ) cot_base ON ap.base_asset = cot_base.asset_code
    
    LEFT JOIN (
        SELECT c1.* FROM cot_data c1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM cot_data GROUP BY asset_code
        ) c2 ON c1.asset_code = c2.asset_code AND c1.created_at = c2.max_created
    ) cot_quote ON ap.quote_asset = cot_quote.asset_code
    
    -- Retail Sentiment (latest for each pair)
    LEFT JOIN (
        SELECT rs1.* FROM retail_sentiment rs1
        INNER JOIN (
            SELECT asset_pair_code, MAX(created_at) as max_created
            FROM retail_sentiment GROUP BY asset_pair_code
        ) rs2 ON rs1.asset_pair_code = rs2.asset_pair_code AND rs1.created_at = rs2.max_created
    ) rs ON ap.asset_pair_code = rs.asset_pair_code
    
    -- Employment Change Data
    LEFT JOIN (
        SELECT e1.* FROM employment_change e1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM employment_change GROUP BY asset_code
        ) e2 ON e1.asset_code = e2.asset_code AND e1.created_at = e2.max_created
    ) emp_base ON ap.base_asset = emp_base.asset_code
    
    LEFT JOIN (
        SELECT e1.* FROM employment_change e1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM employment_change GROUP BY asset_code
        ) e2 ON e1.asset_code = e2.asset_code AND e1.created_at = e2.max_created
    ) emp_quote ON ap.quote_asset = emp_quote.asset_code
    
    -- Unemployment Rate Data
    LEFT JOIN (
        SELECT u1.* FROM unemployment_rate u1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM unemployment_rate GROUP BY asset_code
        ) u2 ON u1.asset_code = u2.asset_code AND u1.created_at = u2.max_created
    ) unemp_base ON ap.base_asset = unemp_base.asset_code
    
    LEFT JOIN (
        SELECT u1.* FROM unemployment_rate u1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM unemployment_rate GROUP BY asset_code
        ) u2 ON u1.asset_code = u2.asset_code AND u1.created_at = u2.max_created
    ) unemp_quote ON ap.quote_asset = unemp_quote.asset_code
    
    -- GDP Growth Data
    LEFT JOIN (
        SELECT g1.* FROM gdp_growth g1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM gdp_growth GROUP BY asset_code
        ) g2 ON g1.asset_code = g2.asset_code AND g1.created_at = g2.max_created
    ) gdp_base ON ap.base_asset = gdp_base.asset_code
    
    LEFT JOIN (
        SELECT g1.* FROM gdp_growth g1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM gdp_growth GROUP BY asset_code
        ) g2 ON g1.asset_code = g2.asset_code AND g1.created_at = g2.max_created
    ) gdp_quote ON ap.quote_asset = gdp_quote.asset_code
    
    -- Manufacturing PMI Data
    LEFT JOIN (
        SELECT m1.* FROM mpmi m1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM mpmi GROUP BY asset_code
        ) m2 ON m1.asset_code = m2.asset_code AND m1.created_at = m2.max_created
    ) mpmi_base ON ap.base_asset = mpmi_base.asset_code
    
    LEFT JOIN (
        SELECT m1.* FROM mpmi m1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM mpmi GROUP BY asset_code
        ) m2 ON m1.asset_code = m2.asset_code AND m1.created_at = m2.max_created
    ) mpmi_quote ON ap.quote_asset = mpmi_quote.asset_code
    
    -- Services PMI Data
    LEFT JOIN (
        SELECT s1.* FROM spmi s1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM spmi GROUP BY asset_code
        ) s2 ON s1.asset_code = s2.asset_code AND s1.created_at = s2.max_created
    ) spmi_base ON ap.base_asset = spmi_base.asset_code
    
    LEFT JOIN (
        SELECT s1.* FROM spmi s1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM spmi GROUP BY asset_code
        ) s2 ON s1.asset_code = s2.asset_code AND s1.created_at = s2.max_created
    ) spmi_quote ON ap.quote_asset = spmi_quote.asset_code
    
    -- Retail Sales Data
    LEFT JOIN (
        SELECT r1.* FROM retail_sales r1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM retail_sales GROUP BY asset_code
        ) r2 ON r1.asset_code = r2.asset_code AND r1.created_at = r2.max_created
    ) retail_base ON ap.base_asset = retail_base.asset_code
    
    LEFT JOIN (
        SELECT r1.* FROM retail_sales r1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM retail_sales GROUP BY asset_code
        ) r2 ON r1.asset_code = r2.asset_code AND r1.created_at = r2.max_created
    ) retail_quote ON ap.quote_asset = retail_quote.asset_code
    
    -- Inflation Data
    LEFT JOIN (
        SELECT i1.* FROM core_inflation i1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM core_inflation GROUP BY asset_code
        ) i2 ON i1.asset_code = i2.asset_code AND i1.created_at = i2.max_created
    ) inf_base ON ap.base_asset = inf_base.asset_code
    
    LEFT JOIN (
        SELECT i1.* FROM core_inflation i1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM core_inflation GROUP BY asset_code
        ) i2 ON i1.asset_code = i2.asset_code AND i1.created_at = i2.max_created
    ) inf_quote ON ap.quote_asset = inf_quote.asset_code
    
    -- Interest Rate Data
    LEFT JOIN (
        SELECT ir1.* FROM interest_rate ir1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM interest_rate GROUP BY asset_code
        ) ir2 ON ir1.asset_code = ir2.asset_code AND ir1.created_at = ir2.max_created
    ) int_base ON ap.base_asset = int_base.asset_code
    
    LEFT JOIN (
        SELECT ir1.* FROM interest_rate ir1
        INNER JOIN (
            SELECT asset_code, MAX(created_at) as max_created
            FROM interest_rate GROUP BY asset_code
        ) ir2 ON ir1.asset_code = ir2.asset_code AND ir1.created_at = ir2.max_created
    ) int_quote ON ap.quote_asset = int_quote.asset_code;
    
    -- Update total scores and bias
    UPDATE temp_asset_scores 
    SET total_score = cot_score + retail_position_score + employment_score + unemployment_score + 
                     gdp_score + mpmi_score + spmi_score + retail_score + inflation_score + interest_rate_score;
    
    UPDATE temp_asset_scores 
    SET bias = CASE 
        WHEN total_score >= 12 THEN 'Very Bullish'
        WHEN total_score >= 5 THEN 'Bullish'
        WHEN total_score >= -4 THEN 'Neutral'
        WHEN total_score >= -11 THEN 'Bearish'
        ELSE 'Very Bearish'
    END;
    
    -- Return results with filtering, sorting, and pagination
    SELECT 
        asset_pair_code, 
        base_asset, 
        quote_asset, 
        description, 
        created_at, 
        updated_at,
        cot_score, 
        retail_position_score, 
        employment_score, 
        unemployment_score,
        gdp_score, 
        mpmi_score, 
        spmi_score, 
        retail_score, 
        inflation_score, 
        interest_rate_score,
        total_score, 
        bias
    FROM temp_asset_scores
    WHERE 1=1
        AND (search_text = '' OR 
             asset_pair_code LIKE search_pattern OR 
             description LIKE search_pattern OR 
             base_asset LIKE search_pattern OR 
             quote_asset LIKE search_pattern)
        AND (bias_filter = 'All' OR bias = bias_filter)
    ORDER BY 
        CASE WHEN sort_by = 'totalScore' AND sort_order = 'ASC' THEN total_score END ASC,
        CASE WHEN sort_by = 'totalScore' AND sort_order = 'DESC' THEN total_score END DESC,
        CASE WHEN sort_by = 'asset_pair_code' AND sort_order = 'ASC' THEN asset_pair_code END ASC,
        CASE WHEN sort_by = 'asset_pair_code' AND sort_order = 'DESC' THEN asset_pair_code END DESC,
        CASE WHEN sort_by = 'bias' AND sort_order = 'ASC' THEN bias END ASC,
        CASE WHEN sort_by = 'bias' AND sort_order = 'DESC' THEN bias END DESC,
        total_score DESC -- Default fallback
    LIMIT page_size OFFSET offset_val;
    
    -- Clean up
    DROP TEMPORARY TABLE IF EXISTS temp_asset_scores;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCurrencyHistory` (IN `p_asset_code` VARCHAR(10), IN `p_start_date` DATE, IN `p_end_date` DATE)   BEGIN
    -- COT History
    SELECT 'COT' as data_type, id, asset_code, long_contracts as value1, 
           short_contracts as value2, NULL as value3, NULL as value4,
           entry_type, changed_by, change_reason, created_at
    FROM cot_data_history 
    WHERE asset_code = p_asset_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    
    UNION ALL
    
    -- Employment History
    SELECT 'EMPLOYMENT' as data_type, id, asset_code, employee_change as value1,
           employee_change_forecast as value2, actual_nfp as value3, nfp_forecast as value4,
           entry_type, changed_by, change_reason, created_at
    FROM employment_data_history 
    WHERE asset_code = p_asset_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    
    UNION ALL
    
    -- Manufacturing PMI History
    SELECT 'MPMI' as data_type, id, asset_code, mpmi_value as value1,
           mpmi_forecast as value2, NULL as value3, NULL as value4,
           entry_type, changed_by, change_reason, created_at
    FROM manufacturing_pmi_history 
    WHERE asset_code = p_asset_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    
    UNION ALL
    
    -- Services PMI History
    SELECT 'SPMI' as data_type, id, asset_code, spmi_value as value1,
           spmi_forecast as value2, NULL as value3, NULL as value4,
           entry_type, changed_by, change_reason, created_at
    FROM services_pmi_history 
    WHERE asset_code = p_asset_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    
    UNION ALL
    
    -- Inflation History
    SELECT 'CPI' as data_type, id, asset_code, cpi_value as value1,
           cpi_forecast as value2, NULL as value3, NULL as value4,
           entry_type, changed_by, change_reason, created_at
    FROM inflation_data_history 
    WHERE asset_code = p_asset_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    
    UNION ALL
    
    -- Interest Rate History
    SELECT 'INTEREST' as data_type, id, asset_code, interest_rate as value1,
           NULL as value2, NULL as value3, NULL as value4,
           entry_type, changed_by, change_reason, created_at
    FROM interest_rate_history 
    WHERE asset_code = p_asset_code
    AND DATE(created_at) BETWEEN IFNULL(p_start_date, '2020-01-01') AND IFNULL(p_end_date, CURDATE())
    
    ORDER BY created_at DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDataChangesSummary` (IN `p_days_back` INT)   BEGIN
    DECLARE v_start_date DATE DEFAULT DATE_SUB(CURDATE(), INTERVAL IFNULL(p_days_back, 30) DAY);
    
    SELECT 
        'Retail Sentiment' as data_category,
        COUNT(*) as total_changes,
        COUNT(CASE WHEN entry_type = 'CREATE' THEN 1 END) as new_entries,
        COUNT(CASE WHEN entry_type = 'UPDATE' THEN 1 END) as updates,
        COUNT(DISTINCT asset_pair_code) as unique_assets,
        MIN(created_at) as first_change,
        MAX(created_at) as last_change
    FROM retail_sentiment_history 
    WHERE DATE(created_at) >= v_start_date
    
    UNION ALL
    
    SELECT 
        'COT Data' as data_category,
        COUNT(*) as total_changes,
        COUNT(CASE WHEN entry_type = 'CREATE' THEN 1 END) as new_entries,
        COUNT(CASE WHEN entry_type = 'UPDATE' THEN 1 END) as updates,
        COUNT(DISTINCT asset_code) as unique_assets,
        MIN(created_at) as first_change,
        MAX(created_at) as last_change
    FROM cot_data_history 
    WHERE DATE(created_at) >= v_start_date
    
    UNION ALL
    
    SELECT 
        'Manufacturing PMI' as data_category,
        COUNT(*) as total_changes,
        COUNT(CASE WHEN entry_type = 'CREATE' THEN 1 END) as new_entries,
        COUNT(CASE WHEN entry_type = 'UPDATE' THEN 1 END) as updates,
        COUNT(DISTINCT asset_code) as unique_assets,
        MIN(created_at) as first_change,
        MAX(created_at) as last_change
    FROM manufacturing_pmi_history 
    WHERE DATE(created_at) >= v_start_date
    
    UNION ALL
    
    SELECT 
        'Services PMI' as data_category,
        COUNT(*) as total_changes,
        COUNT(CASE WHEN entry_type = 'CREATE' THEN 1 END) as new_entries,
        COUNT(CASE WHEN entry_type = 'UPDATE' THEN 1 END) as updates,
        COUNT(DISTINCT asset_code) as unique_assets,
        MIN(created_at) as first_change,
        MAX(created_at) as last_change
    FROM services_pmi_history 
    WHERE DATE(created_at) >= v_start_date;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPerformanceStats` ()   BEGIN
  SELECT 
    'Database Performance Summary' as metric_type,
    (SELECT COUNT(*) FROM economic_data_summary) as total_asset_pairs,
    (SELECT COUNT(*) FROM cot_data_history) as total_cot_records,
    (SELECT COUNT(*) FROM retail_sentiment_history) as total_retail_sentiment_records,
    (SELECT COUNT(*) FROM employment_change_history) as total_employment_records,
    (SELECT COUNT(*) FROM unemployment_rate_history) as total_unemployment_records,
    (SELECT COUNT(*) FROM gdp_growth_history) as total_gdp_records,
    (SELECT COUNT(*) FROM mpmi_history) as total_mpmi_records,
    (SELECT COUNT(*) FROM spmi_history) as total_spmi_records,
    (SELECT COUNT(*) FROM retail_sales_history) as total_retail_sales_records,
    (SELECT COUNT(*) FROM core_inflation_history) as total_inflation_records,
    (SELECT COUNT(*) FROM interest_rate_history) as total_interest_rate_records,
    (SELECT COUNT(*) FROM nfp_history) as total_nfp_records,
    NOW() as report_timestamp;
    
  -- Show recent activity
  SELECT 
    'Recent Activity (Last 24 Hours)' as activity_type,
    COUNT(*) as total_updates
  FROM (
    SELECT created_at FROM cot_data_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM retail_sentiment_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM employment_change_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM unemployment_rate_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM gdp_growth_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM mpmi_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM spmi_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM retail_sales_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM core_inflation_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM interest_rate_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    UNION ALL
    SELECT created_at FROM nfp_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
  ) as recent_activity;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertCoreInflation` (IN `p_asset_code` VARCHAR(10), IN `p_core_inflation` DOUBLE, IN `p_forecast` DOUBLE, IN `p_net_change_percent` DOUBLE, IN `p_result` VARCHAR(30))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `core_inflation_history` 
  (`asset_code`, `core_inflation`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_core_inflation, p_forecast, p_net_change_percent, p_result);
  
  -- Update current table
  INSERT INTO `core_inflation` 
  (`asset_code`, `core_inflation`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_core_inflation, p_forecast, p_net_change_percent, p_result)
  ON DUPLICATE KEY UPDATE
    `core_inflation` = VALUES(`core_inflation`),
    `forecast` = VALUES(`forecast`),
    `net_change_percent` = VALUES(`net_change_percent`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET 
    `inflation_base_cpi` = p_core_inflation,
    `inflation_base_forecast` = p_forecast
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET 
    `inflation_quote_cpi` = p_core_inflation,
    `inflation_quote_forecast` = p_forecast
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertCOTData` (IN `p_asset_code` VARCHAR(10), IN `p_long_contracts` INT, IN `p_short_contracts` INT, IN `p_change_in_long` INT, IN `p_change_in_short` INT, IN `p_long_percent` DOUBLE, IN `p_short_percent` DOUBLE, IN `p_net_position` DOUBLE, IN `p_net_change_percent` DOUBLE)   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `cot_data_history` 
  (`asset_code`, `long_contracts`, `short_contracts`, `change_in_long`, `change_in_short`, 
   `long_percent`, `short_percent`, `net_position`, `net_change_percent`)
  VALUES 
  (p_asset_code, p_long_contracts, p_short_contracts, p_change_in_long, p_change_in_short,
   p_long_percent, p_short_percent, p_net_position, p_net_change_percent);
  
  -- Update current table
  INSERT INTO `cot_data` 
  (`asset_code`, `long_contracts`, `short_contracts`, `change_in_long`, `change_in_short`, 
   `long_percent`, `short_percent`, `net_position`, `net_change_percent`)
  VALUES 
  (p_asset_code, p_long_contracts, p_short_contracts, p_change_in_long, p_change_in_short,
   p_long_percent, p_short_percent, p_net_position, p_net_change_percent)
  ON DUPLICATE KEY UPDATE
    `long_contracts` = VALUES(`long_contracts`),
    `short_contracts` = VALUES(`short_contracts`),
    `change_in_long` = VALUES(`change_in_long`),
    `change_in_short` = VALUES(`change_in_short`),
    `long_percent` = VALUES(`long_percent`),
    `short_percent` = VALUES(`short_percent`),
    `net_position` = VALUES(`net_position`),
    `net_change_percent` = VALUES(`net_change_percent`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET 
    `cot_base_long_percent` = p_long_percent,
    `cot_base_short_percent` = p_short_percent,
    `cot_base_net_change_percent` = p_net_change_percent
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET 
    `cot_quote_long_percent` = p_long_percent,
    `cot_quote_short_percent` = p_short_percent,
    `cot_quote_net_change_percent` = p_net_change_percent
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores for affected pairs
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertEmploymentChange` (IN `p_asset_code` VARCHAR(10), IN `p_employment_change` DOUBLE, IN `p_forecast` DOUBLE, IN `p_net_change_percent` DOUBLE, IN `p_result` VARCHAR(20))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `employment_change_history` 
  (`asset_code`, `employment_change`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_employment_change, p_forecast, p_net_change_percent, p_result);
  
  -- Update current table
  INSERT INTO `employment_change` 
  (`asset_code`, `employment_change`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_employment_change, p_forecast, p_net_change_percent, p_result)
  ON DUPLICATE KEY UPDATE
    `employment_change` = VALUES(`employment_change`),
    `forecast` = VALUES(`forecast`),
    `net_change_percent` = VALUES(`net_change_percent`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET 
    `employment_base_change` = p_employment_change,
    `employment_base_forecast` = p_forecast
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET 
    `employment_quote_change` = p_employment_change,
    `employment_quote_forecast` = p_forecast
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertGDPGrowth` (IN `p_asset_code` VARCHAR(10), IN `p_gdp_growth` DOUBLE, IN `p_forecast` DOUBLE, IN `p_change_in_gdp` DOUBLE, IN `p_result` VARCHAR(20))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `gdp_growth_history` 
  (`asset_code`, `gdp_growth`, `forecast`, `change_in_gdp`, `result`)
  VALUES (p_asset_code, p_gdp_growth, p_forecast, p_change_in_gdp, p_result);
  
  -- Update current table
  INSERT INTO `gdp_growth` 
  (`asset_code`, `gdp_growth`, `forecast`, `change_in_gdp`, `result`)
  VALUES (p_asset_code, p_gdp_growth, p_forecast, p_change_in_gdp, p_result)
  ON DUPLICATE KEY UPDATE
    `gdp_growth` = VALUES(`gdp_growth`),
    `forecast` = VALUES(`forecast`),
    `change_in_gdp` = VALUES(`change_in_gdp`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET `gdp_base_result` = p_result
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET `gdp_quote_result` = p_result
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertInterestRate` (IN `p_asset_code` VARCHAR(10), IN `p_interest_rate` DOUBLE, IN `p_change_in_interest` DOUBLE)   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `interest_rate_history` 
  (`asset_code`, `interest_rate`, `change_in_interest`)
  VALUES (p_asset_code, p_interest_rate, p_change_in_interest);
  
  -- Update current table
  INSERT INTO `interest_rate` 
  (`asset_code`, `interest_rate`, `change_in_interest`)
  VALUES (p_asset_code, p_interest_rate, p_change_in_interest)
  ON DUPLICATE KEY UPDATE
    `interest_rate` = VALUES(`interest_rate`),
    `change_in_interest` = VALUES(`change_in_interest`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET `interest_base_change` = p_change_in_interest
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET `interest_quote_change` = p_change_in_interest
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertManufacturingPMI` (IN `p_asset_code` VARCHAR(10), IN `p_service_pmi` DOUBLE, IN `p_forecast` DOUBLE, IN `p_result` VARCHAR(20))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `mpmi_history` 
  (`asset_code`, `service_pmi`, `forecast`, `result`)
  VALUES (p_asset_code, p_service_pmi, p_forecast, p_result);
  
  -- Update current table
  INSERT INTO `mpmi` 
  (`asset_code`, `service_pmi`, `forecast`, `result`)
  VALUES (p_asset_code, p_service_pmi, p_forecast, p_result)
  ON DUPLICATE KEY UPDATE
    `service_pmi` = VALUES(`service_pmi`),
    `forecast` = VALUES(`forecast`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET `mpmi_base_result` = p_result
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET `mpmi_quote_result` = p_result
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertNFPData` (IN `p_asset_code` VARCHAR(10), IN `p_actual_nfp` DOUBLE, IN `p_forecast` DOUBLE, IN `p_net_change_percent` DOUBLE)   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Validate that this is USD only
  IF p_asset_code != 'USD' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NFP data can only be inserted for USD';
  END IF;
  
  -- Insert into history table
  INSERT INTO `nfp_history` 
  (`asset_code`, `actual_nfp`, `forecast`, `net_change_percent`)
  VALUES (p_asset_code, p_actual_nfp, p_forecast, p_net_change_percent);
  
  -- Update current table
  INSERT INTO `nfp` 
  (`asset_code`, `actual_nfp`, `forecast`, `net_change_percent`)
  VALUES (p_asset_code, p_actual_nfp, p_forecast, p_net_change_percent)
  ON DUPLICATE KEY UPDATE
    `actual_nfp` = VALUES(`actual_nfp`),
    `forecast` = VALUES(`forecast`),
    `net_change_percent` = VALUES(`net_change_percent`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- NFP affects employment scoring, so recalculate
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertRetailSales` (IN `p_asset_code` VARCHAR(10), IN `p_retail_sales` DOUBLE, IN `p_forecast` DOUBLE, IN `p_net_change_percent` DOUBLE, IN `p_result` VARCHAR(20))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `retail_sales_history` 
  (`asset_code`, `retail_sales`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_retail_sales, p_forecast, p_net_change_percent, p_result);
  
  -- Update current table
  INSERT INTO `retail_sales` 
  (`asset_code`, `retail_sales`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_retail_sales, p_forecast, p_net_change_percent, p_result)
  ON DUPLICATE KEY UPDATE
    `retail_sales` = VALUES(`retail_sales`),
    `forecast` = VALUES(`forecast`),
    `net_change_percent` = VALUES(`net_change_percent`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET `retail_sales_base_result` = p_result
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET `retail_sales_quote_result` = p_result
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertRetailSentiment` (IN `p_asset_pair_code` VARCHAR(20), IN `p_retail_long` DOUBLE, IN `p_retail_short` DOUBLE)   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `retail_sentiment_history` 
  (`asset_pair_code`, `retail_long`, `retail_short`)
  VALUES (p_asset_pair_code, p_retail_long, p_retail_short);
  
  -- Update current table
  INSERT INTO `retail_sentiment` 
  (`asset_pair_code`, `retail_long`, `retail_short`)
  VALUES (p_asset_pair_code, p_retail_long, p_retail_short)
  ON DUPLICATE KEY UPDATE
    `retail_long` = VALUES(`retail_long`),
    `retail_short` = VALUES(`retail_short`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table
  UPDATE `economic_data_summary` 
  SET 
    `retail_long_percent` = p_retail_long,
    `retail_short_percent` = p_retail_short
  WHERE `asset_pair_code` = p_asset_pair_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertServicesPMI` (IN `p_asset_code` VARCHAR(10), IN `p_service_pmi` DOUBLE, IN `p_forecast` DOUBLE, IN `p_result` VARCHAR(20))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `spmi_history` 
  (`asset_code`, `service_pmi`, `forecast`, `result`)
  VALUES (p_asset_code, p_service_pmi, p_forecast, p_result);
  
  -- Update current table
  INSERT INTO `spmi` 
  (`asset_code`, `service_pmi`, `forecast`, `result`)
  VALUES (p_asset_code, p_service_pmi, p_forecast, p_result)
  ON DUPLICATE KEY UPDATE
    `service_pmi` = VALUES(`service_pmi`),
    `forecast` = VALUES(`forecast`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET `spmi_base_result` = p_result
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET `spmi_quote_result` = p_result
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertUnemploymentRate` (IN `p_asset_code` VARCHAR(10), IN `p_unemployment_rate` DOUBLE, IN `p_forecast` DOUBLE, IN `p_net_change_percent` DOUBLE, IN `p_result` VARCHAR(20))   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Insert into history table
  INSERT INTO `unemployment_rate_history` 
  (`asset_code`, `unemployment_rate`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_unemployment_rate, p_forecast, p_net_change_percent, p_result);
  
  -- Update current table
  INSERT INTO `unemployment_rate` 
  (`asset_code`, `unemployment_rate`, `forecast`, `net_change_percent`, `result`)
  VALUES (p_asset_code, p_unemployment_rate, p_forecast, p_net_change_percent, p_result)
  ON DUPLICATE KEY UPDATE
    `unemployment_rate` = VALUES(`unemployment_rate`),
    `forecast` = VALUES(`forecast`),
    `net_change_percent` = VALUES(`net_change_percent`),
    `result` = VALUES(`result`),
    `updated_at` = CURRENT_TIMESTAMP;
  
  -- Update summary table for base asset
  UPDATE `economic_data_summary` 
  SET 
    `unemployment_base_rate` = p_unemployment_rate,
    `unemployment_base_forecast` = p_forecast
  WHERE `base_asset` = p_asset_code;
  
  -- Update summary table for quote asset
  UPDATE `economic_data_summary` 
  SET 
    `unemployment_quote_rate` = p_unemployment_rate,
    `unemployment_quote_forecast` = p_forecast
  WHERE `quote_asset` = p_asset_code;
  
  -- Recalculate scores
  CALL `RecalculateScores`();
  
  COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ManageCOTData` (IN `p_asset_code` VARCHAR(10), IN `p_cot_long` DECIMAL(5,2), IN `p_cot_short` DECIMAL(5,2), IN `p_changed_by` VARCHAR(100), IN `p_change_reason` TEXT, IN `p_ip_address` VARCHAR(45), IN `p_user_agent` TEXT)   BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_prev_long DECIMAL(5,2) DEFAULT NULL;
    DECLARE v_prev_short DECIMAL(5,2) DEFAULT NULL;
    DECLARE v_entry_type ENUM('CREATE','UPDATE','DELETE') DEFAULT 'CREATE';
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if record exists
    SELECT COUNT(*), cot_long_contracts, cot_short_contracts 
    INTO v_exists, v_prev_long, v_prev_short
    FROM cot_data 
    WHERE asset_code = p_asset_code 
    AND DATE(created_at) = CURDATE();
    
    IF v_exists > 0 THEN
        SET v_entry_type = 'UPDATE';
        UPDATE cot_data 
        SET cot_long_contracts = p_cot_long,
            cot_short_contracts = p_cot_short,
            updated_at = NOW()
        WHERE asset_code = p_asset_code 
        AND DATE(created_at) = CURDATE();
    ELSE
        SET v_entry_type = 'CREATE';
        INSERT INTO cot_data (asset_code, cot_long_contracts, cot_short_contracts)
        VALUES (p_asset_code, p_cot_long, p_cot_short);
    END IF;
    
    -- Insert into history
    INSERT INTO cot_data_history (
        asset_code, cot_long_contracts, cot_short_contracts, entry_type,
        previous_long, previous_short, changed_by, change_reason,
        ip_address, user_agent, report_date
    ) VALUES (
        p_asset_code, p_cot_long, p_cot_short, v_entry_type,
        v_prev_long, v_prev_short, p_changed_by, p_change_reason,
        p_ip_address, p_user_agent, CURDATE()
    );
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ManageEmploymentData` (IN `p_asset_code` VARCHAR(10), IN `p_employee_change` DECIMAL(10,2), IN `p_employee_change_forecast` DECIMAL(10,2), IN `p_actual_nfp` DECIMAL(10,2), IN `p_nfp_forecast` DECIMAL(10,2), IN `p_changed_by` VARCHAR(100), IN `p_change_reason` TEXT, IN `p_ip_address` VARCHAR(45), IN `p_user_agent` TEXT)   BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_prev_values JSON DEFAULT NULL;
    DECLARE v_entry_type ENUM('CREATE','UPDATE','DELETE') DEFAULT 'CREATE';
    DECLARE v_data_type ENUM('EMPLOYMENT_CHANGE','NFP','BOTH') DEFAULT 'EMPLOYMENT_CHANGE';
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Determine data type
    IF p_employee_change IS NOT NULL AND p_actual_nfp IS NOT NULL THEN
        SET v_data_type = 'BOTH';
    ELSEIF p_actual_nfp IS NOT NULL THEN
        SET v_data_type = 'NFP';
    ELSE
        SET v_data_type = 'EMPLOYMENT_CHANGE';
    END IF;
    
    -- Handle Employment Change data
    IF p_employee_change IS NOT NULL THEN
        SELECT COUNT(*) INTO v_exists FROM employment_data 
        WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
        
        IF v_exists > 0 THEN
            SET v_entry_type = 'UPDATE';
            SELECT JSON_OBJECT(
                'employee_change', employee_change,
                'employee_change_forecast', employee_change_forecast
            ) INTO v_prev_values
            FROM employment_data 
            WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
            
            UPDATE employment_data 
            SET employee_change = p_employee_change,
                employee_change_forecast = p_employee_change_forecast,
                updated_at = NOW()
            WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
        ELSE
            SET v_entry_type = 'CREATE';
            INSERT INTO employment_data (asset_code, employee_change, employee_change_forecast)
            VALUES (p_asset_code, p_employee_change, p_employee_change_forecast);
        END IF;
    END IF;
    
    -- Handle NFP data if provided
    IF p_actual_nfp IS NOT NULL THEN
        -- NFP handling logic here (similar to employment change)
        -- Insert/Update nfp_data table
        INSERT INTO nfp_data (asset_code, actual_nfp, nfp_forecast)
        VALUES (p_asset_code, p_actual_nfp, p_nfp_forecast)
        ON DUPLICATE KEY UPDATE
        actual_nfp = p_actual_nfp,
        nfp_forecast = p_nfp_forecast,
        updated_at = NOW();
    END IF;
    
    -- Insert into history
    INSERT INTO employment_data_history (
        asset_code, employee_change, employee_change_forecast,
        actual_nfp, nfp_forecast, data_type, entry_type,
        previous_values, changed_by, change_reason,
        ip_address, user_agent, release_date
    ) VALUES (
        p_asset_code, p_employee_change, p_employee_change_forecast,
        p_actual_nfp, p_nfp_forecast, v_data_type, v_entry_type,
        v_prev_values, p_changed_by, p_change_reason,
        p_ip_address, p_user_agent, CURDATE()
    );
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ManageManufacturingPMI` (IN `p_asset_code` VARCHAR(10), IN `p_mpmi_value` DECIMAL(5,2), IN `p_mpmi_forecast` DECIMAL(5,2), IN `p_changed_by` VARCHAR(100), IN `p_change_reason` TEXT, IN `p_ip_address` VARCHAR(45), IN `p_user_agent` TEXT)   BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_prev_value DECIMAL(5,2) DEFAULT NULL;
    DECLARE v_prev_forecast DECIMAL(5,2) DEFAULT NULL;
    DECLARE v_entry_type ENUM('CREATE','UPDATE','DELETE') DEFAULT 'CREATE';
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    SELECT COUNT(*), mpmi_value, mpmi_forecast 
    INTO v_exists, v_prev_value, v_prev_forecast
    FROM manufacturing_pmi_data 
    WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
    
    IF v_exists > 0 THEN
        SET v_entry_type = 'UPDATE';
        UPDATE manufacturing_pmi_data 
        SET mpmi_value = p_mpmi_value,
            mpmi_forecast = p_mpmi_forecast,
            updated_at = NOW()
        WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
    ELSE
        SET v_entry_type = 'CREATE';
        INSERT INTO manufacturing_pmi_data (asset_code, mpmi_value, mpmi_forecast)
        VALUES (p_asset_code, p_mpmi_value, p_mpmi_forecast);
    END IF;
    
    INSERT INTO manufacturing_pmi_history (
        asset_code, mpmi_value, mpmi_forecast, entry_type,
        previous_value, previous_forecast, changed_by, change_reason,
        ip_address, user_agent, release_date
    ) VALUES (
        p_asset_code, p_mpmi_value, p_mpmi_forecast, v_entry_type,
        v_prev_value, v_prev_forecast, p_changed_by, p_change_reason,
        p_ip_address, p_user_agent, CURDATE()
    );
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ManageRetailSentiment` (IN `p_asset_pair_code` VARCHAR(20), IN `p_retail_long` DECIMAL(5,2), IN `p_retail_short` DECIMAL(5,2))   BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_prev_sales DOUBLE DEFAULT NULL;
    DECLARE v_prev_forecast DOUBLE DEFAULT NULL;
    DECLARE v_prev_change DOUBLE DEFAULT NULL;
    DECLARE v_prev_result VARCHAR(20) DEFAULT NULL;
    DECLARE v_entry_type ENUM('CREATE','UPDATE','DELETE') DEFAULT 'CREATE';
    DECLARE v_previous_values LONGTEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Check if record exists
    SELECT COUNT(*), retail_sales, forecast, net_change_percent, result
    INTO v_exists, v_prev_sales, v_prev_forecast, v_prev_change, v_prev_result
    FROM retail_sentiment
    WHERE asset_code = p_asset_code;

    IF v_exists > 0 THEN
        SET v_entry_type = 'UPDATE';

        -- Capture previous values as JSON
        SET v_previous_values = JSON_OBJECT(
            'retail_sales', v_prev_sales,
            'forecast', v_prev_forecast,
            'net_change_percent', v_prev_change,
            'result', v_prev_result
        );

        -- Update existing record
        UPDATE retail_sentiment
        SET retail_sales = p_retail_sales,
            forecast = p_forecast,
            net_change_percent = p_net_change_percent,
            result = p_result,
            created_at = NOW()
        WHERE asset_code = p_asset_code;

    ELSE
        SET v_entry_type = 'CREATE';
        SET v_previous_values = NULL;

        -- Insert new record
        INSERT INTO retail_sentiment (
            asset_code, retail_sales, forecast,
            net_change_percent, result, created_at
        ) VALUES (
            p_asset_code, p_retail_sales, p_forecast,
            p_net_change_percent, p_result, NOW()
        );
    END IF;

    -- Always insert into history
    INSERT INTO retail_sentiment_history (
        asset_code, retail_sales, forecast, net_change_percent,
        result, entry_type, previous_values, created_at
    ) VALUES (
        p_asset_code, p_retail_sales, p_forecast, p_net_change_percent,
        p_result, v_entry_type, v_previous_values, NOW()
    );

    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ManageServicesPMI` (IN `p_asset_code` VARCHAR(10), IN `p_spmi_value` DECIMAL(5,2), IN `p_spmi_forecast` DECIMAL(5,2), IN `p_changed_by` VARCHAR(100), IN `p_change_reason` TEXT, IN `p_ip_address` VARCHAR(45), IN `p_user_agent` TEXT)   BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_prev_value DECIMAL(5,2) DEFAULT NULL;
    DECLARE v_prev_forecast DECIMAL(5,2) DEFAULT NULL;
    DECLARE v_entry_type ENUM('CREATE','UPDATE','DELETE') DEFAULT 'CREATE';
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    SELECT COUNT(*), spmi_value, spmi_forecast 
    INTO v_exists, v_prev_value, v_prev_forecast
    FROM services_pmi_data 
    WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
    
    IF v_exists > 0 THEN
        SET v_entry_type = 'UPDATE';
        UPDATE services_pmi_data 
        SET spmi_value = p_spmi_value,
            spmi_forecast = p_spmi_forecast,
            updated_at = NOW()
        WHERE asset_code = p_asset_code AND DATE(created_at) = CURDATE();
    ELSE
        SET v_entry_type = 'CREATE';
        INSERT INTO services_pmi_data (asset_code, spmi_value, spmi_forecast)
        VALUES (p_asset_code, p_spmi_value, p_spmi_forecast);
    END IF;
    
    INSERT INTO services_pmi_history (
        asset_code, spmi_value, spmi_forecast, entry_type,
        previous_value, previous_forecast, changed_by, change_reason,
        ip_address, user_agent, release_date
    ) VALUES (
        p_asset_code, p_spmi_value, p_spmi_forecast, v_entry_type,
        v_prev_value, v_prev_forecast, p_changed_by, p_change_reason,
        p_ip_address, p_user_agent, CURDATE()
    );
    
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RecalculateScores` ()   BEGIN
  UPDATE `economic_data_summary` SET
    -- COT Score
    `cot_score` = COALESCE(
      (CASE WHEN `cot_base_net_change_percent` > 0 THEN 1 
            WHEN `cot_base_net_change_percent` < 0 THEN -1 
            ELSE 0 END) +
      (CASE WHEN `cot_quote_net_change_percent` > 0 THEN -1 
            WHEN `cot_quote_net_change_percent` < 0 THEN 1 
            ELSE 0 END), 0),
    
    -- Retail Position Score
    `retail_position_score` = COALESCE(
      CASE WHEN `retail_long_percent` > `retail_short_percent` THEN -1 ELSE 1 END, 0),
    
    -- Employment Score
    `employment_score` = COALESCE(
      (CASE WHEN `employment_base_change` > `employment_base_forecast` THEN 1 
            WHEN `employment_base_change` < `employment_base_forecast` THEN -1 
            ELSE 0 END) +
      (CASE WHEN `employment_quote_change` > `employment_quote_forecast` THEN -1 
            WHEN `employment_quote_change` < `employment_quote_forecast` THEN 1 
            ELSE 0 END), 0),
    
    -- Unemployment Score
    `unemployment_score` = COALESCE(
      (CASE WHEN `unemployment_base_rate` > `unemployment_base_forecast` THEN -1 
            WHEN `unemployment_base_rate` < `unemployment_base_forecast` THEN 1 
            ELSE 0 END) +
      (CASE WHEN `unemployment_quote_rate` > `unemployment_quote_forecast` THEN 1 
            WHEN `unemployment_quote_rate` < `unemployment_quote_forecast` THEN -1 
            ELSE 0 END), 0),
    
    -- GDP Score
    `gdp_score` = COALESCE(
      (CASE WHEN `gdp_base_result` = 'Beat' THEN 1 
            WHEN `gdp_base_result` IN ('Miss', 'Missed') THEN -1 
            ELSE 0 END) +
      (CASE WHEN `gdp_quote_result` = 'Beat' THEN -1 
            WHEN `gdp_quote_result` IN ('Miss', 'Missed') THEN 1 
            ELSE 0 END), 0),
    
    -- Manufacturing PMI Score
    `mpmi_score` = COALESCE(
      (CASE WHEN `mpmi_base_result` = 'Beat' THEN 1 
            WHEN `mpmi_base_result` IN ('Miss', 'Missed') THEN -1 
            ELSE 0 END) +
      (CASE WHEN `mpmi_quote_result` = 'Beat' THEN -1 
            WHEN `mpmi_quote_result` IN ('Miss', 'Missed') THEN 1 
            ELSE 0 END), 0),
    
    -- Services PMI Score
    `spmi_score` = COALESCE(
      (CASE WHEN `spmi_base_result` = 'Beat' THEN 1 
            WHEN `spmi_base_result` IN ('Miss', 'Missed') THEN -1 
            ELSE 0 END) +
      (CASE WHEN `spmi_quote_result` = 'Beat' THEN -1 
            WHEN `spmi_quote_result` IN ('Miss', 'Missed') THEN 1 
            ELSE 0 END), 0),
    
    -- Retail Sales Score
    `retail_sales_score` = COALESCE(
      (CASE WHEN `retail_sales_base_result` = 'Beat' THEN 1 
            WHEN `retail_sales_base_result` IN ('Miss', 'Missed') THEN -1 
            ELSE 0 END) +
      (CASE WHEN `retail_sales_quote_result` = 'Beat' THEN -1 
            WHEN `retail_sales_quote_result` IN ('Miss', 'Missed') THEN 1 
            ELSE 0 END), 0),
    
    -- Inflation Score
    `inflation_score` = COALESCE(
      (CASE WHEN `inflation_base_cpi` > `inflation_base_forecast` THEN 1 
            WHEN `inflation_base_cpi` < `inflation_base_forecast` THEN -1 
            ELSE 0 END) +
      (CASE WHEN `inflation_quote_cpi` > `inflation_quote_forecast` THEN -1 
            WHEN `inflation_quote_cpi` < `inflation_quote_forecast` THEN 1 
            ELSE 0 END), 0),
    
    -- Interest Rate Score
    `interest_rate_score` = COALESCE(
      (CASE WHEN `interest_base_change` > 0 THEN 1 
            WHEN `interest_base_change` < 0 THEN -1 
            ELSE 0 END) +
      (CASE WHEN `interest_quote_change` > 0 THEN -1 
            WHEN `interest_quote_change` < 0 THEN 1 
            ELSE 0 END), 0);
  
  -- Calculate total score and bias
  UPDATE `economic_data_summary` SET
    `total_score` = `cot_score` + `retail_position_score` + `employment_score` + 
                   `unemployment_score` + `gdp_score` + `mpmi_score` + `spmi_score` + 
                   `retail_sales_score` + `inflation_score` + `interest_rate_score`,
    `bias_output` = CASE 
      WHEN (`cot_score` + `retail_position_score` + `employment_score` + 
            `unemployment_score` + `gdp_score` + `mpmi_score` + `spmi_score` + 
            `retail_sales_score` + `inflation_score` + `interest_rate_score`) >= 12 THEN 'Very Bullish'
      WHEN (`cot_score` + `retail_position_score` + `employment_score` + 
            `unemployment_score` + `gdp_score` + `mpmi_score` + `spmi_score` + 
            `retail_sales_score` + `inflation_score` + `interest_rate_score`) >= 5 THEN 'Bullish'
      WHEN (`cot_score` + `retail_position_score` + `employment_score` + 
            `unemployment_score` + `gdp_score` + `mpmi_score` + `spmi_score` + 
            `retail_sales_score` + `inflation_score` + `interest_rate_score`) >= -4 THEN 'Neutral'
      WHEN (`cot_score` + `retail_position_score` + `employment_score` + 
            `unemployment_score` + `gdp_score` + `mpmi_score` + `spmi_score` + 
            `retail_sales_score` + `inflation_score` + `interest_rate_score`) >= -11 THEN 'Bearish'
      ELSE 'Very Bearish'
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RefreshAllScores` ()   BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Log the refresh operation
  INSERT INTO `activity_logs` (`action`, `description`, `created_at`)
  VALUES ('scores_refresh', 'Manual refresh of all economic scores triggered', NOW());
  
  -- Recalculate all scores
  CALL `RecalculateScores`();
  
  -- Update last_updated timestamp for all pairs
  UPDATE `economic_data_summary` 
  SET `last_updated` = CURRENT_TIMESTAMP;
  
  COMMIT;
  
  -- Return summary
  SELECT 
    COUNT(*) as total_pairs_updated,
    SUM(CASE WHEN bias_output = 'Very Bullish' THEN 1 ELSE 0 END) as very_bullish_count,
    SUM(CASE WHEN bias_output = 'Bullish' THEN 1 ELSE 0 END) as bullish_count,
    SUM(CASE WHEN bias_output = 'Neutral' THEN 1 ELSE 0 END) as neutral_count,
    SUM(CASE WHEN bias_output = 'Bearish' THEN 1 ELSE 0 END) as bearish_count,
    SUM(CASE WHEN bias_output = 'Very Bearish' THEN 1 ELSE 0 END) as very_bearish_count,
    NOW() as refresh_timestamp
  FROM `economic_data_summary`;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `roles` enum('student','admin','staff') NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_otp` int(11) NOT NULL,
  `reset_expr` timestamp(6) NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `roles`, `username`, `password`, `reset_otp`, `reset_expr`) VALUES
(1, 'student', 'test', 'test', 0, '2025-05-21 00:30:02.014214'),
(2, 'admin', 'admin', 'admin', 0, '2025-05-21 00:30:02.014214'),
(7, 'admin', 'Gimp', '5e1f0e062781b4bba659ddf21ca488509bd4d3b8110e4c5032986287015af6fa', 0, '2025-05-21 00:30:02.014214'),
(8, 'staff', 'janesmith85', '$2b$10$OzSQH5gU30AIxgq2mnCOI.3xmxrHxJCuUk/HT6w2B6b.RtfkGz002', 0, '2025-06-12 04:37:32.926879'),
(9, 'staff', 'janesmith20', '$2b$10$u84SVqHRRTQ7n.4PPmZZGu/Yn/r8MAExAr2Jdku.OO98vzpiEXG0m', 0, '2025-06-12 04:41:50.755652'),
(11, 'admin', 'Gimpy', 'ae135ad952a48300d66a514a2398c54b6e588c65f259dcb762b436fa5227e8ef', 0, '2025-05-21 00:30:02.014214'),
(12, 'student', 'diass', 'b3da6c475b259fe6e394263eff01e9f8c2c9ca86c4d2431eba76edac03da5a0c', 0, '2025-05-21 00:30:02.014214'),
(13, 'student', 'johndoe123', '$2b$10$iwISihQb1dXyZtfiCHxvceCwzp0Bbs2bPtFSSUcPYCMKpUK6zjhLm', 0, '2025-06-13 06:24:33.463561'),
(14, 'admin', 'Gimppy', '11ab273931c78ff884fed06896784f51c744247b0960ae1b2471046f5ea744c0', 0, '2025-05-21 00:30:02.014214'),
(16, 'admin', 'Gimpppy', '1934e21e63ad9968f3ec03f05072e0a108952c74366af65a9949296f5ffce311', 0, '2025-05-21 00:30:02.014214'),
(17, 'student', 'paul', '0cf5f61f9fc2247f39d5429b05e3e32ba7d9ac57427856a19f96f19321809c34', 0, '2025-05-21 00:30:02.014214'),
(18, 'admin', 'pop', '5574f4c951b6a843908f048f381e2dd49e0a0deb7c54ad74b5c13a72163f8c26', 0, '2025-05-21 00:30:02.014214'),
(19, 'student', 'heart', '6997853aaf0b5aba0373a52d2317ab141daa155d6f7ab6f354298e743247b216', 0, '2025-05-21 00:30:02.014214'),
(20, 'student', 'hearty', '076f87eb12de3c2e0639ad5227a0b4e66149b9915ac583e16d183c084d208e5e', 0, '2025-05-21 00:30:02.014214'),
(21, 'student', 'chinooo', '184a695874ffd3294b468b10edb1efc1c8aadfe01c8aae0af862d5c33990090a', 0, '2025-05-28 23:01:39.110632'),
(23, 'student', 'shit', '7f5b4e341b60aa12371f900a5f42bfc188dca32a910b8b32cf8d304442a219ab', 0, '2025-05-28 23:08:41.385883'),
(25, 'student', 'shity', '7f5b4e341b60aa12371f900a5f42bfc188dca32a910b8b32cf8d304442a219ab', 0, '2025-05-28 23:09:15.273822'),
(27, 'student', 'shitcy', '7f5b4e341b60aa12371f900a5f42bfc188dca32a910b8b32cf8d304442a219ab', 0, '2025-05-28 23:18:29.851031'),
(28, 'student', 'shitdcy', 'ea296c8c45df77e62d554d8ead53b80f682376aed03cd7b98687ce3147d964cc', 0, '2025-05-28 23:19:23.421288'),
(29, 'student', 'shivtdcy', 'ea296c8c45df77e62d554d8ead53b80f682376aed03cd7b98687ce3147d964cc', 0, '2025-05-28 23:20:18.435993'),
(30, 'student', 'shivgtdcy', 'f6cd106bb5ce0397c1293b845cc93b50c4870a6dd4a27978d668dd22537acc6d', 0, '2025-05-28 23:21:06.053310'),
(31, 'student', 'lappy', '5f2f5d619745d025069f93c61b5ce17e8850aeaea37ea91b467476aed37db688', 0, '2025-05-28 23:23:08.550558'),
(32, 'student', 'lappyy', 'bebe6395a30c1c283624d3a45e056ce4ba5e2c00c843961c88c43d8992404ca1', 0, '2025-05-28 23:25:25.697365'),
(33, 'student', 'popo', '93705e9727703ebd13390fba7949b4a4ef5dceed8b17e5480a914a21e5741976', 0, '2025-05-28 23:31:39.649782'),
(34, 'student', 'popop', 'a4b40f8675f8218a17a72a6f22a48536a57e5da5042bd9b040f5732030048a26', 527644, '2025-05-28 23:40:17.652000');

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_user_sessions`
-- (See below for the actual view)
--
CREATE TABLE `active_user_sessions` (
`id` int(11)
,`session_id` varchar(128)
,`account_id` int(11)
,`name` varchar(100)
,`username` varchar(50)
,`email` varchar(100)
,`ip_address` varchar(45)
,`user_agent` text
,`last_activity` timestamp
,`expires_at` datetime
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `account_id`, `action`, `description`, `ip_address`, `user_agent`, `metadata`, `created_at`) VALUES
(1, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-04 08:31:22'),
(2, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-04 08:32:46'),
(3, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-04 08:32:48'),
(4, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:39:28'),
(5, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:45:47'),
(6, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:57:29'),
(7, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:58:04'),
(8, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:21:51'),
(9, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:26:25'),
(10, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:27:42'),
(11, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:51:29'),
(12, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 06:58:17'),
(13, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:46:54'),
(14, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:48:04'),
(15, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:48:36'),
(16, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:49:31'),
(17, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:52:21'),
(18, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:52:34'),
(19, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:55:24'),
(20, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:55:36'),
(21, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:55:47'),
(22, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:58:37'),
(23, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:58:45'),
(24, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:01:05'),
(25, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:04:26'),
(26, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:05:40'),
(27, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:08:28'),
(31, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:13:42'),
(32, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:15:25'),
(33, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:15:36'),
(34, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:15:43'),
(35, 8, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-12 04:38:17'),
(36, 8, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-12 04:38:20'),
(37, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 04:03:37'),
(38, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 04:58:27'),
(39, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 05:00:15'),
(40, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:10:43'),
(41, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:33:53'),
(42, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:40:29'),
(43, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:40:44'),
(44, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:49:36'),
(45, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 07:18:29'),
(46, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 07:43:41'),
(47, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 07:53:34'),
(48, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 08:09:46'),
(49, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 08:24:44'),
(50, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 08:39:28'),
(51, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:01:41'),
(52, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:02:04'),
(53, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:04:45'),
(54, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:05:25'),
(55, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-17 03:53:59'),
(56, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-24 04:13:30');

-- --------------------------------------------------------

--
-- Stand-in structure for view `api_economic_summary`
-- (See below for the actual view)
--
CREATE TABLE `api_economic_summary` (
`asset_pair_code` varchar(20)
,`base_asset` varchar(10)
,`quote_asset` varchar(10)
,`description` text
,`total_score` int(11)
,`bias_output` varchar(20)
,`cot_score` int(11)
,`retail_position_score` int(11)
,`employment_score` int(11)
,`unemployment_score` int(11)
,`gdp_score` int(11)
,`mpmi_score` int(11)
,`spmi_score` int(11)
,`retail_sales_score` int(11)
,`inflation_score` int(11)
,`interest_rate_score` int(11)
,`last_updated` datetime
);

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Currency','Commodity') NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`code`, `name`, `type`, `description`, `created_at`, `updated_at`) VALUES
('AUD', 'Australian Dollar', 'Currency', 'Australian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CAD', 'Canadian Dollar', 'Currency', 'Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CHF', 'Swiss Franc', 'Currency', 'Swiss Currency', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('EUR', 'Euro', 'Currency', 'European Union Euro', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBP', 'British Pound', 'Currency', 'United Kingdom Pound', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('JPY', 'Japanese Yen', 'Currency', 'Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZD', 'New Zealand Dollar', 'Currency', 'New Zealand Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USD', 'US Dollar', 'Currency', 'United States Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAG', 'Silver', 'Commodity', 'Silver Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAU', 'Gold', 'Commodity', 'Gold Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUD', 'Australian Dollar', 'Currency', 'Australian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CAD', 'Canadian Dollar', 'Currency', 'Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CHF', 'Swiss Franc', 'Currency', 'Swiss Currency', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('EUR', 'Euro', 'Currency', 'European Union Euro', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBP', 'British Pound', 'Currency', 'United Kingdom Pound', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('JPY', 'Japanese Yen', 'Currency', 'Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZD', 'New Zealand Dollar', 'Currency', 'New Zealand Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USD', 'US Dollar', 'Currency', 'United States Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAG', 'Silver', 'Commodity', 'Silver Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAU', 'Gold', 'Commodity', 'Gold Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUD', 'Australian Dollar', 'Currency', 'Australian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CAD', 'Canadian Dollar', 'Currency', 'Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CHF', 'Swiss Franc', 'Currency', 'Swiss Currency', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('EUR', 'Euro', 'Currency', 'European Union Euro', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBP', 'British Pound', 'Currency', 'United Kingdom Pound', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('JPY', 'Japanese Yen', 'Currency', 'Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZD', 'New Zealand Dollar', 'Currency', 'New Zealand Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USD', 'US Dollar', 'Currency', 'United States Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAG', 'Silver', 'Commodity', 'Silver Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAU', 'Gold', 'Commodity', 'Gold Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `asset_pairs`
--

CREATE TABLE `asset_pairs` (
  `asset_pair_code` varchar(20) NOT NULL,
  `base_asset` varchar(10) NOT NULL,
  `quote_asset` varchar(10) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset_pairs`
--

INSERT INTO `asset_pairs` (`asset_pair_code`, `base_asset`, `quote_asset`, `description`, `created_at`, `updated_at`) VALUES
('AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURGBP', 'EUR', 'GBP', 'Euro / British Pound', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURGBP', 'EUR', 'GBP', 'Euro / British Pound', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURGBP', 'EUR', 'GBP', 'Euro / British Pound', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `asset_pair_scores`
--

CREATE TABLE `asset_pair_scores` (
  `id` int(11) NOT NULL,
  `asset_pair_code` varchar(20) NOT NULL,
  `base_asset` varchar(10) NOT NULL,
  `quote_asset` varchar(10) NOT NULL,
  `description` text DEFAULT NULL,
  `total_score` int(11) DEFAULT 0,
  `bias_output` enum('Very Bullish','Bullish','Neutral','Bearish','Very Bearish') DEFAULT 'Neutral',
  `cot_score` int(11) DEFAULT 0,
  `retail_position_score` int(11) DEFAULT 0,
  `employment_score` int(11) DEFAULT 0,
  `unemployment_score` int(11) DEFAULT 0,
  `gdp_score` int(11) DEFAULT 0,
  `mpmi_score` int(11) DEFAULT 0,
  `spmi_score` int(11) DEFAULT 0,
  `retail_sales_score` int(11) DEFAULT 0,
  `inflation_score` int(11) DEFAULT 0,
  `interest_rate_score` int(11) DEFAULT 0,
  `last_calculated` datetime DEFAULT current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_inflation`
--

CREATE TABLE `core_inflation` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `core_inflation` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_inflation`
--

INSERT INTO `core_inflation` (`id`, `asset_code`, `core_inflation`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(1, 'USD', 7.7, 8, 0, 'Higher than expected', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(2, 'USD', 7.1, 7.3, -7.79, 'Higher than expected', '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(3, 'USD', 7.1, 7.3, 0, 'Higher than expected', '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(4, 'EUR', 128.71, 128.73, 0, 'Higher than expected', '2025-06-27 18:13:25', '2025-06-27 18:13:25'),
(5, 'GBP', 1.4, 1.2, 0, 'Lower than expected', '2025-06-27 19:07:13', '2025-06-27 19:07:13'),
(6, 'GBP', 0.2, 0.2, -85.71, 'As Expected', '2025-06-27 19:07:19', '2025-06-27 19:07:19'),
(7, 'AUD', 2.4, 2.5, 0, 'Higher than expected', '2025-06-27 19:18:25', '2025-06-27 19:18:25'),
(8, 'AUD', 2.4, 2.3, 0, 'Lower than expected', '2025-06-27 19:18:30', '2025-06-27 19:18:30'),
(9, 'CAD', -0.1, -0.2, 0, 'Lower than expected', '2025-06-27 19:32:28', '2025-06-27 19:32:28'),
(10, 'CAD', 0.6, 0.5, -700, 'Lower than expected', '2025-06-27 19:32:35', '2025-06-27 19:32:35'),
(13, 'USD', 0.2, 0.3, -97.18, 'Higher than expected', '2025-06-30 11:49:04', '2025-06-30 11:49:04'),
(14, 'USD', 0.4, 0.3, 100, 'Lower than expected', '2025-06-30 11:49:11', '2025-06-30 11:49:11'),
(15, 'USD', 0.2, 0.3, -50, 'Higher than expected', '2025-06-30 11:49:18', '2025-06-30 11:49:18'),
(16, 'USD', 0.1, 0.3, -50, 'Higher than expected', '2025-06-30 11:49:25', '2025-06-30 11:49:25'),
(17, 'USD', 0.2, 0.3, 100, 'Higher than expected', '2025-06-30 11:49:33', '2025-06-30 11:49:33'),
(18, 'USD', 0.1, 0.3, -50, 'Higher than expected', '2025-06-30 11:49:38', '2025-06-30 11:49:38'),
(19, 'EUR', 0, 0, -100, 'As Expected', '2025-06-30 11:50:42', '2025-06-30 11:50:42'),
(20, 'GBP', 3.5, 3.3, 1650, 'Lower than expected', '2025-06-30 11:53:44', '2025-06-30 11:53:44'),
(21, 'GBP', 3.4, 3.4, -2.86, 'As Expected', '2025-06-30 11:53:51', '2025-06-30 11:53:51'),
(22, 'AUD', 2.4, 2.5, 0, 'Higher than expected', '2025-06-30 11:54:39', '2025-06-30 11:54:39'),
(23, 'AUD', 2.4, 2.3, 0, 'Lower than expected', '2025-06-30 11:54:45', '2025-06-30 11:54:45'),
(24, 'CAD', 1.7, 1.6, 183.33, 'Lower than expected', '2025-06-30 12:03:41', '2025-06-30 12:03:41'),
(25, 'CAD', 1.7, 1.7, 0, 'As Expected', '2025-06-30 12:03:47', '2025-06-30 12:03:47'),
(26, 'CHF', 0, 0.2, 0, 'Higher than expected', '2025-06-30 12:05:02', '2025-06-30 12:05:02'),
(27, 'CHF', -0.1, -0.1, 0, 'As Expected', '2025-06-30 12:05:11', '2025-06-30 12:05:11'),
(28, 'NZD', 0.5, 0.5, 0, 'As Expected', '2025-06-30 12:15:24', '2025-06-30 12:15:24'),
(29, 'NZD', 0.9, 0.7, 80, 'Lower than expected', '2025-06-30 12:15:32', '2025-06-30 12:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `core_inflation_history`
--

CREATE TABLE `core_inflation_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `core_inflation` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_inflation_history`
--

INSERT INTO `core_inflation_history` (`id`, `asset_code`, `core_inflation`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(6, 'USD', 0.2, 0.3, 0, 'Lower than expected', '2025-06-30 11:49:04', '2025-06-30 11:49:04'),
(7, 'USD', 0.4, 0.3, 0, 'Higher than expected', '2025-06-30 11:49:11', '2025-06-30 11:49:11'),
(8, 'USD', 0.2, 0.3, 0, 'Lower than expected', '2025-06-30 11:49:18', '2025-06-30 11:49:18'),
(9, 'USD', 0.1, 0.3, 0, 'Lower than expected', '2025-06-30 11:49:25', '2025-06-30 11:49:25'),
(10, 'USD', 0.2, 0.3, 0, 'Lower than expected', '2025-06-30 11:49:33', '2025-06-30 11:49:33'),
(11, 'USD', 0.1, 0.3, 0, 'Lower than expected', '2025-06-30 11:49:38', '2025-06-30 11:49:38'),
(12, 'EUR', 0, 0, 0, 'As Expected', '2025-06-30 11:50:42', '2025-06-30 11:50:42'),
(13, 'GBP', 3.5, 3.3, 0, 'Higher than expected', '2025-06-30 11:53:44', '2025-06-30 11:53:44'),
(14, 'GBP', 3.4, 3.4, 0, 'As Expected', '2025-06-30 11:53:51', '2025-06-30 11:53:51'),
(15, 'AUD', 2.4, 2.5, 0, 'Lower than expected', '2025-06-30 11:54:39', '2025-06-30 11:54:39'),
(16, 'AUD', 2.4, 2.3, 0, 'Higher than expected', '2025-06-30 11:54:45', '2025-06-30 11:54:45'),
(17, 'CAD', 1.7, 1.6, 0, 'Higher than expected', '2025-06-30 12:03:41', '2025-06-30 12:03:41'),
(18, 'CAD', 1.7, 1.7, 0, 'As Expected', '2025-06-30 12:03:47', '2025-06-30 12:03:47'),
(19, 'CHF', 0, 0.2, 0, 'Lower than expected', '2025-06-30 12:05:02', '2025-06-30 12:05:02'),
(20, 'CHF', -0.1, -0.1, 0, 'As Expected', '2025-06-30 12:05:11', '2025-06-30 12:05:11'),
(21, 'NZD', 0.5, 0.5, 0, 'As Expected', '2025-06-30 12:15:24', '2025-06-30 12:15:24'),
(22, 'NZD', 0.9, 0.7, 0, 'Higher than expected', '2025-06-30 12:15:32', '2025-06-30 12:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `cot_data`
--

CREATE TABLE `cot_data` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `long_contracts` int(11) NOT NULL,
  `short_contracts` int(11) NOT NULL,
  `change_in_long` int(11) NOT NULL,
  `change_in_short` int(11) NOT NULL,
  `long_percent` double NOT NULL,
  `short_percent` double NOT NULL,
  `net_position` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cot_data`
--

INSERT INTO `cot_data` (`id`, `asset_code`, `long_contracts`, `short_contracts`, `change_in_long`, `change_in_short`, `long_percent`, `short_percent`, `net_position`, `net_change_percent`, `created_at`, `updated_at`) VALUES
(0, 'USD', 45, 55, 0, 0, 44.94, 55.06, -10.120000000000005, 44.94, '2025-06-27 14:27:41', '2025-06-27 14:27:41'),
(0, 'EUR', 65, 35, 0, 0, 64.93, 35.07, 29.860000000000007, 64.93, '2025-06-27 17:55:15', '2025-06-27 17:55:15'),
(0, 'JPY', 80, 20, 0, 0, 79.7, 20.3, 59.400000000000006, 79.7, '2025-06-27 18:16:41', '2025-06-27 18:16:41'),
(0, 'GBP', 63, 37, 0, 0, 62.63, 37.37, 25.260000000000005, 62.63, '2025-06-27 18:56:13', '2025-06-27 18:56:13'),
(0, 'AUD', 19, 81, 0, 0, 18.96, 81.04, -62.080000000000005, 18.96, '2025-06-27 19:11:56', '2025-06-27 19:11:56'),
(0, 'CAD', 23, 77, 0, 0, 22.96, 77.04, -54.080000000000005, 22.96, '2025-06-27 19:20:51', '2025-06-27 19:20:51'),
(0, 'CHF', 22, 78, 0, 0, 21.93, 78.07, -56.13999999999999, 21.93, '2025-06-30 12:20:38', '2025-06-30 12:20:38'),
(0, 'NZD', 54, 46, 0, 0, 54.02, 45.98, 8.040000000000006, 54.02, '2025-06-30 12:21:44', '2025-06-30 12:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `cot_data_history`
--

CREATE TABLE `cot_data_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `long_contracts` int(11) NOT NULL,
  `short_contracts` int(11) NOT NULL,
  `change_in_long` int(11) NOT NULL,
  `change_in_short` int(11) NOT NULL,
  `long_percent` double NOT NULL,
  `short_percent` double NOT NULL,
  `net_position` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cot_data_history`
--

INSERT INTO `cot_data_history` (`id`, `asset_code`, `long_contracts`, `short_contracts`, `change_in_long`, `change_in_short`, `long_percent`, `short_percent`, `net_position`, `net_change_percent`, `created_at`, `updated_at`) VALUES
(3, 'USD', 45, 55, 0, 0, 44.94, 55.06, -10.120000000000005, 44.94, '2025-06-27 14:27:41', '2025-06-27 14:27:41'),
(4, 'EUR', 65, 35, 0, 0, 64.93, 35.07, 29.860000000000007, 64.93, '2025-06-27 17:55:15', '2025-06-27 17:55:15'),
(5, 'JPY', 80, 20, 0, 0, 79.7, 20.3, 59.400000000000006, 79.7, '2025-06-27 18:16:41', '2025-06-27 18:16:41'),
(6, 'GBP', 63, 37, 0, 0, 62.63, 37.37, 25.260000000000005, 62.63, '2025-06-27 18:56:13', '2025-06-27 18:56:13'),
(7, 'AUD', 19, 81, 0, 0, 18.96, 81.04, -62.080000000000005, 18.96, '2025-06-27 19:11:56', '2025-06-27 19:11:56'),
(8, 'CAD', 23, 77, 0, 0, 22.96, 77.04, -54.080000000000005, 22.96, '2025-06-27 19:20:51', '2025-06-27 19:20:51'),
(9, 'CHF', 22, 78, 0, 0, 21.93, 78.07, -56.13999999999999, 21.93, '2025-06-30 12:20:38', '2025-06-30 12:20:38'),
(10, 'NZD', 54, 46, 0, 0, 54.02, 45.98, 8.040000000000006, 54.02, '2025-06-30 12:21:44', '2025-06-30 12:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `economic_data_summary`
--

CREATE TABLE `economic_data_summary` (
  `id` int(11) NOT NULL,
  `asset_pair_code` varchar(20) NOT NULL,
  `base_asset` varchar(10) NOT NULL,
  `quote_asset` varchar(10) NOT NULL,
  `description` text NOT NULL,
  `cot_base_long_percent` double DEFAULT NULL,
  `cot_base_short_percent` double DEFAULT NULL,
  `cot_base_net_change_percent` double DEFAULT NULL,
  `cot_quote_long_percent` double DEFAULT NULL,
  `cot_quote_short_percent` double DEFAULT NULL,
  `cot_quote_net_change_percent` double DEFAULT NULL,
  `retail_long_percent` double DEFAULT NULL,
  `retail_short_percent` double DEFAULT NULL,
  `employment_base_change` double DEFAULT NULL,
  `employment_base_forecast` double DEFAULT NULL,
  `employment_quote_change` double DEFAULT NULL,
  `employment_quote_forecast` double DEFAULT NULL,
  `unemployment_base_rate` double DEFAULT NULL,
  `unemployment_base_forecast` double DEFAULT NULL,
  `unemployment_quote_rate` double DEFAULT NULL,
  `unemployment_quote_forecast` double DEFAULT NULL,
  `gdp_base_result` varchar(20) DEFAULT NULL,
  `gdp_quote_result` varchar(20) DEFAULT NULL,
  `mpmi_base_result` varchar(20) DEFAULT NULL,
  `mpmi_quote_result` varchar(20) DEFAULT NULL,
  `spmi_base_result` varchar(20) DEFAULT NULL,
  `spmi_quote_result` varchar(20) DEFAULT NULL,
  `retail_sales_base_result` varchar(20) DEFAULT NULL,
  `retail_sales_quote_result` varchar(20) DEFAULT NULL,
  `inflation_base_cpi` double DEFAULT NULL,
  `inflation_base_forecast` double DEFAULT NULL,
  `inflation_quote_cpi` double DEFAULT NULL,
  `inflation_quote_forecast` double DEFAULT NULL,
  `interest_base_change` double DEFAULT NULL,
  `interest_quote_change` double DEFAULT NULL,
  `cot_score` int(11) DEFAULT 0,
  `retail_position_score` int(11) DEFAULT 0,
  `employment_score` int(11) DEFAULT 0,
  `unemployment_score` int(11) DEFAULT 0,
  `gdp_score` int(11) DEFAULT 0,
  `mpmi_score` int(11) DEFAULT 0,
  `spmi_score` int(11) DEFAULT 0,
  `retail_sales_score` int(11) DEFAULT 0,
  `inflation_score` int(11) DEFAULT 0,
  `interest_rate_score` int(11) DEFAULT 0,
  `total_score` int(11) DEFAULT 0,
  `bias_output` varchar(20) DEFAULT 'Neutral',
  `last_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `economic_data_summary`
--

INSERT INTO `economic_data_summary` (`id`, `asset_pair_code`, `base_asset`, `quote_asset`, `description`, `cot_base_long_percent`, `cot_base_short_percent`, `cot_base_net_change_percent`, `cot_quote_long_percent`, `cot_quote_short_percent`, `cot_quote_net_change_percent`, `retail_long_percent`, `retail_short_percent`, `employment_base_change`, `employment_base_forecast`, `employment_quote_change`, `employment_quote_forecast`, `unemployment_base_rate`, `unemployment_base_forecast`, `unemployment_quote_rate`, `unemployment_quote_forecast`, `gdp_base_result`, `gdp_quote_result`, `mpmi_base_result`, `mpmi_quote_result`, `spmi_base_result`, `spmi_quote_result`, `retail_sales_base_result`, `retail_sales_quote_result`, `inflation_base_cpi`, `inflation_base_forecast`, `inflation_quote_cpi`, `inflation_quote_forecast`, `interest_base_change`, `interest_quote_change`, `cot_score`, `retail_position_score`, `employment_score`, `unemployment_score`, `gdp_score`, `mpmi_score`, `spmi_score`, `retail_sales_score`, `inflation_score`, `interest_rate_score`, `total_score`, `bias_output`, `last_updated`, `created_at`) VALUES
(1, 'AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(2, 'AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(3, 'AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(4, 'AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(5, 'AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(6, 'CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(7, 'CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(8, 'EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(9, 'EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(10, 'EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(11, 'EURGBP', 'EUR', 'GBP', 'Euro / British Pound', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(12, 'EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(13, 'EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(14, 'EURUSD', 'EUR', 'USD', 'Euro / US Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(15, 'GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(16, 'GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(17, 'GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(18, 'GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(19, 'GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(20, 'GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(21, 'NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(22, 'NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(23, 'NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(24, 'NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(25, 'USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(26, 'USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(27, 'USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(28, 'XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40'),
(29, 'XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Neutral', '2025-06-23 17:14:40', '2025-06-23 17:14:40');

-- --------------------------------------------------------

--
-- Table structure for table `employment_change`
--

CREATE TABLE `employment_change` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `employment_change` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment_change`
--

INSERT INTO `employment_change` (`id`, `asset_code`, `employment_change`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 0.9, 0.9, 0, 'As Expected', '2025-06-27 14:27:41', '2025-06-27 14:27:41'),
(0, 'USD', 0.9, 0.9, 0, 'As Expected', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(0, 'EUR', 0.2, 0.3, 0, 'Missed', '2025-06-27 17:55:15', '2025-06-27 17:55:15'),
(0, 'EUR', 0.7, 0.8, 250, 'Missed', '2025-06-27 17:55:22', '2025-06-27 17:55:22'),
(0, 'JPY', 0.9, 0, 0, 'Beat', '2025-06-27 18:26:59', '2025-06-27 18:26:59'),
(0, 'GBP', 112000, 120000, 0, 'Missed', '2025-06-27 18:59:12', '2025-06-27 18:59:12'),
(0, 'AUD', 89000, 20000, 0, 'Beat', '2025-06-27 19:12:37', '2025-06-27 19:12:37'),
(0, 'AUD', -2500, 25000, -102.81, 'Missed', '2025-06-27 19:12:51', '2025-06-27 19:12:51'),
(0, 'CAD', 7.4, 2.5, 0, 'Beat', '2025-06-27 19:24:52', '2025-06-27 19:24:52'),
(0, 'CAD', 8800, -15000, 118818.92, 'Beat', '2025-06-27 19:25:16', '2025-06-27 19:25:16'),
(0, 'NZD', -0.1, -0.2, 0, 'Beat', '2025-06-30 12:41:25', '2025-06-30 12:41:25'),
(0, 'NZD', 0.1, 0.1, -200, 'As Expected', '2025-06-30 12:41:36', '2025-06-30 12:41:36');

-- --------------------------------------------------------

--
-- Table structure for table `employment_change_history`
--

CREATE TABLE `employment_change_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `employment_change` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment_change_history`
--

INSERT INTO `employment_change_history` (`id`, `asset_code`, `employment_change`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(7, 'USD', 0.9, 0.9, 0, 'As Expected', '2025-06-27 14:27:41', '2025-06-27 14:27:41'),
(8, 'USD', 0.9, 0.9, 0, 'As Expected', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(9, 'EUR', 0.2, 0.3, 0, 'Missed', '2025-06-27 17:55:15', '2025-06-27 17:55:15'),
(10, 'EUR', 0.7, 0.8, 0, 'Missed', '2025-06-27 17:55:22', '2025-06-27 17:55:22'),
(11, 'JPY', 0.9, 0, 0, 'Beat', '2025-06-27 18:26:59', '2025-06-27 18:26:59'),
(12, 'GBP', 112000, 120000, 0, 'Missed', '2025-06-27 18:59:11', '2025-06-27 18:59:11'),
(13, 'AUD', 89000, 20000, 0, 'Beat', '2025-06-27 19:12:37', '2025-06-27 19:12:37'),
(14, 'AUD', -2500, 25000, 0, 'Missed', '2025-06-27 19:12:51', '2025-06-27 19:12:51'),
(15, 'CAD', 7.4, 2.5, 0, 'Beat', '2025-06-27 19:24:52', '2025-06-27 19:24:52'),
(16, 'CAD', 8800, -15000, 0, 'Beat', '2025-06-27 19:25:16', '2025-06-27 19:25:16'),
(17, 'NZD', -0.1, -0.2, 0, 'Beat', '2025-06-30 12:41:25', '2025-06-30 12:41:25'),
(18, 'NZD', 0.1, 0.1, 0, 'As Expected', '2025-06-30 12:41:36', '2025-06-30 12:41:36');

-- --------------------------------------------------------

--
-- Table structure for table `gdp_growth`
--

CREATE TABLE `gdp_growth` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `gdp_growth` double NOT NULL,
  `forecast` double NOT NULL,
  `change_in_gdp` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gdp_growth`
--

INSERT INTO `gdp_growth` (`id`, `asset_code`, `gdp_growth`, `forecast`, `change_in_gdp`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 2, 3.3, 0, 'Missed', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(0, 'USD', 3.3, 3.2, 1.3, 'Beat', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(0, 'USD', 3.4, 3.2, 0.1, 'Beat', '2025-06-27 14:44:15', '2025-06-27 14:44:15'),
(0, 'USD', 1.6, 2.5, -1.8, 'Missed', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(0, 'USD', 1.3, 1.6, -0.3, 'Missed', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(0, 'USD', 1.4, 1.3, 0.1, 'Beat', '2025-06-27 15:01:49', '2025-06-27 15:01:49'),
(0, 'USD', 2.8, 2, 1.4, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(0, 'USD', 3, 2.8, 0.2, 'Beat', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(0, 'USD', 3, 3, 0, 'As Expected', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(0, 'USD', 2.8, 3, -0.2, 'Missed', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(0, 'USD', 2.8, 2.8, 0, 'As Expected', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(0, 'USD', 3.1, 2.8, 0.3, 'Beat', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(0, 'USD', 2.3, 2.7, -0.8, 'Missed', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(0, 'USD', 2.3, 2.3, 0, 'As Expected', '2025-06-27 15:13:01', '2025-06-27 15:13:01'),
(0, 'USD', -0.3, 0.2, -2.6, 'Missed', '2025-06-27 15:14:12', '2025-06-27 15:14:12'),
(0, 'USD', -0.2, -0.3, 0.1, 'Beat', '2025-06-27 15:14:54', '2025-06-27 15:14:54'),
(0, 'USD', -0.5, -0.2, -0.3, 'Missed', '2025-06-27 15:15:37', '2025-06-27 15:15:37'),
(0, 'EUR', 0, 0.1, 0, 'Missed', '2025-06-27 18:03:19', '2025-06-27 18:03:19'),
(0, 'EUR', 0.1, 0, 0.1, 'Beat', '2025-06-27 18:03:29', '2025-06-27 18:03:29'),
(0, 'EUR', 0.2, 0.1, 0.1, 'Beat', '2025-06-27 18:03:40', '2025-06-27 18:03:40'),
(0, 'EUR', 0.4, 0.2, 0.2, 'Beat', '2025-06-27 18:03:47', '2025-06-27 18:03:47'),
(0, 'EUR', 0.3, 0.4, -0.1, 'Missed', '2025-06-27 18:03:53', '2025-06-27 18:03:53'),
(0, 'EUR', 0.6, 0.3, 0.3, 'Beat', '2025-06-27 18:04:00', '2025-06-27 18:04:00'),
(0, 'JPY', 0.7, 0.3, 0, 'Beat', '2025-06-27 18:29:13', '2025-06-27 18:29:13'),
(0, 'JPY', 0.6, 0.7, -0.1, 'Missed', '2025-06-27 18:29:24', '2025-06-27 18:29:24'),
(0, 'JPY', -0.2, -0.1, -0.8, 'Missed', '2025-06-27 18:29:34', '2025-06-27 18:29:34'),
(0, 'JPY', 0, -0.2, 0.2, 'Beat', '2025-06-27 18:29:46', '2025-06-27 18:29:46'),
(0, 'GBP', 0.1, 0.2, 0, 'Missed', '2025-06-27 19:00:08', '2025-06-27 19:00:08'),
(0, 'GBP', 0.4, 0.1, 0.3, 'Beat', '2025-06-27 19:00:15', '2025-06-27 19:00:15'),
(0, 'GBP', -0.1, 0.1, -0.5, 'Missed', '2025-06-27 19:00:25', '2025-06-27 19:00:25'),
(0, 'GBP', 0.5, 0.1, 0.6, 'Beat', '2025-06-27 19:00:30', '2025-06-27 19:00:30'),
(0, 'GBP', 0.2, 0, -0.3, 'Beat', '2025-06-27 19:00:36', '2025-06-27 19:00:36'),
(0, 'GBP', -0.3, -0.1, -0.5, 'Missed', '2025-06-27 19:00:43', '2025-06-27 19:00:43'),
(0, 'AUD', 0.6, 0.5, 0, 'Beat', '2025-06-27 19:13:28', '2025-06-27 19:13:28'),
(0, 'AUD', 0.2, 0.4, -0.4, 'Missed', '2025-06-27 19:13:34', '2025-06-27 19:13:34'),
(0, 'CAD', -0.2, -0.1, 0, 'Missed', '2025-06-27 19:27:56', '2025-06-27 19:27:56'),
(0, 'CHF', 0.2, 0.2, 0, 'As Expected', '2025-06-30 12:33:04', '2025-06-30 12:33:04'),
(0, 'CHF', 0.5, 0.4, 0.3, 'Beat', '2025-06-30 12:33:26', '2025-06-30 12:33:26'),
(0, 'NZD', 0.7, 0.4, 0, 'Beat', '2025-06-30 12:43:06', '2025-06-30 12:43:06'),
(0, 'NZD', 0.8, 0.7, 0.1, 'Beat', '2025-06-30 12:43:11', '2025-06-30 12:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `gdp_growth_history`
--

CREATE TABLE `gdp_growth_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `gdp_growth` double NOT NULL,
  `forecast` double NOT NULL,
  `change_in_gdp` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gdp_growth_history`
--

INSERT INTO `gdp_growth_history` (`id`, `asset_code`, `gdp_growth`, `forecast`, `change_in_gdp`, `result`, `created_at`, `updated_at`) VALUES
(5, 'USD', 2, 3.3, 0, 'Missed', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(6, 'USD', 3.3, 3.2, 0, 'Beat', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(7, 'USD', 3.4, 3.2, 0, 'Beat', '2025-06-27 14:44:15', '2025-06-27 14:44:15'),
(8, 'USD', 1.6, 2.5, 0, 'Missed', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(9, 'USD', 1.3, 1.6, 0, 'Missed', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(10, 'USD', 1.4, 1.3, 0, 'Beat', '2025-06-27 15:01:48', '2025-06-27 15:01:48'),
(11, 'USD', 2.8, 2, 0, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(12, 'USD', 3, 2.8, 0, 'Beat', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(13, 'USD', 3, 3, 0, 'As Expected', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(14, 'USD', 2.8, 3, 0, 'Missed', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(15, 'USD', 2.8, 2.8, 0, 'As Expected', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(16, 'USD', 3.1, 2.8, 0, 'Beat', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(17, 'USD', 2.3, 2.7, 0, 'Missed', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(18, 'USD', 2.3, 2.3, 0, 'As Expected', '2025-06-27 15:13:01', '2025-06-27 15:13:01'),
(19, 'USD', -0.3, 0.2, 0, 'Missed', '2025-06-27 15:14:12', '2025-06-27 15:14:12'),
(20, 'USD', -0.2, -0.3, 0, 'Beat', '2025-06-27 15:14:54', '2025-06-27 15:14:54'),
(21, 'USD', -0.5, -0.2, 0, 'Missed', '2025-06-27 15:15:37', '2025-06-27 15:15:37'),
(22, 'EUR', 0, 0.1, 0, 'Missed', '2025-06-27 18:03:19', '2025-06-27 18:03:19'),
(23, 'EUR', 0.1, 0, 0, 'Beat', '2025-06-27 18:03:29', '2025-06-27 18:03:29'),
(24, 'EUR', 0.2, 0.1, 0, 'Beat', '2025-06-27 18:03:40', '2025-06-27 18:03:40'),
(25, 'EUR', 0.4, 0.2, 0, 'Beat', '2025-06-27 18:03:47', '2025-06-27 18:03:47'),
(26, 'EUR', 0.3, 0.4, 0, 'Missed', '2025-06-27 18:03:53', '2025-06-27 18:03:53'),
(27, 'EUR', 0.6, 0.3, 0, 'Beat', '2025-06-27 18:04:00', '2025-06-27 18:04:00'),
(28, 'JPY', 0.7, 0.3, 0, 'Beat', '2025-06-27 18:29:13', '2025-06-27 18:29:13'),
(29, 'JPY', 0.6, 0.7, 0, 'Missed', '2025-06-27 18:29:24', '2025-06-27 18:29:24'),
(30, 'JPY', -0.2, -0.1, 0, 'Missed', '2025-06-27 18:29:34', '2025-06-27 18:29:34'),
(31, 'JPY', 0, -0.2, 0, 'Beat', '2025-06-27 18:29:46', '2025-06-27 18:29:46'),
(32, 'GBP', 0.1, 0.2, 0, 'Missed', '2025-06-27 19:00:08', '2025-06-27 19:00:08'),
(33, 'GBP', 0.4, 0.1, 0, 'Beat', '2025-06-27 19:00:15', '2025-06-27 19:00:15'),
(34, 'GBP', -0.1, 0.1, 0, 'Missed', '2025-06-27 19:00:25', '2025-06-27 19:00:25'),
(35, 'GBP', 0.5, 0.1, 0, 'Beat', '2025-06-27 19:00:30', '2025-06-27 19:00:30'),
(36, 'GBP', 0.2, 0, 0, 'Beat', '2025-06-27 19:00:36', '2025-06-27 19:00:36'),
(37, 'GBP', -0.3, -0.1, 0, 'Missed', '2025-06-27 19:00:43', '2025-06-27 19:00:43'),
(38, 'AUD', 0.6, 0.5, 0, 'Beat', '2025-06-27 19:13:28', '2025-06-27 19:13:28'),
(39, 'AUD', 0.2, 0.4, 0, 'Missed', '2025-06-27 19:13:34', '2025-06-27 19:13:34'),
(40, 'CAD', -0.2, -0.1, 0, 'Missed', '2025-06-27 19:27:56', '2025-06-27 19:27:56'),
(41, 'CHF', 0.2, 0.2, 0, 'As Expected', '2025-06-30 12:33:04', '2025-06-30 12:33:04'),
(42, 'CHF', 0.5, 0.4, 0, 'Beat', '2025-06-30 12:33:26', '2025-06-30 12:33:26'),
(43, 'NZD', 0.7, 0.4, 0, 'Beat', '2025-06-30 12:43:06', '2025-06-30 12:43:06'),
(44, 'NZD', 0.8, 0.7, 0, 'Beat', '2025-06-30 12:43:11', '2025-06-30 12:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `interest_rate`
--

CREATE TABLE `interest_rate` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `interest_rate` double NOT NULL,
  `change_in_interest` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interest_rate`
--

INSERT INTO `interest_rate` (`id`, `asset_code`, `interest_rate`, `change_in_interest`, `created_at`, `updated_at`) VALUES
(40, 'USD', 5.5, 0, '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(41, 'USD', 5.5, 0, '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(42, 'USD', 5.5, 0, '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(43, 'USD', 5.48, -0.02, '2025-06-27 17:42:31', '2025-06-27 17:42:31'),
(44, 'USD', 5.5, 0.02, '2025-06-27 17:43:20', '2025-06-27 17:43:20'),
(45, 'USD', 5.5, 0, '2025-06-27 17:43:29', '2025-06-27 17:43:29'),
(46, 'USD', 5.5, 0, '2025-06-27 17:43:36', '2025-06-27 17:43:36'),
(47, 'USD', 5.5, 0, '2025-06-27 17:43:40', '2025-06-27 17:43:40'),
(48, 'USD', 5.5, 0, '2025-06-27 17:43:44', '2025-06-27 17:43:44'),
(49, 'USD', 5.5, 0, '2025-06-27 17:43:47', '2025-06-27 17:43:47'),
(50, 'USD', 5.5, 0, '2025-06-27 17:43:52', '2025-06-27 17:43:52'),
(51, 'USD', 5.5, 0, '2025-06-27 17:43:59', '2025-06-27 17:43:59'),
(52, 'USD', 5, -0.5, '2025-06-27 17:44:16', '2025-06-27 17:44:16'),
(53, 'USD', 5, 0, '2025-06-27 17:44:48', '2025-06-27 17:44:48'),
(54, 'USD', 4.75, -0.25, '2025-06-27 17:44:55', '2025-06-27 17:44:55'),
(55, 'USD', 4.5, -0.25, '2025-06-27 17:44:59', '2025-06-27 17:44:59'),
(56, 'USD', 4.5, 0, '2025-06-27 17:45:03', '2025-06-27 17:45:03'),
(57, 'USD', 4.5, 0, '2025-06-27 17:45:07', '2025-06-27 17:45:07'),
(58, 'USD', 4.5, 0, '2025-06-27 17:45:11', '2025-06-27 17:45:11'),
(59, 'USD', 4.5, 0, '2025-06-27 17:45:15', '2025-06-27 17:45:15'),
(60, 'USD', 4.5, 0, '2025-06-27 17:45:19', '2025-06-27 17:45:19'),
(61, 'USD', 4.5, 0, '2025-06-27 17:45:23', '2025-06-27 17:45:23'),
(62, 'EUR', 2.9, 0, '2025-06-27 18:14:22', '2025-06-27 18:14:22'),
(63, 'EUR', 2.9, 0, '2025-06-27 18:14:28', '2025-06-27 18:14:28'),
(64, 'EUR', 2.65, -0.25, '2025-06-27 18:14:34', '2025-06-27 18:14:34'),
(65, 'EUR', 2.4, -0.25, '2025-06-27 18:14:39', '2025-06-27 18:14:39'),
(66, 'EUR', 2.4, 0, '2025-06-27 18:14:43', '2025-06-27 18:14:43'),
(67, 'EUR', 2.15, -0.25, '2025-06-27 18:14:49', '2025-06-27 18:14:49'),
(68, 'JPY', 0.5, 0, '2025-06-27 18:48:36', '2025-06-27 18:48:36'),
(69, 'JPY', 0.5, 0, '2025-06-27 18:48:40', '2025-06-27 18:48:40'),
(70, 'JPY', 0.5, 0, '2025-06-27 18:48:43', '2025-06-27 18:48:43'),
(71, 'JPY', 0.5, 0, '2025-06-27 18:48:47', '2025-06-27 18:48:47'),
(72, 'JPY', 0.5, 0, '2025-06-27 18:48:51', '2025-06-27 18:48:51'),
(73, 'JPY', 0.5, 0, '2025-06-27 18:48:57', '2025-06-27 18:48:57'),
(74, 'GBP', 4.75, 0, '2025-06-27 19:07:39', '2025-06-27 19:07:39'),
(75, 'GBP', 4.5, -0.25, '2025-06-27 19:07:43', '2025-06-27 19:07:43'),
(76, 'GBP', 4.5, 0, '2025-06-27 19:07:46', '2025-06-27 19:07:46'),
(77, 'GBP', 4.5, 0, '2025-06-27 19:07:50', '2025-06-27 19:07:50'),
(78, 'GBP', 4.25, -0.25, '2025-06-27 19:07:58', '2025-06-27 19:07:58'),
(79, 'GBP', 4.25, 0, '2025-06-27 19:08:04', '2025-06-27 19:08:04'),
(80, 'AUD', 4.34, 0, '2025-06-27 19:18:55', '2025-06-27 19:18:55'),
(81, 'AUD', 4.1, -0.24, '2025-06-27 19:18:59', '2025-06-27 19:18:59'),
(82, 'AUD', 4.1, 0, '2025-06-27 19:19:02', '2025-06-27 19:19:02'),
(83, 'AUD', 4.1, 0, '2025-06-27 19:19:06', '2025-06-27 19:19:06'),
(84, 'AUD', 3.85, -0.25, '2025-06-27 19:19:10', '2025-06-27 19:19:10'),
(85, 'AUD', 3.85, 0, '2025-06-27 19:19:14', '2025-06-27 19:19:14'),
(86, 'CAD', 3, 0, '2025-06-27 19:32:57', '2025-06-27 19:32:57'),
(87, 'CAD', 3, 0, '2025-06-27 19:33:01', '2025-06-27 19:33:01'),
(88, 'CAD', 2.75, -0.25, '2025-06-27 19:33:05', '2025-06-27 19:33:05'),
(89, 'CAD', 2.75, 0, '2025-06-27 19:33:09', '2025-06-27 19:33:09'),
(90, 'CAD', 2.75, 0, '2025-06-27 19:33:17', '2025-06-27 19:33:17'),
(91, 'CAD', 2.75, 0, '2025-06-27 19:33:20', '2025-06-27 19:33:20'),
(92, 'CHF', 0.5, 0, '2025-06-30 12:38:44', '2025-06-30 12:38:44'),
(93, 'CHF', 0.5, 0, '2025-06-30 12:38:48', '2025-06-30 12:38:48'),
(94, 'CHF', 0.25, -0.25, '2025-06-30 12:38:51', '2025-06-30 12:38:51'),
(95, 'CHF', 0.25, 0, '2025-06-30 12:38:55', '2025-06-30 12:38:55'),
(96, 'CHF', 0.25, 0, '2025-06-30 12:39:00', '2025-06-30 12:39:00'),
(97, 'NZD', 5.46, 0, '2025-06-30 12:50:20', '2025-06-30 12:50:20'),
(98, 'NZD', 5.46, 0, '2025-06-30 12:50:25', '2025-06-30 12:50:25'),
(99, 'NZD', 3.75, -1.71, '2025-06-30 12:50:29', '2025-06-30 12:50:29'),
(100, 'NZD', 3.25, -0.5, '2025-06-30 12:50:43', '2025-06-30 12:50:43');

-- --------------------------------------------------------

--
-- Table structure for table `interest_rate_history`
--

CREATE TABLE `interest_rate_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `interest_rate` double NOT NULL,
  `change_in_interest` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interest_rate_history`
--

INSERT INTO `interest_rate_history` (`id`, `asset_code`, `interest_rate`, `change_in_interest`, `created_at`, `updated_at`) VALUES
(1, 'CHF', 1, 0, '2025-06-27 11:40:34', '2025-06-27 11:40:34'),
(2, 'NZD', 2, 0, '2025-06-27 11:45:33', '2025-06-27 11:45:33'),
(3, 'NZD', 3, 0, '2025-06-27 11:47:09', '2025-06-27 11:47:09'),
(4, 'NZD', 1, 0, '2025-06-27 12:03:28', '2025-06-27 12:03:28'),
(5, 'NZD', 2, -2, '2025-06-27 12:16:13', '2025-06-27 12:16:13'),
(6, 'NZD', 4, 2, '2025-06-27 12:19:26', '2025-06-27 12:19:26'),
(7, 'NZD', 4.5, 0, '2025-06-27 12:21:07', '2025-06-27 12:21:07'),
(8, 'NZD', 3, -1, '2025-06-27 12:24:03', '2025-06-27 12:24:03'),
(9, 'USD', 2, -2.5, '2025-06-27 12:26:27', '2025-06-27 12:26:27'),
(10, 'NZD', 6, 3, '2025-06-27 12:26:57', '2025-06-27 12:26:57'),
(11, 'NZD', 4.5, 0, '2025-06-27 12:31:00', '2025-06-27 12:31:00'),
(12, 'NZD', 10, 6, '2025-06-27 12:45:20', '2025-06-27 12:45:20'),
(13, 'NZD', 11.05, 8.05, '2025-06-27 12:49:35', '2025-06-27 12:49:35'),
(14, 'NZD', 11, -0.05, '2025-06-27 12:49:53', '2025-06-27 12:49:53'),
(15, 'NZD', 11, 0, '2025-06-27 12:49:54', '2025-06-27 12:49:54'),
(16, 'NZD', 11, 0, '2025-06-27 12:49:54', '2025-06-27 12:49:54'),
(19, 'NZD', 2, -4, '2025-06-27 13:04:21', '2025-06-27 13:04:21'),
(20, 'NZD', 3, 0, '2025-06-27 13:07:39', '2025-06-27 13:07:39'),
(21, 'NZD', 67, 64, '2025-06-27 13:07:57', '2025-06-27 13:07:57'),
(22, 'USD', 5.5, 0, '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(23, 'USD', 5.5, 0, '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(24, 'USD', 5.5, 0, '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(25, 'USD', 5.48, -0.02, '2025-06-27 17:42:32', '2025-06-27 17:42:32'),
(26, 'USD', 5.5, 0.02, '2025-06-27 17:43:20', '2025-06-27 17:43:20'),
(27, 'USD', 5.5, 0, '2025-06-27 17:43:30', '2025-06-27 17:43:30'),
(28, 'USD', 5.5, 0, '2025-06-27 17:43:37', '2025-06-27 17:43:37'),
(29, 'USD', 5.5, 0, '2025-06-27 17:43:41', '2025-06-27 17:43:41'),
(30, 'USD', 5.5, 0, '2025-06-27 17:43:45', '2025-06-27 17:43:45'),
(31, 'USD', 5.5, 0, '2025-06-27 17:43:48', '2025-06-27 17:43:48'),
(32, 'USD', 5.5, 0, '2025-06-27 17:43:53', '2025-06-27 17:43:53'),
(33, 'USD', 5.5, 0, '2025-06-27 17:44:00', '2025-06-27 17:44:00'),
(34, 'USD', 5, -0.5, '2025-06-27 17:44:17', '2025-06-27 17:44:17'),
(35, 'USD', 5, 0, '2025-06-27 17:44:49', '2025-06-27 17:44:49'),
(36, 'USD', 4.75, -0.25, '2025-06-27 17:44:56', '2025-06-27 17:44:56'),
(37, 'USD', 4.5, -0.25, '2025-06-27 17:45:00', '2025-06-27 17:45:00'),
(38, 'USD', 4.5, 0, '2025-06-27 17:45:04', '2025-06-27 17:45:04'),
(39, 'USD', 4.5, 0, '2025-06-27 17:45:08', '2025-06-27 17:45:08'),
(40, 'USD', 4.5, 0, '2025-06-27 17:45:12', '2025-06-27 17:45:12'),
(41, 'USD', 4.5, 0, '2025-06-27 17:45:16', '2025-06-27 17:45:16'),
(42, 'USD', 4.5, 0, '2025-06-27 17:45:20', '2025-06-27 17:45:20'),
(43, 'USD', 4.5, 0, '2025-06-27 17:45:24', '2025-06-27 17:45:24'),
(44, 'EUR', 2.9, 0, '2025-06-27 18:14:23', '2025-06-27 18:14:23'),
(45, 'EUR', 2.9, 0, '2025-06-27 18:14:29', '2025-06-27 18:14:29'),
(46, 'EUR', 2.65, -0.25, '2025-06-27 18:14:35', '2025-06-27 18:14:35'),
(47, 'EUR', 2.4, -0.25, '2025-06-27 18:14:40', '2025-06-27 18:14:40'),
(48, 'EUR', 2.4, 0, '2025-06-27 18:14:44', '2025-06-27 18:14:44'),
(49, 'EUR', 2.15, -0.25, '2025-06-27 18:14:50', '2025-06-27 18:14:50'),
(50, 'JPY', 0.5, 0, '2025-06-27 18:48:37', '2025-06-27 18:48:37'),
(51, 'JPY', 0.5, 0, '2025-06-27 18:48:41', '2025-06-27 18:48:41'),
(52, 'JPY', 0.5, 0, '2025-06-27 18:48:44', '2025-06-27 18:48:44'),
(53, 'JPY', 0.5, 0, '2025-06-27 18:48:48', '2025-06-27 18:48:48'),
(54, 'JPY', 0.5, 0, '2025-06-27 18:48:52', '2025-06-27 18:48:52'),
(55, 'JPY', 0.5, 0, '2025-06-27 18:48:58', '2025-06-27 18:48:58'),
(56, 'GBP', 4.75, 0, '2025-06-27 19:07:40', '2025-06-27 19:07:40'),
(57, 'GBP', 4.5, -0.25, '2025-06-27 19:07:44', '2025-06-27 19:07:44'),
(58, 'GBP', 4.5, 0, '2025-06-27 19:07:47', '2025-06-27 19:07:47'),
(59, 'GBP', 4.5, 0, '2025-06-27 19:07:51', '2025-06-27 19:07:51'),
(60, 'GBP', 4.25, -0.25, '2025-06-27 19:07:59', '2025-06-27 19:07:59'),
(61, 'GBP', 4.25, 0, '2025-06-27 19:08:05', '2025-06-27 19:08:05'),
(62, 'AUD', 4.34, 0, '2025-06-27 19:18:55', '2025-06-27 19:18:55'),
(63, 'AUD', 4.1, -0.24, '2025-06-27 19:19:00', '2025-06-27 19:19:00'),
(64, 'AUD', 4.1, 0, '2025-06-27 19:19:03', '2025-06-27 19:19:03'),
(65, 'AUD', 4.1, 0, '2025-06-27 19:19:07', '2025-06-27 19:19:07'),
(66, 'AUD', 3.85, -0.25, '2025-06-27 19:19:11', '2025-06-27 19:19:11'),
(67, 'AUD', 3.85, 0, '2025-06-27 19:19:15', '2025-06-27 19:19:15'),
(68, 'AUD', 3.85, 0, '2025-06-27 19:32:57', '2025-06-27 19:32:57'),
(69, 'CAD', 3, 0, '2025-06-27 19:33:02', '2025-06-27 19:33:02'),
(70, 'CAD', 2.75, -0.25, '2025-06-27 19:33:06', '2025-06-27 19:33:06'),
(71, 'CAD', 2.75, 0, '2025-06-27 19:33:10', '2025-06-27 19:33:10'),
(72, 'CAD', 2.75, 0, '2025-06-27 19:33:18', '2025-06-27 19:33:18'),
(73, 'CAD', 2.75, 0, '2025-06-27 19:33:21', '2025-06-27 19:33:21'),
(74, 'CHF', 0.5, 0, '2025-06-30 12:38:45', '2025-06-30 12:38:45'),
(75, 'CHF', 0.5, 0, '2025-06-30 12:38:49', '2025-06-30 12:38:49'),
(76, 'CHF', 0.25, -0.25, '2025-06-30 12:38:52', '2025-06-30 12:38:52'),
(77, 'CHF', 0.25, 0, '2025-06-30 12:38:56', '2025-06-30 12:38:56'),
(78, 'CHF', 0.25, 0, '2025-06-30 12:39:01', '2025-06-30 12:39:01'),
(79, 'NZD', 5.46, 0, '2025-06-30 12:50:21', '2025-06-30 12:50:21'),
(80, 'NZD', 5.46, 0, '2025-06-30 12:50:26', '2025-06-30 12:50:26'),
(81, 'NZD', 3.75, -1.71, '2025-06-30 12:50:30', '2025-06-30 12:50:30'),
(82, 'NZD', 3.25, -0.5, '2025-06-30 12:50:44', '2025-06-30 12:50:44');

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_cot_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_cot_data` (
`id` int(11)
,`asset_code` varchar(10)
,`long_contracts` int(11)
,`short_contracts` int(11)
,`change_in_long` int(11)
,`change_in_short` int(11)
,`long_percent` double
,`short_percent` double
,`net_position` double
,`net_change_percent` double
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_employment_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_employment_data` (
`id` int(11)
,`asset_code` varchar(10)
,`employment_change` double
,`forecast` double
,`net_change_percent` double
,`result` varchar(20)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_gdp_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_gdp_data` (
`id` int(11)
,`asset_code` varchar(10)
,`gdp_growth` double
,`forecast` double
,`change_in_gdp` double
,`result` varchar(20)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_inflation_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_inflation_data` (
`id` int(11)
,`asset_code` varchar(10)
,`core_inflation` double
,`forecast` double
,`net_change_percent` double
,`result` varchar(30)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_interest_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_interest_data` (
`id` int(11)
,`asset_code` varchar(10)
,`interest_rate` double
,`change_in_interest` double
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_mpmi_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_mpmi_data` (
`id` int(11)
,`asset_code` varchar(10)
,`service_pmi` double
,`forecast` double
,`result` varchar(20)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_retail_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_retail_data` (
`id` int(11)
,`asset_code` varchar(10)
,`retail_sales` double
,`forecast` double
,`net_change_percent` double
,`result` varchar(20)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_sentiment_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_sentiment_data` (
`id` int(11)
,`asset_pair_code` varchar(20)
,`retail_long` double
,`retail_short` double
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_spmi_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_spmi_data` (
`id` int(11)
,`asset_code` varchar(10)
,`service_pmi` double
,`forecast` double
,`result` varchar(20)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `latest_unemployment_data`
-- (See below for the actual view)
--
CREATE TABLE `latest_unemployment_data` (
`id` int(11)
,`asset_code` varchar(10)
,`unemployment_rate` double
,`forecast` double
,`net_change_percent` double
,`result` varchar(20)
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Table structure for table `mpmi`
--

CREATE TABLE `mpmi` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `service_pmi` double NOT NULL,
  `forecast` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mpmi`
--

INSERT INTO `mpmi` (`id`, `asset_code`, `service_pmi`, `forecast`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 48.7, 49.8, 'Miss', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(0, 'USD', 48.5, 49.2, 'Miss', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(0, 'USD', 46.8, 48.8, 'Miss', '2025-06-27 14:44:15', '2025-06-27 14:44:15'),
(0, 'USD', 47.2, 47.5, 'Miss', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(0, 'USD', 47.2, 47.6, 'Miss', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(0, 'USD', 46.5, 47.6, 'Miss', '2025-06-27 15:01:48', '2025-06-27 15:01:48'),
(0, 'USD', 48.4, 47.7, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(0, 'USD', 49.3, 48.2, 'Beat', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(0, 'USD', 50.9, 49.3, 'Beat', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(0, 'USD', 50.9, 49.3, 'Beat', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(0, 'USD', 50.3, 50.6, 'Miss', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(0, 'USD', 49, 49.5, 'Miss', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(0, 'USD', 48.7, 48, 'Beat', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(0, 'USD', 48.5, 49.3, 'Miss', '2025-06-27 15:13:01', '2025-06-27 15:13:01'),
(0, 'EUR', 45.1, 45.2, 'Miss', '2025-06-27 18:04:37', '2025-06-27 18:04:37'),
(0, 'EUR', 46.6, 46.1, 'Beat', '2025-06-27 18:04:47', '2025-06-27 18:04:47'),
(0, 'EUR', 47.3, 46.9, 'Beat', '2025-06-27 18:05:06', '2025-06-27 18:05:06'),
(0, 'EUR', 47.6, 47.3, 'Beat', '2025-06-27 18:05:14', '2025-06-27 18:05:14'),
(0, 'EUR', 48.7, 48.3, 'Beat', '2025-06-27 18:05:24', '2025-06-27 18:05:24'),
(0, 'EUR', 48.6, 48.7, 'Miss', '2025-06-27 18:05:33', '2025-06-27 18:05:33'),
(0, 'EUR', 48.7, 47.4, 'Beat', '2025-06-27 18:05:40', '2025-06-27 18:05:40'),
(0, 'EUR', 49, 48.7, 'Beat', '2025-06-27 18:05:51', '2025-06-27 18:05:51'),
(0, 'EUR', 48.4, 49.2, 'Miss', '2025-06-27 18:05:58', '2025-06-27 18:05:58'),
(0, 'EUR', 49.4, 48.4, 'Beat', '2025-06-27 18:06:05', '2025-06-27 18:06:05'),
(0, 'EUR', 49.4, 49.58, 'Miss', '2025-06-27 18:06:13', '2025-06-27 18:06:13'),
(0, 'JPY', 48.8, 49.7, 'Miss', '2025-06-27 18:30:24', '2025-06-27 18:30:24'),
(0, 'JPY', 48.7, 48.8, 'Miss', '2025-06-27 18:30:32', '2025-06-27 18:30:32'),
(0, 'JPY', 48.9, 49, 'Miss', '2025-06-27 18:30:39', '2025-06-27 18:30:39'),
(0, 'JPY', 49, 48.9, 'Beat', '2025-06-27 18:30:49', '2025-06-27 18:30:49'),
(0, 'JPY', 48.3, 49.2, 'Miss', '2025-06-27 18:30:55', '2025-06-27 18:30:55'),
(0, 'JPY', 48.4, 48.3, 'Beat', '2025-06-27 18:31:03', '2025-06-27 18:31:03'),
(0, 'JPY', 48.5, 48.7, 'Miss', '2025-06-27 18:31:12', '2025-06-27 18:31:12'),
(0, 'JPY', 48.7, 48.5, 'Beat', '2025-06-27 18:31:19', '2025-06-27 18:31:19'),
(0, 'JPY', 49, 49, 'Met', '2025-06-27 18:31:26', '2025-06-27 18:31:26'),
(0, 'JPY', 49.4, 49, 'Beat', '2025-06-27 18:31:32', '2025-06-27 18:31:32'),
(0, 'JPY', 50.4, 49.5, 'Beat', '2025-06-27 18:31:39', '2025-06-27 18:31:39'),
(0, 'GBP', 47, 47.3, 'Miss', '2025-06-27 19:01:00', '2025-06-27 19:01:00'),
(0, 'GBP', 48.2, 46.9, 'Beat', '2025-06-27 19:01:08', '2025-06-27 19:01:08'),
(0, 'GBP', 48.3, 48.2, 'Beat', '2025-06-27 19:01:15', '2025-06-27 19:01:15'),
(0, 'GBP', 46.4, 48.5, 'Miss', '2025-06-27 19:01:21', '2025-06-27 19:01:21'),
(0, 'GBP', 46.9, 46.4, 'Beat', '2025-06-27 19:01:31', '2025-06-27 19:01:31'),
(0, 'GBP', 44.6, 47.3, 'Miss', '2025-06-27 19:01:40', '2025-06-27 19:01:40'),
(0, 'GBP', 44.9, 44.6, 'Beat', '2025-06-27 19:01:50', '2025-06-27 19:01:50'),
(0, 'GBP', 44, 44, 'Met', '2025-06-27 19:01:56', '2025-06-27 19:01:56'),
(0, 'GBP', 44.4, 44, 'Beat', '2025-06-27 19:02:05', '2025-06-27 19:02:05'),
(0, 'GBP', 45.1, 46.2, 'Miss', '2025-06-27 19:02:11', '2025-06-27 19:02:11'),
(0, 'GBP', 46.4, 45.1, 'Beat', '2025-06-27 19:02:44', '2025-06-27 19:02:44'),
(0, 'GBP', 47.7, 46.9, 'Beat', '2025-06-27 19:02:51', '2025-06-27 19:02:51'),
(0, 'AUD', 47.8, 48.2, 'Miss', '2025-06-27 19:13:52', '2025-06-27 19:13:52'),
(0, 'AUD', 49.8, 47.8, 'Beat', '2025-06-27 19:14:00', '2025-06-27 19:14:00'),
(0, 'AUD', 50.2, 50.2, 'Met', '2025-06-27 19:14:08', '2025-06-27 19:14:08'),
(0, 'AUD', 50.6, 50.2, 'Beat', '2025-06-27 19:14:13', '2025-06-27 19:14:13'),
(0, 'AUD', 50.4, 50.4, 'Met', '2025-06-27 19:14:19', '2025-06-27 19:14:19'),
(0, 'AUD', 52.6, 50.4, 'Beat', '2025-06-27 19:14:27', '2025-06-27 19:14:27'),
(0, 'AUD', 52.1, 52.6, 'Miss', '2025-06-27 19:14:37', '2025-06-27 19:14:37'),
(0, 'AUD', 51.7, 52.1, 'Miss', '2025-06-27 19:14:50', '2025-06-27 19:14:50'),
(0, 'AUD', 51.7, 51.7, 'Met', '2025-06-27 19:15:01', '2025-06-27 19:15:01'),
(0, 'AUD', 51.7, 51.7, 'Met', '2025-06-27 19:15:08', '2025-06-27 19:15:08'),
(0, 'AUD', 50, 51.7, 'Miss', '2025-06-27 19:15:17', '2025-06-27 19:15:17'),
(0, 'AUD', 51, 50, 'Beat', '2025-06-27 19:15:30', '2025-06-27 19:15:30'),
(0, 'CAD', 52.2, 51.9, 'Beat', '2025-06-27 19:29:01', '2025-06-27 19:29:01'),
(0, 'CAD', 47.8, 51.9, 'Miss', '2025-06-27 19:29:17', '2025-06-27 19:29:17'),
(0, 'CHF', 48.4, 48.4, 'Met', '2025-06-30 12:33:42', '2025-06-30 12:33:42'),
(0, 'CHF', 47.5, 49, 'Miss', '2025-06-30 12:33:49', '2025-06-30 12:33:49'),
(0, 'CHF', 49.6, 48.3, 'Beat', '2025-06-30 12:33:57', '2025-06-30 12:33:57'),
(0, 'CHF', 48.9, 50.4, 'Miss', '2025-06-30 12:34:05', '2025-06-30 12:34:05'),
(0, 'CHF', 45.8, 48.7, 'Miss', '2025-06-30 12:34:16', '2025-06-30 12:34:16'),
(0, 'CHF', 42.1, 48.1, 'Miss', '2025-06-30 12:34:27', '2025-06-30 12:34:27'),
(0, 'NZD', 45.9, 45.9, 'Met', '2025-06-30 12:46:58', '2025-06-30 12:46:58'),
(0, 'NZD', 51.4, 51.4, 'Met', '2025-06-30 12:47:07', '2025-06-30 12:47:07'),
(0, 'NZD', 53.9, 54.1, 'Miss', '2025-06-30 12:47:22', '2025-06-30 12:47:22'),
(0, 'NZD', 53.2, 53.2, 'Met', '2025-06-30 12:47:32', '2025-06-30 12:47:32'),
(0, 'NZD', 53.9, 53.3, 'Beat', '2025-06-30 12:47:40', '2025-06-30 12:47:40'),
(0, 'NZD', 47.5, 47.5, 'Met', '2025-06-30 12:47:54', '2025-06-30 12:47:54');

-- --------------------------------------------------------

--
-- Table structure for table `mpmi_history`
--

CREATE TABLE `mpmi_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `service_pmi` double NOT NULL,
  `forecast` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mpmi_history`
--

INSERT INTO `mpmi_history` (`id`, `asset_code`, `service_pmi`, `forecast`, `result`, `created_at`, `updated_at`) VALUES
(5, 'USD', 48.7, 49.8, 'Miss', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(6, 'USD', 48.5, 49.2, 'Miss', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(7, 'USD', 46.8, 48.8, 'Miss', '2025-06-27 14:44:15', '2025-06-27 14:44:15'),
(8, 'USD', 47.2, 47.5, 'Miss', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(9, 'USD', 47.2, 47.6, 'Miss', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(10, 'USD', 46.5, 47.6, 'Miss', '2025-06-27 15:01:48', '2025-06-27 15:01:48'),
(11, 'USD', 48.4, 47.7, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(12, 'USD', 49.3, 48.2, 'Beat', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(13, 'USD', 50.9, 49.3, 'Beat', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(14, 'USD', 50.9, 49.3, 'Beat', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(15, 'USD', 50.3, 50.6, 'Miss', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(16, 'USD', 49, 49.5, 'Miss', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(17, 'USD', 48.7, 48, 'Beat', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(18, 'USD', 48.5, 49.3, 'Miss', '2025-06-27 15:13:01', '2025-06-27 15:13:01'),
(19, 'EUR', 45.1, 45.2, 'Miss', '2025-06-27 18:04:37', '2025-06-27 18:04:37'),
(20, 'EUR', 46.6, 46.1, 'Beat', '2025-06-27 18:04:47', '2025-06-27 18:04:47'),
(21, 'EUR', 47.3, 46.9, 'Beat', '2025-06-27 18:05:06', '2025-06-27 18:05:06'),
(22, 'EUR', 47.6, 47.3, 'Beat', '2025-06-27 18:05:14', '2025-06-27 18:05:14'),
(23, 'EUR', 48.7, 48.3, 'Beat', '2025-06-27 18:05:24', '2025-06-27 18:05:24'),
(24, 'EUR', 48.6, 48.7, 'Miss', '2025-06-27 18:05:33', '2025-06-27 18:05:33'),
(25, 'EUR', 48.7, 47.4, 'Beat', '2025-06-27 18:05:40', '2025-06-27 18:05:40'),
(26, 'EUR', 49, 48.7, 'Beat', '2025-06-27 18:05:51', '2025-06-27 18:05:51'),
(27, 'EUR', 48.4, 49.2, 'Miss', '2025-06-27 18:05:58', '2025-06-27 18:05:58'),
(28, 'EUR', 49.4, 48.4, 'Beat', '2025-06-27 18:06:05', '2025-06-27 18:06:05'),
(29, 'EUR', 49.4, 49.58, 'Miss', '2025-06-27 18:06:13', '2025-06-27 18:06:13'),
(30, 'JPY', 48.8, 49.7, 'Miss', '2025-06-27 18:30:24', '2025-06-27 18:30:24'),
(31, 'JPY', 48.7, 48.8, 'Miss', '2025-06-27 18:30:32', '2025-06-27 18:30:32'),
(32, 'JPY', 48.9, 49, 'Miss', '2025-06-27 18:30:39', '2025-06-27 18:30:39'),
(33, 'JPY', 49, 48.9, 'Beat', '2025-06-27 18:30:49', '2025-06-27 18:30:49'),
(34, 'JPY', 48.3, 49.2, 'Miss', '2025-06-27 18:30:55', '2025-06-27 18:30:55'),
(35, 'JPY', 48.4, 48.3, 'Beat', '2025-06-27 18:31:03', '2025-06-27 18:31:03'),
(36, 'JPY', 48.5, 48.7, 'Miss', '2025-06-27 18:31:12', '2025-06-27 18:31:12'),
(37, 'JPY', 48.7, 48.5, 'Beat', '2025-06-27 18:31:19', '2025-06-27 18:31:19'),
(38, 'JPY', 49, 49, 'Met', '2025-06-27 18:31:26', '2025-06-27 18:31:26'),
(39, 'JPY', 49.4, 49, 'Beat', '2025-06-27 18:31:32', '2025-06-27 18:31:32'),
(40, 'JPY', 50.4, 49.5, 'Beat', '2025-06-27 18:31:39', '2025-06-27 18:31:39'),
(41, 'GBP', 47, 47.3, 'Miss', '2025-06-27 19:01:00', '2025-06-27 19:01:00'),
(42, 'GBP', 48.2, 46.9, 'Beat', '2025-06-27 19:01:08', '2025-06-27 19:01:08'),
(43, 'GBP', 48.3, 48.2, 'Beat', '2025-06-27 19:01:15', '2025-06-27 19:01:15'),
(44, 'GBP', 46.4, 48.5, 'Miss', '2025-06-27 19:01:21', '2025-06-27 19:01:21'),
(45, 'GBP', 46.9, 46.4, 'Beat', '2025-06-27 19:01:31', '2025-06-27 19:01:31'),
(46, 'GBP', 44.6, 47.3, 'Miss', '2025-06-27 19:01:40', '2025-06-27 19:01:40'),
(47, 'GBP', 44.9, 44.6, 'Beat', '2025-06-27 19:01:50', '2025-06-27 19:01:50'),
(48, 'GBP', 44, 44, 'Met', '2025-06-27 19:01:56', '2025-06-27 19:01:56'),
(49, 'GBP', 44.4, 44, 'Beat', '2025-06-27 19:02:05', '2025-06-27 19:02:05'),
(50, 'GBP', 45.1, 46.2, 'Miss', '2025-06-27 19:02:11', '2025-06-27 19:02:11'),
(51, 'GBP', 46.4, 45.1, 'Beat', '2025-06-27 19:02:44', '2025-06-27 19:02:44'),
(52, 'GBP', 47.7, 46.9, 'Beat', '2025-06-27 19:02:51', '2025-06-27 19:02:51'),
(53, 'AUD', 47.8, 48.2, 'Miss', '2025-06-27 19:13:52', '2025-06-27 19:13:52'),
(54, 'AUD', 49.8, 47.8, 'Beat', '2025-06-27 19:14:00', '2025-06-27 19:14:00'),
(55, 'AUD', 50.2, 50.2, 'Met', '2025-06-27 19:14:08', '2025-06-27 19:14:08'),
(56, 'AUD', 50.6, 50.2, 'Beat', '2025-06-27 19:14:13', '2025-06-27 19:14:13'),
(57, 'AUD', 50.4, 50.4, 'Met', '2025-06-27 19:14:19', '2025-06-27 19:14:19'),
(58, 'AUD', 52.6, 50.4, 'Beat', '2025-06-27 19:14:27', '2025-06-27 19:14:27'),
(59, 'AUD', 52.1, 52.6, 'Miss', '2025-06-27 19:14:37', '2025-06-27 19:14:37'),
(60, 'AUD', 51.7, 52.1, 'Miss', '2025-06-27 19:14:50', '2025-06-27 19:14:50'),
(61, 'AUD', 51.7, 51.7, 'Met', '2025-06-27 19:15:01', '2025-06-27 19:15:01'),
(62, 'AUD', 51.7, 51.7, 'Met', '2025-06-27 19:15:08', '2025-06-27 19:15:08'),
(63, 'AUD', 50, 51.7, 'Miss', '2025-06-27 19:15:17', '2025-06-27 19:15:17'),
(64, 'AUD', 51, 50, 'Beat', '2025-06-27 19:15:30', '2025-06-27 19:15:30'),
(65, 'CAD', 52.2, 51.9, 'Beat', '2025-06-27 19:29:01', '2025-06-27 19:29:01'),
(66, 'CAD', 47.8, 51.9, 'Miss', '2025-06-27 19:29:17', '2025-06-27 19:29:17'),
(67, 'CHF', 48.4, 48.4, 'Met', '2025-06-30 12:33:42', '2025-06-30 12:33:42'),
(68, 'CHF', 47.5, 49, 'Miss', '2025-06-30 12:33:49', '2025-06-30 12:33:49'),
(69, 'CHF', 49.6, 48.3, 'Beat', '2025-06-30 12:33:57', '2025-06-30 12:33:57'),
(70, 'CHF', 48.9, 50.4, 'Miss', '2025-06-30 12:34:05', '2025-06-30 12:34:05'),
(71, 'CHF', 45.8, 48.7, 'Miss', '2025-06-30 12:34:16', '2025-06-30 12:34:16'),
(72, 'CHF', 42.1, 48.1, 'Miss', '2025-06-30 12:34:27', '2025-06-30 12:34:27'),
(73, 'NZD', 45.9, 45.9, 'Met', '2025-06-30 12:46:58', '2025-06-30 12:46:58'),
(74, 'NZD', 51.4, 51.4, 'Met', '2025-06-30 12:47:07', '2025-06-30 12:47:07'),
(75, 'NZD', 53.9, 54.1, 'Miss', '2025-06-30 12:47:22', '2025-06-30 12:47:22'),
(76, 'NZD', 53.2, 53.2, 'Met', '2025-06-30 12:47:32', '2025-06-30 12:47:32'),
(77, 'NZD', 53.9, 53.3, 'Beat', '2025-06-30 12:47:40', '2025-06-30 12:47:40'),
(78, 'NZD', 47.5, 47.5, 'Met', '2025-06-30 12:47:54', '2025-06-30 12:47:54');

-- --------------------------------------------------------

--
-- Table structure for table `nfp`
--

CREATE TABLE `nfp` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `actual_nfp` double DEFAULT NULL,
  `forecast` double DEFAULT NULL,
  `net_change_percent` double DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nfp`
--

INSERT INTO `nfp` (`id`, `asset_code`, `actual_nfp`, `forecast`, `net_change_percent`, `created_at`, `updated_at`) VALUES
(0, 'USD', 139000, 130000, 0, '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(0, 'USD', 353000, 187000, 153.96, '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(0, 'USD', 275000, 198000, -22.1, '2025-06-27 14:44:15', '2025-06-27 14:44:15'),
(0, 'USD', 303000, 212000, 10.18, '2025-06-27 14:50:44', '2025-06-27 14:50:44'),
(0, 'USD', 175000, 238000, -42.24, '2025-06-27 14:51:01', '2025-06-27 14:51:01'),
(0, 'USD', 272000, 182000, 55.43, '2025-06-27 14:51:10', '2025-06-27 14:51:10'),
(0, 'USD', 206000, 191000, -24.26, '2025-06-27 14:51:22', '2025-06-27 14:51:22'),
(0, 'USD', 114000, 176000, -44.66, '2025-06-27 14:51:30', '2025-06-27 14:51:30'),
(0, 'USD', 142000, 164000, 24.56, '2025-06-27 14:51:39', '2025-06-27 14:51:39'),
(0, 'USD', 254000, 147000, 78.87, '2025-06-27 14:51:50', '2025-06-27 14:51:50'),
(0, 'USD', 12000, 106000, -95.28, '2025-06-27 14:52:00', '2025-06-27 14:52:00'),
(0, 'USD', 227000, 202000, 1791.67, '2025-06-27 14:52:10', '2025-06-27 14:52:10'),
(0, 'USD', 256000, 164000, 12.78, '2025-06-27 14:52:19', '2025-06-27 14:52:19'),
(0, 'USD', 143000, 169000, -44.14, '2025-06-27 14:52:28', '2025-06-27 14:52:28'),
(0, 'USD', 151000, 159000, 5.59, '2025-06-27 14:52:38', '2025-06-27 14:52:38'),
(0, 'USD', 228000, 137000, 50.99, '2025-06-27 14:52:45', '2025-06-27 14:52:45'),
(0, 'USD', 117000, 138000, -48.68, '2025-06-27 14:52:54', '2025-06-27 14:52:54'),
(0, 'USD', 139000, 126000, 18.8, '2025-06-27 14:53:03', '2025-06-27 14:53:03');

-- --------------------------------------------------------

--
-- Table structure for table `nfp_history`
--

CREATE TABLE `nfp_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `actual_nfp` double DEFAULT NULL,
  `forecast` double DEFAULT NULL,
  `net_change_percent` double DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nfp_history`
--

INSERT INTO `nfp_history` (`id`, `asset_code`, `actual_nfp`, `forecast`, `net_change_percent`, `created_at`, `updated_at`) VALUES
(1, 'USD', 139000, 130000, 0, '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(2, 'USD', 353000, 187000, 0, '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(3, 'USD', 275000, 198000, 0, '2025-06-27 14:44:15', '2025-06-27 14:44:15'),
(4, 'USD', 303000, 212000, 0, '2025-06-27 14:50:43', '2025-06-27 14:50:43'),
(5, 'USD', 175000, 238000, 0, '2025-06-27 14:51:01', '2025-06-27 14:51:01'),
(6, 'USD', 272000, 182000, 0, '2025-06-27 14:51:10', '2025-06-27 14:51:10'),
(7, 'USD', 206000, 191000, 0, '2025-06-27 14:51:22', '2025-06-27 14:51:22'),
(8, 'USD', 114000, 176000, 0, '2025-06-27 14:51:30', '2025-06-27 14:51:30'),
(9, 'USD', 142000, 164000, 0, '2025-06-27 14:51:39', '2025-06-27 14:51:39'),
(10, 'USD', 254000, 147000, 0, '2025-06-27 14:51:50', '2025-06-27 14:51:50'),
(11, 'USD', 12000, 106000, 0, '2025-06-27 14:52:00', '2025-06-27 14:52:00'),
(12, 'USD', 227000, 202000, 0, '2025-06-27 14:52:10', '2025-06-27 14:52:10'),
(13, 'USD', 256000, 164000, 0, '2025-06-27 14:52:19', '2025-06-27 14:52:19'),
(14, 'USD', 143000, 169000, 0, '2025-06-27 14:52:28', '2025-06-27 14:52:28'),
(15, 'USD', 151000, 159000, 0, '2025-06-27 14:52:38', '2025-06-27 14:52:38'),
(16, 'USD', 228000, 137000, 0, '2025-06-27 14:52:45', '2025-06-27 14:52:45'),
(17, 'USD', 117000, 138000, 0, '2025-06-27 14:52:54', '2025-06-27 14:52:54'),
(18, 'USD', 139000, 126000, 0, '2025-06-27 14:53:03', '2025-06-27 14:53:03');

-- --------------------------------------------------------

--
-- Table structure for table `pair_score`
--

CREATE TABLE `pair_score` (
  `asset_pair_code` varchar(20) NOT NULL,
  `cot_score` int(11) NOT NULL,
  `retail_sentiment_score` int(11) NOT NULL,
  `gdp_growth_score` int(11) NOT NULL,
  `core_inflation_score` int(11) NOT NULL,
  `retail_sales_score` int(11) NOT NULL,
  `spmi_score` int(11) NOT NULL,
  `mpmi_score` int(11) NOT NULL,
  `unemployment_rate_score` int(11) NOT NULL,
  `employment_change_score` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pair_score`
--

INSERT INTO `pair_score` (`asset_pair_code`, `cot_score`, `retail_sentiment_score`, `gdp_growth_score`, `core_inflation_score`, `retail_sales_score`, `spmi_score`, `mpmi_score`, `unemployment_rate_score`, `employment_change_score`, `created_at`, `updated_at`) VALUES
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `roles` enum('student','admin','instructor','moderator') DEFAULT 'student',
  `address` text DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `trading_level` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
  `learning_style` enum('visual','auditory','kinesthetic','reading') DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `authenticated` tinyint(1) DEFAULT 0,
  `login_time` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `account_id`, `student_id`, `name`, `username`, `email`, `roles`, `address`, `birth_place`, `birth_date`, `phone_no`, `trading_level`, `learning_style`, `gender`, `avatar`, `bio`, `preferences`, `authenticated`, `login_time`, `last_login`, `is_verified`, `verification_token`, `created_at`, `updated_at`) VALUES
(1, 1, '1', 'test', 'test', 'crajeextremeyt@gmail.com', 'student', 'Valenzuela', 'Valenzuela', '2025-06-17', '09427184388', 'beginner', NULL, 'male', '/uploads/avatars/1749025966246-343866882.png', NULL, NULL, 1, '2025-06-04 08:31:08', '2025-06-11 17:57:37', 0, NULL, '2025-06-04 08:31:08', '2025-06-11 09:57:37'),
(2, 8, NULL, 'Jane Elizabeth Smith', 'janesmith85', 'jane.smith@example.com', '', '', 'San Francisco, CA', '1985-05-18', '', NULL, NULL, 'female', '/uploads/avatars/1749703097767-696713373.png', NULL, NULL, 1, '2025-06-12 12:37:32', NULL, 0, NULL, '2025-06-12 04:37:32', '2025-06-12 04:38:20'),
(3, 9, NULL, 'Jane Elizabeth Smith', 'janesmith20', 'janes.smith@example.com', '', '', 'San Francisco, CA', '1985-05-19', '', NULL, NULL, 'female', NULL, NULL, NULL, 1, '2025-06-12 12:41:50', NULL, 0, NULL, '2025-06-12 04:41:50', '2025-06-12 04:41:50'),
(7, 13, 'S1749790242780_13', 'CJ Pinalba Napoles', 'johndoe123', 'johndoe@gmail.com', 'student', '123 Main Street, New York, NY', 'Marilao Bulacan', '1990-04-29', '09234567890', 'beginner', '', 'male', '', '', '{\"device_type\":\"Desktop,Mobile\",\"learning_style\":\"\"}', 1, '2025-06-24 04:13:30', '2025-06-24 04:13:30', 1, NULL, '2025-06-12 22:24:33', '2025-06-23 20:13:30');

--
-- Triggers `profiles`
--
DELIMITER $$
CREATE TRIGGER `log_profile_updates` AFTER UPDATE ON `profiles` FOR EACH ROW BEGIN
    INSERT INTO `activity_logs` (`account_id`, `action`, `description`, `created_at`)
    VALUES (NEW.account_id, 'profile_updated', 'User profile was updated', NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `referral_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `referred_by` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `ib_code` varchar(20) DEFAULT NULL,
  `referral_type` enum('Individual','Facebook','Workshop','Ad') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `retail_sales`
--

CREATE TABLE `retail_sales` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `retail_sales` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retail_sales`
--

INSERT INTO `retail_sales` (`id`, `asset_code`, `retail_sales`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 0.6, 0.4, 0, 'Beat', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(0, 'USD', -0.8, -0.2, -233.33, 'Miss', '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(0, 'USD', 0.6, 0.8, -175, 'Miss', '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(0, 'USD', 0.7, 0.4, 16.67, 'Beat', '2025-06-27 14:55:05', '2025-06-27 14:55:05'),
(0, 'USD', 0, 0.4, -100, 'Miss', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(0, 'USD', 0.1, 0.3, 0, 'Miss', '2025-06-27 15:01:49', '2025-06-27 15:01:49'),
(0, 'USD', 0, -0.3, -100, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(0, 'USD', 1, 0.4, 0, 'Beat', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(0, 'USD', 0.1, -0.2, -90, 'Beat', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(0, 'USD', 0.4, 0.3, 300, 'Beat', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(0, 'USD', 0.4, 0.3, 0, 'Beat', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(0, 'USD', 0.7, 0.6, 75, 'Beat', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(0, 'USD', -0.9, -0.2, -228.57, 'Miss', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(0, 'USD', 0.2, 0.6, -122.22, 'Miss', '2025-06-27 15:13:01', '2025-06-27 15:13:01'),
(0, 'USD', 1.4, 1.3, 600, 'Beat', '2025-06-27 15:14:12', '2025-06-27 15:14:12'),
(0, 'USD', 0.1, 0, -92.86, 'Beat', '2025-06-27 15:14:54', '2025-06-27 15:14:54'),
(0, 'USD', -0.9, -0.5, -1000, 'Miss', '2025-06-27 15:15:37', '2025-06-27 15:15:37'),
(0, 'EUR', 0.1, 0.3, 0, 'Miss', '2025-06-27 18:08:35', '2025-06-27 18:08:35'),
(0, 'EUR', -0.2, -0.1, -300, 'Miss', '2025-06-27 18:08:46', '2025-06-27 18:08:46'),
(0, 'EUR', -0.3, -0.1, 50, 'Miss', '2025-06-27 18:08:53', '2025-06-27 18:08:53'),
(0, 'EUR', 0.3, 0.5, -200, 'Miss', '2025-06-27 18:09:02', '2025-06-27 18:09:02'),
(0, 'EUR', -0.1, -0.1, -133.33, 'Met', '2025-06-27 18:09:12', '2025-06-27 18:09:12'),
(0, 'EUR', 0.1, 0.2, -200, 'Miss', '2025-06-27 18:09:18', '2025-06-27 18:09:18'),
(0, 'JPY', 3.7, 3.4, 0, 'Beat', '2025-06-27 18:37:05', '2025-06-27 18:37:05'),
(0, 'JPY', 3.9, 3.9, 5.41, 'Met', '2025-06-27 18:37:11', '2025-06-27 18:37:11'),
(0, 'JPY', 1.4, 2.4, -64.1, 'Miss', '2025-06-27 18:37:57', '2025-06-27 18:37:57'),
(0, 'JPY', 3.1, 3.6, 121.43, 'Miss', '2025-06-27 18:38:13', '2025-06-27 18:38:13'),
(0, 'JPY', 3.3, 2.9, 6.45, 'Beat', '2025-06-27 18:38:23', '2025-06-27 18:38:23'),
(0, 'GBP', -0.3, -0.4, 0, 'Beat', '2025-06-27 19:05:34', '2025-06-27 19:05:34'),
(0, 'GBP', 1.7, 0.4, -666.67, 'Beat', '2025-06-27 19:05:42', '2025-06-27 19:05:42'),
(0, 'GBP', 1, -0.3, -41.18, 'Beat', '2025-06-27 19:05:48', '2025-06-27 19:05:48'),
(0, 'GBP', 0.4, -0.3, -60, 'Beat', '2025-06-27 19:05:56', '2025-06-27 19:05:56'),
(0, 'GBP', 1.2, 0.3, 200, 'Beat', '2025-06-27 19:06:01', '2025-06-27 19:06:01'),
(0, 'GBP', -2.7, -0.5, -325, 'Miss', '2025-06-27 19:06:47', '2025-06-27 19:06:47'),
(0, 'AUD', 0.8, 1, 0, 'Miss', '2025-06-27 19:17:33', '2025-06-27 19:17:33'),
(0, 'AUD', -0.1, -0.7, -112.5, 'Beat', '2025-06-27 19:17:45', '2025-06-27 19:17:45'),
(0, 'AUD', 0.3, 0.3, -400, 'Met', '2025-06-27 19:17:52', '2025-06-27 19:17:52'),
(0, 'AUD', 0.2, 0.3, -33.33, 'Miss', '2025-06-27 19:18:02', '2025-06-27 19:18:02'),
(0, 'AUD', 0.3, 0.4, 50, 'Miss', '2025-06-27 19:18:07', '2025-06-27 19:18:07'),
(0, 'AUD', -0.1, 0.3, -133.33, 'Miss', '2025-06-27 19:18:13', '2025-06-27 19:18:13'),
(0, 'CAD', -0.3, -0.3, 0, 'Met', '2025-06-27 19:31:38', '2025-06-27 19:31:38'),
(0, 'CAD', 0.9, 0.5, -400, 'Beat', '2025-06-27 19:31:45', '2025-06-27 19:31:45'),
(0, 'CAD', 0.4, 0.5, -55.56, 'Miss', '2025-06-27 19:31:50', '2025-06-27 19:31:50'),
(0, 'CAD', 0.4, 0.4, 0, 'Met', '2025-06-27 19:32:00', '2025-06-27 19:32:00'),
(0, 'CAD', 0.6, 0.7, 50, 'Miss', '2025-06-27 19:32:04', '2025-06-27 19:32:04'),
(0, 'CHF', 0.8, 1.3, 0, 'Miss', '2025-06-30 12:36:39', '2025-06-30 12:36:39'),
(0, 'CHF', 2.6, 0.6, 225, 'Beat', '2025-06-30 12:36:47', '2025-06-30 12:36:47'),
(0, 'CHF', 1.3, 1.6, -50, 'Miss', '2025-06-30 12:36:53', '2025-06-30 12:36:53'),
(0, 'CHF', 1.6, 1.5, 23.08, 'Beat', '2025-06-30 12:37:00', '2025-06-30 12:37:00'),
(0, 'CHF', 2.2, 1.9, 37.5, 'Beat', '2025-06-30 12:37:07', '2025-06-30 12:37:07'),
(0, 'CHF', 1.3, 2.5, -40.91, 'Miss', '2025-06-30 12:37:19', '2025-06-30 12:37:19'),
(0, 'NZD', 0.9, 0.5, 0, 'Beat', '2025-06-30 12:49:46', '2025-06-30 12:49:46'),
(0, 'NZD', 0.8, 0, -11.11, 'Beat', '2025-06-30 12:49:53', '2025-06-30 12:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `retail_sales_history`
--

CREATE TABLE `retail_sales_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `retail_sales` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retail_sales_history`
--

INSERT INTO `retail_sales_history` (`id`, `asset_code`, `retail_sales`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(5, 'USD', 0.6, 0.4, 0, 'Beat', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(6, 'USD', -0.8, -0.2, 0, 'Miss', '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(7, 'USD', 0.6, 0.8, 0, 'Miss', '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(8, 'USD', 0.7, 0.4, 0, 'Beat', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(9, 'USD', 0, 0.4, 0, 'Miss', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(10, 'USD', 0.1, 0.3, 0, 'Miss', '2025-06-27 15:01:49', '2025-06-27 15:01:49'),
(11, 'USD', 0, -0.3, 0, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(12, 'USD', 1, 0.4, 0, 'Beat', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(13, 'USD', 0.1, -0.2, 0, 'Beat', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(14, 'USD', 0.4, 0.3, 0, 'Beat', '2025-06-27 15:08:18', '2025-06-27 15:08:18'),
(15, 'USD', 0.4, 0.3, 0, 'Beat', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(16, 'USD', 0.7, 0.6, 0, 'Beat', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(17, 'USD', -0.9, -0.2, 0, 'Miss', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(18, 'USD', 0.2, 0.6, 0, 'Miss', '2025-06-27 15:13:01', '2025-06-27 15:13:01'),
(19, 'USD', 1.4, 1.3, 0, 'Beat', '2025-06-27 15:14:12', '2025-06-27 15:14:12'),
(20, 'USD', 0.1, 0, 0, 'Beat', '2025-06-27 15:14:54', '2025-06-27 15:14:54'),
(21, 'USD', -0.9, -0.5, 0, 'Miss', '2025-06-27 15:15:37', '2025-06-27 15:15:37'),
(22, 'EUR', 0.1, 0.3, 0, 'Miss', '2025-06-27 18:08:35', '2025-06-27 18:08:35'),
(23, 'EUR', -0.2, -0.1, 0, 'Miss', '2025-06-27 18:08:46', '2025-06-27 18:08:46'),
(24, 'EUR', -0.3, -0.1, 0, 'Miss', '2025-06-27 18:08:53', '2025-06-27 18:08:53'),
(25, 'EUR', 0.3, 0.5, 0, 'Miss', '2025-06-27 18:09:02', '2025-06-27 18:09:02'),
(26, 'EUR', -0.1, -0.1, 0, 'Met', '2025-06-27 18:09:12', '2025-06-27 18:09:12'),
(27, 'EUR', 0.1, 0.2, 0, 'Miss', '2025-06-27 18:09:18', '2025-06-27 18:09:18'),
(28, 'JPY', 3.7, 3.4, 0, 'Beat', '2025-06-27 18:37:05', '2025-06-27 18:37:05'),
(29, 'JPY', 3.9, 3.9, 0, 'Met', '2025-06-27 18:37:11', '2025-06-27 18:37:11'),
(30, 'JPY', 1.4, 2.4, 0, 'Miss', '2025-06-27 18:37:57', '2025-06-27 18:37:57'),
(31, 'JPY', 3.1, 3.6, 0, 'Miss', '2025-06-27 18:38:13', '2025-06-27 18:38:13'),
(32, 'JPY', 3.3, 2.9, 0, 'Beat', '2025-06-27 18:38:23', '2025-06-27 18:38:23'),
(33, 'GBP', -0.3, -0.4, 0, 'Beat', '2025-06-27 19:05:34', '2025-06-27 19:05:34'),
(34, 'GBP', 1.7, 0.4, 0, 'Beat', '2025-06-27 19:05:42', '2025-06-27 19:05:42'),
(35, 'GBP', 1, -0.3, 0, 'Beat', '2025-06-27 19:05:48', '2025-06-27 19:05:48'),
(36, 'GBP', 0.4, -0.3, 0, 'Beat', '2025-06-27 19:05:56', '2025-06-27 19:05:56'),
(37, 'GBP', 1.2, 0.3, 0, 'Beat', '2025-06-27 19:06:01', '2025-06-27 19:06:01'),
(38, 'GBP', -2.7, -0.5, 0, 'Miss', '2025-06-27 19:06:47', '2025-06-27 19:06:47'),
(39, 'AUD', 0.8, 1, 0, 'Miss', '2025-06-27 19:17:33', '2025-06-27 19:17:33'),
(40, 'AUD', -0.1, -0.7, 0, 'Beat', '2025-06-27 19:17:45', '2025-06-27 19:17:45'),
(41, 'AUD', 0.3, 0.3, 0, 'Met', '2025-06-27 19:17:52', '2025-06-27 19:17:52'),
(42, 'AUD', 0.2, 0.3, 0, 'Miss', '2025-06-27 19:18:02', '2025-06-27 19:18:02'),
(43, 'AUD', 0.3, 0.4, 0, 'Miss', '2025-06-27 19:18:07', '2025-06-27 19:18:07'),
(44, 'AUD', -0.1, 0.3, 0, 'Miss', '2025-06-27 19:18:13', '2025-06-27 19:18:13'),
(45, 'CAD', -0.3, -0.3, 0, 'Met', '2025-06-27 19:31:38', '2025-06-27 19:31:38'),
(46, 'CAD', 0.9, 0.5, 0, 'Beat', '2025-06-27 19:31:45', '2025-06-27 19:31:45'),
(47, 'CAD', 0.4, 0.5, 0, 'Miss', '2025-06-27 19:31:50', '2025-06-27 19:31:50'),
(48, 'CAD', 0.4, 0.4, 0, 'Met', '2025-06-27 19:32:00', '2025-06-27 19:32:00'),
(49, 'CAD', 0.6, 0.7, 0, 'Miss', '2025-06-27 19:32:04', '2025-06-27 19:32:04'),
(50, 'CHF', 0.8, 1.3, 0, 'Miss', '2025-06-30 12:36:39', '2025-06-30 12:36:39'),
(51, 'CHF', 2.6, 0.6, 0, 'Beat', '2025-06-30 12:36:47', '2025-06-30 12:36:47'),
(52, 'CHF', 1.3, 1.6, 0, 'Miss', '2025-06-30 12:36:53', '2025-06-30 12:36:53'),
(53, 'CHF', 1.6, 1.5, 0, 'Beat', '2025-06-30 12:37:00', '2025-06-30 12:37:00'),
(54, 'CHF', 2.2, 1.9, 0, 'Beat', '2025-06-30 12:37:07', '2025-06-30 12:37:07'),
(55, 'CHF', 1.3, 2.5, 0, 'Miss', '2025-06-30 12:37:19', '2025-06-30 12:37:19'),
(56, 'NZD', 0.9, 0.5, 0, 'Beat', '2025-06-30 12:49:46', '2025-06-30 12:49:46'),
(57, 'NZD', 0.8, 0, 0, 'Beat', '2025-06-30 12:49:53', '2025-06-30 12:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `retail_sentiment`
--

CREATE TABLE `retail_sentiment` (
  `id` int(11) NOT NULL,
  `asset_pair_code` varchar(20) NOT NULL,
  `retail_long` double NOT NULL,
  `retail_short` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retail_sentiment`
--

INSERT INTO `retail_sentiment` (`id`, `asset_pair_code`, `retail_long`, `retail_short`, `created_at`, `updated_at`) VALUES
(0, 'EURUSD', 23, 77, '2025-06-27 17:59:14', '2025-06-27 17:59:14'),
(0, 'EURJPY', 28, 72, '2025-06-27 18:16:41', '2025-06-27 18:16:41'),
(0, 'EURGBP', 34, 66, '2025-06-27 18:56:13', '2025-06-27 18:56:13'),
(0, 'GBPAUD', 32, 68, '2025-06-27 19:11:56', '2025-06-27 19:11:56'),
(0, 'CADJPY', 52, 48, '2025-06-27 19:20:51', '2025-06-27 19:20:51'),
(0, 'NZDCHF', 75, 25, '2025-06-30 12:20:38', '2025-06-30 12:20:38'),
(0, 'NZDCHF', 75, 25, '2025-06-30 12:21:44', '2025-06-30 12:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `retail_sentiment_history`
--

CREATE TABLE `retail_sentiment_history` (
  `id` int(11) NOT NULL,
  `asset_pair_code` varchar(20) NOT NULL,
  `retail_long` double NOT NULL,
  `retail_short` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retail_sentiment_history`
--

INSERT INTO `retail_sentiment_history` (`id`, `asset_pair_code`, `retail_long`, `retail_short`, `created_at`, `updated_at`) VALUES
(1, 'EURUSD', 23, 77, '2025-06-27 17:59:14', '2025-06-27 17:59:14'),
(2, 'EURJPY', 28, 72, '2025-06-27 18:16:41', '2025-06-27 18:16:41'),
(3, 'EURGBP', 34, 66, '2025-06-27 18:56:13', '2025-06-27 18:56:13'),
(4, 'GBPAUD', 32, 68, '2025-06-27 19:11:56', '2025-06-27 19:11:56'),
(5, 'CADJPY', 52, 48, '2025-06-27 19:20:51', '2025-06-27 19:20:51'),
(6, 'NZDCHF', 75, 25, '2025-06-30 12:20:38', '2025-06-30 12:20:38'),
(7, 'NZDCHF', 75, 25, '2025-06-30 12:21:44', '2025-06-30 12:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `spmi`
--

CREATE TABLE `spmi` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `service_pmi` double NOT NULL,
  `forecast` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spmi`
--

INSERT INTO `spmi` (`id`, `asset_code`, `service_pmi`, `forecast`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 53.8, 51, 'Beat', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(0, 'USD', 48.8, 52.6, 'Miss', '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(0, 'USD', 51.5, 51.3, 'Beat', '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(0, 'USD', 54.9, 51.7, 'Beat', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(0, 'USD', 56, 53.8, 'Beat', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(0, 'USD', 51.1, 55.5, 'Miss', '2025-06-27 15:01:48', '2025-06-27 15:01:48'),
(0, 'USD', 54.1, 53.5, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(0, 'USD', 52.8, 54.2, 'Miss', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(0, 'USD', 53.5, 52.49, 'Beat', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(0, 'USD', 53.5, 52.5, 'Beat', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(0, 'USD', 50.8, 53, 'Miss', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(0, 'USD', 51.6, 50.2, 'Beat', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(0, 'USD', 49.9, 52, 'Miss', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(0, 'EUR', 51.6, 51.4, 'Beat', '2025-06-27 18:06:33', '2025-06-27 18:06:33'),
(0, 'EUR', 51.4, 51.4, 'Met', '2025-06-27 18:06:39', '2025-06-27 18:06:39'),
(0, 'EUR', 51.3, 51.4, 'Miss', '2025-06-27 18:06:47', '2025-06-27 18:06:47'),
(0, 'EUR', 50.7, 51.5, 'Miss', '2025-06-27 18:06:53', '2025-06-27 18:06:53'),
(0, 'EUR', 50.6, 50.7, 'Miss', '2025-06-27 18:07:02', '2025-06-27 18:07:02'),
(0, 'EUR', 50.4, 51.2, 'Miss', '2025-06-27 18:07:11', '2025-06-27 18:07:11'),
(0, 'EUR', 51, 50.4, 'Beat', '2025-06-27 18:07:19', '2025-06-27 18:07:19'),
(0, 'EUR', 49.7, 50.4, 'Miss', '2025-06-27 18:07:24', '2025-06-27 18:07:24'),
(0, 'EUR', 50.1, 49.7, 'Beat', '2025-06-27 18:07:32', '2025-06-27 18:07:32'),
(0, 'EUR', 48.9, 50.4, 'Miss', '2025-06-27 18:07:46', '2025-06-27 18:07:46'),
(0, 'EUR', 49.7, 48.9, 'Beat', '2025-06-27 18:07:58', '2025-06-27 18:07:58'),
(0, 'EUR', 50, 50, 'Met', '2025-06-27 18:08:04', '2025-06-27 18:08:04'),
(0, 'JPY', 53.6, 53.6, 'Met', '2025-06-27 18:33:28', '2025-06-27 18:33:28'),
(0, 'JPY', 49.8, 53.8, 'Miss', '2025-06-27 18:33:40', '2025-06-27 18:33:40'),
(0, 'JPY', 49.4, 49.8, 'Miss', '2025-06-27 18:33:51', '2025-06-27 18:33:51'),
(0, 'JPY', 53.9, 49.4, 'Beat', '2025-06-27 18:34:44', '2025-06-27 18:34:44'),
(0, 'GBP', 51.1, 51.4, 'Miss', '2025-06-27 19:03:09', '2025-06-27 19:03:09'),
(0, 'GBP', 51.2, 51.8, 'Miss', '2025-06-27 19:03:18', '2025-06-27 19:03:18'),
(0, 'GBP', 50.8, 51.2, 'Miss', '2025-06-27 19:03:40', '2025-06-27 19:03:40'),
(0, 'GBP', 51.1, 50.8, 'Beat', '2025-06-27 19:03:50', '2025-06-27 19:03:50'),
(0, 'GBP', 51, 51.1, 'Miss', '2025-06-27 19:04:09', '2025-06-27 19:04:09'),
(0, 'GBP', 53.2, 51.2, 'Beat', '2025-06-27 19:04:14', '2025-06-27 19:04:14'),
(0, 'GBP', 52.5, 53.2, 'Miss', '2025-06-27 19:04:21', '2025-06-27 19:04:21'),
(0, 'GBP', 48.9, 51.5, 'Miss', '2025-06-27 19:04:29', '2025-06-27 19:04:29'),
(0, 'GBP', 49, 48.9, 'Beat', '2025-06-27 19:04:36', '2025-06-27 19:04:36'),
(0, 'GBP', 50.2, 50, 'Beat', '2025-06-27 19:04:42', '2025-06-27 19:04:42'),
(0, 'GBP', 50.9, 50.2, 'Beat', '2025-06-27 19:04:47', '2025-06-27 19:04:47'),
(0, 'GBP', 51.3, 51.2, 'Beat', '2025-06-27 19:04:53', '2025-06-27 19:04:53'),
(0, 'AUD', 51.2, 50.4, 'Beat', '2025-06-27 19:16:31', '2025-06-27 19:16:31'),
(0, 'AUD', 50.8, 51.4, 'Miss', '2025-06-27 19:16:39', '2025-06-27 19:16:39'),
(0, 'AUD', 51.6, 51.2, 'Beat', '2025-06-27 19:16:47', '2025-06-27 19:16:47'),
(0, 'AUD', 51, 51.4, 'Miss', '2025-06-27 19:16:52', '2025-06-27 19:16:52'),
(0, 'AUD', 50.6, 50.5, 'Beat', '2025-06-27 19:16:59', '2025-06-27 19:16:59'),
(0, 'CHF', 51.6, 51.4, 'Beat', '2025-06-30 12:34:43', '2025-06-30 12:34:43'),
(0, 'CHF', 51.4, 51.4, 'Met', '2025-06-30 12:34:49', '2025-06-30 12:34:49'),
(0, 'CHF', 51.3, 51.4, 'Miss', '2025-06-30 12:34:56', '2025-06-30 12:34:56'),
(0, 'CHF', 50.7, 51.5, 'Miss', '2025-06-30 12:35:04', '2025-06-30 12:35:04'),
(0, 'CHF', 50.6, 50.7, 'Miss', '2025-06-30 12:35:09', '2025-06-30 12:35:09'),
(0, 'CHF', 50.4, 51.2, 'Miss', '2025-06-30 12:35:16', '2025-06-30 12:35:16'),
(0, 'CHF', 51, 50.4, 'Beat', '2025-06-30 12:35:28', '2025-06-30 12:35:28'),
(0, 'CHF', 49.7, 50.4, 'Miss', '2025-06-30 12:35:34', '2025-06-30 12:35:34'),
(0, 'CHF', 50.1, 49.7, 'Beat', '2025-06-30 12:35:43', '2025-06-30 12:35:43'),
(0, 'CHF', 48.9, 50.4, 'Miss', '2025-06-30 12:35:50', '2025-06-30 12:35:50'),
(0, 'CHF', 49.7, 48.9, 'Beat', '2025-06-30 12:35:57', '2025-06-30 12:35:57'),
(0, 'CHF', 50, 50, 'Met', '2025-06-30 12:36:20', '2025-06-30 12:36:20');

-- --------------------------------------------------------

--
-- Table structure for table `spmi_history`
--

CREATE TABLE `spmi_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `service_pmi` double NOT NULL,
  `forecast` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spmi_history`
--

INSERT INTO `spmi_history` (`id`, `asset_code`, `service_pmi`, `forecast`, `result`, `created_at`, `updated_at`) VALUES
(5, 'USD', 53.8, 51, 'Beat', '2025-06-27 14:27:42', '2025-06-27 14:27:42'),
(6, 'USD', 48.8, 52.6, 'Miss', '2025-06-27 14:39:53', '2025-06-27 14:39:53'),
(7, 'USD', 51.5, 51.3, 'Beat', '2025-06-27 14:44:16', '2025-06-27 14:44:16'),
(8, 'USD', 54.9, 51.7, 'Beat', '2025-06-27 14:55:04', '2025-06-27 14:55:04'),
(9, 'USD', 56, 53.8, 'Beat', '2025-06-27 14:56:01', '2025-06-27 14:56:01'),
(10, 'USD', 51.1, 55.5, 'Miss', '2025-06-27 15:01:48', '2025-06-27 15:01:48'),
(11, 'USD', 54.1, 53.5, 'Beat', '2025-06-27 15:03:44', '2025-06-27 15:03:44'),
(12, 'USD', 52.8, 54.2, 'Miss', '2025-06-27 15:05:13', '2025-06-27 15:05:13'),
(13, 'USD', 53.5, 52.49, 'Beat', '2025-06-27 15:06:40', '2025-06-27 15:06:40'),
(14, 'USD', 53.5, 52.5, 'Beat', '2025-06-27 15:08:17', '2025-06-27 15:08:17'),
(15, 'USD', 50.8, 53, 'Miss', '2025-06-27 15:09:33', '2025-06-27 15:09:33'),
(16, 'USD', 51.6, 50.2, 'Beat', '2025-06-27 15:10:28', '2025-06-27 15:10:28'),
(17, 'USD', 49.9, 52, 'Miss', '2025-06-27 15:12:08', '2025-06-27 15:12:08'),
(18, 'EUR', 51.6, 51.4, 'Beat', '2025-06-27 18:06:33', '2025-06-27 18:06:33'),
(19, 'EUR', 51.4, 51.4, 'Met', '2025-06-27 18:06:39', '2025-06-27 18:06:39'),
(20, 'EUR', 51.3, 51.4, 'Miss', '2025-06-27 18:06:47', '2025-06-27 18:06:47'),
(21, 'EUR', 50.7, 51.5, 'Miss', '2025-06-27 18:06:53', '2025-06-27 18:06:53'),
(22, 'EUR', 50.6, 50.7, 'Miss', '2025-06-27 18:07:02', '2025-06-27 18:07:02'),
(23, 'EUR', 50.4, 51.2, 'Miss', '2025-06-27 18:07:11', '2025-06-27 18:07:11'),
(24, 'EUR', 51, 50.4, 'Beat', '2025-06-27 18:07:19', '2025-06-27 18:07:19'),
(25, 'EUR', 49.7, 50.4, 'Miss', '2025-06-27 18:07:24', '2025-06-27 18:07:24'),
(26, 'EUR', 50.1, 49.7, 'Beat', '2025-06-27 18:07:32', '2025-06-27 18:07:32'),
(27, 'EUR', 48.9, 50.4, 'Miss', '2025-06-27 18:07:46', '2025-06-27 18:07:46'),
(28, 'EUR', 49.7, 48.9, 'Beat', '2025-06-27 18:07:58', '2025-06-27 18:07:58'),
(29, 'EUR', 50, 50, 'Met', '2025-06-27 18:08:04', '2025-06-27 18:08:04'),
(30, 'JPY', 53.6, 53.6, 'Met', '2025-06-27 18:33:28', '2025-06-27 18:33:28'),
(31, 'JPY', 49.8, 53.8, 'Miss', '2025-06-27 18:33:40', '2025-06-27 18:33:40'),
(32, 'JPY', 49.4, 49.8, 'Miss', '2025-06-27 18:33:51', '2025-06-27 18:33:51'),
(33, 'JPY', 53.9, 49.4, 'Beat', '2025-06-27 18:34:44', '2025-06-27 18:34:44'),
(34, 'GBP', 51.1, 51.4, 'Miss', '2025-06-27 19:03:09', '2025-06-27 19:03:09'),
(35, 'GBP', 51.2, 51.8, 'Miss', '2025-06-27 19:03:18', '2025-06-27 19:03:18'),
(36, 'GBP', 50.8, 51.2, 'Miss', '2025-06-27 19:03:40', '2025-06-27 19:03:40'),
(37, 'GBP', 51.1, 50.8, 'Beat', '2025-06-27 19:03:50', '2025-06-27 19:03:50'),
(38, 'GBP', 51, 51.1, 'Miss', '2025-06-27 19:04:09', '2025-06-27 19:04:09'),
(39, 'GBP', 53.2, 51.2, 'Beat', '2025-06-27 19:04:14', '2025-06-27 19:04:14'),
(40, 'GBP', 52.5, 53.2, 'Miss', '2025-06-27 19:04:21', '2025-06-27 19:04:21'),
(41, 'GBP', 48.9, 51.5, 'Miss', '2025-06-27 19:04:29', '2025-06-27 19:04:29'),
(42, 'GBP', 49, 48.9, 'Beat', '2025-06-27 19:04:36', '2025-06-27 19:04:36'),
(43, 'GBP', 50.2, 50, 'Beat', '2025-06-27 19:04:42', '2025-06-27 19:04:42'),
(44, 'GBP', 50.9, 50.2, 'Beat', '2025-06-27 19:04:47', '2025-06-27 19:04:47'),
(45, 'GBP', 51.3, 51.2, 'Beat', '2025-06-27 19:04:53', '2025-06-27 19:04:53'),
(46, 'AUD', 51.2, 50.4, 'Beat', '2025-06-27 19:16:31', '2025-06-27 19:16:31'),
(47, 'AUD', 50.8, 51.4, 'Miss', '2025-06-27 19:16:39', '2025-06-27 19:16:39'),
(48, 'AUD', 51.6, 51.2, 'Beat', '2025-06-27 19:16:47', '2025-06-27 19:16:47'),
(49, 'AUD', 51, 51.4, 'Miss', '2025-06-27 19:16:52', '2025-06-27 19:16:52'),
(50, 'AUD', 50.6, 50.5, 'Beat', '2025-06-27 19:16:59', '2025-06-27 19:16:59'),
(51, 'CHF', 51.6, 51.4, 'Beat', '2025-06-30 12:34:43', '2025-06-30 12:34:43'),
(52, 'CHF', 51.4, 51.4, 'Met', '2025-06-30 12:34:49', '2025-06-30 12:34:49'),
(53, 'CHF', 51.3, 51.4, 'Miss', '2025-06-30 12:34:56', '2025-06-30 12:34:56'),
(54, 'CHF', 50.7, 51.5, 'Miss', '2025-06-30 12:35:04', '2025-06-30 12:35:04'),
(55, 'CHF', 50.6, 50.7, 'Miss', '2025-06-30 12:35:09', '2025-06-30 12:35:09'),
(56, 'CHF', 50.4, 51.2, 'Miss', '2025-06-30 12:35:16', '2025-06-30 12:35:16'),
(57, 'CHF', 51, 50.4, 'Beat', '2025-06-30 12:35:28', '2025-06-30 12:35:28'),
(58, 'CHF', 49.7, 50.4, 'Miss', '2025-06-30 12:35:34', '2025-06-30 12:35:34'),
(59, 'CHF', 50.1, 49.7, 'Beat', '2025-06-30 12:35:43', '2025-06-30 12:35:43'),
(60, 'CHF', 48.9, 50.4, 'Miss', '2025-06-30 12:35:50', '2025-06-30 12:35:50'),
(61, 'CHF', 49.7, 48.9, 'Beat', '2025-06-30 12:35:57', '2025-06-30 12:35:57'),
(62, 'CHF', 50, 50, 'Met', '2025-06-30 12:36:20', '2025-06-30 12:36:20');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `background` text DEFAULT NULL,
  `batch` varchar(255) NOT NULL,
  `rating` decimal(10,2) DEFAULT NULL,
  `goals` text DEFAULT NULL,
  `trading_level` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  `device_availability` varchar(20) DEFAULT NULL,
  `learning_style` enum('In-person','Online') DEFAULT NULL,
  `date_registered` date DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `phone_no` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `name`, `age`, `gender`, `birth_date`, `birth_place`, `email`, `address`, `background`, `batch`, `rating`, `goals`, `trading_level`, `device_availability`, `learning_style`, `date_registered`, `account_id`, `phone_no`) VALUES
('1', 'test', 12, 'male', '2025-06-18', 'Valenzuela', 'crajeextremeyt@gmail.com', 'Valenzuela', 'SVG', '2', 2.00, 'Money', 'Beginner', 'None', 'In-person', '2025-06-04', 1, '09427184388');

-- --------------------------------------------------------

--
-- Table structure for table `unemployment_rate`
--

CREATE TABLE `unemployment_rate` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `unemployment_rate` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unemployment_rate`
--

INSERT INTO `unemployment_rate` (`id`, `asset_code`, `unemployment_rate`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 4.2, 4.2, 0, 'As Expected', '2025-06-27 14:27:41', '2025-06-27 14:27:41'),
(0, 'USD', 4.2, 4.2, 0, 'As Expected', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(0, 'EUR', 6.2, 6.1, 0, 'Missed', '2025-06-27 17:55:42', '2025-06-27 17:55:42'),
(0, 'EUR', 6.2, 6.2, 0, 'As Expected', '2025-06-27 17:55:50', '2025-06-27 17:55:50'),
(0, 'JPY', 2.5, 2.5, 0, 'As Expected', '2025-06-27 18:26:59', '2025-06-27 18:26:59'),
(0, 'JPY', 2.5, 2.5, 0, 'As Expected', '2025-06-27 18:27:04', '2025-06-27 18:27:04'),
(0, 'GBP', 4.5, 4.5, 0, 'As Expected', '2025-06-27 18:59:12', '2025-06-27 18:59:12'),
(0, 'GBP', 4.6, 4.6, 2.22, 'As Expected', '2025-06-27 18:59:25', '2025-06-27 18:59:25'),
(0, 'AUD', 4.1, 4.1, 0, 'As Expected', '2025-06-27 19:13:00', '2025-06-27 19:13:00'),
(0, 'AUD', 4.1, 4.1, 0, 'As Expected', '2025-06-27 19:13:06', '2025-06-27 19:13:06'),
(0, 'CAD', 6.9, 6.6, 0, 'Missed', '2025-06-27 19:25:37', '2025-06-27 19:25:37'),
(0, 'CAD', 7, 7, 1.45, 'As Expected', '2025-06-27 19:25:45', '2025-06-27 19:25:45'),
(0, 'CHF', 2.8, 2.8, 0, 'As Expected', '2025-06-30 12:29:44', '2025-06-30 12:29:44'),
(0, 'NZD', 5.1, 5.1, 0, 'As Expected', '2025-06-30 12:41:57', '2025-06-30 12:41:57'),
(0, 'NZD', 5.1, 5.3, 0, 'Beat', '2025-06-30 12:42:03', '2025-06-30 12:42:03');

-- --------------------------------------------------------

--
-- Table structure for table `unemployment_rate_history`
--

CREATE TABLE `unemployment_rate_history` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `unemployment_rate` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unemployment_rate_history`
--

INSERT INTO `unemployment_rate_history` (`id`, `asset_code`, `unemployment_rate`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(7, 'USD', 4.2, 4.2, 0, 'As Expected', '2025-06-27 14:27:41', '2025-06-27 14:27:41'),
(8, 'USD', 4.2, 4.2, 0, 'As Expected', '2025-06-27 14:39:52', '2025-06-27 14:39:52'),
(9, 'EUR', 6.2, 6.1, 0, 'Missed', '2025-06-27 17:55:42', '2025-06-27 17:55:42'),
(10, 'EUR', 6.2, 6.2, 0, 'As Expected', '2025-06-27 17:55:50', '2025-06-27 17:55:50'),
(11, 'JPY', 2.5, 2.5, 0, 'As Expected', '2025-06-27 18:26:59', '2025-06-27 18:26:59'),
(12, 'JPY', 2.5, 2.5, 0, 'As Expected', '2025-06-27 18:27:04', '2025-06-27 18:27:04'),
(13, 'GBP', 4.5, 4.5, 0, 'As Expected', '2025-06-27 18:59:11', '2025-06-27 18:59:11'),
(14, 'GBP', 4.6, 4.6, 0, 'As Expected', '2025-06-27 18:59:25', '2025-06-27 18:59:25'),
(15, 'AUD', 4.1, 4.1, 0, 'As Expected', '2025-06-27 19:13:00', '2025-06-27 19:13:00'),
(16, 'AUD', 4.1, 4.1, 0, 'As Expected', '2025-06-27 19:13:06', '2025-06-27 19:13:06'),
(17, 'CAD', 6.9, 6.6, 0, 'Missed', '2025-06-27 19:25:37', '2025-06-27 19:25:37'),
(18, 'CAD', 7, 7, 0, 'As Expected', '2025-06-27 19:25:45', '2025-06-27 19:25:45'),
(19, 'CHF', 2.8, 2.8, 0, 'As Expected', '2025-06-30 12:29:44', '2025-06-30 12:29:44'),
(20, 'NZD', 5.1, 5.1, 0, 'As Expected', '2025-06-30 12:41:57', '2025-06-30 12:41:57'),
(21, 'NZD', 5.1, 5.3, 0, 'Beat', '2025-06-30 12:42:03', '2025-06-30 12:42:03');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `session_id` varchar(128) NOT NULL,
  `account_id` int(11) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`user_data`)),
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` datetime NOT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`device_info`)),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `session_id`, `account_id`, `user_email`, `user_data`, `is_active`, `expires_at`, `user_agent`, `ip_address`, `device_info`, `last_activity`, `created_at`, `updated_at`) VALUES
(21, 'Cfo4o04cPo0CgnKRc-BHZCd5UVig1WFQ', 1, 'crajeextremeyt@gmail.com', '{\"account_id\":1,\"student_id\":\"1\",\"name\":\"Chalex Napoles\",\"username\":\"test\",\"email\":\"crajeextremeyt@gmail.com\",\"roles\":\"student\",\"address\":\"Valenzuela\",\"birth_place\":\"Valenzuela\",\"phone_no\":\"09427184388\",\"trading_level\":\"Beginner\",\"gender\":\"male\",\"birth_date\":\"2025-06-17T16:00:00.000Z\",\"authenticated\":true,\"loginTime\":\"2025-06-06T09:15:42.996Z\"}', 1, '2025-06-07 17:15:42', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 OPR/119.0.0.0', '::1', NULL, '2025-06-06 09:15:43', '2025-06-06 09:15:43', '2025-06-06 09:15:43');

--
-- Triggers `user_sessions`
--
DELIMITER $$
CREATE TRIGGER `update_last_login_on_session` AFTER INSERT ON `user_sessions` FOR EACH ROW BEGIN
    UPDATE `profiles` 
    SET `last_login` = NOW(), `updated_at` = NOW()
    WHERE `account_id` = NEW.account_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure for view `active_user_sessions`
--
DROP TABLE IF EXISTS `active_user_sessions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_user_sessions`  AS SELECT `us`.`id` AS `id`, `us`.`session_id` AS `session_id`, `us`.`account_id` AS `account_id`, `p`.`name` AS `name`, `p`.`username` AS `username`, `p`.`email` AS `email`, `us`.`ip_address` AS `ip_address`, `us`.`user_agent` AS `user_agent`, `us`.`last_activity` AS `last_activity`, `us`.`expires_at` AS `expires_at`, `us`.`created_at` AS `created_at` FROM (`user_sessions` `us` join `profiles` `p` on(`us`.`account_id` = `p`.`account_id`)) WHERE `us`.`is_active` = 1 AND `us`.`expires_at` > current_timestamp() ;

-- --------------------------------------------------------

--
-- Structure for view `api_economic_summary`
--
DROP TABLE IF EXISTS `api_economic_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `api_economic_summary`  AS SELECT `economic_data_summary`.`asset_pair_code` AS `asset_pair_code`, `economic_data_summary`.`base_asset` AS `base_asset`, `economic_data_summary`.`quote_asset` AS `quote_asset`, `economic_data_summary`.`description` AS `description`, `economic_data_summary`.`total_score` AS `total_score`, `economic_data_summary`.`bias_output` AS `bias_output`, `economic_data_summary`.`cot_score` AS `cot_score`, `economic_data_summary`.`retail_position_score` AS `retail_position_score`, `economic_data_summary`.`employment_score` AS `employment_score`, `economic_data_summary`.`unemployment_score` AS `unemployment_score`, `economic_data_summary`.`gdp_score` AS `gdp_score`, `economic_data_summary`.`mpmi_score` AS `mpmi_score`, `economic_data_summary`.`spmi_score` AS `spmi_score`, `economic_data_summary`.`retail_sales_score` AS `retail_sales_score`, `economic_data_summary`.`inflation_score` AS `inflation_score`, `economic_data_summary`.`interest_rate_score` AS `interest_rate_score`, `economic_data_summary`.`last_updated` AS `last_updated` FROM `economic_data_summary` ORDER BY `economic_data_summary`.`total_score` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `latest_cot_data`
--
DROP TABLE IF EXISTS `latest_cot_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_cot_data`  AS SELECT `c1`.`id` AS `id`, `c1`.`asset_code` AS `asset_code`, `c1`.`long_contracts` AS `long_contracts`, `c1`.`short_contracts` AS `short_contracts`, `c1`.`change_in_long` AS `change_in_long`, `c1`.`change_in_short` AS `change_in_short`, `c1`.`long_percent` AS `long_percent`, `c1`.`short_percent` AS `short_percent`, `c1`.`net_position` AS `net_position`, `c1`.`net_change_percent` AS `net_change_percent`, `c1`.`created_at` AS `created_at`, `c1`.`updated_at` AS `updated_at` FROM (`cot_data` `c1` join (select `cot_data`.`asset_code` AS `asset_code`,max(`cot_data`.`created_at`) AS `max_created` from `cot_data` group by `cot_data`.`asset_code`) `c2` on(`c1`.`asset_code` = `c2`.`asset_code` and `c1`.`created_at` = `c2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_employment_data`
--
DROP TABLE IF EXISTS `latest_employment_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_employment_data`  AS SELECT `e1`.`id` AS `id`, `e1`.`asset_code` AS `asset_code`, `e1`.`employment_change` AS `employment_change`, `e1`.`forecast` AS `forecast`, `e1`.`net_change_percent` AS `net_change_percent`, `e1`.`result` AS `result`, `e1`.`created_at` AS `created_at`, `e1`.`updated_at` AS `updated_at` FROM (`employment_change` `e1` join (select `employment_change`.`asset_code` AS `asset_code`,max(`employment_change`.`created_at`) AS `max_created` from `employment_change` group by `employment_change`.`asset_code`) `e2` on(`e1`.`asset_code` = `e2`.`asset_code` and `e1`.`created_at` = `e2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_gdp_data`
--
DROP TABLE IF EXISTS `latest_gdp_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_gdp_data`  AS SELECT `g1`.`id` AS `id`, `g1`.`asset_code` AS `asset_code`, `g1`.`gdp_growth` AS `gdp_growth`, `g1`.`forecast` AS `forecast`, `g1`.`change_in_gdp` AS `change_in_gdp`, `g1`.`result` AS `result`, `g1`.`created_at` AS `created_at`, `g1`.`updated_at` AS `updated_at` FROM (`gdp_growth` `g1` join (select `gdp_growth`.`asset_code` AS `asset_code`,max(`gdp_growth`.`created_at`) AS `max_created` from `gdp_growth` group by `gdp_growth`.`asset_code`) `g2` on(`g1`.`asset_code` = `g2`.`asset_code` and `g1`.`created_at` = `g2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_inflation_data`
--
DROP TABLE IF EXISTS `latest_inflation_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_inflation_data`  AS SELECT `i1`.`id` AS `id`, `i1`.`asset_code` AS `asset_code`, `i1`.`core_inflation` AS `core_inflation`, `i1`.`forecast` AS `forecast`, `i1`.`net_change_percent` AS `net_change_percent`, `i1`.`result` AS `result`, `i1`.`created_at` AS `created_at`, `i1`.`updated_at` AS `updated_at` FROM (`core_inflation` `i1` join (select `core_inflation`.`asset_code` AS `asset_code`,max(`core_inflation`.`created_at`) AS `max_created` from `core_inflation` group by `core_inflation`.`asset_code`) `i2` on(`i1`.`asset_code` = `i2`.`asset_code` and `i1`.`created_at` = `i2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_interest_data`
--
DROP TABLE IF EXISTS `latest_interest_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_interest_data`  AS SELECT `i1`.`id` AS `id`, `i1`.`asset_code` AS `asset_code`, `i1`.`interest_rate` AS `interest_rate`, `i1`.`change_in_interest` AS `change_in_interest`, `i1`.`created_at` AS `created_at`, `i1`.`updated_at` AS `updated_at` FROM (`interest_rate` `i1` join (select `interest_rate`.`asset_code` AS `asset_code`,max(`interest_rate`.`created_at`) AS `max_created` from `interest_rate` group by `interest_rate`.`asset_code`) `i2` on(`i1`.`asset_code` = `i2`.`asset_code` and `i1`.`created_at` = `i2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_mpmi_data`
--
DROP TABLE IF EXISTS `latest_mpmi_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_mpmi_data`  AS SELECT `m1`.`id` AS `id`, `m1`.`asset_code` AS `asset_code`, `m1`.`service_pmi` AS `service_pmi`, `m1`.`forecast` AS `forecast`, `m1`.`result` AS `result`, `m1`.`created_at` AS `created_at`, `m1`.`updated_at` AS `updated_at` FROM (`mpmi` `m1` join (select `mpmi`.`asset_code` AS `asset_code`,max(`mpmi`.`created_at`) AS `max_created` from `mpmi` group by `mpmi`.`asset_code`) `m2` on(`m1`.`asset_code` = `m2`.`asset_code` and `m1`.`created_at` = `m2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_retail_data`
--
DROP TABLE IF EXISTS `latest_retail_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_retail_data`  AS SELECT `r1`.`id` AS `id`, `r1`.`asset_code` AS `asset_code`, `r1`.`retail_sales` AS `retail_sales`, `r1`.`forecast` AS `forecast`, `r1`.`net_change_percent` AS `net_change_percent`, `r1`.`result` AS `result`, `r1`.`created_at` AS `created_at`, `r1`.`updated_at` AS `updated_at` FROM (`retail_sales` `r1` join (select `retail_sales`.`asset_code` AS `asset_code`,max(`retail_sales`.`created_at`) AS `max_created` from `retail_sales` group by `retail_sales`.`asset_code`) `r2` on(`r1`.`asset_code` = `r2`.`asset_code` and `r1`.`created_at` = `r2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_sentiment_data`
--
DROP TABLE IF EXISTS `latest_sentiment_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_sentiment_data`  AS SELECT `rs1`.`id` AS `id`, `rs1`.`asset_pair_code` AS `asset_pair_code`, `rs1`.`retail_long` AS `retail_long`, `rs1`.`retail_short` AS `retail_short`, `rs1`.`created_at` AS `created_at`, `rs1`.`updated_at` AS `updated_at` FROM (`retail_sentiment` `rs1` join (select `retail_sentiment`.`asset_pair_code` AS `asset_pair_code`,max(`retail_sentiment`.`created_at`) AS `max_created` from `retail_sentiment` group by `retail_sentiment`.`asset_pair_code`) `rs2` on(`rs1`.`asset_pair_code` = `rs2`.`asset_pair_code` and `rs1`.`created_at` = `rs2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_spmi_data`
--
DROP TABLE IF EXISTS `latest_spmi_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_spmi_data`  AS SELECT `s1`.`id` AS `id`, `s1`.`asset_code` AS `asset_code`, `s1`.`service_pmi` AS `service_pmi`, `s1`.`forecast` AS `forecast`, `s1`.`result` AS `result`, `s1`.`created_at` AS `created_at`, `s1`.`updated_at` AS `updated_at` FROM (`spmi` `s1` join (select `spmi`.`asset_code` AS `asset_code`,max(`spmi`.`created_at`) AS `max_created` from `spmi` group by `spmi`.`asset_code`) `s2` on(`s1`.`asset_code` = `s2`.`asset_code` and `s1`.`created_at` = `s2`.`max_created`)) ;

-- --------------------------------------------------------

--
-- Structure for view `latest_unemployment_data`
--
DROP TABLE IF EXISTS `latest_unemployment_data`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `latest_unemployment_data`  AS SELECT `u1`.`id` AS `id`, `u1`.`asset_code` AS `asset_code`, `u1`.`unemployment_rate` AS `unemployment_rate`, `u1`.`forecast` AS `forecast`, `u1`.`net_change_percent` AS `net_change_percent`, `u1`.`result` AS `result`, `u1`.`created_at` AS `created_at`, `u1`.`updated_at` AS `updated_at` FROM (`unemployment_rate` `u1` join (select `unemployment_rate`.`asset_code` AS `asset_code`,max(`unemployment_rate`.`created_at`) AS `max_created` from `unemployment_rate` group by `unemployment_rate`.`asset_code`) `u2` on(`u1`.`asset_code` = `u2`.`asset_code` and `u1`.`created_at` = `u2`.`max_created`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logs_account` (`account_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_account_action` (`account_id`,`action`);

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD KEY `idx_assets_code` (`code`),
  ADD KEY `idx_assets_type` (`type`);

--
-- Indexes for table `asset_pairs`
--
ALTER TABLE `asset_pairs`
  ADD KEY `idx_asset_pairs_code` (`asset_pair_code`),
  ADD KEY `idx_asset_pairs_base_quote` (`base_asset`,`quote_asset`);

--
-- Indexes for table `asset_pair_scores`
--
ALTER TABLE `asset_pair_scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_asset_pair` (`asset_pair_code`),
  ADD KEY `idx_total_score` (`total_score`),
  ADD KEY `idx_bias_output` (`bias_output`),
  ADD KEY `idx_last_calculated` (`last_calculated`);

--
-- Indexes for table `core_inflation`
--
ALTER TABLE `core_inflation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inflation_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_inflation_asset_code` (`asset_code`);

--
-- Indexes for table `core_inflation_history`
--
ALTER TABLE `core_inflation_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `cot_data`
--
ALTER TABLE `cot_data`
  ADD KEY `idx_cot_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_cot_asset_code` (`asset_code`);

--
-- Indexes for table `cot_data_history`
--
ALTER TABLE `cot_data_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `economic_data_summary`
--
ALTER TABLE `economic_data_summary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_asset_pair` (`asset_pair_code`),
  ADD KEY `idx_total_score` (`total_score`),
  ADD KEY `idx_bias_output` (`bias_output`),
  ADD KEY `idx_last_updated` (`last_updated`);

--
-- Indexes for table `employment_change`
--
ALTER TABLE `employment_change`
  ADD KEY `idx_employment_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_employment_asset_code` (`asset_code`);

--
-- Indexes for table `employment_change_history`
--
ALTER TABLE `employment_change_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `gdp_growth`
--
ALTER TABLE `gdp_growth`
  ADD KEY `idx_gdp_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_gdp_asset_code` (`asset_code`);

--
-- Indexes for table `gdp_growth_history`
--
ALTER TABLE `gdp_growth_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `interest_rate`
--
ALTER TABLE `interest_rate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_interest_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_interest_asset_code` (`asset_code`);

--
-- Indexes for table `interest_rate_history`
--
ALTER TABLE `interest_rate_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `mpmi`
--
ALTER TABLE `mpmi`
  ADD KEY `idx_mpmi_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_mpmi_asset_code` (`asset_code`);

--
-- Indexes for table `mpmi_history`
--
ALTER TABLE `mpmi_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `nfp_history`
--
ALTER TABLE `nfp_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_id` (`account_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `account_id_unique` (`account_id`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD KEY `fk_profiles_account` (`account_id`),
  ADD KEY `idx_roles` (`roles`),
  ADD KEY `idx_trading_level` (`trading_level`),
  ADD KEY `idx_authenticated` (`authenticated`),
  ADD KEY `idx_email_verified` (`is_verified`),
  ADD KEY `idx_name_email` (`name`,`email`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`referral_id`),
  ADD KEY `referrals_ibfk_1` (`student_id`);

--
-- Indexes for table `retail_sales`
--
ALTER TABLE `retail_sales`
  ADD KEY `idx_retail_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_retail_asset_code` (`asset_code`);

--
-- Indexes for table `retail_sales_history`
--
ALTER TABLE `retail_sales_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `retail_sentiment`
--
ALTER TABLE `retail_sentiment`
  ADD KEY `idx_sentiment_pair_created_desc` (`asset_pair_code`,`created_at`),
  ADD KEY `idx_sentiment_pair_code` (`asset_pair_code`);

--
-- Indexes for table `retail_sentiment_history`
--
ALTER TABLE `retail_sentiment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pair_created` (`asset_pair_code`,`created_at`);

--
-- Indexes for table `spmi`
--
ALTER TABLE `spmi`
  ADD KEY `idx_spmi_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_spmi_asset_code` (`asset_code`);

--
-- Indexes for table `spmi_history`
--
ALTER TABLE `spmi_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `student_fk_name` (`account_id`),
  ADD KEY `idx_name_student_id` (`name`,`student_id`);

--
-- Indexes for table `unemployment_rate`
--
ALTER TABLE `unemployment_rate`
  ADD KEY `idx_unemployment_asset_created_desc` (`asset_code`,`created_at`),
  ADD KEY `idx_unemployment_asset_code` (`asset_code`);

--
-- Indexes for table `unemployment_rate_history`
--
ALTER TABLE `unemployment_rate_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asset_created` (`asset_code`,`created_at`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id_unique` (`session_id`),
  ADD KEY `fk_sessions_account` (`account_id`),
  ADD KEY `idx_active_sessions` (`account_id`,`is_active`,`expires_at`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_ip_address` (`ip_address`),
  ADD KEY `idx_account_active_expires` (`account_id`,`is_active`,`expires_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `asset_pair_scores`
--
ALTER TABLE `asset_pair_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_inflation`
--
ALTER TABLE `core_inflation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `core_inflation_history`
--
ALTER TABLE `core_inflation_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `cot_data_history`
--
ALTER TABLE `cot_data_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `economic_data_summary`
--
ALTER TABLE `economic_data_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `employment_change_history`
--
ALTER TABLE `employment_change_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `gdp_growth_history`
--
ALTER TABLE `gdp_growth_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `interest_rate`
--
ALTER TABLE `interest_rate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `interest_rate_history`
--
ALTER TABLE `interest_rate_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `mpmi_history`
--
ALTER TABLE `mpmi_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `nfp_history`
--
ALTER TABLE `nfp_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `referral_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retail_sales_history`
--
ALTER TABLE `retail_sales_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `retail_sentiment_history`
--
ALTER TABLE `retail_sentiment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `spmi_history`
--
ALTER TABLE `spmi_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `unemployment_rate_history`
--
ALTER TABLE `unemployment_rate_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_logs_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `fk_profiles_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `referrals`
--
ALTER TABLE `referrals`
  ADD CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `student_fk_name` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_sessions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
