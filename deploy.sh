#!/bin/bash

echo "🚀 Deploying Cafe Management System to Vercel..."
echo ""
echo "Step 1: Login to Vercel (if not already logged in)"
npx vercel login

echo ""
echo "Step 2: Deploying to Vercel..."
npx vercel --prod

echo ""
echo "✅ Deployment complete! Your app URL will be shown above."
echo ""
echo "📝 Note: Make sure to save your deployment URL!"

