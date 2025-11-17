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

      // Redirect to the clip page
      router.push(`/${data.slug}`)
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
        />
        {file && (
          <p className="mt-1 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
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
          Destroy on read (default: enabled)
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating...' : 'Create Clip'}
      </button>
    </form>
  )
}

