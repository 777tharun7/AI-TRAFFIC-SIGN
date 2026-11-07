#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=================================================="
echo "🚦 Starting RoadSense AI Simulation Platform"
echo "=================================================="

export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"

# 1. Check Python Venv
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
fi

# 2. Check Trained Model
if [ ! -f "models/traffic_sign_v1.pt" ]; then
    echo "Generating dataset and training AI vision model..."
    ./venv/bin/python3 -m ml.datasets.synthetic_generator
    ./venv/bin/python3 -m ml.training.train
fi

# 3. Start Backend in background
echo "Starting FastAPI Backend Server on http://localhost:8000..."
./venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 4. Start Frontend
echo "Starting Vite Frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo "=================================================="
echo "✓ RoadSense AI Platform is RUNNING:"
echo "   - Web App UI:        http://localhost:5173"
echo "   - Backend API Docs:  http://localhost:8000/docs"
echo "   - WebSockets:        ws://localhost:8000/ws/vehicle/VEH-HYD-001"
echo "=================================================="
echo "Press Ctrl+C to terminate all services."

wait
