# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import mysql.connector
# import pandas as pd
# import numpy as np
# from datetime import datetime, timedelta
# import warnings
# warnings.filterwarnings('ignore')

# app = Flask(__name__)
# CORS(app)  # Enable CORS for Vite development server

# class CurrencyProfileAI:
#     def __init__(self, host='localhost', user='root', password='', database='8con'):
#         """Initialize the AI with database connection"""
#         self.connection = mysql.connector.connect(
#             host=host,
#             user=user,
#             password=password,
#             database=database
#         )
#         self.cursor = self.connection.cursor(dictionary=True)
        
#     def get_latest_economic_data(self, asset_code):
#         """Get the latest economic data for a specific asset"""
#         data = {}
        
#         # Get COT Data
#         query = "SELECT * FROM cot_data WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         cot_data = self.cursor.fetchone()
        
#         # Get Interest Rate
#         query = "SELECT * FROM interest_rate WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         interest_data = self.cursor.fetchone()
        
#         # Get Core Inflation
#         query = "SELECT * FROM core_inflation WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         inflation_data = self.cursor.fetchone()
        
#         # Get GDP Growth
#         query = "SELECT * FROM gdp_growth WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         gdp_data = self.cursor.fetchone()
        
#         # Get Employment Change
#         query = "SELECT * FROM employment_change WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         employment_data = self.cursor.fetchone()
        
#         # Get Unemployment Rate
#         query = "SELECT * FROM unemployment_rate WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         unemployment_data = self.cursor.fetchone()
        
#         # Get Manufacturing PMI
#         query = "SELECT * FROM mpmi WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         mpmi_data = self.cursor.fetchone()
        
#         # Get Services PMI
#         query = "SELECT * FROM spmi WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         spmi_data = self.cursor.fetchone()
        
#         # Get Retail Sales
#         query = "SELECT * FROM retail_sales WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (asset_code,))
#         retail_data = self.cursor.fetchone()
        
#         # Get Retail Sentiment
#         query = "SELECT * FROM retail_sentiment WHERE asset_pair_code LIKE %s ORDER BY created_at DESC LIMIT 1"
#         self.cursor.execute(query, (f"%{asset_code}%",))
#         retail_sentiment = self.cursor.fetchone()
        
#         return {
#             'cot': cot_data,
#             'interest_rate': interest_data,
#             'inflation': inflation_data,
#             'gdp': gdp_data,
#             'employment': employment_data,
#             'unemployment': unemployment_data,
#             'mpmi': mpmi_data,
#             'spmi': spmi_data,
#             'retail': retail_data,
#             'retail_sentiment': retail_sentiment
#         }
    
#     def calculate_individual_scores(self, base_data, quote_data):
#         """Calculate individual metric scores using the exact algorithm from React components"""
#         scores = {}
        
#         # COT Scoring (-2 to +2 total, -1 to +1 each for base and quote)
#         cot_base_score = 0
#         cot_quote_score = 0
        
#         if base_data['cot'] and base_data['cot'].get('net_change_percent') is not None:
#             if base_data['cot']['net_change_percent'] > 0:
#                 cot_base_score = 1
#             elif base_data['cot']['net_change_percent'] < 0:
#                 cot_base_score = -1
                
#         if quote_data['cot'] and quote_data['cot'].get('net_change_percent') is not None:
#             if quote_data['cot']['net_change_percent'] > 0:
#                 cot_quote_score = -1  # Opposite for quote
#             elif quote_data['cot']['net_change_percent'] < 0:
#                 cot_quote_score = 1   # Opposite for quote
                
#         scores['cot'] = max(-2, min(2, cot_base_score + cot_quote_score))
        
#         # Retail Position Score (-1 to +1) - Contrarian approach
#         retail_score = 0
#         if base_data.get('retail_sentiment'):
#             long_pct = base_data['retail_sentiment'].get('retail_long', 0)
#             short_pct = base_data['retail_sentiment'].get('retail_short', 0)
#             retail_score = -1 if long_pct > short_pct else 1
#         scores['retail_position'] = retail_score
        
#         # Employment Change Score (-2 to +2)
#         emp_base_score = 0
#         emp_quote_score = 0
        
#         if base_data['employment']:
#             actual = base_data['employment'].get('employment_change', 0)
#             forecast = base_data['employment'].get('forecast', 0)
#             if actual > forecast:
#                 emp_base_score = 1
#             elif actual < forecast:
#                 emp_base_score = -1
                
#         if quote_data['employment']:
#             actual = quote_data['employment'].get('employment_change', 0)
#             forecast = quote_data['employment'].get('forecast', 0)
#             if actual > forecast:
#                 emp_quote_score = -1  # Opposite for quote
#             elif actual < forecast:
#                 emp_quote_score = 1   # Opposite for quote
                
#         scores['employment'] = max(-2, min(2, emp_base_score + emp_quote_score))
        
#         # Unemployment Score (-2 to +2)
#         unemp_base_score = 0
#         unemp_quote_score = 0
        
#         if base_data['unemployment']:
#             actual = base_data['unemployment'].get('unemployment_rate', 0)
#             forecast = base_data['unemployment'].get('forecast', 0)
#             if actual > forecast:
#                 unemp_base_score = -1  # Higher unemployment is bad
#             elif actual < forecast:
#                 unemp_base_score = 1   # Lower unemployment is good
                
#         if quote_data['unemployment']:
#             actual = quote_data['unemployment'].get('unemployment_rate', 0)
#             forecast = quote_data['unemployment'].get('forecast', 0)
#             if actual > forecast:
#                 unemp_quote_score = 1   # Opposite for quote
#             elif actual < forecast:
#                 unemp_quote_score = -1  # Opposite for quote
                
#         scores['unemployment'] = max(-2, min(2, unemp_base_score + unemp_quote_score))
        
