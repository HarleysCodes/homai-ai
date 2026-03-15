"""
HOMAI API - FastAPI Backend for AI Real Estate Operating System
"""

import os
import sqlite3
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

from fastapi import FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="HOMAI API",
    description="AI Real Estate Operating System API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Models ============

class PropertyAnalysisRequest(BaseModel):
    address: str
    price: Optional[float] = None
    sqft: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[float] = None
    year_built: Optional[int] = None
    property_type: Optional[str] = None
    description: Optional[str] = None


class MarketReportRequest(BaseModel):
    location: str
    property_type: Optional[str] = "single_family"
    timeframe_months: int = Field(default=6, ge=1, le=24)
    include_comps: bool = True


class WorkflowRequest(BaseModel):
    workflow_name: str
    parameters: Dict[str, Any] = {}


class EmailRequest(BaseModel):
    inquiry_type: str
    client_name: str
    property_address: Optional[str] = None
    message: Optional[str] = None
    tone: str = "professional"


class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, str]]] = []


# Properties endpoint
@app.get("/api/properties")
async def get_properties():
    """Get all properties from database"""
    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "properties.db")
    if not os.path.exists(db_path):
        return JSONResponse({"properties": [], "total": 0})
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties")
    rows = cursor.fetchall()
    conn.close()
    
    properties = [dict(row) for row in rows]
    return {"properties": properties, "total": len(properties)}


@app.get("/api/properties/{property_id}")
async def get_property(property_id: int):
    """Get a single property by ID"""
    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "properties.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Property not found")
    return dict(row)


@app.get("/api/properties/stats/summary")
async def get_property_stats():
    """Get summary statistics for properties"""
    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "properties.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM properties")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(price) FROM properties")
    avg_price = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT AVG(rent_estimate) FROM properties")
    avg_rent = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT AVG(sqft) FROM properties")
    avg_sqft = cursor.fetchone()[0] or 0
    
    conn.close()
    
    return {
        "total_properties": total,
        "average_price": round(avg_price, 0),
        "average_rent": round(avg_rent, 0),
        "average_sqft": round(avg_sqft, 0)
    }


# ============ Utilities ============

class InferenceService:
    """Handles AI inference with local Qwen and cloud Claude fallback"""
    
    def __init__(self):
        self.qwen_url = os.getenv("QWEN_URL", "http://localhost:11434")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
        self.use_claude = bool(os.getenv("ANTHROPIC_API_KEY"))
    
    async def generate(self, prompt: str, use_local: bool = True) -> str:
        """Generate text using Qwen (local) or Claude (cloud fallback)"""
        if use_local:
            try:
                return await self._qwen_generate(prompt)
            except Exception as e:
                print(f"Qwen failed, trying Claude: {e}")
                if self.use_claude:
                    return await self._claude_generate(prompt)
                raise HTTPException(status_code=503, detail="Local inference unavailable")
        elif self.use_claude:
            return await self._claude_generate(prompt)
        raise HTTPException(status_code=503, detail="Cloud inference unavailable")
    
    async def _qwen_generate(self, prompt: str) -> str:
        """Call local Qwen via Ollama"""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            payload = {
                "model": self.ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 1024
                }
            }
            async with session.post(f"{self.qwen_url}/api/generate", json=payload) as resp:
                if resp.status != 200:
                    raise Exception(f"Ollama returned {resp.status}")
                data = await resp.json()
                return data.get("response", "")
    
    async def _claude_generate(self, prompt: str) -> str:
        """Call Claude API as fallback"""
        import aiohttp
        api_key = os.getenv("ANTHROPIC_API_KEY")
        async with aiohttp.ClientSession() as session:
            headers = {
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            payload = {
                "model": "claude-3-haiku-20240307",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": prompt}]
            }
            async with session.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload
            ) as resp:
                if resp.status != 200:
                    raise Exception(f"Claude returned {resp.status}")
                data = await resp.json()
                return data.get("content", [{}])[0].get("text", "")


# Initialize services
inference = InferenceService()


# ============ Endpoints ============

@app.get("/")
async def root():
    return {"message": "HOMAI API - AI Real Estate Operating System"}


@app.get("/system_status")
async def system_status():
    """Check system health and service availability"""
    import aiohttp
    
    status_info = {
        "timestamp": datetime.utcnow().isoformat(),
        "services": {},
        "overall": "healthy"
    }
    
    # Check Qwen
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8080/health", timeout=2) as resp:
                status_info["services"]["qwen"] = "online" if resp.status == 200 else "degraded"
    except:
        status_info["services"]["qwen"] = "offline"
    
    # Check PostgreSQL (mock for now)
    status_info["services"]["postgres"] = "online"
    
    # Check Qdrant (mock for now)
    status_info["services"]["qdrant"] = "online"
    
    # Check Claude availability
    if os.getenv("ANTHROPIC_API_KEY"):
        status_info["services"]["claude"] = "available"
    else:
        status_info["services"]["claude"] = "not_configured"
    
    return status_info


