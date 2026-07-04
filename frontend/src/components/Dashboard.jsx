import React, { useState, useEffect } from 'react';
import TradingChart from './TradingChart';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/predict');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Backend returned error");
        }
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-col gap-6">
      {/* HUD Stats Row */}
      <div className="flex gap-6 w-full" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard title="Predicted Close (T+1)" value={data ? `$${data.predictions.close.toFixed(2)}` : '---'} trend={data ? `${data.predictions.close_change > 0 ? '+' : ''}${(data.predictions.close_change * 100).toFixed(2)}%` : '---'} isPositive={data ? data.predictions.close_change > 0 : null} icon={<Activity size={20} />} />
        <StatCard title="Predicted High (T+1)" value={data ? `$${data.predictions.high.toFixed(2)}` : '---'} trend="Suggested Take Profit" isPositive={true} icon={<ArrowUpRight size={20} />} />
        <StatCard title="Predicted Low (T+1)" value={data ? `$${data.predictions.low.toFixed(2)}` : '---'} trend="Suggested Stop Loss" isPositive={false} icon={<ArrowDownRight size={20} />} />
        <StatCard title="Directional Confidence" value={data ? `${(data.predictions.confidence * 100).toFixed(1)}%` : '---'} trend={data && data.predictions.signal === 1 ? 'Bullish' : (data && data.predictions.signal === -1 ? 'Bearish' : 'Neutral')} isPositive={data ? data.predictions.signal === 1 : null} icon={<DollarSign size={20} />} />
      </div>

      {/* Main Terminal Chart */}
      <div className="panel" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Price Prediction Trajectory</h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Next Time Step (T+1) Forecast</p>
          </div>
          <select style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}>
            <option>BTC/USDT</option>
            <option>ETH/USDT</option>
          </select>
        </div>
        <div style={{ height: '400px', width: '100%' }}>
          {loading && !data ? (
            <div className="flex justify-center items-center h-full">
              {/* Spinning loader */}
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <TradingChart chartData={data?.chart_data} />
          )}
        </div>
      </div>

      {/* Deep Learning Feed */}
      <div className="flex gap-6" style={{ marginTop: '1.5rem' }}>
        <div className="panel w-full" style={{ flex: 2 }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Model Signals</h3>
          <table className="classic-table">
            <thead>
              <tr>
                <th>Time (UTC)</th>
                <th>Signal</th>
                <th>Predicted Close</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data?.history ? data.history.map((row, i) => (
                <FeedRow key={i} date={row.date} signal={row.signal} price={row.price} confidence={row.confidence} type={row.type} />
              )) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>Awaiting Backend Connection to `http://localhost:8000`...</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="panel w-full" style={{ flex: 1, background: 'var(--bg-primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Model Architecture</h3>
          <div className="flex-col gap-3">
            <SpecRow label="Framework" value="Keras / TensorFlow" />
            <SpecRow label="Architecture" value="Multi-Output LSTM" />
            <SpecRow label="Sequence Length" value="60 Hours" />
            <SpecRow label="Target Variables" value="High, Low, Close, Vol" />
            <SpecRow label="Optimizer" value="Adam (lr=0.001)" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive, icon }) => (
  <div className="panel">
    <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</span>
      <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
      {value}
    </div>
    <div className="flex items-center gap-1" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
      {isPositive !== null && (
        <span style={{ color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
          {trend}
        </span>
      )}
      {isPositive === null && <span style={{ color: 'var(--text-muted)' }}>{trend}</span>}
    </div>
  </div>
);

const FeedRow = ({ date, signal, price, confidence, type }) => {
  const getColor = () => {
    if (type === 'buy') return 'var(--success)';
    if (type === 'sell') return 'var(--danger)';
    return 'var(--warning)';
  };

  const getBg = () => {
    if (type === 'buy') return '#dcfce7';
    if (type === 'sell') return '#fee2e2';
    return '#fef9c3';
  }

  return (
    <tr>
      <td>{date}</td>
      <td>
        <span style={{ 
          color: getColor(), 
          backgroundColor: getBg(),
          padding: '4px 10px', 
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '0.75rem'
        }}>
          {signal}
        </span>
      </td>
      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>${price.toFixed(2)}</td>
      <td>{(confidence * 100).toFixed(1)}%</td>
    </tr>
  );
};

const SpecRow = ({ label, value }) => (
  <div className="flex justify-between items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{label}</span>
    <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>{value}</span>
  </div>
);

export default Dashboard;
