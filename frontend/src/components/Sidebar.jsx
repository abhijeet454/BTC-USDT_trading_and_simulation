import React from 'react';
import { Home, LineChart, Target, Settings, Shield, Clock } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="flex-col justify-between" style={{ 
      width: '260px', height: '100vh', position: 'sticky', top: 0, 
      background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)',
      padding: '1.5rem'
    }}>
      <div>
        <div className="flex items-center gap-2" style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%' }}></div>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>InstiTrade</h2>
        </div>
        
        <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Analytics
        </div>
        <nav className="flex-col gap-1">
          <SidebarItem icon={<Home size={18} />} label="Dashboard" active />
          <SidebarItem icon={<LineChart size={18} />} label="Model Performance" />
          <SidebarItem icon={<Target size={18} />} label="Trading Signals" />
        </nav>

        <div style={{ marginBottom: '1rem', marginTop: '2rem', paddingLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Management
        </div>
        <nav className="flex-col gap-1">
          <SidebarItem icon={<Shield size={18} />} label="Risk Control" />
          <SidebarItem icon={<Clock size={18} />} label="Execution Logs" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </div>
      
      <div className="panel" style={{ padding: '1rem', background: '#f8fafc', boxShadow: 'none' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Connection Status</h4>
        <div className="flex items-center gap-2">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>FastAPI Server Online</span>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center gap-3 ${active ? 'active' : ''}`} style={{ 
    padding: '0.6rem 0.75rem', 
    borderRadius: 'var(--radius-sm)',
    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
    background: active ? 'var(--accent-highlight)' : 'transparent',
    fontWeight: active ? 600 : 500,
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
  }}>
    {icon}
    <span>{label}</span>
  </a>
);

export default Sidebar;
