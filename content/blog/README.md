# AI-Powered Automated Blog System

This directory contains the automated blog generation system for Avidato.

## 📁 Structure

```
content/blog/          # MDX blog posts (auto-generated)
src/app/blog/          # Blog pages
  ├── page.tsx         # Blog listing
  └── [slug]/page.tsx  # Individual post pages
src/lib/posts.ts       # Blog utilities
scripts/generatePost.js # AI generation script
.github/workflows/autopost.yml # Automation workflow
```

## 🚀 Features

- **AI-Generated Content**: Uses GPT-4 to create high-quality blog posts
- **AI-Generated Images**: Uses DALL-E 3 for featured images
- **Automated Publishing**: Weekly posts via GitHub Actions
- **MDX Support**: Rich content with components
- **SEO Optimized**: Metadata, descriptions, and Open Graph tags
- **Responsive Design**: Mobile-friendly blog layout

## 🛠️ Local Development

### Manual Blog Generation

To manually generate a blog post:

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="your-api-key"

# Run the generation script
npm run generate:blog
```

This will:
1. Select a random topic from the predefined list
2. Generate content with GPT-4
3. Generate a featured image with DALL-E 3
4. Save the post to `content/blog/`

### View Blogs Locally

```bash
npm run dev
```

Then visit:
- Blog list: `http://localhost:3000/blog`
- Individual post: `http://localhost:3000/blog/[slug]`

## 🤖 Automated Generation

### GitHub Actions Workflow

The blog system automatically generates new posts every **Monday at 9:00 AM UTC**.

**Setup:**

1. Add your OpenAI API key to GitHub Secrets:
   - Go to: Settings → Secrets and variables → Actions
   - Create new secret: `OPENAI_API_KEY`
   - Paste your API key

2. The workflow will:
   - Generate a new blog post
   - Commit it to the repository
   - Trigger a Vercel deployment

### Manual Trigger

You can manually trigger the workflow from GitHub:
1. Go to Actions tab
2. Select "Auto Generate Blog Post"
3. Click "Run workflow"

## 📝 Customizing Topics

Edit `scripts/generatePost.js` and modify the `TOPICS` array:

```javascript
const TOPICS = [
  "Your Custom Topic 1",
  "Your Custom Topic 2",
  // ...
];
```

## 🎨 Styling

Blog pages use Tailwind CSS classes consistent with the rest of the application:
- Dark mode support
- Brand colors (brand-primary, brand-accent)
- Responsive typography
- Prose styling for MDX content

## 📊 Blog Post Format

Each post includes:

```yaml
---
title: "Post Title"
date: "2025-11-15"
description: "Post description for SEO"
slug: "url-friendly-slug"
image: "https://..."  # DALL-E generated
author: "Avidato AI"
tags: ["Tag1", "Tag2"]
---

# Markdown content here
```

## 🔧 Troubleshooting

### No posts showing
- Check `content/blog/` directory exists
- Verify MDX files have correct frontmatter
- Check console for parsing errors

### Generation fails
- Verify `OPENAI_API_KEY` is set
- Check OpenAI API quota/billing
- Review GitHub Actions logs

### Images not loading
- DALL-E URLs expire after 1 hour
- For production, consider:
  - Downloading and storing images locally
  - Using Cloudinary for permanent hosting
  - Saving to public assets during generation

## 🚀 Deployment

When you push to main:
1. Vercel automatically rebuilds
2. New blog posts are statically generated
3. Changes go live automatically

No additional deployment configuration needed!

## 📈 Future Enhancements

- [ ] Image caching to local/Cloudinary
- [ ] SEO keyword optimization
- [ ] Internal linking between posts
- [ ] RSS feed generation
- [ ] Social media auto-posting
- [ ] Analytics integration
- [ ] Comment system
- [ ] Newsletter integration

## 🤝 Contributing

To add new blog topics or modify generation logic:
1. Edit `scripts/generatePost.js`
2. Test locally with `npm run generate:blog`
3. Commit changes
4. Workflow will use updated configuration

---

**Generated with ❤️ by Avidato AI**