#         # Economic Growth Scores - Helper function
#         def calculate_growth_score(base_result, quote_result):
#             base_score = 0
#             quote_score = 0
            
#             if base_result:
#                 if base_result.lower() in ['beat']:
#                     base_score = 1
#                 elif base_result.lower() in ['miss', 'missed']:
#                     base_score = -1
                    
#             if quote_result:
#                 if quote_result.lower() in ['beat']:
#                     quote_score = -1  # Opposite for quote
#                 elif quote_result.lower() in ['miss', 'missed']:
#                     quote_score = 1   # Opposite for quote
                    
#             return max(-2, min(2, base_score + quote_score))
        
#         # GDP Score
#         gdp_base_result = base_data['gdp']['result'] if base_data['gdp'] else None
#         gdp_quote_result = quote_data['gdp']['result'] if quote_data['gdp'] else None
#         scores['gdp'] = calculate_growth_score(gdp_base_result, gdp_quote_result)
        
#         # Manufacturing PMI Score
#         mpmi_base_result = base_data['mpmi']['result'] if base_data['mpmi'] else None
#         mpmi_quote_result = quote_data['mpmi']['result'] if quote_data['mpmi'] else None
#         scores['mpmi'] = calculate_growth_score(mpmi_base_result, mpmi_quote_result)
        
#         # Services PMI Score
#         spmi_base_result = base_data['spmi']['result'] if base_data['spmi'] else None
#         spmi_quote_result = quote_data['spmi']['result'] if quote_data['spmi'] else None
#         scores['spmi'] = calculate_growth_score(spmi_base_result, spmi_quote_result)
        
#         # Retail Sales Score
#         retail_base_result = base_data['retail']['result'] if base_data['retail'] else None
#         retail_quote_result = quote_data['retail']['result'] if quote_data['retail'] else None
#         scores['retail_sales'] = calculate_growth_score(retail_base_result, retail_quote_result)
        
#         # Inflation Score (-2 to +2)
#         infl_base_score = 0
#         infl_quote_score = 0
        
#         if base_data['inflation']:
#             actual = base_data['inflation'].get('core_inflation', 0)
#             forecast = base_data['inflation'].get('forecast', 0)
#             if actual > forecast:
#                 infl_base_score = 1  # Higher inflation can be positive for currency
#             elif actual < forecast:
#                 infl_base_score = -1
                
#         if quote_data['inflation']:
#             actual = quote_data['inflation'].get('core_inflation', 0)
#             forecast = quote_data['inflation'].get('forecast', 0)
#             if actual > forecast:
#                 infl_quote_score = -1  # Opposite for quote
#             elif actual < forecast:
#                 infl_quote_score = 1   # Opposite for quote
                
#         scores['inflation'] = max(-2, min(2, infl_base_score + infl_quote_score))
        
#         # Interest Rate Score (-2 to +2)
#         int_base_score = 0
#         int_quote_score = 0
        
#         if base_data['interest_rate']:
#             change = base_data['interest_rate'].get('change_in_interest', 0)
#             if change > 0:
#                 int_base_score = 1
#             elif change < 0:
#                 int_base_score = -1
                
#         if quote_data['interest_rate']:
#             change = quote_data['interest_rate'].get('change_in_interest', 0)
#             if change > 0:
#                 int_quote_score = -1  # Opposite for quote
#             elif change < 0:
#                 int_quote_score = 1   # Opposite for quote
                
#         scores['interest_rate'] = max(-2, min(2, int_base_score + int_quote_score))
        
#         return scores

#     def calculate_currency_strength_score(self, asset_code):
#         """Calculate comprehensive strength score matching React algorithm"""
#         data = self.get_latest_economic_data(asset_code)
        
#         # For individual currency analysis, compare against neutral baseline
#         baseline_data = {key: None for key in data.keys()}
        
#         scores = self.calculate_individual_scores(data, baseline_data)
#         total_score = sum(scores.values())
        
#         return {
#             'score': total_score,
#             'asset_code': asset_code,
#             'individual_scores': scores,
#             'data_points': data
#         }
    
#     def get_currency_bias(self, total_score):
#         """Determine currency bias based on total score using React ranges"""
#         if total_score >= 12:
#             return "Very Bullish"
#         elif total_score >= 5:
#             return "Bullish"
#         elif total_score >= -4:
#             return "Neutral"
#         elif total_score >= -11:
#             return "Bearish"
#         else:
#             return "Very Bearish"
    
#     def analyze_currency_pair(self, base_asset, quote_asset):
#         """Enhanced currency pair analysis with improved recommendations"""
#         base_data = self.get_latest_economic_data(base_asset)
#         quote_data = self.get_latest_economic_data(quote_asset)
        
#         # Calculate scores using the exact React algorithm
#         individual_scores = self.calculate_individual_scores(base_data, quote_data)
#         total_score = sum(individual_scores.values())
        
#         # Calculate individual currency strengths for comparison
#         base_strength = self.calculate_currency_strength_score(base_asset)
#         quote_strength = self.calculate_currency_strength_score(quote_asset)
        
#         # Enhanced recommendation logic
#         recommendation, confidence, position_size = self.get_enhanced_recommendation(total_score, individual_scores)
        
#         # Generate market insights
#         insights = self.generate_enhanced_market_insights(base_asset, quote_asset, base_data, quote_data, individual_scores)
        
#         # Generate trading reminders
#         reminders = self.generate_trading_reminders(total_score, individual_scores)
        
#         return {
#             'pair': f"{base_asset}{quote_asset}",
#             'base_currency': {
#                 'code': base_asset,
#                 'score': base_strength['score'],
#                 'bias': self.get_currency_bias(base_strength['score'])
#             },
#             'quote_currency': {
#                 'code': quote_asset,
#                 'score': quote_strength['score'],
#                 'bias': self.get_currency_bias(quote_strength['score'])
#             },
#             'total_score': total_score,
#             'individual_scores': individual_scores,
#             'strength_difference': base_strength['score'] - quote_strength['score'],
#             'recommendation': recommendation,
#             'confidence': confidence,
#             'position_size': position_size,
#             'insights': insights,
#             'reminders': reminders,
#             'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#         }
    
