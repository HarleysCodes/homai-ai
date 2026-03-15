import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PropertyAnalysis from './components/PropertyAnalysis';
import MarketReport from './components/MarketReport';
import Workflows from './components/Workflows';
import EmailGenerator from './components/EmailGenerator';
import AIChat from './components/AIChat';
import SystemStatus from './components/SystemStatus';
import DataUpload from './components/DataUpload';
import Settings from './components/Settings';
import Landing from './components/Landing';
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/system_status`)
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => setApiStatus({ error: err.message }));
  }, []);

  // Landing page has its own sidebar
  if (isLanding) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/properties" element={<PropertyAnalysis />} />
        <Route path="/market" element={<MarketReport />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/email" element={<EmailGenerator />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/status" element={<SystemStatus />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    );
  }

  // Standard app layout
  return (
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
        <Link to="/">Home</Link>
        <Link to="/properties">Property Analysis</Link>
        <Link to="/market">Market Report</Link>
        <Link to="/workflows">Workflows</Link>
        <Link to="/email">Email</Link>
        <Link to="/chat">AI Chat</Link>
        <Link to="/status">Status</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <main className="App-main">
        <Routes>
          <Route path="/properties" element={<PropertyAnalysis />} />
          <Route path="/market" element={<MarketReport />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/email" element={<EmailGenerator />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
