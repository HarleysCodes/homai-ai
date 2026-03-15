"""
Lead Follow-up Workflow
Automated follow-up with leads after initial contact
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List


async def generate_followup_email(lead_data: Dict[str, Any], days_since_contact: int) -> str:
    """Generate personalized follow-up email"""
    
    prompt = f"""Write a follow-up email for a real estate lead.

Lead Name: {lead_data.get('name', 'Valued Client')}
Lead Email: {lead_data.get('email', '')}
Days Since Last Contact: {days_since_contact}
Lead Interest: {lead_data.get('interest', 'general')}
Previous Conversation: {lead_data.get('last_message', 'N/A')}

Guidelines:
- Be warm and professional
- Provide value (market update, new listing, etc.)
- Include clear call-to-action
- Keep it concise
"""
    
    from api.main import inference
    return await inference.generate(prompt)


async def run_lead_followup_workflow(leads: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Execute lead follow-up workflow"""
    
    results = {
        "workflow": "lead_followup",
        "started_at": datetime.utcnow().isoformat(),
        "leads_processed": 0,
        "emails_generated": []
    }
    
    for lead in leads:
        days_since = (datetime.utcnow() - datetime.fromisoformat(
            lead.get('last_contact', datetime.utcnow().isoformat())
        )).days
        
        if days_since >= 3:  # Follow up after 3 days
            email = await generate_followup_email(lead, days_since)
            results["emails_generated"].append({
                "lead_id": lead.get('id'),
                "lead_email": lead.get('email'),
                "email": email,
                "days_since_contact": days_since
            })
            results["leads_processed"] += 1
    
    results["completed_at"] = datetime.utcnow().isoformat()
    results["status"] = "success"
    
    return results


if __name__ == "__main__":
    sample_leads = [
        {
            "id": "lead_001",
            "name": "John Smith",
            "email": "john@example.com",
            "interest": "single_family",
            "last_contact": (datetime.utcnow() - timedelta(days=5)).isoformat(),
            "last_message": "Interested in 3BR homes in Austin"
        }
    ]
    
    result = asyncio.run(run_lead_followup_workflow(sample_leads))
    print(json.dumps(result, indent=2))
