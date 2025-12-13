'use client'

import { useEffect, useState } from 'react'
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
          line-height: 1.6;
        }
        
        .blog-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin: 2rem 0 1.5rem 0;
          color: #1f2937;
        }
        
        .blog-content h2 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.25;
          margin: 1.75rem 0 1rem 0;
          color: #374151;
        }
        
        .blog-content h3 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 1.5rem 0 0.75rem 0;
          color: #4b5563;
        }
        
        .blog-content h4 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          color: #555;
        }
        
        .blog-content h5 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        
        .blog-content h6 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        
        .blog-content p {
          line-height: 1.8;
          margin: 1rem 0;
          font-size: 1rem;
          color: #1f2937;
        }
        
        .blog-content strong {
          font-weight: 700;
          color: #000;
        }
        
        .blog-content em {
          font-style: italic;
          color: #374151;
        }
        
        .blog-content u {
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
        }
        
        .blog-content s {
          text-decoration: line-through;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #d73a49;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        
        .blog-content a {
          color: #2563eb;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .blog-content a:hover {
          color: #1d4ed8;
        }
        
        .blog-content ul {
          list-style: disc;
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        .blog-content ol {
          list-style: decimal;
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        .blog-content li {
          margin: 0.5rem 0;
          line-height: 1.8;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
          background-color: #f0f9ff;
          padding: 1rem 1.5rem;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <div 
        className="blog-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    </div>
  )
}
