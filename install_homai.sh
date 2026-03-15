#!/bin/bash

# HOMAI One-Click Installer
# Run this script to install everything: HOMAI + Ollama + Qwen

set -e

echo "🏠 Installing HOMAI - AI Real Estate Operating System"
echo "=================================================="

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Install it first: https://brew.sh"
    exit 1
fi

# Install Ollama
echo "📦 Installing Ollama..."
brew install ollama

# Download Qwen model
echo "🤖 Downloading Qwen 7B AI model (this may take a few minutes)..."
ollama pull qwen2.5:7b

# Clone or check HOMAI
echo "📁 Setting up HOMAI..."
if [ ! -d "$HOME/homai" ]; then
    cd $HOME
    git clone https://github.com/HarleysCodes/homai-ai.git 2>/dev/null || mkdir -p homai
fi

cd $HOME/homai

# Install Node.js dependencies
if [ -d "ui" ]; then
    cd ui
    npm install
    cd ..
fi

# Install Python dependencies
if [ -d "api" ]; then
    pip3 install fastapi uvicorn pydantic python-dotenv requests
fi

echo ""
echo "✅ Installation Complete!"
echo "======================="
echo ""
echo "To start HOMAI:"
echo "  1. Start the backend:"
echo "     cd ~/homai/api && python3 main.py"
echo ""
echo "  2. Start the UI (in a new terminal):"
echo "     cd ~/homai/ui && npm start"
echo ""
echo "  3. Open http://localhost:3000"
echo ""
echo "For help: https://github.com/your-repo/homai"
