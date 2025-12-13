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
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedTag === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No blog posts yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition group"
            >
              {post.image && (
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.description}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author || 'Anonymous'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
