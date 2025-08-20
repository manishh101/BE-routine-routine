#!/bin/bash
# Fix GitHub Repository Association Script

echo "🔧 Fixing GitHub Repository Association"
echo "======================================"

echo "Current git remote configuration:"
git remote -v

echo ""
echo "Expected repository URL: https://github.com/manishh101/BE-routine.git"
echo ""

read -p "Is the repository URL correct? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "Updating git remote URL..."
    git remote set-url origin https://github.com/manishh101/BE-routine.git
    echo "✅ Git remote URL updated"
    
    echo "New git remote configuration:"
    git remote -v
fi

echo ""
echo "📋 Next steps for Vercel:"
echo "1. Go to Vercel dashboard"
echo "2. Delete current deployment if needed"
echo "3. Re-import from https://github.com/manishh101/BE-routine"
echo "4. Ensure you're logged in with manishh101 GitHub account"
