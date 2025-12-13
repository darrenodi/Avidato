import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostById } from '@/lib/blog-service'
import EditBlogPostForm from './edit-form'

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  excerpt: string | null
  image: string | null
  author: string
  tags: string[]
  published: boolean
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const postId = resolvedParams.id

  let post: BlogPost | null = null

  try {
    const data = await getBlogPostById(postId)
    if (data) {
      post = data as BlogPost
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/blog" className="text-blue-600 hover:text-blue-900">
            ← Back to Blog
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
          <EditBlogPostForm post={post} />
        </div>
      </div>
    </div>
  )
}
