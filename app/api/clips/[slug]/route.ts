import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { slugSchema } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: slugParam } = await params
    // Validate slug
    const validation = slugSchema.safeParse(slugParam)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    const slug = validation.data

    // Find clip
    const clip = await prisma.clip.findUnique({
      where: { slug },
    })

    if (!clip) {
      return NextResponse.json({ error: 'Clip not found' }, { status: 404 })
    }

    // Check if expired
    if (clip.expiresAt && new Date(clip.expiresAt) < new Date()) {
      await prisma.clip.delete({ where: { slug } })
      return NextResponse.json({ error: 'Clip has expired' }, { status: 410 })
    }

    // If destroy-on-read, delete after retrieval
    if (clip.destroyOnRead) {
      await prisma.clip.update({
        where: { slug },
        data: { readAt: new Date() },
      })
      // Delete in background (don't wait)
      prisma.clip.delete({ where: { slug } }).catch(console.error)
    }

    // Return clip data
    return NextResponse.json({
      slug: clip.slug,
      content: clip.content,
      fileUrl: clip.fileUrl,
      fileName: clip.fileName,
      fileType: clip.fileType,
      fileSize: clip.fileSize,
      createdAt: clip.createdAt,
      expiresAt: clip.expiresAt,
      destroyOnRead: clip.destroyOnRead,
    })
  } catch (error) {
    console.error('Error retrieving clip:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to retrieve clip: ${errorMessage}` },
      { status: 500 }
    )
  }
}

