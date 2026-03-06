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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blog Management</h1>
          <p className="text-slate-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/blog/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors text-sm font-medium shadow-sm shadow-brand-primary/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm mb-3">No blog posts yet.</p>
          <Link href="/admin/blog/create" className="text-brand-primary hover:text-brand-dark text-sm font-medium">
            Create your first post
          </Link>
        </div>
      ) : (
        <BlogListClient posts={posts} />
      )}
    </div>
  )
}
