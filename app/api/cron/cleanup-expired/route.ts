import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request from Vercel
    // Vercel automatically adds authorization header for cron jobs
    // Optionally, you can set CRON_SECRET for additional security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // If CRON_SECRET is set, require it for security
    // Otherwise, Vercel's automatic auth is sufficient
    if (cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      // If no CRON_SECRET is set, still check for Vercel's auth header
      // Vercel cron jobs automatically include authorization
      if (!authHeader) {
        console.warn('Cron job called without authorization header')
      }
    }

    // Find all expired clips
    const now = new Date()
    const expiredClips = await prisma.clip.findMany({
      where: {
        expiresAt: {
          not: null,
          lt: now, // Less than current time = expired
        },
      },
      select: {
        slug: true,
      },
    })

    // Delete expired clips
    const deleteResult = await prisma.clip.deleteMany({
      where: {
        expiresAt: {
          not: null,
          lt: now,
        },
      },
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      expiredClipsFound: expiredClips.length,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Error cleaning up expired clips:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Cleanup failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}

