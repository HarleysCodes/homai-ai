import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Workflows() {
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runWorkflow = async (type) => {
    setLoading(true);
    setResult(null);
    
    let prompt = '';
    if (type === 'market') {
      const location = customInput || 'Austin TX';
      prompt = `Give me a real estate market analysis for ${location} including prices, inventory, and trends`;
    } else if (type === 'lead') {
      const leadName = customInput || 'potential buyer';
      prompt = `Write a professional follow-up email for ${leadName} about a property they showed interest in`;
    } else if (type === 'listing') {
      const details = customInput || '3 bed, 2 bath, single family home';
      prompt = `Write an attractive real estate listing description for a ${details}`;
    }
    
    try {
      const response = await fetch(`${API_URL}/ai_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      setResult(data.response || data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>⚙️ Workflows</h2>
      
      <input
        type="text"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Enter details: city name, lead name, or property details"
        style={{
          width: '100%',
          padding: '1rem',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(139,148,158,0.25)',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}
      />

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <button 
          onClick={() => runWorkflow('market')}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #1e3a5f, #2d5a87)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'left'
          }}
        >
          📊 Market Summary
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {customInput ? `For: ${customInput}` : 'Default: Austin TX'}
          </div>
        </button>
        
        <button 
          onClick={() => runWorkflow('lead')}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #3d5a1e, #4a7a23)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'left'
          }}
        >
          ✉️ Lead Follow-up
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {customInput ? `For: ${customInput}` : 'Generic lead'}
          </div>
        </button>
        
        <button 
          onClick={() => runWorkflow('listing')}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #5a3d1e, #7a4a23)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'left'
          }}
        >
          🏠 Property Listing
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {customInput ? `Details: ${customInput}` : 'Generic listing'}
          </div>
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#8b949e' }}>
          ⏳ Running... (10-30 seconds)
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '1.5rem',
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: '12px', 
          padding: '1.5rem'
        }}>
          <div style={{ color: '#8b949e', marginBottom: '0.5rem' }}>Result:</div>
          <div style={{ color: '#fff', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

export default Workflows;
