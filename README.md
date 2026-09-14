# Scrum Day Nigeria

Website for Scrum Day Nigeria — built with Astro so that **content lives separately from the
website build**: organizers (or an agent) edit Markdown/YAML files, and the site rebuilds itself.

Visual design and UX are ported from the [artham-ai-summit](https://github.com/RaikarPravin/artham-ai-summit)
template ([live demo](https://artham-ai.vercel.app/)) — same layout, animations, fonts (Bebas Neue
+ Space Grotesk), and interaction patterns, restyled with the real Scrum Day Nigeria brand and
wired to this repo's content collections instead of hardcoded data.

**Brand colors** (sampled from the logo, defined in `src/styles/global.css`): teal `#0e494f`
(`--brand-teal`, dark "stage" sections), orange `#f15b30` (`--brand-primary`, CTAs/accents), lime
`#d1e27e` (`--brand-lime`, small accent details). The site is predominantly white — dark teal is
reserved for a handful of contrast sections (program cards, partners/video showcase, tickets,
footer), mirroring the reference template's light/dark rhythm.

## Stack

- **[Astro](https://docs.astro.build)** — static site generator, zero client JS by default
- **Content Collections** (`src/content.config.ts`) — schema-validated content in
  `src/content/`; a malformed entry fails `npm run build` with a clear error instead of
  breaking silently
- **Tailwind CSS v4** — only used for the typography plugin (blog post prose); every section
  component carries its own scoped `<style>`, mirroring the reference template
- **Vue** islands (`motion` for entrance animations) for the interactive pieces: hero, floating
  scroll nav, ticket tabs
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
| `programDays` | `src/content/program-days.yaml` | Homepage day-summary cards (mixer / main day) |
| `ticketTiers` | `src/content/ticket-tiers.yaml` | Pricing cards, grouped by `category` |
| `venuePhotos` | `src/content/venue-photos.yaml` | Full-bleed venue carousel photos |
| `learningTracks` | `src/content/learning-tracks.yaml` | This year's focus areas, shown in the homepage Focus Areas section |
| `pastEditions` | `src/content/past-editions.yaml` | Past edition summaries (not yet on a page) |
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

- `src/content/site.yaml`: `ticketUrl`, `social` links, and `highlightsVideoId` (currently a
  dummy Big Buck Bunny video) are placeholders — replace with real ones, or delete
  `highlightsVideoId` to hide that video card.
- `src/content/speakers/`, `partners/`, `testimonials/`, `blog/`: sample entries — replace or
  delete.
- `src/content/program-days.yaml`, `ticket-tiers.yaml` (pricing is `TBD`), `venue-photos.yaml`:
  seeded with placeholder copy/images — fill in with real 2026 details.
- `src/components/Hero.vue`: the photo marquee (`marqueeImages`) hotlinks generic Pexels stock
  photos — swap for real Scrum Day Nigeria event photography.
- `src/assets/placeholders/*`: generic teal/lime placeholder stand-ins for speaker headshots,
  partner logos, and cover images — replace with real photography/logos as they come in. The
  real logo is already wired up (`public/brand-icon.png`, `public/brand-lockup.png`, favicon).
- The footer newsletter signup form has no backend wired up (matching the reference template) —
  connect it to a real email service (Mailchimp, ConvertKit, etc.) before relying on it.
