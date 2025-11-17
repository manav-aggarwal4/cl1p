import { put, list } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function uploadFile(
  file: File,
  slug: string
): Promise<{ url: string; fileName: string; fileType: string; fileSize: number }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Use Vercel Blob Storage in production, local filesystem in development
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${slug}-${file.name}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return {
      url: blob.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }
  } else {
    // Local development: store in public/uploads
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const fileName = `${slug}-${Date.now()}-${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return {
      url: `${baseUrl}/uploads/${fileName}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }
  }
}

export function calculateExpiration(ttl?: string): Date | null {
  if (!ttl) return null

  const now = new Date()
  const ttlMap: Record<string, number> = {
    '1min': 1 * 60 * 1000,
    '10min': 10 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
    '1day': 24 * 60 * 60 * 1000,
    '1week': 7 * 24 * 60 * 60 * 1000,
    '1month': 30 * 24 * 60 * 60 * 1000,
  }

  const milliseconds = ttlMap[ttl]
  if (!milliseconds) return null

  return new Date(now.getTime() + milliseconds)
}

