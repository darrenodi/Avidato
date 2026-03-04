import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, calculateReadingTime } from '@/lib/blog-service'
import BlogPostContent from '../blog-post-content'
import type { Metadata } from 'next'

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image: string | null
  author: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  
  try {
    const post = await getBlogPostBySlug(resolvedParams.slug)
    if (post) {
      const description = post.description || `Read "${post.title}" on the Avidato blog. English teaching resources, ESL lessons, CEFR language learning tips, and online tutoring strategies for English tutors.`
      return {
        title: `${post.title} | Avidato Blog - English ESL Resources`,
        description: description.length > 160 ? description.substring(0, 160) + '...' : description,
        keywords: `ESL, EFL, English teaching, lesson plans, CEFR, language learning, online tutoring, English resources, ${post.tags?.join(', ') || ''}`,
        openGraph: {
          title: post.title,
          description: description,
          images: post.image
            ? [{ url: post.image, alt: post.title }]
            : [{ url: 'https://avidato.com/logo.png', alt: 'Avidato' }],
          type: 'article',
          publishedTime: new Date(post.createdAt).toISOString(),
          authors: post.author ? [post.author] : [],
          tags: post.tags || [],
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: 'Blog Post | Avidato - English Teaching Resources',
    description: 'Read articles about English teaching, ESL lesson plans, CEFR language learning, and online tutoring resources on the Avidato blog.',
    keywords: 'ESL, EFL, English teaching, lesson plans, CEFR, language learning, online tutoring',
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  let post: BlogPost | null = null

  try {
    const data = await getBlogPostBySlug(resolvedParams.slug)
    if (data) {
      post = data as BlogPost
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
  }

  if (!post) {
    notFound()
  }

  const readingTime = calculateReadingTime(post.content)
  const publishDate = new Date(post.createdAt)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {post.image && (
        <div className="h-96 bg-gray-100 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/blog" className="text-blue-600 hover:text-blue-900 mb-6 inline-block">
          ← Back to Blog
        </Link>

        {/* Title and Meta */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          {post.author && <span>{post.author}</span>}
          <span>{publishDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <BlogPostContent content={post.content} />

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <p className="text-gray-600 text-sm">
            Last updated on {new Date(post.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </article>

      {/* Related Posts Section - Optional */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Read More</h2>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse all posts
          </Link>
        </div>
      </div>
    </div>
  )
}
