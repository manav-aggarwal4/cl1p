'use client'

import { useEffect, useState } from 'react'
import FileDownload from './FileDownload'

interface ClipData {
  slug: string
  content: string | null
  fileUrl: string | null
  fileName: string | null
  fileType: string | null
  fileSize: number | null
  createdAt: string
  expiresAt: string | null
  destroyOnRead: boolean
}

interface ClipViewerProps {
  slug: string
}

export default function ClipViewer({ slug }: ClipViewerProps) {
  const [clip, setClip] = useState<ClipData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClip() {
      try {
        const response = await fetch(`/api/clips/${slug}`)
        const data = await response.json()

        if (!response.ok) {
          console.error('API Error:', data)
          setError(data.error || 'Failed to load clip')
          setLoading(false)
          return
        }

        setClip(data)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setLoading(false)
      }
    }

    fetchClip()
  }, [slug])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading clip...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!clip) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Clip not found</p>
        </div>
      </div>
    )
  }

  const isExpired = clip.expiresAt && new Date(clip.expiresAt) < new Date()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Clip: {clip.slug}</h2>
          <div className="text-sm text-gray-500">
            Created: {new Date(clip.createdAt).toLocaleString()}
          </div>
        </div>

        {isExpired && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded mb-4">
            This clip has expired
          </div>
        )}

        {clip.destroyOnRead && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded mb-4">
            ⚠️ This clip will be deleted after you view it. Refresh the page and it will be gone.
          </div>
        )}

        {clip.content && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Content:</h3>
            <pre className="bg-gray-50 border border-gray-200 rounded p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {clip.content}
            </pre>
          </div>
        )}

        {clip.fileUrl && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {clip.fileType?.startsWith('image/') ? 'Image:' : clip.fileType?.startsWith('video/') ? 'Video:' : 'File:'}
            </h3>
            <FileDownload
              url={clip.fileUrl}
              fileName={clip.fileName || 'download'}
              fileType={clip.fileType || 'application/octet-stream'}
              fileSize={clip.fileSize}
            />
          </div>
        )}

        {!clip.content && !clip.fileUrl && (
          <p className="text-gray-500">This clip has no content</p>
        )}
      </div>
    </div>
  )
}

