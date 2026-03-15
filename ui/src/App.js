import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PropertyAnalysis from './components/PropertyAnalysis';
import MarketReport from './components/MarketReport';
import Workflows from './components/Workflows';
import EmailGenerator from './components/EmailGenerator';
import AIChat from './components/AIChat';
import SystemStatus from './components/SystemStatus';
import DataUpload from './components/DataUpload';
import Settings from './components/Settings';
import Install from './components/Install';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/system_status`)
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => setApiStatus({ error: err.message }));
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src="/homai-logo.png" alt="HOMAI" />
          <p>AI Real Estate Operating System</p>
          {apiStatus && (
            <span className="status-badge">
              {apiStatus.services?.qwen === 'online' ? '🟢' : '🟡'} 
              {apiStatus.services?.qwen === 'online' ? ' Online' : ' Starting...'}
            </span>
          )}
        </header>

        <nav className="App-nav">
          <Link to="/">Property Analysis</Link>
          <Link to="/market">Market Report</Link>
          <Link to="/workflows">Workflows</Link>
          <Link to="/email">Email</Link>
          <Link to="/chat">AI Chat</Link>
          <Link to="/status">Status</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<PropertyAnalysis />} />
            <Route path="/market" element={<MarketReport />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/email" element={<EmailGenerator />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/status" element={<SystemStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
