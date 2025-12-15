import Link from 'next/link'
import { getAllBlogPosts, getAllBlogTags } from '@/lib/blog-service'
import BlogListClient from './blog-list-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Avidato - ESL English Teaching Resources',
  description: 'Avidato blog: Free English teaching resources, ESL lesson plans, CEFR tips, and online tutoring strategies. Discover resources for language learning, vocabulary practice, grammar exercises, and student engagement techniques for EFL tutors.',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600">Insights, tutorials, and stories</p>
        </div>

        <BlogListClient posts={posts} tags={allTags} />
      </div>
    </div>
  )
}
