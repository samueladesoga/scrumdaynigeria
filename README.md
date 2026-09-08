# Scrum Day Nigeria

Website for Scrum Day Nigeria — built with Astro so that **content lives separately from the
website build**: organizers (or an agent) edit Markdown/YAML files, and the site rebuilds itself.

## Stack

- **[Astro](https://docs.astro.build)** — static site generator, zero client JS by default
- **Content Collections** (`src/content.config.ts`) — schema-validated content in
  `src/content/`; a malformed entry fails `npm run build` with a clear error instead of
  breaking silently
- **Tailwind CSS v4** for styling
- **Vue** islands for the handful of components that need client-side interactivity
- **MDX** for blog posts

## Content model

Everything editable lives under `src/content/` — no code changes needed to update it:

| Collection | Location | What it is |
| --- | --- | --- |
| `speakers` | `src/content/speakers/*.md` | One file per speaker |
| `partners` | `src/content/partners/*.md` | Strategic/media partners & sponsors |
| `testimonials` | `src/content/testimonials/*.md` | Attendee quotes |
| `blog` | `src/content/blog/*.mdx` | Blog posts (powers `/blog` + RSS) |
| `agenda` | `src/content/agenda/agenda.yaml` | The full schedule, one array |
| `learningTracks` | `src/content/learning-tracks.yaml` | This year's theme tracks |
| `pastEditions` | `src/content/past-editions.yaml` | Past edition summaries |
| `site` | `src/content/site.yaml` | Global config: dates, venue, nav, socials, ticket link |

Every collection has a Zod schema in `src/content.config.ts` — check there for the exact fields
and types before hand-editing.

## Maintenance skills

This repo includes Claude Code skills (`.claude/skills/`) for the recurring content jobs:
`add-speaker`, `add-partner`, `add-testimonial`, `publish-blog-post`, `update-agenda`. In Claude
Code, just ask (e.g. "add a speaker: ...") and the right skill runs — it edits the right file
with the right schema and validates the build for you.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` — also validates all content |
| `npm run preview` | Preview the production build locally |

## Deploying

Configured for Vercel. Connect the repo in the Vercel dashboard — it auto-detects Astro, no
extra config needed.

## Known placeholders to replace before launch

- `src/content/site.yaml`: `ticketUrl` and `social` links are placeholders — replace with real
  ones.
- `src/content/speakers/`, `partners/`, `testimonials/`, `blog/`: sample entries — replace or
  delete.
- `src/assets/placeholders/`: generic SVG stand-ins for photos/logos — replace with real brand
  assets and imagery.
- Colors/fonts in `src/styles/global.css` (`@theme` block) are a placeholder dark palette —
  swap in real Scrum Day Nigeria brand colors when available.
