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
        
        return {
            'cot': cot_data,
            'interest_rate': interest_data,
            'inflation': inflation_data,
            'gdp': gdp_data,
            'employment': employment_data,
            'unemployment': unemployment_data,
            'mpmi': mpmi_data,
            'spmi': spmi_data,
            'retail': retail_data
        }
    
    def calculate_currency_strength_score(self, asset_code):
        """Calculate a comprehensive strength score for a currency"""
        data = self.get_latest_economic_data(asset_code)
        score = 0
        max_score = 0
        
        # COT Data Score (20% weight)
        if data['cot']:
            cot_score = (data['cot']['long_percent'] - 50) / 50 * 100
            score += cot_score * 0.2
        max_score += 20
        
        # Interest Rate Score (25% weight)
        if data['interest_rate']:
            rate_score = min(data['interest_rate']['interest_rate'] * 10, 100)
            if data['interest_rate']['change_in_interest'] > 0:
                rate_score += 20
            score += rate_score * 0.25
        max_score += 25
        
        # GDP Growth Score (20% weight)
        if data['gdp']:
            gdp_score = data['gdp']['gdp_growth'] * 25
            if data['gdp']['result'] == 'Beat':
                gdp_score += 20
            elif data['gdp']['result'] == 'Miss':
                gdp_score -= 20
            score += gdp_score * 0.2
        max_score += 20
        
        # Employment Score (15% weight)
        if data['employment']:
            emp_score = 50
            if data['employment']['result'] == 'Beat':
                emp_score += 30
            elif data['employment']['result'] == 'Missed':
                emp_score -= 30
            score += emp_score * 0.15
        max_score += 15
        
        # Unemployment Score (10% weight)
        if data['unemployment']:
            unemp_score = max(0, 100 - data['unemployment']['unemployment_rate'] * 20)
            if data['unemployment']['result'] == 'Beat':
                unemp_score += 20
            score += unemp_score * 0.1
        max_score += 10
        
        # PMI Score (10% weight)
        if data['mpmi'] and data['spmi']:
            pmi_avg = (data['mpmi']['service_pmi'] + data['spmi']['service_pmi']) / 2
            pmi_score = (pmi_avg - 50) * 2
            score += pmi_score * 0.1
        max_score += 10
        
        # Normalize score to 0-100 scale
        normalized_score = max(0, min(100, (score / max_score * 100) if max_score > 0 else 0))
        
        return {
            'score': round(normalized_score, 2),
            'raw_score': round(score, 2),
            'asset_code': asset_code,
            'data_points': data
        }
    
    def get_currency_bias(self, score):
        """Determine currency bias based on score"""
        if score >= 80:
            return "Very Bullish"
        elif score >= 60:
            return "Bullish"
        elif score >= 40:
            return "Neutral"
        elif score >= 20:
            return "Bearish"
        else:
            return "Very Bearish"
    
    def analyze_currency_pair(self, base_asset, quote_asset):
        """Analyze a currency pair and provide trading recommendation"""
        base_analysis = self.calculate_currency_strength_score(base_asset)
        quote_analysis = self.calculate_currency_strength_score(quote_asset)
        
        strength_difference = base_analysis['score'] - quote_analysis['score']
        
        if strength_difference > 20:
            recommendation = f"STRONG BUY {base_asset}{quote_asset}"
            confidence = "High"
        elif strength_difference > 10:
            recommendation = f"BUY {base_asset}{quote_asset}"
            confidence = "Medium"
        elif strength_difference > -10:
            recommendation = f"HOLD {base_asset}{quote_asset}"
            confidence = "Low"
        elif strength_difference > -20:
            recommendation = f"SELL {base_asset}{quote_asset}"
            confidence = "Medium"
        else:
            recommendation = f"STRONG SELL {base_asset}{quote_asset}"
            confidence = "High"
        
        return {
            'pair': f"{base_asset}{quote_asset}",
            'base_currency': {
                'code': base_asset,
                'score': base_analysis['score'],
                'bias': self.get_currency_bias(base_analysis['score'])
            },
            'quote_currency': {
                'code': quote_asset,
                'score': quote_analysis['score'],
                'bias': self.get_currency_bias(quote_analysis['score'])
            },
            'strength_difference': round(strength_difference, 2),
            'recommendation': recommendation,
            'confidence': confidence,
            'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def generate_market_insight(self, base_asset, quote_asset):
        """Generate AI-powered market insights"""
        base_data = self.get_latest_economic_data(base_asset)
        quote_data = self.get_latest_economic_data(quote_asset)
        
        insights = []
        
        # Interest Rate Analysis
        if base_data['interest_rate'] and quote_data['interest_rate']:
            base_rate = base_data['interest_rate']['interest_rate']
            quote_rate = quote_data['interest_rate']['interest_rate']
            rate_diff = base_rate - quote_rate
            
            if abs(rate_diff) > 1:
                direction = "favor" if rate_diff > 0 else "weaken"
                insights.append(f"Interest rate differential of {rate_diff:.2f}% should {direction} {base_asset}")
        
        # Economic Growth Analysis
        if base_data['gdp'] and quote_data['gdp']:
            base_gdp = base_data['gdp']['gdp_growth']
            quote_gdp = quote_data['gdp']['gdp_growth']
            
            if base_gdp > quote_gdp:
                insights.append(f"{base_asset} shows stronger economic growth ({base_gdp}% vs {quote_gdp}%)")
        
        # Employment Strength
        if base_data['employment'] and quote_data['employment']:
            base_emp_result = base_data['employment']['result']
            quote_emp_result = quote_data['employment']['result']
            
            if base_emp_result == 'Beat' and quote_emp_result != 'Beat':
                insights.append(f"{base_asset} employment data outperforming expectations")
        
        # COT Sentiment
        if base_data['cot'] and quote_data['cot']:
            base_long_pct = base_data['cot']['long_percent']
            quote_long_pct = quote_data['cot']['long_percent']
            
            if base_long_pct > 60:
                insights.append(f"Institutional sentiment heavily favors {base_asset} ({base_long_pct}% long positions)")
            elif quote_long_pct > 60:
                insights.append(f"Institutional sentiment heavily favors {quote_asset} ({quote_long_pct}% long positions)")
        
        return insights if insights else ["Market conditions appear balanced with no clear directional bias"]

# Initialize AI instance
ai = CurrencyProfileAI()

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
        insights = ai.generate_market_insight(base_asset, quote_asset)
        
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
                'insights': insights,
                'analysis_date': analysis['analysis_date'],
                'reminders': [
                    "📊 Check upcoming economic calendar events",
                    "📈 Identify key support and resistance levels", 
                    "⚠️ Remember proper risk management (1-2% per trade)",
                    "🔍 Cross-reference with technical analysis",
                    "📰 Monitor geopolitical developments"
                ]
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
                'raw_score': strength['raw_score']
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