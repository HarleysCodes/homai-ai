import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function PropertyAnalysis() {
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    sqft: '',
    beds: '',
    baths: '',
    year_built: '',
    property_type: 'single_family',
    description: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze_property`, {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        sqft: formData.sqft ? parseInt(formData.sqft) : null,
        beds: formData.beds ? parseInt(formData.beds) : null,
        baths: formData.baths ? parseFloat(formData.baths) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="card">
      <h2>🏠 Property Analysis</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, Austin, TX 78701"
            required
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="450000"
            />
          </div>
          
          <div className="form-group">
            <label>Sq Ft</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              placeholder="2200"
            />
          </div>
          
          <div className="form-group">
            <label>Year Built</label>
            <input
              type="number"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              placeholder="2015"
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Bedrooms</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              placeholder="4"
            />
          </div>
          
          <div className="form-group">
            <label>Bathrooms</label>
            <input
              type="number"
              name="baths"
              step="0.5"
              value={formData.baths}
              onChange={handleChange}
              placeholder="2.5"
            />
          </div>
          
          <div className="form-group">
            <label>Property Type</label>
            <select name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="single_family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi_family">Multi-Family</option>
              <option value="land">Land</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional property details..."
            rows={3}
          />
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Property'}
        </button>
      </form>
      
      {result && (
        <div className="result">
          {result.error ? (
            <div style={{ color: '#ff4444' }}>Error: {result.error}</div>
          ) : (
            result.analysis
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyAnalysis;
