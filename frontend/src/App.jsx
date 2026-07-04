import React from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import { Briefcase } from 'lucide-react'
import './index.css'

function App() {
  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <main className="w-full" style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
        <header className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', background: 'var(--accent-highlight)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>Trading Overview</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage and monitor your algorithmic trading models.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">Export Data</button>
            <button className="btn btn-primary">Connect Backend</button>
          </div>
        </header>
        
        <Dashboard />
      </main>
    </div>
  )
}

export default App
