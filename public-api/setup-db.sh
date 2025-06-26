#!/bin/bash

# TodoApp Generator Public API Database Setup Script
# This script initializes the database with all required resources

echo "🚀 TodoApp Generator Public API Database Setup"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the public-api directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "🗃️ Running database migrations..."
npm run prisma:migrate

# Seed the database
echo "🌱 Seeding database with resources..."
npm run db:seed

# Check the results
echo "📊 Checking database status..."
npm run db:manage check

echo ""
echo "✅ Database setup completed successfully!"
echo ""
echo "🎯 Your public API is now ready to use!"
echo "   - Run 'npm run dev' to start the development server"
echo "   - Visit http://localhost:3001/api-docs for API documentation"
echo "   - Use 'npm run db:manage status' to check database status anytime"
