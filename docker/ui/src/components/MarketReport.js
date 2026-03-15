import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function MarketReport() {
  const [formData, setFormData] = useState({
    location: '',
    property_type: 'single_family',
    timeframe_months: 6,
    include_comps: true
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/generate_market_report`, formData);
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>📊 Market Report Generator</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Austin, TX"
            required
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Property Type</label>
            <select
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
            >
              <option value="single_family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi_family">Multi-Family</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Timeframe (months)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.timeframe_months}
              onChange={(e) => setFormData({ ...formData, timeframe_months: parseInt(e.target.value) })}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.include_comps}
              onChange={(e) => setFormData({ ...formData, include_comps: e.target.checked })}
            />
            Include Comparable Sales
          </label>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </form>
      
      {result && (
        <div className="result">
          {result.error ? (
            <div style={{ color: '#ff4444' }}>Error: {result.error}</div>
          ) : (
            result.report
          )}
        </div>
      )}
    </div>
  );
}

export default MarketReport;