#     def get_enhanced_recommendation(self, total_score, individual_scores):
#         """Generate enhanced trading recommendations with position sizing"""
#         # Count strong signals
#         strong_bullish_signals = sum(1 for score in individual_scores.values() if score >= 2)
#         strong_bearish_signals = sum(1 for score in individual_scores.values() if score <= -2)
#         moderate_signals = sum(1 for score in individual_scores.values() if abs(score) == 1)
        
#         # Base recommendation on total score
#         if total_score >= 12:
#             action = "STRONG BUY"
#             confidence = "High"
#             position_size = "2-3% risk per trade"
#         elif total_score >= 8:
#             action = "BUY"
#             confidence = "High"
#             position_size = "1.5-2% risk per trade"
#         elif total_score >= 5:
#             action = "BUY"
#             confidence = "Medium"
#             position_size = "1-1.5% risk per trade"
#         elif total_score >= -4:
#             action = "HOLD/MONITOR"
#             confidence = "Low"
#             position_size = "0.5-1% risk per trade (if trading)"
#         elif total_score >= -8:
#             action = "SELL"
#             confidence = "Medium"
#             position_size = "1-1.5% risk per trade"
#         elif total_score >= -11:
#             action = "SELL"
#             confidence = "High"
#             position_size = "1.5-2% risk per trade"
#         else:
#             action = "STRONG SELL"
#             confidence = "High"
#             position_size = "2-3% risk per trade"
        
#         # Adjust confidence based on signal consistency
#         if strong_bullish_signals >= 3 or strong_bearish_signals >= 3:
#             confidence = "Very High"
#         elif strong_bullish_signals + strong_bearish_signals >= 4:
#             confidence = "High"
#         elif moderate_signals >= 5:
#             confidence = "Medium" if confidence == "High" else confidence
        
#         return action, confidence, position_size

#     def generate_enhanced_market_insights(self, base_asset, quote_asset, base_data, quote_data, scores):
#         """Generate comprehensive market insights"""
#         insights = []
        
#         # Interest Rate Analysis
#         if base_data['interest_rate'] and quote_data['interest_rate']:
#             base_change = base_data['interest_rate'].get('change_in_interest', 0)
#             quote_change = quote_data['interest_rate'].get('change_in_interest', 0)
            
#             if abs(base_change - quote_change) > 0.25:  # Significant difference
#                 if base_change > quote_change:
#                     insights.append(f"Interest rate differentials strongly favor {base_asset} (+{base_change:.2f}% vs {quote_change:+.2f}%)")
#                 else:
#                     insights.append(f"Interest rate differentials favor {quote_asset} ({base_change:+.2f}% vs +{quote_change:.2f}%)")
        
#         # Economic Growth Momentum
#         growth_scores = [scores['gdp'], scores['mpmi'], scores['spmi'], scores['retail_sales']]
#         avg_growth = sum(growth_scores) / len(growth_scores) if growth_scores else 0
        
#         if avg_growth >= 1:
#             insights.append(f"{base_asset} shows strong economic growth momentum across multiple indicators")
#         elif avg_growth <= -1:
#             insights.append(f"{quote_asset} demonstrates superior economic growth compared to {base_asset}")
        
#         # Employment Market Analysis
#         if scores['employment'] >= 1 and scores['unemployment'] >= 1:
#             insights.append(f"{base_asset} labor market significantly outperforming expectations")
#         elif scores['employment'] <= -1 and scores['unemployment'] <= -1:
#             insights.append(f"{quote_asset} showing stronger employment fundamentals")
        
#         # Institutional vs Retail Sentiment
#         if scores['cot'] >= 1 and scores['retail_position'] >= 1:
#             insights.append(f"Both institutional (COT) and retail sentiment align bullishly for {base_asset}")
#         elif scores['cot'] >= 1 and scores['retail_position'] <= -1:
#             insights.append(f"Institutional money favors {base_asset} while retail traders are positioned oppositely (contrarian signal)")
        
#         # Risk Assessment
#         negative_scores = sum(1 for score in scores.values() if score < 0)
#         positive_scores = sum(1 for score in scores.values() if score > 0)
        
#         if negative_scores > positive_scores * 2:
#             insights.append("⚠️ Multiple conflicting signals detected - consider waiting for clearer directional bias")
#         elif positive_scores > negative_scores * 2:
#             insights.append("✅ Strong consensus across multiple fundamental indicators supporting the bias")
        
#         return insights if insights else ["Market fundamentals show mixed signals - monitor for clearer directional bias"]

#     def generate_trading_reminders(self, total_score, individual_scores):
#         """Generate specific trading reminders based on analysis"""
#         reminders = []
        
#         # Risk management based on score strength
#         if abs(total_score) >= 12:
#             reminders.append("High conviction setup - ensure proper position sizing (max 2-3% risk)")
#             reminders.append("Set tight stop losses due to strong directional bias")
#         elif abs(total_score) <= 4:
#             reminders.append("Low conviction environment - reduce position sizes significantly")
#             reminders.append("Consider wider stops or avoid trading until clearer signals emerge")
        
#         # Always include standard reminders
#         reminders.extend([
#             "Verify key technical levels before entry",
#             "Check economic calendar for high-impact news",
#             "This is fundamental analysis only - combine with technical analysis",
#             "Never risk more than 1-2% of account per trade"
#         ])
        
#         return reminders[:6]  # Limit to 6 most relevant reminders

#     def summarize_currency_profile_data(self, base_asset, quote_asset):
#         """Comprehensive summary of CurrencyProfile data for traders"""
#         analysis = self.analyze_currency_pair(base_asset, quote_asset)
        
