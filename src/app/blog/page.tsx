import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Blog | Avidato',
  description: 'Insights, tips, and updates about AI-powered language teaching',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tips, and updates about AI-powered language teaching
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Featured Image */}
                {post.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </p>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author */}
                  {post.author && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      By {post.author}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
      <PublicFooter />
    </>
  );
}
