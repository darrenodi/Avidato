'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById,
  isSlugUnique,
  generateSlug,
  type BlogPostInput,
} from '@/lib/blog-service'

/**
 * Admin action to create a blog post
 */
export async function createBlogPostAction(data: BlogPostInput) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error('Unauthorized')
    }

    // In a real app, you'd check if user is admin here
    // For now, we'll assume authenticated users can create posts

    // Validate slug uniqueness
    const slug = data.slug || generateSlug(data.title)
    const isUnique = await isSlugUnique(slug)
    if (!isUnique) {
      throw new Error(`Slug "${slug}" is already in use`)
    }

    const post = await createBlogPost({
      ...data,
      slug,
      author: data.author || session.user.name || 'Anonymous',
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blog')

    return { success: true, post }
  } catch (error) {
    console.error('Error creating blog post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create blog post',
    }
  }
}

/**
 * Admin action to update a blog post
 */
export async function updateBlogPostAction(id: string, data: Partial<BlogPostInput>) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error('Unauthorized')
    }

    // Verify post exists
    const post = await getBlogPostById(id)
    if (!post) {
      throw new Error('Blog post not found')
    }

    // Check slug uniqueness if slug is being updated
    if (data.slug && data.slug !== post.slug) {
      const isUnique = await isSlugUnique(data.slug, id)
      if (!isUnique) {
        throw new Error(`Slug "${data.slug}" is already in use`)
      }
    }

    const updatedPost = await updateBlogPost(id, data)

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true, post: updatedPost }
  } catch (error) {
    console.error('Error updating blog post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog post',
    }
  }
}

/**
 * Admin action to delete a blog post
 */
export async function deleteBlogPostAction(id: string) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error('Unauthorized')
    }

    // Verify post exists
    const post = await getBlogPostById(id)
    if (!post) {
      throw new Error('Blog post not found')
    }

    await deleteBlogPost(id)

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog post',
    }
  }
}
