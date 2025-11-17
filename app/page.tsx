import ClipForm from '@/components/ClipForm'

export default function Home() {
  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create a new clip</h2>
          <p className="text-gray-600 mb-6">
            Create a unique URL to share text or files. Access it from any
            device by visiting the same URL.
          </p>
          <ClipForm />
        </div>
      </div>
    </div>
  )
}

