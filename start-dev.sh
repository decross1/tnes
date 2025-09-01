#!/bin/bash

# D&D Solo Adventure App - Development Startup Script
echo "🚀 Starting TNES Development Environment..."
echo ""

# Start backend proxy server in background
echo "📡 Starting backend proxy server..."
cd server
source ~/.nvm/nvm.sh && nvm use 22 && npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend development server
echo "🎮 Starting frontend development server..."
source ~/.nvm/nvm.sh && nvm use 22 && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping development servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait