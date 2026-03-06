import { getAllBlogPosts } from '@/lib/blog-service'
import BlogListClient from './blog-list-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'English Teaching Blog | Avidato',
  description: 'Read articles about English teaching, ESL lesson plans, CEFR language levels, grammar tips, vocabulary strategies, and online tutoring best practices for language educators.',
  openGraph: {
    title: 'Avidato Blog - English ESL Teaching Resources',
    description: 'Free ESL lesson plans, English teaching resources, and CEFR language learning tips for online tutors',
    type: 'website',
  },
}

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  excerpt: string | null
  image: string | null
  author?: string
  tags: string[]
  createdAt: Date
}

export default async function BlogPage() {
  let posts: BlogPost[] = []
  let allTags: string[] = []

  try {
    const data = await getAllBlogPosts()
    posts = data as BlogPost[]

    const tagsSet = new Set<string>()
    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tagsSet.add(tag))
      }
    })
    allTags = Array.from(tagsSet).sort()
  } catch (error) {
    console.error('Error loading blog posts:', error)
  }

  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Hero */}
      <div className="bg-brand-dark">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Blog</h1>
          <p className="text-lg text-slate-400 mt-3 max-w-xl">
            Insights, tutorials, and resources for English language educators
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <BlogListClient posts={posts} tags={allTags} />
      </div>
    </div>
  )
}
