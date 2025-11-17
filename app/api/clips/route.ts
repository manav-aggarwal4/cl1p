import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClipSchema } from '@/lib/validation'
import { uploadFile, calculateExpiration } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string | null
    const ttl = formData.get('ttl') as string | null
    const destroyOnRead = formData.get('destroyOnRead') === 'true'
    const file = formData.get('file') as File | null

    // Validate input
    const validation = createClipSchema.safeParse({
      slug,
      content: content || undefined,
      ttl: ttl || undefined,
      destroyOnRead,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { slug: validatedSlug, ttl: validatedTtl } = validation.data

    // Check if slug already exists
    const existing = await prisma.clip.findUnique({
      where: { slug: validatedSlug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This slug is already taken' },
        { status: 409 }
      )
    }

    // Validate that we have either content or file
    if (!content && !file) {
      return NextResponse.json(
        { error: 'Either content or file must be provided' },
        { status: 400 }
      )
    }

    // Handle file upload if present
    let fileUrl: string | null = null
    let fileName: string | null = null
    let fileType: string | null = null
    let fileSize: number | null = null

    if (file && file.size > 0) {
      const uploadResult = await uploadFile(file, validatedSlug)
      fileUrl = uploadResult.url
      fileName = uploadResult.fileName
      fileType = uploadResult.fileType
      fileSize = uploadResult.fileSize
    }

    // Calculate expiration
    const expiresAt = calculateExpiration(validatedTtl)

    // Create clip
    const clip = await prisma.clip.create({
      data: {
        slug: validatedSlug,
        content: content || null,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        expiresAt,
        destroyOnRead,
      },
    })

    return NextResponse.json(
      { slug: clip.slug, message: 'Clip created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating clip:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    // Check if it's a database connection error
    if (errorMessage.includes('PrismaClient') || errorMessage.includes('database')) {
      return NextResponse.json(
        { error: 'Database not initialized. Please run: npx prisma db push && npx prisma generate' },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: `Failed to create clip: ${errorMessage}` },
      { status: 500 }
    )
  }
}

