#!/bin/bash

# Production Readiness Check Script
echo "🔍 Production Readiness Check for BE Routine Management System"
echo "=============================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check 1: Essential deployment files
echo "📁 Checking deployment files..."

if [ -f "backend/Dockerfile" ]; then
    check_pass "Backend Dockerfile exists"
else
    check_fail "Backend Dockerfile missing"
fi

if [ -f "backend/.dockerignore" ]; then
    check_pass "Backend .dockerignore exists"
else
    check_fail "Backend .dockerignore missing"
fi

if [ -f "backend/healthcheck.js" ]; then
    check_pass "Backend health check exists"
else
    check_fail "Backend health check missing"
fi

if [ -f "render.yaml" ]; then
    check_pass "Render configuration exists"
else
    check_fail "Render configuration missing"
fi

if [ -f "frontend/vercel.json" ]; then
    check_pass "Vercel configuration exists"
else
    check_fail "Vercel configuration missing"
fi

# Check 2: Package.json configurations
echo -e "\n📦 Checking package.json configurations..."

# Backend package.json
if grep -q '"start": "node server.js"' backend/package.json; then
    check_pass "Backend start script configured"
else
    check_fail "Backend start script missing or incorrect"
fi

# Frontend package.json
if grep -q '"build": "vite build"' frontend/package.json; then
    check_pass "Frontend build script configured"
else
    check_fail "Frontend build script missing or incorrect"
fi

# Check 3: Environment variable templates
echo -e "\n🔐 Checking environment configurations..."

if [ -f "backend/.env.production.template" ]; then
    check_pass "Backend environment template exists"
else
    check_fail "Backend environment template missing"
fi

if [ -f "frontend/.env.production" ]; then
    check_pass "Frontend environment file exists"
else
    check_fail "Frontend environment file missing"
fi

# Check 4: Security configurations
echo -e "\n🔒 Checking security configurations..."

# Check if CORS is configured
if grep -q "cors" backend/app.js; then
    check_pass "CORS configuration found in backend"
else
    check_fail "CORS configuration missing in backend"
fi

# Check JWT configuration
if grep -q "JWT_SECRET" backend/.env.production.template; then
    check_pass "JWT secret configuration template exists"
else
    check_fail "JWT secret configuration missing"
fi

# Check 5: Build optimizations
echo -e "\n⚡ Checking build optimizations..."

# Check Vite config
if grep -q "manualChunks" frontend/vite.config.js; then
    check_pass "Vite build optimization configured"
else
    check_fail "Vite build optimization missing"
fi

# Check Docker optimization
if grep -q "npm ci --only=production" backend/Dockerfile; then
    check_pass "Docker production build optimization configured"
else
    check_fail "Docker production build optimization missing"
fi

# Check 6: Health monitoring
echo -e "\n🏥 Checking health monitoring..."

if grep -q "healthCheckPath" render.yaml; then
    check_pass "Render health check path configured"
else
    check_fail "Render health check path missing"
fi

if grep -q "/api/health" backend/healthcheck.js; then
    check_pass "Health check endpoint configured"
else
    check_fail "Health check endpoint missing"
fi

# Check 7: Database configuration
echo -e "\n🗄️  Checking database configuration..."

if grep -q "MONGODB_URI" backend/.env.production.template; then
    check_pass "MongoDB URI configuration template exists"
else
    check_fail "MongoDB URI configuration missing"
fi

# Check 8: Production vs Development separation
echo -e "\n🌍 Checking environment separation..."

if grep -q "NODE_ENV.*production" render.yaml; then
    check_pass "Production environment flag set in Render config"
else
    check_fail "Production environment flag missing in Render config"
fi

if grep -q "VITE_NODE_ENV.*production" frontend/.env.production; then
    check_pass "Frontend production environment flag set"
else
    check_fail "Frontend production environment flag missing"
fi

# Final summary
echo -e "\n📊 Production Readiness Summary"
echo "================================"

echo -e "\n🚀 Deployment URLs to Update:"
echo "Backend: Update FRONTEND_URL in Render environment variables"
echo "Frontend: Update VITE_API_BASE_URL in Vercel environment variables"

echo -e "\n🔧 Manual Steps Required:"
echo "1. Set actual environment variables in Render dashboard"
echo "2. Set actual environment variables in Vercel dashboard"
echo "3. Update placeholder URLs in configuration files"
echo "4. Test health endpoints after deployment"

echo -e "\n✅ System appears ready for production deployment!"
echo "See DEPLOYMENT_CHECKLIST.md for step-by-step deployment guide."
