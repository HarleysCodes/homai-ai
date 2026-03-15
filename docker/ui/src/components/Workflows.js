import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const WORKFLOWS = [
  { id: 'new_listing', name: 'New Listing', description: 'Process and publish a new property listing' },
  { id: 'lead_followup', name: 'Lead Follow-up', description: 'Follow up with leads after initial contact' },
  { id: 'market_analysis', name: 'Market Analysis', description: 'Run comprehensive market analysis' },
  { id: 'document_prep', name: 'Document Prep', description: 'Prepare documents for closing' },
  { id: 'client_onboarding', name: 'Client Onboarding', description: 'Onboard new client' }
];

function Workflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [parameters, setParameters] = useState('{}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWorkflow) return;
    
    setLoading(true);
    try {
      let params = {};
      try {
        params = JSON.parse(parameters);
      } catch {
        params = {};
      }
      
      const response = await axios.post(`${API_URL}/run_workflow`, {
        workflow_name: selectedWorkflow,
        parameters: params
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>⚙️ Workflow Automation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Workflow</label>
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            required
          >
            <option value="">Choose a workflow...</option>
            {WORKFLOWS.map(wf => (
              <option key={wf.id} value={wf.id}>{wf.name} - {wf.description}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Parameters (JSON)</label>
          <textarea
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            placeholder='{"key": "value"}'
            rows={4}
          />
        </div>
        
        <button type="submit" className="btn" disabled={loading || !selectedWorkflow}>
          {loading ? 'Running...' : 'Run Workflow'}
        </button>
      </form>
      
      {result && (
        <div className="result">
          {result.error ? (
            <div style={{ color: '#ff4444' }}>Error: {result.error}</div>
          ) : (
            `Workflow: ${result.workflow}\nStatus: ${result.status}\nTimestamp: ${result.timestamp}`
          )}
        </div>
      )}
    </div>
  );
}

export default Workflows;
