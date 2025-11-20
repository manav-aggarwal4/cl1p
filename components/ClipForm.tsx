'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const TTL_OPTIONS = [
  { value: '1min', label: '1 minute' },
  { value: '10min', label: '10 minutes' },
  { value: '1hour', label: '1 hour' },
  { value: '1day', label: '1 day' },
  { value: '1week', label: '1 week' },
  { value: '1month', label: '1 month' },
]

export default function ClipForm() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [ttl, setTtl] = useState<string>('')
  const [destroyOnRead, setDestroyOnRead] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdClipUrl, setCreatedClipUrl] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!slug.trim()) {
      setError('Slug is required')
      setIsSubmitting(false)
      return
    }

    if (!content.trim() && !file) {
      setError('Either content or file must be provided')
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('slug', slug.toLowerCase().trim())
      if (content.trim()) {
        formData.append('content', content)
      }
      if (file) {
        formData.append('file', file)
      }
      if (ttl) {
        formData.append('ttl', ttl)
      }
      formData.append('destroyOnRead', destroyOnRead.toString())

      const response = await fetch('/api/clips', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create clip')
        setIsSubmitting(false)
        return
      }

      // If destroy-on-read is enabled, show URL instead of redirecting
      // (so user can share it before it gets destroyed)
      if (destroyOnRead) {
        const clipUrl = `${window.location.origin}/${data.slug}`
        setCreatedClipUrl(clipUrl)
        setIsSubmitting(false)
        // Reset form
        setSlug('')
        setContent('')
        setFile(null)
        setTtl('')
      } else {
        // Only redirect if destroy-on-read is disabled
        router.push(`/${data.slug}`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-2">
          Slug (URL identifier)
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-clip"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          pattern="[a-zA-Z0-9_-]+"
          minLength={3}
          maxLength={50}
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Letters, numbers, hyphens, and underscores only (3-50 characters)
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content (optional if file is provided)
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your text here..."
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium mb-2">
          File (optional if content is provided)
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          accept="*/*"
        />
        {file && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{file.name}</span>
              <span className="text-gray-400">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            {/* Image Preview */}
            {file.type.startsWith('image/') && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="ttl" className="block text-sm font-medium mb-2">
          Time to Live (optional)
        </label>
        <select
          id="ttl"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">No expiration</option>
          {TTL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="destroyOnRead"
          checked={destroyOnRead}
          onChange={(e) => setDestroyOnRead(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="destroyOnRead" className="ml-2 text-sm font-medium">
          Destroy on read - Clip will be deleted after first view (default: enabled)
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {createdClipUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-green-800">Clip created successfully!</h3>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">Share this URL (will be deleted after first view):</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={createdClipUrl}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white font-mono text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(createdClipUrl)
                  alert('URL copied to clipboard!')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
            ⚠️ This clip will be deleted after the first person views it. Share the URL now!
          </div>
          <button
            type="button"
            onClick={() => {
              setCreatedClipUrl(null)
              window.open(createdClipUrl, '_blank')
            }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Open in New Tab
          </button>
        </div>
      )}

      {!createdClipUrl && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Clip'}
        </button>
      )}
    </form>
  )
}

