#!/bin/bash

# HOMAI Installation Script
# AI Real Estate Operating System

set -e

echo "🏠 HOMAI Installation"
echo "===================="

# Check prerequisites
echo "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create necessary directories
echo "Creating directory structure..."
mkdir -p ~/Desktop/homai/{core,agents,workflows,models,data,vector_db,ui,api,install,docker}

# Check for .env file
if [ ! -f ~/Desktop/homai/.env ]; then
    echo "Creating .env file..."
    cat > ~/Desktop/homai/.env << 'EOF'
# HOMAI Environment Variables

# Anthropic API Key (optional - for Claude fallback)
# ANTHROPIC_API_KEY=sk-ant-...

# Database
POSTGRES_DB=homai
POSTGRES_USER=homai_user
POSTGRES_PASSWORD=homai_pass

# Qwen Model (will be downloaded on first run)
QWEN_MODEL=qwen2.5-7b-instruct-q4_0.gguf
EOF
    echo "✅ Created .env file"
fi

# Download Qwen model (if not present)
MODEL_DIR=~/Desktop/homai/models
MODEL_FILE=$MODEL_DIR/qwen2.5-7b-instruct-q4_0.gguf

if [ ! -f "$MODEL_FILE" ]; then
    echo "Downloading Qwen GGUF model (this may take a while)..."
    mkdir -p $MODEL_DIR
    # Using HuggingFace or a mirror
    wget -O "$MODEL_FILE" "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_0.gguf" \
        || echo "⚠️ Model download failed. You can download manually to $MODEL_FILE"
else
    echo "✅ Qwen model already present"
fi

# Build and start containers
echo "Building Docker containers..."
cd ~/Desktop/homai/docker

if docker compose version &> /dev/null; then
    docker compose build
    echo "Starting HOMAI services..."
    docker compose up -d
else
    docker-compose build
    echo "Starting HOMAI services..."
    docker-compose up -d
fi

echo ""
echo "🎉 HOMAI Installation Complete!"
echo ""
echo "Services:"
echo "  - Frontend:   http://localhost:3000"
echo "  - Backend:    http://localhost:8000"
echo "  - API Docs:   http://localhost:8000/docs"
echo "  - Vector DB:  http://localhost:6333"
echo "  - Database:   localhost:5432"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop:      docker compose down"
