---
name: publish-blog-post
description: Write and publish a new blog post to the Scrum Day Nigeria website. Use when the user asks to write a blog post, announcement, news update, or article for the site.
---

# Publish a Blog Post

Posts live as `.mdx` files in `src/content/blog/`, validated against the `blog` schema in
`src/content.config.ts`. Each file is one post; the `/blog` index and RSS feed regenerate
automatically from whatever files exist.

## Steps

1. Get or draft the content with the user: title, a 1-2 sentence description (used for previews,
   SEO, and RSS), category (e.g. "Announcement", "Recap", "Speaker Spotlight"), and the body.
2. Get a cover image (16:9 works best, e.g. 1200x630). If none is available yet, use
   `../../assets/placeholders/cover.svg` and tell the user to swap it in later.
3. Create `src/content/blog/<kebab-case-slug>.mdx` — the filename becomes the URL
   (`/blog/<slug>`), so keep it short and URL-friendly:

   ```mdx
   ---
   title: "Post Title"
   description: "One or two sentence summary for previews and SEO."
   pubDate: 2026-02-01
   category: "Announcement"
   coverImage: "../../assets/blog/<slug>-cover.jpg"
   author: "Scrum Day Nigeria" # or a named author
   draft: false
   ---

   Post body in Markdown/MDX goes here.
   ```

4. Set `draft: true` if the user wants to write it now but not publish yet — draft posts are
   excluded from `/blog`, the homepage, and the RSS feed automatically.
5. Run `npm run build` to confirm it validates, then let the user preview locally
   (`npm run dev`, visit `/blog/<slug>`) before it goes live.
6. Once merged/deployed, the post appears automatically — no other file needs to change.
