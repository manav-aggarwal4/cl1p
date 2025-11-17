import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'cl1p - Internet Clipboard',
  description: 'Share text and files instantly across devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2">
              <a href="/" className="text-blue-600 hover:text-blue-700">
                cl1p
              </a>
            </h1>
            <p className="text-center text-gray-600">
              Internet clipboard - share text and files instantly
            </p>
          </header>
          <main>{children}</main>
          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>Share data across devices with a simple URL</p>
          </footer>
        </div>
      </body>
    </html>
  )
}

