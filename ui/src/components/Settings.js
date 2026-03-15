import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [claudeKey, setClaudeKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('claude_api_key');
    if (savedKey) setClaudeKey(savedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('claude_api_key', claudeKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('claude_api_key');
    setClaudeKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyInstall = () => {
    navigator.clipboard.writeText('bash <(curl -fsSL https://raw.githubusercontent.com/HarleysCodes/homai-ai/main/install_homai.sh)');
    alert('Copied!');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
      {/* One-Click Install */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f, #2d5a87)', 
        borderRadius: '16px', 
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>🚀 One-Click Install HOMAI</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
          Install Ollama + Qwen AI + HOMAI on your Mac in one command.
        </p>
        <div style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '0.75rem', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: '#3fb950',
          marginBottom: '1rem'
        }}>
          bash &lt;(curl -fsSL https://raw.githubusercontent.com/HarleysCodes/homai-ai/main/install_homai.sh)
        </div>
        <button onClick={copyInstall} style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white', border: 'none', padding: '0.6rem 1.2rem',
          borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
        }}>
          📋 Copy Command
        </button>
      </div>
      
      <h2>⚙️ Settings</h2>
      
      {/* Claude API */}
      <div style={{ 
        background: 'rgba(22,27,34,0.8)', 
        border: '1px solid rgba(139,148,158,0.15)', 
        borderRadius: '16px', 
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#e6edf3', marginBottom: '0.5rem' }}>🔑 Claude API (Recommended)</h3>
        <p style={{ color: '#8b949e', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Add your Claude API key for instant AI responses. Get free credits at:
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', marginLeft: '0.5rem' }}>
            console.anthropic.com →
          </a>
        </p>
        
        <input
          type="password"
          value={claudeKey}
          onChange={(e) => setClaudeKey(e.target.value)}
          placeholder="sk-ant-..."
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(139,148,158,0.25)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSave} style={{
            background: 'linear-gradient(135deg, #238636, #2ea043)',
            color: 'white', border: 'none', padding: '0.75rem 1.5rem',
            borderRadius: '10px', fontWeight: '600', cursor: 'pointer'
          }}>
            {saved ? '✓ Saved!' : 'Save Key'}
          </button>
          <button onClick={handleClear} style={{
            background: 'rgba(210,153,34,0.15)', color: '#d29922',
            border: '1px solid rgba(210,153,34,0.3)', padding: '0.75rem 1.5rem',
            borderRadius: '10px', fontWeight: '600', cursor: 'pointer'
          }}>
            Clear
          </button>
        </div>
      </div>

      {/* Local Setup */}
      <div style={{ 
        background: 'rgba(22,27,34,0.8)', 
        border: '1px solid rgba(139,148,158,0.15)', 
        borderRadius: '16px', 
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#e6edf3', marginBottom: '0.5rem' }}>💻 Run Locally (Advanced)</h3>
        <p style={{ color: '#8b949e', fontSize: '0.875rem', marginBottom: '1rem' }}>
          To run HOMAI with local Qwen AI (requires Mac with 16GB+ RAM):
        </p>
        
        <pre style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '1rem', 
          borderRadius: '8px',
          color: '#8b949e',
          fontSize: '0.8rem',
          overflow: 'auto'
        }}>
{`# Install Ollama
brew install ollama

# Download Qwen model
ollama pull qwen2.5:7b

# Start HOMAI
git clone [your-repo]
cd homai/ui && npm start`}
        </pre>
      </div>

      {/* Status */}
      <div style={{ 
        background: 'rgba(22,27,34,0.8)', 
        border: '1px solid rgba(139,148,158,0.15)', 
        borderRadius: '16px', 
        padding: '2rem'
      }}>
        <h3 style={{ color: '#e6edf3', marginBottom: '1rem' }}>🔌 Connection Status</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8b949e' }}>Claude API</span>
            <span style={{ color: claudeKey ? '#3fb950' : '#6e7681' }}>
              {claudeKey ? '✓ Ready' : '⚪ Add key in Settings'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8b949e' }}>Local Qwen</span>
            <span style={{ color: '#6e7681' }}>⚪ Requires local install</span>
          </div>
        </div>
      </div>
    </div>
  );
}
