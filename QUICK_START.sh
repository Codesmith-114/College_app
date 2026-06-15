#!/bin/bash
# QUICK_START.sh - One-command setup for College Portal

echo "🎓 College Portal - Quick Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your MongoDB Atlas connection string"
    echo "   Open .env and replace MONGODB_URI with your actual connection string"
    echo ""
    echo "   Steps:"
    echo "   1. Go to https://www.mongodb.com/cloud/atlas"
    echo "   2. Create a free cluster"
    echo "   3. Get your connection string"
    echo "   4. Add it to .env as MONGODB_URI"
    echo ""
    read -p "Press Enter after updating .env..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Update MongoDB connection in .env file"
echo "   2. Run: npm run seed (to add sample data)"
echo "   3. Run: npm run dev (to start server)"
echo ""
echo "📊 Server will run on: http://localhost:5000"
echo "📖 API Documentation: http://localhost:5000/api/health"
