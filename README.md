# InstiTrade: Institutional Algorithmic Trading Platform

InstiTrade is a highly advanced, full-stack machine learning application built for forecasting algorithmic trading targets (Close, High, Low, Volume). It features a Python multi-output LSTM model, a fast FastAPI backend, and a classic SaaS-styled React dashboard.

## System Architecture

1. **Machine Learning Model (`/ml_model`)**: A multi-output LSTM model that analyzes sequences (60 hours) of historical BTC-USDT data to predict 4 key parameters for the next timestep simultaneously.
2. **Backend API (`/backend`)**: A highly performant FastAPI server that serves the live predictions to the dashboard.
3. **Frontend Dashboard (`/frontend`)**: A React + Vite application styled with a clean, classic SaaS theme to monitor live model execution.

## Installation & Setup

### 1. Train the Model
You must first train the model so it can generate the `best_model.keras` weights file.
1. Navigate to the `ml_model` directory:
   ```bash
   cd ml_model
   ```
2. Run the training script:
   ```bash
   python train.py
   ```
3. Ensure `btc_1h.csv` is present in the directory before running.


### 2. Start the Backend Server
The FastAPI backend requires Python dependencies.
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```
   *The backend will now be running on http://localhost:8000*

### 3. Start the Frontend Dashboard
1. Open a **new** terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The dashboard will now be running on http://localhost:5173*

## Usage
Once both servers are running, navigate to http://localhost:5173 in your browser. The React dashboard will automatically fetch prediction data from the FastAPI backend and render the charts!
