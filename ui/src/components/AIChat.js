import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [claudeKey, setClaudeKey] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('claude_api_key');
    if (key) setClaudeKey(key);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/ai_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          useClaude: !!claudeKey
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response || JSON.stringify(data) }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${error.message}` }]);
    }
    setLoading(false);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
        <div style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          💡 <strong>How to use:</strong>
        </div>
        <div style={{ color: '#6e7681', fontSize: '0.8rem' }}>
          • Enter your Claude API key in <strong>Settings</strong> for best results<br/>
          • Or run HOMAI locally with Qwen AI<br/>
          • Type a message and press Enter to chat
        </div>
        {!claudeKey && (
          <a href="#settings" style={{ color: '#38bdf8', fontSize: '0.85rem', marginTop: '0.5rem', display: 'inline-block' }}>
            → Go to Settings to add your key
          </a>
        )}
      </div>

      <div style={{ 
        background: 'rgba(22,27,34,0.8)', 
        border: '1px solid rgba(139,148,158,0.15)', 
        borderRadius: '16px', 
        padding: '1.5rem',
        minHeight: '400px'
      }}>
        <h2 style={{ marginTop: 0 }}>🤖 AI Chat</h2>
        
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          marginBottom: '1rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px'
        }}>
          {messages.length === 0 && (
            <div style={{ color: '#6e7681', textAlign: 'center' }}>
              Start a conversation...
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: '0.75rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: msg.role === 'user' ? 'rgba(56,189,248,0.15)' : 'rgba(139,148,158,0.1)',
              marginLeft: msg.role === 'user' ? '2rem' : '0',
              marginRight: msg.role === 'ai' ? '2rem' : '0',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '0.25rem' }}>
                {msg.role === 'user' ? 'You' : 'AI'}
              </div>
              <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            </div>
          ))}
          {loading && <div style={{ color: '#8b949e' }}>Thinking...</div>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(139,148,158,0.25)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.9rem'
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.875rem 1.5rem',
              background: loading ? '#666' : 'linear-gradient(135deg, #238636, #2ea043)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
