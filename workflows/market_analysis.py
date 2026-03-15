"""
Market Analysis Workflow
Comprehensive market analysis for a given area
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Any


async def run_market_analysis_workflow(location: str, property_type: str = "single_family") -> Dict[str, Any]:
    """Execute comprehensive market analysis"""
    
    from api.main import inference
    
    results = {
        "workflow": "market_analysis",
        "location": location,
        "property_type": property_type,
        "started_at": datetime.utcnow().isoformat(),
        "analyses": {}
    }
    
    # 1. Current Market Overview
    print(f"📈 Analyzing {location} market...")
    overview_prompt = f"""Provide current real estate market overview for {location}, TX.
Focus on: median price, inventory levels, days on market, trend direction."""
    
    results["analyses"]["overview"] = await inference.generate(overview_prompt)
    
    # 2. Price Trends
    print("📊 Analyzing price trends...")
    trends_prompt = f"""Analyze price trends for {property_type} homes in {location}, TX.
Cover: YoY changes, monthly trends, forecast for next 6 months."""
    
    results["analyses"]["trends"] = await inference.generate(trends_prompt)
    
    # 3. Comparable Analysis
    print("🏠 Finding comparables...")
    comps_prompt = f"""Identify key comparable neighborhoods and price points for 
{property_type} properties in {location}, TX."""
    
    results["analyses"]["comparables"] = await inference.generate(comps_prompt)
    
    # 4. Investment Outlook
    print("💹 Generating investment outlook...")
    investment_prompt = f"""Provide investment outlook for {location}, TX real estate.
Consider: rental yields, appreciation potential, risk factors."""
    
    results["analyses"]["investment"] = await inference.generate(investment_prompt)
    
    # 5. Recommendations
    print("✅ Generating recommendations...")
    rec_prompt = f"""Based on the market analysis for {location}, TX, provide:
1. Best neighborhoods for buyers
2. Best neighborhoods for sellers  
3. Optimal timing recommendations
4. Price negotiation strategies"""
    
    results["analyses"]["recommendations"] = await inference.generate(rec_prompt)
    
    results["completed_at"] = datetime.utcnow().isoformat()
    results["status"] = "success"
    
    return results


if __name__ == "__main__":
    result = asyncio.run(run_market_analysis_workflow("Austin"))
    print(json.dumps(result, indent=2))
