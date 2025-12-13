import Link from 'next/link'
import { deleteBlogPostAction } from '@/app/actions/blog'
import { getAllBlogPostsAdmin } from '@/lib/blog-service'
import BlogListClient from './blog-list-client'

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  author?: string
  createdAt: Date
  updatedAt: Date
}

export default async function BlogAdminPage() {
  let posts: BlogPost[] = []
  let error: string | null = null

  try {
    const data = await getAllBlogPostsAdmin()
    posts = data as BlogPost[]
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load posts'
    console.error('Error loading blog posts:', err)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <Link
          href="/admin/blog/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + New Post
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts yet.</p>
          <Link href="/admin/blog/create" className="text-blue-600 hover:underline">
            Create your first post
          </Link>
        </div>
      ) : (
        <BlogListClient posts={posts} />
      )}
    </div>
  )
}
