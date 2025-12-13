'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateBlogPostAction } from '@/app/actions/blog'
import RichTextEditor from '@/components/RichTextEditor'

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

interface FormData {
  title: string
  slug: string
  description: string
  content: string
  excerpt: string
  image: string
  author: string
  tags: string
  published: boolean
}

interface EditBlogPostFormProps {
  post: BlogPost
}

export default function EditBlogPostForm({ post }: EditBlogPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: post.title,
    slug: post.slug,
    description: post.description,
    content: post.content,
    excerpt: post.excerpt || '',
    image: post.image || '',
    author: post.author || '',
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    published: post.published || false,
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const result = await updateBlogPostAction(post.id, {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        excerpt: formData.excerpt,
        image: formData.image,
        author: formData.author,
        tags: tagsArray,
        published: formData.published,
      })

      if (result.success) {
        router.push('/admin/blog')
      } else {
        setError(result.error || 'Failed to update post')
      }
    } catch (err) {
      setError('An error occurred while updating the post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog post title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="url-slug"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in URL: /blog/{formData.slug || 'slug'}
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description * (appears in previews)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a brief description"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (optional)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short summary for listings"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL (optional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author (optional)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional, comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. javascript, web development, tutorial"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Publish (uncheck to save as draft)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Link
            href="/admin/blog"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </>
  )
}