@app.post("/analyze_property")
async def analyze_property(request: PropertyAnalysisRequest):
    """Analyze a property and provide insights"""
    
    prompt = f"""As a real estate expert, analyze this property:

Address: {request.address}
Price: ${request.price or 'Not specified'}
Size: {request.sqft or 'Not specified'} sq ft
Bedrooms: {request.beds or 'Not specified'}
Bathrooms: {request.baths or 'Not specified'}
Year Built: {request.year_built or 'Not specified'}
Property Type: {request.property_type or 'Not specified'}
Description: {request.description or 'Not specified'}

Provide a detailed analysis including:
1. Value assessment
2. Key strengths
3. Potential concerns
4. Recommended improvements
5. Target buyer profile
"""
    
    try:
        analysis = await inference.generate(prompt)
        return {
            "success": True,
            "property": request.dict(),
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate_market_report")
async def generate_market_report(request: MarketReportRequest):
    """Generate a comprehensive market report"""
    
    prompt = f"""Generate a real estate market report for:

Location: {request.location}
Property Type: {request.property_type}
Timeframe: Last {request.timeframe_months} months
Include Comparables: {request.include_comps}

Provide:
1. Market overview and trends
2. Average price analysis
3. Days on market insights
4. Supply and demand dynamics
5. Price predictions for next 6 months
6. Investment opportunities
"""
    
    try:
        report = await inference.generate(prompt)
        return {
            "success": True,
            "location": request.location,
            "report": report,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/run_workflow")
async def run_workflow(request: WorkflowRequest):
    """Execute an automation workflow"""
    
    workflows = {
        "new_listing": "Process and publish a new property listing",
        "lead_followup": "Follow up with leads after initial contact",
        "market_analysis": "Run comprehensive market analysis",
        "document_prep": "Prepare documents for closing",
        "client_onboarding": "Onboard new client"
    }
    
    if request.workflow_name not in workflows:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown workflow. Available: {list(workflows.keys())}"
        )
    
    # Simulate workflow execution
    return {
        "success": True,
        "workflow": request.workflow_name,
        "description": workflows[request.workflow_name],
        "parameters": request.parameters,
        "status": "completed",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/email_response")
async def email_response(request: EmailRequest):
    """Generate an intelligent email response"""
    
    prompt = f"""Write a {request.tone} email response for a real estate client.

Client Name: {request.client_name}
Inquiry Type: {request.inquiry_type}
Property: {request.property_address or 'Not specified'}
Client Message: {request.message or 'N/A'}

The email should:
- Be professional and personalized
- Address their specific inquiry
- Include appropriate next steps
- Be concise but comprehensive
"""
    
    try:
        email = await inference.generate(prompt)
        return {
            "success": True,
            "client_name": request.client_name,
            "inquiry_type": request.inquiry_type,
            "email": email,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai_chat")
async def ai_chat(request: ChatMessage):
    """Chat with the AI assistant"""
    
    # Build conversation context
    conversation = ""
    if request.history:
        for msg in request.history[-5:]:  # Last 5 messages
            role = msg.get("role", "user")
            content = msg.get("content", "")
            conversation += f"{role.capitalize()}: {content}\n"
    
    conversation += f"User: {request.message}\nAssistant:"
    
    try:
        response = await inference.generate(conversation)
        return {
            "success": True,
            "message": request.message,
            "response": response,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Upload endpoint
@app.post("/upload_properties")
async def upload_properties(file: UploadFile = File(...)):
    """Upload and parse property data"""
    try:
        contents = await file.read()
        filename = file.filename.lower()
        
        properties = []
        
        if filename.endswith('.csv'):
            import io
            import csv
            reader = csv.reader(io.StringIO(contents.decode('utf-8')))
            header = next(reader)
            for row in reader:
                prop = {header[i]: row[i] if i < len(row) else '' for i in range(len(header))}
                properties.append(prop)
        elif filename.endswith(('.xlsx', '.xls')):
            return {"error": "Excel support coming soon - use CSV for now"}
        
        # Analyze with Qwen
        from api.main import inference
        prompt = f"Analyze these {len(properties)} properties and provide insights: {json.dumps(properties[:5])}"
        analysis = await inference.generate(prompt)
        
        return {
            "success": True,
            "properties_count": len(properties),
            "preview": properties[:3],
            "analysis": analysis
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/run_workflow_simple")
async def run_workflow_simple(request: dict):
    """Simple workflow endpoint"""
    workflow = request.get('workflow', '')
    location = request.get('location', '')
    
    if workflow == 'market_analysis':
        prompt = f"Provide a real estate market analysis for {location}. Include: median price, inventory, days on market, trends."
        return {"success": True, "result": f"Market analysis for {location}: Median prices are rising, inventory is low, market is competitive."}
    elif workflow == 'lead_followup':
        return {"success": True, "result": "Lead follow-up email drafted."}
    elif workflow == 'new_listing':
        return {"success": True, "result": "New listing workflow completed."}
    return {"success": False, "error": "Unknown workflow"}
