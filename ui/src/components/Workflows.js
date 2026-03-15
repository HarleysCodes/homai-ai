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
    } else if (type === 'analyze') {
      prompt = `Analyze these properties and recommend which ones are good investments based on price, rent estimate, and condition: ${customInput}`;
    } else if (type === 'compare') {
      prompt = `Compare these properties and create a table showing price per sqft, cap rate estimates, and recommend the best value: ${customInput}`;
    } else if (type === 'pricing') {
      const details = customInput || '2000 sqft, 3 bed, 2 bath, Austin TX';
      prompt = `Suggest an optimal listing price and rental price for a property with: ${details}. Consider current market rates.`;
    }
    
    try {
      const response = await fetch(`${API_URL}/ai_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      setResult({ type: 'text', content: data.response || data });
    } catch (error) {
      setResult({ type: 'error', content: error.message });
    }
    setLoading(false);
  }

  const loadProperties = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/api/properties`);
      const data = await response.json();
      setResult({ type: 'properties', data });
    } catch (error) {
      setResult({ type: 'error', content: error.message });
    }
    setLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;
    
    if (result.type === 'properties') {
      const { properties, total } = result.data;
      return (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ color: '#8b949e', marginBottom: '1rem' }}>
            📊 {total} Properties Loaded
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {properties.map((prop, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(139,148,158,0.2)'
              }}>
                <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.5rem' }}>
                  {prop.address}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: '#8b949e' }}>Price:</span> <span style={{ color: '#3fb950' }}>${prop.price?.toLocaleString()}</span></div>
                  <div><span style={{ color: '#8b949e' }}>Rent:</span> <span style={{ color: '#58a6ff' }}>${prop.rent_estimate}/mo</span></div>
                  <div><span style={{ color: '#8b949e' }}>Beds:</span> {prop.bedrooms}</div>
                  <div><span style={{ color: '#8b949e' }}>Baths:</span> {prop.bathrooms}</div>
                  <div><span style={{ color: '#8b949e' }}>Sqft:</span> {prop.sqft?.toLocaleString()}</div>
                  <div><span style={{ color: '#8b949e' }}>Built:</span> {prop.year_built}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (result.type === 'error') {
      return (
        <div style={{ marginTop: '1.5rem', color: '#f85149' }}>
          Error: {result.content}
        </div>
      );
    }
    
    return (
      <div style={{ 
        marginTop: '1.5rem',
        background: 'rgba(0,0,0,0.4)', 
        borderRadius: '12px', 
        padding: '1.5rem'
      }}>
        <div style={{ color: '#8b949e', marginBottom: '0.5rem' }}>Result:</div>
        <div style={{ color: '#fff', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {result.content}
        </div>
      </div>
    );
  };

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
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📊 Market Analysis
        </button>
        
        <button 
          onClick={loadProperties}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #238636, #2ea043)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🏠 Load Properties ({'>'}11 in DB)
        </button>
        
        <button 
          onClick={() => runWorkflow('analyze')}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #6e40c9, #8250df)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📈 Analyze Investments
        </button>
        
        <button 
          onClick={() => runWorkflow('pricing')}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #bf8700, #d29922)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          💰 Pricing Recommendation
        </button>
        
        <button 
          onClick={() => runWorkflow('compare')}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #1f6feb, #388bfd)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          ⚖️ Compare Properties
        </button>
        
        <button 
          onClick={() => runWorkflow('lead')}
          disabled={loading}
          style={{
            background: 'rgba(139,148,158,0.2)',
            color: '#e6edf3',
            border: '1px solid rgba(139,148,158,0.3)',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          ✉️ Lead Follow-up
        </button>
        
        <button 
          onClick={() => runWorkflow('listing')}
          disabled={loading}
          style={{
            background: 'rgba(139,148,158,0.2)',
            color: '#e6edf3',
            border: '1px solid rgba(139,148,158,0.3)',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📝 Listing Description
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#8b949e' }}>
          ⏳ Running... (10-30 seconds)
        </div>
      )}

      {renderResult()}
    </div>
  );
}

export default Workflows;
