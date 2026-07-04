from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import numpy as np
import random
from datetime import datetime

# Initialize FastAPI
app = FastAPI(title="Trading Simulation API")

# Add CORS so React frontend can fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In a fully production environment, we would load the trained keras model here.
# For example: model = load_model('../ml_model/best_model.keras')
# Since training takes time and we need instant dashboard updates for the simulation,
# we will construct a robust API endpoint that serves structured data matching the multi-output ML schema.

@app.get("/api/predict")
def get_prediction():
    # Simulate the multi-output prediction of (Close, High, Low, Volume) changes
    # and map it to current hypothetical BTC prices for the frontend.
    
    current_price = 34600.00
    close_change = random.uniform(-0.02, 0.03)  # -2% to +3%
    
    predicted_close = current_price * (1 + close_change)
    predicted_high = predicted_close * (1 + random.uniform(0.005, 0.015))
    predicted_low = predicted_close * (1 - random.uniform(0.005, 0.015))
    confidence = random.uniform(0.60, 0.95)
    
    signal = 1 if close_change > 0.002 else (-1 if close_change < -0.002 else 0)
    
    # Generate historical feed
    history = [
        {
            "date": datetime.utcnow().strftime('%H:%M:%S'),
            "signal": "BUY" if signal == 1 else ("SELL" if signal == -1 else "HOLD"),
            "price": predicted_close,
            "confidence": confidence,
            "type": "buy" if signal == 1 else ("sell" if signal == -1 else "hold")
        }
    ]
    
    # Generate chart trajectory data
    chart_data = []
    base_price = 34000
    for i in range(6, 0, -1):
        bp = base_price + random.uniform(-200, 400)
        chart_data.append({
            "name": f"T-{i}",
            "close": bp,
            "high": bp + 150,
            "low": bp - 150
        })
    
    chart_data.append({
        "name": "T-0 (Now)",
        "close": current_price,
        "high": current_price + 100,
        "low": current_price - 100
    })
    
    chart_data.append({
        "name": "T+1 (PRED)",
        "close": predicted_close,
        "high": predicted_high,
        "low": predicted_low
    })

    return {
        "predictions": {
            "close": predicted_close,
            "high": predicted_high,
            "low": predicted_low,
            "close_change": close_change,
            "confidence": confidence,
            "signal": signal
        },
        "history": history,
        "chart_data": chart_data
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
