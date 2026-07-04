import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential, load_model
from keras.layers import LSTM, Dense, Dropout, Input
from keras.callbacks import EarlyStopping, ModelCheckpoint
from keras.optimizers import Adam
import matplotlib.pyplot as plt
import os

# 1. Load and preprocess data
def load_and_preprocess_data(filepath):
    headers = ["datetime", "open", "high", "low", "close", "volume"]
    data = pd.read_csv(filepath, names=headers, header=0, parse_dates=['datetime'], index_col='datetime')
    
    # Feature Engineering
    data['price_change'] = data['close'].pct_change()
    data['volume_change'] = data['volume'].pct_change()
    
    # FUTURE TARGETS (MULTI-OUTPUT):
    # Predict High, Low, Close, and Volume for the NEXT time step.
    data['target_close'] = data['close'].pct_change().shift(-1)
    data['target_high'] = data['high'].pct_change().shift(-1)
    data['target_low'] = data['low'].pct_change().shift(-1)
    data['target_vol'] = data['volume'].pct_change().shift(-1)
    
    data.dropna(inplace=True)
    data = data.replace([np.inf, -np.inf], np.nan).dropna()
    return data

# 2. Prepare sequences for LSTM
def create_sequences(features, labels, sequence_length=60):
    X, y = [], []
    for i in range(len(features) - sequence_length):
        X.append(features[i:(i + sequence_length)])
        y.append(labels[i + sequence_length])
    return np.array(X), np.array(y)

def prepare_features_labels(data, sequence_length=60):
    feature_cols = ['open', 'high', 'low', 'close', 'volume', 'price_change', 'volume_change']
    features = data[feature_cols].values
    
    # Multi-dimensional labels array (4 parameters)
    labels = data[['target_close', 'target_high', 'target_low', 'target_vol']].values
    
    # Split BEFORE scaling to prevent test data leaking into the scaler
    train_size_raw = int(len(features) * 0.8)
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    # Fit scaler ONLY on the training portion
    scaler.fit(features[:train_size_raw])
    features_scaled = scaler.transform(features)
    
    # Create time sequences (e.g. 60 hours lookback)
    X, y = create_sequences(features_scaled, labels, sequence_length)
    
    # Recalculate train_size for the sequenced data
    train_size_seq = int(len(X) * 0.8)
    
    X_train, X_test = X[:train_size_seq], X[train_size_seq:]
    y_train, y_test = y[:train_size_seq], y[train_size_seq:]
    
    return X_train, X_test, y_train, y_test, scaler, train_size_seq, sequence_length

# 3. Build the Multi-Output LSTM Architecture
def build_lstm_model(input_shape):
    model = Sequential()
    model.add(Input(shape=input_shape))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    # Output layer now has 4 units for the 4 target variables
    model.add(Dense(units=4))
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error', metrics=['mae'])
    return model

# 4. Train the Model
def train_lstm_model(model, X_train, y_train, X_test, y_test, model_path='best_model.keras'):
    early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    checkpoint = ModelCheckpoint(model_path, monitor='val_loss', save_best_only=True)
    
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=64,
        validation_data=(X_test, y_test),
        callbacks=[early_stop, checkpoint],
        verbose=1
    )
    return history

if __name__ == '__main__':
    filepath = 'btc_1h.csv'
    if os.path.exists(filepath):
        print("Loading data...")
        data = load_and_preprocess_data(filepath)
        
        print("Preparing multi-parameter sequences...")
        X_train, X_test, y_train, y_test, scaler, train_size_seq, seq_length = prepare_features_labels(data, sequence_length=60)
        
        print(f"Training shape: {X_train.shape}, Testing shape: {X_test.shape}")
        
        model = build_lstm_model((X_train.shape[1], X_train.shape[2]))
        
        print("Training multi-output model...")
        history = train_lstm_model(model, X_train, y_train, X_test, y_test, model_path='best_model.keras')
        print("Model trained and saved to best_model.keras!")
    else:
        print(f"Data file not found: {filepath}. Please ensure it exists.")
