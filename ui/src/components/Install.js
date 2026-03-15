import React, { useState } from 'react';

export default function Install() {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText('bash <(curl -fsSL https://raw.githubusercontent.com/CryptoAscend/homai-ai/main/install_homai.sh)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
      <h2>🚀 One-Click Install HOMAI</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f, #2d5a87)', 
        borderRadius: '16px', 
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>Install HOMAI on Your Computer</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
          One command installs everything: Ollama, Qwen AI, and HOMAI.
        </p>
        
        <div style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '1rem', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          color: '#3fb950',
          marginBottom: '1rem'
        }}>
          bash &lt;(curl -fsSL https://raw.githubusercontent.com/CryptoAscend/homai-ai/main/install_homai.sh)
        </div>
        
        <button 
          onClick={copyInstall}
          style={{
            background: copied ? '#238636' : 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Install Command'}
        </button>
      </div>

      <div style={{ 
        background: 'rgba(22,27,34,0.8)', 
        border: '1px solid rgba(139,148,158,0.15)', 
        borderRadius: '16px', 
        padding: '2rem'
      }}>
        <h3 style={{ color: '#e6edf3', marginTop: 0 }}>Manual Install</h3>
        
        <pre style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '1rem', 
          borderRadius: '8px',
          color: '#8b949e',
          fontSize: '0.85rem',
          overflow: 'auto'
        }}>
{`# 1. Install Ollama + Qwen
brew install ollama
ollama pull qwen2.5:7b

# 2. Clone and run HOMAI
git clone https://github.com/CryptoAscend/homai-ai
cd homai-ai/ui
npm install
npm start`}
        </pre>
      </div>

      <div style={{ 
        background: 'rgba(22,27,34,0.8)', 
        border: '1px solid rgba(139,148,158,0.15)', 
        borderRadius: '16px', 
        padding: '2rem',
        marginTop: '1.5rem'
      }}>
        <h3 style={{ color: '#e6edf3' }}>⚠️ Requirements</h3>
        <ul style={{ color: '#8b949e', lineHeight: '1.8' }}>
          <li>Mac with Apple Silicon (M1/M2/M3) or Intel</li>
          <li>16GB+ RAM recommended</li>
          <li>Homebrew installed</li>
          <li>Internet connection for download</li>
        </ul>
      </div>
    </div>
  );
}
