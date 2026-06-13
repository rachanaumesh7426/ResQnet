#!/bin/bash
echo "=================================="
echo " ResQNet - Disaster Mgmt System"
echo "=================================="
echo ""
echo "Installing backend dependencies..."
cd backend && npm install
echo ""
echo "Installing frontend dependencies..."
cd ../frontend && npm install
cd ..
echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the app:"
echo "  Terminal 1: cd backend  && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Open: http://localhost:5173"
