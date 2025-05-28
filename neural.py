import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.optimizers import Adam
import yfinance as yf
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class ForexNeuralNetwork:
    def __init__(self, currency_pair="EURUSD=X", lookback_period=60):
        """
        Initialize the Forex Neural Network
        
        Args:
            currency_pair: Currency pair symbol (e.g., "EURUSD=X", "GBPUSD=X")
            lookback_period: Number of previous days to use for prediction
        """
        self.currency_pair = currency_pair
        self.lookback_period = lookback_period
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = None
        self.data = None
        self.scaled_data = None
        
    def fetch_forex_data(self, period="2y"):
        """
        Step 1: Fetch forex data from Yahoo Finance
        
        Args:
            period: Time period for data ("1y", "2y", "5y", "max")
        """
        print(f"Fetching {self.currency_pair} data...")
        
        try:
            ticker = yf.Ticker(self.currency_pair)
            self.data = ticker.history(period=period)
            
            if self.data.empty:
                raise ValueError(f"No data found for {self.currency_pair}")
                
            print(f"Successfully fetched {len(self.data)} days of data")
            print(f"Date range: {self.data.index[0].date()} to {self.data.index[-1].date()}")
            
            # Display basic statistics
            print(f"\nBasic Statistics for {self.currency_pair}:")
            print(f"Current Price: {self.data['Close'][-1]:.4f}")
            print(f"52-week High: {self.data['High'].max():.4f}")
            print(f"52-week Low: {self.data['Low'].min():.4f}")
            
            return self.data
            
        except Exception as e:
            print(f"Error fetching data: {e}")
            return None
    
    def preprocess_data(self):
        """
        Step 2: Preprocess the data for neural network training
        """
        if self.data is None:
            raise ValueError("No data available. Please fetch data first.")
        
        print("Preprocessing data...")
        
        # Use closing prices for prediction
        close_prices = self.data['Close'].values.reshape(-1, 1)
        
        # Scale the data to 0-1 range
        self.scaled_data = self.scaler.fit_transform(close_prices)
        
        # Create sequences for time series prediction
        X, y = [], []
        
        for i in range(self.lookback_period, len(self.scaled_data)):
            X.append(self.scaled_data[i-self.lookback_period:i, 0])
            y.append(self.scaled_data[i, 0])
        
        X, y = np.array(X), np.array(y)
        
        # Reshape X for LSTM input (samples, timesteps, features)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        
        print(f"Created {len(X)} training sequences")
        print(f"Input shape: {X.shape}")
        print(f"Output shape: {y.shape}")
        
        return X, y
    
    def build_model(self, neurons=[50, 50], dropout_rate=0.2):
        """
        Step 3: Build the neural network model
        
        Args:
            neurons: List of neurons in each LSTM layer
            dropout_rate: Dropout rate for regularization
        """
        print("Building neural network model...")
        
        self.model = Sequential()
        
        # First LSTM layer
        self.model.add(LSTM(neurons[0], return_sequences=True, 
                           input_shape=(self.lookback_period, 1)))
        self.model.add(Dropout(dropout_rate))
        
        # Second LSTM layer
        self.model.add(LSTM(neurons[1], return_sequences=False))
        self.model.add(Dropout(dropout_rate))
        
        # Dense layers
        self.model.add(Dense(25))
        self.model.add(Dense(1))
        
        # Compile the model
        self.model.compile(optimizer=Adam(learning_rate=0.001), 
                          loss='mean_squared_error')
        
        print("Model architecture:")
        self.model.summary()
        
        return self.model
    
    def train_model(self, X, y, test_size=0.2, epochs=100, batch_size=32):
        """
        Step 4: Train the neural network
        
        Args:
            X: Input features
            y: Target values
            test_size: Proportion of data for testing
            epochs: Number of training epochs
            batch_size: Batch size for training
        """
        print("Training the model...")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, shuffle=False
        )
        
        print(f"Training set size: {len(X_train)}")
        print(f"Test set size: {len(X_test)}")
        
        # Train the model
        history = self.model.fit(
            X_train, y_train,
            batch_size=batch_size,
            epochs=epochs,
            validation_data=(X_test, y_test),
            verbose=1,
            shuffle=False
        )
        
        return history, X_test, y_test
    
    def make_predictions(self, X_test):
        """
        Step 5: Make predictions
        """
        print("Making predictions...")
        
        predictions = self.model.predict(X_test)
        
        # Inverse transform to get actual prices
        predictions = self.scaler.inverse_transform(predictions)
        
        return predictions
    
    def evaluate_model(self, y_test, predictions):
        """
        Step 6: Evaluate model performance
        """
        # Inverse transform actual values
        y_test_actual = self.scaler.inverse_transform(y_test.reshape(-1, 1))
        
        # Calculate metrics
        mse = np.mean((y_test_actual - predictions) ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(y_test_actual - predictions))
        mape = np.mean(np.abs((y_test_actual - predictions) / y_test_actual)) * 100
        
        print(f"\nModel Performance Metrics:")
        print(f"Mean Squared Error (MSE): {mse:.6f}")
        print(f"Root Mean Squared Error (RMSE): {rmse:.6f}")
        print(f"Mean Absolute Error (MAE): {mae:.6f}")
        print(f"Mean Absolute Percentage Error (MAPE): {mape:.2f}%")
        
        return {
            'mse': mse,
            'rmse': rmse,
            'mae': mae,
            'mape': mape
        }
    
    def plot_results(self, y_test, predictions, history):
        """
        Step 7: Visualize results
        """
        # Inverse transform actual values
        y_test_actual = self.scaler.inverse_transform(y_test.reshape(-1, 1))
        
        # Create subplots
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        
        # Plot 1: Actual vs Predicted prices
        ax1.plot(y_test_actual, label='Actual Prices', color='blue', alpha=0.7)
        ax1.plot(predictions, label='Predicted Prices', color='red', alpha=0.7)
        ax1.set_title(f'{self.currency_pair} - Actual vs Predicted Prices')
        ax1.set_xlabel('Time')
        ax1.set_ylabel('Price')
        ax1.legend()
        ax1.grid(True)
        
        # Plot 2: Training history
        ax2.plot(history.history['loss'], label='Training Loss')
        ax2.plot(history.history['val_loss'], label='Validation Loss')
        ax2.set_title('Model Loss During Training')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Loss')
        ax2.legend()
        ax2.grid(True)
        
        # Plot 3: Prediction errors
        errors = y_test_actual.flatten() - predictions.flatten()
        ax3.hist(errors, bins=30, alpha=0.7, color='green')
        ax3.set_title('Distribution of Prediction Errors')
        ax3.set_xlabel('Error')
        ax3.set_ylabel('Frequency')
        ax3.grid(True)
        
        # Plot 4: Scatter plot of actual vs predicted
        ax4.scatter(y_test_actual, predictions, alpha=0.6, color='purple')
        ax4.plot([y_test_actual.min(), y_test_actual.max()], 
                [y_test_actual.min(), y_test_actual.max()], 'r--', lw=2)
        ax4.set_title('Actual vs Predicted Scatter Plot')
        ax4.set_xlabel('Actual Prices')
        ax4.set_ylabel('Predicted Prices')
        ax4.grid(True)
        
        plt.tight_layout()
        plt.show()
    
    def predict_next_price(self, days_ahead=1):
        """
        Step 8: Predict future prices
        """
        if self.model is None:
            raise ValueError("Model not trained yet.")
        
        print(f"Predicting price for next {days_ahead} day(s)...")
        
        # Get the last sequence
        last_sequence = self.scaled_data[-self.lookbook_period:].reshape(1, self.lookback_period, 1)
        
        predictions = []
        current_sequence = last_sequence.copy()
        
        for _ in range(days_ahead):
            # Predict next value
            next_pred = self.model.predict(current_sequence, verbose=0)
            predictions.append(next_pred[0, 0])
            
            # Update sequence for next prediction
            current_sequence = np.roll(current_sequence, -1, axis=1)
            current_sequence[0, -1, 0] = next_pred[0, 0]
        
        # Inverse transform predictions
        predictions = np.array(predictions).reshape(-1, 1)
        predicted_prices = self.scaler.inverse_transform(predictions)
        
        current_price = self.data['Close'][-1]
        
        print(f"Current price: {current_price:.4f}")
        for i, price in enumerate(predicted_prices.flatten(), 1):
            change = ((price - current_price) / current_price) * 100
            print(f"Day {i} prediction: {price:.4f} ({change:+.2f}%)")
        
        return predicted_prices

