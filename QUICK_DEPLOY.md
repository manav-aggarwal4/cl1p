# Quick Deploy to Vercel - Step by Step

Follow these steps to get your cl1p clone live in ~10 minutes!

## 🚀 Quick Start

### 1. Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Name it (e.g., "cl1p-db")
4. Choose **Hobby** (free) plan
5. Select a region
6. Click **Create**
7. Go to **.env.local** tab
8. **Copy the `POSTGRES_PRISMA_URL`** - you'll need this!

### 3. Create Vercel Blob Storage

1. Still in Vercel Dashboard → **Storage**
2. Click **Create Database** → **Blob**
3. Name it (e.g., "cl1p-blob")
4. Click **Create**
5. Go to **Settings** → **Environment Variables**
6. **Copy the `BLOB_READ_WRITE_TOKEN`** - you'll need this!

### 4. Update Prisma Schema for PostgreSQL

**IMPORTANT**: SQLite won't work on Vercel. Update your schema:

```bash
# Edit prisma/schema.prisma and change line 9:
# FROM: provider = "sqlite"
# TO:   provider = "postgresql"
```

Or run:
```bash
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
```

### 5. Deploy to Vercel

**Option A: Via Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click **Import**

**Option B: Via CLI**
```bash
npm i -g vercel
vercel login
vercel
```

### 6. Set Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**, add:

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `DATABASE_URL` | `postgresql://...` | Vercel Postgres → .env.local → `POSTGRES_PRISMA_URL` |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_rw_...` | Vercel Blob → Settings → Environment Variables |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL (auto-set, but verify) |

### 7. Initialize Database

After first deployment, run migrations:

**Option A: Via Vercel Dashboard**
1. Go to your deployment
2. Click **Functions** tab
3. Open terminal
4. Run: `npx prisma db push`

**Option B: Via CLI**
```bash
vercel env pull .env.local
npx prisma db push
```

### 8. Redeploy

After setting environment variables and running migrations:
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Wait for build to complete

## ✅ Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Create a test clip:
   - Slug: `test`
   - Content: `Hello from production!`
3. Visit: `https://your-app.vercel.app/test`
4. You should see your clip!

## 🐛 Troubleshooting

**"Database not initialized" error?**
- Make sure you ran `npx prisma db push` after deployment
- Verify `DATABASE_URL` is set correctly

**File uploads not working?**
- Check `BLOB_READ_WRITE_TOKEN` is set
- Verify Vercel Blob Storage is created

**Build fails?**
- Check that `prisma generate` runs in build command
- Verify all environment variables are set
- Check build logs in Vercel Dashboard

## 📝 Environment Variables Checklist

Before deploying, make sure you have:
- ✅ `DATABASE_URL` (PostgreSQL connection string)
- ✅ `BLOB_READ_WRITE_TOKEN` (Vercel Blob token)
- ✅ `NEXT_PUBLIC_APP_URL` (your Vercel URL)

## 🎉 You're Done!

Your cl1p clone is now live and accessible from anywhere! Share the URL with friends to test it out.

