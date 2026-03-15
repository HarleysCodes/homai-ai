# HOMAI - AI Real Estate Operating System

A local-first AI system for real estate professionals. HOMAI leverages Qwen GGUF for local inference with Claude as a cloud fallback, providing property analysis, market reports, automated workflows, and intelligent client interactions.

## 🎯 Features

- **Property Analysis** - AI-powered analysis of property listings, photos, and documents
- **Market Reports** - Generate comprehensive market reports with local insights
- **Workflow Automation** - Automate repetitive real estate tasks
- **Vector Search** - Semantic search across property listings and documents
- **Email Automation** - Intelligent email responses to client inquiries
- **AI Chat** - Natural language interface for real estate operations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│                    http://localhost:3000                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                        │
│                    http://localhost:8000                    │
└─────────────────────────────────────────────────────────────┘
           │              │            │            │
           ▼              ▼            ▼            ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │   Qwen   │  │  Claude  │  │ VectorDB │  │ Postgres │
    │  (GGUF)  │  │ (Cloud)  │  │ (Qdrant) │  │          │
    └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## 📁 Project Structure

```
homai/
├── core/           # Core business logic and utilities
├── agents/         # AI agent implementations
├── workflows/      # Automation workflow scripts
├── models/         # ML models and embeddings
├── data/           # Data storage and processing
├── vector_db/      # Vector database configurations
├── ui/             # React frontend application
├── api/            # FastAPI backend
├── install/        # Installation scripts
└── docker/        # Docker configurations
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- 16GB+ RAM (for local inference)

### Installation

```bash
# Clone and install
cd ~/Desktop/homai
./install/install_homai.sh

# Or manually with Docker
docker-compose up -d
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze_property` | POST | Analyze a property listing |
| `/generate_market_report` | POST | Generate market analysis report |
| `/run_workflow` | POST | Execute an automation workflow |
| `/email_response` | POST | Generate email response |
| `/ai_chat` | POST | Chat with AI assistant |
| `/system_status` | GET | Check system health |

## 🧠 AI Inference

### Local (Primary)
- **Model**: Qwen 2.5 GGUF (qwen2.5-7b-instruct-q4_0.gguf)
- **Runtime**: llama.cpp
- **VRAM**: ~4GB

### Cloud Fallback
- **Provider**: Anthropic Claude
- **Use case**: Complex reasoning, fallback when local unavailable

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | React UI |
| backend | 8000 | FastAPI |
| qwen | 8080 | llama.cpp server |
| qdrant | 6333 | Vector database |
| postgres | 5432 | PostgreSQL |
| openclaw | 8899 | OpenClaw gateway |

## 📝 License

MIT License
