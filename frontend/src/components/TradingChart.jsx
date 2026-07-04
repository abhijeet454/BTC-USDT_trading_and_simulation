import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fallbackData = [
  { name: 'T-6', close: 34000, high: 34200, low: 33800 },
  { name: 'T-5', close: 34200, high: 34450, low: 34100 },
  { name: 'T-4', close: 34150, high: 34300, low: 34000 },
  { name: 'T-3', close: 34300, high: 34600, low: 34250 },
  { name: 'T-2', close: 34500, high: 34700, low: 34400 },
  { name: 'T-1', close: 34400, high: 34550, low: 34200 },
  { name: 'T-0', close: 34600, high: 34800, low: 34450 },
  { name: 'T+1 (PRED)', close: 34850, high: 35100, low: 34600 },
];

const TradingChart = ({ chartData }) => {
  const data = chartData || fallbackData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="var(--text-muted)" 
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
          axisLine={false}
          tickLine={false} 
          dy={10}
        />
        <YAxis 
          domain={['dataMin - 100', 'dataMax + 100']} 
          stroke="var(--text-muted)" 
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
          axisLine={false} 
          tickLine={false} 
          dx={-10}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--bg-panel)', 
            borderRadius: '6px', 
            border: '1px solid var(--border-color)', 
            boxShadow: 'var(--shadow-md)', 
            color: 'var(--text-primary)'
          }}
          itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
        />
        
        <Area type="monotone" dataKey="high" stroke="var(--warning)" strokeWidth={1} strokeDasharray="4 4" fillOpacity={0} name="High (Prediction)" />
        <Area type="monotone" dataKey="low" stroke="var(--danger)" strokeWidth={1} strokeDasharray="4 4" fillOpacity={0} name="Low (Prediction)" />
        <Area type="monotone" dataKey="close" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" name="Close Price" activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: 'var(--accent-primary)' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TradingChart;
