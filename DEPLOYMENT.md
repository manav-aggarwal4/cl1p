# Deployment Guide for cl1p

This guide will walk you through deploying your cl1p clone to Vercel so it's accessible from anywhere.

## Prerequisites

1. A GitHub account
2. A Vercel account (free tier works fine)
3. Your code pushed to a GitHub repository

## Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: cl1p clone"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Set Up Vercel Postgres Database

SQLite won't work on Vercel's serverless functions. We need to use Vercel Postgres (or another PostgreSQL database).

### Option A: Vercel Postgres (Recommended - Free Tier Available)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (or create one)
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose a name and region (free tier: Hobby plan)
6. Once created, go to the **.env.local** tab
7. Copy the `POSTGRES_PRISMA_URL` - this is your `DATABASE_URL`

### Option B: Alternative PostgreSQL Services

- **Supabase** (Free tier): https://supabase.com
- **Neon** (Free tier): https://neon.tech
- **Railway** (Free tier): https://railway.app

For these, you'll get a connection string like:
```
postgresql://user:password@host:5432/database?sslmode=require
```

## Step 3: Update Prisma Schema for PostgreSQL

The schema needs to be updated to support PostgreSQL. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run locally to test:
```bash
npx prisma db push
npx prisma generate
```

## Step 4: Set Up Vercel Blob Storage (for File Uploads)

1. In Vercel Dashboard, go to **Storage** tab
2. Click **Create Database** → Select **Blob**
3. Choose a name
4. Once created, go to **Settings** → **Environment Variables**
5. Copy the `BLOB_READ_WRITE_TOKEN`

## Step 5: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. **Don't deploy yet!** First set up environment variables

### Method 2: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 6: Configure Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**, add:

1. **DATABASE_URL**
   - Value: Your PostgreSQL connection string (from Step 2)
   - Example: `postgresql://user:pass@host:5432/db?sslmode=require`

2. **BLOB_READ_WRITE_TOKEN**
   - Value: Your Vercel Blob token (from Step 4)
   - Example: `vercel_blob_rw_xxxxx...`

3. **NEXT_PUBLIC_APP_URL**
   - Value: Your Vercel deployment URL
   - Example: `https://your-app.vercel.app`
   - Note: This will be set automatically, but you can override it

## Step 7: Update Build Settings

Vercel should auto-detect Next.js, but verify in **Settings** → **General**:

- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next` (default)

## Step 8: Deploy!

1. Click **Deploy** in Vercel Dashboard
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

## Step 9: Run Database Migrations

After first deployment, you need to create the database tables:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.local  # Pull environment variables
npx prisma db push

# Option 2: Via Vercel Dashboard
# Go to your deployment → Functions → Open terminal
# Run: npx prisma db push
```

Or use Prisma Migrate (recommended for production):

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy  # For production
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in Vercel environment variables
- Check that your database allows connections from Vercel's IPs
- For Vercel Postgres, connections are automatically allowed

### File Upload Issues

- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check file size limits (default: 10MB)
- Ensure Vercel Blob Storage is created and active

### Build Failures

- Check that `prisma generate` runs before `next build`
- Verify all environment variables are set
- Check build logs in Vercel Dashboard

## Quick Reference

**Environment Variables Needed:**
```
DATABASE_URL=postgresql://...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Post-Deployment Checklist:**
- [ ] Database tables created (`npx prisma db push`)
- [ ] Environment variables configured
- [ ] Vercel Blob Storage set up
- [ ] Test creating a clip
- [ ] Test viewing a clip from another device
- [ ] Test file uploads

## Cost Estimate (Free Tier)

- **Vercel Hosting**: Free (Hobby plan)
- **Vercel Postgres**: Free (up to 256 MB storage)
- **Vercel Blob Storage**: Free (up to 1 GB storage)
- **Total**: $0/month for moderate usage

Your app should now be live and accessible from anywhere! 🚀

