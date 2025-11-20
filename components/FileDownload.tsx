'use client'

interface FileDownloadProps {
  url: string
  fileName: string
  fileType: string
  fileSize: number | null
}

export default function FileDownload({
  url,
  fileName,
  fileType,
  fileSize,
}: FileDownloadProps) {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const isImage = fileType.startsWith('image/')
  const isPDF = fileType === 'application/pdf'
  const isVideo = fileType.startsWith('video/')

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Image Preview */}
      {isImage && (
        <div className="w-full">
          <img
            src={url}
            alt={fileName}
            className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm"
            style={{ maxHeight: '600px' }}
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Video Preview */}
      {isVideo && (
        <div className="w-full">
          <video
            src={url}
            controls
            className="max-w-full h-auto rounded-lg border border-gray-300"
            style={{ maxHeight: '600px' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* File Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* File Type Icon */}
          <div className="flex-shrink-0">
            {isImage && (
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {isPDF && (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            {isVideo && (
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            {!isImage && !isPDF && !isVideo && (
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{fileName}</p>
            <p className="text-sm text-gray-500">
              {fileType} • {formatFileSize(fileSize)}
            </p>
          </div>
        </div>
        <a
          href={url}
          download={fileName}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isImage ? 'Download Image' : isPDF ? 'Download PDF' : 'Download'}
        </a>
      </div>
    </div>
  )
}

