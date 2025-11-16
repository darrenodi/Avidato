import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  author?: string;
  tags?: string[];
  content?: string;
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: data.slug || fileName.replace(/\.mdx$/, ''),
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        image: data.image,
        author: data.author,
        tags: data.tags || [],
      } as BlogPost;
    });

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): { frontmatter: BlogPost; content: string } | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter: BlogPost = {
      slug: data.slug || slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      image: data.image,
      author: data.author,
      tags: data.tags || [],
    };

    return { frontmatter, content };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags?.includes(tag));
}
