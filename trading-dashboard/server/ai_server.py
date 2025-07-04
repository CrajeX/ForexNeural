
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
            
            # Process each indicator safely with enhanced employment/unemployment handling
            for indicator in breakdown:
                try:
                    indicator_name = self.safe_get(indicator, 'name', '')
                    indicator_score = self.safe_numeric(self.safe_get(indicator, 'score', 0))
                    base_data = self.safe_get(indicator, 'baseData', {})
                    quote_data = self.safe_get(indicator, 'quoteData', {})
                    
                    print(f"[INDICATOR] Processing: {indicator_name} (Score: {indicator_score})")
                    
                    # Enhanced data extraction for employment and unemployment
                    processed_data = {
                        'score': indicator_score,
                        'base_data': base_data,
                        'quote_data': quote_data
                    }
                    
                    # Special handling for Employment Change
                    if 'Employment Change' in indicator_name:
                        processed_data['employment_analysis'] = {
                            'base_change': self.safe_numeric(base_data.get('Employment Change', 0)),
                            'base_forecast': self.safe_numeric(base_data.get('Forecast', 0)),
                            'base_result': base_data.get('Result', 'N/A'),
                            'quote_change': self.safe_numeric(quote_data.get('Employment Change', 0)),
                            'quote_forecast': self.safe_numeric(quote_data.get('Forecast', 0)),
                            'quote_result': quote_data.get('Result', 'N/A'),
                        }
                        print(f"[EMPLOYMENT] Base: {processed_data['employment_analysis']['base_change']}, Quote: {processed_data['employment_analysis']['quote_change']}")
                    
                    # Special handling for Unemployment Rate
                    elif 'Unemployment Rate' in indicator_name:
                        processed_data['unemployment_analysis'] = {
                            'base_rate': self.safe_numeric(base_data.get('Unemployment Rate', 0)),
                            'base_forecast': self.safe_numeric(base_data.get('Forecast', 0)),
                            'base_result': base_data.get('Result', 'N/A'),
                            'quote_rate': self.safe_numeric(quote_data.get('Unemployment Rate', 0)),
                            'quote_forecast': self.safe_numeric(quote_data.get('Forecast', 0)),
                            'quote_result': quote_data.get('Result', 'N/A'),
                        }
                        print(f"[UNEMPLOYMENT] Base: {processed_data['unemployment_analysis']['base_rate']}%, Quote: {processed_data['unemployment_analysis']['quote_rate']}%")
                    
                    # Store indicator data
                    extracted_data['indicators'][indicator_name] = processed_data
                    
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
    def debug_score_extraction(self, profile_data):
        """Debug function to trace score extraction"""
        try:
            print(f"[DEBUG] === SCORE EXTRACTION DEBUG ===")
            
            breakdown = profile_data.get('breakdown', [])
            print(f"[DEBUG] Total indicators in breakdown: {len(breakdown)}")
            
            for i, indicator in enumerate(breakdown):
                name = indicator.get('name', 'Unknown')
                score = indicator.get('score', 0)
                weight_key = self.map_indicator_to_weight_key(name)
                
                print(f"[DEBUG] Indicator {i+1}: {name}")
                print(f"[DEBUG]   - Score: {score}")
                print(f"[DEBUG]   - Maps to: {weight_key}")
                
                if 'Employment' in name:
                    base_data = indicator.get('baseData', {})
                    quote_data = indicator.get('quoteData', {})
                    print(f"[DEBUG]   - Base Employment Change: {base_data.get('Employment Change', 'N/A')}")
                    print(f"[DEBUG]   - Quote Employment Change: {quote_data.get('Employment Change', 'N/A')}")
                    print(f"[DEBUG]   - Base Result: {base_data.get('Result', 'N/A')}")
                    print(f"[DEBUG]   - Quote Result: {quote_data.get('Result', 'N/A')}")
            
            print(f"[DEBUG] === END DEBUG ===")
            
        except Exception as e:
            print(f"[DEBUG] Error in debug function: {e}")
    def calculate_enhanced_analysis(self, extracted_data):
        """Calculate enhanced analysis metrics with proper unemployment score extraction"""
        try:
            indicators = extracted_data.get('indicators', {})
            
            # Initialize score aggregation
            score_aggregation = {}
            individual_scores = {}
            total_weight = 0
            weighted_sum = 0
            
            print(f"[ANALYSIS] Processing {len(indicators)} indicators for score calculation")
            
            for indicator_name, indicator_data in indicators.items():
                score = indicator_data.get('score', 0)
                
                # Map indicator names to weight keys
                weight_key = self.map_indicator_to_weight_key(indicator_name)
                weight = self.indicator_weights.get(weight_key, 1.0)
                
                print(f"[SCORES] {indicator_name} -> {weight_key}: Score={score}")
                
                # IMPORTANT: Don't aggregate employment and unemployment - keep separate
                if weight_key in ['employment', 'unemployment']:
                    # Keep employment and unemployment separate
                    individual_scores[weight_key] = score
                    weighted_sum += score * weight
                    total_weight += weight
                    print(f"[SCORES] Separate {weight_key}: {score}")
                else:
                    # Aggregate other indicators that might have multiple entries
                    if weight_key in score_aggregation:
                        score_aggregation[weight_key] += score
                        print(f"[SCORES] Aggregating {weight_key}: {score_aggregation[weight_key] - score} + {score} = {score_aggregation[weight_key]}")
                    else:
                        score_aggregation[weight_key] = score
                        print(f"[SCORES] Initial {weight_key}: {score}")
                    
                    # Calculate weighted sum
                    weighted_sum += score * weight
                    total_weight += weight
            
            # Add aggregated scores to individual scores
            individual_scores.update(score_aggregation)
            
            print(f"[ANALYSIS] Final individual scores: {individual_scores}")
            print(f"[ANALYSIS] Employment score: {individual_scores.get('employment', 'NOT FOUND')}")
            print(f"[ANALYSIS] Unemployment score: {individual_scores.get('unemployment', 'NOT FOUND')}")
            
            final_weighted_score = weighted_sum / total_weight if total_weight > 0 else 0
            
            # Calculate conviction (0-10 scale)
            conviction = self.calculate_conviction(individual_scores, extracted_data['total_score'])
            
            # Generate insights with unemployment
            insights = self.generate_insights(indicators, extracted_data)
            
            # Generate detailed analysis
            detailed_analysis = {
                'consistency': self.analyze_consistency(individual_scores),
                'risk_level': self.assess_risk_level(individual_scores, conviction),
                'momentum_factors': self.identify_momentum_factors(indicators)
            }
            
            return {
                'weighted_score': final_weighted_score,
                'conviction': conviction,
                'individual_scores': individual_scores,
                'insights': insights,
                'detailed_analysis': detailed_analysis
            }
            
        except Exception as e:
            print(f"[ERROR] Error in enhanced analysis: {e}")
            print(f"[TRACEBACK] {traceback.format_exc()}")
            return {
                'weighted_score': extracted_data.get('total_score', 0),
                'conviction': 5.0,
                'individual_scores': {},
                'insights': ['Analysis completed with basic scoring'],
                'detailed_analysis': {}
            }

    def map_indicator_to_weight_key(self, indicator_name):
        """Map indicator names to weight keys with enhanced unemployment detection"""
        indicator_name = indicator_name.lower()
        
        if 'interest' in indicator_name:
            return 'interest_rate'
        elif 'inflation' in indicator_name or 'core inflation' in indicator_name:
            return 'inflation'
        elif 'employment change' in indicator_name and 'unemployment' not in indicator_name:
            return 'employment'
        elif 'unemployment rate' in indicator_name or ('unemployment' in indicator_name and 'employment change' not in indicator_name):
            return 'unemployment'  # CRITICAL: Separate unemployment from employment
        elif 'gdp' in indicator_name:
            return 'gdp'
        elif 'cot' in indicator_name or 'commitment' in indicator_name:
            return 'cot'
        elif 'manufacturing' in indicator_name or 'mpmi' in indicator_name:
            return 'mpmi'
        elif 'services' in indicator_name or 'spmi' in indicator_name:
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
        """Generate market insights with enhanced unemployment analysis"""
        insights = []
        
        try:
            # Count strong signals and generate insights
            strong_bullish = 0
            strong_bearish = 0
            employment_insights = []
            
            print(f"[INSIGHTS] Processing {len(indicators)} indicators")
            
            for indicator_name, indicator_data in indicators.items():
                score = indicator_data.get('score', 0)
                base_data = indicator_data.get('base_data', {})
                quote_data = indicator_data.get('quote_data', {})
                
                print(f"[INSIGHTS] {indicator_name}: Score={score}")
                
                # Enhanced employment analysis
                if 'Employment Change' in indicator_name:
                    base_change = self.safe_numeric(base_data.get('Employment Change', 0))
                    quote_change = self.safe_numeric(quote_data.get('Employment Change', 0))
                    base_result = base_data.get('Result', 'N/A')
                    quote_result = quote_data.get('Result', 'N/A')
                    
                    if base_change != 0 or quote_change != 0:
                        employment_insights.append(f"EMPLOYMENT: Base {base_change:+.0f}K vs Quote {quote_change:+.0f}K jobs")
                    
                    if score >= 1:
                        strong_bullish += 1
                        insights.append(f"EMPLOYMENT STRENGTH: Base currency job market outperforming (Score: {score})")
                    elif score <= -1:
                        strong_bearish += 1
                        insights.append(f"EMPLOYMENT WEAKNESS: Base currency employment disappointing (Score: {score})")
                
                # ENHANCED UNEMPLOYMENT ANALYSIS - SEPARATE FROM EMPLOYMENT
                elif 'Unemployment Rate' in indicator_name:
                    base_rate = self.safe_numeric(base_data.get('Unemployment Rate', 0))
                    quote_rate = self.safe_numeric(quote_data.get('Unemployment Rate', 0))
                    base_result = base_data.get('Result', 'N/A')
                    quote_result = quote_data.get('Result', 'N/A')
                    
                    if base_rate != 0 or quote_rate != 0:
                        employment_insights.append(f"UNEMPLOYMENT: Base {base_rate:.1f}% vs Quote {quote_rate:.1f}%")
                    
                    if score >= 1:
                        strong_bullish += 1
                        insights.append(f"UNEMPLOYMENT STRENGTH: Base currency unemployment better than expected (Score: {score})")
                    elif score <= -1:
                        strong_bearish += 1
                        insights.append(f"UNEMPLOYMENT WEAKNESS: Base currency unemployment disappointing (Score: {score})")
                    elif score != 0:
                        insights.append(f"UNEMPLOYMENT: Mixed unemployment signals (Score: {score})")
                    
                    print(f"[UNEMPLOYMENT_INSIGHT] Base: {base_rate}% ({base_result}), Quote: {quote_rate}% ({quote_result}), Score: {score}")
                
                # Other indicators
                else:
                    if score >= 2:
                        strong_bullish += 1
                        insights.append(f"STRONG: {indicator_name} very bullish (Score: {score})")
                    elif score <= -2:
                        strong_bearish += 1
                        insights.append(f"STRONG: {indicator_name} very bearish (Score: {score})")
                    elif abs(score) >= 1:
                        direction = "bullish" if score > 0 else "bearish"
                        insights.append(f"MODERATE: {indicator_name} showing {direction} bias (Score: {score})")
            
            # Add employment insights at the beginning
            insights = employment_insights + insights
            
            # Overall assessment
            total_score = extracted_data.get('total_score', 0)
            if total_score >= 8:
                insights.append("POSITIVE: Strong fundamental consensus supports bullish bias")
            elif total_score <= -8:
                insights.append("NEGATIVE: Strong fundamental consensus supports bearish bias")
            elif abs(total_score) <= 2:
                insights.append("NEUTRAL: Mixed fundamental signals suggest range-bound conditions")
            
            # Add momentum insights
            if strong_bullish > 2:
                insights.append("MOMENTUM: Multiple indicators showing bullish momentum")
            elif strong_bearish > 2:
                insights.append("MOMENTUM: Multiple indicators showing bearish momentum")
            
            print(f"[INSIGHTS] Generated {len(insights)} insights")
                
        except Exception as e:
            print(f"[ERROR] Error generating insights: {e}")
            print(f"[TRACEBACK] {traceback.format_exc()}")
            insights = ["Enhanced analysis completed"]
        
        return insights[:8]

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