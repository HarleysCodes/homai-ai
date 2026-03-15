"""
New Listing Workflow
Process and publish a new property listing with AI assistance
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Any
from api.main import inference


async def run_new_listing_workflow(property_data: Dict[str, Any]) -> Dict[str, Any]:
    """Execute the new listing workflow"""
    
    results = {
        "workflow": "new_listing",
        "started_at": datetime.utcnow().isoformat(),
        "steps": []
    }
    
    # Step 1: Property Analysis
    print("📊 Analyzing property...")
    analysis_prompt = f"""Analyze this property for listing:
{json.dumps(property_data, indent=2)}

Provide: value estimate, key features, target market, pricing strategy."""
    
    analysis = await inference.generate(analysis_prompt)
    results["steps"].append({
        "step": "analysis",
        "status": "completed",
        "result": analysis
    })
    
    # Step 2: Generate Description
    print("✍️ Generating property description...")
    desc_prompt = f"""Write a compelling property description for:
{json.dumps(property_data, indent=2)}

Create marketing copy that highlights unique features."""
    
    description = await inference.generate(desc_prompt)
    results["steps"].append({
        "step": "description",
        "status": "completed",
        "result": description
    })
    
    # Step 3: Price Recommendation
    print("💰 Generating price recommendation...")
    price_prompt = f"""Recommend a listing price for:
{json.dumps(property_data, indent=2)}

Consider: comparable sales, market conditions, property features."""
    
    pricing = await inference.generate(price_prompt)
    results["steps"].append({
        "step": "pricing",
        "status": "completed",
        "result": pricing
    })
    
    results["completed_at"] = datetime.utcnow().isoformat()
    results["status"] = "success"
    
    return results


if __name__ == "__main__":
    sample_property = {
        "address": "123 Main St, Austin, TX 78701",
        "price": 450000,
        "sqft": 2200,
        "beds": 4,
        "baths": 2.5,
        "year_built": 2015,
        "property_type": "single_family"
    }
    
    result = asyncio.run(run_new_listing_workflow(sample_property))
    print(json.dumps(result, indent=2))
