import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function DataUpload() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_URL}/ai_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      setResult(data.response || data);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>💬 Ask the AI</h2>
      <p style={{ color: '#8b949e', marginBottom: '1.5rem' }}>
        Ask anything about real estate — properties, markets, leads, etc.
      </p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: What's a good rent for a 3BR house in Austin?"
        rows={4}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(139,148,158,0.25)',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '1rem',
          resize: 'vertical'
        }}
      />
      
      <button 
        onClick={analyze} 
        disabled={!text.trim() || loading}
        style={{
          background: loading ? '#666' : 'linear-gradient(135deg, #238636, #2ea043)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '10px',
          fontWeight: '600',
          width: '100%',
          marginTop: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Thinking...' : 'Ask AI'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '1.5rem',
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: '12px', 
          padding: '1.5rem'
        }}>
          <div style={{ color: '#8b949e', marginBottom: '0.5rem' }}>Answer:</div>
          <div style={{ color: '#fff', lineHeight: '1.6' }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
