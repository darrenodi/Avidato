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

  const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length

  return (
    <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{wordCount} words</span>
          <Link
            href="/admin/blog"
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Updating...
              </>
            ) : (
              formData.published ? 'Update & Publish' : 'Update Draft'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Main content - left column */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Title - large, clean input */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-0 border-b-2 border-transparent focus:border-brand-primary focus:ring-0 bg-transparent pb-2 outline-none transition-colors"
            required
          />

          {/* Slug indicator */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            /blog/{formData.slug}
            <button
              type="button"
              onClick={() => {
                const newSlug = prompt('Edit slug:', formData.slug)
                if (newSlug) setFormData((prev) => ({ ...prev, slug: newSlug }))
              }}
              className="text-brand-primary hover:text-brand-primary/80 font-medium ml-1"
            >
              Edit
            </button>
          </div>

          {/* Content editor */}
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
            placeholder="Start writing your post..."
          />
        </div>

        {/* Sidebar - right column */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Publish settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Publish</h3>
            </div>
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-brand-primary transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {formData.published ? 'Public' : 'Draft'}
                </span>
              </label>
              <p className="text-xs text-gray-400">
                {formData.published
                  ? 'Visible to everyone'
                  : 'Only visible to admins'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">SEO Description *</h3>
            </div>
            <div className="p-4">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description for search results and previews..."
                rows={3}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-primary focus:border-brand-primary resize-none placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-400 mt-1">{formData.description.length}/160 characters</p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Excerpt</h3>
            </div>
            <div className="p-4">
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Short summary for blog listing cards..."
                rows={2}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-primary focus:border-brand-primary resize-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Featured Image</h3>
            </div>
            <div className="p-4">
              {formData.image ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Image URL:', formData.image)
                        if (url !== null) setFormData((prev) => ({ ...prev, image: url }))
                      }}
                      className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter image URL:')
                    if (url) setFormData((prev) => ({ ...prev, image: url }))
                  }}
                  className="w-full py-6 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition flex flex-col items-center gap-1"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Add featured image
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. english, tips, learning"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              {formData.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.tags.split(',').filter((t) => t.trim()).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Author</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
