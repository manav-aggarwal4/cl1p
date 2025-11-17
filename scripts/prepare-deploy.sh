#!/bin/bash
# Script to prepare for Vercel deployment
# This switches Prisma schema from SQLite to PostgreSQL

echo "Preparing for Vercel deployment..."

# Backup current schema
cp prisma/schema.prisma prisma/schema.sqlite.backup

# Update schema to use PostgreSQL
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "✅ Schema updated to PostgreSQL"
echo "📝 Original schema backed up to prisma/schema.sqlite.backup"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Import to Vercel"
echo "3. Set environment variables (DATABASE_URL, BLOB_READ_WRITE_TOKEN)"
echo "4. Deploy!"
echo ""
echo "To revert for local dev:"
echo "  cp prisma/schema.sqlite.backup prisma/schema.prisma"

