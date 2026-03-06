'use client'

import DOMPurify from 'dompurify'

interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="mb-12">
      <style>{`
        .blog-content {
          word-wrap: break-word;
          line-height: 1.7;
          color: #334155;
        }
        
        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          margin: 2.5rem 0 1.25rem 0;
          color: #0f172a;
          letter-spacing: -0.025em;
        }
        
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 2rem 0 1rem 0;
          color: #1e293b;
          letter-spacing: -0.02em;
        }
        
        .blog-content h3 {
          font-size: 1.375rem;
          font-weight: 700;
          line-height: 1.35;
          margin: 1.75rem 0 0.75rem 0;
          color: #1e293b;
        }
        
        .blog-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: #334155;
        }
        
        .blog-content h5 {
          font-size: 1rem;
          font-weight: 600;
          margin: 1.25rem 0 0.5rem 0;
          color: #334155;
        }
        
        .blog-content h6 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          color: #475569;
        }
        
        .blog-content p {
          line-height: 1.85;
          margin: 1.25rem 0;
          font-size: 1.0625rem;
          color: #334155;
        }
        
        .blog-content strong {
          font-weight: 700;
          color: #1e293b;
        }
        
        .blog-content em {
          font-style: italic;
          color: #475569;
        }
        
        .blog-content u {
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
          text-decoration-color: #3d74b5;
        }
        
        .blog-content s {
          text-decoration: line-through;
          color: #94a3b8;
        }
        
        .blog-content code {
          background-color: #f1f5f9;
          padding: 0.2rem 0.45rem;
          border-radius: 0.375rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: #e11d48;
          border: 1px solid #e2e8f0;
        }
        
        .blog-content pre {
          background-color: #0f172a;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 1rem;
          overflow-x: auto;
          margin: 1.75rem 0;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          border: 1px solid #1e293b;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
          border: none;
        }
        
        .blog-content a {
          color: #3d74b5;
          text-decoration: underline;
          text-decoration-color: #3d74b5/30;
          text-underline-offset: 3px;
          transition: color 0.2s, text-decoration-color 0.2s;
        }
        
        .blog-content a:hover {
          color: #252e48;
          text-decoration-color: #252e48;
        }
        
        .blog-content ul {
          list-style: disc;
          padding-left: 1.75rem;
          margin: 1.25rem 0;
        }
        
        .blog-content ol {
          list-style: decimal;
          padding-left: 1.75rem;
          margin: 1.25rem 0;
        }
        
        .blog-content li {
          margin: 0.5rem 0;
          line-height: 1.8;
          color: #334155;
        }
        
        .blog-content li::marker {
          color: #3d74b5;
        }
        
        .blog-content blockquote {
          border-left: 3px solid #3d74b5;
          padding: 1rem 1.5rem;
          margin: 1.75rem 0;
          font-style: italic;
          color: #475569;
          background-color: #f8fafc;
          border-radius: 0 0.75rem 0.75rem 0;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .blog-content hr {
          border: none;
          height: 1px;
          background-color: #e2e8f0;
          margin: 2.5rem 0;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .blog-content th {
          background-color: #f8fafc;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #1e293b;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .blog-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9375rem;
        }
      `}</style>
      <div 
        className="blog-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    </div>
  )
}
