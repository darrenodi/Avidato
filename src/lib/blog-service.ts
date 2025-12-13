import { prisma } from './prisma'

export interface BlogPostInput {
  title: string
  slug: string
  description: string
  content: string
  excerpt?: string
  image?: string
  author?: string
  tags?: string[]
  published?: boolean
}

/**
 * Get all published blog posts sorted by date (newest first)
 */
export async function getAllBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      excerpt: true,
      image: true,
      author: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  })
}

/**
 * Get all blog posts (including drafts) - Admin only
 */
export async function getAllBlogPostsAdmin() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get blog post by ID - Admin
 */
export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  })
}

/**
 * Create blog post
 */
export async function createBlogPost(data: BlogPostInput) {
  return prisma.blogPost.create({
    data: {
      ...data,
      tags: data.tags || [],
    },
  })
}

/**
 * Update blog post
 */
export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
  return prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      ...(data.tags && { tags: data.tags }),
    },
  })
}

/**
 * Delete blog post
 */
export async function deleteBlogPost(id: string) {
  return prisma.blogPost.delete({
    where: { id },
  })
}

/**
 * Get posts by tag
 */
export async function getBlogPostsByTag(tag: string) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      tags: {
        has: tag,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      author: true,
      tags: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get all unique tags from published posts
 */
export async function getAllBlogTags() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { tags: true },
  })

  const tagsSet = new Set<string>()
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet).sort()
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Validate slug is unique (except for given ID if updating)
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!existing) return true
  return excludeId === existing.id
}