#         summary = {
#             'executive_summary': f"**{analysis['pair']} Analysis Summary**\n\n"
#                                f"• **Overall Bias**: {self.get_currency_bias(analysis['total_score'])} (Score: {analysis['total_score']})\n"
#                                f"• **Recommendation**: {analysis['recommendation']}\n"
#                                f"• **Confidence Level**: {analysis['confidence']}\n"
#                                f"• **Suggested Position Size**: {analysis['position_size']}\n",
#             'key_drivers': self._identify_key_drivers(analysis['individual_scores']),
#             'risk_factors': self._identify_risk_factors(analysis['individual_scores']),
#             'trading_plan': f"Entry: {analysis['recommendation']} | Risk: {analysis['position_size']} | Confidence: {analysis['confidence']}",
#             'market_insights': analysis['insights'],
#             'trading_reminders': analysis['reminders']
#         }
        
#         return summary

#     def _identify_key_drivers(self, scores):
#         """Identify strongest fundamental drivers"""
#         drivers = []
        
#         metric_names = {
#             'cot': 'Institutional Positioning (COT)',
#             'retail_position': 'Retail Sentiment',
#             'employment': 'Employment Data',
#             'unemployment': 'Unemployment Rates',
#             'gdp': 'GDP Growth',
#             'mpmi': 'Manufacturing PMI',
#             'spmi': 'Services PMI',
#             'retail_sales': 'Retail Sales',
#             'inflation': 'Inflation Trends',
#             'interest_rate': 'Interest Rate Policy'
#         }
        
#         for metric, score in scores.items():
#             if abs(score) >= 2:
#                 direction = "Strong bullish" if score > 0 else "Strong bearish"
#                 drivers.append(f"🎯 **{metric_names[metric]}**: {direction} signal")
#             elif abs(score) >= 1:
#                 direction = "Moderate bullish" if score > 0 else "Moderate bearish"
#                 drivers.append(f"📊 **{metric_names[metric]}**: {direction} signal")
        
#         return drivers if drivers else ["No significant fundamental drivers identified"]

#     def _identify_risk_factors(self, scores):
#         """Identify potential risk factors"""
#         risks = []
        
#         # Check for conflicting signals
#         positive_count = sum(1 for score in scores.values() if score > 0)
#         negative_count = sum(1 for score in scores.values() if score < 0)
        
#         if positive_count > 0 and negative_count > 0:
#             if abs(positive_count - negative_count) <= 2:
#                 risks.append("⚠️ Mixed signals across fundamental indicators")
        
#         # Check for weak signals
#         weak_signals = sum(1 for score in scores.values() if abs(score) <= 1)
#         if weak_signals >= 6:
#             risks.append("⚠️ Most signals are weak - low conviction environment")
        
#         # Check for retail vs institutional divergence
#         if 'cot' in scores and 'retail_position' in scores:
#             if scores['cot'] * scores['retail_position'] < 0:
#                 risks.append("⚠️ Institutional and retail sentiment diverge")
        
#         return risks if risks else ["No significant risk factors identified"]

#     def close_connection(self):
#         """Close database connection"""
#         if self.connection.is_connected():
#             self.cursor.close()
#             self.connection.close()

# # Initialize AI instance
# ai = CurrencyProfileAI()

# # Ensure connection cleanup on app shutdown
# import atexit
# atexit.register(lambda: ai.close_connection())

# @app.route('/api/ai-insight/<pair_code>', methods=['GET'])
# def get_ai_insight(pair_code):
#     """API endpoint to get AI insights for a currency pair"""
#     try:
#         # Extract base and quote assets from pair code (e.g., EURUSD -> EUR, USD)
#         if len(pair_code) == 6:
#             base_asset = pair_code[:3]
#             quote_asset = pair_code[3:]
#         else:
#             return jsonify({'error': 'Invalid pair code format'}), 400
        
#         # Get AI analysis
#         analysis = ai.analyze_currency_pair(base_asset, quote_asset)
#         summary = ai.summarize_currency_profile_data(base_asset, quote_asset)
        
#         # Format response for frontend
#         response = {
#             'success': True,
#             'data': {
#                 'pair': analysis['pair'],
#                 'recommendation': analysis['recommendation'],
#                 'confidence': analysis['confidence'],
#                 'base_currency': analysis['base_currency'],
#                 'quote_currency': analysis['quote_currency'],
#                 'strength_difference': analysis['strength_difference'],
#                 'total_score': analysis['total_score'],
#                 'individual_scores': analysis['individual_scores'],
#                 'insights': analysis['insights'],
#                 'analysis_date': analysis['analysis_date'],
#                 'reminders': analysis['reminders'],
#                 'summary': summary
#             }
#         }
        
#         return jsonify(response)
        
#     except Exception as e:
#         return jsonify({'error': str(e), 'success': False}), 500
    
# @app.route('/api/currency-strength/<asset_code>', methods=['GET'])
# def get_currency_strength(asset_code):
#     """API endpoint to get individual currency strength"""
#     try:
#         strength = ai.calculate_currency_strength_score(asset_code.upper())
        
#         response = {
#             'success': True,
#             'data': {
#                 'asset_code': strength['asset_code'],
#                 'score': strength['score'],
#                 'bias': ai.get_currency_bias(strength['score']),
#                 'individual_scores': strength['individual_scores']
#             }
#         }
        
#         return jsonify(response)
        
#     except Exception as e:
#         return jsonify({'error': str(e), 'success': False}), 500
    
# @app.route('/health', methods=['GET'])
# def health_check():
#     """Health check endpoint"""
#     return jsonify({'status': 'healthy', 'service': '8ConEdge AI API'})

