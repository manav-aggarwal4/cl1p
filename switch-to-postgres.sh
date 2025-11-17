#!/bin/bash
# Quick script to switch Prisma schema from SQLite to PostgreSQL for Vercel deployment

echo "🔄 Switching Prisma schema to PostgreSQL..."

# Backup current schema
if [ ! -f "prisma/schema.sqlite.backup" ]; then
  cp prisma/schema.prisma prisma/schema.sqlite.backup
  echo "✅ Backed up SQLite schema"
fi

# Update schema
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
else
  # Linux
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
fi

echo "✅ Schema updated to PostgreSQL"
echo ""
echo "📝 Next steps:"
echo "1. Commit this change: git add prisma/schema.prisma && git commit -m 'Switch to PostgreSQL for production'"
echo "2. Push to GitHub: git push"
echo "3. Follow QUICK_DEPLOY.md for deployment instructions"
echo ""
echo "💡 To switch back to SQLite for local dev:"
echo "   cp prisma/schema.sqlite.backup prisma/schema.prisma"

