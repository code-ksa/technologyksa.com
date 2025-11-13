#!/bin/bash

echo "========================================"
echo "Technology KSA - Starting System (WSL)"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed!${NC}"
    echo "Install with: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version: $(node --version)"

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Kill any existing processes on ports 3001 and 8080
echo "Checking for existing processes..."
pkill -f "publisher-api.js" 2>/dev/null
pkill -f "http-server.*8080" 2>/dev/null
fuser -k 3001/tcp 2>/dev/null
fuser -k 8080/tcp 2>/dev/null
sleep 2

echo ""
echo "========================================"
echo "Starting Services..."
echo "========================================"
echo ""

# Start Publisher API in background
echo -e "${YELLOW}Starting Publisher API on port 3001...${NC}"
node publisher-api.js > /tmp/publisher-api.log 2>&1 &
PUBLISHER_PID=$!
echo -e "${GREEN}✓${NC} Publisher API started (PID: $PUBLISHER_PID)"

# Wait for API to start
sleep 3

# Test API
echo -e "${YELLOW}Testing Publisher API...${NC}"
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Publisher API is responding"
else
    echo -e "${RED}✗${NC} Publisher API is not responding"
    echo "Check log: tail /tmp/publisher-api.log"
fi

echo ""

# Start HTTP Server in background
echo -e "${YELLOW}Starting HTTP Server on port 8080...${NC}"
npx http-server ./dist -p 8080 -s > /tmp/http-server.log 2>&1 &
HTTP_PID=$!
echo -e "${GREEN}✓${NC} HTTP Server started (PID: $HTTP_PID)"

# Wait for server to start
sleep 2

echo ""
echo "========================================"
echo "System Started Successfully!"
echo "========================================"
echo ""
echo -e "${GREEN}Publisher API:${NC} http://localhost:3001"
echo -e "${GREEN}Admin Panel:${NC}    http://127.0.0.1:8080/admin/"
echo -e "${GREEN}Website:${NC}        http://127.0.0.1:8080/"
echo ""
echo -e "${YELLOW}IMPORTANT:${NC} Keep this terminal open!"
echo ""
echo "PIDs: Publisher=$PUBLISHER_PID, HTTP=$HTTP_PID"
echo ""
echo "To stop: pkill -f publisher-api.js && pkill -f http-server"
echo ""
echo "Opening admin panel in browser..."
echo "URL: http://127.0.0.1:8080/admin/index.html"
echo ""

# Try to open in Windows browser from WSL
if command -v cmd.exe &> /dev/null; then
    cmd.exe /c start http://127.0.0.1:8080/admin/index.html 2>/dev/null
fi

echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running and show logs
tail -f /tmp/publisher-api.log /tmp/http-server.log
