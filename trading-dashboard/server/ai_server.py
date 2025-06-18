from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for Vite development server

class CurrencyProfileAI:
    def __init__(self, host='localhost', user='root', password='', database='8con'):
        """Initialize the AI with database connection"""
        self.connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.connection.cursor(dictionary=True)
        
    def get_latest_economic_data(self, asset_code):
        """Get the latest economic data for a specific asset"""
        data = {}
        
        # Get COT Data
        query = "SELECT * FROM cot_data WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        cot_data = self.cursor.fetchone()
        
        # Get Interest Rate
        query = "SELECT * FROM interest_rate WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        interest_data = self.cursor.fetchone()
        
        # Get Core Inflation
        query = "SELECT * FROM core_inflation WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        inflation_data = self.cursor.fetchone()
        
        # Get GDP Growth
        query = "SELECT * FROM gdp_growth WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        gdp_data = self.cursor.fetchone()
        
        # Get Employment Change
        query = "SELECT * FROM employment_change WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        employment_data = self.cursor.fetchone()
        
        # Get Unemployment Rate
        query = "SELECT * FROM unemployment_rate WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        unemployment_data = self.cursor.fetchone()
        
        # Get Manufacturing PMI
        query = "SELECT * FROM mpmi WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        mpmi_data = self.cursor.fetchone()
        
        # Get Services PMI
        query = "SELECT * FROM spmi WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        spmi_data = self.cursor.fetchone()
        
        # Get Retail Sales
        query = "SELECT * FROM retail_sales WHERE asset_code = %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (asset_code,))
        retail_data = self.cursor.fetchone()
        
        # Get Retail Sentiment
        query = "SELECT * FROM retail_sentiment WHERE asset_pair_code LIKE %s ORDER BY created_at DESC LIMIT 1"
        self.cursor.execute(query, (f"%{asset_code}%",))
        retail_sentiment = self.cursor.fetchone()
        
        return {
            'cot': cot_data,
            'interest_rate': interest_data,
            'inflation': inflation_data,
            'gdp': gdp_data,
            'employment': employment_data,
            'unemployment': unemployment_data,
            'mpmi': mpmi_data,
            'spmi': spmi_data,
            'retail': retail_data,
            'retail_sentiment': retail_sentiment
        }
    
    def calculate_individual_scores(self, base_data, quote_data):
        """Calculate individual metric scores using the exact algorithm from React components"""
        scores = {}
        
        # COT Scoring (-2 to +2 total, -1 to +1 each for base and quote)
        cot_base_score = 0
        cot_quote_score = 0
        
        if base_data['cot'] and base_data['cot'].get('net_change_percent') is not None:
            if base_data['cot']['net_change_percent'] > 0:
                cot_base_score = 1
            elif base_data['cot']['net_change_percent'] < 0:
                cot_base_score = -1
                
        if quote_data['cot'] and quote_data['cot'].get('net_change_percent') is not None:
            if quote_data['cot']['net_change_percent'] > 0:
                cot_quote_score = -1  # Opposite for quote
            elif quote_data['cot']['net_change_percent'] < 0:
                cot_quote_score = 1   # Opposite for quote
                
        scores['cot'] = max(-2, min(2, cot_base_score + cot_quote_score))
        
        # Retail Position Score (-1 to +1) - Contrarian approach
        retail_score = 0
        if base_data.get('retail_sentiment'):
            long_pct = base_data['retail_sentiment'].get('retail_long', 0)
            short_pct = base_data['retail_sentiment'].get('retail_short', 0)
            retail_score = -1 if long_pct > short_pct else 1
        scores['retail_position'] = retail_score
        
        # Employment Change Score (-2 to +2)
        emp_base_score = 0
        emp_quote_score = 0
        
        if base_data['employment']:
            actual = base_data['employment'].get('employment_change', 0)
            forecast = base_data['employment'].get('forecast', 0)
            if actual > forecast:
                emp_base_score = 1
            elif actual < forecast:
                emp_base_score = -1
                
        if quote_data['employment']:
            actual = quote_data['employment'].get('employment_change', 0)
            forecast = quote_data['employment'].get('forecast', 0)
            if actual > forecast:
                emp_quote_score = -1  # Opposite for quote
            elif actual < forecast:
                emp_quote_score = 1   # Opposite for quote
                
        scores['employment'] = max(-2, min(2, emp_base_score + emp_quote_score))
        
        # Unemployment Score (-2 to +2)
        unemp_base_score = 0
        unemp_quote_score = 0
        
        if base_data['unemployment']:
            actual = base_data['unemployment'].get('unemployment_rate', 0)
            forecast = base_data['unemployment'].get('forecast', 0)
            if actual > forecast:
                unemp_base_score = -1  # Higher unemployment is bad
            elif actual < forecast:
                unemp_base_score = 1   # Lower unemployment is good
                
        if quote_data['unemployment']:
            actual = quote_data['unemployment'].get('unemployment_rate', 0)
            forecast = quote_data['unemployment'].get('forecast', 0)
            if actual > forecast:
                unemp_quote_score = 1   # Opposite for quote
            elif actual < forecast:
                unemp_quote_score = -1  # Opposite for quote
                
        scores['unemployment'] = max(-2, min(2, unemp_base_score + unemp_quote_score))
        
        # Economic Growth Scores - Helper function
        def calculate_growth_score(base_result, quote_result):
            base_score = 0
            quote_score = 0
            
            if base_result:
                if base_result.lower() in ['beat']:
                    base_score = 1
                elif base_result.lower() in ['miss', 'missed']:
                    base_score = -1
                    
            if quote_result:
                if quote_result.lower() in ['beat']:
                    quote_score = -1  # Opposite for quote
                elif quote_result.lower() in ['miss', 'missed']:
                    quote_score = 1   # Opposite for quote
                    
            return max(-2, min(2, base_score + quote_score))
        
        # GDP Score
        gdp_base_result = base_data['gdp']['result'] if base_data['gdp'] else None
        gdp_quote_result = quote_data['gdp']['result'] if quote_data['gdp'] else None
        scores['gdp'] = calculate_growth_score(gdp_base_result, gdp_quote_result)
        
        # Manufacturing PMI Score
        mpmi_base_result = base_data['mpmi']['result'] if base_data['mpmi'] else None
        mpmi_quote_result = quote_data['mpmi']['result'] if quote_data['mpmi'] else None
        scores['mpmi'] = calculate_growth_score(mpmi_base_result, mpmi_quote_result)
        
        # Services PMI Score
        spmi_base_result = base_data['spmi']['result'] if base_data['spmi'] else None
        spmi_quote_result = quote_data['spmi']['result'] if quote_data['spmi'] else None
        scores['spmi'] = calculate_growth_score(spmi_base_result, spmi_quote_result)
        
        # Retail Sales Score
        retail_base_result = base_data['retail']['result'] if base_data['retail'] else None
        retail_quote_result = quote_data['retail']['result'] if quote_data['retail'] else None
        scores['retail_sales'] = calculate_growth_score(retail_base_result, retail_quote_result)
        
        # Inflation Score (-2 to +2)
        infl_base_score = 0
        infl_quote_score = 0
        
        if base_data['inflation']:
            actual = base_data['inflation'].get('core_inflation', 0)
            forecast = base_data['inflation'].get('forecast', 0)
            if actual > forecast:
                infl_base_score = 1  # Higher inflation can be positive for currency
            elif actual < forecast:
                infl_base_score = -1
                
        if quote_data['inflation']:
            actual = quote_data['inflation'].get('core_inflation', 0)
            forecast = quote_data['inflation'].get('forecast', 0)
            if actual > forecast:
                infl_quote_score = -1  # Opposite for quote
            elif actual < forecast:
                infl_quote_score = 1   # Opposite for quote
                
        scores['inflation'] = max(-2, min(2, infl_base_score + infl_quote_score))
        
        # Interest Rate Score (-2 to +2)
        int_base_score = 0
        int_quote_score = 0
        
        if base_data['interest_rate']:
            change = base_data['interest_rate'].get('change_in_interest', 0)
            if change > 0:
                int_base_score = 1
            elif change < 0:
                int_base_score = -1
                
        if quote_data['interest_rate']:
            change = quote_data['interest_rate'].get('change_in_interest', 0)
            if change > 0:
                int_quote_score = -1  # Opposite for quote
            elif change < 0:
                int_quote_score = 1   # Opposite for quote
                
        scores['interest_rate'] = max(-2, min(2, int_base_score + int_quote_score))
        
        return scores

    def calculate_currency_strength_score(self, asset_code):
        """Calculate comprehensive strength score matching React algorithm"""
        data = self.get_latest_economic_data(asset_code)
        
        # For individual currency analysis, compare against neutral baseline
        baseline_data = {key: None for key in data.keys()}
        
        scores = self.calculate_individual_scores(data, baseline_data)
        total_score = sum(scores.values())
        
        return {
            'score': total_score,
            'asset_code': asset_code,
            'individual_scores': scores,
            'data_points': data
        }
    
    def get_currency_bias(self, total_score):
        """Determine currency bias based on total score using React ranges"""
        if total_score >= 12:
            return "Very Bullish"
        elif total_score >= 5:
            return "Bullish"
        elif total_score >= -4:
            return "Neutral"
        elif total_score >= -11:
            return "Bearish"
        else:
            return "Very Bearish"
    
    def analyze_currency_pair(self, base_asset, quote_asset):
        """Enhanced currency pair analysis with improved recommendations"""
        base_data = self.get_latest_economic_data(base_asset)
        quote_data = self.get_latest_economic_data(quote_asset)
        
        # Calculate scores using the exact React algorithm
        individual_scores = self.calculate_individual_scores(base_data, quote_data)
        total_score = sum(individual_scores.values())
        
        # Calculate individual currency strengths for comparison
        base_strength = self.calculate_currency_strength_score(base_asset)
        quote_strength = self.calculate_currency_strength_score(quote_asset)
        
        # Enhanced recommendation logic
        recommendation, confidence, position_size = self.get_enhanced_recommendation(total_score, individual_scores)
        
        # Generate market insights
        insights = self.generate_enhanced_market_insights(base_asset, quote_asset, base_data, quote_data, individual_scores)
        
        # Generate trading reminders
        reminders = self.generate_trading_reminders(total_score, individual_scores)
        
        return {
            'pair': f"{base_asset}{quote_asset}",
            'base_currency': {
                'code': base_asset,
                'score': base_strength['score'],
                'bias': self.get_currency_bias(base_strength['score'])
            },
            'quote_currency': {
                'code': quote_asset,
                'score': quote_strength['score'],
                'bias': self.get_currency_bias(quote_strength['score'])
            },
            'total_score': total_score,
            'individual_scores': individual_scores,
            'strength_difference': base_strength['score'] - quote_strength['score'],
            'recommendation': recommendation,
            'confidence': confidence,
            'position_size': position_size,
            'insights': insights,
            'reminders': reminders,
            'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def get_enhanced_recommendation(self, total_score, individual_scores):
        """Generate enhanced trading recommendations with position sizing"""
        # Count strong signals
        strong_bullish_signals = sum(1 for score in individual_scores.values() if score >= 2)
        strong_bearish_signals = sum(1 for score in individual_scores.values() if score <= -2)
        moderate_signals = sum(1 for score in individual_scores.values() if abs(score) == 1)
        
        # Base recommendation on total score
        if total_score >= 12:
            action = "STRONG BUY"
            confidence = "High"
            position_size = "2-3% risk per trade"
        elif total_score >= 8:
            action = "BUY"
            confidence = "High"
            position_size = "1.5-2% risk per trade"
        elif total_score >= 5:
            action = "BUY"
            confidence = "Medium"
            position_size = "1-1.5% risk per trade"
        elif total_score >= -4:
            action = "HOLD/MONITOR"
            confidence = "Low"
            position_size = "0.5-1% risk per trade (if trading)"
        elif total_score >= -8:
            action = "SELL"
            confidence = "Medium"
            position_size = "1-1.5% risk per trade"
        elif total_score >= -11:
            action = "SELL"
            confidence = "High"
            position_size = "1.5-2% risk per trade"
        else:
            action = "STRONG SELL"
            confidence = "High"
            position_size = "2-3% risk per trade"
        
        # Adjust confidence based on signal consistency
        if strong_bullish_signals >= 3 or strong_bearish_signals >= 3:
            confidence = "Very High"
        elif strong_bullish_signals + strong_bearish_signals >= 4:
            confidence = "High"
        elif moderate_signals >= 5:
            confidence = "Medium" if confidence == "High" else confidence
        
        return action, confidence, position_size

    def generate_enhanced_market_insights(self, base_asset, quote_asset, base_data, quote_data, scores):
        """Generate comprehensive market insights"""
        insights = []
        
        # Interest Rate Analysis
        if base_data['interest_rate'] and quote_data['interest_rate']:
            base_change = base_data['interest_rate'].get('change_in_interest', 0)
            quote_change = quote_data['interest_rate'].get('change_in_interest', 0)
            
            if abs(base_change - quote_change) > 0.25:  # Significant difference
                if base_change > quote_change:
                    insights.append(f"Interest rate differentials strongly favor {base_asset} (+{base_change:.2f}% vs {quote_change:+.2f}%)")
                else:
                    insights.append(f"Interest rate differentials favor {quote_asset} ({base_change:+.2f}% vs +{quote_change:.2f}%)")
        
        # Economic Growth Momentum
        growth_scores = [scores['gdp'], scores['mpmi'], scores['spmi'], scores['retail_sales']]
        avg_growth = sum(growth_scores) / len(growth_scores) if growth_scores else 0
        
        if avg_growth >= 1:
            insights.append(f"{base_asset} shows strong economic growth momentum across multiple indicators")
        elif avg_growth <= -1:
            insights.append(f"{quote_asset} demonstrates superior economic growth compared to {base_asset}")
        
        # Employment Market Analysis
        if scores['employment'] >= 1 and scores['unemployment'] >= 1:
            insights.append(f"{base_asset} labor market significantly outperforming expectations")
        elif scores['employment'] <= -1 and scores['unemployment'] <= -1:
            insights.append(f"{quote_asset} showing stronger employment fundamentals")
        
        # Institutional vs Retail Sentiment
        if scores['cot'] >= 1 and scores['retail_position'] >= 1:
            insights.append(f"Both institutional (COT) and retail sentiment align bullishly for {base_asset}")
        elif scores['cot'] >= 1 and scores['retail_position'] <= -1:
            insights.append(f"Institutional money favors {base_asset} while retail traders are positioned oppositely (contrarian signal)")
        
        # Risk Assessment
        negative_scores = sum(1 for score in scores.values() if score < 0)
        positive_scores = sum(1 for score in scores.values() if score > 0)
        
        if negative_scores > positive_scores * 2:
            insights.append("⚠️ Multiple conflicting signals detected - consider waiting for clearer directional bias")
        elif positive_scores > negative_scores * 2:
            insights.append("✅ Strong consensus across multiple fundamental indicators supporting the bias")
        
        return insights if insights else ["Market fundamentals show mixed signals - monitor for clearer directional bias"]

    def generate_trading_reminders(self, total_score, individual_scores):
        """Generate specific trading reminders based on analysis"""
        reminders = []
        
        # Risk management based on score strength
        if abs(total_score) >= 12:
            reminders.append("High conviction setup - ensure proper position sizing (max 2-3% risk)")
            reminders.append("Set tight stop losses due to strong directional bias")
        elif abs(total_score) <= 4:
            reminders.append("Low conviction environment - reduce position sizes significantly")
            reminders.append("Consider wider stops or avoid trading until clearer signals emerge")
        
        # Always include standard reminders
        reminders.extend([
            "Verify key technical levels before entry",
            "Check economic calendar for high-impact news",
            "This is fundamental analysis only - combine with technical analysis",
            "Never risk more than 1-2% of account per trade"
        ])
        
        return reminders[:6]  # Limit to 6 most relevant reminders

    def summarize_currency_profile_data(self, base_asset, quote_asset):
        """Comprehensive summary of CurrencyProfile data for traders"""
        analysis = self.analyze_currency_pair(base_asset, quote_asset)
        
        summary = {
            'executive_summary': f"**{analysis['pair']} Analysis Summary**\n\n"
                               f"• **Overall Bias**: {self.get_currency_bias(analysis['total_score'])} (Score: {analysis['total_score']})\n"
                               f"• **Recommendation**: {analysis['recommendation']}\n"
                               f"• **Confidence Level**: {analysis['confidence']}\n"
                               f"• **Suggested Position Size**: {analysis['position_size']}\n",
            'key_drivers': self._identify_key_drivers(analysis['individual_scores']),
            'risk_factors': self._identify_risk_factors(analysis['individual_scores']),
            'trading_plan': f"Entry: {analysis['recommendation']} | Risk: {analysis['position_size']} | Confidence: {analysis['confidence']}",
            'market_insights': analysis['insights'],
            'trading_reminders': analysis['reminders']
        }
        
        return summary

    def _identify_key_drivers(self, scores):
        """Identify strongest fundamental drivers"""
        drivers = []
        
        metric_names = {
            'cot': 'Institutional Positioning (COT)',
            'retail_position': 'Retail Sentiment',
            'employment': 'Employment Data',
            'unemployment': 'Unemployment Rates',
            'gdp': 'GDP Growth',
            'mpmi': 'Manufacturing PMI',
            'spmi': 'Services PMI',
            'retail_sales': 'Retail Sales',
            'inflation': 'Inflation Trends',
            'interest_rate': 'Interest Rate Policy'
        }
        
        for metric, score in scores.items():
            if abs(score) >= 2:
                direction = "Strong bullish" if score > 0 else "Strong bearish"
                drivers.append(f"🎯 **{metric_names[metric]}**: {direction} signal")
            elif abs(score) >= 1:
                direction = "Moderate bullish" if score > 0 else "Moderate bearish"
                drivers.append(f"📊 **{metric_names[metric]}**: {direction} signal")
        
        return drivers if drivers else ["No significant fundamental drivers identified"]

    def _identify_risk_factors(self, scores):
        """Identify potential risk factors"""
        risks = []
        
        # Check for conflicting signals
        positive_count = sum(1 for score in scores.values() if score > 0)
        negative_count = sum(1 for score in scores.values() if score < 0)
        
        if positive_count > 0 and negative_count > 0:
            if abs(positive_count - negative_count) <= 2:
                risks.append("⚠️ Mixed signals across fundamental indicators")
        
        # Check for weak signals
        weak_signals = sum(1 for score in scores.values() if abs(score) <= 1)
        if weak_signals >= 6:
            risks.append("⚠️ Most signals are weak - low conviction environment")
        
        # Check for retail vs institutional divergence
        if 'cot' in scores and 'retail_position' in scores:
            if scores['cot'] * scores['retail_position'] < 0:
                risks.append("⚠️ Institutional and retail sentiment diverge")
        
        return risks if risks else ["No significant risk factors identified"]

    def close_connection(self):
        """Close database connection"""
        if self.connection.is_connected():
            self.cursor.close()
            self.connection.close()

# Initialize AI instance
ai = CurrencyProfileAI()

# Ensure connection cleanup on app shutdown
import atexit
atexit.register(lambda: ai.close_connection())

@app.route('/api/ai-insight/<pair_code>', methods=['GET'])
def get_ai_insight(pair_code):
    """API endpoint to get AI insights for a currency pair"""
    try:
        # Extract base and quote assets from pair code (e.g., EURUSD -> EUR, USD)
        if len(pair_code) == 6:
            base_asset = pair_code[:3]
            quote_asset = pair_code[3:]
        else:
            return jsonify({'error': 'Invalid pair code format'}), 400
        
        # Get AI analysis
        analysis = ai.analyze_currency_pair(base_asset, quote_asset)
        summary = ai.summarize_currency_profile_data(base_asset, quote_asset)
        
        # Format response for frontend
        response = {
            'success': True,
            'data': {
                'pair': analysis['pair'],
                'recommendation': analysis['recommendation'],
                'confidence': analysis['confidence'],
                'base_currency': analysis['base_currency'],
                'quote_currency': analysis['quote_currency'],
                'strength_difference': analysis['strength_difference'],
                'total_score': analysis['total_score'],
                'individual_scores': analysis['individual_scores'],
                'insights': analysis['insights'],
                'analysis_date': analysis['analysis_date'],
                'reminders': analysis['reminders'],
                'summary': summary
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500
    
@app.route('/api/currency-strength/<asset_code>', methods=['GET'])
def get_currency_strength(asset_code):
    """API endpoint to get individual currency strength"""
    try:
        strength = ai.calculate_currency_strength_score(asset_code.upper())
        
        response = {
            'success': True,
            'data': {
                'asset_code': strength['asset_code'],
                'score': strength['score'],
                'bias': ai.get_currency_bias(strength['score']),
                'individual_scores': strength['individual_scores']
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500
    
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': '8ConEdge AI API'})

if __name__ == '__main__':
    print("Starting 8ConEdge AI API Server...")
    print("Available endpoints:")
    print("- GET /api/ai-insight/<pair_code> (e.g., /api/ai-insight/EURUSD)")
    print("- GET /api/currency-strength/<asset_code> (e.g., /api/currency-strength/EUR)")
    print("- GET /health")
    app.run(debug=True, host='0.0.0.0', port=5000)