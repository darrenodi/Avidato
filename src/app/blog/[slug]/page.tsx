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
      {/* Hero Image */}
      {post.image && (
        <div className="relative h-[28rem] bg-slate-100 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-brand-primary transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="inline-block px-3 py-1 bg-brand-primary/5 text-brand-primary text-xs font-medium rounded-lg hover:bg-brand-primary/10 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-10 pb-8 border-b border-slate-100">
          {post.author && (
            <span className="font-medium text-slate-600">{post.author}</span>
          )}
          {post.author && <span className="text-slate-200">|</span>}
          <span>{publishDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</span>
          <span className="text-slate-200">|</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Content */}
        <BlogPostContent content={post.content} />

        {/* Footer */}
        <div className="border-t border-slate-100 pt-8 mt-16">
          <p className="text-slate-400 text-sm">
            Last updated on {new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </article>

      {/* Read More */}
      <div className="bg-slate-50/80 py-14 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Enjoyed this article?</h2>
          <p className="text-slate-500 mb-6">Explore more insights and resources on our blog.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors text-sm font-medium shadow-sm shadow-brand-primary/20"
          >
            Browse all posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
