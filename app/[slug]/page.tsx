import ClipViewer from '@/components/ClipViewer'

export default async function ClipPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <div>
      <ClipViewer slug={slug} />
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <a
          href="/"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Create a new clip
        </a>
      </div>
    </div>
  )
}

