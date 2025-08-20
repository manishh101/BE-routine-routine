#!/bin/bash
# Post-Deployment Testing Script

echo "🧪 Post-Deployment Testing & Verification"
echo "=========================================="

# Replace these URLs with your actual deployment URLs
BACKEND_URL="https://your-backend-url.onrender.com"
FRONTEND_URL="https://your-frontend-url.vercel.app"

echo "🔍 Testing Backend Health Check..."
if curl -s "$BACKEND_URL/api/health" | grep -q "healthy"; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

echo "🔍 Testing Backend API Documentation..."
if curl -s "$BACKEND_URL/api-docs" | grep -q "swagger"; then
    echo "✅ API documentation accessible"
else
    echo "❌ API documentation not accessible"
fi

echo "🔍 Testing Frontend..."
if curl -s "$FRONTEND_URL" | grep -q "html"; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

echo ""
echo "📋 Manual Testing Checklist:"
echo "1. Open $FRONTEND_URL in browser"
echo "2. Try to login with test credentials"
echo "3. Check browser console for errors"
echo "4. Verify API calls are working"
echo "5. Test core functionality (creating routines, etc.)"
echo ""
echo "🔗 Important URLs:"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo "API Docs: $BACKEND_URL/api-docs"
echo "Health Check: $BACKEND_URL/api/health"
