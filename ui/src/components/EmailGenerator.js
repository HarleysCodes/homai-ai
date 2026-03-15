import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const INQUIRY_TYPES = [
  'property_question',
  'scheduling_showing',
  'offer_inquiry',
  'closing_question',
  'general_inquiry'
];

function EmailGenerator() {
  const [formData, setFormData] = useState({
    inquiry_type: 'property_question',
    client_name: '',
    property_address: '',
    message: '',
    tone: 'professional'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/email_response`, formData);
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>✉️ Email Response Generator</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Inquiry Type</label>
            <select
              value={formData.inquiry_type}
              onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
            >
              {INQUIRY_TYPES.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Tone</label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Property Address</label>
          <input
            type="text"
            value={formData.property_address}
            onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
            placeholder="123 Main St, Austin, TX"
          />
        </div>
        
        <div className="form-group">
          <label>Client Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="What the client said..."
            rows={4}
          />
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Email'}
        </button>
      </form>
      
      {result && (
        <div className="result">
          {result.error ? (
            <div style={{ color: '#ff4444' }}>Error: {result.error}</div>
          ) : (
            result.email
          )}
        </div>
      )}
    </div>
  );
}

export default EmailGenerator;
