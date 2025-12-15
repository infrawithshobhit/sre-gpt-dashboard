#!/bin/bash

echo "🚀 SRE GPT - Starting Application..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not available"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
fi

# Setup .env file
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from template"
        echo
        echo "⚠️  IMPORTANT: Please edit .env file with your Dynatrace credentials"
        echo "Required variables:"
        echo "  - DYNATRACE_URL=https://your-environment.live.dynatrace.com"
        echo "  - DYNATRACE_API_TOKEN=your-api-token-here"
        echo
        read -p "Press Enter to continue after editing .env file..."
    else
        echo "❌ Error: .env.example not found"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Create required directories
mkdir -p logs config
echo "✅ Created required directories"

echo
echo "🎯 Starting SRE GPT application..."
echo "📊 Dashboard will be available at: http://localhost:3000"
echo "🔧 Setup guide: http://localhost:3000/api/setup/status"
echo "🔗 Webhook config: http://localhost:3000/api/setup/webhook-config"
echo
echo "Press Ctrl+C to stop the application"
echo

# Start the application
npm run dev