# Main execution function
def run_forex_prediction(currency_pair="EURUSD=X"):
    """
    Complete step-by-step execution
    """
    print("="*60)
    print("FOREX NEURAL NETWORK PREDICTION SYSTEM")
    print("="*60)
    
    # Initialize the neural network
    forex_nn = ForexNeuralNetwork(currency_pair=currency_pair)
    
    try:
        # Step 1: Fetch data
        data = forex_nn.fetch_forex_data(period="2y")
        if data is None:
            return
        
        # Step 2: Preprocess data
        X, y = forex_nn.preprocess_data()
        
        # Step 3: Build model
        model = forex_nn.build_model(neurons=[50, 50], dropout_rate=0.2)
        
        # Step 4: Train model
        history, X_test, y_test = forex_nn.train_model(
            X, y, epochs=50, batch_size=32
        )
        
        # Step 5: Make predictions
        predictions = forex_nn.make_predictions(X_test)
        
        # Step 6: Evaluate model
        metrics = forex_nn.evaluate_model(y_test, predictions)
        
        # Step 7: Plot results
        forex_nn.plot_results(y_test, predictions, history)
        
        # Step 8: Predict future prices
        future_predictions = forex_nn.predict_next_price(days_ahead=5)
        
        print("\n" + "="*60)
        print("PREDICTION COMPLETE!")
        print("="*60)
        
        return forex_nn
        
    except Exception as e:
        print(f"Error during execution: {e}")
        return None

# Example usage
if __name__ == "__main__":
    # You can change the currency pair here
    # Popular pairs: "EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X"
    
    forex_model = run_forex_prediction("EURUSD=X")
    
    # Optional: Try different currency pairs
    # forex_model = run_forex_prediction("GBPUSD=X")
    # forex_model = run_forex_prediction("USDJPY=X")