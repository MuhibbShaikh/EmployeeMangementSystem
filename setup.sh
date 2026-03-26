#!/bin/bash

echo "🏢 Employee Management System - Setup Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python and Node.js are installed${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Setup Frontend
cd ../frontend
echo -e "${BLUE}📦 Setting up Frontend...${NC}"

# Install dependencies
echo "Installing npm dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Instructions
echo "=============================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo -e "${BLUE}Backend:${NC}"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  uvicorn main:app --reload"
echo ""
echo -e "${BLUE}Frontend:${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo -e "${BLUE}Default Admin Login:${NC}"
echo "  Email: admin@company.com"
echo "  Password: admin123"
echo ""
