import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AIChat() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/ai_chat`, {
        message: userMessage,
        history: history
      });
      setHistory(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>🤖 AI Chat Assistant</h2>
      <div className="chat-container">
        <div className="chat-messages">
          {history.length === 0 ? (
            <p style={{ color: '#666' }}>Ask me anything about real estate...</p>
          ) : (
            history.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'HOMAI'}:</strong> {msg.content}
              </div>
            ))
          )}
          {loading && <div className="chat-message assistant">Thinking...</div>}
        </div>
        
        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button type="submit" className="btn" disabled={loading || !message.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChat;
