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

  return <EditBlogPostForm post={post} />
}
