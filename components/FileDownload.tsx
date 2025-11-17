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

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-gray-500">
            {fileType} • {formatFileSize(fileSize)}
          </p>
        </div>
        <a
          href={url}
          download={fileName}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download
        </a>
      </div>
    </div>
  )
}

