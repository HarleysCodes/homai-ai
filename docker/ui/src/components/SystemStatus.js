import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/system_status`);
      setStatus(response.data);
    } catch (error) {
      setStatus({ error: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="card"><p>Loading status...</p></div>;

  return (
    <div className="card">
      <h2>🔧 System Status</h2>
      
      {status?.error ? (
        <div style={{ color: '#ff4444' }}>Error: {status.error}</div>
      ) : (
        <>
          <p>Last updated: {status?.timestamp}</p>
          
          <div className="status-grid">
            {status?.services && Object.entries(status.services).map(([service, state]) => (
              <div key={service} className={`status-item ${state === 'online' || state === 'available' ? 'online' : 'offline'}`}>
                <strong>{service.toUpperCase()}</strong>
                <p>{state}</p>
              </div>
            ))}
          </div>
          
          <button onClick={fetchStatus} className="btn" style={{ marginTop: '1rem' }}>
            Refresh Status
          </button>
        </>
      )}
    </div>
  );
}

export default SystemStatus;