# if __name__ == '__main__':
#     print("Starting 8ConEdge AI API Server...")
#     print("Available endpoints:")
#     print("- GET /api/ai-insight/<pair_code> (e.g., /api/ai-insight/EURUSD)")
#     print("- GET /api/currency-strength/<asset_code> (e.g., /api/currency-strength/EUR)")
#     print("- GET /health")
#     app.run(debug=True, host='0.0.0.0', port=5000)
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
import os
import traceback
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for Vite development server

class CurrencyProfileAI:
    def __init__(self, currency_profile_api_base_url=None):
        """Initialize the AI with currency profile API connection"""
        # Get base URL from environment or use default
        self.currency_profile_api_base_url = currency_profile_api_base_url or os.getenv('VITE_API_BASE_URL', 'localhost')
        
        # Define indicator weights based on market impact
        self.indicator_weights = {
            'interest_rate': 3.0,
            'inflation': 2.5,
            'employment': 2.0,
            'gdp': 2.0,
            'cot': 1.8,
            'unemployment': 1.5,
            'mpmi': 1.2,
            'spmi': 1.2,
            'retail': 1.0,
            'retail_position': 0.8
        }
        
    def safe_numeric(self, value, default=0):
        """Safely convert any value to numeric"""
        try:
            if value is None:
                return default
            if isinstance(value, (int, float)):
                return float(value)
            elif isinstance(value, str):
                # Handle comma-separated numbers and percentage signs
                clean_value = value.replace(',', '').replace('%', '').strip()
                return float(clean_value) if clean_value and clean_value != 'N/A' else default
            else:
                return default
        except (ValueError, TypeError):
            return default

    def safe_get(self, data, key, default=None):
        """Safely get value from dictionary"""
        try:
            if isinstance(data, dict):
                return data.get(key, default)
            return default
        except:
            return default

    def extract_economic_data_from_profile(self, profile_data):
        """Extract economic data from currency profile format with robust error handling"""
        try:
            print(f"[EXTRACT] Starting data extraction")
            
            if not profile_data:
                print("[WARNING] No profile data provided")
                return None
                
            breakdown = self.safe_get(profile_data, 'breakdown', [])
            if not breakdown:
                print("[WARNING] No breakdown data in profile")
                return None
            
            print(f"[PROCESS] Processing {len(breakdown)} indicators")
                
            # Safely get asset pair info
            asset_pair = self.safe_get(profile_data, 'assetPair', {})
            base_asset = self.safe_get(asset_pair, 'baseAsset', 'EUR')
            quote_asset = self.safe_get(asset_pair, 'quoteAsset', 'USD')
            total_score = self.safe_numeric(self.safe_get(profile_data, 'totalScore', 0))
            
            print(f"[PAIR] Asset pair: {base_asset}/{quote_asset}, Total Score: {total_score}")
            
            # Initialize data structure
            extracted_data = {
                'base_asset': base_asset,
                'quote_asset': quote_asset,
                'total_score': total_score,
                'indicators': {}
            }
            
            # Process each indicator safely
            for indicator in breakdown:
                try:
                    indicator_name = self.safe_get(indicator, 'name', '')
                    indicator_score = self.safe_numeric(self.safe_get(indicator, 'score', 0))
                    base_data = self.safe_get(indicator, 'baseData', {})
                    quote_data = self.safe_get(indicator, 'quoteData', {})
                    
                    print(f"[INDICATOR] Processing: {indicator_name} (Score: {indicator_score})")
                    
                    # Store indicator data
                    extracted_data['indicators'][indicator_name] = {
                        'score': indicator_score,
                        'base_data': base_data,
                        'quote_data': quote_data
                    }
                    
                except Exception as e:
                    print(f"[ERROR] Error processing indicator {indicator_name}: {e}")
                    continue
            
            print(f"[SUCCESS] Extraction complete. Processed {len(extracted_data['indicators'])} indicators")
            return extracted_data
            
        except Exception as e:
            print(f"[ERROR] Error in data extraction: {e}")
            print(f"[TRACEBACK] {traceback.format_exc()}")
            return None

    def analyze_currency_pair_with_data(self, asset_pair_code, profile_data):
        """Enhanced currency pair analysis with robust error handling"""
        try:
            print(f"[ANALYSIS] Starting analysis for {asset_pair_code}")
            
            # Extract base and quote assets from pair code
            if len(asset_pair_code) == 6:
                base_asset = asset_pair_code[:3]
                quote_asset = asset_pair_code[3:]
            else:
                raise Exception('Invalid pair code format')
            
            # Extract data safely
            extracted_data = self.extract_economic_data_from_profile(profile_data)
            if not extracted_data:
                raise Exception("Failed to extract data from profile")
            
            # Calculate enhanced scores
            analysis_result = self.calculate_enhanced_analysis(extracted_data)
            
            # Generate recommendation
            recommendation_data = self.generate_recommendation(analysis_result, extracted_data)
            
            # Format final response
            final_result = {
                'pair': f"{base_asset}{quote_asset}",
                'base_currency': {
                    'code': base_asset,
                    'score': extracted_data['total_score'],
                    'bias': self.get_currency_bias(extracted_data['total_score'])
                },
                'quote_currency': {
                    'code': quote_asset,
                    'score': 0,
                    'bias': 'Neutral'
                },
                'total_score': extracted_data['total_score'],
                'weighted_score': analysis_result.get('weighted_score', extracted_data['total_score']),
                'conviction': analysis_result.get('conviction', 5.0),
                'individual_scores': analysis_result.get('individual_scores', {}),
                'recommendation': recommendation_data['action'],
                'confidence': recommendation_data['confidence'],
                'position_size': recommendation_data['position_size'],
                'insights': analysis_result.get('insights', []),
                'reminders': recommendation_data.get('reminders', []),
                'detailed_analysis': analysis_result.get('detailed_analysis', {}),
                'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            print(f"[SUCCESS] Analysis complete for {asset_pair_code}")
            return final_result
            
        except Exception as e:
            print(f"[ERROR] Error in analysis: {e}")
            print(f"[TRACEBACK] {traceback.format_exc()}")
            # Return fallback analysis
            return self.create_fallback_analysis(asset_pair_code)

    def calculate_enhanced_analysis(self, extracted_data):
        """Calculate enhanced analysis metrics"""
        try:
            indicators = extracted_data.get('indicators', {})
            
            # Calculate weighted scores
            weighted_scores = {}
            total_weight = 0
            weighted_sum = 0
            
            for indicator_name, indicator_data in indicators.items():
                score = indicator_data.get('score', 0)
                
                # Map indicator names to weight keys
                weight_key = self.map_indicator_to_weight_key(indicator_name)
                weight = self.indicator_weights.get(weight_key, 1.0)
                
                weighted_scores[weight_key] = score
                weighted_sum += score * weight
                total_weight += weight
            
            final_weighted_score = weighted_sum / total_weight if total_weight > 0 else 0
            
            # Calculate conviction (0-10 scale)
            conviction = self.calculate_conviction(weighted_scores, extracted_data['total_score'])
            
            # Generate insights
            insights = self.generate_insights(indicators, extracted_data)
            
            # Generate detailed analysis
            detailed_analysis = {
                'consistency': self.analyze_consistency(weighted_scores),
                'risk_level': self.assess_risk_level(weighted_scores, conviction),
                'momentum_factors': self.identify_momentum_factors(indicators)
            }
            
            return {
                'weighted_score': final_weighted_score,
                'conviction': conviction,
                'individual_scores': weighted_scores,
                'insights': insights,
                'detailed_analysis': detailed_analysis
            }
            
        except Exception as e:
            print(f"[ERROR] Error in enhanced analysis: {e}")
            return {
                'weighted_score': extracted_data.get('total_score', 0),
                'conviction': 5.0,
                'individual_scores': {},
                'insights': ['Analysis completed with basic scoring'],
                'detailed_analysis': {}
            }

    def map_indicator_to_weight_key(self, indicator_name):
        """Map indicator names to weight keys"""
        indicator_name = indicator_name.lower()
        
        if 'interest' in indicator_name:
            return 'interest_rate'
        elif 'inflation' in indicator_name:
            return 'inflation'
        elif 'employment' in indicator_name:
            return 'employment'
        elif 'gdp' in indicator_name:
            return 'gdp'
        elif 'cot' in indicator_name:
            return 'cot'
        elif 'unemployment' in indicator_name:
            return 'unemployment'
        elif 'manufacturing' in indicator_name:
            return 'mpmi'
        elif 'services' in indicator_name:
            return 'spmi'
        elif 'retail sales' in indicator_name:
            return 'retail'
        elif 'retail position' in indicator_name:
            return 'retail_position'
        else:
            return 'other'

    def calculate_conviction(self, weighted_scores, total_score):
        """Calculate conviction level (0-10)"""
        try:
            # Base conviction on score consistency and magnitude
            scores = list(weighted_scores.values())
            if not scores:
                return 5.0
            
            # Factor 1: Magnitude (40%)
            magnitude_factor = min(4.0, abs(total_score) * 0.3)
            
            # Factor 2: Consistency (40%)
            positive_count = sum(1 for s in scores if s > 0)
            negative_count = sum(1 for s in scores if s < 0)
            total_count = len(scores)
            
            consistency_ratio = max(positive_count, negative_count) / total_count if total_count > 0 else 0
            consistency_factor = consistency_ratio * 4.0
            
            # Factor 3: Strong signals (20%)
            strong_signals = sum(1 for s in scores if abs(s) >= 2)
            strong_factor = min(2.0, strong_signals * 0.5)
            
            conviction = magnitude_factor + consistency_factor + strong_factor
            return min(10.0, max(0.0, conviction))
            
        except Exception as e:
            print(f"[ERROR] Error calculating conviction: {e}")
            return 5.0

    def generate_insights(self, indicators, extracted_data):
        """Generate market insights"""
        insights = []
        
        try:
            # Count strong signals
            strong_bullish = 0
            strong_bearish = 0
            
            for indicator_name, indicator_data in indicators.items():
                score = indicator_data.get('score', 0)
                if score >= 2:
                    strong_bullish += 1
                    insights.append(f"STRONG: {indicator_name} showing very bullish signals")
                elif score <= -2:
                    strong_bearish += 1
                    insights.append(f"STRONG: {indicator_name} showing very bearish signals")
            
            # Overall assessment
            total_score = extracted_data.get('total_score', 0)
            if total_score >= 8:
                insights.append("POSITIVE: Strong fundamental consensus supports bullish bias")
            elif total_score <= -8:
                insights.append("NEGATIVE: Strong fundamental consensus supports bearish bias")
            elif abs(total_score) <= 2:
                insights.append("NEUTRAL: Mixed fundamental signals suggest range-bound conditions")
            
            # Add specific insights based on key indicators
            if 'Interest Rates' in indicators:
                insights.append("MONETARY: Interest rate policy is a key driver for this pair")
            
            if strong_bullish > 3:
                insights.append("MOMENTUM: Multiple indicators showing strong bullish momentum")
            elif strong_bearish > 3:
                insights.append("MOMENTUM: Multiple indicators showing strong bearish momentum")
                
        except Exception as e:
            print(f"[ERROR] Error generating insights: {e}")
            insights = ["Enhanced fundamental analysis completed"]
        
        return insights[:5]  # Limit to top 5 insights

    def analyze_consistency(self, weighted_scores):
        """Analyze consistency across indicators"""
        try:
            scores = list(weighted_scores.values())
            if not scores:
                return {'consistency': 'Unknown', 'confidence': 0.5}
            
            positive_count = sum(1 for s in scores if s > 0)
            negative_count = sum(1 for s in scores if s < 0)
            total_count = len(scores)
            
            if positive_count / total_count >= 0.7:
                return {'consistency': 'Strong Bullish Consensus', 'confidence': 0.8}
            elif negative_count / total_count >= 0.7:
                return {'consistency': 'Strong Bearish Consensus', 'confidence': 0.8}
            elif max(positive_count, negative_count) / total_count >= 0.6:
                return {'consistency': 'Moderate Consensus', 'confidence': 0.6}
            else:
                return {'consistency': 'Mixed Signals', 'confidence': 0.3}
                
        except Exception as e:
            print(f"[ERROR] Error analyzing consistency: {e}")
            return {'consistency': 'Unknown', 'confidence': 0.5}

    def assess_risk_level(self, weighted_scores, conviction):
        """Assess overall risk level"""
        try:
            if conviction < 3:
                return 'High'
            elif conviction < 6:
                return 'Medium'
            else:
                return 'Low'
        except:
            return 'Medium'

    def identify_momentum_factors(self, indicators):
        """Identify momentum factors"""
        factors = []
        
        try:
            for indicator_name, indicator_data in indicators.items():
                score = indicator_data.get('score', 0)
                if abs(score) >= 2:
                    direction = 'Bullish' if score > 0 else 'Bearish'
                    strength = 'Strong' if abs(score) >= 2 else 'Moderate'
                    factors.append({
                        'factor': indicator_name,
                        'direction': direction,
                        'strength': strength
                    })
        except Exception as e:
            print(f"[ERROR] Error identifying momentum factors: {e}")
        
        return factors[:3]  # Top 3 factors

    def generate_recommendation(self, analysis_result, extracted_data):
        """Generate trading recommendation"""
        try:
            weighted_score = analysis_result.get('weighted_score', 0)
            conviction = analysis_result.get('conviction', 5)
            consistency = analysis_result.get('detailed_analysis', {}).get('consistency', {})
            
            # Base recommendation on weighted score and conviction
            if weighted_score >= 8 and conviction >= 7:
                action = "STRONG BUY"
                confidence = "Very High"
                position_size = "2-3% risk per trade"
            elif weighted_score >= 5 and conviction >= 6:
                action = "BUY"
                confidence = "High"
                position_size = "1.5-2% risk per trade"
            elif weighted_score >= 2 and conviction >= 5:
                action = "LEAN BUY"
                confidence = "Medium"
                position_size = "1-1.5% risk per trade"
            elif weighted_score <= -8 and conviction >= 7:
                action = "STRONG SELL"
                confidence = "Very High"
                position_size = "2-3% risk per trade"
            elif weighted_score <= -5 and conviction >= 6:
                action = "SELL"
                confidence = "High"
                position_size = "1.5-2% risk per trade"
            elif weighted_score <= -2 and conviction >= 5:
                action = "LEAN SELL"
                confidence = "Medium"
                position_size = "1-1.5% risk per trade"
            else:
                action = "HOLD/MONITOR"
                confidence = "Low"
                position_size = "0.5-1% risk per trade"
            
            # Generate reminders
            reminders = self.generate_reminders(conviction, consistency.get('consistency', 'Unknown'))
            
            return {
                'action': action,
                'confidence': confidence,
                'position_size': position_size,
                'reminders': reminders
            }
            
        except Exception as e:
            print(f"[ERROR] Error generating recommendation: {e}")
            return {
                'action': 'HOLD/MONITOR',
                'confidence': 'Low',
                'position_size': '1% risk per trade',
                'reminders': ['Enhanced analysis completed', 'Use proper risk management']
            }

    def generate_reminders(self, conviction, consistency):
        """Generate trading reminders"""
        reminders = []
        
        try:
            if conviction >= 8:
                reminders.append("HIGH CONVICTION: Strong signal alignment detected")
            elif conviction <= 3:
                reminders.append("LOW CONVICTION: Weak signals - reduce position size")
            
            if 'Mixed' in consistency:
                reminders.append("MIXED SIGNALS: Wait for clearer confirmation")
            
            reminders.extend([
                "TECHNICAL: Combine with technical analysis",
                "RISK: Never risk more than 2% per trade",
                "NEWS: Monitor economic calendar"
            ])
        except Exception as e:
            print(f"[ERROR] Error generating reminders: {e}")
            reminders = ['Enhanced analysis completed']
        
        return reminders[:6]

    def get_currency_bias(self, total_score):
        """Determine currency bias based on total score"""
        try:
            score = self.safe_numeric(total_score, 0)
            if score >= 12:
                return "Very Bullish"
            elif score >= 5:
                return "Bullish"
            elif score >= -4:
                return "Neutral"
            elif score >= -11:
                return "Bearish"
            else:
                return "Very Bearish"
        except:
            return "Neutral"

    def create_fallback_analysis(self, asset_pair_code):
        """Create fallback analysis when main analysis fails"""
        base_asset = asset_pair_code[:3] if len(asset_pair_code) >= 3 else 'EUR'
        quote_asset = asset_pair_code[3:] if len(asset_pair_code) >= 6 else 'USD'
        
        return {
            'pair': f"{base_asset}{quote_asset}",
            'base_currency': {
                'code': base_asset,
                'score': 0,
                'bias': 'Neutral'
            },
            'quote_currency': {
                'code': quote_asset,
                'score': 0,
                'bias': 'Neutral'
            },
            'total_score': 0,
            'weighted_score': 0,
            'conviction': 5.0,
            'individual_scores': {},
            'recommendation': 'HOLD/MONITOR',
            'confidence': 'Low',
            'position_size': '1% risk per trade',
            'insights': ['Analysis completed with limited data'],
            'reminders': ['Use additional analysis methods', 'Apply proper risk management'],
            'detailed_analysis': {},
            'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    def summarize_currency_profile_data_with_data(self, asset_pair_code, profile_data):
        """Create summary using provided data"""
        try:
            analysis = self.analyze_currency_pair_with_data(asset_pair_code, profile_data)
            
            summary = {
                'executive_summary': f"**{analysis['pair']} Enhanced Analysis**\n\n"
                                   f"• **Bias**: {analysis['base_currency']['bias']} (Score: {analysis['total_score']})\n"
                                   f"• **Conviction**: {analysis['conviction']:.1f}/10\n"
                                   f"• **Recommendation**: {analysis['recommendation']}\n"
                                   f"• **Confidence**: {analysis['confidence']}\n",
                'key_drivers': [f"ANALYSIS: {insight}" for insight in analysis['insights'][:3]],
                'risk_factors': [f"RISK: Consider using {analysis['position_size']}"],
                'trading_plan': f"{analysis['recommendation']} | {analysis['confidence']} confidence",
                'market_insights': analysis['insights'],
                'trading_reminders': analysis['reminders']
            }
            
            return summary
            
        except Exception as e:
            print(f"[ERROR] Error creating summary: {e}")
            return {
                'executive_summary': f"**{asset_pair_code} Analysis**\n\nBasic analysis completed.",
                'key_drivers': ['Enhanced analysis attempted'],
                'risk_factors': ['Use proper risk management'],
                'trading_plan': 'HOLD/MONITOR | Low confidence',
                'market_insights': ['Analysis completed'],
                'trading_reminders': ['Combine with other analysis methods']
            }

    # Fallback methods for backward compatibility
    def analyze_currency_pair(self, asset_pair_code):
        """Fallback method"""
        try:
            return self.create_fallback_analysis(asset_pair_code)
        except Exception as e:
            print(f"[ERROR] Fallback analysis failed: {e}")
            raise e

    def summarize_currency_profile_data(self, asset_pair_code):
        """Fallback summary method"""
        try:
            analysis = self.analyze_currency_pair(asset_pair_code)
            return {
                'executive_summary': f"**{asset_pair_code} Basic Analysis**\n\nFallback analysis completed.",
                'key_drivers': ['Basic analysis completed'],
                'risk_factors': ['Limited data available'],
                'trading_plan': 'HOLD/MONITOR',
                'market_insights': ['Use additional analysis'],
                'trading_reminders': ['Apply proper risk management']
            }
        except Exception as e:
            print(f"[ERROR] Fallback summary failed: {e}")
            raise e

# Initialize AI instance
ai = CurrencyProfileAI()

@app.route('/api/ai-insight/<pair_code>', methods=['GET', 'POST'])
def get_ai_insight(pair_code):
    """API endpoint to get AI insights for a currency pair"""
    try:
        print(f"[REQUEST] AI Insight request for: {pair_code} (Method: {request.method})")
        
        # Check if profile data was provided in request body (POST)
        profile_data = None
        if request.method == 'POST':
            try:
                request_data = request.get_json()
                if request_data and request_data.get('profileData'):
                    profile_data = request_data['profileData']
                    print(f"[DATA] Received profile data from frontend")
                else:
                    print(f"[WARNING] POST request but no profileData found")
            except Exception as e:
                print(f"[ERROR] Error parsing POST data: {e}")
        
        # Get AI analysis
        if profile_data:
            print(f"[ANALYSIS] Using provided profile data")
            analysis = ai.analyze_currency_pair_with_data(pair_code, profile_data)
            summary = ai.summarize_currency_profile_data_with_data(pair_code, profile_data)
        else:
            print(f"[ANALYSIS] Using fallback analysis")
            analysis = ai.analyze_currency_pair(pair_code)
            summary = ai.summarize_currency_profile_data(pair_code)
        
        # Format response for frontend
        response = {
            'success': True,
            'data': {
                'pair': analysis['pair'],
                'recommendation': analysis['recommendation'],
                'confidence': analysis['confidence'],
                'base_currency': analysis['base_currency'],
                'quote_currency': analysis['quote_currency'],
                'strength_difference': analysis.get('strength_difference', 0),
                'total_score': analysis['total_score'],
                'weighted_score': analysis.get('weighted_score', analysis['total_score']),
                'conviction': analysis.get('conviction', 5.0),
                'individual_scores': analysis['individual_scores'],
                'insights': analysis['insights'],
                'analysis_date': analysis['analysis_date'],
                'reminders': analysis['reminders'],
                'summary': summary,
                'detailed_analysis': analysis.get('detailed_analysis', {})
            }
        }
        
        print(f"[SUCCESS] AI Insight successful for: {pair_code}")
        return jsonify(response)
        
    except Exception as e:
        print(f"[ERROR] AI Insight error for {pair_code}: {e}")
        print(f"[TRACEBACK] {traceback.format_exc()}")
        
        # Return error response
        return jsonify({
            'success': False, 
            'error': f"Analysis failed: {str(e)}",
            'data': {
                'pair': pair_code,
                'recommendation': 'HOLD/MONITOR',
                'confidence': 'Error',
                'total_score': 0,
                'insights': ['Analysis encountered an error'],
                'reminders': ['Try refreshing or check data']
            }
        }), 500

@app.route('/api/currency-strength/<asset_code>', methods=['GET'])
def get_currency_strength(asset_code):
    """API endpoint to get individual currency strength"""
    try:
        response = {
            'success': True,
            'data': {
                'asset_code': asset_code.upper(),
                'score': 0,
                'bias': 'Neutral',
                'individual_scores': {}
            }
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': '8ConEdge Robust AI API'})

if __name__ == '__main__':
    print("Starting 8ConEdge Robust AI API Server...")
    print("Available endpoints:")
    print("- GET/POST /api/ai-insight/<pair_code>")
    print("- GET /api/currency-strength/<asset_code>")
    print("- GET /health")
    app.run(debug=True, host='0.0.0.0', port=5000)