'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

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

interface BlogListClientProps {
  posts: BlogPost[]
  tags: string[]
}

export default function BlogListClient({ posts, tags: allTags }: BlogListClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (selectedTag) {
      return posts.filter((post) => post.tags && post.tags.includes(selectedTag))
    }
    return posts
  }, [selectedTag, posts])

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-base">
            {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No blog posts yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/80 transition-all duration-300"
            >
              {post.image && (
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{post.description}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-0.5 bg-brand-primary/5 text-brand-primary text-xs font-medium rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span className="font-medium">{post.author || 'Anonymous'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
