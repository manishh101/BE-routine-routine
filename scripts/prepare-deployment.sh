#!/bin/bash

# BE Routine Deployment Preparation Script
# This script helps prepare the project for deployment

echo "🚀 BE Routine Management System - Deployment Preparation"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Starting deployment preparation..."

# Check Node.js version
NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"

# Check if required files exist
print_info "Checking deployment files..."

# Backend files
if [ -f "backend/Dockerfile" ]; then
    print_status "Backend Dockerfile exists"
else
    print_error "Backend Dockerfile missing"
fi

if [ -f "backend/healthcheck.js" ]; then
    print_status "Backend health check file exists"
else
    print_error "Backend health check file missing"
fi

if [ -f "render.yaml" ]; then
    print_status "Render configuration exists"
else
    print_error "Render configuration missing"
fi

# Frontend files
if [ -f "frontend/vercel.json" ]; then
    print_status "Vercel configuration exists"
else
    print_error "Vercel configuration missing"
fi

if [ -f "frontend/.env.production" ]; then
    print_status "Frontend production environment file exists"
else
    print_error "Frontend production environment file missing"
fi

# Check dependencies
print_info "Checking dependencies..."

cd backend
if npm list --depth=0 > /dev/null 2>&1; then
    print_status "Backend dependencies are installed"
else
    print_warning "Backend dependencies may have issues"
fi

cd ../frontend
if npm list --depth=0 > /dev/null 2>&1; then
    print_status "Frontend dependencies are installed"
else
    print_warning "Frontend dependencies may have issues"
fi

cd ..

# Test build processes
print_info "Testing build processes..."

cd frontend
print_info "Building frontend..."
if npm run build > /dev/null 2>&1; then
    print_status "Frontend builds successfully"
else
    print_error "Frontend build failed"
fi

cd ..

# Check environment variables
print_info "Checking environment variables..."

if [ -f ".env" ]; then
    print_warning "Root .env file exists - make sure it's not committed to git"
fi

if [ -f "backend/.env" ]; then
    print_warning "Backend .env file exists - make sure it's not committed to git"
fi

# Git status check
print_info "Checking git status..."

if git status --porcelain | grep -q .; then
    print_warning "You have uncommitted changes. Consider committing before deployment."
else
    print_status "Working directory is clean"
fi

# Final instructions
echo ""
print_info "Deployment Checklist:"
echo "========================"
echo "1. 📝 Update URLs in deployment files:"
echo "   - frontend/vercel.json: Update backend URL"
echo "   - frontend/.env.production: Update VITE_API_BASE_URL"
echo ""
echo "2. 🔐 Set up environment variables:"
echo "   - Render: Set NODE_ENV, MONGODB_URI, JWT_SECRET, FRONTEND_URL"
echo "   - Vercel: Set VITE_API_BASE_URL, VITE_APP_NAME"
echo ""
echo "3. 🚀 Deploy in this order:"
echo "   - Backend first (Render)"
echo "   - Frontend second (Vercel)"
echo "   - Update cross-references"
echo ""
echo "4. 🧪 Test both deployments:"
echo "   - Backend health check"
echo "   - Frontend connectivity"
echo ""

print_status "Deployment preparation complete!"
print_info "See DEPLOYMENT.md for detailed deployment instructions"
